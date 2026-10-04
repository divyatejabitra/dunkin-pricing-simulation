/**
 * Creates both Campus Coffee Pricing Study forms (order-randomized variants)
 * in your Google Drive - Van Westendorp PSM + Gabor-Granger ladder for both
 * large hot coffee and large iced latte, screener, behavior, purchase
 * drivers, attention check, and demographics. Matches survey_design.md.
 *
 * HOW TO RUN:
 *   1. Go to https://script.google.com -> New project.
 *   2. Delete the placeholder code and paste this whole file in.
 *   3. Click "Run" (the play button) on createDunkinSurveyForms.
 *   4. The first run will ask you to authorize the script - this is normal
 *      (it needs permission to create Forms in your Drive). Approve it.
 *   5. Once it finishes, go to View > Logs (or Ctrl+Enter) to see the edit,
 *      live, and response-spreadsheet links for both forms.
 *
 * If your University Google Workspace account blocks Apps Script execution,
 * use the manual per-variant text files (version_1_coffee_first.txt,
 * version_2_latte_first.txt) and README.txt in this same folder instead -
 * same questions, built by hand.
 *
 * ALREADY HAVE FORMS BUILT? Don't rerun this - it creates brand new forms
 * each time. Instead use addSheetsAndSharingToExistingForms() below, which
 * links response spreadsheets and shares them on forms you already made.
 *
 * NOTE: this replaces the earlier 3-version (A/B/C discount/match/premium)
 * design. If you already ran the old script and have those forms live with
 * real responses in them, don't delete them - just stop sending out their
 * links once the new variants are ready, and keep both datasets separate.
 */

// Fill in your teammates' emails before running either function. Leave the
// array empty ([]) to skip sharing and just create the linked response
// spreadsheets for yourself.
var TEAMMATE_EMAILS = [];

var FORM_DESCRIPTION =
  "This short survey is part of a University of Rochester Simon Business School " +
  "pricing study on campus coffee options. It takes about 7-8 minutes. Your " +
  "responses are anonymous and used only in aggregate for academic purposes.";

// Gabor-Granger ladder points, grounded in verified on-campus competitor
// prices (data/macro_competitors.csv): Starbucks $3.25/$6.49, Peet's
// $3.50/$6.00, Connections Cafe $4.00/$8.00.
var COFFEE_LADDER = ["3.00", "3.25", "3.50", "3.75", "4.00"];
var LATTE_LADDER = ["5.50", "6.00", "6.50", "7.00", "7.50", "8.00"];

var LIKELIHOOD_SCALE = ["Very unlikely", "Unlikely", "Neutral", "Likely", "Very likely"];
var IMPORTANCE_SCALE = [
  "Not at all important",
  "Slightly important",
  "Moderately important",
  "Very important",
  "Extremely important",
];

/**
 * Creates the destination Spreadsheet for a form's responses, and shares
 * access with TEAMMATE_EMAILS: the Form itself as viewer (so nobody
 * accidentally edits a live survey mid-collection), and the response
 * Spreadsheet as editor (so the team can jointly filter/clean/export data).
 * Returns the spreadsheet's URL.
 */
function addResponseSheetAndShare(form, label) {
  var sheet = SpreadsheetApp.create(label + " Responses");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  TEAMMATE_EMAILS.forEach(function (email) {
    DriveApp.getFileById(form.getId()).addViewer(email);
    sheet.addEditor(email);
  });

  return sheet.getUrl();
}

function dollarValidation() {
  return FormApp.createTextValidation()
    .setHelpText("Enter a dollar amount between 0 and 15, e.g. 3.50")
    .requireNumberBetween(0, 15)
    .build();
}

/**
 * Adds one product's full Price Sensitivity section (Van Westendorp's 4
 * open-ended price questions + one Gabor-Granger purchase-likelihood grid)
 * to the form. productName e.g. "large hot coffee"; ladderPoints e.g.
 * COFFEE_LADDER.
 */
function addPricingSection(form, productName, ladderPoints) {
  form.addPageBreakItem().setTitle("Pricing - " + productName);

  form
    .addTextItem()
    .setTitle(
      "At what price would a " + productName + " from an on-campus Dunkin' be so cheap " +
        "you'd start to question its quality?"
    )
    .setValidation(dollarValidation())
    .setRequired(true);

  form
    .addTextItem()
    .setTitle(
      "At what price would a " + productName + " from an on-campus Dunkin' be a bargain " +
        "- a great buy for the money?"
    )
    .setValidation(dollarValidation())
    .setRequired(true);

  form
    .addTextItem()
    .setTitle(
      "At what price would a " + productName + " from an on-campus Dunkin' start to seem " +
        "expensive, though you'd still consider buying it?"
    )
    .setValidation(dollarValidation())
    .setRequired(true);

  form
    .addTextItem()
    .setTitle(
      "At what price would a " + productName + " from an on-campus Dunkin' be so expensive " +
        "you would not consider buying it?"
    )
    .setValidation(dollarValidation())
    .setRequired(true);

  form
    .addGridItem()
    .setTitle(
      "At each price below, how likely would you be to buy a " + productName +
        " from an on-campus Dunkin' instead of your usual option?"
    )
    .setRows(ladderPoints.map(function (p) { return "$" + p; }))
    .setColumns(LIKELIHOOD_SCALE)
    .setRequired(true);
}

function createDunkinSurveyForms() {
  var variants = [
    { label: "Variant 1 (Coffee first)", coffeeFirst: true },
    { label: "Variant 2 (Latte first)", coffeeFirst: false },
  ];

  var summary = [];

  variants.forEach(function (v) {
    var form = FormApp.create("Campus Coffee Pricing Study - " + v.label);
    form.setDescription(FORM_DESCRIPTION);
    form.setConfirmationMessage("Thanks for your time!");

    // --- Screener: Q1 ---
    var q1 = form
      .addMultipleChoiceItem()
      .setTitle(
        "Are you currently a student, faculty, or staff member at the University of " +
          "Rochester's River Campus?"
      )
      .setRequired(true);

    // --- Screener: Q2 ---
    var page2 = form.addPageBreakItem().setTitle("One more screening question");
    var q2 = form
      .addMultipleChoiceItem()
      .setTitle("Do you drink hot coffee or iced lattes at least occasionally (roughly once a month or more)?")
      .setRequired(true);

    // --- Disqualify / end early ---
    var endPage = form
      .addPageBreakItem()
      .setTitle("Thank you for your interest!")
      .setHelpText("Based on your answers, you don't qualify for this particular survey. Have a great day!")
      .setGoToPage(FormApp.PageNavigationType.SUBMIT);

    // --- Coffee behavior ---
    var mainPage = form.addPageBreakItem().setTitle("Your coffee habits");
    form
      .addMultipleChoiceItem()
      .setTitle("In a typical week, how many cups of coffee or lattes (hot or iced) do you buy on or near campus?")
      .setChoiceValues(["0", "1-2", "3-5", "6+"])
      .setRequired(true);
    form
      .addMultipleChoiceItem()
      .setTitle("Where do you currently buy coffee or lattes most often?")
      .setChoiceValues([
        "Starbucks (Wilson Commons)",
        "Peet's Coffee (Wegmans Hall)",
        "Connections Cafe",
        "An off-campus coffee shop",
        "I make my own",
      ])
      .showOtherOption(true)
      .setRequired(true);
    form
      .addTextItem()
      .setTitle("What do you typically spend on a large hot coffee, when you buy one?")
      .setHelpText("Enter a dollar amount (e.g. 3.25), or type N/A if you don't buy this.")
      .setRequired(true);
    form
      .addTextItem()
      .setTitle("What do you typically spend on a large iced latte, when you buy one?")
      .setHelpText("Enter a dollar amount (e.g. 6.00), or type N/A if you don't buy this.")
      .setRequired(true);
    form
      .addMultipleChoiceItem()
      .setTitle("Which do you buy more often - hot coffee or iced lattes?")
      .setChoiceValues(["Mostly hot coffee", "Mostly iced lattes", "About equally", "Neither"])
      .setRequired(true);

    // --- Price sensitivity sections, order depends on variant ---
    if (v.coffeeFirst) {
      addPricingSection(form, "large hot coffee", COFFEE_LADDER);
      addPricingSection(form, "large iced latte", LATTE_LADDER);
    } else {
      addPricingSection(form, "large iced latte", LATTE_LADDER);
      addPricingSection(form, "large hot coffee", COFFEE_LADDER);
    }

    // --- Purchase drivers ---
    form.addPageBreakItem().setTitle("What matters to you");
    form
      .addGridItem()
      .setTitle("How important is each of the following when you decide where to buy coffee on campus?")
      .setRows(["Price", "Taste", "Convenience (location & speed)", "Brand reputation", "Accepts my dining dollars or meal plan"])
      .setColumns(IMPORTANCE_SCALE)
      .setRequired(true);

    // --- Payment-parity scenario: added after the 9/24 presentation confirmed (per UR
    // Dining's own FAQ) that Starbucks, Peet's, and Connections Cafe all already accept
    // Dining Dollars, making this a concrete structural risk rather than a hypothetical.
    form
      .addScaleItem()
      .setTitle(
        "University Dining Dollars currently work at Starbucks, Peet's, and Connections " +
          "Cafe on campus. If an on-campus Dunkin' did NOT accept Dining Dollars or " +
          "meal-plan swipes (cash/card only), how would that affect your likelihood of " +
          "buying there?"
      )
      .setBounds(1, 5)
      .setLabels("Much less likely", "No change")
      .setRequired(true);

    // --- Attention check ---
    form.addPageBreakItem().setTitle("Almost done");
    form
      .addMultipleChoiceItem()
      .setTitle("To show you're reading carefully, please select \"Somewhat agree\" for this question.")
      .setChoiceValues(["Strongly disagree", "Disagree", "Neither agree nor disagree", "Somewhat agree", "Strongly agree"])
      .setRequired(true);

    // --- Demographics (last) ---
    form.addPageBreakItem().setTitle("A few last questions about you");
    form
      .addMultipleChoiceItem()
      .setTitle("What is your age?")
      .setChoiceValues(["Under 18", "18-20", "21-23", "24-26", "27+"])
      .setRequired(true);
    form
      .addMultipleChoiceItem()
      .setTitle("What is your status at the University?")
      .setChoiceValues(["Undergraduate student", "Graduate student", "Staff", "Faculty"])
      .setRequired(true);
    form
      .addMultipleChoiceItem()
      .setTitle("Do you have a University dining plan or dining dollars?")
      .setChoiceValues(["Yes", "No"])
      .setRequired(true);
    form
      .addMultipleChoiceItem()
      .setTitle("Which range best describes your typical monthly discretionary (non-essential) spending?")
      .setChoiceValues(["$0-$50", "$51-$100", "$101-$200", "$201+", "Prefer not to say"])
      .setRequired(true);
    form
      .addMultipleChoiceItem()
      .setTitle("What is your gender?")
      .setChoiceValues(["Man", "Woman", "Non-binary", "Prefer not to say"])
      .showOtherOption(true)
      .setRequired(false);

    // --- Wire up the screening branching now that all target pages exist ---
    q1.setChoices([q1.createChoice("Yes", page2), q1.createChoice("No", endPage)]);
    q2.setChoices([q2.createChoice("Yes", mainPage), q2.createChoice("No", endPage)]);

    var sheetUrl = addResponseSheetAndShare(form, "Campus Coffee Pricing - " + v.label);

    summary.push(
      v.label + ": edit " + form.getEditUrl() + " | live " + form.getPublishedUrl() + " | responses " + sheetUrl
    );
  });

  Logger.log(summary.join("\n"));
}

/**
 * Run this once on forms you ALREADY built (via createDunkinSurveyForms or
 * by hand) to add a linked response spreadsheet and share it with
 * TEAMMATE_EMAILS, without creating any duplicate forms.
 *
 * Fill in the two form IDs below - it's the part of the edit URL between
 * "/forms/d/" and "/edit", e.g. for
 * https://docs.google.com/forms/d/11LmUbNrMnJIrSyFnoVHOoWzK3jmOI2aOS_x2B1E3at4/edit
 * the ID is 11LmUbNrMnJIrSyFnoVHOoWzK3jmOI2aOS_x2B1E3at4
 */
function addSheetsAndSharingToExistingForms() {
  var existingForms = [
    { label: "Variant 1 (Coffee first)", formId: "PASTE_VARIANT_1_FORM_ID_HERE" },
    { label: "Variant 2 (Latte first)", formId: "PASTE_VARIANT_2_FORM_ID_HERE" },
  ];

  var summary = [];

  existingForms.forEach(function (f) {
    var form = FormApp.openById(f.formId);
    var sheetUrl = addResponseSheetAndShare(form, "Campus Coffee Pricing - " + f.label);
    summary.push(f.label + ": responses " + sheetUrl);
  });

  Logger.log(summary.join("\n"));
}
