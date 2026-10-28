// What it does: match result screen with score ring, tier stamp, lines, chips, and lower cards.
// Uses: config.js, js/copy.js, js/content.js, js/session.js, js/score.js, js/events.js, js/fx/ring.js, js/fx/stamp.js, js/cards/*.
// Used by: js/router.js, js/main.js.

import { CONFIG } from "../../config.js";
import { COPY, t } from "../copy.js";
import { skill as getSkill, role as getRole } from "../content.js";
import { getState, report, reset } from "../session.js";
import { tier, pct, matchLine, softLine, headToHead } from "../score.js";
import { emit } from "../events.js";
import { renderRing } from "../fx/ring.js";
import { renderStamp } from "../fx/stamp.js";
import { render as renderProgramCard } from "../cards/program.js";
import { render as renderSwitchCard } from "../cards/switch.js";
import { render as renderReadyCard } from "../cards/ready.js";
import { render as renderReqsCard } from "../cards/reqs.js";
import { render as renderOthersCard } from "../cards/others.js";
import { render as renderSessionCard } from "../cards/session.js";
import { renderShareCard } from "../cards/share.js";

let containerEl = null;

function createSvgCheck() {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z");
  svg.appendChild(path);
  return svg;
}

export function mount(rootEl) {
  containerEl = document.createElement("div");
  containerEl.className = "result-screen";
  rootEl.appendChild(containerEl);
  return containerEl;
}

export function enter({ onCheckAnother = null, onChangeTicks = null } = {}) {
  if (!containerEl) return;
  leave();

  while (containerEl.firstChild) {
    containerEl.removeChild(containerEl.firstChild);
  }

  const sessionState = getState();
  const rep = report();
  const main = rep.main;
  const roleObj = rep.roleId ? getRole(rep.roleId) : null;

  // Main 2-column layout grid for laptop
  const layoutGrid = document.createElement("div");
  layoutGrid.className = "result-layout-grid";

  // LEFT COLUMN: Ring, stamp, lines, chip lists
  const leftCol = document.createElement("div");
  leftCol.className = "result-left-col";

  // Ring and stamp container
  const heroArea = document.createElement("div");
  heroArea.className = "result-hero";

  const ringBox = document.createElement("div");
  ringBox.className = "ring-container";
  heroArea.appendChild(ringBox);

  renderRing({
    container: ringBox,
    have: main.have,
    total: main.total,
    kind: main.kind
  });

  // Tier stamp
  const stampText = tier(main.have, main.total);
  renderStamp(heroArea, stampText);

  leftCol.appendChild(heroArea);

  // Match line
  const mLineText = matchLine(main);
  const matchLineEl = document.createElement("h2");
  matchLineEl.className = "match-line-text";
  matchLineEl.textContent = mLineText;
  leftCol.appendChild(matchLineEl);

  // Announce in live region
  const liveEl = document.getElementById("live-region");
  if (liveEl) {
    liveEl.textContent = mLineText;
  }

  // Soft line
  const sLineText = softLine(main, rep.soft);
  if (sLineText && rep.soft && rep.soft.total > 0) {
    const softLineRow = document.createElement("div");
    softLineRow.className = "soft-line-row";

    const sLineP = document.createElement("div");
    sLineP.className = "soft-line-text";
    sLineP.textContent = sLineText;
    softLineRow.appendChild(sLineP);

    const track = document.createElement("div");
    track.className = "soft-bar-track";
    const fill = document.createElement("div");
    fill.className = "soft-bar-fill";
    fill.style.width = "0%";
    track.appendChild(fill);
    softLineRow.appendChild(track);

    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const softPct = Math.round((rep.soft.have.length / rep.soft.total) * 100);
    if (prefersReduced) {
      fill.style.transition = "none";
      fill.style.width = `${softPct}%`;
    } else {
      requestAnimationFrame(() => {
        fill.style.width = `${softPct}%`;
      });
    }

    leftCol.appendChild(softLineRow);
  }

  // Head to head (if friend score exists from compare link)
  if (sessionState.friendM !== null && sessionState.friendM !== undefined) {
    const h2hText = headToHead(main.have, sessionState.friendM);
    const h2hP = document.createElement("p");
    h2hP.className = "result-card-line";
    h2hP.style.fontWeight = "700";
    h2hP.style.marginTop = "0.75rem";
    h2hP.textContent = h2hText;
    leftCol.appendChild(h2hP);
  }

  // Chip lists
  const listsContainer = document.createElement("div");
  listsContainer.className = "chip-lists-container";

  function createChipList(titleStr, skillIds, isHave) {
    if (!skillIds || skillIds.length === 0) return null;

    const block = document.createElement("div");
    block.className = "chip-list-block";

    const blockTitle = document.createElement("div");
    blockTitle.className = "chip-list-title";
    blockTitle.textContent = titleStr;
    block.appendChild(blockTitle);

    const flow = document.createElement("div");
    flow.className = "chips-flow";

    for (const id of skillIds) {
      const s = getSkill(id);
      const chip = document.createElement("span");
      chip.className = isHave ? "chip-have" : "chip-miss";

      if (isHave) {
        chip.appendChild(createSvgCheck());
      }

      const nameSpan = document.createElement("span");
      nameSpan.textContent = s ? s.name : id;
      chip.appendChild(nameSpan);

      flow.appendChild(chip);
    }

    block.appendChild(flow);
    return block;
  }

  // 1. You have (job skills)
  const haveBlock = createChipList(
    t("result.have", { n: rep.job.have.length }),
    rep.job.have,
    true
  );
  if (haveBlock) listsContainer.appendChild(haveBlock);

  // 2. To learn (missing job skills)
  const learnBlock = createChipList(
    t("result.learn", { n: rep.job.missing.length }),
    rep.job.missing,
    false
  );
  if (learnBlock) listsContainer.appendChild(learnBlock);

  // 3. Soft skills you have
  if (rep.soft && rep.soft.have.length > 0) {
    const softHaveBlock = createChipList(
      t("result.softHave", { n: rep.soft.have.length }),
      rep.soft.have,
      true
    );
    if (softHaveBlock) listsContainer.appendChild(softHaveBlock);
  }

  // 4. Soft skills to build
  if (rep.soft && rep.soft.missing.length > 0) {
    const softBuildBlock = createChipList(
      t("result.softBuild", { n: rep.soft.missing.length }),
      rep.soft.missing,
      false
    );
    if (softBuildBlock) listsContainer.appendChild(softBuildBlock);
  }

  leftCol.appendChild(listsContainer);
  layoutGrid.appendChild(leftCol);

  // RIGHT COLUMN: Cards
  const rightCol = document.createElement("div");
  rightCol.className = "result-right-col";

  const cardModel = { report: rep, sessionState, roleObj };

  // Ready card (if 100% match)
  const readyEl = renderReadyCard(cardModel);
  if (readyEl) rightCol.appendChild(readyEl);

  // Program card (if tech post with gap)
  const programEl = renderProgramCard(cardModel);
  if (programEl) rightCol.appendChild(programEl);

  // Switch card (if non-tech post with gap)
  const switchEl = renderSwitchCard(cardModel);
  if (switchEl) rightCol.appendChild(switchEl);

  // Also asks for card
  const reqsEl = renderReqsCard(cardModel);
  if (reqsEl) rightCol.appendChild(reqsEl);

  // Other programs card
  const othersEl = renderOthersCard(cardModel);
  if (othersEl) rightCol.appendChild(othersEl);

  // Free session card
  const sessionEl = renderSessionCard(cardModel);
  if (sessionEl) rightCol.appendChild(sessionEl);

  // Share card (hidden in presenter mode)
  if (window.__JPX_PRESENTER__) {
    const presP = document.createElement("p");
    presP.className = "presenter-end";
    presP.textContent = COPY.presenter.end;
    rightCol.appendChild(presP);
  } else {
    const shareEl = renderShareCard(cardModel);
    if (shareEl) rightCol.appendChild(shareEl);
  }

  layoutGrid.appendChild(rightCol);
  containerEl.appendChild(layoutGrid);

  // Bottom action buttons
  const actionsEl = document.createElement("div");
  actionsEl.className = "result-actions";

  const anotherBtn = document.createElement("button");
  anotherBtn.type = "button";
  anotherBtn.className = "btn btn-secondary";
  anotherBtn.textContent = COPY.result.another;
  anotherBtn.addEventListener("click", () => {
    reset();
    if (onCheckAnother) onCheckAnother();
  });
  actionsEl.appendChild(anotherBtn);

  const changeBtn = document.createElement("button");
  changeBtn.type = "button";
  changeBtn.className = "btn btn-text";
  changeBtn.textContent = COPY.result.change;
  changeBtn.addEventListener("click", () => {
    if (onChangeTicks) onChangeTicks();
  });
  actionsEl.appendChild(changeBtn);

  containerEl.appendChild(actionsEl);

  // Emit result:shown
  emit("result:shown", {
    kind: rep.kind,
    mainKind: main.kind,
    total: main.total,
    have: main.have,
    pct: pct(main.have, main.total),
    softTotal: rep.soft ? rep.soft.total : 0,
    softHave: rep.soft ? rep.soft.have.length : 0,
    programId: rep.program?.id || null,
    covered: rep.program?.covers?.length || 0,
    missingIds: rep.job ? rep.job.missing : [],
    roleId: rep.roleId,
    source: sessionState.source
  });
}

export function leave() {
  // Cleanup if needed
}
