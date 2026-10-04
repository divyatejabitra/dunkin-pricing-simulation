# Dunkin' Campus Coffee Pricing Study — Survey Design (10/8 Review)

Proposed questionnaire for the MKT465 Dunkin' capstone's 10/8 survey-design review (15 min,
8 slides, staggered team meetings with professors). Supersedes the earlier single-price-point
draft — see `git show 15cda3b:survey_design.md` to recover that version if needed.

## Assumptions made instead of asking (per instructions — flag, don't block)

| # | Assumption | Why |
|---|---|---|
| 1 | **Product sizes = large hot coffee + large iced latte**, not medium/hot-latte | Matches the already-verified on-campus competitive prices (Starbucks, Peet's, Connections Café — all gathered at large size), and Connections Café *only sells large cups*, so large is the only size comparable across all three on-campus incumbents. |
| 2 | **Target n ≈ 90–120**, in-person intercept via Google Forms | Reuses this project's existing field method (10 respondents/surveyor) rather than switching to Qualtrics/online panel; scales with however many teammates are surveying — adjust once you know team size. |
| 3 | **Gabor-Granger ladder price points are grounded in real, already-verified competitor prices** (not generic round numbers) | Starbucks $3.25/$6.49, Peet's $3.50/$6.00, Connections Café $4.00/$8.00 (`data/macro_competitors.csv`) — ladder brackets this real range instead of guessing. |
| 4 | **Randomization = 2 form variants** (Coffee-first / Latte-first), not live per-respondent randomization | Google Forms has no native random-order trigger; this reuses the same no-scripting rotation trick already proven for the old A/B/C design (just 2 buckets instead of 3). |
| 5 | **Business decision framed as**: what large-hot-coffee and large-iced-latte price should Dunkin' launch at on River Campus, informed by the full acceptable range (PSM) and demand curve (Gabor-Granger) rather than a single pre-chosen test price | Builds on, rather than replaces, the original client brief ("test a 25-cent decrease/increase vs. off-campus") — PSM/Gabor-Granger subsumes that narrower question with a fuller answer. |

## Methodology

**Van Westendorp Price Sensitivity Meter** (4 questions per product: too cheap / bargain /
getting expensive / too expensive) finds the *range* of acceptable prices without presuming
the right answer is one of a few pre-chosen points — it directly answers "what should we
charge," which fits a launch-pricing decision better than testing isolated guesses.
*Limitation*: assumes respondents can meaningfully reason about hypothetical prices in
isolation, divorced from the actual competitive menu in front of them.

**Gabor-Granger purchase-likelihood ladder** (one matrix question per product, 5–6 specific
price points) directly estimates a demand curve and revenue-maximizing price — it
complements PSM's range with one concrete, testable number. *Limitation*: sensitive to
which price points are chosen and their order (anchoring), and stated purchase intent
doesn't always equal real behavior.

Together: PSM tells you the *viable band*; Gabor-Granger tells you *where in that band*
demand peaks. Randomizing whether Coffee or Latte is priced first (Sections 4/5 swap order
across the two form variants) keeps the first-asked product from anchoring the second.

## Price ladder values (grounded in verified on-campus data)

| Product | Ladder points | Anchors |
|---|---|---|
| Large hot coffee | $3.00 · $3.25 · $3.50 · $3.75 · $4.00 | $3.25 = Starbucks (verified) · $3.50 = Peet's (verified) · $4.00 = Connections Café (verified) |
| Large iced latte | $5.50 · $6.00 · $6.50 · $7.00 · $7.50 · $8.00 | $6.00 = Peet's (verified) · $6.49≈$6.50 = Starbucks (verified) · $8.00 = Connections Café (verified) |

## Full question set

### Section 1 — Intro & consent
*Not a scored question — Forms intro page.*
"This short survey is part of a University of Rochester Simon Business School pricing study
on campus coffee options. It takes about 7–8 minutes. Your responses are anonymous and used
only in aggregate for academic purposes. By continuing, you agree to participate."

### Section 2 — Screener

| Q# | Exact wording | Response format | Skip/display logic | Why it's asked | How analyzed |
|---|---|---|---|---|---|
| Q1 | Are you currently a student, faculty, or staff member at the University of Rochester's River Campus? | Multiple choice: Yes / No | **No → terminate** (jump to thank-you page) | Confirms the respondent is in-population | Filter; excluded respondents not counted in n |
| Q2 | Do you drink hot coffee or iced lattes at least occasionally (roughly once a month or more)? | Multiple choice: Yes / No | **No → terminate** | Confirms respondent is a category buyer — non-buyers can't meaningfully answer price questions | Filter |

### Section 3 — Coffee behavior

| Q# | Exact wording | Response format | Skip/display logic | Why it's asked | How analyzed |
|---|---|---|---|---|---|
| Q3 | In a typical week, how many cups of coffee or lattes (hot or iced) do you buy on or near campus? | Multiple choice: 0 / 1–2 / 3–5 / 6+ | None | Category usage rate — heavier buyers may be less price-sensitive | Segment variable for cross-tabs |
| Q4 | Where do you currently buy coffee or lattes most often? | Multiple choice: Starbucks (Wilson Commons) / Peet's Coffee (Wegmans Hall) / Connections Café / An off-campus coffee shop / I make my own / Other: ___ | None | Identifies current competitor loyalty — the thing Dunkin' has to win share from | Segment variable; cross-tab against purchase intent |
| Q5 | What do you typically spend on a large hot coffee, when you buy one? | Open numeric, $ (validate $0–$15); option "N/A — I don't buy this" | None | Anchors respondent's real spending baseline before hypothetical pricing questions | Compares stated baseline to PSM/Gabor-Granger answers for internal consistency |
| Q6 | What do you typically spend on a large iced latte, when you buy one? | Open numeric, $ (validate $0–$15); option "N/A — I don't buy this" | None | Same, for latte | Same, for latte |
| Q7 | Which do you buy more often — hot coffee or iced lattes? | Multiple choice: Mostly hot coffee / Mostly iced lattes / About equally / Neither | None | Lets the analysis weight each product's findings by actual relevance to the respondent | Segment variable |

### Section 4 — Price sensitivity: Product A (order randomized — see note)

*Form variant 1 shows Hot Coffee here; Form variant 2 shows Iced Latte here. Section 5 is
always whichever product Section 4 didn't cover.*

| Q# | Exact wording | Response format | Skip/display logic | Why it's asked | How analyzed |
|---|---|---|---|---|---|
| Q8 | At what price would a large hot coffee from an on-campus Dunkin' be so cheap you'd start to question its quality? | Open numeric, $ (validate $0–$15) | None | Van Westendorp "too cheap" threshold | PSM curve: too-cheap line |
| Q9 | At what price would it be a bargain — a great buy for the money? | Open numeric, $ | None | Van Westendorp "bargain" threshold | PSM curve: bargain line |
| Q10 | At what price would it start to seem expensive, though you'd still consider buying it? | Open numeric, $ | None | Van Westendorp "getting expensive" threshold | PSM curve: expensive line |
| Q11 | At what price would it be so expensive you would not consider buying it? | Open numeric, $ | None | Van Westendorp "too expensive" threshold | PSM curve: too-expensive line |
| Q12 | At each price below, how likely would you be to buy a large hot coffee from an on-campus Dunkin' instead of your usual option? | Matrix/grid: rows = $3.00 / $3.25 / $3.50 / $3.75 / $4.00; columns = 5-pt scale (Very unlikely … Very likely) | None | Gabor-Granger demand ladder | Purchase-likelihood-by-price curve → demand/revenue estimate |

### Section 5 — Price sensitivity: Product B (whichever product Section 4 didn't cover)

| Q# | Exact wording | Response format | Skip/display logic | Why it's asked | How analyzed |
|---|---|---|---|---|---|
| Q13 | At what price would a large iced latte from an on-campus Dunkin' be so cheap you'd start to question its quality? | Open numeric, $ (validate $0–$15) | None | PSM too-cheap | PSM curve |
| Q14 | At what price would it be a bargain — a great buy for the money? | Open numeric, $ | None | PSM bargain | PSM curve |
| Q15 | At what price would it start to seem expensive, though you'd still consider buying it? | Open numeric, $ | None | PSM expensive | PSM curve |
| Q16 | At what price would it be so expensive you would not consider buying it? | Open numeric, $ | None | PSM too expensive | PSM curve |
| Q17 | At each price below, how likely would you be to buy a large iced latte from an on-campus Dunkin' instead of your usual option? | Matrix/grid: rows = $5.50 / $6.00 / $6.50 / $7.00 / $7.50 / $8.00; columns = 5-pt scale (Very unlikely … Very likely) | None | Gabor-Granger demand ladder | Purchase-likelihood-by-price curve |

### Section 6 — Purchase drivers & payment scenario

| Q# | Exact wording | Response format | Skip/display logic | Why it's asked | How analyzed |
|---|---|---|---|---|---|
| Q18 | How important is each of the following when you decide where to buy coffee on campus? — Price / Taste / Convenience (location & speed) / Brand reputation / Accepts my dining dollars or meal plan | Matrix/grid: 5 rows above; columns = 5-pt scale (Not at all important … Extremely important) | None | Tests whether price is actually the deciding factor, or whether payment method / convenience dominates | Mean importance per driver; cross-tab "payment method" importance against dining-plan status (Q23) |
| Q19 | University Dining Dollars currently work at Starbucks, Peet's, and Connections Café on campus. If an on-campus Dunkin' did **not** accept Dining Dollars or meal-plan swipes (cash/card only), how would that affect your likelihood of buying there? | 5-pt scale: Much less likely … No change | None | Elevated from a generic importance rating to a direct scenario test — the 9/24 competitive-landscape presentation confirmed (per UR Dining's own FAQ) that *all three* on-campus incumbents already accept Dining Dollars, making payment parity a concrete structural risk for Dunkin' rather than a hypothetical one | Distribution of responses; cross-tab against Q23 dining-plan status (non-dining-plan students should show less drop-off, isolating the real at-risk segment) |

### Section 7 — Attention check

| Q# | Exact wording | Response format | Skip/display logic | Why it's asked | How analyzed |
|---|---|---|---|---|---|
| Q20 | To show you're reading carefully, please select "Somewhat agree" for this question. | Multiple choice: Strongly disagree / Disagree / Neither agree nor disagree / Somewhat agree / Strongly agree | None | Data-quality check | Responses failing this are flagged/excluded before analysis |

### Section 8 — Demographics (last)

| Q# | Exact wording | Response format | Skip/display logic | Why it's asked | How analyzed |
|---|---|---|---|---|---|
| Q21 | What is your age? | Multiple choice: Under 18 / 18–20 / 21–23 / 24–26 / 27+ | None | Segment variable; brackets rather than open numeric to reduce sensitivity and non-response | Cross-tab by age band |
| Q22 | What is your status at the University? | Multiple choice: Undergraduate student / Graduate student / Staff / Faculty | None | Core segment — prior project work shows meal-plan/status is a decisive variable | Cross-tab |
| Q23 | Do you have a University dining plan or dining dollars? | Multiple choice: Yes / No | None | Tests the payment-friction risk directly — whether Dunkin' must accept dining dollars to compete | Cross-tab against Q12/Q17 purchase likelihood, Q18 payment-method importance, and Q19 payment-scenario drop-off |
| Q24 | Which range best describes your typical monthly discretionary (non-essential) spending? | Multiple choice: $0–$50 / $51–$100 / $101–$200 / $201+ / Prefer not to say | None | Budget proxy without asking income directly | Cross-tab; segments price sensitivity by spending power |
| Q25 | What is your gender? (optional) | Multiple choice: Man / Woman / Non-binary / Prefer to self-describe: ___ / Prefer not to say | None, optional | Standard demographic, kept optional and non-presumptive | Cross-tab if sample size allows |

**25 questions total** (+ 1 unscored intro/consent screen), open-numeric price questions
capped at 8, estimated completion time 7–9 minutes — at the top of the "under 8 min /
~20–25 questions" target; Q19 was added deliberately after the 9/24 presentation surfaced
the confirmed Dining Dollars finding below, and is worth the extra ~30 seconds.

## Build note: implementing the order randomization

Google Forms has no native per-respondent random-order trigger. Reuse the project's
existing `create_forms.gs` pattern (which already builds multiple near-identical form
variants from one script): build **2 variants** instead of 3 —

- **Variant 1**: Section 4 = Hot Coffee (Q8–Q12), Section 5 = Iced Latte (Q13–Q17)
- **Variant 2**: Section 4 = Iced Latte, Section 5 = Hot Coffee

— and rotate surveyors' respondents between the two (odd-numbered respondent → Variant 1,
even-numbered → Variant 2), the same no-scripting trick `surveyor_instructions.md` already
uses for the old 3-version design. Everything else (screener, behavior, drivers, attention
check, demographics) is identical across both variants.

## Analysis plan

Once responses are pooled, the four Van Westendorp price points per product (Q8–Q11 for hot
coffee, Q13–Q16 for iced latte) get plotted as cumulative distributions; the too-cheap and
too-expensive curves' intersection marks the **point of marginal cheapness**, the
bargain/expensive curves' intersection marks the **point of marginal expensiveness**, and
the region between the too-cheap/expensive crossover and the bargain/getting-expensive
crossover is the **acceptable price range** — the optimal price point sits where that range
overlaps the Gabor-Granger results. The Gabor-Granger matrix (Q12, Q17) converts stated
purchase likelihood at each tested price into an estimated demand curve (treating "likely"
+ "very likely" as a proxy purchase rate), which multiplied by price yields an estimated
revenue curve and its revenue-maximizing point. Both analyses then get cross-tabbed by the
segment variables (Q3 usage frequency, Q4 current vendor, Q22 status, Q23 dining-plan
status, Q24 spending band) to test whether the optimal price differs meaningfully by
segment — in particular whether dining-plan holders (who may face less out-of-pocket price
sensitivity) support a higher viable price than cash/card-only students, directly testing
the payment-friction risk this project has flagged since the competitive-landscape phase.

## Suggested 8-slide outline for 10/8

1. **Research question & business decision** — what large-hot-coffee / large-iced-latte
   price should Dunkin' launch at on River Campus, building on the verified competitive
   landscape (Starbucks/Peet's/Connections Café) already presented
2. **Methodology** — why Van Westendorp + Gabor-Granger together (range + a concrete
   number), one line on each method's limitation, and the first-asked-product
   randomization
3. **Price ladder justification** — the $3.00–$4.00 (coffee) / $5.50–$8.00 (latte) ladders,
   shown against the real verified competitor prices they bracket
4. **Screener & behavior questions** — who qualifies, and the behavioral questions that set
   up segmentation (frequency, current vendor, dining-plan status)
5. **Full question walkthrough** — PSM's 4 questions + the Gabor-Granger matrix, for both
   products, with the order-randomization build note
6. **Purchase drivers & the payment-parity scenario** — the generic importance-rating
   question, plus the direct Dining Dollars scenario question added after the 9/24
   presentation confirmed all three on-campus incumbents already accept Dining Dollars
7. **Data collection plan** — 2 form variants, rotation instructions, target n, timeline
8. **What this will let us analyze after data collection** — PSM acceptable range ×
   Gabor-Granger demand curve → recommended launch price, cross-tabbed by segment

## Three hardest questions a professor would likely ask

1. **"Why ask hypothetical open-ended price questions (PSM) instead of just using your
   already-verified real competitor prices as the test points?"** — PSM measures the
   respondent's own internal sense of value, independent of what competitors currently
   charge; the verified competitor prices are used to *sanity-check and bracket* the
   Gabor-Granger ladder, not to replace PSM's open-ended questions, since PSM's whole value
   is not anchoring respondents to a pre-set list.
2. **"With n≈90–120 split across 2 form variants and segmented further by status/dining-plan,
   aren't your segment cells too small to trust?"** — Yes, honestly: segment-level cross-tabs
   (e.g., grad students with a dining plan) will likely be directional, not statistically
   robust, at this sample size. The 10/19 pooled dataset across the whole class may give
   enough n for those cells to be meaningful; this team's slice is best treated as a
   stress-test of the method, not a final segment-level verdict.
3. **"Stated purchase intent in a hypothetical survey often overstates real purchase
   behavior — how would you account for that?"** — We wouldn't fully correct for it with
   this design; it's a known limitation of both PSM and Gabor-Granger (noted above). The
   mitigation is comparing Q5/Q6's stated *current* spending against the hypothetical
   answers for internal consistency, and treating the output as a *relative* ranking of
   price points and segments rather than a precise revenue forecast.
