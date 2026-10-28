// What it does: renders the SVG score match ring and animates fill and center count.
// Uses: js/fx/countup.js, js/copy.js, js/score.js.
// Used by: js/screens/result.js.

import { countUp } from "./countup.js";
import { COPY, t } from "../copy.js";
import { pct } from "../score.js";

export function renderRing({ container, have = 0, total = 0, kind = "job" }) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const wrapper = document.createElement("div");
  wrapper.className = "ring-wrapper";

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 120 120");
  svg.setAttribute("class", "ring-svg");
  svg.setAttribute("aria-hidden", "true");

  // Gradient definition
  const defs = document.createElementNS(svgNS, "defs");
  const grad = document.createElementNS(svgNS, "linearGradient");
  grad.setAttribute("id", "brandGradStroke");
  grad.setAttribute("x1", "0%");
  grad.setAttribute("y1", "0%");
  grad.setAttribute("x2", "100%");
  grad.setAttribute("y2", "100%");

  const stop1 = document.createElementNS(svgNS, "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#059669");

  const stop2 = document.createElementNS(svgNS, "stop");
  stop2.setAttribute("offset", "50%");
  stop2.setAttribute("stop-color", "#0D9488");

  const stop3 = document.createElementNS(svgNS, "stop");
  stop3.setAttribute("offset", "100%");
  stop3.setAttribute("stop-color", "#06B6D4");

  grad.appendChild(stop1);
  grad.appendChild(stop2);
  grad.appendChild(stop3);
  defs.appendChild(grad);
  svg.appendChild(defs);

  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.16

  // Track circle
  const track = document.createElementNS(svgNS, "circle");
  track.setAttribute("cx", "60");
  track.setAttribute("cy", "60");
  track.setAttribute("r", String(radius));
  track.setAttribute("class", "ring-track-circle");
  svg.appendChild(track);

  // Fill circle
  const fill = document.createElementNS(svgNS, "circle");
  fill.setAttribute("cx", "60");
  fill.setAttribute("cy", "60");
  fill.setAttribute("r", String(radius));
  fill.setAttribute("class", "ring-fill-circle");
  fill.style.strokeDasharray = String(circumference);
  fill.style.strokeDashoffset = String(circumference);
  svg.appendChild(fill);

  wrapper.appendChild(svg);

  // Center Content
  const centerContent = document.createElement("div");
  centerContent.className = "ring-center-content";

  const scoreText = document.createElement("div");
  scoreText.className = "ring-score-text";

  const numSpan = document.createElement("span");
  numSpan.textContent = "0";
  scoreText.appendChild(numSpan);

  const totalSpan = document.createElement("span");
  totalSpan.style.fontSize = "0.7em";
  totalSpan.style.color = "var(--muted)";
  totalSpan.textContent = `/${total}`;
  scoreText.appendChild(totalSpan);

  centerContent.appendChild(scoreText);

  const subLabel = document.createElement("div");
  subLabel.className = "ring-sub-label";
  subLabel.textContent = kind === "job" ? COPY.result.matchedJob : COPY.result.matchedSoft;
  centerContent.appendChild(subLabel);

  wrapper.appendChild(centerContent);
  container.appendChild(wrapper);

  // Percentage badge under ring
  const matchPct = pct(have, total);
  const pctBadge = document.createElement("div");
  pctBadge.className = "ring-pct-badge";
  pctBadge.textContent = t("result.pct", { pct: matchPct });
  container.appendChild(pctBadge);

  // Trigger animations
  const targetOffset = total > 0 ? circumference * (1 - have / total) : circumference;

  requestAnimationFrame(() => {
    fill.style.strokeDashoffset = String(targetOffset);
    countUp(numSpan, have, 900);
  });
}
