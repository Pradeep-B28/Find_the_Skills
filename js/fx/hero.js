// What it does: home screen animated hero film loop and 3D pointer tilt.
// Uses: content/samples.js, js/content.js, js/fx/film.js, js/fx/beam.js.
// Used by: js/screens/home.js.

import { SAMPLES } from "../../content/samples.js";
import { scanPost } from "../content.js";
import { renderFilm, getMarks, finishAll } from "./film.js";
import { runScan } from "./beam.js";

let heroContainer = null;
let activeScan = null;
let loopTimer = null;
let pointerHandler = null;

export function mountHero(parentEl) {
  heroContainer = document.createElement("div");
  heroContainer.className = "hero-film-wrapper";

  const panel = document.createElement("div");
  panel.className = "film-panel hero-film-panel";
  panel.style.maxWidth = "460px";
  panel.style.margin = "0 auto";

  // Grid
  const gridEl = document.createElement("div");
  gridEl.className = "film-grid";
  gridEl.setAttribute("aria-hidden", "true");
  panel.appendChild(gridEl);

  // Four corner brackets
  for (const cornerClass of ["film-corner-tl", "film-corner-tr", "film-corner-bl", "film-corner-br"]) {
    const corner = document.createElement("div");
    corner.className = `film-corner ${cornerClass}`;
    corner.setAttribute("aria-hidden", "true");
    panel.appendChild(corner);
  }

  // Header
  const headerEl = document.createElement("div");
  headerEl.className = "film-header";

  const labelEl = document.createElement("span");
  labelEl.className = "film-label";
  labelEl.textContent = "JOB POST X-RAY";
  headerEl.appendChild(labelEl);

  const countersEl = document.createElement("div");
  countersEl.className = "film-counters";

  const jobItem = document.createElement("div");
  jobItem.className = "film-counter-item";
  const jobLbl = document.createElement("span");
  jobLbl.textContent = "Job";
  const jobNum = document.createElement("span");
  jobNum.className = "film-counter-num hero-job-num";
  jobNum.textContent = "0";
  jobItem.appendChild(jobLbl);
  jobItem.appendChild(jobNum);
  countersEl.appendChild(jobItem);

  const softItem = document.createElement("div");
  softItem.className = "film-counter-item";
  const softLbl = document.createElement("span");
  softLbl.textContent = "Soft";
  const softNum = document.createElement("span");
  softNum.className = "film-counter-num hero-soft-num";
  softNum.textContent = "0";
  softItem.appendChild(softLbl);
  softItem.appendChild(softNum);
  countersEl.appendChild(softItem);

  headerEl.appendChild(countersEl);
  panel.appendChild(headerEl);

  // Viewport
  const viewportEl = document.createElement("div");
  viewportEl.className = "film-viewport hero-viewport";
  viewportEl.style.height = "260px";
  viewportEl.style.maxHeight = "280px";
  viewportEl.style.overflow = "hidden";

  const bodyEl = document.createElement("div");
  bodyEl.className = "film-body hero-body";
  viewportEl.appendChild(bodyEl);

  const beamEl = document.createElement("div");
  beamEl.className = "film-beam-container hero-beam";
  const beamTrail = document.createElement("div");
  beamTrail.className = "film-beam-trail";
  const beamLine = document.createElement("div");
  beamLine.className = "film-beam-line";
  beamEl.appendChild(beamTrail);
  beamEl.appendChild(beamLine);
  viewportEl.appendChild(beamEl);

  panel.appendChild(viewportEl);
  heroContainer.appendChild(panel);
  parentEl.appendChild(heroContainer);

  // First 7 lines of s1
  const s1 = SAMPLES.find(s => s.id === "s1");
  const heroText = s1 ? s1.text.split("\n").slice(0, 7).join("\n") : "";
  const scanRes = scanPost(heroText);

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    // Show finished lit state, still, no tilt
    renderFilm(bodyEl, {
      text: heroText,
      spans: scanRes.film,
      truncated: false,
      maxChars: 15000
    });
    finishAll(bodyEl);
    bodyEl.classList.add("scan-finished");
    beamEl.style.display = "none";
    jobNum.textContent = String(scanRes.job.length);
    softNum.textContent = String(scanRes.soft.length);
    panel.style.transform = "none";
    return heroContainer;
  }

  // 3D tilt on laptop
  initTilt(heroContainer, panel);

  function startLoop() {
    if (document.hidden) return;
    if (activeScan) {
      activeScan.cancel();
      activeScan = null;
    }

    // Reset counters and styles
    jobNum.textContent = "0";
    softNum.textContent = "0";
    bodyEl.classList.remove("scan-finished");
    beamEl.style.opacity = "1";

    renderFilm(bodyEl, {
      text: heroText,
      spans: scanRes.film,
      truncated: false,
      maxChars: 15000
    });

    const marks = getMarks(bodyEl, viewportEl);

    activeScan = runScan({
      viewportEl,
      bodyEl,
      beamEl,
      marks,
      charCount: heroText.length,
      jobCounterEl: jobNum,
      softCounterEl: softNum,
      totalJobCount: scanRes.job.length,
      totalSoftCount: scanRes.soft.length,
      onComplete: () => {
        loopTimer = setTimeout(startLoop, 3500); // Sweep every 5s total
      }
    });
  }

  startLoop();

  return heroContainer;
}

function initTilt(container, panel) {
  let isLaptop = window.innerWidth >= 900;
  window.addEventListener("resize", () => {
    isLaptop = window.innerWidth >= 900;
    if (!isLaptop) {
      panel.style.transform = "none";
    } else {
      panel.style.transform = "rotateX(6deg) rotateY(-10deg)";
    }
  });

  if (isLaptop) {
    panel.style.transform = "rotateX(6deg) rotateY(-10deg)";
  }

  pointerHandler = (e) => {
    if (!isLaptop) return;
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2)));

    // Follow pointer by up to 5 degrees
    const rotX = 6 - normY * 5;
    const rotY = -10 + normX * 5;

    panel.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  };

  window.addEventListener("pointermove", pointerHandler);
}

export function stopHero() {
  if (loopTimer) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }
  if (activeScan) {
    activeScan.cancel();
    activeScan = null;
  }
  if (pointerHandler) {
    window.removeEventListener("pointermove", pointerHandler);
    pointerHandler = null;
  }
}
