// What it does: automated demo mode with a visible 28px tap dot for recording reels.
// Uses: content/samples.js, js/copy.js.
// Used by: js/main.js.

import { SAMPLES } from "../content/samples.js";
import { COPY } from "./copy.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let tapDotEl = null;

function getOrCreateTapDot() {
  if (!tapDotEl) {
    tapDotEl = document.createElement("div");
    tapDotEl.className = "demo-tap-dot";
    tapDotEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(tapDotEl);
  }
  return tapDotEl;
}

async function moveDot(dot, x, y) {
  dot.style.left = `${Math.round(x)}px`;
  dot.style.top = `${Math.round(y)}px`;
  dot.style.opacity = "1";
  await sleep(400);
}

async function tap(dot, element) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  await moveDot(dot, x, y);
  dot.classList.add("tapping");
  await sleep(150);
  dot.classList.remove("tapping");
  element.click();
  await sleep(120);
}

export async function runDemo(urlParams) {
  window.__JPX_DEMO__ = true;

  const sampleId = urlParams.get("sample") || "s1";
  const themeParam = urlParams.get("theme");
  const loopParam = urlParams.get("loop");
  const shouldLoop = loopParam !== "0";

  if (themeParam === "light" || themeParam === "dark") {
    document.documentElement.setAttribute("data-theme", themeParam);
  }

  const sample = SAMPLES.find((s) => s.id === sampleId) || SAMPLES[0];
  const dot = getOrCreateTapDot();

  // Position dot offscreen initially
  dot.style.left = "50vw";
  dot.style.top = "60vh";

  while (true) {
    // -------------------------------------------------------------
    // Step 1: Home screen
    // -------------------------------------------------------------
    let textarea = null;
    for (let i = 0; i < 50; i++) {
      textarea = document.getElementById("job-post-input");
      if (textarea) break;
      await sleep(100);
    }
    if (!textarea) return;

    await sleep(400);
    textarea.scrollIntoView({ behavior: "smooth", block: "center" });
    await sleep(200);

    // Tap the text box
    await tap(dot, textarea);
    textarea.focus();

    // Paste text in 3 chunks over 0.6s
    const text = sample.text;
    const len = text.length;
    const chunk1 = text.slice(0, Math.floor(len / 3));
    const chunk2 = text.slice(0, Math.floor((2 * len) / 3));
    const chunk3 = text;

    await sleep(200);
    textarea.value = chunk1;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    await sleep(200);
    textarea.value = chunk2;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    await sleep(200);
    textarea.value = chunk3;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    // After 0.5s tap "X-ray this job post"
    await sleep(500);
    const goBtn = document.getElementById("btn-xray");
    if (!goBtn) return;
    goBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    await sleep(150);
    await tap(dot, goBtn);

    // -------------------------------------------------------------
    // Step 2: Scan screen
    // -------------------------------------------------------------
    let nextBtn = null;
    for (let i = 0; i < 80; i++) {
      nextBtn = document.querySelector(".scan-primary-btn");
      if (nextBtn && window.getComputedStyle(nextBtn).display !== "none") break;
      await sleep(100);
    }

    // After 1.2s tap "Tick the skills you have"
    await sleep(1200);
    if (nextBtn) {
      await tap(dot, nextBtn);
    }

    // -------------------------------------------------------------
    // Step 3: Tick screen
    // -------------------------------------------------------------
    let checkTitle = null;
    for (let i = 0; i < 40; i++) {
      checkTitle = document.querySelector(".check-title");
      if (checkTitle) break;
      await sleep(100);
    }

    await sleep(400);

    // Tick the sample's demoHave skills one at a time, 0.45s apart, in screen order
    const demoSkills = sample.demoHave || [];
    const allChips = Array.from(document.querySelectorAll(".chip-btn"));
    const chipsToTick = allChips.filter((chip) =>
      demoSkills.includes(chip.dataset.skillId)
    );

    for (const chip of chipsToTick) {
      chip.scrollIntoView({ behavior: "smooth", block: "center" });
      await sleep(150);
      await tap(dot, chip);
      await sleep(450);
    }

    // Pause 1s on "Also asks for" card
    const reqCard = document.querySelector(".reqs-card");
    if (reqCard) {
      reqCard.scrollIntoView({ behavior: "smooth", block: "center" });
      const rect = reqCard.getBoundingClientRect();
      await moveDot(dot, rect.left + rect.width / 2, rect.top + 50);
      await sleep(1000);
    }

    // Tap "Show my match"
    const matchBtn = document.querySelector(".sticky-tick-inner .btn-primary");
    if (matchBtn) {
      await tap(dot, matchBtn);
    }

    // -------------------------------------------------------------
    // Step 4: Result screen
    // -------------------------------------------------------------
    let matchLineEl = null;
    for (let i = 0; i < 40; i++) {
      matchLineEl = document.querySelector(".match-line-text");
      if (matchLineEl) break;
      await sleep(100);
    }

    // Hold 4s at the top
    window.scrollTo({ top: 0, behavior: "smooth" });
    await sleep(4000);

    // Smooth-scroll to main card and hold 3.5s
    const mainCard = document.querySelector(".result-right-col .result-card");
    if (mainCard) {
      mainCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    await sleep(3500);

    // Smooth-scroll to share card and hold 1.5s
    const shareCard = document.querySelector(".share-card");
    if (shareCard) {
      shareCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    await sleep(1500);

    if (!shouldLoop) {
      dot.style.opacity = "0";
      break;
    }

    // Scroll back up and start again
    window.scrollTo({ top: 0, behavior: "smooth" });
    await sleep(600);

    const anotherBtn = document.querySelector(".result-actions .btn-secondary");
    if (anotherBtn) {
      await tap(dot, anotherBtn);
    }
    await sleep(500);
  }
}
