/**
 * Creates all three Campus Coffee Preferences Survey forms (A/B/C) in your
 * Google Drive, including the screening skip-logic, in one run.
 *
 * HOW TO RUN:
 *   1. Go to https://script.google.com -> New project.
 *   2. Delete the placeholder code and paste this whole file in.
 *   3. Click "Run" (the play button) on createDunkinSurveyForms.
 *   4. The first run will ask you to authorize the script - this is normal
 *      (it needs permission to create Forms in your Drive). Approve it.
 *   5. Once it finishes, go to View > Logs (or Ctrl+Enter) to see the edit,
 *      live, and response-spreadsheet links for all three forms.
 *
 * If your University Google Workspace account blocks Apps Script execution,
 * use the manual per-version text files (version_A_discount.txt etc.) and
 * README.txt in this same folder instead - same questions, built by hand.
 *
 * ALREADY HAVE FORMS BUILT? Don't rerun this - it creates brand new forms
 * each time. Instead use addSheetsAndSharingToExistingForms() below, which
 * links response spreadsheets and shares them on forms you already made.
 */

// Fill in your teammates' emails before running either function. Leave the
// array empty ([]) to skip sharing and just create the linked response
// spreadsheets for yourself.
var TEAMMATE_EMAILS = [];

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

function createDunkinSurveyForms() {
  var versions = [
    { label: "Version A", coffeePrice: "2.75", lattePrice: "5.00" },
    { label: "Version B", coffeePrice: "3.00", lattePrice: "5.25" },
    { label: "Version C", coffeePrice: "3.25", lattePrice: "5.50" },
  ];

  var summary = [];

  versions.forEach(function (v) {
    var form = FormApp.create("Campus Coffee Preferences Survey - " + v.label);
    form.setDescription(
      "This short survey is part of a University of Rochester Simon Business School " +
        "class project. Your responses are anonymous and will only be used in " +
        "aggregate for academic purposes. It takes about 2 minutes."
    );
    form.setConfirmationMessage("Thanks for your time!");

    // --- Page 1: screening Q1 ---
    var q1 = form
      .addMultipleChoiceItem()
      .setTitle("Are you currently a student, faculty, or staff member at the University of Rochester?")
      .setRequired(true);

    // --- Page 2: screening Q2 ---
    var page2 = form.addPageBreakItem().setTitle("One more screening question");
    var q2 = form
      .addMultipleChoiceItem()
      .setTitle("Do you drink hot coffee or lattes at least occasionally?")
      .setRequired(true);

    // --- Page 3: disqualify / end early ---
    var endPage = form
      .addPageBreakItem()
      .setTitle("Thank you for your interest!")
      .setHelpText("Based on your answers, you don't qualify for this particular survey. Have a great day!")
      .setGoToPage(FormApp.PageNavigationType.SUBMIT);

    // --- Page 4: About you ---
    var mainPage = form.addPageBreakItem().setTitle("About you");
    form
      .addMultipleChoiceItem()
      .setTitle("What is your status?")
      .setChoiceValues(["Undergraduate student", "Graduate student", "Staff", "Faculty"])
      .setRequired(true);
    form
      .addMultipleChoiceItem()
      .setTitle("Do you live on campus or off campus?")
      .setChoiceValues(["On campus", "Off campus"])
      .setRequired(true);
    form
      .addMultipleChoiceItem()
      .setTitle("Do you have a University dining plan or dining dollars?")
      .setChoiceValues(["Yes", "No"])
      .setRequired(true);
    form
      .addMultipleChoiceItem()
      .setTitle("In a typical week, how often do you buy coffee or a latte on or near campus?")
      .setChoiceValues(["0 times", "1-2 times", "3-5 times", "6+ times"])
      .setRequired(true);
    form
      .addMultipleChoiceItem()
      .setTitle("Which of the following do you currently buy coffee from most often?")
      .setChoiceValues([
        "Starbucks - Wilson Commons",
        "Peet's Coffee - Wegmans Hall",
        "Brew",
        "An off-campus coffee shop",
        "I make my own",
      ])
      .showOtherOption(true)
      .setRequired(true);

    // --- Page 5: Dunkin' brand awareness ---
    form.addPageBreakItem().setTitle("Dunkin' brand awareness");
    form
      .addScaleItem()
      .setTitle("How familiar are you with Dunkin' as a brand?")
      .setBounds(1, 5)
      .setLabels("Not at all familiar", "Extremely familiar")
      .setRequired(true);
    form
      .addScaleItem()
      .setTitle("If Dunkin' opened a location on River Campus, how interested would you be in trying it?")
      .setBounds(1, 5)
      .setLabels("Not at all interested", "Extremely interested")
      .setRequired(true);

    // --- Page 6: pricing (version-specific) ---
    form.addPageBreakItem().setTitle("Pricing");
    form
      .addScaleItem()
      .setTitle(
        "If Dunkin' opened on campus and sold a medium hot coffee for $" +
          v.coffeePrice +
          ", how likely would you be to purchase it instead of your usual coffee?"
      )
      .setBounds(1, 5)
      .setLabels("Very unlikely", "Very likely")
      .setRequired(true);
    form
      .addScaleItem()
      .setTitle(
        "If Dunkin' opened on campus and sold a medium hot latte for $" +
          v.lattePrice +
          ", how likely would you be to purchase it instead of your usual latte?"
      )
      .setBounds(1, 5)
      .setLabels("Very unlikely", "Very likely")
      .setRequired(true);

    // --- Page 7: payment method ---
    form.addPageBreakItem().setTitle("Payment method");
    form
      .addScaleItem()
      .setTitle(
        "If Dunkin' did NOT accept University dining dollars or meal-plan swipes (cash/card only), " +
          "how would that affect your likelihood of buying there?"
      )
      .setBounds(1, 5)
      .setLabels("Much less likely", "No change")
      .setRequired(true);

    // --- Page 8: open-ended (optional) ---
    form.addPageBreakItem().setTitle("Last question");
    form
      .addParagraphTextItem()
      .setTitle("What, if anything, would make you choose Dunkin' over Starbucks, Peet's, or Brew on campus?")
      .setRequired(false);

    // --- Wire up the screening branching now that all target pages exist ---
    q1.setChoices([q1.createChoice("Yes", page2), q1.createChoice("No", endPage)]);
    q2.setChoices([q2.createChoice("Yes", mainPage), q2.createChoice("No", endPage)]);

    var sheetUrl = addResponseSheetAndShare(form, "Campus Coffee Survey - " + v.label);

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
 * Fill in the three form IDs below - it's the part of the edit URL between
 * "/forms/d/" and "/edit", e.g. for
 * https://docs.google.com/forms/d/11LmUbNrMnJIrSyFnoVHOoWzK3jmOI2aOS_x2B1E3at4/edit
 * the ID is 11LmUbNrMnJIrSyFnoVHOoWzK3jmOI2aOS_x2B1E3at4
 */
function addSheetsAndSharingToExistingForms() {
  var existingForms = [
    { label: "Version A", formId: "11LmUbNrMnJIrSyFnoVHOoWzK3jmOI2aOS_x2B1E3at4" },
    { label: "Version B", formId: "1H78KLGZ8TuTdYPrVVnxe44Ky52WM78wImiMJSuilvV4" },
    { label: "Version C", formId: "1iH-VpbkPrQNUSzA2C5qmnsih52g9Hy4a36RsHYKkBSE" },
  ];

  var summary = [];

  existingForms.forEach(function (f) {
    var form = FormApp.openById(f.formId);
    var sheetUrl = addResponseSheetAndShare(form, "Campus Coffee Survey - " + f.label);
    summary.push(f.label + ": responses " + sheetUrl);
  });

  Logger.log(summary.join("\n"));
}
