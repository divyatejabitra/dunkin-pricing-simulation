const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const { applyTheme } = require("/Users/tejavu/.claude/skills/synced/cff63fa9-035b-44ee-9687-36011ea8f34c_6cee6839-b02c-4c77-95cf-b9dcdb16d253/pptx/scripts/apply_theme.js");

const D = JSON.parse(fs.readFileSync(path.join(__dirname, "deck_data.json"), "utf8"));

const THEME = {
  name: "Dunkin Pricing",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "2B1B12",
    lt1: "FFFFFF",
    dk2: "4A2C1E",
    lt2: "FBF5EE",
    accent1: "D96A2B",
    accent2: "8A5A3B",
    accent3: "1E6B52",
    accent4: "C98A3B",
    accent5: "7A4A2D",
    accent6: "2B1B12",
    hlink: "D96A2B",
    folHlink: "8A5A3B",
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

const EW = 13.333;
const EH = 7.5;

// ---------- layouts ----------

// Title layout (dark)
pres.defineSlideMaster({
  title: "TITLE",
  background: { color: THEME.colors.dk1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.5, w: 11.7, h: 1.6, fontSize: 40, bold: true, color: C.background1, fontFace: THEME.headFontFace, align: "left" }, text: "" } },
    { placeholder: { options: { name: "subtitle", type: "body", x: 0.8, y: 4.15, w: 11.7, h: 0.9, fontSize: 18, color: THEME.colors.accent1, fontFace: THEME.bodyFontFace, align: "left" }, text: "" } },
    { text: { options: { x: 0.8, y: 6.7, w: 11.7, h: 0.4, fontSize: 11, color: THEME.colors.accent4, fontFace: THEME.bodyFontFace }, text: "MKT465 Capstone  •  Simon Business School, University of Rochester" } },
  ],
});

// Section divider (dark)
pres.defineSlideMaster({
  title: "DIVIDER",
  background: { color: THEME.colors.dk1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 3.05, w: 11.7, h: 1.4, fontSize: 34, bold: true, color: C.background1, fontFace: THEME.headFontFace, align: "left" }, text: "" } },
    { placeholder: { options: { name: "subtitle", type: "body", x: 0.8, y: 4.35, w: 11.0, h: 0.8, fontSize: 16, color: THEME.colors.accent1, fontFace: THEME.bodyFontFace, align: "left" }, text: "" } },
    { text: { options: { x: 12.5, y: 7.05, w: 0.6, h: 0.3, fontSize: 11, color: THEME.colors.accent4, fontFace: THEME.bodyFontFace, align: "right" }, text: "" } },
  ],
  slideNumber: { x: 12.5, y: 7.05, fontFace: THEME.bodyFontFace, fontSize: 11, color: THEME.colors.accent4 },
});

// Content layout (light) - title + freeform body
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: THEME.colors.lt2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.4, w: 12.1, h: 0.75, fontSize: 28, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, align: "left" }, text: "" } },
    { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 1.08, w: 12.1, h: 0.4, fontSize: 13, italic: true, color: THEME.colors.accent2, fontFace: THEME.bodyFontFace, align: "left" }, text: "" } },
  ],
  slideNumber: { x: 12.7, y: 7.12, fontFace: THEME.bodyFontFace, fontSize: 10, color: THEME.colors.accent2 },
});

function addContentSlide(title, kicker, sectionTitle) {
  const slide = pres.addSlide({ masterName: "CONTENT", sectionTitle: sectionTitle || "Findings" });
  slide.addText(title, { placeholder: "title" });
  if (kicker) slide.addText(kicker, { placeholder: "kicker" });
  return slide;
}

function pct(x) { return Math.round(x * 1000) / 10 + "%"; }
function money(x) { return "$" + x.toFixed(2); }

// ---------- Slide 1: Title ----------
pres.addSection({ title: "Title" });
{
  const slide = pres.addSlide({ masterName: "TITLE", sectionTitle: "Title" });
  slide.addText("Dunkin' at River Campus", { placeholder: "title" });
  slide.addText("Price-point survey analysis & launch pricing recommendation", { placeholder: "subtitle" });
}

// ---------- Slide 2: Data cleaning & methodology ----------
pres.addSection({ title: "Methodology" });
{
  const slide = addContentSlide("Data Cleaning & Methodology", "How 324 raw responses became a 210-person core analysis sample", "Methodology");

  // left: cleaning funnel as stat cards
  const cards = [
    { n: D.cleaning.n_raw, label: "Raw pooled\nresponses", color: THEME.colors.dk2 },
    { n: "−" + D.cleaning.n_flatlined, label: "Flat-lined all 6\nprice questions", color: THEME.colors.accent1 },
    { n: "−" + D.cleaning.n_severe_nonmono, label: "Severe reversal\n(likelihood jumps ≥2 as price rises)", color: THEME.colors.accent1 },
    { n: D.cleaning.n_core, label: "Core clean sample\n(UR-affiliated)", color: THEME.colors.accent3 },
  ];
  const cardW = 2.75, gap = 0.25, startX = 0.6, y = 1.75, cardH = 1.9;
  cards.forEach((c, i) => {
    const x = startX + i * (cardW + gap);
    slide.addShape("roundRect", { x, y, w: cardW, h: cardH, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: "E6D9C8", width: 1 }, shadow: { type: "outer", color: "2B1B12", opacity: 0.12, blur: 6, offset: 2, angle: 90 } });
    slide.addText(String(c.n), { x, y: y + 0.18, w: cardW, h: 0.9, align: "center", fontSize: 34, bold: true, color: c.color, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
    slide.addText(c.label, { x: x + 0.1, y: y + 1.05, w: cardW - 0.2, h: 0.75, align: "center", fontSize: 12, color: THEME.colors.dk2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0 });
  });

  // exclusion reasoning
  slide.addText("Why those two filters, not the others considered", { x: 0.6, y: 3.95, w: 12.1, h: 0.4, fontSize: 15, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  const bullets = [
    { text: "Flat-lined (identical 1–5 answer to all 6 questions, both products): ", options: { bold: true, color: THEME.colors.dk1 } },
    { text: "a real respondent distinguishing a $3.29 coffee from a $3.69 coffee and a $5.29 latte should show some variation — one number six times is the classic straight-lining signature.", options: { color: THEME.colors.dk2, breakLine: true } },
    { text: "Severe reversal (likelihood rises ≥2 points as price rises): ", options: { bold: true, color: THEME.colors.dk1 } },
    { text: "Gabor-Granger assumes demand is non-increasing in price. A 1-point reversal was kept (plausible noise between prices 30 cents apart); a 2–3 point jump is a much stronger signal of not reading the question.", options: { color: THEME.colors.dk2, breakLine: true } },
    { text: "Exact duplicate rows: ", options: { bold: true, color: THEME.colors.dk1 } },
    { text: "kept as-is, per team decision — treated as real pooled responses, not a merge artifact.", options: { color: THEME.colors.dk2, breakLine: true } },
    { text: "Not UR-affiliated (n=" + D.cleaning.n_comparison_nonaffiliated + " after the same quality filters): ", options: { bold: true, color: THEME.colors.dk1 } },
    { text: "kept, but held out as a separate comparison segment — not pooled with core, not dropped — since the client decision is about River Campus demand specifically.", options: { color: THEME.colors.dk2 } },
  ];
  slide.addText(bullets, { x: 0.6, y: 4.4, w: 12.1, h: 2.5, fontSize: 13, isTextBox: true, margin: 0, paraSpaceAfter: 8, bullet: { indent: 18 }, lineSpacingMultiple: 1.05 });
}

// ---------- Slide 3: Probability transformation ----------
{
  const slide = addContentSlide("From a 1–5 Scale to a Purchase Probability", "Translating stated likelihood into an expected-purchase rate, the way market researchers do", "Methodology");

  slide.addShape("roundRect", { x: 0.6, y: 1.65, w: 5.6, h: 4.9, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: "E6D9C8", width: 1 } });
  slide.addText("The conversion we used", { x: 0.95, y: 1.9, w: 4.9, h: 0.4, fontSize: 15, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  const rows = [
    ["Response", "Meaning", "Probability"],
    ["5", "Very likely", "75%"],
    ["4", "Likely", "25%"],
    ["3", "Neutral", "10%"],
    ["2", "Unlikely", "5%"],
    ["1", "Very unlikely", "2%"],
  ];
  const tableRows = rows.map((r, i) => r.map((cell) => ({
    text: cell,
    options: {
      bold: i === 0,
      color: i === 0 ? "FFFFFF" : THEME.colors.dk2,
      fill: i === 0 ? { color: THEME.colors.accent2 } : (i % 2 === 0 ? { color: "FBF5EE" } : { color: "FFFFFF" }),
      align: "center",
      fontSize: 13,
      valign: "middle",
    },
  })));
  slide.addTable(tableRows, { x: 0.95, y: 2.4, w: 4.9, h: 2.5, colW: [1.4, 2.3, 1.2], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });
  slide.addText(
    "This is not an arbitrary rescale (e.g. 0/25/50/75/100%). It follows a practitioner weighting scheme examined in Jamieson & Bass (1989), Journal of Marketing Research 26(3), for converting a 5-point purchase-likelihood scale into expected purchase probability.",
    { x: 0.95, y: 5.0, w: 4.9, h: 1.4, fontSize: 11.5, italic: true, color: THEME.colors.dk2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 }
  );

  slide.addShape("roundRect", { x: 6.5, y: 1.65, w: 6.2, h: 4.9, rectRadius: 0.08, fill: { color: THEME.colors.dk1 } });
  slide.addText("An honest limitation", { x: 6.85, y: 1.9, w: 5.5, h: 0.4, fontSize: 15, bold: true, color: "FFFFFF", fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addText(
    [
      { text: "Jamieson & Bass tested fixed weighting schemes like this one — as well as their own proposed probabilistic model — against actual trial-purchase data.", options: { color: "F5E9DA", breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "The fixed-weighting schemes carried real error against observed purchase behavior, with average absolute error commonly reported in the 10–17 percentage point range.", options: { color: "F5E9DA", breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "We use it anyway because it is a real, citable research convention rather than an invented rescale — and because our purpose is comparing price points to each other, not forecasting exact revenue.", options: { color: THEME.colors.accent4, bold: true } },
    ],
    { x: 6.85, y: 2.45, w: 5.5, h: 3.9, fontSize: 13, isTextBox: true, margin: 0, lineSpacingMultiple: 1.2 }
  );
}

// ---------- chart helper ----------
function demandChartData(name, overallData, color) {
  return [
    {
      name,
      labels: overallData.map((r) => money(r.price)),
      values: overallData.map((r) => Math.round(r.mean_probability * 1000) / 10),
    },
  ];
}

function addDemandSlide(title, kicker, productKey, label, color) {
  const slide = addContentSlide(title, kicker);
  const overall = D[productKey].overall;

  const chartData = [
    {
      name: "Avg. purchase probability (%)",
      labels: overall.map((r) => money(r.price)),
      values: overall.map((r) => Math.round(r.mean_probability * 1000) / 10),
    },
  ];
  slide.addChart("bar", chartData, {
    x: 0.6, y: 1.7, w: 6.0, h: 4.6,
    showTitle: true, title: "Purchase probability by price", titleFontFace: "+mn-lt", titleColor: THEME.colors.dk1, titleFontSize: 13,
    showValue: true, dataLabelFontSize: 12, dataLabelColor: THEME.colors.dk1, dataLabelPosition: "outEnd", dataLabelFormatCode: '0"%"',
    chartColors: [color],
    showLegend: false,
    catAxisLabelColor: THEME.colors.dk2, catAxisLabelFontFace: "+mn-lt", catAxisLabelFontSize: 12,
    valAxisHidden: true,
    valAxisMinVal: 0,
    catGridLine: { style: "none" },
    valGridLine: { style: "none" },
    barGapWidthPct: 45,
  });

  // right: table with mean (1-5), probability, revenue index
  const rows = [["Price", "Mean (1–5)", "Avg. probability", "% likely/very likely", "Revenue index"]];
  overall.forEach((r) => rows.push([money(r.price), r.mean_1to5.toFixed(2), pct(r.mean_probability), pct(r.pct_likely_or_very_likely), r.revenue_index.toFixed(2)]));
  const tableRows = rows.map((r, i) => r.map((cell, j) => ({
    text: cell,
    options: {
      bold: i === 0,
      color: i === 0 ? "FFFFFF" : THEME.colors.dk2,
      fill: i === 0 ? { color: THEME.colors.accent2 } : (i % 2 === 0 ? { color: "FBF5EE" } : { color: "FFFFFF" }),
      align: j === 0 ? "left" : "center",
      fontSize: 12.5,
      valign: "middle",
    },
  })));
  slide.addTable(tableRows, { x: 6.9, y: 1.95, w: 6.3, h: 2.2, colW: [1.1, 1.2, 1.3, 1.35, 1.35], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });

  slide.addText(
    `As price rises from ${money(overall[0].price)} to ${money(overall[2].price)}, stated purchase likelihood for ${label} falls steadily — mean (1–5) drops from ${overall[0].mean_1to5.toFixed(2)} to ${overall[2].mean_1to5.toFixed(2)}, and converted purchase probability roughly halves.`,
    { x: 6.9, y: 4.35, w: 5.85, h: 1.9, fontSize: 13, color: THEME.colors.dk2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, lineSpacingMultiple: 1.2 }
  );
  return slide;
}

pres.addSection({ title: "Findings" });
addDemandSlide("Hot Coffee: Aggregate Demand Curve", "Large (20oz) hot coffee — core sample, n=" + D.cleaning.n_core, "hot_coffee", "hot coffee", THEME.colors.accent2);
addDemandSlide("Iced Latte: Aggregate Demand Curve", "Large (32oz) iced latte — core sample, n=" + D.cleaning.n_core, "iced_latte", "the iced latte", THEME.colors.accent3);

// ---------- segment slides ----------
function addSegmentSlide(title, kicker, productKey, segmentKey, segNames, label) {
  const slide = addContentSlide(title, kicker);
  const seg = D[productKey][segmentKey];
  const prices = seg[segNames[0]].map((r) => money(r.price));
  const chartData = segNames.map((name, i) => ({
    name,
    labels: prices,
    values: seg[name].map((r) => Math.round(r.mean_probability * 1000) / 10),
  }));
  const colors = [THEME.colors.accent1, THEME.colors.dk2, THEME.colors.accent3];
  slide.addChart("bar", chartData, {
    x: 0.6, y: 1.7, w: 7.6, h: 4.7,
    barDir: "col",
    showTitle: true, title: "Avg. purchase probability by price and segment", titleFontFace: "+mn-lt", titleColor: THEME.colors.dk1, titleFontSize: 13,
    showValue: true, dataLabelFontSize: 10.5, dataLabelColor: THEME.colors.dk1, dataLabelPosition: "outEnd", dataLabelFormatCode: '0"%"',
    chartColors: colors.slice(0, segNames.length),
    showLegend: true, legendPos: "b", legendColor: THEME.colors.dk2, legendFontSize: 11,
    catAxisLabelColor: THEME.colors.dk2, catAxisLabelFontFace: "+mn-lt", catAxisLabelFontSize: 12,
    valAxisHidden: true,
    valAxisMinVal: 0,
    catGridLine: { style: "none" },
    valGridLine: { style: "none" },
    barGapWidthPct: 35,
  });

  // right: delta callouts at the lowest price point
  const lowPriceRow = seg[segNames[0]][0];
  slide.addText("Gap at " + money(lowPriceRow.price), { x: 8.5, y: 1.85, w: 4.2, h: 0.4, fontSize: 14, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  let yy = 2.35;
  segNames.forEach((name, i) => {
    const prob = seg[name][0].mean_probability;
    slide.addShape("roundRect", { x: 8.5, y: yy, w: 4.2, h: 1.05, rectRadius: 0.07, fill: { color: "FFFFFF" }, line: { color: "E6D9C8", width: 1 } });
    slide.addText(pct(prob), { x: 8.65, y: yy + 0.1, w: 1.5, h: 0.85, fontSize: 26, bold: true, color: colors[i], fontFace: THEME.headFontFace, isTextBox: true, margin: 0, valign: "middle" });
    slide.addText(name, { x: 10.1, y: yy + 0.1, w: 2.45, h: 0.85, fontSize: 13, color: THEME.colors.dk2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, valign: "middle" });
    yy += 1.2;
  });

  return slide;
}

addSegmentSlide(
  "Hot Coffee: Who's Most Willing to Buy",
  "Segment comparison — purchase probability at each price point",
  "hot_coffee", "by_dining_plan", ["Yes", "No"], "hot coffee"
);
addSegmentSlide(
  "Iced Latte: Student Status & Dining Plan",
  "Segment comparison — purchase probability at each price point",
  "iced_latte", "by_student_status", ["Undergrad", "Grad"], "iced latte"
);

// ---------- Elasticity / revenue-maximizing slide ----------
{
  const slide = addContentSlide("Where Revenue Peaks in the Tested Range", "Price × converted probability, for every segment and both products");

  const rev = D.revenue_maximizing;
  const coffeeOverall = rev.find((r) => r.product === "Hot Coffee" && r.segment === "overall");
  const latteOverall = rev.find((r) => r.product === "Iced Latte" && r.segment === "overall");

  slide.addShape("roundRect", { x: 0.6, y: 1.7, w: 6.0, h: 2.1, rectRadius: 0.08, fill: { color: THEME.colors.dk1 } });
  slide.addText("Finding", { x: 0.95, y: 1.9, w: 5.3, h: 0.35, fontSize: 13, bold: true, color: THEME.colors.accent4, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addText(
    "For every segment tested, revenue is highest at the LOWEST price tested and falls steadily as price rises across all 3 points — both products.",
    { x: 0.95, y: 2.25, w: 5.3, h: 1.45, fontSize: 14, color: "FFFFFF", fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, lineSpacingMultiple: 1.2 }
  );

  slide.addShape("roundRect", { x: 6.9, y: 1.7, w: 5.85, h: 2.1, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: "E6D9C8", width: 1 } });
  slide.addText("What this does — and doesn't — prove", { x: 7.25, y: 1.9, w: 5.2, h: 0.35, fontSize: 13, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addText(
    "We never observe an interior peak — only that the true revenue-maximizing price is at or below our lowest tested point ($3.29 coffee / $5.29 latte), not that it IS that point.",
    { x: 7.25, y: 2.25, w: 5.2, h: 1.45, fontSize: 13, color: THEME.colors.dk2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, lineSpacingMultiple: 1.2 }
  );

  // revenue index mini table for both products, overall
  const rows = [["", "Hot Coffee", "", "", "Iced Latte", "", ""], ["Price", "Prob.", "Rev. idx", "", "Price", "Prob.", "Rev. idx"]];
  // Simpler: two separate tables side by side
  const coffeeRows = [["Price", "Prob.", "Revenue idx"]].concat(D.hot_coffee.overall.map((r) => [money(r.price), pct(r.mean_probability), r.revenue_index.toFixed(2)]));
  const latteRows = [["Price", "Prob.", "Revenue idx"]].concat(D.iced_latte.overall.map((r) => [money(r.price), pct(r.mean_probability), r.revenue_index.toFixed(2)]));

  function styledTable(rows) {
    return rows.map((r, i) => r.map((cell) => ({
      text: cell,
      options: {
        bold: i === 0,
        color: i === 0 ? "FFFFFF" : THEME.colors.dk2,
        fill: i === 0 ? { color: THEME.colors.accent2 } : (i % 2 === 0 ? { color: "FBF5EE" } : { color: "FFFFFF" }),
        align: "center", fontSize: 13, valign: "middle",
      },
    })));
  }

  slide.addText("Hot Coffee", { x: 0.6, y: 4.1, w: 5.9, h: 0.35, fontSize: 14, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addTable(styledTable(coffeeRows), { x: 0.6, y: 4.5, w: 5.9, h: 1.8, colW: [1.97, 1.97, 1.97], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });

  slide.addText("Iced Latte", { x: 6.9, y: 4.1, w: 5.85, h: 0.35, fontSize: 14, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addTable(styledTable(latteRows), { x: 6.9, y: 4.5, w: 5.85, h: 1.8, colW: [1.95, 1.95, 1.95], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });
}

// ---------- Statistical significance ----------
{
  const slide = addContentSlide("Are These Differences Statistically Significant?", "Friedman tests across prices, Mann-Whitney tests across segments");

  const products = ["Hot Coffee", "Iced Latte"];
  const colors = [THEME.colors.accent2, THEME.colors.accent3];
  products.forEach((product, i) => {
    const x = 0.6 + i * 6.15;
    const fp = D.significance[product].price_points;
    slide.addShape("roundRect", { x, y: 1.45, w: 5.9, h: 1.4, rectRadius: 0.07, fill: { color: colors[i] } });
    slide.addText(product + ": price points", { x: x + 0.3, y: 1.6, w: 5.3, h: 0.35, fontSize: 13, bold: true, color: "FFFFFF", fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
    slide.addText(
      `Friedman χ² = ${fp.friedman_chi2}, p < 0.0001 — all 3 prices differ significantly (every pairwise comparison significant after Bonferroni correction)`,
      { x: x + 0.3, y: 1.98, w: 5.3, h: 0.8, fontSize: 12, color: "F5E9DA", fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 }
    );
  });

  function segRows(product, segKey) {
    const seg = D.significance[product][segKey];
    const rows = [["Price", "Sig.?"]];
    seg.by_price.forEach((r) => rows.push([r.price_col.split("_")[1] ? "$" + r.price_col.split("_")[1] : r.price_col, r.significant_at_05 ? "Yes (p<.05)" : "No"]));
    return rows;
  }
  function styledTable(rows, headerColor) {
    return rows.map((r, i) => r.map((cell) => ({ text: cell, options: { bold: i === 0, color: i === 0 ? "FFFFFF" : (cell === "No" ? THEME.colors.accent1 : THEME.colors.dk2), fill: i === 0 ? { color: headerColor } : (i % 2 === 0 ? { color: "FBF5EE" } : { color: "FFFFFF" }), align: "center", fontSize: 11.5, valign: "middle" } })));
  }

  slide.addText("Dining plan gap, by price", { x: 0.6, y: 3.15, w: 2.85, h: 0.3, fontSize: 12, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addTable(styledTable(segRows("Hot Coffee", "by_dining_plan"), THEME.colors.accent2), { x: 0.6, y: 3.47, w: 2.85, h: 1.3, colW: [1.42, 1.43], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });
  slide.addText("(Hot Coffee)", { x: 0.6, y: 4.82, w: 2.85, h: 0.3, fontSize: 10, italic: true, color: THEME.colors.accent2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, align: "center" });

  slide.addText("Undergrad/grad gap, by price", { x: 3.6, y: 3.15, w: 2.85, h: 0.3, fontSize: 12, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addTable(styledTable(segRows("Hot Coffee", "by_student_status"), THEME.colors.accent2), { x: 3.6, y: 3.47, w: 2.85, h: 1.3, colW: [1.42, 1.43], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });
  slide.addText("(Hot Coffee)", { x: 3.6, y: 4.82, w: 2.85, h: 0.3, fontSize: 10, italic: true, color: THEME.colors.accent2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, align: "center" });

  slide.addText("Dining plan gap, by price", { x: 6.75, y: 3.15, w: 2.85, h: 0.3, fontSize: 12, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addTable(styledTable(segRows("Iced Latte", "by_dining_plan"), THEME.colors.accent3), { x: 6.75, y: 3.47, w: 2.85, h: 1.3, colW: [1.42, 1.43], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });
  slide.addText("(Iced Latte)", { x: 6.75, y: 4.82, w: 2.85, h: 0.3, fontSize: 10, italic: true, color: THEME.colors.accent3, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, align: "center" });

  slide.addText("Undergrad/grad gap, by price", { x: 9.75, y: 3.15, w: 2.85, h: 0.3, fontSize: 12, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addTable(styledTable(segRows("Iced Latte", "by_student_status"), THEME.colors.accent3), { x: 9.75, y: 3.47, w: 2.85, h: 1.3, colW: [1.42, 1.43], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });
  slide.addText("(Iced Latte)", { x: 9.75, y: 4.82, w: 2.85, h: 0.3, fontSize: 10, italic: true, color: THEME.colors.accent3, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, align: "center" });

  slide.addText(
    "The demand curve itself is rock-solid (both products, p<0.0001). The segment story is more nuanced: the iced latte's dining-plan and undergrad/grad gaps are significant at every price, but for hot coffee, both gaps only emerge at the higher prices — not at the cheapest tested point, where everyone is willing to buy regardless of segment.",
    { x: 0.6, y: 5.0, w: 12.1, h: 1.9, fontSize: 12.5, color: THEME.colors.dk2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 }
  );
}

// ---------- Regression / elasticity ----------
{
  const slide = addContentSlide("Price Elasticity: A Regression Model", "Purchase probability ≈ price + segments, with respondent-clustered standard errors");

  function regRow(coef) {
    const sig = coef.p_value < 0.001 ? "***" : coef.p_value < 0.01 ? "**" : coef.p_value < 0.05 ? "*" : "";
    return [coef.coef.toFixed(3) + sig, coef.p_value < 0.001 ? "<0.001" : coef.p_value.toFixed(3)];
  }
  const coffeeReg = D.regression["Hot Coffee"].coefficients;
  const latteReg = D.regression["Iced Latte"].coefficients;
  const rows = [["Variable", "Coffee coef", "p", "Latte coef", "p"]];
  const names = [["price", "Price ($)"], ["is_dining_plan_yes", "Dining plan = Yes"], ["is_undergrad", "Undergrad"], ["is_female", "Female"]];
  names.forEach(([key, label]) => {
    const c = regRow(coffeeReg[key]);
    const l = regRow(latteReg[key]);
    rows.push([label, c[0], c[1], l[0], l[1]]);
  });
  const tableRows = rows.map((r, i) => r.map((cell) => ({ text: cell, options: { bold: i === 0, color: i === 0 ? "FFFFFF" : THEME.colors.dk2, fill: i === 0 ? { color: THEME.colors.accent2 } : (i % 2 === 0 ? { color: "FBF5EE" } : { color: "FFFFFF" }), align: "center", fontSize: 12, valign: "middle" } })));
  slide.addTable(tableRows, { x: 0.6, y: 1.5, w: 7.2, h: 2.4, colW: [2.2, 1.45, 1.0, 1.45, 1.1], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });
  slide.addText("*** p<0.001  ** p<0.01  * p<0.05       n=630 (210 respondents × 3 prices), clustered by respondent", { x: 0.6, y: 3.98, w: 7.2, h: 0.4, fontSize: 10.5, italic: true, color: THEME.colors.accent2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0 });

  slide.addShape("roundRect", { x: 0.6, y: 4.55, w: 7.2, h: 1.85, rectRadius: 0.07, fill: { color: THEME.colors.dk1 } });
  slide.addText(
    [
      { text: "Headline: ", options: { bold: true, color: THEME.colors.accent4 } },
      { text: "every $0.10 price increase costs about 4.1 points of purchase probability for coffee, 2.6 points for latte — coffee demand is more price-sensitive per dollar (both p<0.001).", options: { color: "F5E9DA", breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "Confound found: ", options: { bold: true, color: THEME.colors.accent4 } },
      { text: "once dining-plan status is controlled for, the undergrad effect vanishes (p=0.93 coffee, p=0.30 latte) — the earlier “undergrads buy more” finding is largely undergrads having more dining plans, not a class-year effect.", options: { color: "F5E9DA" } },
    ],
    { x: 0.9, y: 4.72, w: 6.6, h: 1.55, fontSize: 12, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 }
  );

  slide.addText("What this means for the price-discrimination slide", { x: 8.1, y: 1.5, w: 4.6, h: 0.4, fontSize: 13.5, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addText(
    [
      { text: "Dining-plan status survives the regression as the real, independent driver (significant for latte, marginal for coffee) — strengthening, not weakening, the recommendation to prioritize Dining Dollars integration over any discount.", options: { color: THEME.colors.dk2, breakLine: true, bullet: true } },
      { text: "The “target undergrads less” framing should really be “target dining-plan holders less” — the two overlap heavily, but dining-plan status is the variable actually doing the work.", options: { color: THEME.colors.dk2, bullet: true } },
    ],
    { x: 8.1, y: 2.0, w: 4.6, h: 3.2, fontSize: 12.5, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, paraSpaceAfter: 10, lineSpacingMultiple: 1.15 }
  );
}

pres.addSection({ title: "Recommendation" });
// ---------- Stony Brook comparable ----------
{
  const slide = addContentSlide("Real-World Benchmark: Stony Brook Campus", "A live, operating campus Dunkin' with working Dining Dollars integration", "Recommendation");

  slide.addShape("roundRect", { x: 0.6, y: 1.7, w: 5.7, h: 4.7, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: "E6D9C8", width: 1 } });
  slide.addText("Dunkin' Express — Stony Brook", { x: 0.95, y: 1.95, w: 5.0, h: 0.4, fontSize: 15, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addText("Confirmed live menu board, visited in person", { x: 0.95, y: 2.35, w: 5.0, h: 0.35, fontSize: 11.5, italic: true, color: THEME.colors.accent2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0 });

  slide.addShape("roundRect", { x: 0.95, y: 2.85, w: 5.0, h: 1.3, rectRadius: 0.07, fill: { color: "FBF5EE" } });
  slide.addText("Large Hot Coffee (20oz)", { x: 1.2, y: 3.0, w: 3.0, h: 0.4, fontSize: 13, color: THEME.colors.dk2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0 });
  slide.addText(money(D.stony_brook.hot_coffee_large_20oz), { x: 1.2, y: 3.4, w: 2.0, h: 0.65, fontSize: 32, bold: true, color: THEME.colors.accent2, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });

  slide.addText("No plain \"Iced Latte\" on the board — closest comparables:", { x: 0.95, y: 4.35, w: 5.0, h: 0.35, fontSize: 12.5, bold: true, color: THEME.colors.dk1, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0 });
  let yy2 = 4.75;
  D.stony_brook.iced_latte_closest_comparables.forEach((c) => {
    slide.addText(c.item, { x: 1.2, y: yy2, w: 3.2, h: 0.4, fontSize: 13, color: THEME.colors.dk2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, valign: "middle" });
    slide.addText(money(c.price), { x: 4.4, y: yy2, w: 1.1, h: 0.4, fontSize: 14, bold: true, color: THEME.colors.accent2, fontFace: THEME.headFontFace, isTextBox: true, margin: 0, align: "right", valign: "middle" });
    yy2 += 0.55;
  });

  // right: narrative / tension
  slide.addShape("roundRect", { x: 6.6, y: 1.7, w: 6.15, h: 4.7, rectRadius: 0.08, fill: { color: THEME.colors.dk1 } });
  slide.addText("A deliberate tension, not an error", { x: 6.95, y: 1.95, w: 5.5, h: 0.4, fontSize: 15, bold: true, color: THEME.colors.accent4, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addText(
    [
      { text: `Our survey says revenue is maximized toward the LOW end of the tested range. Stony Brook's actual campus Dunkin' charges ${money(D.stony_brook.hot_coffee_large_20oz)} — almost exactly our HIGH end ($3.69).`, options: { color: "F5E9DA", breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "Why that's not a contradiction:", options: { bold: true, color: "FFFFFF", breakLine: true } },
      { text: "Stated purchase intent in a hypothetical survey is a known over/understater of real behavior. A store with real convenience, brand presence, and working Dining Dollars integration may face materially less elastic real demand than a survey captures in isolation.", options: { color: "F5E9DA", breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "Dining Dollars integration is operationally proven — Stony Brook is existence proof, directly addressing this team's own flagged payment-parity risk from the competitive-landscape phase.", options: { color: THEME.colors.accent4, bold: true } },
    ],
    { x: 6.95, y: 2.5, w: 5.5, h: 3.7, fontSize: 13, isTextBox: true, margin: 0, lineSpacingMultiple: 1.2 }
  );
}

// ---------- Price recommendation ----------
{
  const slide = addContentSlide("Recommended Launch Price", "Balancing the survey's revenue signal against the real-world benchmark", "Recommendation");

  const recs = [
    { product: "Large Hot Coffee (20oz)", price: "$3.49", sub: "vs. $3.29–$3.69 tested, $3.68 at Stony Brook" },
    { product: "Large Iced Latte (32oz)", price: "$5.59", sub: "vs. $5.29–$5.89 tested, no direct Stony Brook match" },
  ];
  const cardW = 5.9, y = 1.75, h = 1.9;
  recs.forEach((r, i) => {
    const x = 0.6 + i * (cardW + 0.3);
    slide.addShape("roundRect", { x, y, w: cardW, h, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: "E6D9C8", width: 1 }, shadow: { type: "outer", color: "2B1B12", opacity: 0.12, blur: 6, offset: 2, angle: 90 } });
    slide.addText(r.product, { x: x + 0.3, y: y + 0.2, w: cardW - 0.6, h: 0.4, fontSize: 14, bold: true, color: THEME.colors.dk1, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0 });
    slide.addText(r.price, { x: x + 0.3, y: y + 0.55, w: 2.5, h: 1.0, fontSize: 44, bold: true, color: THEME.colors.accent1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
    slide.addText(r.sub, { x: x + 0.3, y: y + 1.5, w: cardW - 0.6, h: 0.35, fontSize: 11.5, italic: true, color: THEME.colors.accent2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0 });
  });

  slide.addText("The case for the middle, not the floor", { x: 0.6, y: 3.9, w: 12.1, h: 0.4, fontSize: 15, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  const bullets = [
    { text: "The survey's revenue signal points toward the lowest tested price — but we never bracketed a true peak, so treating $3.29/$5.29 as proven-optimal overstates the data's precision.", options: { color: THEME.colors.dk2, breakLine: true, bullet: true } },
    { text: "The middle price point captures most of the volume advantage of pricing low, while leaving margin versus the floor and staying within a range a real comparable campus store (Stony Brook) already operates profitably near.", options: { color: THEME.colors.dk2, breakLine: true, bullet: true } },
    { text: "This is a volume-vs-margin judgment call, not a statistically certain optimum — we'd revisit with real sales data after a soft launch, same as the original survey design flagged for the Gabor-Granger method generally.", options: { color: THEME.colors.dk2, bullet: true } },
  ];
  slide.addText(bullets, { x: 0.6, y: 4.35, w: 12.1, h: 2.6, fontSize: 13.5, isTextBox: true, margin: 0, paraSpaceAfter: 10, lineSpacingMultiple: 1.1 });
}

// ---------- Price discrimination ----------
{
  const slide = addContentSlide("Price Discrimination: What the Segments Argue For", "Dining-plan status — not class year — is the segment that really buys MORE at every price", "Recommendation");

  const latteRev = D.revenue_maximizing.filter((r) => r.product === "Iced Latte" && (r.segment === "dining_plan" || r.segment === "student_status"));
  const rows = [["Segment", "At lowest tested price, prob.", "Revenue index"]];
  latteRev.forEach((r) => rows.push([r.segment_value, pct(r.mean_probability), r.revenue_index.toFixed(2)]));
  const tableRows = rows.map((r, i) => r.map((cell) => ({
    text: cell,
    options: {
      bold: i === 0,
      color: i === 0 ? "FFFFFF" : THEME.colors.dk2,
      fill: i === 0 ? { color: THEME.colors.accent3 } : (i % 2 === 0 ? { color: "FBF5EE" } : { color: "FFFFFF" }),
      align: "center", fontSize: 12.5, valign: "middle",
    },
  })));
  slide.addText("Iced latte, revenue index by segment", { x: 0.6, y: 1.65, w: 5.9, h: 0.35, fontSize: 13, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addTable(tableRows, { x: 0.6, y: 2.05, w: 5.9, h: 2.3, colW: [2.2, 2.0, 1.7], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });

  slide.addShape("roundRect", { x: 6.9, y: 1.65, w: 5.85, h: 2.7, rectRadius: 0.08, fill: { color: THEME.colors.dk1 } });
  slide.addText("The counterintuitive finding", { x: 7.25, y: 1.85, w: 5.2, h: 0.35, fontSize: 13.5, bold: true, color: THEME.colors.accent4, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addText(
    "Dining-plan holders aren't price-shy — they're the segment MOST willing to pay, and the regression confirms this holds even after controlling for everything else. Undergrads look the same way in the raw averages, but that's mostly because undergrads disproportionately have dining plans — once dining-plan status is accounted for, class year alone adds nothing. A blanket \"student discount\" would discount the customers already most willing to buy at full price.",
    { x: 7.25, y: 2.25, w: 5.2, h: 2.0, fontSize: 12, color: "F5E9DA", fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 }
  );

  slide.addText("What we'd recommend instead", { x: 0.6, y: 4.65, w: 12.1, h: 0.4, fontSize: 15, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  const bullets = [
    { text: "Prioritize Dining Dollars integration operationally (proven feasible at Stony Brook) over a price discount — it converts an already-high-willingness segment into actual purchases by removing payment friction, not price.", options: { color: THEME.colors.dk2, breakLine: true, bullet: true } },
    { text: "If a promotion is wanted, target it at non-dining-plan holders specifically (the segment the regression shows is actually price-resistant), not undergrads as a class — standard price discrimination logic: discount the price-sensitive segment, not the one already willing to pay.", options: { color: THEME.colors.dk2, bullet: true } },
  ];
  slide.addText(bullets, { x: 0.6, y: 5.1, w: 12.1, h: 1.8, fontSize: 13.5, isTextBox: true, margin: 0, paraSpaceAfter: 8, lineSpacingMultiple: 1.1 });
}

// ---------- write ----------
(async () => {
  const outPath = path.join(__dirname, "Dunkin_Pricing_Analysis.pptx");
  await pres.writeFile({ fileName: outPath });
  await applyTheme(outPath, THEME);
  console.log("Wrote", outPath);
})();
