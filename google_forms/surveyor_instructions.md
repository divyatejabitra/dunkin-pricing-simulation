# Surveyor Instructions — Campus Coffee Pricing Study

Print or save this page. You need **10 completed responses**. Follow the rotation below so
our team's data is split evenly across both order-randomized variants — don't just use
whichever link is easiest to reach.

## Your two links

*Run `create_forms.gs` first (see README.txt) to generate these — the links below are
placeholders until then. Paste in the real `viewform` / edit URLs the script logs once you
run it.*

- Variant 1 (coffee priced first): `PASTE_VARIANT_1_VIEWFORM_LINK_HERE`
- Variant 2 (latte priced first): `PASTE_VARIANT_2_VIEWFORM_LINK_HERE`

(Edit-only links, for whoever owns the Forms and needs to tweak them — not for surveying —
also pasted in from the script's log output once you run it.)

> **If you still have the old A/B/C (discount/match/premium) form links from the earlier
> design**: those are a separate, earlier dataset under the old medium-size/single-price
> method — don't mix their responses with this study's. Stop sending those links out.

## Rotation — which link to use, in order

Track with tally marks as you go. Use the **next** respondent's row — don't skip around.

| # | Variant to use | Done? |
|---|---|---|
| 1 | 1 (coffee first) | [ ] |
| 2 | 2 (latte first) | [ ] |
| 3 | 1 (coffee first) | [ ] |
| 4 | 2 (latte first) | [ ] |
| 5 | 1 (coffee first) | [ ] |
| 6 | 2 (latte first) | [ ] |
| 7 | 1 (coffee first) | [ ] |
| 8 | 2 (latte first) | [ ] |
| 9 | 1 (coffee first) | [ ] |
| 10 | 2 (latte first) | [ ] |

## How to approach someone

1. Ask: *"Do you have 7-8 minutes for a quick class survey about coffee pricing on
   campus? It's anonymous."*
2. Hand them your phone/laptop with **the correct variant's link open** per the table
   above, or read the questions aloud if they prefer.
3. Don't mention that the question order differs between variants, and don't tell them
   anything about what other respondents saw — that would bias their answer.
4. Let them answer every question themselves if possible; only read it aloud if asked.
   The four open-ended price questions per product take people the longest — give them a
   moment to think rather than rushing.
5. Mark the row done, move to the next respondent, open the next variant's link.

## Who to survey

- Any current UofR student, faculty, or staff member who drinks hot coffee or iced lattes
  at least occasionally (the Form screens this automatically — if someone is screened out,
  it doesn't count toward your 10; go find another respondent).
- Spread across people you don't already know well if you can — a mix of undergrads,
  grad students, and (if possible) staff/faculty makes the pooled dataset more useful,
  since the research question is specifically about how price sensitivity differs by
  group (and whether dining-plan holders behave differently).
- Avoid surveying only your own friend group or major — that skews the segmentation data.

## If something goes wrong

- **Respondent gets screened out (not UofR, or doesn't drink coffee/lattes):** thank them,
  don't count it, find someone else for that slot.
- **You lose track of which variant is next:** count how many *completed* responses you
  have so far across both forms (check each Form's response count if unsure) and resume
  the rotation at that total + 1.
- **Someone wants to do it on paper instead of a phone:** print the matching variant's
  question set from `version_1_coffee_first.txt` / `version_2_latte_first.txt` and enter
  their answers into the correct Form afterward yourself.
- **Someone types something nonsensical into a price question (e.g. "idk" where a dollar
  amount is expected):** the Form's numeric validation should catch this and ask them to
  re-enter — if it doesn't, note it and flag that response for exclusion during cleanup.

## Deadline

All 10 responses per teammate are due so the team can aggregate and submit to Professor
Nelson by **Monday, October 19**.
