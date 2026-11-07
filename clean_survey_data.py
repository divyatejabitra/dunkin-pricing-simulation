"""Clean the pooled survey export for the 11/12 price-analysis check-in.

Policy (confirmed with the team, not a default I invented):
- Exact duplicate rows are KEPT as-is - treated as real pooled responses,
  not a merge artifact worth de-duplicating.
- Respondents who gave the IDENTICAL 1-5 answer to all six price questions
  (both products, all three price points each) are EXCLUDED - no variation
  across two different products at different price ranges is the classic
  straight-lining signature of not reading the question.
- Respondents whose stated purchase likelihood INCREASES by 2 or more points
  on any single step as price rises (for the same product) are EXCLUDED -
  Gabor-Granger assumes likelihood is non-increasing in price; a 1-point
  reversal is kept (plausible scale noise between adjacent price points 30
  cents apart), but a 2-3 point jump is a much stronger signal of not
  reading the question carefully.
- Respondents who are NOT UR-affiliated are KEPT, but split into their own
  comparison segment rather than pooled with the core campus-population
  sample or dropped outright - the client decision is about River Campus
  demand specifically, but the non-affiliated responses are still real data
  worth a side-by-side look.

Run: python clean_survey_data.py
Writes: data/survey/core_clean.csv, data/survey/nonaffiliated_clean.csv,
        data/survey/excluded.csv (every dropped row + which rule(s) it hit)
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd

SOURCE = Path.home() / "Downloads" / "Dunkin_Survey_Final_Data.xlsx"
OUT_DIR = Path(__file__).parent / "data" / "survey"

COLUMN_RENAME = {
    "Q1. How do you describe your gender?": "gender",
    "Q2. Which of the following best describes your role at the University of Rochester?": "role",
    "Q3. Do you currently have a meal plan or dining dollars?": "meal_plan",
    "Q4. If you have a meal plan or dining dollars, how important is it to you to be able to use them to purchase coffee?": "meal_plan_importance",
}

LATTE_COLS = ["latte_5.29", "latte_5.59", "latte_5.89"]
COFFEE_COLS = ["coffee_3.29", "coffee_3.49", "coffee_3.69"]
ALL_PRICE_COLS = LATTE_COLS + COFFEE_COLS


def _rename_price_columns(columns: list[str]) -> dict[str, str]:
    mapping = {}
    for col in columns:
        if "ICED LATTE" in col.upper():
            price = col.split("$")[1].split(" ")[0].rstrip(".?")
            mapping[col] = f"latte_{price}"
        elif "HOT COFFEE" in col.upper():
            price = col.split("$")[1].split(" ")[0].rstrip(".?")
            mapping[col] = f"coffee_{price}"
    return mapping


def _max_step_increase(row: pd.Series, cols: list[str]) -> int:
    vals = [row[c] for c in cols]
    return max((vals[i + 1] - vals[i] for i in range(len(vals) - 1)), default=0)


def load_and_tag(source: Path = SOURCE) -> pd.DataFrame:
    df = pd.read_excel(source)
    df = df.rename(columns=COLUMN_RENAME)
    df = df.rename(columns=_rename_price_columns(list(df.columns)))
    df = df.reset_index(drop=True)
    df["respondent_id"] = df.index

    df["latte_max_increase"] = df.apply(lambda r: _max_step_increase(r, LATTE_COLS), axis=1)
    df["coffee_max_increase"] = df.apply(lambda r: _max_step_increase(r, COFFEE_COLS), axis=1)
    df["severe_nonmonotonic"] = (df["latte_max_increase"] >= 2) | (df["coffee_max_increase"] >= 2)
    df["flatlined_all_six"] = df[ALL_PRICE_COLS].nunique(axis=1) == 1
    df["not_ur_affiliated"] = df["role"] == "Not affiliated with the University of Rochester"
    return df


def split(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Returns (core_clean, nonaffiliated_clean, excluded)."""
    quality_fail = df["flatlined_all_six"] | df["severe_nonmonotonic"]
    excluded = df[quality_fail].copy()

    def reason(row: pd.Series) -> str:
        reasons = []
        if row["flatlined_all_six"]:
            reasons.append("flatlined_all_six_price_questions")
        if row["severe_nonmonotonic"]:
            reasons.append("severe_nonmonotonic_likelihood_vs_price")
        return ";".join(reasons)

    excluded["exclusion_reason"] = excluded.apply(reason, axis=1)

    survivors = df[~quality_fail].copy()
    core_clean = survivors[~survivors["not_ur_affiliated"]].copy()
    nonaffiliated_clean = survivors[survivors["not_ur_affiliated"]].copy()
    return core_clean, nonaffiliated_clean, excluded


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    df = load_and_tag()
    core_clean, nonaffiliated_clean, excluded = split(df)

    print(f"Loaded {len(df)} total responses from {SOURCE.name}")
    print(f"  exact duplicates: kept as-is (per team policy)")
    print(f"  flat-lined (all 6 identical):     {df['flatlined_all_six'].sum()}")
    print(f"  severe non-monotonic (jump >=2):  {df['severe_nonmonotonic'].sum()}")
    print(f"  excluded (union of the two above): {len(excluded)}")
    print()
    print(f"  core (UR-affiliated, clean):      {len(core_clean)}")
    print(f"  comparison segment (non-affiliated, clean): {len(nonaffiliated_clean)}")
    print(f"  core + comparison + excluded = {len(core_clean) + len(nonaffiliated_clean) + len(excluded)} (should equal {len(df)})")

    core_clean.to_csv(OUT_DIR / "core_clean.csv", index=False)
    nonaffiliated_clean.to_csv(OUT_DIR / "nonaffiliated_clean.csv", index=False)
    excluded.to_csv(OUT_DIR / "excluded.csv", index=False)
    print(f"\nWrote core_clean.csv, nonaffiliated_clean.csv, excluded.csv to {OUT_DIR}")


if __name__ == "__main__":
    main()
