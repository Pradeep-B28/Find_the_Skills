// What it does: renders the "Other Wrench Wise programs" details drawer on the result screen.
// Uses: config.js, js/copy.js, js/links.js, js/content.js.
// Used by: js/screens/result.js.

import { CONFIG } from "../../config.js";
import { COPY, t } from "../copy.js";
import { utmLink } from "../links.js";
import { program as getProgram } from "../content.js";

export function render({ report }) {
  if (report.kind !== "tech") return null;
  if (CONFIG.features && CONFIG.features.otherPrograms === false) return null;

  const ranked = report.ranked || [];
  const topProgId = report.program?.id;

  // Other programs that cover at least one missing skill
  const otherProgs = ranked.filter(p => p.id !== topProgId && p.covered && p.covered.length > 0);
  if (otherProgs.length === 0) return null;

  const details = document.createElement("details");
  details.className = "result-card card-others";

  const summary = document.createElement("summary");
  summary.className = "result-card-title";
  summary.style.cursor = "pointer";
  summary.textContent = COPY.result.others;
  details.appendChild(summary);

  const listContainer = document.createElement("div");
  listContainer.style.display = "flex";
  listContainer.style.flexDirection = "column";
  listContainer.style.gap = "0.75rem";
  listContainer.style.marginTop = "0.75rem";

  for (const item of otherProgs) {
    const progObj = getProgram(item.id);
    const progName = progObj ? progObj.name : item.id;
    const coveredCount = item.covered.length;

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.justifyContent = "space-between";
    row.style.gap = "0.5rem";
    row.style.padding = "0.5rem 0";
    row.style.borderBottom = "1px solid var(--border)";

    const info = document.createElement("div");
    const nameP = document.createElement("div");
    nameP.style.fontWeight = "600";
    nameP.style.fontSize = "0.9375rem";
    nameP.textContent = progName;
    info.appendChild(nameP);

    const coverP = document.createElement("div");
    coverP.style.fontSize = "0.8125rem";
    coverP.style.color = "var(--muted)";
    const countStr = t(coveredCount === 1 ? "result.otherLine.one" : "result.otherLine", { n: coveredCount });
    coverP.textContent = countStr;
    info.appendChild(coverP);
    row.appendChild(info);

    const progPage = progObj ? progObj.page : "";
    const progLink = document.createElement("a");
    progLink.href = utmLink(progPage || CONFIG.website, "others");
    progLink.target = "_blank";
    progLink.rel = "noopener";
    progLink.className = "btn btn-text";
    progLink.textContent = COPY.cta.program;
    row.appendChild(progLink);

    listContainer.appendChild(row);
  }

  details.appendChild(listContainer);
  return details;
}
