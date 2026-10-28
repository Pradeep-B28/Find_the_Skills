// What it does: entry point for the web app, handles screen navigation, ?preview=s1..s11, and ?test=1.
// Uses: config.js, js/store.js, js/screens/home.js, js/screens/scan.js, js/fx/sound.js.
// Used by: index.html.

import { CONFIG } from "../config.js";
import { getTheme, setTheme, getMuted, setMuted } from "./store.js";
import { initSoundListener } from "./fx/sound.js";
import { mount as mountHome, enter as enterHome, leave as leaveHome } from "./screens/home.js";
import { mount as mountScan, enter as enterScan, leave as leaveScan } from "./screens/scan.js";

let currentScreen = null;
let lastPostText = "";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  setTheme(theme);
}

function initTheme() {
  const saved = getTheme();
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
}

function updateSoundIcon(isMuted) {
  const icon = document.getElementById("sound-icon");
  if (!icon) return;
  while (icon.firstChild) {
    icon.removeChild(icon.firstChild);
  }
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  if (isMuted) {
    path.setAttribute("d", "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z");
  } else {
    path.setAttribute("d", "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z");
  }
  icon.appendChild(path);
}

function initSound() {
  const isMuted = getMuted();
  updateSoundIcon(isMuted);
  initSoundListener();
}

function navigateToHome(appEl, initialText = "") {
  if (currentScreen === "scan") leaveScan();
  currentScreen = "home";

  while (appEl.firstChild) {
    appEl.removeChild(appEl.firstChild);
  }

  mountHome(appEl);
  enterHome({
    initialText,
    onStartScan: (text) => {
      lastPostText = text;
      navigateToScan(appEl, { text });
    }
  });
}

function navigateToScan(appEl, { sampleId = null, text = null } = {}) {
  if (currentScreen === "home") leaveHome();
  currentScreen = "scan";

  while (appEl.firstChild) {
    appEl.removeChild(appEl.firstChild);
  }

  mountScan(appEl);
  enterScan({
    sampleId,
    text,
    onEditPost: (editText) => {
      navigateToHome(appEl, editText || lastPostText);
    },
    onNext: () => {
      // In Phase 2, this is the end of the scan flow; Phase 3 will introduce tick screen
      const live = document.getElementById("live-region");
      if (live) live.textContent = "Tick screen ready for Phase 3";
    },
    onTrySample: () => {
      navigateToScan(appEl, { sampleId: "s1" });
    }
  });
}

async function boot() {
  initTheme();
  initSound();

  const themeBtn = document.getElementById("btn-theme");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  const soundBtn = document.getElementById("btn-sound");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      const isMuted = !getMuted();
      setMuted(isMuted);
      updateSoundIcon(isMuted);
    });
  }

  const footerVer = document.getElementById("footer-version");
  if (footerVer) {
    footerVer.textContent = `v${CONFIG.version}`;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const appEl = document.getElementById("app");
  if (!appEl) return;

  // Handle ?test=1
  if (urlParams.has("test") || urlParams.get("test") === "1") {
    const { runAllTests, renderSelfTestTable } = await import("./selftest.js");
    const results = runAllTests();
    renderSelfTestTable(results, appEl);
    return;
  }

  // Handle temporary ?preview=s1 .. ?preview=s11
  const preview = urlParams.get("preview");
  if (preview && /^s([1-9]|1[0-1])$/.test(preview)) {
    navigateToScan(appEl, { sampleId: preview });
    return;
  }

  // Default to home screen
  navigateToHome(appEl);
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", boot);
}
