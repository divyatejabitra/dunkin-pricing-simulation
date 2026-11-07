// A standalone "pre-read" companion to Dunkin_Pricing_Analysis.pptx - same
// findings and visuals, but each slide carries full paragraph explanations
// so it stands on its own without a presenter narrating (e.g. for a
// professor reading it outside the live 11/12 check-in).

const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const { applyTheme } = require("/Users/tejavu/.claude/skills/synced/cff63fa9-035b-44ee-9687-36011ea8f34c_6cee6839-b02c-4c77-95cf-b9dcdb16d253/pptx/scripts/apply_theme.js");

const D = JSON.parse(fs.readFileSync(path.join(__dirname, "deck_data.json"), "utf8"));

const THEME = {
  name: "Dunkin Pricing Detailed",
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
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

pres.defineSlideMaster({
  title: "TITLE",
  background: { color: THEME.colors.dk1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.3, w: 11.7, h: 1.6, fontSize: 38, bold: true, color: C.background1, fontFace: THEME.headFontFace, align: "left" }, text: "" } },
    { placeholder: { options: { name: "subtitle", type: "body", x: 0.8, y: 3.95, w: 11.0, h: 1.3, fontSize: 16, color: THEME.colors.accent1, fontFace: THEME.bodyFontFace, align: "left" }, text: "" } },
    { text: { options: { x: 0.8, y: 6.7, w: 11.7, h: 0.4, fontSize: 11, color: THEME.colors.accent4, fontFace: THEME.bodyFontFace }, text: "MKT465 Capstone  •  Simon Business School, University of Rochester  •  Detailed companion document" } },
  ],
});

pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: THEME.colors.lt2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 12.1, h: 0.65, fontSize: 25, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, align: "left" }, text: "" } },
    { placeholder: { options: { name: "kicker", type: "body", x: 0.6, y: 0.95, w: 12.1, h: 0.35, fontSize: 12.5, italic: true, color: THEME.colors.accent2, fontFace: THEME.bodyFontFace, align: "left" }, text: "" } },
  ],
  slideNumber: { x: 12.7, y: 7.12, fontFace: THEME.bodyFontFace, fontSize: 10, color: THEME.colors.accent2 },
});

function addContentSlide(title, kicker, sectionTitle) {
  const slide = pres.addSlide({ masterName: "CONTENT", sectionTitle: sectionTitle || "Findings" });
  slide.addText(title, { placeholder: "title" });
  if (kicker) slide.addText(kicker, { placeholder: "kicker" });
  return slide;
}

function money(x) { return "$" + x.toFixed(2); }
function pct(x) { return Math.round(x * 1000) / 10 + "%"; }

// Full-width explanatory paragraph block (the core difference from the summary deck)
function addExplanation(slide, paragraphs, opts) {
  const x = opts.x, y = opts.y, w = opts.w, h = opts.h;
  const runs = [];
  paragraphs.forEach((p, i) => {
    if (typeof p === "string") {
      runs.push({ text: p, options: { color: THEME.colors.dk2, breakLine: true } });
    } else {
      runs.push({ text: p.text, options: Object.assign({ color: THEME.colors.dk2, breakLine: true }, p.options || {}) });
    }
    if (i < paragraphs.length - 1) runs.push({ text: "", options: { breakLine: true } });
  });
  slide.addText(runs, { x, y, w, h, fontSize: opts.fontSize || 13, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0, lineSpacingMultiple: 1.18, valign: "top" });
}

// ---------- Slide 1: Title ----------
pres.addSection({ title: "Title" });
{
  const slide = pres.addSlide({ masterName: "TITLE", sectionTitle: "Title" });
  slide.addText("Dunkin' at River Campus", { placeholder: "title" });
  slide.addText(
    "Price-point survey analysis & launch pricing recommendation — detailed companion document. This version expands every slide from the summary deck into a full written explanation, meant to be read on its own rather than presented live.",
    { placeholder: "subtitle" }
  );
}

// ---------- Slide 2: Data cleaning (detailed) ----------
pres.addSection({ title: "Methodology" });
{
  const slide = addContentSlide("Data Cleaning & Methodology", "How 324 raw responses became a 210-person core analysis sample", "Methodology");

  const cards = [
    { n: D.cleaning.n_raw, label: "Raw pooled responses", color: THEME.colors.dk2 },
    { n: "−" + D.cleaning.n_flatlined, label: "Flat-lined", color: THEME.colors.accent1 },
    { n: "−" + D.cleaning.n_severe_nonmono, label: "Severe reversal", color: THEME.colors.accent1 },
    { n: D.cleaning.n_core, label: "Core clean sample", color: THEME.colors.accent3 },
  ];
  const cardW = 2.7, gap = 0.2, startX = 0.6, y = 1.45, cardH = 1.15;
  cards.forEach((c, i) => {
    const x = startX + i * (cardW + gap);
    slide.addShape("roundRect", { x, y, w: cardW, h: cardH, rectRadius: 0.07, fill: { color: "FFFFFF" }, line: { color: "E6D9C8", width: 1 } });
    slide.addText(String(c.n), { x, y: y + 0.08, w: cardW, h: 0.6, align: "center", fontSize: 24, bold: true, color: c.color, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
    slide.addText(c.label, { x: x + 0.1, y: y + 0.68, w: cardW - 0.2, h: 0.4, align: "center", fontSize: 10.5, color: THEME.colors.dk2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0 });
  });

  addExplanation(slide, [
    { text: "This analysis started from 324 pooled survey responses collected across every team in the course. Before any price-sensitivity analysis could be trusted, we screened for two specific, well-defined data-quality problems rather than discarding respondents on a vague “this looks off” basis.", options: {} },
    { text: "Straight-lining (62 respondents excluded): these respondents gave the exact same 1–5 rating to all six price questions, spanning two different products (hot coffee and iced latte) at three price points each. A respondent genuinely weighing price should show some variation across six distinct questions covering two different beverages — one number six times in a row is the textbook signature of clicking through without reading.", options: { bold: false } },
    { text: "Economically irrational reversals (13 respondents excluded): these respondents had stated purchase likelihood INCREASE by two or more points on the 5-point scale as price rose — e.g. “unlikely” at $3.49 but “very likely” at $3.69 for the same product. Gabor-Granger methodology assumes demand is non-increasing in price; a jump this large signals the respondent wasn't tracking which price went with which question. We deliberately kept smaller, single-point reversals (29 additional respondents) — a one-point wobble between prices 30 cents apart is plausible scale noise, not inattention, and excluding it would discard real signal along with noise.", options: {} },
    { text: "Two further decisions were made for reasons other than response quality. Exact duplicate rows (46, likely from merging team spreadsheets) were kept rather than deduplicated, per team direction — treated as real pooled responses. And the 52 respondents who identified as “Not affiliated with the University of Rochester” were kept but moved into a separate comparison segment rather than pooled with the core sample or dropped: the client decision is about River Campus demand specifically, so blending in off-campus respondents would dilute the signal that matters, while their responses remain real data worth a side-by-side look.", options: {} },
  ], { x: 0.6, y: 2.85, w: 12.1, h: 4.3, fontSize: 12.5 });
}

// ---------- Slide 3: Probability transformation (detailed) ----------
{
  const slide = addContentSlide("From a 1–5 Scale to a Purchase Probability", "Translating stated likelihood into an expected-purchase rate, the way market researchers do", "Methodology");

  const rows = [["Response", "Meaning", "Probability"], ["5", "Very likely", "75%"], ["4", "Likely", "25%"], ["3", "Neutral", "10%"], ["2", "Unlikely", "5%"], ["1", "Very unlikely", "2%"]];
  const tableRows = rows.map((r, i) => r.map((cell) => ({ text: cell, options: { bold: i === 0, color: i === 0 ? "FFFFFF" : THEME.colors.dk2, fill: i === 0 ? { color: THEME.colors.accent2 } : (i % 2 === 0 ? { color: "FBF5EE" } : { color: "FFFFFF" }), align: "center", fontSize: 12, valign: "middle" } })));
  slide.addTable(tableRows, { x: 8.9, y: 1.45, w: 3.8, h: 2.4, colW: [1.1, 1.7, 1.0], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });

  addExplanation(slide, [
    { text: "A 1–5 Likert scale is useful for comparing relative demand across price points, but it doesn't directly answer the business question: what share of customers would actually buy at a given price? To bridge that gap, each response needs converting into an estimated purchase probability.", options: {} },
    { text: "We did not invent our own conversion scale. We used a weighting scheme examined in Jamieson, L.F. and Bass, F.M. (1989), “Adjusting Stated Intention Measures to Predict Trial Purchase of New Products: A Comparison of Models and Methods,” Journal of Marketing Research 26(3): 336–345 — a foundational paper on exactly this problem. Among the schemes the paper examined, one assigns 75% to the top box (“Very likely”), 25% to the second box, and sharply discounted probabilities further down (10%, 5%, 2%), shown in the table at right. Note the top box does NOT convert to 100% — this reflects a well-documented finding that survey respondents systematically overstate real purchase intent, especially at the scale's top.", options: {} },
    { text: "An honest limitation, drawn directly from the same paper: when Jamieson and Bass tested fixed weighting schemes like this one against actual trial-purchase data, the schemes carried real error, with average absolute error commonly reported in the 10–17 percentage point range — their own contribution was a more sophisticated probabilistic model that outperformed these simpler schemes. We use the simpler, citable weighting scheme here because our purpose is comparing price points and segments to EACH OTHER — a relative ranking — rather than forecasting precise real-world revenue, where the added complexity of their full model would matter more.", options: {} },
  ], { x: 0.6, y: 1.45, w: 8.0, h: 5.3, fontSize: 13 });
}

// ---------- Slides 4-5: demand curves (detailed) ----------
pres.addSection({ title: "Findings" });
function addDemandSlideDetailed(title, kicker, productKey, label, color) {
  const slide = addContentSlide(title, kicker);
  const overall = D[productKey].overall;

  const chartData = [{ name: "Avg. purchase probability (%)", labels: overall.map((r) => money(r.price)), values: overall.map((r) => Math.round(r.mean_probability * 1000) / 10) }];
  slide.addChart("bar", chartData, {
    x: 0.6, y: 1.4, w: 5.1, h: 3.1,
    showTitle: true, title: "Purchase probability by price", titleFontFace: "+mn-lt", titleColor: THEME.colors.dk1, titleFontSize: 12,
    showValue: true, dataLabelFontSize: 11, dataLabelColor: THEME.colors.dk1, dataLabelPosition: "outEnd", dataLabelFormatCode: '0"%"',
    chartColors: [color], showLegend: false,
    catAxisLabelColor: THEME.colors.dk2, catAxisLabelFontFace: "+mn-lt", catAxisLabelFontSize: 11,
    valAxisHidden: true, valAxisMinVal: 0, catGridLine: { style: "none" }, valGridLine: { style: "none" }, barGapWidthPct: 45,
  });

  const rows = [["Price", "Mean (1–5)", "Prob.", "Revenue idx"]];
  overall.forEach((r) => rows.push([money(r.price), r.mean_1to5.toFixed(2), pct(r.mean_probability), r.revenue_index.toFixed(2)]));
  const tableRows = rows.map((r, i) => r.map((cell) => ({ text: cell, options: { bold: i === 0, color: i === 0 ? "FFFFFF" : THEME.colors.dk2, fill: i === 0 ? { color: THEME.colors.accent2 } : (i % 2 === 0 ? { color: "FBF5EE" } : { color: "FFFFFF" }), align: "center", fontSize: 11.5, valign: "middle" } })));
  slide.addTable(tableRows, { x: 0.6, y: 4.65, w: 5.1, h: 1.7, colW: [1.25, 1.35, 1.2, 1.3], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });

  const d0 = overall[0], d1 = overall[1], d2 = overall[2];
  addExplanation(slide, [
    { text: `This chart and table show the demand curve for ${label} across the three prices tested in the pooled, cleaned survey (core sample, n=${D.cleaning.n_core}): ${money(d0.price)}, ${money(d1.price)}, and ${money(d2.price)}. Mean stated likelihood on the raw 1–5 scale drops from ${d0.mean_1to5.toFixed(2)} to ${d1.mean_1to5.toFixed(2)} to ${d2.mean_1to5.toFixed(2)} as price rises — a steady, monotonic decline with no surprising kinks, which is itself a sign the data-cleaning step worked: a noisier sample would more often show an inconsistent, bumpy curve.`, options: {} },
    { text: `After converting those ratings to purchase probability (per the Jamieson & Bass scale on the methodology slide), the pattern sharpens: probability roughly halves across the tested range, from ${pct(d0.mean_probability)} at ${money(d0.price)} down to ${pct(d2.mean_probability)} at ${money(d2.price)}. The “% likely/very likely” figure (top-two-box, a simpler and more common industry shorthand) tells the same story even more starkly: ${pct(d0.pct_likely_or_very_likely)} down to ${pct(d2.pct_likely_or_very_likely)}.`, options: {} },
    { text: `The revenue index column (price × average converted probability) is the quantity that actually matters for a pricing decision — it's highest at ${money(d0.price)} and falls at every step up from there, within this tested range. What that does and doesn't prove is covered on its own slide later in this document, since it's the same pattern for both products and every segment, and the caveat matters.`, options: {} },
  ], { x: 6.1, y: 1.4, w: 6.6, h: 4.9, fontSize: 13 });
  return slide;
}

addDemandSlideDetailed("Hot Coffee: Aggregate Demand Curve", "Large (20oz) hot coffee — core sample, n=" + D.cleaning.n_core, "hot_coffee", "hot coffee", THEME.colors.accent2);
addDemandSlideDetailed("Iced Latte: Aggregate Demand Curve", "Large (32oz) iced latte — core sample, n=" + D.cleaning.n_core, "iced_latte", "the iced latte", THEME.colors.accent3);

// ---------- Slides 6-7: segments (detailed) ----------
function addSegmentSlideDetailed(title, kicker, productKey, segmentKey, segNames, label, segmentDescription) {
  const slide = addContentSlide(title, kicker);
  const seg = D[productKey][segmentKey];
  const prices = seg[segNames[0]].map((r) => money(r.price));
  const chartData = segNames.map((name) => ({ name, labels: prices, values: seg[name].map((r) => Math.round(r.mean_probability * 1000) / 10) }));
  const colors = [THEME.colors.accent1, THEME.colors.dk2, THEME.colors.accent3];
  slide.addChart("bar", chartData, {
    x: 0.6, y: 1.4, w: 5.6, h: 3.5, barDir: "col",
    showTitle: true, title: "Avg. purchase probability by price and segment", titleFontFace: "+mn-lt", titleColor: THEME.colors.dk1, titleFontSize: 12,
    showValue: true, dataLabelFontSize: 9.5, dataLabelColor: THEME.colors.dk1, dataLabelPosition: "outEnd", dataLabelFormatCode: '0"%"',
    chartColors: colors.slice(0, segNames.length), showLegend: true, legendPos: "b", legendColor: THEME.colors.dk2, legendFontSize: 10.5,
    catAxisLabelColor: THEME.colors.dk2, catAxisLabelFontFace: "+mn-lt", catAxisLabelFontSize: 11,
    valAxisHidden: true, valAxisMinVal: 0, catGridLine: { style: "none" }, valGridLine: { style: "none" }, barGapWidthPct: 35,
  });

  const low = seg[segNames[0]][0];
  const gapText = segNames.map((n) => `${n}: ${pct(seg[n][0].mean_probability)}`).join("  vs.  ");
  slide.addText(`Gap at ${money(low.price)}:  ${gapText}`, { x: 0.6, y: 5.05, w: 5.6, h: 0.5, fontSize: 12.5, bold: true, color: THEME.colors.dk1, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0 });

  const r0 = seg[segNames[0]], r1 = seg[segNames[1]];
  const gapPct = Math.round((r0[0].mean_probability - r1[0].mean_probability) * 1000) / 10;
  addExplanation(slide, [
    { text: segmentDescription, options: {} },
    { text: `At the lowest tested price (${money(r0[0].price)}), ${segNames[0]} shows ${pct(r0[0].mean_probability)} average purchase probability versus ${pct(r1[0].mean_probability)} for ${segNames[1]} — a gap of roughly ${Math.abs(gapPct)} percentage points. That gap persists in the same direction across all three tested prices for ${label}, not just at one point, which is what makes it a real segment difference rather than noise at a single price.`, options: {} },
    { text: `This matters directly for the price-discrimination question later in this document: the segment with higher purchase probability at every price is the one a business would normally charge MORE, not less — the opposite of a typical "discount this group" instinct, and worth sitting with before assuming any segment needs a lower price to buy in.`, options: {} },
  ], { x: 6.5, y: 1.4, w: 6.2, h: 4.9, fontSize: 13 });
  return slide;
}

addSegmentSlideDetailed(
  "Hot Coffee: Who's Most Willing to Buy",
  "Segment comparison — purchase probability at each price point",
  "hot_coffee", "by_dining_plan", ["Yes", "No"], "hot coffee",
  "This segment compares respondents who currently have a University meal plan or Dining Dollars (“Yes”) against those who don't (“No”). This is this team's own standing question since the 9/24 competitive-landscape phase, where we confirmed Starbucks, Peet's, and Connections Café all already accept Dining Dollars on campus — making payment-method parity a real structural risk for an on-campus Dunkin' that doesn't integrate."
);
addSegmentSlideDetailed(
  "Iced Latte: Student Status & Dining Plan",
  "Segment comparison — purchase probability at each price point",
  "iced_latte", "by_student_status", ["Undergrad", "Grad"], "the iced latte",
  "This segment compares undergraduate and graduate students — the two largest UR-affiliated respondent groups in the core sample (graduate students were in fact the majority of raw responses, reflecting who actually took the survey on this campus)."
);

// ---------- Slide 8: revenue-maximizing (detailed) ----------
{
  const slide = addContentSlide("Where Revenue Peaks in the Tested Range", "Price × converted probability, for every segment and both products");

  const coffeeRows = [["Price", "Prob.", "Rev idx"]].concat(D.hot_coffee.overall.map((r) => [money(r.price), pct(r.mean_probability), r.revenue_index.toFixed(2)]));
  const latteRows = [["Price", "Prob.", "Rev idx"]].concat(D.iced_latte.overall.map((r) => [money(r.price), pct(r.mean_probability), r.revenue_index.toFixed(2)]));
  function styledTable(rows, headerColor) {
    return rows.map((r, i) => r.map((cell) => ({ text: cell, options: { bold: i === 0, color: i === 0 ? "FFFFFF" : THEME.colors.dk2, fill: i === 0 ? { color: headerColor } : (i % 2 === 0 ? { color: "FBF5EE" } : { color: "FFFFFF" }), align: "center", fontSize: 12, valign: "middle" } })));
  }
  slide.addText("Hot Coffee", { x: 0.6, y: 1.45, w: 2.9, h: 0.3, fontSize: 13, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addTable(styledTable(coffeeRows, THEME.colors.accent2), { x: 0.6, y: 1.78, w: 2.9, h: 1.6, colW: [0.97, 0.97, 0.96], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });
  slide.addText("Iced Latte", { x: 0.6, y: 3.55, w: 2.9, h: 0.3, fontSize: 13, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addTable(styledTable(latteRows, THEME.colors.accent3), { x: 0.6, y: 3.88, w: 2.9, h: 1.6, colW: [0.97, 0.97, 0.96], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });

  addExplanation(slide, [
    { text: "For every segment examined and both products, the revenue index (price × converted average purchase probability) is highest at the LOWEST price tested and falls at every step up from there. In plain terms: within the range we tested, demand is elastic enough that cutting price gains more in volume than it loses in per-unit revenue, every time.", options: {} },
    { text: "That is a real, consistent finding — but it is important not to over-claim what it proves. We tested three prices per product, all fairly close together (40 cents apart for coffee, 60 cents apart for latte). Revenue falling steadily across all three tested points tells us the true revenue-maximizing price is AT OR BELOW our lowest tested point ($3.29 for coffee, $5.29 for latte). It does NOT tell us that $3.29 or $5.29 IS the true optimum — we never bracketed a peak, because we never tested anything lower. A price of $2.99, for instance, might generate even more revenue; this design simply can't see that.", options: {} },
    { text: "This finding sits in real tension with the real-world benchmark on the next slide, which is exactly why we present both rather than picking the number the survey alone would suggest.", options: { bold: true, color: THEME.colors.dk1 } },
  ], { x: 3.8, y: 1.45, w: 8.9, h: 5.1, fontSize: 13.5 });
}

// ---------- Slide 9: Stony Brook (detailed) ----------
pres.addSection({ title: "Recommendation" });
{
  const slide = addContentSlide("Real-World Benchmark: Stony Brook Campus", "A live, operating campus Dunkin' with working Dining Dollars integration", "Recommendation");

  slide.addShape("roundRect", { x: 0.6, y: 1.45, w: 3.4, h: 1.5, rectRadius: 0.07, fill: { color: "FFFFFF" }, line: { color: "E6D9C8", width: 1 } });
  slide.addText("Large Hot Coffee (20oz)", { x: 0.85, y: 1.6, w: 2.9, h: 0.35, fontSize: 12, color: THEME.colors.dk2, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0 });
  slide.addText(money(D.stony_brook.hot_coffee_large_20oz), { x: 0.85, y: 1.95, w: 2.0, h: 0.8, fontSize: 32, bold: true, color: THEME.colors.accent2, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });

  addExplanation(slide, [
    { text: "The survey data points toward pricing at the low end of the tested range. Before accepting that at face value, we sought an existence proof: is there a real, operating campus Dunkin' location with working Dining Dollars integration, and if so, what does it actually charge? We visited Stony Brook University's campus Dunkin' Express and confirmed the live menu board in person.", options: {} },
    { text: `Stony Brook's Large (20oz) Hot Coffee — the same size tested in our survey — is priced at ${money(D.stony_brook.hot_coffee_large_20oz)}. That sits almost exactly at the HIGH end of our tested range ($3.69), not the low end our survey's revenue curve points toward. This is a genuine tension worth sitting with rather than smoothing over.`, options: {} },
    { text: "The board does not list a plain “Iced Latte” at all — the closest comparable items are Iced Chai Latte and Cold Brew, both Large at $5.49. Neither is a true match for a plain iced latte (different base ingredients, different flavor profile), so we present this as a directional reference point for the latte category rather than a direct comparison.", options: {} },
    { text: "Why this isn't a contradiction: stated purchase intent in a hypothetical survey is a well-documented over/understater of real behavior (the same limitation flagged on the probability-transformation slide). A real store offers convenience, brand presence, and — crucially — working Dining Dollars integration, which may make real demand meaningfully less price-elastic than an isolated survey captures. Separately, Dining Dollars integration itself is now operationally proven, not hypothetical: Stony Brook directly answers the payment-parity risk this team flagged back in the competitive-landscape phase, where Starbucks, Peet's, and Connections Café were found to already accept Dining Dollars on River Campus.", options: {} },
  ], { x: 4.3, y: 1.45, w: 8.4, h: 5.3, fontSize: 13 });
}

// ---------- Slide 10: recommendation (detailed) ----------
{
  const slide = addContentSlide("Recommended Launch Price", "Balancing the survey's revenue signal against the real-world benchmark", "Recommendation");

  const recs = [
    { product: "Large Hot Coffee (20oz)", price: "$3.49" },
    { product: "Large Iced Latte (32oz)", price: "$5.59" },
  ];
  recs.forEach((r, i) => {
    const x = 0.6 + i * 3.1;
    slide.addShape("roundRect", { x, y: 1.45, w: 2.9, h: 1.5, rectRadius: 0.07, fill: { color: "FFFFFF" }, line: { color: "E6D9C8", width: 1 } });
    slide.addText(r.product, { x: x + 0.2, y: 1.58, w: 2.5, h: 0.35, fontSize: 11.5, bold: true, color: THEME.colors.dk1, fontFace: THEME.bodyFontFace, isTextBox: true, margin: 0 });
    slide.addText(r.price, { x: x + 0.2, y: 1.95, w: 2.0, h: 0.75, fontSize: 32, bold: true, color: THEME.colors.accent1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  });

  addExplanation(slide, [
    { text: "We recommend $3.49 for the large hot coffee and $5.59 for the large iced latte — the MIDDLE of each tested range, not the floor the survey's revenue index alone points toward.", options: { bold: true, color: THEME.colors.dk1 } },
    { text: "The case for the middle rather than the floor rests on three points. First, the survey's revenue signal is directionally real but imprecise: as explained on the revenue-peak slide, we never bracketed a true interior maximum, so treating $3.29/$5.29 as a proven-optimal price overstates what the data actually shows — it only shows that revenue is better at the low end of what we tested, not that the low end is the true peak.", options: {} },
    { text: "Second, the middle price point still captures most of the volume advantage of pricing low relative to the top of the range, while preserving real margin versus the floor — and it lands within a range a real, operating comparable (Stony Brook) already serves profitably, which the survey data alone has no way to validate.", options: {} },
    { text: "Third, and most importantly: this is a volume-versus-margin judgment call informed by imperfect survey data, not a statistically certain optimum. We would revisit this recommendation with real sales data after a soft launch — exactly the same caveat the original survey design flagged for the Gabor-Granger method in general, that stated purchase intent is directional, not a precise forecast.", options: {} },
  ], { x: 6.9, y: 1.45, w: 5.8, h: 5.3, fontSize: 13 });
}

// ---------- Slide 11: price discrimination (detailed) ----------
{
  const slide = addContentSlide("Price Discrimination: What the Segments Argue For", "Dining-plan holders and undergrads buy MORE at every price — not less", "Recommendation");

  const latteRev = D.revenue_maximizing.filter((r) => r.product === "Iced Latte" && (r.segment === "dining_plan" || r.segment === "student_status"));
  const rows = [["Segment", "Prob. @ lowest price", "Rev idx"]];
  latteRev.forEach((r) => rows.push([r.segment_value, pct(r.mean_probability), r.revenue_index.toFixed(2)]));
  const tableRows = rows.map((r, i) => r.map((cell) => ({ text: cell, options: { bold: i === 0, color: i === 0 ? "FFFFFF" : THEME.colors.dk2, fill: i === 0 ? { color: THEME.colors.accent3 } : (i % 2 === 0 ? { color: "FBF5EE" } : { color: "FFFFFF" }), align: "center", fontSize: 11.5, valign: "middle" } })));
  slide.addText("Iced latte, revenue index by segment", { x: 0.6, y: 1.45, w: 5.0, h: 0.3, fontSize: 12.5, bold: true, color: THEME.colors.dk1, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  slide.addTable(tableRows, { x: 0.6, y: 1.78, w: 5.0, h: 2.1, colW: [1.8, 1.8, 1.4], border: { type: "solid", color: "E6D9C8", pt: 0.75 }, autoPage: false });

  addExplanation(slide, [
    { text: "Standard price-discrimination theory says: charge more to the segment with higher willingness to pay, and discount the segment that's actually price-sensitive. Our segment data lets us apply that logic directly rather than guessing at it.", options: {} },
    { text: "The counterintuitive finding: undergraduates and dining-plan holders are not the price-shy segments — they are the segments MOST willing to buy, at every price point tested, for both products. A blanket “student discount” or “dining-plan discount” would therefore discount the customers who are already most willing to purchase at full price, leaving revenue on the table rather than capturing it.", options: {} },
    { text: "What we'd recommend instead: prioritize Dining Dollars integration operationally — proven feasible at Stony Brook — over a price discount for that segment. Integration converts an already-high-willingness group into actual purchases by removing payment friction, not by cutting price, which is a strictly better lever when the segment was never price-resistant to begin with. If the team wants to run a promotion at all, standard price-discrimination logic points it at graduate students and non-dining-plan holders — the segments actually showing measurably lower willingness to buy — rather than at undergrads.", options: {} },
  ], { x: 5.9, y: 1.45, w: 6.8, h: 5.1, fontSize: 13.5 });
}

(async () => {
  const outPath = path.join(__dirname, "Dunkin_Pricing_Analysis_Detailed.pptx");
  await pres.writeFile({ fileName: outPath });
  await applyTheme(outPath, THEME);
  console.log("Wrote", outPath);
})();
