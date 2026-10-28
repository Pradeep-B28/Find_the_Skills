// What it does: works out the match, the role guess and which program covers the most of the gap. No DOM.
// Uses: lists passed in by the caller (content/ and config.js). Used by: screens, selftest.js, tools/verify-content.mjs.
// LOCKED. Do not edit. Every rule below is checked by tools/verify-content.mjs and the self-test.

// Role guess: the role with the most of its "core" skills found. Needs at least minHits.
// Ties go to the role that comes first in content/roles.js. Returns a role id or null.
export function guessRole(foundIds, roles, minHits = 3) {
  const found = new Set(foundIds);
  let best = null;
  let bestHits = 0;
  for (const r of roles) {
    if (r.retired) continue;
    const hits = r.core.filter((id) => found.has(id)).length;
    if (hits > bestHits) {
      best = r;
      bestHits = hits;
    }
  }
  return best && bestHits >= minHits ? best.id : null;
}

// What the person has and what is missing, both in the order the skills were found.
export function matchReport(foundIds, haveIds) {
  const haveSet = new Set(haveIds);
  const have = foundIds.filter((id) => haveSet.has(id));
  const missing = foundIds.filter((id) => !haveSet.has(id));
  const total = foundIds.length;
  return { total, have, missing, pct: total ? Math.round((have.length / total) * 100) : 0 };
}

// Every program in programOrder (config.programs), best first:
//   1. covers the most missing skills
//   2. then the role's preferred program
//   3. then covers the most of all found skills
//   4. then the order in config.programs
// Each item: { id, covered: [missing ids it covers, in found order], notCovered: [...], coversFound }
export function rankPrograms(foundIds, missingIds, programs, programOrder, roleProgramId = null) {
  const list = [];
  for (const id of programOrder) {
    const p = programs.find((x) => x.id === id);
    if (!p || p.retired) continue;
    const set = new Set(p.covers);
    list.push({
      id: p.id,
      covered: missingIds.filter((s) => set.has(s)),
      notCovered: missingIds.filter((s) => !set.has(s)),
      coversFound: foundIds.filter((s) => set.has(s)).length
    });
  }
  list.sort(
    (a, b) =>
      b.covered.length - a.covered.length ||
      Number(b.id === roleProgramId) - Number(a.id === roleProgramId) ||
      b.coversFound - a.coversFound
  );
  return list;
}

// The program to recommend, or null when nothing is missing or no program covers any missing skill.
// Pass job skills only. Soft skills never decide the program.
export function pickProgram(foundIds, missingIds, programs, programOrder, roleProgramId = null) {
  if (!missingIds.length) return null;
  const ranked = rankPrograms(foundIds, missingIds, programs, programOrder, roleProgramId);
  return ranked.length && ranked[0].covered.length > 0 ? ranked[0] : null;
}

// Splits found skills into job skills and soft skills, keeping the found order in each.
export function splitKinds(foundIds, softIds) {
  const soft = new Set(softIds);
  return { job: foundIds.filter((id) => !soft.has(id)), soft: foundIds.filter((id) => soft.has(id)) };
}

// "tech" or "nontech". A guessed role decides it (its "track").
// With no role: "tech" when at least one job skill is a tech skill and tech skills are at least half of
// the job skills found. Otherwise "nontech" (including a post with only soft skills).
export function postKind(jobIds, roleId, roles, techIds) {
  const role = roleId ? roles.find((r) => r.id === roleId) : null;
  if (role) return role.track === "nontech" ? "nontech" : "tech";
  const tech = new Set(techIds);
  const t = jobIds.filter((id) => tech.has(id)).length;
  const w = jobIds.length - t;
  return t > 0 && t >= w ? "tech" : "nontech";
}

// The headline score. Job skills, unless the post has none, then soft skills.
export function mainScore(jobReport, softReport) {
  const r = jobReport.total > 0 ? jobReport : softReport;
  return { kind: jobReport.total > 0 ? "job" : "soft", have: r.have.length, total: r.total, pct: r.pct };
}

// Skills that carry over to tech, for the switch card. orderedIds is job skills then soft skills.
//   have:  bridge skills the person ticked
//   found: every bridge skill in the post
export function carryOver(orderedIds, haveIds, bridgeIds) {
  const bridge = new Set(bridgeIds);
  const haveSet = new Set(haveIds);
  const found = orderedIds.filter((id) => bridge.has(id));
  return { have: found.filter((id) => haveSet.has(id)), found };
}

// The program for the switch card on a non-tech post: the guessed role's program if it is on,
// otherwise fallbackId (config.switchProgram) if it is on, otherwise null.
export function switchProgram(roleId, roles, programs, programOrder, fallbackId) {
  const on = (id) => !!id && programOrder.includes(id) && programs.some((p) => p.id === id && !p.retired);
  const role = roleId ? roles.find((r) => r.id === roleId) : null;
  if (role && role.track === "nontech" && on(role.program)) return role.program;
  return on(fallbackId) ? fallbackId : null;
}
