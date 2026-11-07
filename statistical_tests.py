"""Inferential statistics on top of the descriptive analysis in analyze_survey.py:

1. Are the three price points actually different (not just descriptively, but
   statistically)? Friedman test (repeated-measures, since each respondent
   rated all 3 prices for a product) + pairwise Wilcoxon signed-rank tests
   between adjacent/all price pairs, Bonferroni-corrected within each
   product's family of 3 comparisons.
2. Are the segment gaps (undergrad vs grad, dining-plan yes vs no) real, or
   could they be sampling noise? Mann-Whitney U test at each price point,
   Bonferroni-corrected within each segment's family of 3 price-point tests.
3. A regression estimating price elasticity directly: purchase probability
   (Jamieson & Bass conversion) ~ price + segment dummies, with cluster-
   robust standard errors by respondent (each respondent contributes 3 rows
   per product - plain OLS would understate the SEs by treating those as
   independent observations).

Run: python statistical_tests.py
Reads: data/survey/core_clean.csv
Writes: data/survey/significance_tests.json, data/survey/regression_results.json
"""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd
import statsmodels.formula.api as smf
from scipy import stats

DATA_DIR = Path(__file__).parent / "data" / "survey"

LATTE_COLS = ["latte_5.29", "latte_5.59", "latte_5.89"]
COFFEE_COLS = ["coffee_3.29", "coffee_3.49", "coffee_3.69"]
PRODUCTS = {"Hot Coffee": (COFFEE_COLS, [3.29, 3.49, 3.69]), "Iced Latte": (LATTE_COLS, [5.29, 5.59, 5.89])}
LIKERT_TO_PROBABILITY = {5: 0.75, 4: 0.25, 3: 0.10, 2: 0.05, 1: 0.02}


def friedman_and_pairwise(df: pd.DataFrame, cols: list[str]) -> dict:
    stat, p = stats.friedmanchisquare(df[cols[0]], df[cols[1]], df[cols[2]])
    pairs = [(0, 1), (1, 2), (0, 2)]
    pairwise = []
    for i, j in pairs:
        w_stat, w_p = stats.wilcoxon(df[cols[i]], df[cols[j]])
        pairwise.append(
            {
                "pair": f"{cols[i]} vs {cols[j]}",
                "wilcoxon_stat": round(float(w_stat), 2),
                "p_raw": float(w_p),
                "p_bonferroni": min(1.0, float(w_p) * 3),
                "significant_at_05": (min(1.0, float(w_p) * 3)) < 0.05,
            }
        )
    return {
        "friedman_chi2": round(float(stat), 2),
        "friedman_p": float(p),
        "significant_at_05": float(p) < 0.05,
        "pairwise_wilcoxon_bonferroni": pairwise,
    }


def segment_gap_tests(df: pd.DataFrame, cols: list[str], segment_col: str, group_a, group_b) -> dict:
    a = df[df[segment_col] == group_a]
    b = df[df[segment_col] == group_b]
    results = []
    for col in cols:
        u_stat, p = stats.mannwhitneyu(a[col], b[col], alternative="two-sided")
        results.append(
            {
                "price_col": col,
                "n_a": len(a),
                "n_b": len(b),
                "median_a": float(a[col].median()),
                "median_b": float(b[col].median()),
                "u_stat": round(float(u_stat), 1),
                "p_raw": float(p),
                "p_bonferroni": min(1.0, float(p) * len(cols)),
                "significant_at_05": (min(1.0, float(p) * len(cols))) < 0.05,
            }
        )
    return {"group_a": str(group_a), "group_b": str(group_b), "by_price": results}


def build_long_panel(df: pd.DataFrame, cols: list[str], prices: list[float]) -> pd.DataFrame:
    rows = []
    for _, row in df.iterrows():
        for col, price in zip(cols, prices):
            likert = row[col]
            rows.append(
                {
                    "respondent_id": row["respondent_id"],
                    "price": price,
                    "probability": LIKERT_TO_PROBABILITY[int(likert)],
                    "is_dining_plan_yes": 1 if row["meal_plan"] == "Yes" else 0,
                    "is_undergrad": 1 if row["role"] == "Undergraduate student" else 0,
                    "is_female": 1 if row["gender"] == "Female" else 0,
                }
            )
    return pd.DataFrame(rows)


def run_regression(panel: pd.DataFrame) -> dict:
    model = smf.ols("probability ~ price + is_dining_plan_yes + is_undergrad + is_female", data=panel)
    result = model.fit(cov_type="cluster", cov_kwds={"groups": panel["respondent_id"]})
    out = {"n_obs": int(result.nobs), "n_clusters": int(panel["respondent_id"].nunique()), "r_squared": round(result.rsquared, 4), "coefficients": {}}
    for name in result.params.index:
        out["coefficients"][name] = {
            "coef": round(float(result.params[name]), 5),
            "std_err": round(float(result.bse[name]), 5),
            "p_value": float(result.pvalues[name]),
            "ci_low": round(float(result.conf_int().loc[name, 0]), 5),
            "ci_high": round(float(result.conf_int().loc[name, 1]), 5),
        }
    return out


def main() -> None:
    core = pd.read_csv(DATA_DIR / "core_clean.csv")

    significance = {}
    regression = {}
    for product, (cols, prices) in PRODUCTS.items():
        significance[product] = {
            "price_points": friedman_and_pairwise(core, cols),
            "by_dining_plan": segment_gap_tests(core, cols, "meal_plan", "Yes", "No"),
            "by_student_status": segment_gap_tests(
                core[core["role"].isin(["Undergraduate student", "Graduate student"])],
                cols,
                "role",
                "Undergraduate student",
                "Graduate student",
            ),
        }
        panel = build_long_panel(core, cols, prices)
        regression[product] = run_regression(panel)

    (DATA_DIR / "significance_tests.json").write_text(json.dumps(significance, indent=2))
    (DATA_DIR / "regression_results.json").write_text(json.dumps(regression, indent=2))

    for product in PRODUCTS:
        print(f"\n=== {product}: price-point significance ===")
        fp = significance[product]["price_points"]
        print(f"Friedman chi2={fp['friedman_chi2']}, p={fp['friedman_p']:.6f}, significant={fp['significant_at_05']}")
        for pw in fp["pairwise_wilcoxon_bonferroni"]:
            print(f"  {pw['pair']}: p_bonf={pw['p_bonferroni']:.6f}, significant={pw['significant_at_05']}")

        print(f"\n=== {product}: dining-plan gap significance ===")
        dp = significance[product]["by_dining_plan"]
        for r in dp["by_price"]:
            print(f"  {r['price_col']}: median Yes={r['median_a']} vs No={r['median_b']}, p_bonf={r['p_bonferroni']:.6f}, significant={r['significant_at_05']}")

        print(f"\n=== {product}: undergrad vs grad gap significance ===")
        us = significance[product]["by_student_status"]
        for r in us["by_price"]:
            print(f"  {r['price_col']}: median Undergrad={r['median_a']} vs Grad={r['median_b']}, p_bonf={r['p_bonferroni']:.6f}, significant={r['significant_at_05']}")

        print(f"\n=== {product}: regression (probability ~ price + segments, clustered SE) ===")
        reg = regression[product]
        print(f"n_obs={reg['n_obs']}, n_clusters={reg['n_clusters']}, R2={reg['r_squared']}")
        for name, c in reg["coefficients"].items():
            print(f"  {name}: coef={c['coef']:.5f}, p={c['p_value']:.6f}, 95% CI=[{c['ci_low']:.5f}, {c['ci_high']:.5f}]")

    print(f"\nWrote significance_tests.json and regression_results.json to {DATA_DIR}")


if __name__ == "__main__":
    main()
