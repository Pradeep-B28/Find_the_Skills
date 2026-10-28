// What it does: lays out the post with highlights, using text nodes only.
// Uses: content.js, js/copy.js, js/score.js.
// Used by: js/screens/scan.js.

import { skill } from "../content.js";
import { reqLabel } from "../score.js";
import { t } from "../copy.js";

export function renderFilm(container, { text = "", spans = [], truncated = false, maxChars = 15000 }) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const postText = text.slice(0, maxChars);
  let lastIndex = 0;

  for (const span of spans) {
    if (span.start > lastIndex) {
      const textChunk = postText.slice(lastIndex, span.start);
      container.appendChild(document.createTextNode(textChunk));
    }

    const mark = document.createElement("mark");
    mark.className = `film-mark hit-${span.kind}`;

    if (span.kind === "req") {
      if (span.key) {
        mark.setAttribute("data-key", span.key);
        mark.setAttribute("title", reqLabel(span.key));
      }
    } else {
      if (span.ids && span.ids.length > 0) {
        mark.setAttribute("data-ids", span.ids.join(","));
        const names = span.ids.map(id => {
          const s = skill(id);
          return s ? s.name : id;
        });
        mark.setAttribute("title", names.join(", "));
      }
    }

    const markText = postText.slice(span.start, span.end);
    mark.appendChild(document.createTextNode(markText));
    container.appendChild(mark);

    lastIndex = span.end;
  }

  if (lastIndex < postText.length) {
    const trailingText = postText.slice(lastIndex);
    container.appendChild(document.createTextNode(trailingText));
  }

  if (truncated) {
    const truncEl = document.createElement("span");
    truncEl.className = "film-truncated";
    truncEl.textContent = t("scan.truncated", { max: maxChars });
    container.appendChild(truncEl);
  }
}

export function getMarks(container, viewportEl) {
  const markEls = container.querySelectorAll("mark.film-mark");
  const marks = [];

  const viewportRect = viewportEl.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  for (const el of markEls) {
    const rect = el.getBoundingClientRect();
    const top = rect.top - containerRect.top;
    const bottom = rect.bottom - containerRect.top;
    const left = rect.left - containerRect.left;

    const idsAttr = el.getAttribute("data-ids");
    const keyAttr = el.getAttribute("data-key");
    const kind = el.classList.contains("hit-job") ? "job" : (el.classList.contains("hit-soft") ? "soft" : "req");

    marks.push({
      el,
      top,
      bottom,
      left,
      kind,
      ids: idsAttr ? idsAttr.split(",") : [],
      key: keyAttr || null,
      lit: false
    });
  }

  // Sort marks by top position, and then left position
  marks.sort((a, b) => {
    if (Math.abs(a.top - b.top) > 5) {
      return a.top - b.top;
    }
    return a.left - b.left;
  });

  return marks;
}

export function lightUp(mark) {
  if (mark.lit) return;
  mark.lit = true;
  mark.el.classList.add("lit");

  // Quick scale from 1.08 to 1.0 over 220 ms
  mark.el.style.transform = "scale(1.08)";
  mark.el.style.transition = "transform 220ms cubic-bezier(0, 0, 0.2, 1)";
  requestAnimationFrame(() => {
    mark.el.style.transform = "scale(1)";
  });
}

export function finishAll(container) {
  const markEls = container.querySelectorAll("mark.film-mark");
  for (const el of markEls) {
    el.classList.add("lit");
    el.style.transform = "none";
  }
}
