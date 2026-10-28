// What it does: loads content, builds engine indexes once, provides lookups and scanning. No DOM.
// Uses: config.js, content/index.js, js/engine/matcher.js, js/engine/requirements.js, js/engine/gap.js, js/score.js.
// Used by: session.js, selftest.js, screens, cards, and router.

import { CONFIG } from "../config.js";
import {
  GROUPS,
  SKILLS,
  COMBOS,
  PROGRAMS,
  ROLES,
  SAMPLES,
  REQ_TYPES,
  REQS,
  CONTENT_VERSION
} from "../content/index.js";
import { buildIndex, scan, DEFAULT_MAX_CHARS } from "./engine/matcher.js";
import { buildReqIndex, findRequirements, mergeSpans } from "./engine/requirements.js";
import { splitKinds, guessRole as engineGuessRole } from "./engine/gap.js";
import { reqLabel } from "./score.js";

// Build indexes once at startup
export const skillIndex = buildIndex({ skills: SKILLS, combos: COMBOS });
export const reqIndex = buildReqIndex({ reqs: REQS });

export const softIds = SKILLS.filter(s => {
  const g = GROUPS.find(gr => gr.id === s.group);
  return g && g.kind === "soft" && !s.retired;
}).map(s => s.id);

export const techIds = SKILLS.filter(s => {
  const g = GROUPS.find(gr => gr.id === s.group);
  return g && g.kind === "tech" && !s.retired;
}).map(s => s.id);

export const bridgeIds = SKILLS.filter(s => s.bridge && !s.retired).map(s => s.id);

export function skill(id) {
  return SKILLS.find(s => s.id === id) || null;
}

export function group(id) {
  return GROUPS.find(g => g.id === id) || null;
}

export function kindOf(id) {
  const s = skill(id);
  if (!s) return null;
  const g = group(s.group);
  return g ? g.kind : null;
}

export function program(id) {
  return PROGRAMS.find(p => p.id === id) || null;
}

export function role(id) {
  return ROLES.find(r => r.id === id) || null;
}

export function sample(id) {
  return SAMPLES.find(s => s.id === id) || null;
}

export function programsOn(configOrder = CONFIG.programs) {
  const order = Array.isArray(configOrder) ? configOrder : [];
  const result = [];
  for (const id of order) {
    const p = program(id);
    if (p && !p.retired) {
      result.push(p);
    }
  }
  return result;
}

export function guessRole(jobIds) {
  if (CONFIG.features && CONFIG.features.roleGuess === false) {
    return null;
  }
  const minHits = CONFIG.limits?.minRoleHits || 3;
  return engineGuessRole(jobIds, ROLES, minHits);
}

export function groupedJob(jobIds) {
  const groups = [];
  const list = Array.isArray(jobIds) ? jobIds : [];
  for (const g of GROUPS) {
    if (g.kind === "soft") continue;
    const matching = list.filter(id => {
      const s = skill(id);
      return s && s.group === g.id;
    });
    if (matching.length > 0) {
      groups.push({
        group: g.id,
        id: g.id,
        name: g.name,
        kind: g.kind,
        skills: matching
      });
    }
  }

  groups.flatIds = groups.flatMap(g => g.skills);
  groups.join = function(sep = ", ") {
    return this.flatMap(g => g.skills).join(sep);
  };
  groups.toString = function() {
    return this.flatMap(g => g.skills).join(", ");
  };
  return groups;
}

export function groupedReqs(items, maxPerType = CONFIG.limits?.maxReqsPerType || 4) {
  if (!items || !items.length) return [];
  const byType = new Map();
  for (const item of items) {
    if (!byType.has(item.type)) {
      byType.set(item.type, []);
    }
    const list = byType.get(item.type);
    if (list.length < maxPerType) {
      const label = reqLabel(item);
      if (label && !list.includes(label)) {
        list.push(label);
      }
    }
  }

  const result = [];
  for (const rt of REQ_TYPES) {
    if (byType.has(rt.id)) {
      const labels = byType.get(rt.id);
      if (labels.length > 0) {
        result.push({
          type: rt.id,
          name: rt.name,
          labels
        });
      }
    }
  }
  return result;
}

export function scanPost(text) {
  const raw = text || "";
  const maxChars = CONFIG.limits?.maxChars || DEFAULT_MAX_CHARS;
  const scanRes = scan(raw, skillIndex, maxChars);
  const reqRes = findRequirements(raw, reqIndex, maxChars);

  const split = splitKinds(scanRes.skills, softIds);
  let job = split.job;
  let soft = split.soft;
  let reqItems = reqRes.items;
  let reqSpans = reqRes.spans;

  if (CONFIG.features && CONFIG.features.softSkills === false) {
    soft = [];
    scanRes.skills = job.slice();
    const softSet = new Set(softIds);
    scanRes.matches = scanRes.matches.filter(m => !m.ids.every(id => softSet.has(id)));
    for (const m of scanRes.matches) {
      m.ids = m.ids.filter(id => !softSet.has(id));
    }
    for (const sid of softIds) {
      delete scanRes.counts[sid];
    }
  }

  if (CONFIG.features && CONFIG.features.requirements === false) {
    reqItems = [];
    reqSpans = [];
  }

  const film = mergeSpans(scanRes.matches, reqSpans, softIds);

  return {
    scan: scanRes,
    job,
    soft,
    reqs: reqItems,
    film
  };
}

export {
  GROUPS,
  SKILLS,
  COMBOS,
  PROGRAMS,
  ROLES,
  SAMPLES,
  REQ_TYPES,
  REQS,
  CONTENT_VERSION
};
