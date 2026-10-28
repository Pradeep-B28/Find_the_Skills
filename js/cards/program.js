// What it does: renders the "Close the gap" program recommendation card for tech posts.
// Uses: config.js, js/copy.js, js/score.js, js/links.js, js/content.js.
// Used by: js/screens/result.js.

import { CONFIG } from "../../config.js";
import { COPY, t } from "../copy.js";
import { programLine, list } from "../score.js";
import { salesUrl, utmLink } from "../links.js";
import { skill as getSkill, program as getProgram } from "../content.js";

export function render({ report, roleObj }) {
  if (report.kind !== "tech") return null;
  // If nothing missing, ready.js handles it
  if (report.job.missing.length === 0) return null;

  const card = document.createElement("div");
  card.className = "result-card card-program";

  const title = document.createElement("h3");
  title.className = "result-card-title";
  title.textContent = COPY.result.gapTitle;
  card.appendChild(title);

  const prog = report.program;
  const missing = report.job.missing || [];

  if (prog && prog.covered && prog.covered.length > 0) {
    const progObj = getProgram(prog.id);
    const progName = progObj ? progObj.name : prog.id;
    const coveredIds = prog.covered;
    const uncoveredIds = prog.notCovered || [];

    const line = document.createElement("p");
    line.className = "result-card-line";
    line.textContent = programLine(progName, coveredIds.length, missing.length);
    card.appendChild(line);

    // Covered chips
    if (coveredIds.length > 0) {
      const chipsFlow = document.createElement("div");
      chipsFlow.className = "chips-flow";

      for (const id of coveredIds) {
        const s = getSkill(id);
        const chip = document.createElement("span");
        chip.className = "chip-have";

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("aria-hidden", "true");
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z");
        svg.appendChild(path);
        chip.appendChild(svg);

        const nameSpan = document.createElement("span");
        nameSpan.textContent = s ? s.name : id;
        chip.appendChild(nameSpan);

        chipsFlow.appendChild(chip);
      }
      card.appendChild(chipsFlow);
    }

    // Uncovered note
    if (uncoveredIds.length > 0) {
      const uncoveredNames = uncoveredIds.map(id => {
        const s = getSkill(id);
        return s ? s.name : id;
      });
      const notInP = document.createElement("p");
      notInP.className = "result-card-note";
      notInP.textContent = t("result.notIn", { list: list(uncoveredNames) });
      card.appendChild(notInP);
    }

    // Actions
    const actions = document.createElement("div");
    actions.className = "result-card-actions";

    const progPage = progObj ? progObj.page : "";
    const progUrl = utmLink(progPage || CONFIG.website, "result");
    const waUrl = salesUrl(CONFIG.salesWhatsApp, { role: roleObj }, report);

    if (waUrl) {
      const waBtn = document.createElement("a");
      waBtn.href = waUrl;
      waBtn.target = "_blank";
      waBtn.rel = "noopener";
      waBtn.className = "btn btn-primary";
      waBtn.textContent = COPY.cta.whatsapp;
      actions.appendChild(waBtn);

      const progLink = document.createElement("a");
      progLink.href = progUrl;
      progLink.target = "_blank";
      progLink.rel = "noopener";
      progLink.className = "btn btn-text";
      progLink.textContent = COPY.cta.program;
      actions.appendChild(progLink);
    } else {
      const progBtn = document.createElement("a");
      progBtn.href = progUrl;
      progBtn.target = "_blank";
      progBtn.rel = "noopener";
      progBtn.className = "btn btn-primary";
      progBtn.textContent = COPY.cta.program;
      actions.appendChild(progBtn);
    }

    card.appendChild(actions);

    const note = document.createElement("p");
    note.className = "result-card-note";
    note.textContent = COPY.result.syllabus;
    card.appendChild(note);
  } else {
    // No program covers the gap
    const line = document.createElement("p");
    line.className = "result-card-line";
    line.textContent = t("lines.programNone");
    card.appendChild(line);

    const actions = document.createElement("div");
    actions.className = "result-card-actions";

    const waUrl = salesUrl(CONFIG.salesWhatsApp, { role: roleObj }, report);
    if (waUrl) {
      const waBtn = document.createElement("a");
      waBtn.href = waUrl;
      waBtn.target = "_blank";
      waBtn.rel = "noopener";
      waBtn.className = "btn btn-primary";
      waBtn.textContent = COPY.cta.whatsapp;
      actions.appendChild(waBtn);
    }

    const siteLink = document.createElement("a");
    siteLink.href = utmLink(CONFIG.website, "result");
    siteLink.target = "_blank";
    siteLink.rel = "noopener";
    siteLink.className = waUrl ? "btn btn-text" : "btn btn-primary";
    siteLink.textContent = COPY.cta.website;
    actions.appendChild(siteLink);

    card.appendChild(actions);
  }

  return card;
}
