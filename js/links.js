// What it does: builds WhatsApp links, compare links, share text, UTM links, and analytics payloads. No DOM.
// Uses: js/score.js, content/programs.js, content/skills.js, content/roles.js.
// Used by: screens, cards, analytics.js, and selftest.js.

import { list } from "./score.js";
import { SKILLS } from "../content/skills.js";
import { ROLES } from "../content/roles.js";
import { PROGRAMS } from "../content/programs.js";

export function compareLink(origin, foundIds, roleId = null, have = null) {
  const base = (origin || "").replace(/\/+$/, "");
  let url = `${base}/?s=${(foundIds || []).join(".")}`;
  if (roleId) {
    url += `&r=${encodeURIComponent(roleId)}`;
  }
  if (have !== undefined && have !== null) {
    url += `&m=${encodeURIComponent(have)}`;
  }
  return url;
}

export function readCompare(search, maxLinkSkills = 60, skillsList = SKILLS, rolesList = ROLES) {
  if (!search) return null;
  let q;
  if (typeof search === "string") {
    const raw = search.startsWith("?") ? search.slice(1) : search;
    if (!raw) return null;
    q = new URLSearchParams(raw);
  } else {
    q = search;
  }

  if (!q.has("s")) return null;
  const sRaw = q.get("s");
  if (!sRaw) return null;

  const parts = sRaw.split(".");
  if (parts.length < 3 || parts.length > maxLinkSkills) return null;

  const validSkills = new Set(skillsList.map(s => s.id));
  const seen = new Set();
  for (const id of parts) {
    if (!/^[a-z0-9]+$/.test(id)) return null;
    if (seen.has(id)) return null;
    seen.add(id);
    if (!validSkills.has(id)) return null;
  }

  let roleId = null;
  if (q.has("r")) {
    const rRaw = q.get("r");
    if (!rRaw || !rolesList.some(r => r.id === rRaw)) return null;
    roleId = rRaw;
  }

  let m = null;
  if (q.has("m")) {
    const mRaw = q.get("m");
    if (!/^\d+$/.test(mRaw)) return null;
    const mNum = parseInt(mRaw, 10);
    if (mNum < 0 || mNum > parts.length) return null;
    m = mNum;
  }

  return { ids: parts, roleId, m };
}

export function shareText(origin, postInfo, mainScore, foundIds, roleId = null) {
  const roleObj = postInfo?.role || (roleId ? ROLES.find(r => r.id === roleId) : null);
  const article = roleObj ? (roleObj.article || (roleObj.name.match(/^[aeiou]/i) ? "an" : "a")) : "a";
  const roleText = roleObj ? `${article} ${roleObj.name} job post` : "a job post";

  const kindWord = mainScore.kind === "soft" ? "soft skills" : "job skills";
  let scorePhrase = "";
  if (mainScore.total > 0 && mainScore.have === mainScore.total) {
    scorePhrase = `It asks for ${mainScore.total} ${kindWord} and I have all of them.`;
  } else {
    scorePhrase = `It asks for ${mainScore.total} ${kindWord} and I have ${mainScore.have}.`;
  }

  const link = compareLink(origin, foundIds, roleId, mainScore.have);
  return `I X-rayed ${roleText}. ${scorePhrase} How many do you have? ${link}`;
}

export function salesMessage(postInfo, report, programsList = PROGRAMS, skillsList = SKILLS) {
  const roleObj = postInfo?.role;
  const article = roleObj ? (roleObj.article || (roleObj.name.match(/^[aeiou]/i) ? "an" : "a")) : "a";
  const post = roleObj ? `${article} ${roleObj.name} job post` : "a job post";

  const isTech = report.kind === "tech";
  const main = report.main;
  const isSoftOnly = main.kind === "soft";
  const kindWord = isSoftOnly ? "soft skills" : "job skills";

  let matchText = "";
  if (main.total > 0 && main.have === main.total) {
    matchText = `I match all ${main.total} ${kindWord}.`;
  } else {
    matchText = `I match ${main.have} of ${main.total} ${kindWord}.`;
  }

  const skillName = (id) => {
    const s = skillsList.find(x => x.id === id);
    return s ? s.name : id;
  };

  const progObj = report.program?.id ? programsList.find(p => p.id === report.program.id) : null;
  const switchProgObj = report.switchProgram ? programsList.find(p => p.id === report.switchProgram) : null;

  if (isTech) {
    if (main.total > 0 && main.have === main.total) {
      return `Hi, I checked ${post} on Job Post X-Ray. ${matchText} I'd like to know more about Wrench Wise programs.`;
    }
    const missingNames = (report.job.missing || []).map(skillName);
    const missingPhrase = `I'm missing ${list(missingNames)}.`;

    if (progObj) {
      return `Hi, I checked ${post} on Job Post X-Ray. ${matchText} ${missingPhrase} I'd like to know more about the ${progObj.name}.`;
    }
    return `Hi, I checked ${post} on Job Post X-Ray. ${matchText} ${missingPhrase} I'd like to know more about Wrench Wise programs.`;
  } else {
    if (switchProgObj) {
      return `Hi, I checked ${post} on Job Post X-Ray. ${matchText} I'd like to add tech skills, and know more about the ${switchProgObj.name}.`;
    }
    return `Hi, I checked ${post} on Job Post X-Ray. ${matchText} I'd like to add tech skills, and know more about Wrench Wise programs.`;
  }
}

export function salesUrl(phone, postInfo, report, programsList = PROGRAMS, skillsList = SKILLS) {
  if (!phone || !/^\d{11,15}$/.test(phone)) return "";
  const msg = salesMessage(postInfo, report, programsList, skillsList);
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

export function missingIdsPayload(missingIds) {
  if (!missingIds || !missingIds.length) return "";
  const result = [];
  let currentLen = 0;
  for (const id of missingIds) {
    const addition = result.length === 0 ? id.length : 1 + id.length;
    if (currentLen + addition > 100) break;
    result.push(id);
    currentLen += addition;
  }
  return result.join(",");
}

export function utmLink(url, spot, campaign = "job-post-xray-2026") {
  const base = url || "https://wrench-wise.com/";
  const u = new URL(base, "https://wrench-wise.com/");
  u.searchParams.set("utm_source", "job-post-xray");
  u.searchParams.set("utm_medium", "web-app");
  u.searchParams.set("utm_campaign", campaign);
  if (spot) {
    u.searchParams.set("utm_content", spot);
  }
  return u.toString();
}
