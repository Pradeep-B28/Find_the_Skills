// What it does: the scan beam, scroll translation, and light-up timing.
// Uses: js/fx/film.js, js/fx/sound.js.
// Used by: js/screens/scan.js.

import { lightUp, finishAll } from "./film.js";
import { startBeamHum, stopBeamHum, playJobBlip, playSoftBlip, playReqTick } from "./sound.js";

// Cubic bezier (0.4, 0, 0.2, 1) solver
function solveCubicBezier(p1x, p1y, p2x, p2y) {
  const cx = 3.0 * p1x;
  const bx = 3.0 * (p2x - p1x) - cx;
  const ax = 1.0 - cx - bx;

  const cy = 3.0 * p1y;
  const by = 3.0 * (p2y - p1y) - cy;
  const ay = 1.0 - cy - by;

  function sampleCurveX(t) {
    return ((ax * t + bx) * t + cx) * t;
  }
  function sampleCurveY(t) {
    return ((ay * t + by) * t + cy) * t;
  }
  function sampleCurveDerivativeX(t) {
    return (3.0 * ax * t + 2.0 * bx) * t + cx;
  }

  return function solve(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t = x;
    for (let i = 0; i < 6; i++) {
      const x2 = sampleCurveX(t) - x;
      if (Math.abs(x2) < 1e-4) return sampleCurveY(t);
      const d2 = sampleCurveDerivativeX(t);
      if (Math.abs(d2) < 1e-4) break;
      t = t - x2 / d2;
    }

    let t0 = 0.0;
    let t1 = 1.0;
    t = x;

    while (t0 < t1) {
      const x2 = sampleCurveX(t);
      if (Math.abs(x2 - x) < 1e-4) return sampleCurveY(t);
      if (x > x2) t0 = t;
      else t1 = t;
      t = (t1 - t0) * 0.5 + t0;
    }
    return sampleCurveY(t);
  };
}

const easeCubic = solveCubicBezier(0.4, 0, 0.2, 1);

export function runScan({
  viewportEl,
  bodyEl,
  beamEl,
  marks = [],
  charCount = 0,
  jobCounterEl = null,
  softCounterEl = null,
  totalJobCount = 0,
  totalSoftCount = 0,
  onComplete = () => {}
}) {
  let isCancelled = false;
  let isFinished = false;
  let rafId = null;

  // Prefers reduced motion
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    finishImmediate();
    return {
      cancel: () => {},
      skip: () => {}
    };
  }

  // Duration: 1.6s + 0.25s per 1,000 chars, max 3.4s
  const durationSec = Math.min(3.4, 1.6 + 0.25 * (charCount / 1000));
  const durationMs = durationSec * 1000;

  startBeamHum(durationSec);

  const seenJobSkills = new Set();
  const seenSoftSkills = new Set();
  let currentJobCount = 0;
  let currentSoftCount = 0;

  const viewportHeight = viewportEl.clientHeight || 400;
  const textHeight = Math.max(bodyEl.scrollHeight || 0, bodyEl.offsetHeight || 0, viewportHeight);
  const maxScroll = Math.max(0, textHeight - viewportHeight);

  // Group marks by lines (within 8px vertically) for staggering
  const lineGroups = [];
  for (const m of marks) {
    let group = lineGroups.find(g => Math.abs(g.top - m.top) < 8);
    if (!group) {
      group = { top: m.top, marks: [] };
      lineGroups.push(group);
    }
    group.marks.push(m);
  }
  for (const g of lineGroups) {
    g.marks.sort((a, b) => a.left - b.left);
  }

  let startTime = null;
  let lastTime = null;
  let pausedTime = 0;
  let isTabHidden = false;

  function onVisibilityChange() {
    if (document.hidden) {
      isTabHidden = true;
    } else {
      isTabHidden = false;
      lastTime = performance.now();
    }
  }
  document.addEventListener("visibilitychange", onVisibilityChange);

  function triggerMark(mark) {
    if (mark.lit) return;
    lightUp(mark);

    if (mark.kind === "job") {
      let isNew = false;
      for (const id of mark.ids) {
        if (!seenJobSkills.has(id)) {
          seenJobSkills.add(id);
          isNew = true;
        }
      }
      if (isNew) {
        currentJobCount = seenJobSkills.size;
        if (jobCounterEl) {
          jobCounterEl.textContent = String(currentJobCount);
        }
        playJobBlip();
      }
    } else if (mark.kind === "soft") {
      let isNew = false;
      for (const id of mark.ids) {
        if (!seenSoftSkills.has(id)) {
          seenSoftSkills.add(id);
          isNew = true;
        }
      }
      if (isNew) {
        currentSoftCount = seenSoftSkills.size;
        if (softCounterEl) {
          softCounterEl.textContent = String(currentSoftCount);
        }
        playSoftBlip();
      }
    } else if (mark.kind === "req") {
      playReqTick();
    }
  }

  function finishImmediate() {
    if (isFinished) return;
    isFinished = true;
    isCancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener("visibilitychange", onVisibilityChange);

    stopBeamHum();
    finishAll(bodyEl);

    if (jobCounterEl) jobCounterEl.textContent = String(totalJobCount);
    if (softCounterEl) softCounterEl.textContent = String(totalSoftCount);

    if (beamEl) {
      beamEl.style.opacity = "0";
      beamEl.style.transition = "opacity 200ms ease";
    }

    bodyEl.classList.add("scan-finished");
    bodyEl.style.transition = "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)";
    bodyEl.style.transform = "translateY(0px)";

    setTimeout(() => {
      onComplete();
    }, 150);
  }

  function step(now) {
    if (isCancelled || isFinished) return;

    if (isTabHidden) {
      rafId = requestAnimationFrame(step);
      return;
    }

    if (!startTime) {
      startTime = now;
      lastTime = now;
    }

    // Delta time capped at 0.05s
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    const elapsed = now - startTime - pausedTime;
    const rawProgress = Math.min(1.0, elapsed / durationMs);
    const progress = easeCubic(rawProgress);

    let beamY = 0;
    let scrollY = 0;
    let scanY = 0;

    if (maxScroll <= 0) {
      beamY = progress * viewportHeight;
      scanY = beamY;
      scrollY = 0;
    } else {
      const beamStopY = 0.45 * viewportHeight;
      const d1 = beamStopY;
      const d2 = maxScroll;
      const d3 = viewportHeight - beamStopY;
      const totalDist = d1 + d2 + d3;

      const f1 = d1 / totalDist;
      const f2 = (d1 + d2) / totalDist;

      if (progress < f1) {
        const p1 = progress / f1;
        beamY = p1 * beamStopY;
        scrollY = 0;
      } else if (progress < f2) {
        const p2 = (progress - f1) / (f2 - f1);
        beamY = beamStopY;
        scrollY = p2 * maxScroll;
      } else {
        const p3 = (progress - f2) / (1.0 - f2);
        beamY = beamStopY + p3 * d3;
        scrollY = maxScroll;
      }

      scanY = scrollY + beamY;
    }

    beamEl.style.transform = `translateY(${beamY}px)`;
    bodyEl.style.transform = `translateY(${-scrollY}px)`;

    // Check line groups
    for (const group of lineGroups) {
      if (scanY >= group.top) {
        for (let i = 0; i < group.marks.length; i++) {
          const m = group.marks[i];
          if (!m.lit) {
            if (i === 0) {
              triggerMark(m);
            } else {
              m.lit = true;
              setTimeout(() => {
                triggerMark(m);
              }, i * 40);
            }
          }
        }
      }
    }

    if (rawProgress >= 1.0) {
      isFinished = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopBeamHum();

      // Trigger any remaining marks
      for (const m of marks) {
        triggerMark(m);
      }

      if (jobCounterEl) jobCounterEl.textContent = String(totalJobCount);
      if (softCounterEl) softCounterEl.textContent = String(totalSoftCount);

      // Fade unlit text to --film-text over 400ms
      bodyEl.classList.add("scan-finished");

      // Beam fades out
      beamEl.style.opacity = "0";
      beamEl.style.transition = "opacity 400ms ease";

      // Text scrolls back to the top over 400ms
      bodyEl.style.transition = "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)";
      bodyEl.style.transform = "translateY(0px)";

      setTimeout(() => {
        onComplete();
      }, 420);
      return;
    }

    rafId = requestAnimationFrame(step);
  }

  rafId = requestAnimationFrame(step);

  return {
    cancel: () => {
      isCancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopBeamHum();
    },
    skip: () => {
      finishImmediate();
    }
  };
}
