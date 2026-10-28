// What it does: finds what a job post asks for besides skills (experience, education, location and more). No DOM.
// Uses: js/engine/matcher.js and the lists passed in by the caller (content/requirements.js). Used by: js/content.js, selftest.js, tools/verify-content.mjs.
// LOCKED. Do not edit. Every rule below is checked by tools/verify-content.mjs and the self-test.

// The rules, in plain words:
// 1. Listed requirements (degrees, cities, languages and so on) use exactly the same matching as skills.
// 2. Experience is read from numbers: "0 to 2 years", "2-4 yrs", "3+ years", "minimum 2 years", "two to four years".
//    Months work too: "6+ months". A plain "2 years" only counts when "experience" or "exp" is within 40 characters.
// 3. An experience number is dropped when it is about something else:
//    "age", "aged" or "every" just before it, or "old", "ago", "age", "degree", "course", "program",
//    "bond", "agreement", "contract" or a company's history ("in the industry", "of excellence") just after it.
// 4. Notice periods are read from "notice period: 30 days", "notice of up to 2 months" or "30 days notice".
// 5. Overlaps: the longest match wins, as with skills. Each requirement is listed once, in the order first found.
// 6. mergeSpans() combines skill and requirement highlights for the X-ray film. Skills win any overlap.

import { buildIndex, scan, maskLinks, DEFAULT_MAX_CHARS } from "./matcher.js";

const NUM_WORDS = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20
};
const N = "(\\d{1,2}(?:\\.\\d)?|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty)";
const UNIT = "(years?|yrs?|months?)";
const DASH = "(?:to|-|\\u2013|\\u2014|~)";
const END = "(?![A-Za-z])";

const EXP_PATTERNS = [
  { kind: "range", re: new RegExp(`\\b${N}\\s*\\+?\\s*${DASH}\\s*${N}\\s*\\+?\\s*${UNIT}${END}`, "gi") },
  { kind: "min", re: new RegExp(`\\b(?:minimum|min\\.?|at\\s*least|atleast)\\s*(?:of\\s*)?${N}\\s*\\+?\\s*${UNIT}${END}`, "gi") },
  { kind: "plus", re: new RegExp(`\\b${N}\\s*\\+\\s*${UNIT}${END}`, "gi") },
  { kind: "exact", re: new RegExp(`\\b${N}\\s*${UNIT}${END}`, "gi") }
];

const BEFORE_BAD = /\b(?:age|aged|every)\b/i;
const AFTER_BAD = new RegExp(
  "^[\\s,]*(?:old\\b|of\\s+age\\b|ago\\b|age\\b|degree|course|programme|program|integrated|bond|service\\s+agreement|agreement|contract|warranty" +
  "|in\\s+(?:the\\s+)?(?:industry|business|market)\\b|of\\s+(?:excellence|legacy|trust|service|history|operations)\\b)",
  "i"
);
const EXP_WORD = /\bexp(?:erience|erienced)?\b/i;

const NOTICE_PATTERNS = [
  /\bnotice(?:\s+period)?\s*(?:(?::|-|of|is|up\s*to|upto|within|max(?:imum)?|less\s+than|not\s+more\s+than|serving)\s*)*(\d{1,3})\s*(days?|months?)(?![A-Za-z])/gi,
  /\b(\d{1,3})\s*(days?|months?)\s*(?:of\s+)?notice(?:\s+period)?\b/gi
];

function toNum(s) {
  const w = s.toLowerCase();
  return w in NUM_WORDS ? NUM_WORDS[w] : parseFloat(w);
}
function unitOf(s) {
  return s.toLowerCase().startsWith("m") ? "m" : "y";
}
function fmt(n) {
  return String(n);
}

function allMatches(re, text, fn) {
  re.lastIndex = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[0].length > 0) fn(m);
    re.lastIndex = m.index + 1;
  }
}

function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}

// Build once, reuse for every scan.
export function buildReqIndex({ reqs }) {
  const typeOf = {};
  for (const r of reqs) typeOf[r.id] = r.type;
  return { dict: buildIndex({ skills: reqs, combos: [] }), typeOf };
}

function experienceCandidates(t) {
  const out = [];
  for (const p of EXP_PATTERNS) {
    allMatches(p.re, t, (m) => {
      const start = m.index;
      const end = m.index + m[0].length;
      const before = t.slice(Math.max(0, start - 20), start);
      const after = t.slice(end, end + 30);
      if (BEFORE_BAD.test(before) || AFTER_BAD.test(after)) return;
      let item;
      if (p.kind === "range") {
        const a = toNum(m[1]);
        const b = toNum(m[2]);
        const u = unitOf(m[3]);
        if (!(a <= b) || b > (u === "y" ? 40 : 60)) return;
        item = { key: `exp:${fmt(a)}-${fmt(b)}${u}`, min: a, max: b, plus: false, unit: u };
      } else {
        const a = toNum(m[1]);
        const u = unitOf(m[2]);
        if (a > (u === "y" ? 40 : 60)) return;
        if (p.kind === "exact") {
          const around = t.slice(Math.max(0, start - 40), start) + " " + t.slice(end, end + 40);
          if (!EXP_WORD.test(around)) return;
          item = { key: `exp:${fmt(a)}${u}`, min: a, max: null, plus: false, unit: u };
        } else {
          item = { key: `exp:${fmt(a)}+${u}`, min: a, max: null, plus: true, unit: u };
        }
      }
      out.push({ ...item, type: "exp", id: null, start, end });
    });
  }
  return out;
}

function noticeCandidates(t) {
  const out = [];
  for (const re of NOTICE_PATTERNS) {
    allMatches(re, t, (m) => {
      const n = parseInt(m[1], 10);
      const u = m[2].toLowerCase().startsWith("m") ? "m" : "d";
      if (n > (u === "d" ? 180 : 6)) return;
      out.push({ key: `notice:${n}${u}`, type: "notice", id: null, amount: n, unit: u, start: m.index, end: m.index + m[0].length });
    });
  }
  return out;
}

// Returns:
//   items: one entry per requirement, in the order first found. Each has key, type and either
//          id (a listed requirement) or the numbers (min, max, plus, unit for experience; amount, unit for notice).
//   spans: every place a requirement was found, for highlighting: [{ start, end, key, type }]
export function findRequirements(text, rIndex, maxChars = DEFAULT_MAX_CHARS) {
  const raw = String(text == null ? "" : text);
  const t = maskLinks(raw.slice(0, maxChars));

  const cands = [];
  const d = scan(raw, rIndex.dict, maxChars);
  for (const m of d.matches) {
    const id = m.ids[0];
    const type = rIndex.typeOf[id];
    cands.push({ key: `${type}:${id}`, type, id, start: m.start, end: m.end });
  }
  cands.push(...experienceCandidates(t), ...noticeCandidates(t));

  // Longest first, then earliest. The sort is stable, so equal ties keep the order above.
  const order = cands.map((c, i) => [c, i]);
  order.sort((x, y) => (y[0].end - y[0].start) - (x[0].end - x[0].start) || x[0].start - y[0].start || x[1] - y[1]);
  const kept = [];
  for (const [c] of order) {
    if (!kept.some((k) => overlaps(k, c))) kept.push(c);
  }
  kept.sort((a, b) => a.start - b.start);

  const seen = new Set();
  const items = [];
  for (const k of kept) {
    if (seen.has(k.key)) continue;
    seen.add(k.key);
    const { start, end, ...rest } = k;
    items.push(rest);
  }
  return { items, spans: kept.map((k) => ({ start: k.start, end: k.end, key: k.key, type: k.type })) };
}

// Highlights for the X-ray film, in text order, never overlapping.
// kind is "job", "soft" or "req". A requirement that overlaps any skill is left out of the film
// (it still appears in the "Also asks for" list).
export function mergeSpans(skillMatches, reqSpans, softIds) {
  const soft = new Set(softIds);
  const out = skillMatches.map((m) => ({
    start: m.start,
    end: m.end,
    kind: m.ids.every((id) => soft.has(id)) ? "soft" : "job",
    ids: m.ids.slice(),
    key: null
  }));
  const skillsOnly = out.slice();
  for (const r of reqSpans) {
    if (!skillsOnly.some((s) => overlaps(s, r))) out.push({ start: r.start, end: r.end, kind: "req", ids: [], key: r.key });
  }
  out.sort((a, b) => a.start - b.start);
  return out;
}
