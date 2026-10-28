// What it does: scan screen with film panel, beam animation, counters, and after-scan controls.
// Uses: config.js, js/copy.js, js/content.js, js/session.js, js/score.js, js/events.js, js/fx/film.js, js/fx/beam.js.
// Used by: js/main.js, js/router.js.

import { CONFIG } from "../../config.js";
import { t, COPY } from "../copy.js";
import { role as getRole, sample as getSample } from "../content.js";
import { startFromText, getState, report } from "../session.js";
import { scanState } from "../score.js";
import { emit } from "../events.js";
import { renderFilm, getMarks } from "../fx/film.js";
import { runScan } from "../fx/beam.js";

let containerEl = null;
let activeScan = null;
let filmPanelEl = null;

export function mount(rootEl) {
  containerEl = document.createElement("div");
  containerEl.className = "scan-screen-container";
  containerEl.style.width = "100%";
  containerEl.style.maxWidth = "760px";
  containerEl.style.margin = "0 auto";
  rootEl.appendChild(containerEl);
  return containerEl;
}

export function enter({ sampleId = null, text = null, onEditPost = null, onNext = null, onTrySample = null } = {}) {
  if (!containerEl) return;
  leave();

  while (containerEl.firstChild) {
    containerEl.removeChild(containerEl.firstChild);
  }

  if (sampleId) {
    const s = getSample(sampleId);
    if (s) {
      startFromText(s.text);
    }
  } else if (text !== null) {
    startFromText(text);
  }

  const sessionState = getState();
  const sessionReport = report();
  const postText = sessionState.text || "";
  const roleObj = sessionState.roleId ? getRole(sessionState.roleId) : null;

  // Film panel
  filmPanelEl = document.createElement("div");
  filmPanelEl.className = "film-panel";
  filmPanelEl.setAttribute("role", "region");
  filmPanelEl.setAttribute("aria-label", "X-ray film scan");

  // Grid
  const gridEl = document.createElement("div");
  gridEl.className = "film-grid";
  gridEl.setAttribute("aria-hidden", "true");
  filmPanelEl.appendChild(gridEl);

  // Four corner brackets
  for (const cornerClass of ["film-corner-tl", "film-corner-tr", "film-corner-bl", "film-corner-br"]) {
    const corner = document.createElement("div");
    corner.className = `film-corner ${cornerClass}`;
    corner.setAttribute("aria-hidden", "true");
    filmPanelEl.appendChild(corner);
  }

  // Header strip
  const headerEl = document.createElement("div");
  headerEl.className = "film-header";

  const labelEl = document.createElement("span");
  labelEl.className = "film-label";
  labelEl.textContent = COPY.scan.label;
  headerEl.appendChild(labelEl);

  const countersEl = document.createElement("div");
  countersEl.className = "film-counters";

  // Job counter
  const jobCounterItem = document.createElement("div");
  jobCounterItem.className = "film-counter-item";
  const jobLabel = document.createElement("span");
  jobLabel.textContent = COPY.scan.jobCounter;
  const jobCountEl = document.createElement("span");
  jobCountEl.id = "scan-job-count";
  jobCountEl.className = "film-counter-num";
  jobCountEl.textContent = "0";
  jobCounterItem.appendChild(jobLabel);
  jobCounterItem.appendChild(jobCountEl);
  countersEl.appendChild(jobCounterItem);

  // Soft counter (if enabled)
  let softCountEl = null;
  if (!CONFIG.features || CONFIG.features.softSkills !== false) {
    const softCounterItem = document.createElement("div");
    softCounterItem.className = "film-counter-item";
    const softLabel = document.createElement("span");
    softLabel.textContent = COPY.scan.softCounter;
    softCountEl = document.createElement("span");
    softCountEl.id = "scan-soft-count";
    softCountEl.className = "film-counter-num";
    softCountEl.textContent = "0";
    softCounterItem.appendChild(softLabel);
    softCounterItem.appendChild(softCountEl);
    countersEl.appendChild(softCounterItem);
  }

  headerEl.appendChild(countersEl);
  filmPanelEl.appendChild(headerEl);

  // Key strip
  const keyEl = document.createElement("div");
  keyEl.className = "film-key";

  const jobKey = document.createElement("div");
  jobKey.className = "key-item";
  const jobDot = document.createElement("span");
  jobDot.className = "key-dot key-dot-job";
  jobDot.setAttribute("aria-hidden", "true");
  const jobKeyText = document.createElement("span");
  jobKeyText.textContent = COPY.scan.keyJob;
  jobKey.appendChild(jobDot);
  jobKey.appendChild(jobKeyText);
  keyEl.appendChild(jobKey);

  if (!CONFIG.features || CONFIG.features.softSkills !== false) {
    const softKey = document.createElement("div");
    softKey.className = "key-item";
    const softDot = document.createElement("span");
    softDot.className = "key-dot key-dot-soft";
    softDot.setAttribute("aria-hidden", "true");
    const softKeyText = document.createElement("span");
    softKeyText.textContent = COPY.scan.keySoft;
    softKey.appendChild(softDot);
    softKey.appendChild(softKeyText);
    keyEl.appendChild(softKey);
  }

  if (!CONFIG.features || CONFIG.features.requirements !== false) {
    const reqKey = document.createElement("div");
    reqKey.className = "key-item";
    const reqDot = document.createElement("span");
    reqDot.className = "key-dot key-dot-req";
    reqDot.setAttribute("aria-hidden", "true");
    const reqKeyText = document.createElement("span");
    reqKeyText.textContent = COPY.scan.keyReq;
    reqKey.appendChild(reqDot);
    reqKey.appendChild(reqKeyText);
    keyEl.appendChild(reqKey);
  }

  filmPanelEl.appendChild(keyEl);

  // Film viewport
  const viewportEl = document.createElement("div");
  viewportEl.className = "film-viewport";

  const bodyEl = document.createElement("div");
  bodyEl.className = "film-body";
  viewportEl.appendChild(bodyEl);

  // Beam container
  const beamEl = document.createElement("div");
  beamEl.className = "film-beam-container";
  const beamTrail = document.createElement("div");
  beamTrail.className = "film-beam-trail";
  const beamLine = document.createElement("div");
  beamLine.className = "film-beam-line";
  beamEl.appendChild(beamTrail);
  beamEl.appendChild(beamLine);
  viewportEl.appendChild(beamEl);

  filmPanelEl.appendChild(viewportEl);
  containerEl.appendChild(filmPanelEl);

  // Render text and highlights safely into bodyEl using text nodes and marks
  renderFilm(bodyEl, {
    text: postText,
    spans: sessionState.film,
    truncated: Boolean(sessionState.scan?.truncated),
    maxChars: CONFIG.limits.maxChars
  });

  // Calculate marks layout
  const marks = getMarks(bodyEl, viewportEl);

  // Controls container (after-scan bar or few-skills card)
  const controlsEl = document.createElement("div");
  controlsEl.id = "scan-controls-container";
  containerEl.appendChild(controlsEl);

  function onScanComplete() {
    const state = scanState(sessionState.jobIds.length, sessionState.softIds.length, CONFIG.limits.minSkills);

    if (state === "ok") {
      showAfterScanBar(controlsEl, {
        jobCount: sessionState.jobIds.length,
        softCount: sessionState.softIds.length,
        roleObj,
        onNext,
        onEditPost: () => {
          if (onEditPost) onEditPost(postText);
        }
      });

      emit("xray:done", {
        jobCount: sessionState.jobIds.length,
        softCount: sessionState.softIds.length,
        reqTypes: (sessionState.reqs || []).map(r => r.type),
        roleId: roleObj ? roleObj.id : null,
        kind: sessionReport.kind,
        truncated: Boolean(sessionState.scan?.truncated)
      });
    } else {
      showFewSkillsCard(controlsEl, {
        state,
        jobCount: sessionState.jobIds.length,
        softCount: sessionState.softIds.length,
        onNext,
        onEditPost: () => {
          if (onEditPost) onEditPost(postText);
        },
        onTrySample
      });

      emit("xray:few", {
        jobCount: sessionState.jobIds.length,
        softCount: sessionState.softIds.length
      });
    }
  }

  // Tap film to skip
  const onPanelClick = () => {
    if (activeScan) {
      activeScan.skip();
    }
  };
  filmPanelEl.addEventListener("click", onPanelClick);

  // Run beam animation
  activeScan = runScan({
    viewportEl,
    bodyEl,
    beamEl,
    marks,
    charCount: postText.length,
    jobCounterEl: jobCountEl,
    softCounterEl: softCountEl,
    totalJobCount: sessionState.jobIds.length,
    totalSoftCount: sessionState.softIds.length,
    onComplete: onScanComplete
  });
}

function showAfterScanBar(container, { jobCount, softCount, roleObj, onNext, onEditPost }) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const bar = document.createElement("div");
  bar.className = "after-scan-bar";

  const info = document.createElement("div");
  info.className = "after-scan-info";

  const foundLine = document.createElement("div");
  foundLine.className = "after-scan-found";

  let foundText = "";
  if (jobCount > 0 && softCount > 0) {
    const jobStr = t(jobCount === 1 ? "scan.jobPart.one" : "scan.jobPart", { n: jobCount });
    const softStr = t(softCount === 1 ? "scan.softPart.one" : "scan.softPart", { n: softCount });
    foundText = t("scan.found", { job: jobStr, soft: softStr });
  } else if (jobCount > 0) {
    const jobStr = t(jobCount === 1 ? "scan.jobPart.one" : "scan.jobPart", { n: jobCount });
    foundText = t("scan.foundOne", { part: jobStr });
  } else if (softCount > 0) {
    const softStr = t(softCount === 1 ? "scan.softPart.one" : "scan.softPart", { n: softCount });
    foundText = t("scan.foundOne", { part: softStr });
  } else {
    foundText = COPY.scan.noneTitle;
  }
  foundLine.textContent = foundText;
  info.appendChild(foundLine);

  // Live region announcement
  const liveEl = document.getElementById("live-region");
  if (liveEl) {
    liveEl.textContent = foundText;
  }

  if (roleObj) {
    const roleLine = document.createElement("div");
    roleLine.className = "after-scan-role";
    const art = roleObj.article || (roleObj.name.match(/^[aeiou]/i) ? "an" : "a");
    roleLine.textContent = t("scan.role", { article: art, role: roleObj.name });
    info.appendChild(roleLine);
  }

  bar.appendChild(info);

  const actions = document.createElement("div");
  actions.className = "after-scan-actions";

  const nextBtn = document.createElement("button");
  nextBtn.className = "btn btn-primary scan-primary-btn";
  nextBtn.textContent = COPY.scan.next;
  nextBtn.addEventListener("click", () => {
    if (onNext) onNext();
  });
  actions.appendChild(nextBtn);

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-text";
  editBtn.textContent = COPY.scan.edit;
  editBtn.addEventListener("click", () => {
    if (onEditPost) onEditPost();
  });
  actions.appendChild(editBtn);

  bar.appendChild(actions);
  container.appendChild(bar);
}

function showFewSkillsCard(container, { state, jobCount, softCount, onNext, onEditPost, onTrySample }) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const card = document.createElement("div");
  card.className = "few-skills-card";

  const titleEl = document.createElement("div");
  titleEl.className = "few-skills-title";

  if (state === "none") {
    titleEl.textContent = COPY.scan.noneTitle;
  } else {
    if (jobCount === 0) {
      titleEl.textContent = COPY.scan.noJobTitle;
    } else {
      titleEl.textContent = t(jobCount === 1 ? "scan.fewTitle.one" : "scan.fewTitle", { n: jobCount });
    }
  }
  card.appendChild(titleEl);

  const bodyEl = document.createElement("div");
  bodyEl.className = "few-skills-body";
  bodyEl.textContent = COPY.scan.fewBody;
  card.appendChild(bodyEl);

  const actions = document.createElement("div");
  actions.className = "few-skills-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-primary";
  editBtn.textContent = COPY.scan.edit;
  editBtn.addEventListener("click", () => {
    if (onEditPost) onEditPost();
  });
  actions.appendChild(editBtn);

  if (state === "none") {
    const sampleBtn = document.createElement("button");
    sampleBtn.className = "btn btn-secondary";
    sampleBtn.textContent = COPY.scan.sample;
    sampleBtn.addEventListener("click", () => {
      if (onTrySample) onTrySample();
    });
    actions.appendChild(sampleBtn);
  } else {
    const continueBtn = document.createElement("button");
    continueBtn.className = "btn btn-secondary";
    continueBtn.textContent = COPY.scan.anyway;
    continueBtn.addEventListener("click", () => {
      if (onNext) onNext();
    });
    actions.appendChild(continueBtn);
  }

  card.appendChild(actions);
  container.appendChild(card);
}

export function leave() {
  if (activeScan) {
    activeScan.cancel();
    activeScan = null;
  }
}
