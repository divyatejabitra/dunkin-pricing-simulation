"""Per-price-point analysis for the 11/12 check-in, per Prof. Nelson's spec:

For each product (hot coffee, iced latte) x each of its 3 real price points:
  - raw 1-5 response: n, mean, median, mode, std
  - "average probability of purchase": the 1-5 response linearly rescaled to
    0%-100% (1->0%, 2->25%, 3->50%, 4->75%, 5->100%) and averaged - the
    transformation Nelson asked the team to pick and apply consistently
  - segment cuts: gender, undergrad/grad, dining-plan status (Nelson named
    "guy, gal, undergrad, grad... things like that" - dining-plan status is
    this team's own addition, since it's the project's standing payment-
    friction question)
  - the non-affiliated comparison segment, run the same way, side by side

Run: python analyze_survey.py
Reads: data/survey/core_clean.csv, data/survey/nonaffiliated_clean.csv
Writes: data/survey/price_point_summary.csv (slide-ready long-format table)
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd

DATA_DIR = Path(__file__).parent / "data" / "survey"

LATTE_PRICES = {"latte_5.29": 5.29, "latte_5.59": 5.59, "latte_5.89": 5.89}
COFFEE_PRICES = {"coffee_3.29": 3.29, "coffee_3.49": 3.49, "coffee_3.69": 3.69}
PRODUCTS = {"Iced Latte": LATTE_PRICES, "Hot Coffee": COFFEE_PRICES}

# Purchase-intent-to-probability conversion, following the practitioner
# weighting scheme examined in Jamieson, L.F. and Bass, F.M. (1989),
# "Adjusting Stated Intention Measures to Predict Trial Purchase of New
# Products: A Comparison of Models and Methods," Journal of Marketing
# Research 26(3): 336-345 - one of several schemes they compared against
# actual trial-purchase data for a 5-point purchase-likelihood scale.
# Note (for the methodology slide): Jamieson & Bass found fixed practitioner
# weighting schemes like this one - as opposed to their own proposed
# probabilistic model - still carried real error against actual purchase
# behavior (reported average absolute error in the 10-17 percentage point
# range). We use it anyway for transparency and because it is a real,
# citable research convention rather than an arbitrary rescale - not
# because it is claimed to be precise.
LIKERT_TO_PROBABILITY = {5: 0.75, 4: 0.25, 3: 0.10, 2: 0.05, 1: 0.02}


def mode(series: pd.Series) -> int:
    m = series.mode()
    return int(m.iloc[0]) if not m.empty else None


def summarize_cut(df: pd.DataFrame, segment_name: str, segment_value: str) -> list[dict]:
    rows = []
    for product, price_cols in PRODUCTS.items():
        for col, price in price_cols.items():
            vals = df[col]
            probs = vals.map(LIKERT_TO_PROBABILITY)
            rows.append(
                {
                    "segment": segment_name,
                    "segment_value": segment_value,
                    "product": product,
                    "price": price,
                    "n": len(vals),
                    "mean_1to5": round(vals.mean(), 2),
                    "median_1to5": vals.median(),
                    "mode_1to5": mode(vals),
                    "std_1to5": round(vals.std(), 2),
                    "mean_probability": round(probs.mean(), 3),
                    "pct_likely_or_very_likely": round((vals >= 4).mean(), 3),
                    "revenue_index": round(price * probs.mean(), 4),
                }
            )
    return rows


def revenue_maximizing_prices(summary: pd.DataFrame) -> pd.DataFrame:
    """For each (segment, segment_value, product), the price with the
    highest revenue_index (price x mean converted purchase probability) -
    the basis for the price decision and any price-discrimination call."""
    idx = summary.groupby(["segment", "segment_value", "product"])["revenue_index"].idxmax()
    best = summary.loc[idx, ["segment", "segment_value", "product", "price", "mean_probability", "revenue_index"]]
    return best.rename(columns={"price": "revenue_maximizing_price"}).sort_values(
        ["product", "segment", "segment_value"]
    )


def build_summary(core: pd.DataFrame, nonaffiliated: pd.DataFrame) -> pd.DataFrame:
    rows: list[dict] = []

    rows += summarize_cut(core, "overall", "UR-affiliated (core sample)")

    for gender, group in core.groupby("gender"):
        rows += summarize_cut(group, "gender", gender)

    status_map = {"Undergraduate student": "Undergrad", "Graduate student": "Grad"}
    for role_value, label in status_map.items():
        group = core[core["role"] == role_value]
        if len(group):
            rows += summarize_cut(group, "student_status", label)

    for meal_plan, group in core.groupby("meal_plan"):
        rows += summarize_cut(group, "dining_plan", meal_plan)

    rows += summarize_cut(nonaffiliated, "comparison", "Not UR-affiliated")

    return pd.DataFrame(rows)


def main() -> None:
    core = pd.read_csv(DATA_DIR / "core_clean.csv")
    nonaffiliated = pd.read_csv(DATA_DIR / "nonaffiliated_clean.csv")

    summary = build_summary(core, nonaffiliated)
    out_path = DATA_DIR / "price_point_summary.csv"
    summary.to_csv(out_path, index=False)

    print(f"core sample n={len(core)}, comparison (non-affiliated) n={len(nonaffiliated)}\n")

    for product in PRODUCTS:
        print(f"=== {product} (overall, UR-affiliated core sample) ===")
        sub = summary[(summary["segment"] == "overall") & (summary["product"] == product)]
        print(
            sub[
                [
                    "price",
                    "n",
                    "mean_1to5",
                    "median_1to5",
                    "mode_1to5",
                    "mean_probability",
                    "pct_likely_or_very_likely",
                    "revenue_index",
                ]
            ].to_string(index=False)
        )
        print()

    print(f"Full segment-by-segment table written to {out_path}")

    best = revenue_maximizing_prices(summary)
    best_path = DATA_DIR / "revenue_maximizing_prices.csv"
    best.to_csv(best_path, index=False)
    print(f"\n=== Revenue-maximizing price per segment ===")
    print(best.to_string(index=False))
    print(f"\nWritten to {best_path}")


if __name__ == "__main__":
    main()
