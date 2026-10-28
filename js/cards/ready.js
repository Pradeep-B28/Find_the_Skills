// What it does: renders the "Ready to apply" card when all skills are matched.
// Uses: config.js, js/copy.js, js/links.js.
// Used by: js/screens/result.js.

import { CONFIG } from "../../config.js";
import { COPY } from "../copy.js";
import { salesUrl, utmLink } from "../links.js";

export function render({ report, roleObj }) {
  const main = report.main;
  const isFullMatch = main.total > 0 && main.have === main.total;
  if (!isFullMatch) return null;

  const card = document.createElement("div");
  card.className = "result-card card-ready";

  const title = document.createElement("h3");
  title.className = "result-card-title";
  title.textContent = COPY.result.readyTitle;
  card.appendChild(title);

  const bodyP = document.createElement("p");
  bodyP.className = "result-card-line";
  bodyP.textContent = COPY.result.readyBody;
  card.appendChild(bodyP);

  const actions = document.createElement("div");
  actions.className = "result-card-actions";

  const siteUrl = utmLink(CONFIG.website, "result");
  const siteBtn = document.createElement("a");
  siteBtn.href = siteUrl;
  siteBtn.target = "_blank";
  siteBtn.rel = "noopener";
  siteBtn.className = "btn btn-primary";
  siteBtn.textContent = COPY.result.allPrograms;
  actions.appendChild(siteBtn);

  const waUrl = salesUrl(CONFIG.salesWhatsApp, { role: roleObj }, report);
  if (waUrl) {
    const waBtn = document.createElement("a");
    waBtn.href = waUrl;
    waBtn.target = "_blank";
    waBtn.rel = "noopener";
    waBtn.className = "btn btn-secondary";
    waBtn.textContent = COPY.cta.whatsapp;
    actions.appendChild(waBtn);
  }

  card.appendChild(actions);
  return card;
}
