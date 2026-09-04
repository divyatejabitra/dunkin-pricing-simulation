How to build these in Google Forms

FASTEST PATH - run the script (recommended):

1. Go to https://script.google.com -> New project.
2. Paste in create_forms.gs (delete the placeholder code first).
3. Click Run on createDunkinSurveyForms, approve the permission prompt (it needs access
   to create Forms in your Drive - this is your own script, running under your own
   account, so this is normal and expected).
4. View > Logs shows the edit, live, and response-spreadsheet link for all three forms -
   it builds all 39 questions across Version A/B/C, including the screening skip-logic,
   in one go.
5. Rename each Form if you want a cleaner title, then hand the live links to your team
   using the rotation instructions in surveyor_instructions.md.

If your University Google Workspace account blocks Apps Script execution (some schools
restrict this), fall back to the manual path below.

ALREADY BUILT THE THREE FORMS AND JUST NEED RESPONSE SHEETS + SHARING?

Don't rerun createDunkinSurveyForms - it creates brand new forms every time and you'd end
up with duplicates. Instead:

1. Open create_forms.gs in the Apps Script editor, fill in TEAMMATE_EMAILS near the top
   with your teammates' email addresses (or leave it as [] to just create the response
   sheets for yourself, no sharing).
2. If needed, update the three formId values inside addSheetsAndSharingToExistingForms()
   - they're the part of each edit URL between "/forms/d/" and "/edit".
3. Select addSheetsAndSharingToExistingForms in the function dropdown (next to Run) and
   click Run.
4. View > Logs shows a new response-spreadsheet link per version. Each Form is now shared
   as viewer (so nobody accidentally edits a live survey mid-collection) and its response
   spreadsheet as editor, with everyone in TEAMMATE_EMAILS.

MANUAL PATH (fallback, no scripting):

1. Build Version A (version_A_discount.txt) as a new Google Form, following the
   [Multiple choice] / [Linear scale] / [Paragraph] labels for question type, and the
   ">> Forms setup" notes for the two skip-logic questions (Q1, Q2).
2. In Google Drive, right-click the finished Form -> "Make a copy" -> do this twice, to get
   Version B and Version C, rather than rebuilding from scratch.
3. In each copy, edit ONLY Q10 and Q11 to swap in that version's price (see
   version_B_match.txt / version_C_premium.txt for the exact wording).
4. Rename each Form clearly (e.g. "Campus Coffee Survey - A", "- B", "- C") so surveyors
   grab the right link, and share the rotation instructions from survey_design.md with
   whoever is collecting responses (1st respondent -> A, 2nd -> B, 3rd -> C, repeat).

Either way: Google Forms auto-tracks responses per Form, so when the pooled dataset comes
together, each response's price condition (A/B/C) is already known from which Form it came
from - no need to ask respondents which version they got.
