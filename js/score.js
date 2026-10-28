// What it does: scores, percentages, tier labels, result text lines, and requirement labels. No DOM.
// Uses: js/copy.js, content/requirements.js.
// Used by: content.js, session.js, links.js, screens, cards, and selftest.js.

import { t } from "./copy.js";
import { REQS } from "../content/requirements.js";

export function tier(have, total) {
  if (total > 0 && have === total) return "Ready to apply";
  const p = total ? Math.round((have / total) * 100) : 0;
  if (p >= 75) return "Strong match";
  if (p >= 50) return "Good start";
  if (p >= 25) return "Building up";
  return "Fresh start";
}

export function pct(have, total) {
  return total ? Math.round((have / total) * 100) : 0;
}

export function scanState(jobCount, softCount, minSkills = 3) {
  if (jobCount === 0 && softCount === 0) return "none";
  if (jobCount < minSkills) return "few";
  return "ok";
}

export function matchLine(main) {
  if (main.kind === "job") {
    if (main.have === 0) {
      return t("lines.jobZero", { total: main.total });
    }
    if (main.have === main.total) {
      return t("lines.jobAll", { total: main.total });
    }
    return t("lines.jobMatch", { have: main.have, total: main.total });
  }
  return t("lines.softMatch", { have: main.have, total: main.total });
}

export function softLine(main, soft) {
  if (main.kind === "soft" || !soft || soft.total === 0) {
    return "";
  }
  return t("lines.softLine", { have: soft.have.length, total: soft.total });
}

export function programLine(programName, coveredCount, missingCount) {
  if (!programName || coveredCount === 0) {
    return t("lines.programNone");
  }
  if (coveredCount === missingCount && missingCount === 1) {
    return t("lines.programOne", { program: programName });
  }
  if (coveredCount === missingCount) {
    return t("lines.programAll", { program: programName, missing: missingCount });
  }
  return t("lines.programGap", { program: programName, covered: coveredCount, missing: missingCount });
}

export function carryLine(carry, skillNameFn = (id) => id) {
  if (carry && carry.have && carry.have.length > 0) {
    const names = carry.have.map(skillNameFn);
    return t("lines.carryHave", { list: list(names) });
  }
  if (carry && carry.found && carry.found.length > 0) {
    const names = carry.found.map(skillNameFn);
    return t("lines.carryFound", { list: list(names) });
  }
  return "";
}

export function switchLine(programName) {
  if (!programName) return "";
  return t("lines.switchNext", { program: programName });
}

export function list(names) {
  if (!names || !names.length) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  if (names.length <= 5) {
    return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  }
  return `${names.slice(0, 4).join(", ")} and ${names.length - 4} more`;
}

export function reqLabel(itemOrKey, reqsList = REQS) {
  if (!itemOrKey) return "";

  // Handle object representation from findRequirements
  if (typeof itemOrKey === "object") {
    const item = itemOrKey;
    if (item.id) {
      const match = reqsList.find(r => r.id === item.id);
      return match ? match.name : item.id;
    }
    if (item.type === "exp") {
      const u = item.unit === "m" ? "m" : "y";
      const minNum = typeof item.min === "string" ? parseFloat(item.min) : item.min;
      if (item.max != null) {
        const maxNum = typeof item.max === "string" ? parseFloat(item.max) : item.max;
        return u === "m" ? t("req.expRangeM", { min: minNum, max: maxNum }) : t("req.expRange", { min: minNum, max: maxNum });
      }
      if (item.plus) {
        return u === "m" ? t("req.expPlusM", { min: minNum }) : t("req.expPlus", { min: minNum });
      }
      return u === "m" ? t("req.expExactM", { n: minNum }) : t("req.expExact", { n: minNum });
    }
    if (item.type === "notice") {
      const u = item.unit === "m" ? "m" : "d";
      const amountNum = typeof item.amount === "string" ? parseInt(item.amount, 10) : item.amount;
      return u === "m" ? t("req.noticeM", { n: amountNum }) : t("req.noticeD", { n: amountNum });
    }
    if (item.key) {
      return reqLabel(item.key, reqsList);
    }
  }

  // Handle string key format e.g. "exp:0-2y", "notice:30d", "edu:btech"
  const str = String(itemOrKey);
  const colonIdx = str.indexOf(":");
  if (colonIdx === -1) return str;

  const type = str.slice(0, colonIdx);
  const val = str.slice(colonIdx + 1);

  if (type === "exp") {
    const mRange = val.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)([ym])$/);
    if (mRange) {
      const min = parseFloat(mRange[1]);
      const max = parseFloat(mRange[2]);
      const u = mRange[3];
      return u === "m" ? t("req.expRangeM", { min, max }) : t("req.expRange", { min, max });
    }
    const mPlus = val.match(/^(\d+(?:\.\d+)?)\+([ym])$/);
    if (mPlus) {
      const min = parseFloat(mPlus[1]);
      const u = mPlus[2];
      return u === "m" ? t("req.expPlusM", { min }) : t("req.expPlus", { min });
    }
    const mExact = val.match(/^(\d+(?:\.\d+)?)([ym])$/);
    if (mExact) {
      const n = parseFloat(mExact[1]);
      const u = mExact[2];
      return u === "m" ? t("req.expExactM", { n }) : t("req.expExact", { n });
    }
  }

  if (type === "notice") {
    const mNotice = val.match(/^(\d+)([dm])$/);
    if (mNotice) {
      const n = parseInt(mNotice[1], 10);
      const u = mNotice[2];
      return u === "m" ? t("req.noticeM", { n }) : t("req.noticeD", { n });
    }
  }

  const listed = reqsList.find(r => r.id === val);
  return listed ? listed.name : val;
}

export function bannerText(linkData, roleObj, totalSkills, kindWord = "job skills") {
  const article = roleObj ? (roleObj.article || (roleObj.name.match(/^[aeiou]/i) ? "an" : "a")) : "a";
  const roleName = roleObj ? `${roleObj.name} job post` : "job post";

  if (linkData && linkData.m !== undefined && linkData.m !== null) {
    return `A friend has ${linkData.m} of the ${totalSkills} ${kindWord} ${article} ${roleName} asks for. How many do you have?`;
  }
  return `Someone sent you the ${totalSkills} ${kindWord} ${article} ${roleName} asks for. How many do you have?`;
}

export function headToHead(youHave, friendHave) {
  if (youHave > friendHave) {
    return t("lines.h2hAhead", { you: youHave, friend: friendHave });
  }
  if (youHave === friendHave) {
    return t("lines.h2hTie", { you: youHave, friend: friendHave });
  }
  return t("lines.h2hBehind", { you: youHave, friend: friendHave });
}
