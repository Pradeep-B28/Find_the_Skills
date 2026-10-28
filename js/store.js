// What it does: safe localStorage wrapper for the three allowed keys.
// Uses: none.
// Used by: theme.js, sound.js, session.js, and selftest.js.

const KEY_THEME = "jpx-theme";
const KEY_MUTED = "jpx-muted";
const KEY_SKILLS = "jpx-skills";

function safeGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  if (typeof window !== "undefined" && (window.__JPX_DEMO__ || window.__JPX_PRESENTER__)) {
    return true;
  }
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemove(key) {
  if (typeof window !== "undefined" && (window.__JPX_DEMO__ || window.__JPX_PRESENTER__)) {
    return true;
  }
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getTheme() {
  const val = safeGet(KEY_THEME);
  return val === "dark" || val === "light" ? val : null;
}

export function setTheme(theme) {
  if (theme === "dark" || theme === "light") {
    safeSet(KEY_THEME, theme);
  }
}

export function getMuted() {
  const val = safeGet(KEY_MUTED);
  return val === "1" || val === "true";
}

export function setMuted(muted) {
  safeSet(KEY_MUTED, muted ? "1" : "0");
}

export function getRememberedSkills() {
  const raw = safeGet(KEY_SKILLS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(id => typeof id === "string" && id.length > 0).slice(0, 200);
    }
  } catch {
    // Ignore invalid JSON
  }
  return [];
}

export function saveRememberedSkills(skillIds) {
  if (!Array.isArray(skillIds)) return;
  const clean = Array.from(new Set(skillIds.filter(id => typeof id === "string" && id.length > 0))).slice(0, 200);
  safeSet(KEY_SKILLS, JSON.stringify(clean));
}

export function clearRememberedSkills() {
  safeRemove(KEY_SKILLS);
}

export function hasRememberedSkills() {
  return safeGet(KEY_SKILLS) !== null;
}
