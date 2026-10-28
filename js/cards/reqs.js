// What it does: renders the "Also asks for" requirements card on the result screen.
// Uses: js/copy.js, js/content.js.
// Used by: js/screens/result.js.

import { COPY } from "../copy.js";
import { groupedReqs } from "../content.js";

export function render({ sessionState }) {
  const reqItems = sessionState?.reqs || [];
  if (reqItems.length === 0) return null;

  const groups = groupedReqs(reqItems);
  if (groups.length === 0) return null;

  const card = document.createElement("div");
  card.className = "result-card card-reqs reqs-card";

  const title = document.createElement("h3");
  title.className = "reqs-card-title";
  title.textContent = COPY.check.reqHead;
  card.appendChild(title);

  const note = document.createElement("p");
  note.className = "reqs-card-note";
  note.textContent = COPY.result.reqNote;
  card.appendChild(note);

  for (const g of groups) {
    const row = document.createElement("div");
    row.className = "reqs-group-row";

    const name = document.createElement("div");
    name.className = "reqs-group-name";
    name.textContent = g.name;
    row.appendChild(name);

    const pills = document.createElement("div");
    pills.className = "reqs-pills";

    for (const label of g.labels) {
      const pill = document.createElement("span");
      pill.className = "req-pill";
      pill.textContent = label;
      pills.appendChild(pill);
    }

    row.appendChild(pills);
    card.appendChild(row);
  }

  return card;
}
