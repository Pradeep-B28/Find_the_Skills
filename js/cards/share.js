// What it does: renders the share card on the result screen with status/post size pills and share actions.
// Uses: config.js, js/copy.js, js/share.js.
// Used by: js/screens/result.js.

import { CONFIG } from "../../config.js";
import { COPY } from "../copy.js";
import { shareMyMatch, shareOnWhatsApp, copyCompareLink } from "../share.js";

export function renderShareCard({ report, sessionState, roleObj = null }) {
  if (CONFIG.features && CONFIG.features.shareImage === false) {
    return null;
  }

  const jobSkills = sessionState.jobIds || [];
  const softSkills = sessionState.softIds || [];
  const allFoundIds = [...jobSkills, ...softSkills];
  const maxLinkSkills = CONFIG.limits?.maxLinkSkills || 60;

  const card = document.createElement("div");
  card.className = "result-card share-card";

  const title = document.createElement("h3");
  title.className = "result-card-title";
  title.textContent = COPY.share.title;
  card.appendChild(title);

  // Size pills: Status (default) vs Post
  let currentSize = "status";

  const pillsRow = document.createElement("div");
  pillsRow.className = "share-size-pills";

  const statusPill = document.createElement("button");
  statusPill.type = "button";
  statusPill.className = "size-pill active";
  statusPill.textContent = COPY.share.status;

  const postPill = document.createElement("button");
  postPill.type = "button";
  postPill.className = "size-pill";
  postPill.textContent = COPY.share.post;

  statusPill.addEventListener("click", () => {
    currentSize = "status";
    statusPill.classList.add("active");
    postPill.classList.remove("active");
  });

  postPill.addEventListener("click", () => {
    currentSize = "post";
    postPill.classList.add("active");
    statusPill.classList.remove("active");
  });

  pillsRow.appendChild(statusPill);
  pillsRow.appendChild(postPill);
  card.appendChild(pillsRow);

  // Actions column
  const actionsCol = document.createElement("div");
  actionsCol.className = "share-actions-col";

  // 1. Share my match
  const shareBtn = document.createElement("button");
  shareBtn.type = "button";
  shareBtn.className = "btn btn-primary share-btn";
  shareBtn.textContent = COPY.share.image;
  shareBtn.addEventListener("click", () => {
    shareMyMatch({
      report,
      sessionState,
      roleObj,
      size: currentSize
    });
  });
  actionsCol.appendChild(shareBtn);

  // 2. Send on WhatsApp
  const waBtn = document.createElement("button");
  waBtn.type = "button";
  waBtn.className = "btn btn-secondary share-btn";
  waBtn.textContent = COPY.share.whatsapp;
  waBtn.addEventListener("click", () => {
    shareOnWhatsApp({
      report,
      sessionState,
      roleObj
    });
  });
  actionsCol.appendChild(waBtn);

  // 3. Copy link (hide when total skills > maxLinkSkills)
  if (allFoundIds.length <= maxLinkSkills) {
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "btn btn-secondary share-btn";
    copyBtn.textContent = COPY.share.copy;
    copyBtn.addEventListener("click", () => {
      copyCompareLink({
        report,
        sessionState,
        roleObj,
        buttonEl: copyBtn
      });
    });
    actionsCol.appendChild(copyBtn);
  }

  card.appendChild(actionsCol);
  return card;
}
