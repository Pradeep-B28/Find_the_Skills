// What it does: tick your skills screen with grouped job chips, soft chips, mentions, role change, and sticky bar.
// Uses: config.js, js/copy.js, js/content.js, js/session.js, js/events.js, js/fx/film.js.
// Used by: js/router.js, js/main.js.

import { CONFIG } from "../../config.js";
import { COPY, t } from "../copy.js";
import {
  ROLES,
  skill as getSkill,
  role as getRole,
  groupedJob,
  groupedReqs
} from "../content.js";
import {
  getState,
  toggle,
  setRole,
  clearTicks,
  setRemember,
  isRememberEnabled
} from "../session.js";
import { emit } from "../events.js";
import { renderFilm, finishAll } from "../fx/film.js";

let containerEl = null;

function createSvgCheck() {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "chip-check-icon");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z");
  svg.appendChild(path);
  return svg;
}

export function mount(rootEl) {
  containerEl = document.createElement("div");
  containerEl.className = "check-screen";
  rootEl.appendChild(containerEl);
  return containerEl;
}

export function enter({ onShowMatch = null } = {}) {
  if (!containerEl) return;
  leave();

  while (containerEl.firstChild) {
    containerEl.removeChild(containerEl.firstChild);
  }

  const sessionState = getState();
  const jobIds = sessionState.jobIds || [];
  const softIds = sessionState.softIds || [];
  const counts = sessionState.scan?.counts || {};
  const isLink = sessionState.source === "link";
  const isSoftOnly = jobIds.length === 0;

  // Header
  const header = document.createElement("div");
  header.className = "check-header";

  const title = document.createElement("h1");
  title.className = "check-title";

  let titleKey = "";
  if (isLink) {
    titleKey = isSoftOnly ? "check.titleLinkSoft" : "check.titleLink";
  } else {
    titleKey = isSoftOnly ? "check.titleSoft" : "check.title";
  }
  const totalSkillsCount = isSoftOnly ? softIds.length : jobIds.length;
  title.textContent = t(titleKey, { n: totalSkillsCount });
  header.appendChild(title);

  const sub = document.createElement("p");
  sub.className = "check-sub";
  sub.textContent = COPY.check.sub;
  header.appendChild(sub);

  containerEl.appendChild(header);

  // Role selector / chip (if roleGuess feature is enabled)
  if (!CONFIG.features || CONFIG.features.roleGuess !== false) {
    const roleBar = document.createElement("div");
    roleBar.className = "role-bar";

    const currentRole = sessionState.roleId ? getRole(sessionState.roleId) : null;
    const roleText = document.createElement("span");
    roleText.className = "role-text";

    if (currentRole) {
      const art = currentRole.article || (currentRole.name.match(/^[aeiou]/i) ? "an" : "a");
      roleText.textContent = t("scan.role", { article: art, role: currentRole.name });
    } else {
      roleText.textContent = COPY.check.roleOther;
    }
    roleBar.appendChild(roleText);

    // Native select
    const select = document.createElement("select");
    select.className = "role-select";
    select.setAttribute("aria-label", "Change role");

    // Option for current or "other"
    const otherOpt = document.createElement("option");
    otherOpt.value = "";
    otherOpt.textContent = COPY.check.roleOther;
    select.appendChild(otherOpt);

    for (const r of ROLES) {
      const opt = document.createElement("option");
      opt.value = r.id;
      opt.textContent = r.name;
      if (sessionState.roleId === r.id) {
        opt.selected = true;
      }
      select.appendChild(opt);
    }

    if (!sessionState.roleId) {
      otherOpt.selected = true;
    }

    select.addEventListener("change", () => {
      const newRoleId = select.value || null;
      setRole(newRoleId);
      emit("role:change", { roleId: newRoleId });

      const updatedRole = newRoleId ? getRole(newRoleId) : null;
      if (updatedRole) {
        const art = updatedRole.article || (updatedRole.name.match(/^[aeiou]/i) ? "an" : "a");
        roleText.textContent = t("scan.role", { article: art, role: updatedRole.name });
      } else {
        roleText.textContent = COPY.check.roleOther;
      }
    });

    roleBar.appendChild(select);
    containerEl.appendChild(roleBar);
  }

  // Ticked from last time banner
  const hasRememberedTicks = sessionState.ticked && sessionState.ticked.length > 0 && isRememberEnabled();
  let fromLastBanner = null;

  if (hasRememberedTicks) {
    fromLastBanner = document.createElement("div");
    fromLastBanner.className = "from-last-banner";

    const bannerText = document.createElement("span");
    bannerText.textContent = COPY.check.fromLast;
    fromLastBanner.appendChild(bannerText);

    const clearAllBtn = document.createElement("button");
    clearAllBtn.type = "button";
    clearAllBtn.className = "btn btn-text";
    clearAllBtn.style.color = "var(--brand-strong)";
    clearAllBtn.style.fontWeight = "700";
    clearAllBtn.textContent = COPY.check.clearAll;
    clearAllBtn.addEventListener("click", () => {
      clearTicks();
      updateAllChips();
      fromLastBanner.style.display = "none";
    });
    fromLastBanner.appendChild(clearAllBtn);
    containerEl.appendChild(fromLastBanner);
  }

  // Layout grid for 2-column on laptop
  const layoutGrid = document.createElement("div");
  layoutGrid.className = "check-layout-grid";

  const chipsCol = document.createElement("div");
  chipsCol.className = "check-chips-col";

  // Map of chip elements by skill ID
  const chipElements = new Map();

  function updateChip(id) {
    const chip = chipElements.get(id);
    if (!chip) return;
    const isTicked = getState().ticked.includes(id);
    chip.setAttribute("aria-pressed", isTicked ? "true" : "false");

    const checkIcon = chip.querySelector(".chip-check-icon");
    if (checkIcon) {
      checkIcon.style.display = isTicked ? "inline-block" : "none";
    }
  }

  function updateAllChips() {
    for (const id of chipElements.keys()) {
      updateChip(id);
    }
    updateStickyCount();
  }

  function createChip(skillId) {
    const s = getSkill(skillId);
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip-btn";
    chip.setAttribute("data-skill-id", skillId);
    chip.setAttribute("aria-pressed", "false");

    const check = createSvgCheck();
    check.style.display = "none";
    chip.appendChild(check);

    const nameSpan = document.createElement("span");
    nameSpan.textContent = s ? s.name : skillId;
    chip.appendChild(nameSpan);

    const count = counts[skillId] || 1;
    if (count >= 2) {
      const badge = document.createElement("span");
      badge.className = "chip-badge";
      badge.textContent = t("check.mentions", { n: count });
      chip.appendChild(badge);
    }

    chip.addEventListener("click", () => {
      toggle(skillId);
      const isNowTicked = getState().ticked.includes(skillId);
      updateChip(skillId);
      updateStickyCount();

      // Soft click sound & event
      emit("check:toggle", { id: skillId, have: isNowTicked });

      // Quick scale animation 0.96 to 1
      chip.style.transform = "scale(0.96)";
      setTimeout(() => {
        chip.style.transform = "scale(1)";
      }, 150);
    });

    chipElements.set(skillId, chip);
    return chip;
  }

  // Job skills grouped
  const jobGroups = groupedJob(jobIds);
  for (const g of jobGroups) {
    const groupEl = document.createElement("div");
    groupEl.className = "skill-group";

    const labelEl = document.createElement("div");
    labelEl.className = "skill-group-label";
    labelEl.textContent = g.name;
    groupEl.appendChild(labelEl);

    const chipsList = document.createElement("div");
    chipsList.className = "skill-chips-list";

    for (const sid of g.skills) {
      chipsList.appendChild(createChip(sid));
    }

    groupEl.appendChild(chipsList);
    chipsCol.appendChild(groupEl);
  }

  // Soft skills
  if (softIds.length > 0 && (!CONFIG.features || CONFIG.features.softSkills !== false)) {
    const softHeader = document.createElement("div");
    softHeader.className = "soft-skills-header";

    const softTitle = document.createElement("div");
    softTitle.className = "soft-skills-title";
    softTitle.textContent = COPY.check.softHead;
    softHeader.appendChild(softTitle);

    const softNote = document.createElement("div");
    softNote.className = "soft-skills-note";
    softNote.textContent = COPY.check.softNote;
    softHeader.appendChild(softNote);
    chipsCol.appendChild(softHeader);

    const softList = document.createElement("div");
    softList.className = "skill-chips-list";

    for (const sid of softIds) {
      softList.appendChild(createChip(sid));
    }
    chipsCol.appendChild(softList);
  }

  // Remember my ticks switch
  if (!CONFIG.features || CONFIG.features.rememberSkills !== false) {
    const remRow = document.createElement("label");
    remRow.className = "remember-switch-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isRememberEnabled();
    checkbox.addEventListener("change", () => {
      setRemember(checkbox.checked);
      emit("skills:remember", { on: checkbox.checked });
    });
    remRow.appendChild(checkbox);

    const labelText = document.createElement("span");
    labelText.textContent = COPY.check.remember;
    remRow.appendChild(labelText);

    chipsCol.appendChild(remRow);
  }

  // Note
  const noteEl = document.createElement("p");
  noteEl.className = "check-note";
  noteEl.textContent = COPY.check.note;
  chipsCol.appendChild(noteEl);

  layoutGrid.appendChild(chipsCol);

  // Summary Sidebar (Laptop) / Below Chips (Mobile)
  const sidebar = document.createElement("div");
  sidebar.className = "check-summary-sidebar";

  // "Also asks for" card
  const reqItems = sessionState.reqs || [];
  if (reqItems.length > 0 && (!CONFIG.features || CONFIG.features.requirements !== false)) {
    const groups = groupedReqs(reqItems);
    if (groups.length > 0) {
      const reqCard = document.createElement("div");
      reqCard.className = "reqs-card";

      const reqTitle = document.createElement("div");
      reqTitle.className = "reqs-card-title";
      reqTitle.textContent = COPY.check.reqHead;
      reqCard.appendChild(reqTitle);

      const reqNote = document.createElement("div");
      reqNote.className = "reqs-card-note";
      reqNote.textContent = COPY.check.reqNote;
      reqCard.appendChild(reqNote);

      for (const g of groups) {
        const row = document.createElement("div");
        row.className = "reqs-group-row";

        const name = document.createElement("div");
        name.className = "reqs-group-name";
        name.textContent = g.name;
        row.appendChild(name);

        const pills = document.createElement("div");
        pills.className = "reqs-pills";

        for (const l of g.labels) {
          const pill = document.createElement("span");
          pill.className = "req-pill";
          pill.textContent = l;
          pills.appendChild(pill);
        }
        row.appendChild(pills);
        reqCard.appendChild(row);
      }
      sidebar.appendChild(reqCard);
    }
  }

  // "Show in the post" (only when post text is available)
  if (sessionState.text && sessionState.text.length > 0) {
    const postDetails = document.createElement("details");
    postDetails.className = "show-post-details";

    const postSummary = document.createElement("summary");
    postSummary.className = "show-post-summary";
    postSummary.textContent = COPY.check.showPost;
    postDetails.appendChild(postSummary);

    const postContent = document.createElement("div");
    postContent.className = "show-post-content";

    // Fully lit still film panel
    const miniPanel = document.createElement("div");
    miniPanel.className = "film-panel";
    miniPanel.style.maxHeight = "400px";

    const vp = document.createElement("div");
    vp.className = "film-viewport";
    vp.style.height = "360px";
    vp.style.overflowY = "auto";

    const b = document.createElement("div");
    b.className = "film-body";
    vp.appendChild(b);
    miniPanel.appendChild(vp);

    renderFilm(b, {
      text: sessionState.text,
      spans: sessionState.film,
      truncated: Boolean(sessionState.scan?.truncated),
      maxChars: CONFIG.limits.maxChars
    });
    finishAll(b);

    // Tap to tick: tapping a skill highlight inside "Show in the post" ticks/unticks that skill
    b.style.cursor = "pointer";
    b.addEventListener("click", (e) => {
      const mark = e.target.closest(".film-mark:not(.hit-req)");
      if (!mark) return;
      const idsRaw = mark.getAttribute("data-ids");
      if (!idsRaw) return;
      const ids = idsRaw.split(",");
      for (const id of ids) {
        const chipBtn = document.querySelector(`.chip-btn[data-skill-id="${id}"]`);
        if (chipBtn) {
          chipBtn.click();
        }
      }
    });

    postContent.appendChild(miniPanel);
    postDetails.appendChild(postContent);
    sidebar.appendChild(postDetails);
  }

  layoutGrid.appendChild(sidebar);
  containerEl.appendChild(layoutGrid);

  // Sticky Bottom Bar
  const stickyBar = document.createElement("div");
  stickyBar.className = "sticky-tick-bar";

  const stickyInner = document.createElement("div");
  stickyInner.className = "sticky-tick-inner";

  const countDisplay = document.createElement("div");
  countDisplay.className = "sticky-tick-count";
  stickyInner.appendChild(countDisplay);

  const goBtn = document.createElement("button");
  goBtn.type = "button";
  goBtn.className = "btn btn-primary";
  goBtn.textContent = COPY.check.go;
  goBtn.addEventListener("click", () => {
    if (onShowMatch) onShowMatch();
  });
  stickyInner.appendChild(goBtn);

  stickyBar.appendChild(stickyInner);
  containerEl.appendChild(stickyBar);

  function updateStickyCount() {
    const tickedCount = getState().ticked.length;
    countDisplay.textContent = t("check.ticked", { n: tickedCount });
  }

  // Initialize all chips states
  updateAllChips();
}

export function leave() {
  // Cleanup if needed
}
