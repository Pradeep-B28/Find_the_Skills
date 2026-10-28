// What it does: home screen paste card, character counter, clipboard paste, sample chips.
// Uses: config.js, js/copy.js, js/content.js, js/session.js, js/events.js.
// Used by: js/main.js, js/router.js.

import { CONFIG } from "../../config.js";
import { COPY, t } from "../copy.js";
import { sample as getSample } from "../content.js";
import { emit } from "../events.js";

let containerEl = null;

function createSvg(pathD, viewBox = "0 0 24 24") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);
  svg.appendChild(path);
  return svg;
}

export function mount(rootEl) {
  containerEl = document.createElement("div");
  containerEl.className = "home-container";
  rootEl.appendChild(containerEl);
  return containerEl;
}

export function enter({ onStartScan = null, initialText = "" } = {}) {
  if (!containerEl) return;
  leave();

  while (containerEl.firstChild) {
    containerEl.removeChild(containerEl.firstChild);
  }

  const maxChars = CONFIG.limits?.maxChars || 15000;
  const minChars = CONFIG.limits?.minChars || 40;
  let isSampleSelected = false;

  // Eyebrow
  const eyebrow = document.createElement("div");
  eyebrow.className = "home-eyebrow";
  eyebrow.textContent = COPY.home.eyebrow;
  containerEl.appendChild(eyebrow);

  // Title
  const title = document.createElement("h1");
  title.className = "home-title";
  title.textContent = COPY.home.title;
  containerEl.appendChild(title);

  // Subtitle
  const subtitle = document.createElement("p");
  subtitle.className = "home-subtitle";
  subtitle.textContent = COPY.home.subtitle;
  containerEl.appendChild(subtitle);

  // Paste Card
  const card = document.createElement("div");
  card.className = "paste-card";

  const label = document.createElement("label");
  label.className = "paste-label";
  label.htmlFor = "job-post-input";
  label.textContent = COPY.home.pasteLabel;
  card.appendChild(label);

  const textarea = document.createElement("textarea");
  textarea.id = "job-post-input";
  textarea.className = "home-textarea";
  textarea.placeholder = COPY.home.placeholder;
  textarea.value = initialText || "";
  card.appendChild(textarea);

  // Error message slot
  const errorMsg = document.createElement("div");
  errorMsg.className = "box-error-msg";
  errorMsg.style.display = "none";
  card.appendChild(errorMsg);

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = "flex";
  }

  function clearError() {
    errorMsg.textContent = "";
    errorMsg.style.display = "none";
  }

  // Character counter & toolbar row
  const charRow = document.createElement("div");
  charRow.className = "char-row";

  const countSpan = document.createElement("span");
  countSpan.className = "char-count";
  charRow.appendChild(countSpan);

  const toolbar = document.createElement("div");
  toolbar.className = "paste-toolbar";

  // Clear button
  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "btn btn-text";
  clearBtn.textContent = COPY.home.clear;
  clearBtn.style.display = textarea.value.length > 0 ? "inline-flex" : "none";
  toolbar.appendChild(clearBtn);

  // Clipboard paste button (if supported and enabled)
  let clipBtn = null;
  const canPaste = typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.readText === "function";
  if (canPaste && (!CONFIG.features || CONFIG.features.clipboardPaste !== false)) {
    clipBtn = document.createElement("button");
    clipBtn.type = "button";
    clipBtn.className = "btn btn-secondary";
    const clipIcon = createSvg("M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z");
    clipBtn.appendChild(clipIcon);
    const clipText = document.createElement("span");
    clipText.textContent = COPY.home.clipboard;
    clipBtn.appendChild(clipText);
    toolbar.appendChild(clipBtn);
  }

  charRow.appendChild(toolbar);
  card.appendChild(charRow);

  // X-ray Go button
  const goBtn = document.createElement("button");
  goBtn.type = "button";
  goBtn.id = "btn-xray";
  goBtn.className = "btn btn-primary btn-go";
  goBtn.textContent = COPY.home.go;
  goBtn.disabled = textarea.value.trim().length < minChars;
  card.appendChild(goBtn);

  // Privacy line
  const privacy = document.createElement("div");
  privacy.className = "privacy-line";
  const lockIcon = createSvg("M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z");
  privacy.appendChild(lockIcon);
  const privacyText = document.createElement("span");
  privacyText.textContent = COPY.home.private;
  privacy.appendChild(privacyText);
  card.appendChild(privacy);

  containerEl.appendChild(card);

  function updateCharCount() {
    const len = textarea.value.length;
    countSpan.textContent = t("home.count", {
      count: len.toLocaleString(),
      max: maxChars.toLocaleString()
    });

    if (len > maxChars) {
      countSpan.classList.add("too-long");
      countSpan.textContent += ` - ${t("home.tooLong", { max: maxChars.toLocaleString() })}`;
    } else {
      countSpan.classList.remove("too-long");
    }

    clearBtn.style.display = len > 0 ? "inline-flex" : "none";
    goBtn.disabled = textarea.value.trim().length < minChars;
  }

  textarea.addEventListener("input", () => {
    isSampleSelected = false;
    clearError();
    updateCharCount();
  });

  clearBtn.addEventListener("click", () => {
    textarea.value = "";
    isSampleSelected = false;
    clearError();
    updateCharCount();
    textarea.focus();
  });

  if (clipBtn) {
    clipBtn.addEventListener("click", async () => {
      try {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          textarea.value = clipText;
          isSampleSelected = false;
          clearError();
          updateCharCount();
          textarea.focus();
        }
      } catch (err) {
        showError(COPY.home.clipboardFail);
      }
    });
  }

  function handleGo() {
    const raw = textarea.value;
    const trimmed = raw.trim();
    if (trimmed.length < minChars) return;

    // Check single link
    const isSingleLine = !trimmed.includes("\n");
    const isLinkPattern = /^https?:\/\/\S+$/i.test(trimmed) || /^www\.\S+$/i.test(trimmed);
    if (isSingleLine && isLinkPattern) {
      showError(COPY.home.linkOnly);
      return;
    }

    clearError();
    emit("xray:start", {
      source: isSampleSelected ? "sample" : "paste",
      chars: trimmed.length
    });

    if (onStartScan) {
      onStartScan(trimmed);
    }
  }

  goBtn.addEventListener("click", handleGo);

  textarea.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!goBtn.disabled) {
        handleGo();
      }
    }
  });

  // Sample Chips section
  const sampleSection = document.createElement("div");
  sampleSection.className = "sample-section";

  const sampleTitle = document.createElement("div");
  sampleTitle.className = "sample-title";
  sampleTitle.textContent = COPY.home.samples;
  sampleSection.appendChild(sampleTitle);

  const chipsContainer = document.createElement("div");
  chipsContainer.className = "sample-chips";

  const sampleIds = CONFIG.samplesOnHome || [];
  for (const sid of sampleIds) {
    const s = getSample(sid);
    if (!s) continue;

    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "sample-chip";
    chip.textContent = s.title;

    chip.addEventListener("click", () => {
      textarea.value = s.text;
      isSampleSelected = true;
      clearError();
      updateCharCount();
      card.scrollIntoView({ behavior: "smooth", block: "start" });
      goBtn.focus();
    });

    chipsContainer.appendChild(chip);
  }

  sampleSection.appendChild(chipsContainer);
  containerEl.appendChild(sampleSection);

  // How it works section (3 steps)
  const howSection = document.createElement("div");
  howSection.className = "how-section";

  const steps = [
    {
      text: COPY.home.how1,
      svg: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
    },
    {
      text: COPY.home.how2,
      svg: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
    },
    {
      text: COPY.home.how3,
      svg: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
    }
  ];

  for (const step of steps) {
    const stepEl = document.createElement("div");
    stepEl.className = "how-step";

    const iconEl = document.createElement("div");
    iconEl.className = "how-icon";
    iconEl.appendChild(createSvg(step.svg));
    stepEl.appendChild(iconEl);

    const textEl = document.createElement("div");
    textEl.className = "how-text";
    textEl.textContent = step.text;
    stepEl.appendChild(textEl);

    howSection.appendChild(stepEl);
  }

  containerEl.appendChild(howSection);

  // About details section
  const details = document.createElement("details");
  details.className = "about-details";

  const summary = document.createElement("summary");
  summary.className = "about-summary";
  summary.textContent = COPY.home.aboutTitle;
  details.appendChild(summary);

  const aboutBody = document.createElement("p");
  aboutBody.className = "about-body";
  aboutBody.textContent = COPY.home.aboutBody;
  details.appendChild(aboutBody);

  containerEl.appendChild(details);

  // Initial char count update
  updateCharCount();
}

export function leave() {
  // Cleanup if needed
}
