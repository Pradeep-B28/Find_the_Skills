// What it does: finds the skills named in a job post and where they appear. No DOM.
// Uses: the skill, combo lists passed in by the caller (content/). Used by: js/content.js, js/engine/requirements.js, selftest.js, tools/verify-content.mjs.
// LOCKED. Do not edit. Every rule below is checked by tools/verify-content.mjs and the self-test.

// The rules, in plain words:
// 1. Web links and email addresses are blanked out first, so "github.com/react" or "jobs@x.co" never count.
//    A web address needs at least 2 characters before the dot, so "B.Com" is not treated as one.
// 2. Each alias is a whole word or phrase. "java" does not match inside "javascript".
//    A space or hyphen in an alias matches any run of spaces or hyphens ("fine tuning" = "fine-tuning").
// 3. "aliases" ignore capital letters. "cased" aliases must match capitals exactly ("Go", "R", "REST").
// 4. A match is dropped if it touches a letter or digit on either side, if "+" or "#" follows it
//    ("C" inside "C++" or "C#"), or if it is part of a word joined by "&" ("R" in "R&D").
// 5. "not" phrases cancel a skill where they appear ("go-getter" is not Go).
// 6. Overlapping matches: the longest wins. "React Native" beats "React". "GitHub Copilot" beats "GitHub".
// 7. Skills with context: true (short or common words like Go, R, C, Spring, Express) only count
//    when another, normal skill is found within 60 characters.
// 8. Retired skills are never searched for, but their ids still work in old links.

export const CONTEXT_WINDOW = 60;
export const DEFAULT_MAX_CHARS = 15000;

const WORD = /[A-Za-z0-9_]/;
const LINKS = /\b(?:https?:\/\/|www\.)\S+|\S+@\S+\.\S+|\b[A-Za-z0-9_-]{2,}\.(?:com|in|org|co)\b\S*/gi;

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
}

// "fine tuning" becomes fine[\s\-]+tuning, so it also matches "fine-tuning".
export function aliasPattern(alias) {
  return alias.trim().split(/[\s-]+/).map(escapeRe).join("[\\s\\-]+");
}

// Same length as the input, so positions still line up with the original text.
export function maskLinks(text) {
  return text.replace(LINKS, (m) => " ".repeat(m.length));
}

function edgesOk(t, s, e) {
  const prev = s > 0 ? t[s - 1] : "";
  const next = e < t.length ? t[e] : "";
  if (prev && WORD.test(prev)) return false;
  if (next && WORD.test(next)) return false;
  if (next === "+" || next === "#") return false;
  if (next === "&" && e + 1 < t.length && WORD.test(t[e + 1])) return false;
  if (prev === "&" && s >= 2 && WORD.test(t[s - 2])) return false;
  return true;
}

function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}

function distance(a, b) {
  if (a.end <= b.start) return b.start - a.end;
  if (b.end <= a.start) return a.start - b.end;
  return 0;
}

// Build once, reuse for every scan.
export function buildIndex({ skills, combos = [] }) {
  const entries = [];
  const nots = [];
  const names = {};
  for (const s of skills) {
    names[s.id] = s.name;
    if (s.retired) continue;
    for (const a of s.aliases || []) {
      entries.push({ re: new RegExp(aliasPattern(a), "gi"), ids: [s.id], ctx: false });
    }
    for (const a of s.cased || []) {
      entries.push({ re: new RegExp(aliasPattern(a), "g"), ids: [s.id], ctx: !!s.context });
    }
    for (const n of s.not || []) {
      nots.push({ re: new RegExp(aliasPattern(n), "gi"), id: s.id });
    }
  }
  for (const c of combos) {
    if (c.retired) continue;
    for (const a of c.aliases) {
      entries.push({ re: new RegExp(aliasPattern(a), "gi"), ids: c.skills.slice(), ctx: false });
    }
  }
  return { entries, nots, names };
}

function allMatches(re, text, fn) {
  re.lastIndex = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[0].length > 0) fn(m.index, m.index + m[0].length);
    re.lastIndex = m.index + 1;
  }
}

// Returns:
//   matches: [{ start, end, ids }] in text order, for highlighting
//   skills:  skill ids in order of first appearance
//   counts:  { id: number of times found }
//   length:  characters scanned, truncated: true if the text was cut at maxChars
export function scan(text, index, maxChars = DEFAULT_MAX_CHARS) {
  const raw = String(text == null ? "" : text);
  const src = raw.slice(0, maxChars);
  const t = maskLinks(src);

  const blocked = [];
  for (const n of index.nots) {
    allMatches(n.re, t, (start, end) => blocked.push({ id: n.id, start, end }));
  }

  const cands = [];
  for (const e of index.entries) {
    allMatches(e.re, t, (start, end) => {
      if (!edgesOk(t, start, end)) return;
      const c = { start, end, ids: e.ids, ctx: e.ctx };
      if (blocked.some((b) => e.ids.includes(b.id) && overlaps(b, c))) return;
      cands.push(c);
    });
  }

  // Longest first, then earliest. The sort is stable, so equal ties keep list order.
  cands.sort((a, b) => (b.end - b.start) - (a.end - a.start) || a.start - b.start);
  const kept = [];
  for (const c of cands) {
    if (!kept.some((k) => overlaps(k, c))) kept.push(c);
  }

  const anchors = kept.filter((k) => !k.ctx);
  const final = kept.filter((k) => !k.ctx || anchors.some((a) => distance(a, k) <= CONTEXT_WINDOW));
  final.sort((a, b) => a.start - b.start);

  const skills = [];
  const counts = {};
  for (const f of final) {
    for (const id of f.ids) {
      if (!(id in counts)) {
        counts[id] = 0;
        skills.push(id);
      }
      counts[id] += 1;
    }
  }

  return {
    matches: final.map((f) => ({ start: f.start, end: f.end, ids: f.ids.slice() })),
    skills,
    counts,
    length: src.length,
    truncated: raw.length > maxChars
  };
}
