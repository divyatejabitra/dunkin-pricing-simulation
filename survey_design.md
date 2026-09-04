# Dunkin' Campus Coffee Survey Design (Draft for 10/8)

Proposed questionnaire for the MKT465 Dunkin' capstone. This is a **proposal** - per the
syllabus, a single unified questionnaire gets built centrally after all teams present on
10/8, so the goal here is a defensible, presentable design, not a live form yet.

## Method

**Between-subjects, randomized single price point per respondent**, for both hot coffee and
latte independently. Each respondent is shown only ONE of three possible Dunkin' campus
prices for hot coffee, and only ONE of three for latte - never all three - so their answer
isn't biased by anchoring on the other price points. This directly operationalizes the
project brief: "test the impact... of a 25-cent price decrease or a 25-cent price increase
relative to the off-campus price point."

**Platform: Google Forms**, distributed as **three parallel copies** (Version A/B/C) that are
identical except for the price shown in Q10 and Q11. Because Forms' free branching logic
would need a real random-number trigger, the simplest zero-scripting way to balance
assignment is to rotate versions across respondents in the order each student surveys them:

| Respondent # (per surveyor) | Version to use |
|---|---|
| 1, 4, 7, 10 | A |
| 2, 5, 8 | B |
| 3, 6, 9 | C |

This spreads each surveyor's 10 responses roughly evenly across all three price conditions
without needing any Forms scripting - just an instruction sheet for whoever is administering
it in person.

## Price values by version

| Version | Hot coffee price shown | Latte price shown |
|---|---|---|
| A - 25c discount | $2.75 | $5.00 |
| B - match off-campus | $3.00 | $5.25 |
| C - 25c premium | $3.25 | $5.50 |

(Off-campus Dunkin' reference: $3.00 hot coffee / $5.25 latte - see `data/competitor_prices.csv`)

## Full question set

### Section 1 - Screening
1. Are you currently a student, faculty, or staff member at the University of Rochester?
   (Yes / No - screen out No)
2. Do you drink hot coffee or lattes at least occasionally?
   (Yes / No - screen out No)

### Section 2 - Segmentation
3. What is your status? (Undergraduate student / Graduate student / Staff / Faculty)
4. Do you live on campus or off campus? (On campus / Off campus)
5. Do you have a University dining plan or dining dollars? (Yes / No)
6. In a typical week, how often do you buy coffee or a latte on or near campus?
   (0 times / 1-2 times / 3-5 times / 6+ times)
7. Which do you currently buy coffee from most often?
   (Starbucks - Wilson Commons / Peet's - Wegmans Hall / Brew / An off-campus coffee shop /
   I make my own / Other)

### Section 3 - Brand awareness and interest
8. How familiar are you with Dunkin' as a brand? (5-point scale: Not at all familiar - Extremely familiar)
9. If Dunkin' opened a location on River Campus, how interested would you be in trying it?
   (5-point scale: Not at all interested - Extremely interested)
   - *Comparable to the prior Simon research benchmark (4.2/5 utility) - lets this survey
     validate or update that number for this specific sample.*

### Section 4 - Core price experiment (fill in [PRICE] per version, see table above)

10. If Dunkin' opened on campus and sold a medium hot coffee for **$[PRICE]**, how likely
    would you be to purchase it instead of your usual coffee?
    (5-point scale: Very unlikely - Very likely)
11. If Dunkin' opened on campus and sold a medium hot latte for **$[PRICE]**, how likely
    would you be to purchase it instead of your usual latte?
    (5-point scale: Very unlikely - Very likely)

### Section 5 - Payment method (tests the biggest risk flagged in the pricing analysis)
12. If Dunkin' did **not** accept University dining dollars or meal-plan swipes (cash/card
    only), how would that affect your likelihood of buying there?
    (5-point scale: Much less likely - No change)

### Section 6 - Open-ended (optional, gives qualitative color for slides)
13. What, if anything, would make you choose Dunkin' over Starbucks, Peet's, or Brew on campus?
    (open text)

## Mapping to your 8 slides for 10/8

1. Research question & why it matters (recap: campus pricing decision, prior 4.2/5 utility finding)
2. Method: between-subjects randomized price test, why (avoids anchoring bias)
3. The 3 price versions (table above) and how rotation/assignment works
4. Segmentation variables and why (undergrad/grad/staff, meal plan - ties to payment-method risk)
5. Full question walkthrough (screening -> segmentation -> brand -> price -> payment -> open-ended)
6. Sample question screenshots (once built in Google Forms)
7. Data collection plan (10 respondents/student, rotation instructions, timeline to 10/19)
8. What this will let us analyze after 10/19 (see below)

## Analysis plan (after 10/19, once real data lands)

Once the pooled survey data comes back, this replaces the current LLM-based hypothesis in
`agents/pricing_scenario_agent.py` with a real regression: purchase likelihood (Q10/Q11) as a
function of price condition (A/B/C) and segment (status, meal-plan, current vendor, campus
residency). That directly tests which of the three pricing scenarios actually drives
purchase intent, and specifically whether meal-plan holders are less price-sensitive - the
open question every run of the recommendation agent flagged as decisive.
