// Content check for Job Post X-Ray.
// Run from the project folder:  node tools/verify-content.mjs
//
// It checks:
//   1. every field in content/ and the content settings in config.js against content/SCHEMA.md
//   2. no alias is used twice, and every alias really finds its own skill or requirement
//   3. every sample job post gives exactly its "expected" skills, its "expectedReqs" and its role
//   4. every tricky sentence in tools/cases.js is read correctly
//   5. all text for long dashes, emojis and banned words
// It prints PASS or FAIL and exits with code 1 if anything fails.

import {
  GROUPS, SKILLS, COMBOS, PROGRAMS, ROLES, SAMPLES, REQ_TYPES, REQS, CONTENT_VERSION
} from "../content/index.js";
import { buildIndex, scan, aliasPattern, DEFAULT_MAX_CHARS } from "../js/engine/matcher.js";
import { buildReqIndex, findRequirements } from "../js/engine/requirements.js";
import {
  guessRole, matchReport, pickProgram, splitKinds, postKind, mainScore, switchProgram
} from "../js/engine/gap.js";
import { CASES, REQ_CASES } from "./cases.js";

let maxChars = DEFAULT_MAX_CHARS;
let minRoleHits = 3;
let programOrder = PROGRAMS.map((p) => p.id);
let switchFallback = null;
let samplesOnHome = null;
let configNote = "config.js not found, using defaults";
try {
  const cfg = await import("../config.js");
  const C = cfg.CONFIG || {};
  if (C.limits && Number.isInteger(C.limits.maxChars)) maxChars = C.limits.maxChars;
  if (C.limits && Number.isInteger(C.limits.minRoleHits)) minRoleHits = C.limits.minRoleHits;
  if (Array.isArray(C.programs)) programOrder = C.programs;
  if (typeof C.switchProgram === "string") switchFallback = C.switchProgram;
  if (Array.isArray(C.samplesOnHome)) samplesOnHome = C.samplesOnHome;
  configNote = "config.js read";
} catch {
  // config.js not created yet.
}

const ID = /^[a-z0-9]{1,12}$/;
const DASHES = /[\u2012\u2013\u2014\u2015]/;
const EMOJI = /\p{Extended_Pictographic}/u;
const BANNED = [
  "guarantee", "placement", "salary", "lakh", "take your job", "replace you", "seats left",
  "get hired", "stupid", "dumb", "idiot", "noob", "loser", "useless"
];

let failures = 0;
function fail(where, msg) {
  failures++;
  console.log(`  FAIL  ${where}: ${msg}`);
}
const isStr = (v) => typeof v === "string" && v.trim().length > 0;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function checkText(where, label, text) {
  if (typeof text !== "string") return;
  if (DASHES.test(text)) fail(where, `${label} has a long dash`);
  if (EMOJI.test(text)) fail(where, `${label} has an emoji`);
  const lower = text.toLowerCase();
  for (const b of BANNED) if (lower.includes(b)) fail(where, `${label} uses the banned word "${b}"`);
}
function aliasList(where, label, list, allowEmpty) {
  if (!Array.isArray(list)) { fail(where, `${label} must be a list`); return; }
  if (!allowEmpty && list.length === 0) fail(where, `${label} is empty`);
  for (const a of list) {
    if (!isStr(a)) fail(where, `${label} has an empty entry`);
    else if (a !== a.trim()) fail(where, `${label} "${a}" has spaces at the ends`);
    else if (label !== "cased" && a !== a.toLowerCase()) fail(where, `${label} "${a}" must be lowercase`);
    try { new RegExp(aliasPattern(a)); } catch { fail(where, `${label} "${a}" is not a valid pattern`); }
  }
}
// Every alias may belong to one skill only. Plain aliases ignore capitals, cased aliases keep them.
function claimer() {
  const lowerOwner = new Map();
  const casedOwner = new Map();
  const norm = (a) => a.split(/[\s-]+/).join(" ");
  return (owner, aliases, cased) => {
    for (const a of aliases || []) {
      const k = norm(a.toLowerCase());
      if (lowerOwner.has(k) && lowerOwner.get(k) !== owner) fail(owner, `alias "${a}" is also used by ${lowerOwner.get(k)}`);
      else if (lowerOwner.has(k)) fail(owner, `alias "${a}" is listed twice`);
      else lowerOwner.set(k, owner);
    }
    for (const a of cased || []) {
      const k = norm(a);
      const lk = norm(a.toLowerCase());
      if (casedOwner.has(k)) fail(owner, `cased alias "${a}" is also used by ${casedOwner.get(k)}`);
      else casedOwner.set(k, owner);
      if (lowerOwner.has(lk) && lowerOwner.get(lk) !== owner) fail(owner, `cased alias "${a}" clashes with an alias of ${lowerOwner.get(lk)}`);
    }
  };
}

// ---------- 1. Groups and skills ----------
const groupById = {};
let softGroups = 0;
for (const g of GROUPS) {
  const w = `group ${g.id}`;
  if (!/^[a-z]{2,12}$/.test(g.id)) fail(w, "id must be 2 to 12 lowercase letters");
  if (groupById[g.id]) fail(w, "id used twice");
  groupById[g.id] = g;
  if (!isStr(g.name)) fail(w, "name missing");
  if (!["tech", "work", "soft"].includes(g.kind)) fail(w, 'kind must be "tech", "work" or "soft"');
  if (g.kind === "soft") softGroups++;
  checkText(w, "name", g.name);
}
if (softGroups < 1) fail("groups", 'needs at least one group with kind "soft"');

const skillById = {};
const claimSkill = claimer();
for (const s of SKILLS) {
  const w = `skill ${s && s.id}`;
  if (!ID.test(s.id)) fail(w, "id must be 1 to 12 lowercase letters or digits");
  if (skillById[s.id]) fail(w, "id used twice");
  skillById[s.id] = s;
  if (!isStr(s.name)) fail(w, "name missing");
  if (!groupById[s.group]) fail(w, `group "${s.group}" does not exist`);
  aliasList(w, "aliases", s.aliases, true);
  if (s.cased !== undefined) aliasList(w, "cased", s.cased, false);
  if ((s.aliases || []).length + (s.cased || []).length === 0) fail(w, "needs at least one alias");
  if (s.context !== undefined && typeof s.context !== "boolean") fail(w, "context must be true or false");
  if (s.context && !(s.cased || []).length) fail(w, "context only applies to cased aliases, and there are none");
  if (s.not !== undefined) aliasList(w, "not", s.not, false);
  if (s.retired !== undefined && typeof s.retired !== "boolean") fail(w, "retired must be true or false");
  if (s.bridge !== undefined && s.bridge !== true) fail(w, "bridge must be true or left out");
  checkText(w, "name", s.name);
  claimSkill(w, s.aliases, s.cased);
}
const kindOf = (id) => (skillById[id] && groupById[skillById[id].group] ? groupById[skillById[id].group].kind : null);
const softIds = SKILLS.filter((s) => kindOf(s.id) === "soft").map((s) => s.id);
const techIds = SKILLS.filter((s) => kindOf(s.id) === "tech").map((s) => s.id);

for (const c of COMBOS) {
  const w = `combo ${c && c.id}`;
  if (!ID.test(c.id)) fail(w, "id must be 1 to 12 lowercase letters or digits");
  aliasList(w, "aliases", c.aliases, false);
  if (!Array.isArray(c.skills) || c.skills.length < 2) fail(w, "needs at least 2 skills");
  for (const id of c.skills || []) {
    if (!skillById[id]) fail(w, `skill "${id}" does not exist`);
    else if (skillById[id].retired) fail(w, `skill "${id}" is retired`);
  }
  claimSkill(w, c.aliases, []);
}

// ---------- 2. Programs, roles and config ----------
const programIds = new Set();
for (const p of PROGRAMS) {
  const w = `program ${p && p.id}`;
  if (!ID.test(p.id)) fail(w, "id must be 1 to 12 lowercase letters or digits");
  if (programIds.has(p.id)) fail(w, "id used twice");
  programIds.add(p.id);
  if (!isStr(p.name) || !p.name.startsWith("Certification Program in ")) fail(w, 'name must start with "Certification Program in "');
  if (p.page !== "" && !/^https:\/\/\S+$/.test(p.page || "")) fail(w, 'page must be "" or a full https:// address');
  if (!Array.isArray(p.covers) || p.covers.length < 5) fail(w, "covers needs at least 5 skills");
  const seen = new Set();
  for (const id of p.covers || []) {
    if (!skillById[id]) fail(w, `covers "${id}", which does not exist`);
    else if (skillById[id].retired) fail(w, `covers "${id}", which is retired`);
    else if (kindOf(id) === "soft") fail(w, `covers "${id}", which is a soft skill`);
    if (seen.has(id)) fail(w, `covers "${id}" twice`);
    seen.add(id);
  }
  checkText(w, "name", p.name);
}
for (const id of programOrder) if (!programIds.has(id)) fail("config.programs", `"${id}" is not a program`);
if (switchFallback !== null && !programOrder.includes(switchFallback)) fail("config.switchProgram", `"${switchFallback}" is not in config.programs`);

const roleIds = new Set();
for (const r of ROLES) {
  const w = `role ${r && r.id}`;
  if (!ID.test(r.id)) fail(w, "id must be 1 to 12 lowercase letters or digits");
  if (roleIds.has(r.id)) fail(w, "id used twice");
  roleIds.add(r.id);
  if (!isStr(r.name)) fail(w, "name missing");
  if (r.article !== undefined && r.article !== "a" && r.article !== "an") fail(w, 'article must be "a" or "an"');
  if (!["tech", "nontech"].includes(r.track)) fail(w, 'track must be "tech" or "nontech"');
  if (r.program !== null && !programIds.has(r.program)) fail(w, `program "${r.program}" does not exist`);
  if (r.track === "nontech" && !isStr(r.switchWhy)) fail(w, "non-tech roles need switchWhy");
  if (r.track === "tech" && r.switchWhy !== undefined) fail(w, "only non-tech roles have switchWhy");
  if (!Array.isArray(r.core) || r.core.length < 5) fail(w, "core needs at least 5 skills");
  const seen = new Set();
  for (const id of r.core || []) {
    if (!skillById[id]) fail(w, `core skill "${id}" does not exist`);
    else if (kindOf(id) === "soft") fail(w, `core skill "${id}" is a soft skill. Use job skills only`);
    if (seen.has(id)) fail(w, `core skill "${id}" listed twice`);
    seen.add(id);
  }
  checkText(w, "name", r.name);
  checkText(w, "switchWhy", r.switchWhy);
}

// ---------- 3. Requirements ----------
const typeIds = new Set();
for (const t of REQ_TYPES) {
  const w = `requirement type ${t.id}`;
  if (!/^[a-z]{2,8}$/.test(t.id)) fail(w, "id must be 2 to 8 lowercase letters");
  if (typeIds.has(t.id)) fail(w, "id used twice");
  typeIds.add(t.id);
  if (!isStr(t.name)) fail(w, "name missing");
  checkText(w, "name", t.name);
}
for (const needed of ["exp", "notice"]) if (!typeIds.has(needed)) fail("requirement types", `"${needed}" is needed by the engine`);
const reqById = {};
const claimReq = claimer();
for (const r of REQS) {
  const w = `requirement ${r && r.id}`;
  if (!ID.test(r.id)) fail(w, "id must be 1 to 12 lowercase letters or digits");
  if (reqById[r.id]) fail(w, "id used twice");
  reqById[r.id] = r;
  if (!typeIds.has(r.type)) fail(w, `type "${r.type}" does not exist`);
  if (!isStr(r.name)) fail(w, "name missing");
  aliasList(w, "aliases", r.aliases, true);
  if (r.cased !== undefined) aliasList(w, "cased", r.cased, false);
  if ((r.aliases || []).length + (r.cased || []).length === 0) fail(w, "needs at least one alias");
  if (r.context && !(r.cased || []).length) fail(w, "context only applies to cased aliases, and there are none");
  if (r.not !== undefined) aliasList(w, "not", r.not, false);
  checkText(w, "name", r.name);
  claimReq(w, r.aliases, r.cased);
}

// ---------- 4. Every alias finds its own skill or requirement ----------
const index = buildIndex({ skills: SKILLS, combos: COMBOS });
const rIndex = buildReqIndex({ reqs: REQS });
let aliasCount = 0;
for (const s of SKILLS) {
  if (s.retired) continue;
  const anchor = s.id === "docker" ? "Python" : "Docker";
  for (const a of s.aliases || []) {
    aliasCount++;
    if (!scan(a, index, maxChars).skills.includes(s.id)) fail(`skill ${s.id}`, `alias "${a}" does not find its own skill`);
  }
  for (const a of s.cased || []) {
    aliasCount++;
    const text = s.context ? `${a} and ${anchor}` : a;
    if (!scan(text, index, maxChars).skills.includes(s.id)) fail(`skill ${s.id}`, `cased alias "${a}" does not find its own skill in "${text}"`);
  }
}
for (const c of COMBOS) {
  for (const a of c.aliases) {
    aliasCount++;
    const got = scan(a, index, maxChars).skills;
    if (!same(got, c.skills)) fail(`combo ${c.id}`, `alias "${a}" found ${got.join(",")}`);
  }
}
let reqAliasCount = 0;
for (const r of REQS) {
  if (r.retired) continue;
  const key = `${r.type}:${r.id}`;
  const anchor = r.id === "chennai" ? "Pune" : "Chennai";
  for (const a of r.aliases || []) {
    reqAliasCount++;
    if (!findRequirements(a, rIndex, maxChars).items.some((i) => i.key === key)) fail(`requirement ${r.id}`, `alias "${a}" does not find it`);
  }
  for (const a of r.cased || []) {
    reqAliasCount++;
    const text = r.context ? `${a} in ${anchor}` : a;
    if (!findRequirements(text, rIndex, maxChars).items.some((i) => i.key === key)) fail(`requirement ${r.id}`, `cased alias "${a}" does not find it in "${text}"`);
  }
}

// ---------- 5. Samples ----------
const sampleRows = [];
const sampleIds = new Set();
for (const s of SAMPLES) {
  const w = `sample ${s && s.id}`;
  if (!/^s\d{1,3}$/.test(s.id)) fail(w, 'id must be "s" and a number');
  if (sampleIds.has(s.id)) fail(w, "id used twice");
  sampleIds.add(s.id);
  if (!isStr(s.title)) fail(w, "title missing");
  if (!roleIds.has(s.role)) fail(w, `role "${s.role}" does not exist`);
  if (!isStr(s.text) || s.text.length > maxChars) fail(w, `text must be 1 to ${maxChars} characters`);
  checkText(w, "title", s.title);
  checkText(w, "text", s.text);

  const r = scan(s.text, index, maxChars);
  const okSkills = Array.isArray(s.expected) && same(r.skills, s.expected);
  if (!okSkills) fail(w, `found [${r.skills.join(", ")}] but expected [${(s.expected || []).join(", ")}]`);
  const q = findRequirements(s.text, rIndex, maxChars).items.map((i) => i.key);
  const okReqs = Array.isArray(s.expectedReqs) && same(q, s.expectedReqs);
  if (!okReqs) fail(w, `requirements [${q.join(", ")}] but expectedReqs [${(s.expectedReqs || []).join(", ")}]`);

  const { job, soft } = splitKinds(r.skills, softIds);
  const role = guessRole(job, ROLES, minRoleHits);
  if (role !== s.role) fail(w, `role guess is ${role}, expected ${s.role}`);
  if (!Array.isArray(s.demoHave) || !s.demoHave.length) fail(w, "demoHave must list at least one skill");
  for (const id of s.demoHave || []) if (!r.skills.includes(id)) fail(w, `demoHave "${id}" is not in the found skills`);

  const jobRep = matchReport(job, s.demoHave || []);
  const softRep = matchReport(soft, s.demoHave || []);
  const main = mainScore(jobRep, softRep);
  const kind = postKind(job, role, ROLES, techIds);
  const rp = ROLES.find((x) => x.id === role);
  let program = "none";
  if (kind === "tech") {
    const best = pickProgram(job, jobRep.missing, PROGRAMS, programOrder, rp ? rp.program : null);
    program = best ? `${best.id} ${best.covered.length}/${jobRep.missing.length}` : "none";
  } else {
    program = `switch ${switchProgram(role, ROLES, PROGRAMS, programOrder, switchFallback) || "none"}`;
  }
  sampleRows.push({
    id: s.id,
    job: job.length,
    soft: soft.length,
    reqs: q.length,
    found: okSkills && okReqs ? "PASS" : "FAIL",
    role: role === s.role ? `${role} PASS` : `${role} FAIL`,
    kind,
    demo: `${main.have}/${main.total} job, ${softRep.have.length}/${softRep.total} soft`,
    program
  });
}
if (samplesOnHome) for (const id of samplesOnHome) if (!sampleIds.has(id)) fail("config.samplesOnHome", `"${id}" is not a sample`);

// ---------- 6. Tricky sentences ----------
let casesPassed = 0;
CASES.forEach(([text, want], i) => {
  const got = scan(text, index, maxChars).skills;
  if (same(got, want)) casesPassed++;
  else fail(`case ${i + 1}`, `"${text}" found [${got.join(", ")}], expected [${want.join(", ")}]`);
});
let reqCasesPassed = 0;
REQ_CASES.forEach(([text, want], i) => {
  const got = findRequirements(text, rIndex, maxChars).items.map((x) => x.key);
  if (same(got, want)) reqCasesPassed++;
  else fail(`requirement case ${i + 1}`, `"${text}" found [${got.join(", ")}], expected [${want.join(", ")}]`);
});

// ---------- Report ----------
const active = SKILLS.filter((s) => !s.retired);
const byKind = (k) => active.filter((s) => kindOf(s.id) === k).length;
const covered = new Set(PROGRAMS.flatMap((p) => p.covers));
console.log(`Content version ${CONTENT_VERSION}. ${configNote}. Max characters: ${maxChars}.`);
console.log(`Skills: ${active.length} active in ${GROUPS.length} groups (tech ${byKind("tech")}, other job skills ${byKind("work")}, soft ${byKind("soft")}). Bridge skills: ${active.filter((s) => s.bridge).length}.`);
console.log(`Skill aliases checked: ${aliasCount}. Combos: ${COMBOS.length}. Roles: ${ROLES.length} (tech ${ROLES.filter((r) => r.track === "tech").length}, non-tech ${ROLES.filter((r) => r.track === "nontech").length}).`);
console.log(`Requirements: ${REQS.length} listed in ${REQ_TYPES.length} types. Requirement aliases checked: ${reqAliasCount}.`);
console.log(`Programs: ${PROGRAMS.map((p) => `${p.id} covers ${p.covers.length}`).join(", ")}. Tech skills no program covers: ${active.filter((s) => kindOf(s.id) === "tech" && !covered.has(s.id)).length}.`);
console.table(sampleRows);
console.log(`Tricky sentences: ${casesPassed}/${CASES.length} skills, ${reqCasesPassed}/${REQ_CASES.length} requirements read correctly.`);
if (failures) {
  console.log(`RESULT: FAIL (${failures} problem${failures === 1 ? "" : "s"})`);
  process.exit(1);
} else {
  console.log("RESULT: ALL PASS");
}
