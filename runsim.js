import { GolfSimulation } from "./golfsim.js";
import {
  trump_p_l, trump_l_s, trump_s_s,
  obama_l_s, obama_s_s,
  obama_p_l_ahead, obama_p_l_behind
} from "./input.js";

function renderSummary(results, n) {
  const el = document.getElementById("summary");
  el.innerHTML = `
    <p><b>Simulations:</b> ${n}</p>
    <p><b>Win %</b> — Trump: ${results.trumpWinPercentage.toFixed(2)}% |
      Obama: ${results.obamaWinPercentage.toFixed(2)}% |
      Tie: ${results.tiePercentage.toFixed(2)}%</p>
    <p><b>Average total strokes</b> — Trump: ${results.trumpAvgScore.toFixed(2)}
      (95% CI ${results.trumpConfidenceInterval.lower.toFixed(2)}–${results.trumpConfidenceInterval.upper.toFixed(2)})
      | Obama: ${results.obamaAvgScore.toFixed(2)}
      (95% CI ${results.obamaConfidenceInterval.lower.toFixed(2)}–${results.obamaConfidenceInterval.upper.toFixed(2)})</p>
    <p><b>Std Dev</b> — Trump: ${results.trumpStdDev.toFixed(2)} | Obama: ${results.obamaStdDev.toFixed(2)}</p>
    <p><b>Strategy usage</b> — Trump Long: ${results.trumpStrategyStats.longPercentage.toFixed(1)}%,
      Obama Long: ${results.obamaStrategyStats.longPercentage.toFixed(1)}%</p>
  `;
}

function renderScorecards(rounds) {
  const el = document.getElementById("scorecards");
  el.innerHTML = "";

  rounds.forEach((r, idx) => {
    const winner = r.trumpFinalScore < r.obamaFinalScore ? "Trump" : (r.trumpFinalScore > r.obamaFinalScore ? "Obama" : "Tie");
    const card = document.createElement("div");
    card.style.border = "1px solid #ddd";
    card.style.borderRadius = "12px";
    card.style.padding = "12px";
    card.style.marginBottom = "10px";

    card.innerHTML = `
      <b>Round ${idx + 1}</b> — Winner: <b>${winner}</b><br/>
      Trump: ${r.trumpFinalScore} | Obama: ${r.obamaFinalScore}
    `;
    el.appendChild(card);
  });
}

function renderRound1Details(round1) {
  const el = document.getElementById("round1-details");

  const header = `
    <table style="width:100%; border-collapse: collapse;">
      <tr>
        <th style="border-bottom:1px solid #ccc; text-align:left;">Hole</th>
        <th style="border-bottom:1px solid #ccc; text-align:left;">Trump (shot / success / strokes)</th>
        <th style="border-bottom:1px solid #ccc; text-align:left;">Obama (shot / success / strokes)</th>
      </tr>
  `;

  const rows = round1.trumpHoleDetails.map((t, i) => {
    const o = round1.obamaHoleDetails[i];
    return `
      <tr>
        <td style="padding:6px 0; border-bottom:1px solid #eee;">${t.hole}</td>
        <td style="padding:6px 0; border-bottom:1px solid #eee;">
          ${t.teeShotType.toUpperCase()} / ${t.teeShotSuccess ? "✓" : "✗"} / ${t.totalStrokes}
        </td>
        <td style="padding:6px 0; border-bottom:1px solid #eee;">
          ${o.teeShotType.toUpperCase()} / ${o.teeShotSuccess ? "✓" : "✗"} / ${o.totalStrokes}
        </td>
      </tr>
    `;
  }).join("");

  el.innerHTML = header + rows + `</table>`;
}

function getSimConfig() {
  // 注意：input.js 导出来的 value 是字符串，这里转 Number
  return {
    trumpLongProb: Number(trump_p_l),
    trumpLongSuccessProb: Number(trump_l_s),
    trumpShortSuccessProb: Number(trump_s_s),
    obamaLongSuccessProb: Number(obama_l_s),
    obamaShortSuccessProb: Number(obama_s_s),
    obamaLongProbWhenAhead: Number(obama_p_l_ahead),
    obamaLongProbWhenBehindOrTied: Number(obama_p_l_behind),
  };
}

function run() {
  const n = Number(document.getElementById("sim-count").value || 10);
  const sim = new GolfSimulation(getSimConfig());

  // 1) 统计结果
  const results = sim.runDetailedAnalysis(n);
  renderSummary(results, n);

  // 2) 展示前 10 轮的总分卡
  const roundsToShow = Math.min(10, n);
  const rounds = Array.from({ length: roundsToShow }, () => sim.simulateRound());
  renderScorecards(rounds);

  // 3) 展示第 1 轮逐洞细节（18洞）
  renderRound1Details(rounds[0]);
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("run-btn");
  btn.addEventListener("click", run);
});
