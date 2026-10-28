// What it does: manages active job post scan session in memory (text, skills, ticks, role, reports). No DOM.
// Uses: config.js, js/content.js, js/store.js, js/engine/gap.js.
// Used by: screens, selftest.js, router, and main.

import { CONFIG } from "../config.js";
import {
  PROGRAMS,
  ROLES,
  softIds,
  techIds,
  bridgeIds,
  role as getRole,
  scanPost,
  guessRole
} from "./content.js";
import {
  getRememberedSkills,
  saveRememberedSkills,
  clearRememberedSkills
} from "./store.js";
import {
  splitKinds,
  postKind,
  matchReport,
  mainScore,
  rankPrograms,
  pickProgram,
  carryOver,
  switchProgram
} from "./engine/gap.js";

let source = null; // "post" | "link" | null
let postText = "";
let scanData = null;
let jobIds = [];
let softSkillsList = [];
let reqItems = [];
let filmSpans = [];
const ticked = new Set();
let currentRoleId = null;
let friendScoreM = null;
let isRememberActive = false;

export function startFromText(text) {
  source = "post";
  postText = text || "";
  friendScoreM = null;
  ticked.clear();

  const scanRes = scanPost(postText);
  scanData = scanRes.scan;
  jobIds = scanRes.job.slice();
  softSkillsList = scanRes.soft.slice();
  reqItems = scanRes.reqs.slice();
  filmSpans = scanRes.film.slice();

  currentRoleId = guessRole(jobIds);

  if (CONFIG.features && CONFIG.features.rememberSkills) {
    const remembered = getRememberedSkills();
    if (remembered.length > 0) {
      const allFound = [...jobIds, ...softSkillsList];
      for (const id of allFound) {
        if (remembered.includes(id)) {
          ticked.add(id);
        }
      }
    }
  }

  return scanRes;
}

export function startFromLink(parsed) {
  source = "link";
  postText = "";
  scanData = null;
  reqItems = [];
  filmSpans = [];
  ticked.clear();

  const allIds = Array.isArray(parsed?.ids) ? parsed.ids.slice() : [];
  const split = splitKinds(allIds, softIds);
  jobIds = split.job;
  softSkillsList = split.soft;

  currentRoleId = parsed?.roleId || null;
  friendScoreM = parsed?.m !== undefined && parsed?.m !== null ? parsed.m : null;

  if (CONFIG.features && CONFIG.features.rememberSkills) {
    const remembered = getRememberedSkills();
    if (remembered.length > 0) {
      for (const id of allIds) {
        if (remembered.includes(id)) {
          ticked.add(id);
        }
      }
    }
  }
}

export function toggle(id) {
  if (ticked.has(id)) {
    ticked.delete(id);
  } else {
    ticked.add(id);
  }
  if (isRememberActive && CONFIG.features && CONFIG.features.rememberSkills) {
    saveRememberedSkills(Array.from(ticked));
  }
}

export function setRemember(enabled) {
  isRememberActive = Boolean(enabled);
  if (isRememberActive) {
    saveRememberedSkills(Array.from(ticked));
  } else {
    clearRememberedSkills();
  }
}

export function isRememberEnabled() {
  return isRememberActive;
}

export function setRole(roleId) {
  currentRoleId = roleId || null;
}

export function clearTicks() {
  ticked.clear();
  if (isRememberActive && CONFIG.features && CONFIG.features.rememberSkills) {
    saveRememberedSkills([]);
  }
}

export function reset() {
  source = null;
  postText = "";
  scanData = null;
  jobIds = [];
  softSkillsList = [];
  reqItems = [];
  filmSpans = [];
  ticked.clear();
  currentRoleId = null;
  friendScoreM = null;
}

export function getState() {
  return {
    source,
    text: postText,
    scan: scanData,
    jobIds: jobIds.slice(),
    softIds: softSkillsList.slice(),
    reqs: reqItems.slice(),
    film: filmSpans.slice(),
    ticked: Array.from(ticked),
    roleId: currentRoleId,
    friendM: friendScoreM
  };
}

export function report() {
  const roleObj = currentRoleId ? getRole(currentRoleId) : null;
  const kind = postKind(jobIds, currentRoleId, ROLES, techIds);
  const tickedList = Array.from(ticked);

  const jobReport = matchReport(jobIds, tickedList);
  const softReport = matchReport(softSkillsList, tickedList);
  const main = mainScore(jobReport, softReport);

  const base = {
    source,
    kind,
    main,
    job: jobReport,
    soft: softReport,
    roleId: currentRoleId,
    role: roleObj,
    friendM: friendScoreM
  };

  const programOrder = CONFIG.programs || [];

  if (kind === "tech") {
    const roleProgramId = roleObj ? roleObj.program : null;
    const prog = pickProgram(jobIds, jobReport.missing, PROGRAMS, programOrder, roleProgramId);
    const ranked = rankPrograms(jobIds, jobReport.missing, PROGRAMS, programOrder, roleProgramId);
    return {
      ...base,
      program: prog,
      ranked
    };
  }

  const fallbackSwitch = CONFIG.switchProgram;
  const swProg = switchProgram(currentRoleId, ROLES, PROGRAMS, programOrder, fallbackSwitch);
  const orderedIds = [...jobIds, ...softSkillsList];
  const carry = carryOver(orderedIds, tickedList, bridgeIds);

  return {
    ...base,
    switchProgram: swProg,
    carry
  };
}
