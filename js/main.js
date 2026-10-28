// What it does: entry point for the web app, handles router initialization, URL flags, theme, sound, and analytics.
// Uses: config.js, js/store.js, js/router.js, js/fx/sound.js, js/analytics.js.
// Used by: index.html.

import { CONFIG } from "../config.js";
import { getTheme, setTheme, getMuted, setMuted } from "./store.js";
import { initSoundListener } from "./fx/sound.js";
import { init as initRouter, navigate } from "./router.js";

let lastPostText = "";

function updateThemeIcon(theme) {
  const icon = document.getElementById("theme-icon");
  const btn = document.getElementById("btn-theme");
  if (!icon || !btn) return;
  while (icon.firstChild) {
    icon.removeChild(icon.firstChild);
  }
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  if (theme === "dark") {
    path.setAttribute("d", "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z");
    btn.setAttribute("aria-label", "Switch to light theme");
    btn.setAttribute("title", "Switch to light theme");
  } else {
    path.setAttribute("d", "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z");
    btn.setAttribute("aria-label", "Switch to dark theme");
    btn.setAttribute("title", "Switch to dark theme");
  }
  icon.appendChild(path);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  setTheme(theme);
  updateThemeIcon(theme);
}

function initTheme() {
  const saved = getTheme();
  let theme = saved;
  if (!theme) {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme = prefersDark ? "dark" : "light";
  }
  applyTheme(theme);
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

function goToHome(initialText = "", compareData = null) {
  navigate("home", {
    initialText,
    compareData,
    onStartScan: (text) => {
      lastPostText = text;
      goToScan({ text });
    },
    onOpenCompare: () => {
      goToCheck();
    }
  });
}

function goToScan({ sampleId = null, text = null } = {}) {
  navigate("scan", {
    sampleId,
    text,
    onEditPost: (editText) => {
      goToHome(editText || lastPostText);
    },
    onNext: () => {
      goToCheck();
    },
    onTrySample: () => {
      goToScan({ sampleId: "s1" });
    }
  });
}

function goToCheck() {
  navigate("check", {
    onShowMatch: () => {
      goToResult();
    }
  });
}

function goToResult() {
  navigate("result", {
    onCheckAnother: () => {
      lastPostText = "";
      goToHome();
    },
    onChangeTicks: () => {
      goToCheck();
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

  const appEl = document.getElementById("app");
  if (!appEl) return;
  initRouter(appEl);

  const urlParams = new URLSearchParams(window.location.search);

  // Handle ?test=1
  if (urlParams.has("test") || urlParams.get("test") === "1") {
    const { runAllTests, renderSelfTestTable } = await import("./selftest.js");
    const results = runAllTests();
    renderSelfTestTable(results, appEl);
    return;
  }

  // Handle presenter mode (?present=1)
  if (urlParams.has("present") && (!CONFIG.features || CONFIG.features.presenterMode !== false)) {
    const { initPresenterMode } = await import("./presenter.js");
    initPresenterMode();
  }

  // Handle demo mode (?demo=1)
  if (urlParams.has("demo")) {
    goToHome();
    const { runDemo } = await import("./demo.js");
    runDemo(urlParams);
    return;
  }

  // Initialize analytics (will automatically ignore test/demo/present)
  const { initAnalytics } = await import("./analytics.js");
  initAnalytics();

  // Handle compare links if present in query
  let compareData = null;
  if (window.location.search && (!CONFIG.features || CONFIG.features.compareLinks !== false)) {
    const { readCompare } = await import("./links.js");
    compareData = readCompare(window.location.search, CONFIG.limits?.maxLinkSkills);
    try {
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    } catch (e) {
      // Ignore quietly
    }
  }

  // Default to home screen
  goToHome("", compareData);
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", boot);
}
