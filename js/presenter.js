// What it does: presenter mode for live session screenshares (?present=1).
// Uses: config.js, content/samples.js, js/copy.js.
// Used by: js/main.js.

import { CONFIG } from "../config.js";
import { SAMPLES } from "../content/samples.js";
import { COPY } from "./copy.js";

let isPresenterActive = false;
let currentSampleIndex = 0;

export function isPresenterMode() {
  return isPresenterActive;
}

export function initPresenterMode() {
  isPresenterActive = true;
  window.__JPX_PRESENTER__ = true;
  document.documentElement.setAttribute("data-presenter", "true");

  window.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(e) {
  if (!isPresenterActive) return;

  // Keys 1 to 8: load samples in config.samplesOnHome order
  const keyNum = parseInt(e.key, 10);
  if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 8) {
    const samplesOrder = CONFIG.samplesOnHome || [];
    const sampleId = samplesOrder[keyNum - 1];
    if (sampleId) {
      currentSampleIndex = keyNum - 1;
      const sObj = SAMPLES.find((s) => s.id === sampleId);
      if (sObj) {
        const textarea = document.getElementById("job-post-input");
        if (textarea) {
          textarea.value = sObj.text;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          const goBtn = document.getElementById("btn-xray");
          if (goBtn) goBtn.click();
        } else {
          // If already on another screen, click "Check another job post" first
          const anotherBtn = document.querySelector(".result-actions .btn-secondary");
          if (anotherBtn) {
            anotherBtn.click();
            setTimeout(() => {
              const ta = document.getElementById("job-post-input");
              if (ta) {
                ta.value = sObj.text;
                ta.dispatchEvent(new Event("input", { bubbles: true }));
                const gb = document.getElementById("btn-xray");
                if (gb) gb.click();
              }
            }, 300);
          }
        }
      }
    }
    return;
  }

  // Key Enter: runs X-ray or moves to next screen
  if (e.key === "Enter") {
    const goBtn = document.getElementById("btn-xray");
    if (goBtn && !goBtn.disabled && window.getComputedStyle(goBtn).display !== "none") {
      goBtn.click();
      return;
    }

    const nextScanBtn = document.querySelector(".scan-primary-btn");
    if (nextScanBtn && window.getComputedStyle(nextScanBtn).display !== "none") {
      nextScanBtn.click();
      return;
    }

    const showMatchBtn = document.querySelector(".sticky-tick-inner .btn-primary");
    if (showMatchBtn && window.getComputedStyle(showMatchBtn).display !== "none") {
      showMatchBtn.click();
      return;
    }
  }

  // Key H or h: show or hide highlights on the film
  if (e.key === "h" || e.key === "H") {
    const marks = document.querySelectorAll(".film-mark");
    marks.forEach((m) => {
      if (m.style.opacity === "0") {
        m.style.opacity = "1";
      } else {
        m.style.opacity = "0";
      }
    });
  }

  // Key T or t: tick sample's demoHave skills
  if (e.key === "t" || e.key === "T") {
    const samplesOrder = CONFIG.samplesOnHome || [];
    const sampleId = samplesOrder[currentSampleIndex] || "s1";
    const sObj = SAMPLES.find((s) => s.id === sampleId);
    if (sObj && sObj.demoHave) {
      sObj.demoHave.forEach((id) => {
        const btn = document.querySelector(`.chip-btn[data-skill-id="${id}"]`);
        if (btn && btn.getAttribute("aria-pressed") !== "true") {
          btn.click();
        }
      });
    }
  }
}
