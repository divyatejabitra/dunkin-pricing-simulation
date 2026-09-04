# Dunkin' Pricing Simulation

A pricing research toolkit for the MKT465 (Simon Business School, University of Rochester)
capstone project: should Dunkin' open a store on the University of Rochester's River Campus,
and if so, at what price relative to its off-campus reference price?

The client research question: test the impact on purchase likelihood of a 25-cent price
decrease or increase (for hot coffee and latte) relative to the off-campus price point,
against the on-campus incumbents (Starbucks, Peet's, Brew).

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env   # then fill in your own OPENAI_API_KEY
```

## What's in here

### 1. Competitor pricing (`competitors.py`, `agents/pricing_scanner_agent.py`, `run_scan.py`, `analyze_prices.py`)

Official chain sites (Dunkin', Starbucks) and the campus dining page do **not** publish
location-specific prices - confirmed by hand before building this. So this is a hybrid, not
a pure scraper:

- `agents/pricing_scanner_agent.py` fetches a page and asks an LLM to extract a hot-coffee
  and latte price **only if a dollar amount is explicitly on the page** - it's instructed to
  never guess or round, and returns `found=False` rather than invent a number.
- Real prices for Dunkin' (off-campus), Starbucks, Peet's, and Brew were confirmed by the team
  and entered directly into `data/competitor_prices.csv` with `verified=True`, since public
  scraping couldn't reach them.

Workflow:
1. `python run_scan.py` - fills in whatever prices are explicitly published online (skips any
   row already marked `verified=True`).
2. Open `data/competitor_prices.csv` and fill in any remaining `found=False` row by hand
   (store visit, receipt, or ordering app), then set `verified=True`.
3. `python analyze_prices.py` - prints a summary (chain vs. independent, on- vs. off-campus
   averages, price gap vs. Dunkin') and writes `data/competitor_pricing_chart.html`, a bar
   chart ready to screenshot into slides.

### 2. Pricing scenario + recommendation agents (`agents/pricing_scenario_agent.py`, `agents/recommendation_agent.py`, `run_recommendation.py`)

A **hypothesis-generation tool** for the 9/24 preliminary market analysis - not a measured
elasticity estimate (no survey data exists yet).

- `PricingScenarioAgent` builds the three price scenarios from the research design (25-cent
  discount / match / 25-cent premium vs. the off-campus reference price) and has an LLM assess
  each one's likely relative appeal against the on-campus incumbents, always flagging what a
  real survey needs to confirm before the hypothesis can be trusted.
- `RecommendationAgent` synthesizes all three scenarios plus known business perks/risks into
  one recommended price point with supporting points, risks, and required survey validations.
- `python run_recommendation.py` runs both and writes `data/pricing_recommendation.md`, a
  slide-ready report.

Note: this is LLM-based reasoning over stated facts, not a statistical model, and isn't
seeded for determinism - rerunning it can change which scenario comes out on top when the
scenarios are genuinely close calls. That instability is itself informative: it means price
positioning alone doesn't clearly separate the options, and the survey (below) is what will
actually decide it.

### 3. Survey design (`survey_design.md`, `google_forms/`)

The proposed student questionnaire for the 10/8 survey-design presentation - a **between-
subjects, randomized single-price-point** design (each respondent sees only one of the three
price scenarios per product, to avoid anchoring bias), built as three parallel Google Forms
(`google_forms/version_A_discount.txt`, `_B_match.txt`, `_C_premium.txt`) that surveyors
rotate through as they collect responses. `google_forms/surveyor_instructions.md` is a
printable one-pager for whoever is collecting the 10 responses per teammate in person.

## Next: the elasticity phase (after 10/19)

Once real survey data comes back, it replaces the LLM-based hypothesis in
`agents/pricing_scenario_agent.py` with an actual regression: purchase likelihood (from the
survey) as a function of price condition (A/B/C) and segment (student status, meal-plan
status, current vendor, campus residency). That's a much simpler pandas/statsmodels
analysis - it doesn't need the scraping/agent machinery above.
