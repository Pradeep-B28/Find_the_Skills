// What it does: renders the free live session invitation card.
// Uses: config.js, js/copy.js.
// Used by: js/screens/result.js, js/screens/home.js.

import { CONFIG } from "../../config.js";
import { COPY } from "../copy.js";

export function render() {
  if (!CONFIG.session || !CONFIG.session.enabled || !CONFIG.session.title) {
    return null;
  }

  const card = document.createElement("div");
  card.className = "result-card card-session";

  const label = document.createElement("div");
  label.style.fontSize = "0.75rem";
  label.style.fontWeight = "700";
  label.style.textTransform = "uppercase";
  label.style.letterSpacing = "0.06em";
  label.style.color = "var(--brand)";
  label.textContent = COPY.session.label;
  card.appendChild(label);

  const title = document.createElement("h3");
  title.className = "result-card-title";
  title.textContent = CONFIG.session.title;
  card.appendChild(title);

  if (CONFIG.session.when) {
    const whenP = document.createElement("p");
    whenP.className = "result-card-line";
    whenP.textContent = CONFIG.session.when;
    card.appendChild(whenP);
  }

  if (CONFIG.session.url) {
    const actions = document.createElement("div");
    actions.className = "result-card-actions";

    const btn = document.createElement("a");
    btn.href = CONFIG.session.url;
    btn.target = "_blank";
    btn.rel = "noopener";
    btn.className = "btn btn-primary";
    btn.textContent = COPY.session.btn;
    actions.appendChild(btn);

    card.appendChild(actions);
  }

  return card;
}
