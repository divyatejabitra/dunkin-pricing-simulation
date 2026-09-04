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
 *   5. Once it finishes, go to View > Logs (or Ctrl+Enter) to see the edit
 *      and live links for all three forms.
 *
 * If your University Google Workspace account blocks Apps Script execution,
 * use the manual per-version text files (version_A_discount.txt etc.) and
 * README.txt in this same folder instead - same questions, built by hand.
 */
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

    summary.push(v.label + ": edit " + form.getEditUrl() + " | live " + form.getPublishedUrl());
  });

  Logger.log(summary.join("\n"));
}
