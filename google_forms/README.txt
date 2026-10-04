How to build these in Google Forms

FASTEST PATH - run the script (recommended):

1. Go to https://script.google.com -> New project.
2. Paste in create_forms.gs (delete the placeholder code first).
3. Click Run on createDunkinSurveyForms, approve the permission prompt (it needs access
   to create Forms in your Drive - this is your own script, running under your own
   account, so this is normal and expected).
4. View > Logs shows the edit, live, and response-spreadsheet link for both forms -
   it builds all 24 questions across Variant 1 (coffee priced first) and Variant 2
   (latte priced first), including the screening skip-logic and the Van Westendorp +
   Gabor-Granger pricing sections, in one go.
5. Rename each Form if you want a cleaner title, then hand the live links to your team
   using the rotation instructions in surveyor_instructions.md.

If your University Google Workspace account blocks Apps Script execution (some schools
restrict this), fall back to the manual path below.

ALREADY BUILT THE TWO FORMS AND JUST NEED RESPONSE SHEETS + SHARING?

Don't rerun createDunkinSurveyForms - it creates brand new forms every time and you'd end
up with duplicates. Instead:

1. Open create_forms.gs in the Apps Script editor, fill in TEAMMATE_EMAILS near the top
   with your teammates' email addresses (or leave it as [] to just create the response
   sheets for yourself, no sharing).
2. Update the two formId placeholders inside addSheetsAndSharingToExistingForms()
   - they're the part of each edit URL between "/forms/d/" and "/edit".
3. Select addSheetsAndSharingToExistingForms in the function dropdown (next to Run) and
   click Run.
4. View > Logs shows a new response-spreadsheet link per variant. Each Form is now shared
   as viewer (so nobody accidentally edits a live survey mid-collection) and its response
   spreadsheet as editor, with everyone in TEAMMATE_EMAILS.

MANUAL PATH (fallback, no scripting):

1. Build Variant 1 (version_1_coffee_first.txt) as a new Google Form, following the
   [Multiple choice] / [Short answer] / [Multiple choice grid] labels for question type,
   the numeric-validation notes on the 8 price questions (set each to Response validation
   > Number > Between, 0 and 15), and the ">> Forms setup" notes for the two skip-logic
   questions (Q1, Q2).
2. Build Variant 2 (version_2_latte_first.txt) the same way - it's NOT a copy-with-one-edit
   like the old 3-version design was; Sections 3 and 4 are fully swapped (latte priced
   before coffee), so build it as its own form rather than duplicating Variant 1.
3. Rename each Form clearly (e.g. "Campus Coffee Pricing - Variant 1", "- Variant 2") so
   surveyors grab the right link, and share the rotation instructions from
   surveyor_instructions.md with whoever is collecting responses (odd-numbered
   respondent -> Variant 1, even-numbered -> Variant 2).

Either way: Google Forms auto-tracks responses per Form, so when the pooled dataset comes
together, each response's price-order condition (coffee-first vs. latte-first) is already
known from which Form it came from - no need to ask respondents which variant they got.

NOTE ON THE OLD 3-VERSION (A/B/C) DESIGN: if you already ran the original script and have
those forms live with real responses in them, don't delete them - that's a separate dataset
under the old medium-size/single-price-point method. Just stop sending out their links once
these new variants are ready.
