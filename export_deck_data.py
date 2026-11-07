"""Export every number the presentation needs into one JSON file, so the
slide-building script never re-derives a statistic - it only formats what's
already been computed and checked in analyze_survey.py / clean_survey_data.py.
"""
from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

from analyze_survey import DATA_DIR, PRODUCTS, revenue_maximizing_prices

OUT = Path(__file__).parent / "presentation" / "deck_data.json"


def main() -> None:
    core = pd.read_csv(DATA_DIR / "core_clean.csv")
    nonaff = pd.read_csv(DATA_DIR / "nonaffiliated_clean.csv")
    excluded = pd.read_csv(DATA_DIR / "excluded.csv")
    summary = pd.read_csv(DATA_DIR / "price_point_summary.csv")
    best = revenue_maximizing_prices(summary)
    significance = json.loads((DATA_DIR / "significance_tests.json").read_text())
    regression = json.loads((DATA_DIR / "regression_results.json").read_text())

    raw_n = len(core) + len(nonaff) + len(excluded)

    def product_overall(product: str) -> list[dict]:
        sub = summary[(summary.segment == "overall") & (summary["product"] == product)]
        return sub[["price", "mean_1to5", "mean_probability", "pct_likely_or_very_likely", "revenue_index"]].to_dict("records")

    def product_segment(product: str, segment: str) -> dict[str, list[dict]]:
        sub = summary[(summary.segment == segment) & (summary["product"] == product)]
        out: dict[str, list[dict]] = {}
        for value, group in sub.groupby("segment_value"):
            out[value] = group[["price", "mean_1to5", "mean_probability", "revenue_index"]].to_dict("records")
        return out

    data = {
        "cleaning": {
            "n_raw": raw_n,
            "n_flatlined": int(excluded["exclusion_reason"].str.contains("flatlined").sum()),
            "n_severe_nonmono": int(excluded["exclusion_reason"].str.contains("severe").sum()),
            "n_excluded_total": len(excluded),
            "n_core": len(core),
            "n_comparison_nonaffiliated": len(nonaff),
        },
        "hot_coffee": {
            "overall": product_overall("Hot Coffee"),
            "by_dining_plan": product_segment("Hot Coffee", "dining_plan"),
            "by_student_status": product_segment("Hot Coffee", "student_status"),
            "by_gender": {k: v for k, v in product_segment("Hot Coffee", "gender").items() if k != "Prefer not to say"},
        },
        "iced_latte": {
            "overall": product_overall("Iced Latte"),
            "by_dining_plan": product_segment("Iced Latte", "dining_plan"),
            "by_student_status": product_segment("Iced Latte", "student_status"),
            "by_gender": {k: v for k, v in product_segment("Iced Latte", "gender").items() if k != "Prefer not to say"},
        },
        "revenue_maximizing": best.to_dict("records"),
        "significance": significance,
        "regression": regression,
        "stony_brook": {
            "hot_coffee_large_20oz": 3.68,
            "iced_latte_direct_match": None,
            "iced_latte_closest_comparables": [
                {"item": "Iced Chai Latte (L)", "price": 5.49},
                {"item": "Cold Brew (L)", "price": 5.49},
            ],
            "note": "Dunkin' Express at Stony Brook - confirmed live, working Dining Dollars integration",
        },
    }

    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2))
    print(f"Wrote {OUT}")
    print(json.dumps(data["cleaning"], indent=2))


if __name__ == "__main__":
    main()
