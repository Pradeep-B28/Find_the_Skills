// What it does: manages social sharing, web share API, WhatsApp share, copy link, and image download.
// Uses: config.js, js/copy.js, js/links.js, js/events.js, js/shareImage.js.
// Used by: js/cards/share.js.

import { CONFIG } from "../config.js";
import { COPY } from "./copy.js";
import { compareLink, shareText } from "./links.js";
import { emit } from "./events.js";
import { generateShareImageBlob } from "./shareImage.js";

function getOrigin() {
  if (CONFIG.siteUrl && CONFIG.siteUrl.trim().length > 0) {
    return CONFIG.siteUrl.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && window.location && window.location.origin) {
    return window.location.origin;
  }
  return "https://job-post-xray.vercel.app";
}

export async function shareMyMatch({ report, sessionState, roleObj = null, size = "status" }) {
  const main = report.main;
  const jobSkills = sessionState.jobIds || [];
  const softSkills = sessionState.softIds || [];
  const tickedIds = sessionState.ticked || [];
  const roleId = sessionState.roleId || (roleObj ? roleObj.id : null);
  const allFoundIds = [...jobSkills, ...softSkills];

  emit("share:image", { size });

  const blob = await generateShareImageBlob({
    mainScore: main,
    jobSkills,
    softSkills,
    tickedIds,
    roleId,
    size
  });

  const origin = getOrigin();
  const text = shareText(origin, { role: roleObj }, main, allFoundIds, roleId);
  const fileName = `job-post-xray-${main.have}-of-${main.total}.png`;

  if (typeof navigator !== "undefined" && navigator.canShare && typeof File !== "undefined") {
    try {
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: COPY.home.title,
          text,
          files: [file]
        });
        return;
      }
    } catch (err) {
      // User cancelled share or aborted; ignore quietly per spec
      if (err.name === "AbortError") {
        return;
      }
    }
  }

  // Fallback: download PNG file
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

export function shareOnWhatsApp({ report, sessionState, roleObj = null }) {
  const main = report.main;
  const jobSkills = sessionState.jobIds || [];
  const softSkills = sessionState.softIds || [];
  const roleId = sessionState.roleId || (roleObj ? roleObj.id : null);
  const allFoundIds = [...jobSkills, ...softSkills];

  emit("share:whatsapp");

  const origin = getOrigin();
  const text = shareText(origin, { role: roleObj }, main, allFoundIds, roleId);
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

  if (typeof window !== "undefined") {
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }
}

export async function copyCompareLink({ report, sessionState, roleObj = null, buttonEl = null }) {
  const main = report.main;
  const jobSkills = sessionState.jobIds || [];
  const softSkills = sessionState.softIds || [];
  const roleId = sessionState.roleId || (roleObj ? roleObj.id : null);
  const allFoundIds = [...jobSkills, ...softSkills];

  emit("share:copy");

  const origin = getOrigin();
  const link = compareLink(origin, allFoundIds, roleId, main.have);

  let copied = false;
  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(link);
      copied = true;
    } catch (err) {
      copied = false;
    }
  }

  if (!copied && typeof document !== "undefined") {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = link;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      copied = document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch (err) {
      copied = false;
    }
  }

  if (buttonEl) {
    const origText = buttonEl.textContent;
    buttonEl.textContent = COPY.share.copied;
    buttonEl.disabled = true;
    setTimeout(() => {
      buttonEl.textContent = origText;
      buttonEl.disabled = false;
    }, 2000);
  }

  return copied;
}
