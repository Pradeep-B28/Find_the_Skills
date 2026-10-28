// What it does: renders the switch-to-tech card for non-tech job posts.
// Uses: config.js, js/copy.js, js/score.js, js/links.js, js/content.js.
// Used by: js/screens/result.js.

import { CONFIG } from "../../config.js";
import { COPY } from "../copy.js";
import { carryLine, switchLine } from "../score.js";
import { salesUrl, utmLink } from "../links.js";
import { skill as getSkill, program as getProgram } from "../content.js";

export function render({ report, roleObj }) {
  if (report.kind !== "nontech") return null;
  // If nothing missing, ready.js handles it
  if (report.job.total > 0 && report.job.missing.length === 0) return null;

  const card = document.createElement("div");
  card.className = "result-card card-switch";

  const title = document.createElement("h3");
  title.className = "result-card-title";
  title.textContent = COPY.switch.title;
  card.appendChild(title);

  // If switchCard feature is off
  if (CONFIG.features && CONFIG.features.switchCard === false) {
    const siteLink = document.createElement("a");
    siteLink.href = utmLink(CONFIG.website, "switch");
    siteLink.target = "_blank";
    siteLink.rel = "noopener";
    siteLink.className = "btn btn-primary";
    siteLink.textContent = COPY.cta.website;
    card.appendChild(siteLink);
    return card;
  }

  // Carry-over line
  const carry = report.carry;
  const skillNameFn = (id) => {
    const s = getSkill(id);
    return s ? s.name : id;
  };

  const carryText = carryLine(carry, skillNameFn);
  if (carryText) {
    const carryP = document.createElement("p");
    carryP.className = "result-card-line";
    carryP.textContent = carryText;
    card.appendChild(carryP);

    // Up to 6 bridge skill chips
    const hasTicked = carry && carry.have && carry.have.length > 0;
    const bridgeList = hasTicked ? carry.have : (carry ? carry.found : []);
    const skillsToShow = bridgeList.slice(0, 6);

    if (skillsToShow.length > 0) {
      const chipsFlow = document.createElement("div");
      chipsFlow.className = "chips-flow";

      for (const id of skillsToShow) {
        const s = getSkill(id);
        const chip = document.createElement("span");
        chip.className = hasTicked ? "chip-have" : "chip-miss";

        if (hasTicked) {
          const svgNS = "http://www.w3.org/2000/svg";
          const svg = document.createElementNS(svgNS, "svg");
          svg.setAttribute("viewBox", "0 0 24 24");
          svg.setAttribute("aria-hidden", "true");
          const path = document.createElementNS(svgNS, "path");
          path.setAttribute("d", "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z");
          svg.appendChild(path);
          chip.appendChild(svg);
        }

        const nameSpan = document.createElement("span");
        nameSpan.textContent = s ? s.name : id;
        chip.appendChild(nameSpan);

        chipsFlow.appendChild(chip);
      }
      card.appendChild(chipsFlow);
    }
  }

  const switchProgId = report.switchProgram;
  const switchProg = switchProgId ? getProgram(switchProgId) : null;

  if (switchProg) {
    const swLine = document.createElement("p");
    swLine.className = "result-card-line";
    swLine.style.fontWeight = "600";
    swLine.textContent = switchLine(switchProg.name);
    card.appendChild(swLine);

    const whyP = document.createElement("p");
    whyP.className = "result-card-line";
    whyP.style.color = "var(--text-2)";
    whyP.textContent = roleObj?.switchWhy || COPY.switch.whyDefault;
    card.appendChild(whyP);

    const actions = document.createElement("div");
    actions.className = "result-card-actions";

    const progPage = switchProg ? switchProg.page : "";
    const progUrl = utmLink(progPage || CONFIG.website, "switch");
    const waUrl = salesUrl(CONFIG.salesWhatsApp, { role: roleObj }, report);

    if (waUrl && !window.__JPX_PRESENTER__) {
      const waBtn = document.createElement("a");
      waBtn.href = waUrl;
      waBtn.target = "_blank";
      waBtn.rel = "noopener";
      waBtn.className = "btn btn-primary cta-whatsapp-btn";
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
  } else {
    // No switch program
    const siteLink = document.createElement("a");
    siteLink.href = utmLink(CONFIG.website, "switch");
    siteLink.target = "_blank";
    siteLink.rel = "noopener";
    siteLink.className = "btn btn-primary";
    siteLink.textContent = COPY.cta.website;
    card.appendChild(siteLink);
  }

  return card;
}
