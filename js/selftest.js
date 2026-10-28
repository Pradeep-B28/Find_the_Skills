// What it does: self-test suite running checks a to v from Section 10 of the brief.
// Uses: all engine and data files, tools/cases.js.
// Used by: ?test=1 in browser or direct node run.

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
import {
  skillIndex,
  reqIndex,
  softIds,
  techIds,
  bridgeIds,
  skill,
  group,
  kindOf,
  program,
  role,
  sample,
  programsOn,
  groupedJob,
  groupedReqs,
  scanPost,
  guessRole
} from "./content.js";
import {
  tier,
  pct,
  scanState,
  matchLine,
  softLine,
  programLine,
  carryLine,
  switchLine,
  list,
  reqLabel,
  bannerText,
  headToHead
} from "./score.js";
import {
  compareLink,
  readCompare,
  shareText,
  salesMessage,
  salesUrl,
  missingIdsPayload,
  utmLink
} from "./links.js";
import {
  getTheme,
  setTheme,
  getMuted,
  setMuted,
  getRememberedSkills,
  saveRememberedSkills,
  clearRememberedSkills
} from "./store.js";
import { payloadsFor } from "./analytics.js";
import {
  startFromText,
  startFromLink,
  toggle,
  setRemember,
  setRole,
  clearTicks,
  reset,
  report
} from "./session.js";
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
import { scan } from "./engine/matcher.js";
import { findRequirements, mergeSpans } from "./engine/requirements.js";
import { CASES, REQ_CASES } from "../tools/cases.js";
import { COPY } from "./copy.js";

export function runAllTests() {
  const results = [];

  function assert(name, condition, details = "") {
    results.push({ name, pass: Boolean(condition), details: condition ? "" : details });
  }

  // === a. Content loading ===
  const activeSkills = SKILLS.filter(s => !s.retired);
  assert("a1: 332 active skills", activeSkills.length === 332, `Found ${activeSkills.length}`);
  assert("a2: 21 groups", GROUPS.length === 21, `Found ${GROUPS.length}`);
  assert("a3: 157 tech skills", techIds.length === 157, `Found ${techIds.length}`);
  const workSkills = activeSkills.filter(s => kindOf(s.id) === "work");
  assert("a4: 145 other job skills", workSkills.length === 145, `Found ${workSkills.length}`);
  assert("a5: 30 soft skills", softIds.length === 30, `Found ${softIds.length}`);
  assert("a6: 37 bridge skills", bridgeIds.length === 37, `Found ${bridgeIds.length}`);
  assert("a7: 4 combos", COMBOS.length === 4, `Found ${COMBOS.length}`);
  assert("a8: 4 programs", PROGRAMS.length === 4, `Found ${PROGRAMS.length}`);
  assert("a9: 25 roles", ROLES.length === 25, `Found ${ROLES.length}`);
  const techRoles = ROLES.filter(r => r.track === "tech" || !r.track);
  const nonTechRoles = ROLES.filter(r => r.track === "nontech");
  assert("a10: 13 tech roles, 12 non-tech roles", techRoles.length === 13 && nonTechRoles.length === 12, `Tech: ${techRoles.length}, Nontech: ${nonTechRoles.length}`);
  assert("a11: 11 samples", SAMPLES.length === 11, `Found ${SAMPLES.length}`);
  assert("a12: 103 requirements in 9 types", REQS.length === 103 && REQ_TYPES.length === 9, `Reqs: ${REQS.length}, Types: ${REQ_TYPES.length}`);

  // Unique IDs
  const allSkillIds = new Set(SKILLS.map(s => s.id));
  assert("a13: All skill IDs unique", allSkillIds.size === SKILLS.length);
  const allRoleIds = new Set(ROLES.map(r => r.id));
  assert("a14: All role IDs unique", allRoleIds.size === ROLES.length);
  const allReqIds = new Set(REQS.map(r => r.id));
  assert("a15: All req IDs unique", allReqIds.size === REQS.length);

  // Config refs exist
  const progsExist = CONFIG.programs.every(id => PROGRAMS.some(p => p.id === id));
  assert("a16: CONFIG.programs exist", progsExist);
  const samplesExist = CONFIG.samplesOnHome.every(id => SAMPLES.some(s => s.id === id));
  assert("a17: CONFIG.samplesOnHome exist", samplesExist);
  assert("a18: CONFIG.switchProgram in CONFIG.programs", CONFIG.programs.includes(CONFIG.switchProgram));

  // === b. The engines in the browser ===
  let allSamplesMatchExpected = true;
  for (const s of SAMPLES) {
    const d = scan(s.text, skillIndex, CONFIG.limits.maxChars);
    const sameSkills = JSON.stringify(d.skills) === JSON.stringify(s.expected);
    const r = findRequirements(s.text, reqIndex, CONFIG.limits.maxChars);
    const sameReqs = JSON.stringify(r.items.map(it => it.key)) === JSON.stringify(s.expectedReqs);
    if (!sameSkills || !sameReqs) {
      allSamplesMatchExpected = false;
      break;
    }
  }
  assert("b1: Scanning each sample gives expected and expectedReqs", allSamplesMatchExpected);

  // 147 tricky sentences
  let casesPass = true;
  for (const [sentence, expectedSkills] of CASES) {
    const d = scan(sentence, skillIndex, CONFIG.limits.maxChars);
    if (JSON.stringify(d.skills) !== JSON.stringify(expectedSkills)) {
      casesPass = false;
      break;
    }
  }
  for (const [sentence, expectedReqs] of REQ_CASES) {
    const r = findRequirements(sentence, reqIndex, CONFIG.limits.maxChars);
    const actual = r.items.map(it => it.key);
    if (JSON.stringify(actual) !== JSON.stringify(expectedReqs)) {
      casesPass = false;
      break;
    }
  }
  assert("b2: 147 tricky sentences match", casesPass);

  // Highlight counts
  const expectedHighlights = {
    s1: [26, 8, 23, 3, 8],
    s2: [25, 6, 23, 2, 6],
    s3: [15, 5, 13, 2, 5],
    s4: [20, 3, 18, 2, 3],
    s5: [23, 3, 21, 2, 3],
    s6: [17, 2, 15, 2, 2],
    s7: [17, 7, 14, 3, 7],
    s8: [14, 6, 12, 2, 6],
    s9: [14, 8, 7, 7, 8],
    s10: [13, 6, 9, 4, 6],
    s11: [16, 8, 14, 2, 8]
  };
  let highlightsPass = true;
  for (const s of SAMPLES) {
    const exp = expectedHighlights[s.id];
    if (!exp) continue;
    const d = scan(s.text, skillIndex, CONFIG.limits.maxChars);
    const r = findRequirements(s.text, reqIndex, CONFIG.limits.maxChars);
    const film = mergeSpans(d.matches, r.spans, softIds);
    const jobFilm = film.filter(f => f.kind === "job").length;
    const softFilm = film.filter(f => f.kind === "soft").length;
    const reqFilm = film.filter(f => f.kind === "req").length;
    if (d.matches.length !== exp[0] || r.spans.length !== exp[1] ||
        jobFilm !== exp[2] || softFilm !== exp[3] || reqFilm !== exp[4]) {
      highlightsPass = false;
      break;
    }
  }
  assert("b3: Highlight counts match Section 10 table", highlightsPass);

  // s1 mention counts
  const s1Scan = scan(sample("s1").text, skillIndex, CONFIG.limits.maxChars);
  const s1Counts = s1Scan.counts;
  const expTwice = ["mongodb", "express", "react", "node", "js", "auth", "aitools"];
  const mentionsCorrect = expTwice.every(id => s1Counts[id] === 2) &&
    s1Scan.skills.filter(id => !expTwice.includes(id)).every(id => s1Counts[id] === 1);
  assert("b4: s1 mention counts correct", mentionsCorrect);

  // === c. s1 in detail ===
  const s1Post = scanPost(sample("s1").text);
  const s1JobGrouped = groupedJob(s1Post.job);
  const s1ExpectedJobGrouped = "js, ts, react, html, css, nextjs, express, node, rest, auth, mongodb, sql, docker, aws, github, git, dsa, oop, aitools";
  assert("c1: s1 groupedJob", s1JobGrouped.flatIds.join(", ") === s1ExpectedJobGrouped, `Got: ${s1JobGrouped.flatIds.join(", ")}`);
  assert("c2: s1 soft skills", s1Post.soft.join(", ") === "motivated, comm, team");

  const s1ReqGrouped = groupedReqs(s1Post.reqs);
  const s1ReqMap = Object.fromEntries(s1ReqGrouped.map(g => [g.name, g.labels.join(", ")]));
  assert("c3: s1 groupedReqs",
    s1ReqMap["Experience"] === "0 to 2 years" &&
    s1ReqMap["Education"] === "B.E. or B.Tech, BCA, MCA" &&
    s1ReqMap["Work mode"] === "Hybrid" &&
    s1ReqMap["Location"] === "Chennai" &&
    s1ReqMap["Joining"] === "Immediate joiners"
  );

  const s2Post = scanPost(sample("s2").text);
  const s2ReqMap = Object.fromEntries(groupedReqs(s2Post.reqs).map(g => [g.name, g.labels.join(", ")]));
  assert("c4: s2 groupedReqs",
    s2ReqMap["Experience"] === "2 to 4 years" &&
    s2ReqMap["Education"] === "B.E. or B.Tech, Computer Science or IT" &&
    s2ReqMap["Location"] === "Bengaluru" &&
    s2ReqMap["Joining"] === "Notice period up to 30 days"
  );

  const s7Post = scanPost(sample("s7").text);
  const s7ReqMap = Object.fromEntries(groupedReqs(s7Post.reqs).map(g => [g.name, g.labels.join(", ")]));
  assert("c5: s7 groupedReqs",
    s7ReqMap["Experience"] === "1 to 3 years" &&
    s7ReqMap["Education"] === "Any graduate, MBA or PGDM" &&
    s7ReqMap["Work mode"] === "On-site" &&
    s7ReqMap["Location"] === "Chennai" &&
    s7ReqMap["Languages"] === "English, Tamil"
  );

  // === d. Tech samples with demoHave ticked ===
  const techTableExp = [
    { id: "s1", role: "fsd", jobHave: 7, jobTot: 19, pct: 37, tier: "Building up", softHave: 1, softTot: 3, prog: "fsd", cov: 10, missTot: 12, notIn: "dsa, nextjs" },
    { id: "s2", role: "java", jobHave: 4, jobTot: 20, pct: 20, tier: "Fresh start", softHave: 1, softTot: 2, prog: "fsd", cov: 4, missTot: 16, notIn: "spring, hibernate, postgres, junit, maven, jenkins, kafka, rabbitmq, k8s, c, cpp, agile" },
    { id: "s3", role: "da", jobHave: 3, jobTot: 10, pct: 30, tier: "Building up", softHave: 1, softTot: 2, prog: "aiml", cov: 6, missTot: 7, notIn: "tableau" },
    { id: "s4", role: "mle", jobHave: 4, jobTot: 17, pct: 24, tier: "Fresh start", softHave: 1, softTot: 2, prog: "aiml", cov: 9, missTot: 13, notIn: "docker, aws, go, rust" },
    { id: "s5", role: "gai", jobHave: 4, jobTot: 17, pct: 24, tier: "Fresh start", softHave: 1, softTot: 2, prog: "genai", cov: 11, missTot: 13, notIn: "llamaindex, finetune" },
    { id: "s6", role: "fe", jobHave: 5, jobTot: 13, pct: 38, tier: "Building up", softHave: 1, softTot: 2, prog: "fsd", cov: 5, missTot: 8, notIn: "sass, figma, nextjs" }
  ];
  let techPass = true;
  for (const tRow of techTableExp) {
    const s = sample(tRow.id);
    startFromText(s.text);
    // tick demoHave
    clearTicks();
    for (const h of s.demoHave) toggle(h);
    const rep = report();
    if (rep.roleId !== tRow.role ||
        rep.job.have.length !== tRow.jobHave || rep.job.total !== tRow.jobTot ||
        rep.job.pct !== tRow.pct || tier(rep.job.have.length, rep.job.total) !== tRow.tier ||
        rep.soft.have.length !== tRow.softHave || rep.soft.total !== tRow.softTot ||
        rep.program?.id !== tRow.prog ||
        rep.program?.covered.length !== tRow.cov ||
        rep.job.missing.length !== tRow.missTot ||
        rep.program?.notCovered.join(", ") !== tRow.notIn) {
      techPass = false;
      break;
    }
  }
  assert("d: Tech samples match Section 10d", techPass);

  // === e. Non-tech samples with demoHave ticked ===
  const nonTechTableExp = [
    { id: "s7", role: "mkt", jobHave: 4, jobTot: 13, pct: 31, tier: "Building up", softHave: 2, softTot: 3, swProg: "aiml", cTicked: "excel, comm, detail", cFound: "webanalytics, excel, graphic, comm, analytical, detail" },
    { id: "s8", role: "acct", jobHave: 4, jobTot: 12, pct: 33, tier: "Building up", softHave: 1, softTot: 2, swProg: "aiml", cTicked: "excel, detail", cFound: "mis, excel, detail" },
    { id: "s9", role: "sales", jobHave: 2, jobTot: 6, pct: 33, tier: "Building up", softHave: 3, softTot: 5, swProg: "aiml", cTicked: "comm", cFound: "comm" },
    { id: "s10", role: "hr", jobHave: 3, jobTot: 6, pct: 50, tier: "Good start", softHave: 2, softTot: 4, swProg: "aiml", cTicked: "comm", cFound: "comm, stake" },
    { id: "s11", role: "mech", jobHave: 3, jobTot: 9, pct: 33, tier: "Building up", softHave: 2, softTot: 2, swProg: "sde", cTicked: "problem, learn", cFound: "problem, learn" }
  ];
  let nonTechPass = true;
  for (const nRow of nonTechTableExp) {
    const s = sample(nRow.id);
    startFromText(s.text);
    clearTicks();
    for (const h of s.demoHave) toggle(h);
    const rep = report();
    if (rep.roleId !== nRow.role ||
        rep.job.have.length !== nRow.jobHave || rep.job.total !== nRow.jobTot ||
        rep.job.pct !== nRow.pct || tier(rep.job.have.length, rep.job.total) !== nRow.tier ||
        rep.soft.have.length !== nRow.softHave || rep.soft.total !== nRow.softTot ||
        rep.switchProgram !== nRow.swProg ||
        rep.carry.have.join(", ") !== nRow.cTicked ||
        rep.carry.found.join(", ") !== nRow.cFound) {
      nonTechPass = false;
      break;
    }
  }
  assert("e1: Non-tech samples match Section 10e", nonTechPass);

  // Carry-over lines
  const s7 = sample("s7");
  startFromText(s7.text);
  clearTicks();
  for (const h of s7.demoHave) toggle(h);
  const s7Rep = report();
  const s7CarryLine = carryLine(s7Rep.carry, id => skill(id).name);
  assert("e2: s7 carry line", s7CarryLine === "Skills you have that carry over to tech: Excel, Communication and Attention to detail.");

  const s11 = sample("s11");
  startFromText(s11.text);
  clearTicks();
  for (const h of s11.demoHave) toggle(h);
  const s11Rep = report();
  const s11CarryLine = carryLine(s11Rep.carry, id => skill(id).name);
  assert("e3: s11 carry line", s11CarryLine === "Skills you have that carry over to tech: Problem solving and Willingness to learn.");

  // None ticked
  const fakeCarry = { have: [], found: ["excel", "mis", "detail", "time", "comm", "problem"] };
  const fakeCarryLine = carryLine(fakeCarry, id => skill(id).name);
  assert("e4: none ticked carry line", fakeCarryLine === "Skills in this job that carry over to tech: Excel, MIS reporting, Attention to detail, Time management and 2 more.");

  // Switch lines
  assert("e5: s7 switch line", switchLine(program(s7Rep.switchProgram).name) === "A good next step: the Certification Program in Artificial Intelligence & Machine Learning.");
  assert("e6: s11 switch line", switchLine(program(s11Rep.switchProgram).name) === "A good next step: the Certification Program in AI-Powered Software Engineering & DSA.");

  // === f. Rankings ===
  const s1Ranked = rankPrograms(s1Post.job, matchReport(s1Post.job, sample("s1").demoHave).missing, PROGRAMS, CONFIG.programs, "fsd");
  const s1RankStr = s1Ranked.map(r => `${r.id}:${r.covered.length}/${r.coversFound}`).join(" ");
  assert("f1: s1 rankings", s1RankStr === "fsd:10/15 sde:8/12 genai:1/3 aiml:0/3", `Got: ${s1RankStr}`);

  const s5Post = scanPost(sample("s5").text);
  const s5Ranked = rankPrograms(s5Post.job, matchReport(s5Post.job, sample("s5").demoHave).missing, PROGRAMS, CONFIG.programs, "genai");
  const s5RankStr = s5Ranked.map(r => `${r.id}:${r.covered.length}/${r.coversFound}`).join(" ");
  assert("f2: s5 rankings", s5RankStr === "genai:11/15 aiml:10/13 fsd:3/6 sde:0/0", `Got: ${s5RankStr}`);

  // === g. Role guesses ===
  const roleCases = [
    [["py", "ml", "stats", "pandas"], "ds"],
    [["py", "pandas", "stats", "sql", "excel"], "da"],
    [["html", "css", "js", "react"], "fsd"],
    [["java", "spring", "rest", "sql", "micro"], "java"],
    [["tally", "gst", "excel"], "acct"],
    [["seo", "sem", "smm"], "mkt"],
    [["photoshop", "canva", "figma", "html"], null],
    [["py", "git", "langchain"], null],
    [["kotlin", "swift"], null],
    [[], null]
  ];
  let rolesPass = true;
  for (const [found, exp] of roleCases) {
    if (guessRole(found) !== exp) {
      rolesPass = false;
      break;
    }
  }
  assert("g: Role guesses match Section 10g", rolesPass);

  // === h. Post kind, main score and scan state ===
  const kindCases = [
    [["excel", "sql", "tally", "gst"], null, "tech"],
    [["seo", "sem", "py"], null, "nontech"],
    [[], null, "nontech"],
    [["js"], null, "tech"],
    [["seo", "sem", "py"], "fsd", "tech"],
    [["js", "react"], "mkt", "nontech"]
  ];
  let kindsPass = true;
  for (const [jSkills, rId, exp] of kindCases) {
    if (postKind(jSkills, rId, ROLES, techIds) !== exp) {
      kindsPass = false;
      break;
    }
  }
  assert("h1: Post kind cases match", kindsPass);

  const ms1 = mainScore(matchReport(["a", "b"], ["a"]), matchReport(["x"], []));
  assert("h2: mainScore job 1/2 50", ms1.kind === "job" && ms1.have === 1 && ms1.total === 2 && ms1.pct === 50);
  const ms2 = mainScore(matchReport([], []), matchReport(["x", "y", "z"], ["x", "y"]));
  assert("h3: mainScore soft 2/3 67", ms2.kind === "soft" && ms2.have === 2 && ms2.total === 3 && ms2.pct === 67);
  const ms3 = mainScore(matchReport([], []), matchReport([], []));
  assert("h4: mainScore none 0/0 0", ms3.kind === "soft" && ms3.have === 0 && ms3.total === 0 && ms3.pct === 0);

  assert("h5: scanState cases",
    scanState(0, 0, 3) === "none" &&
    scanState(0, 3, 3) === "few" &&
    scanState(2, 1, 3) === "few" &&
    scanState(3, 0, 3) === "ok" &&
    scanState(19, 3, 3) === "ok"
  );

  // === i. Program picks ===
  const pick1 = pickProgram(["py", "git", "langchain"], ["py", "git", "langchain"], PROGRAMS, CONFIG.programs, null);
  assert("i1: pickProgram no role -> fsd", pick1?.id === "fsd" && pick1.covered.length === 3);

  const pick2 = pickProgram(["py", "git", "langchain"], ["py", "git", "langchain"], PROGRAMS, CONFIG.programs, "genai");
  assert("i2: pickProgram role genai -> genai", pick2?.id === "genai" && pick2.covered.length === 3);

  const pick3 = pickProgram(["py", "git", "langchain"], ["py", "git", "langchain"], PROGRAMS, ["aiml", "genai"], null);
  assert("i3: pickProgram aiml, genai -> aiml", pick3?.id === "aiml" && pick3.covered.length === 3);

  const pick4 = pickProgram(["kotlin", "swift", "flutter"], ["kotlin", "swift", "flutter"], PROGRAMS, CONFIG.programs, null);
  assert("i4: pickProgram unteachable -> null", pick4 === null);

  const pick5 = pickProgram(["js", "react", "node"], [], PROGRAMS, CONFIG.programs, null);
  assert("i5: pickProgram nothing missing -> null", pick5 === null);

  // switchProgram table
  const swCases = [
    ["mkt", ["sde", "fsd", "aiml", "genai"], "aiml"],
    ["design", ["sde", "fsd", "aiml", "genai"], "fsd"],
    ["mech", ["sde", "fsd", "aiml", "genai"], "sde"],
    [null, ["sde", "fsd", "aiml", "genai"], "aiml"],
    ["design", ["sde", "aiml", "genai"], "aiml"],
    [null, ["sde", "fsd"], null],
    ["fsd", ["sde", "fsd", "aiml", "genai"], "aiml"]
  ];
  let swPass = true;
  for (const [rId, order, exp] of swCases) {
    if (switchProgram(rId, ROLES, PROGRAMS, order, "aiml") !== exp) {
      swPass = false;
      break;
    }
  }
  assert("i6: switchProgram cases match", swPass);

  // === j. Tiers ===
  assert("j: Tiers match Section 10j",
    tier(0, 19) === "Fresh start" &&
    tier(4, 19) === "Fresh start" &&
    tier(5, 19) === "Building up" &&
    tier(9, 19) === "Building up" &&
    tier(10, 19) === "Good start" &&
    tier(14, 19) === "Good start" &&
    tier(15, 19) === "Strong match" &&
    tier(18, 19) === "Strong match" &&
    tier(19, 19) === "Ready to apply"
  );

  // === k. Percent ===
  assert("k: Percent rounding matches Section 10k",
    pct(7, 19) === 37 &&
    pct(1, 3) === 33 &&
    pct(2, 3) === 67 &&
    pct(1, 8) === 13 &&
    pct(3, 8) === 38 &&
    pct(0, 5) === 0 &&
    pct(5, 5) === 100
  );

  // === l. Lines ===
  assert("l1: matchLine job 7/19", matchLine({ kind: "job", have: 7, total: 19 }) === "You match 7 of 19 job skills.");
  assert("l2: matchLine job 0/19", matchLine({ kind: "job", have: 0, total: 19 }) === "You match 0 of 19 job skills. Every one of them can be learned.");
  assert("l3: matchLine job 19/19", matchLine({ kind: "job", have: 19, total: 19 }) === "You match all 19 job skills.");
  assert("l4: matchLine soft 2/3", matchLine({ kind: "soft", have: 2, total: 3 }) === "You match 2 of 3 soft skills.");
  assert("l5: softLine s1", softLine({ kind: "job" }, { total: 3, have: ["a"] }) === "Soft skills: 1 of 3.");
  assert("l6: softLine empty", softLine({ kind: "soft" }, { total: 3, have: ["a"] }) === "");

  assert("l7: programLine s1", programLine(program("fsd").name, 10, 12) === "The Certification Program in AI-Powered Full Stack Development covers 10 of the 12 skills you're missing.");
  assert("l8: programLine s3", programLine(program("aiml").name, 6, 7) === "The Certification Program in Artificial Intelligence & Machine Learning covers 6 of the 7 skills you're missing.");
  assert("l9: programLine covers 3 of 3", programLine(program("fsd").name, 3, 3) === "The Certification Program in AI-Powered Full Stack Development covers all 3 skills you're missing.");
  assert("l10: programLine covers 1 of 1", programLine(program("fsd").name, 1, 1) === "The Certification Program in AI-Powered Full Stack Development covers the one skill you're missing.");
  assert("l11: programLine no program", programLine(null, 0, 0) === "None of our programs teach these skills yet.");

  // === m. Lists ===
  assert("m: list() matches Section 10m table",
    list([]) === "" &&
    list(["React"]) === "React" &&
    list(["React", "Node.js"]) === "React and Node.js" &&
    list(["A", "B", "C"]) === "A, B and C" &&
    list(["A", "B", "C", "D", "E"]) === "A, B, C, D and E" &&
    list(["A", "B", "C", "D", "E", "F"]) === "A, B, C, D and 2 more" &&
    list(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]) === "A, B, C, D and 8 more"
  );

  // === n. Requirement labels ===
  assert("n: reqLabel matches Section 10n",
    reqLabel("exp:0-2y") === "0 to 2 years" &&
    reqLabel("exp:3+y") === "3+ years" &&
    reqLabel("exp:1y") === "1 year" &&
    reqLabel("exp:1.5y") === "1.5 years" &&
    reqLabel("exp:6+m") === "6+ months" &&
    reqLabel("notice:30d") === "Notice period up to 30 days" &&
    reqLabel("notice:1m") === "Notice period up to 1 month" &&
    reqLabel("notice:2m") === "Notice period up to 2 months" &&
    reqLabel("edu:btech") === "B.E. or B.Tech"
  );

  // === o. Sales messages ===
  startFromText(sample("s1").text);
  clearTicks();
  for (const h of sample("s1").demoHave) toggle(h);
  const s1Url = salesUrl("910000000000", { role: role("fsd") }, report());
  const expS1Url = "https://wa.me/910000000000?text=Hi%2C%20I%20checked%20a%20Full%20Stack%20Developer%20job%20post%20on%20Job%20Post%20X-Ray.%20I%20match%207%20of%2019%20job%20skills.%20I'm%20missing%20MongoDB%2C%20Express.js%2C%20React%2C%20Node.js%20and%208%20more.%20I'd%20like%20to%20know%20more%20about%20the%20Certification%20Program%20in%20AI-Powered%20Full%20Stack%20Development.";
  assert("o1: s1 sales URL matches Section 10o line 859", s1Url === expS1Url, `Got: ${s1Url}`);

  startFromText(sample("s7").text);
  clearTicks();
  for (const h of sample("s7").demoHave) toggle(h);
  const s7Url = salesUrl("910000000000", { role: role("mkt") }, report());
  const expS7Url = "https://wa.me/910000000000?text=Hi%2C%20I%20checked%20a%20Digital%20Marketing%20Executive%20job%20post%20on%20Job%20Post%20X-Ray.%20I%20match%204%20of%2013%20job%20skills.%20I'd%20like%20to%20add%20tech%20skills%2C%20and%20know%20more%20about%20the%20Certification%20Program%20in%20Artificial%20Intelligence%20%26%20Machine%20Learning.";
  assert("o2: s7 sales URL matches Section 10o line 865", s7Url === expS7Url, `Got: ${s7Url}`);

  // Other sales messages
  const msg3 = salesMessage(null, { kind: "tech", main: { kind: "job", have: 5, total: 5 }, job: { missing: [] }, program: null });
  assert("o3: tech 5 of 5 all matched sales message", msg3 === "Hi, I checked a job post on Job Post X-Ray. I match all 5 job skills. I'd like to know more about Wrench Wise programs.");

  const msg4 = salesMessage({ role: role("mob") }, { kind: "tech", main: { kind: "job", have: 0, total: 3 }, job: { missing: ["kotlin", "swift", "flutter"] }, program: null });
  assert("o4: tech no program covers gap sales message", msg4 === "Hi, I checked a Mobile App Developer job post on Job Post X-Ray. I match 0 of 3 job skills. I'm missing Kotlin, Swift and Flutter. I'd like to know more about Wrench Wise programs.");

  const msg5 = salesMessage(null, { kind: "nontech", main: { kind: "job", have: 2, total: 6 }, job: { missing: [] }, switchProgram: null });
  assert("o5: non-tech no switch program sales message", msg5 === "Hi, I checked a job post on Job Post X-Ray. I match 2 of 6 job skills. I'd like to add tech skills, and know more about Wrench Wise programs.");

  const msg6 = salesMessage(null, { kind: "nontech", main: { kind: "soft", have: 2, total: 3 }, job: { missing: [] }, switchProgram: "aiml" });
  assert("o6: non-tech soft only sales message", msg6 === "Hi, I checked a job post on Job Post X-Ray. I match 2 of 3 soft skills. I'd like to add tech skills, and know more about the Certification Program in Artificial Intelligence & Machine Learning.");

  if (CONFIG.salesWhatsApp) {
    assert("o7: salesWhatsApp 11-15 digits", /^\d{11,15}$/.test(CONFIG.salesWhatsApp));
  }

  // === p. Compare link and sharing ===
  const s1Link = compareLink("https://job-post-xray.vercel.app", sample("s1").expected, "fsd", 7);
  const expS1Link = "https://job-post-xray.vercel.app/?s=mongodb.express.react.node.html.css.rest.github.git.js.dsa.oop.auth.sql.ts.nextjs.docker.aws.aitools.motivated.comm.team&r=fsd&m=7";
  assert("p1: s1 compareLink matches Section 10p", s1Link === expS1Link);

  const s1Share = shareText("https://job-post-xray.vercel.app", { role: role("fsd") }, { kind: "job", have: 7, total: 19 }, sample("s1").expected, "fsd");
  const expS1Share = "I X-rayed a Full Stack Developer job post. It asks for 19 job skills and I have 7. How many do you have? " + expS1Link;
  assert("p2: s1 shareText matches Section 10p", s1Share === expS1Share);

  const s1WaShare = `https://wa.me/?text=${encodeURIComponent(expS1Share)}`;
  const expS1WaShare = "https://wa.me/?text=I%20X-rayed%20a%20Full%20Stack%20Developer%20job%20post.%20It%20asks%20for%2019%20job%20skills%20and%20I%20have%207.%20How%20many%20do%20you%20have%3F%20https%3A%2F%2Fjob-post-xray.vercel.app%2F%3Fs%3Dmongodb.express.react.node.html.css.rest.github.git.js.dsa.oop.auth.sql.ts.nextjs.docker.aws.aitools.motivated.comm.team%26r%3Dfsd%26m%3D7";
  assert("p3: s1 WhatsApp share link matches Section 10p", s1WaShare === expS1WaShare);

  const share3 = shareText("https://job-post-xray.vercel.app", null, { kind: "job", have: 5, total: 5 }, ["js", "react", "node", "html", "css"], null);
  assert("p4: all matched share text", share3 === "I X-rayed a job post. It asks for 5 job skills and I have all of them. How many do you have? https://job-post-xray.vercel.app/?s=js.react.node.html.css&m=5");

  const share4 = shareText("https://job-post-xray.vercel.app", null, { kind: "soft", have: 2, total: 3 }, ["comm", "team", "problem"], null);
  assert("p5: soft only share text", share4 === "I X-rayed a job post. It asks for 3 soft skills and I have 2. How many do you have? https://job-post-xray.vercel.app/?s=comm.team.problem&m=2");

  // === q. Reading compare links ===
  const first60Ids = [
    "py", "java", "js", "ts", "c", "cpp", "cs", "go", "rust", "kotlin",
    "swift", "php", "ruby", "scala", "r", "dart", "matlab", "shell", "html", "css",
    "react", "angular", "vue", "nextjs", "redux", "tailwind", "bootstrap", "sass", "jquery", "responsive",
    "figma", "uiux", "node", "express", "django", "flask", "fastapi", "spring", "hibernate", "dotnet",
    "laravel", "rails", "nestjs", "rest", "graphql", "micro", "auth", "sockets", "kafka", "rabbitmq",
    "maven", "sql", "mysql", "postgres", "mongodb", "nosql", "redis", "oracle", "mssql", "firebase"
  ];
  const first61Ids = [...first60Ids, "azure"];

  assert("q1: ?s=js.react.node&r=fsd&m=2 valid", readCompare("?s=js.react.node&r=fsd&m=2")?.ids.join(".") === "js.react.node" && readCompare("?s=js.react.node&r=fsd&m=2")?.roleId === "fsd" && readCompare("?s=js.react.node&r=fsd&m=2")?.m === 2);
  assert("q2: ?s=js.react.node valid", readCompare("?s=js.react.node")?.ids.join(".") === "js.react.node" && readCompare("?s=js.react.node")?.roleId === null);
  assert("q3: ?s=comm.team.problem&m=0 valid", readCompare("?s=comm.team.problem&m=0")?.m === 0);
  assert("q4: ?s=py.sql.excel&r=mkt&m=1 valid", readCompare("?s=py.sql.excel&r=mkt&m=1")?.roleId === "mkt");
  assert("q5: ?s=js.react&m=1 invalid (fewer than 3)", readCompare("?s=js.react&m=1") === null);
  assert("q6: ?s=js.react.js&m=1 invalid (repeated id)", readCompare("?s=js.react.js&m=1") === null);
  assert("q7: ?s=js.react.xyz&m=1 invalid (unknown skill)", readCompare("?s=js.react.xyz&m=1") === null);
  assert("q8: ?s=JS.React.Node&m=1 invalid (capitals)", readCompare("?s=JS.React.Node&m=1") === null);
  assert("q9: ?s=js.react.node&m=4 invalid (m above 3)", readCompare("?s=js.react.node&m=4") === null);
  assert("q10: ?s=js.react.node&m=two invalid (m not number)", readCompare("?s=js.react.node&m=two") === null);
  assert("q11: ?s=js.react.node&r=pilot&m=1 invalid (unknown role)", readCompare("?s=js.react.node&r=pilot&m=1") === null);
  assert("q12: ?s=js..react.node invalid (empty id)", readCompare("?s=js..react.node") === null);
  assert("q13: 60 skill ids valid", readCompare(`?s=${first60Ids.join(".")}`)?.ids.length === 60);
  assert("q14: 61 skill ids invalid", readCompare(`?s=${first61Ids.join(".")}`) === null);
  assert("q15: empty search null", readCompare("") === null);

  // === r. Banners and head-to-head lines ===
  const ban1 = bannerText({ m: 7 }, role("fsd"), 19, "job skills");
  assert("r1: s1 banner with m", ban1 === "A friend has 7 of the 19 job skills a Full Stack Developer job post asks for. How many do you have?", `Got: ${ban1}`);

  const ban2 = bannerText(null, role("fsd"), 19, "job skills");
  assert("r2: s1 banner without m", ban2 === "Someone sent you the 19 job skills a Full Stack Developer job post asks for. How many do you have?", `Got: ${ban2}`);

  const ban3 = bannerText({ m: 2 }, null, 5, "job skills");
  assert("r3: no role banner with m", ban3 === "A friend has 2 of the 5 job skills a job post asks for. How many do you have?", `Got: ${ban3}`);

  const ban4 = bannerText({ m: 1 }, null, 3, "soft skills");
  assert("r4: soft only banner with m", ban4 === "A friend has 1 of the 3 soft skills a job post asks for. How many do you have?", `Got: ${ban4}`);

  assert("r5: headToHead 9 vs 7", headToHead(9, 7) === "You have 9. Your friend has 7. You're ahead on this one.");
  assert("r6: headToHead 7 vs 7", headToHead(7, 7) === "You both have 7. It's a tie.");
  assert("r7: headToHead 4 vs 7", headToHead(4, 7) === "Your friend has 7. You have 4. Plenty of time to catch up.");

  // === s. Analytics payloads ===
  startFromText(sample("s1").text);
  clearTicks();
  for (const h of sample("s1").demoHave) toggle(h);
  const s1Rep = report();
  const s1DonePayload = payloadsFor("xray:done", {
    jobCount: s1Rep.job.total,
    softCount: s1Rep.soft.total,
    reqs: sample("s1").expectedReqs,
    role: s1Rep.roleId,
    kind: s1Rep.kind
  });
  const s1ShownPayload = payloadsFor("result:shown", {
    kind: s1Rep.kind,
    mainKind: s1Rep.main.kind,
    total: s1Rep.main.total,
    have: s1Rep.main.have,
    pct: s1Rep.main.pct,
    softTotal: s1Rep.soft.total,
    softHave: s1Rep.soft.have.length,
    program: s1Rep.program?.id,
    covered: s1Rep.program?.covered.length,
    missingIds: s1Rep.job.missing,
    role: s1Rep.roleId,
    source: "post"
  });
  assert("s1: s1 missing_ids matches Section 10s", s1ShownPayload.ga4.params.missing_ids === "mongodb,express,react,node,rest,dsa,auth,ts,nextjs,docker,aws,aitools");
  assert("s2: s1 req_types matches Section 10s", s1DonePayload.ga4.params.req_types === "exp,edu,mode,place,notice");

  startFromText(sample("s2").text);
  clearTicks();
  for (const h of sample("s2").demoHave) toggle(h);
  const s2Rep = report();
  const s2Shown = payloadsFor("result:shown", { missingIds: s2Rep.job.missing });
  assert("s3: s2 missing_ids under 100 chars matches Section 10s", s2Shown.ga4.params.missing_ids === "spring,hibernate,rest,micro,postgres,testing,junit,maven,jenkins,kafka,rabbitmq,docker,k8s,c,cpp");

  startFromText(sample("s7").text);
  clearTicks();
  for (const h of sample("s7").demoHave) toggle(h);
  const s7Rep2 = report();
  const s7Shown = payloadsFor("result:shown", {
    kind: s7Rep2.kind,
    program: s7Rep2.switchProgram,
    missingIds: s7Rep2.job.missing
  });
  assert("s4: s7 missing_ids matches Section 10s", s7Shown.ga4.params.missing_ids === "digitalmkt,sem,metaads,leadgen,contentmkt,webanalytics,graphic,perfmkt,wordpress");
  assert("s5: s7 kind nontech and program aiml", s7Shown.ga4.params.kind === "nontech" && s7Shown.ga4.params.program === "aiml");

  // Run payloadsFor for every event with s1 data
  const s1Text = sample("s1").text;
  const events = [
    ["xray:start", { source: "paste", chars: s1Text.length }],
    ["xray:done", { jobCount: 19, softCount: 3, reqs: sample("s1").expectedReqs, role: "fsd", kind: "tech" }],
    ["xray:few", { jobCount: 1, softCount: 0 }],
    ["result:shown", { kind: "tech", mainKind: "job", total: 19, have: 7, pct: 37, softTotal: 3, softHave: 1, program: "fsd", covered: 10, missingIds: s1Rep.job.missing, role: "fsd", source: "post" }],
    ["cta:sales", { kind: "tech", program: "fsd", have: 7, total: 19 }],
    ["cta:program", { program: "fsd", spot: "result" }],
    ["cta:website", { spot: "home" }],
    ["cta:session", {}],
    ["share:image", { size: "status" }],
    ["share:whatsapp", {}],
    ["share:copy", {}],
    ["link:open", { count: 19, hasM: true }]
  ];
  let allPayloadsSafe = true;
  for (const [evt, d] of events) {
    const p = payloadsFor(evt, d);
    if (p.ga4?.params) {
      for (const val of Object.values(p.ga4.params)) {
        const s = String(val);
        if (s.length > 100) allPayloadsSafe = false;
        for (let i = 0; i <= s1Text.length - 20; i++) {
          if (s.includes(s1Text.slice(i, i + 20))) allPayloadsSafe = false;
        }
      }
    }
  }
  assert("s6: No payload param > 100 chars and no 20-char s1 snippet", allPayloadsSafe);

  // === t. Words ===
  const banned = ["stupid", "dumb", "idiot", "noob", "loser", "useless", "take your job", "replace you", "guarantee", "placement", "salary", "lakh", "get hired", "seats left"];
  const emojiRe = /\p{Extended_Pictographic}/u;
  const dashRe = /[\u2014\u2015]/; // em dash
  let wordsClean = true;

  function checkObj(obj) {
    for (const v of Object.values(obj)) {
      if (typeof v === "string") {
        const lower = v.toLowerCase();
        for (const b of banned) {
          if (lower.includes(b)) wordsClean = false;
        }
        if (emojiRe.test(v)) wordsClean = false;
        if (dashRe.test(v)) wordsClean = false;
      } else if (typeof v === "object" && v !== null) {
        checkObj(v);
      }
    }
  }
  checkObj(COPY);
  assert("t1: No banned words, emoji or em-dash in copy.js", wordsClean);

  const allProgNamesFull = PROGRAMS.every(p => p.name.startsWith("Certification Program in"));
  assert("t2: Program names in full", allProgNamesFull);

  // === u. Privacy and storage ===
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.clear();
    setTheme("light");
    setMuted(false);
    startFromText(sample("s1").text);
    setRemember(false);
    const keysAfterRun = Object.keys(window.localStorage);
    const onlyAllowedKeys = keysAfterRun.every(k => k === "jpx-theme" || k === "jpx-muted");
    assert("u1: localStorage holds only jpx-theme and jpx-muted when remember off", onlyAllowedKeys);

    setRemember(true);
    toggle("react");
    const hasSkillsKey = window.localStorage.getItem("jpx-skills") !== null;
    assert("u2: jpx-skills saved when remember on", hasSkillsKey);

    let storageClean = true;
    for (const k of Object.keys(window.localStorage)) {
      const v = window.localStorage.getItem(k);
      for (let i = 0; i <= s1Text.length - 20; i++) {
        if (v.includes(s1Text.slice(i, i + 20))) storageClean = false;
      }
    }
    assert("u3: No 20-char s1 snippet in localStorage", storageClean);
    clearRememberedSkills();
  } else {
    assert("u: Node environment (storage check skipped in node)", true);
  }

  // === v. Feature switches ===
  const origSoftSkills = CONFIG.features.softSkills;
  const origReqs = CONFIG.features.requirements;

  CONFIG.features.softSkills = false;
  const s1SoftOff = scanPost(sample("s1").text);
  const filmJobs = s1SoftOff.film.filter(f => f.kind === "job").length;
  const filmSofts = s1SoftOff.film.filter(f => f.kind === "soft").length;
  assert("v1: softSkills off gives 19 skills, all job, 23 job film spans, 0 soft film spans",
    s1SoftOff.scan.skills.length === 19 &&
    s1SoftOff.soft.length === 0 &&
    filmJobs === 23 &&
    filmSofts === 0
  );

  CONFIG.features.requirements = false;
  const s1ReqsOff = scanPost(sample("s1").text);
  const filmReqs = s1ReqsOff.film.filter(f => f.kind === "req").length;
  assert("v2: requirements off gives no req items and no req film spans",
    s1ReqsOff.reqs.length === 0 && filmReqs === 0
  );

  // Restore features
  CONFIG.features.softSkills = origSoftSkills;
  CONFIG.features.requirements = origReqs;

  return results;
}

// Browser execution helper
export function renderSelfTestTable(results, rootEl) {
  const allPass = results.every(r => r.pass);
  const passCount = results.filter(r => r.pass).length;
  const totalCount = results.length;

  console.log(`Job Post X-Ray Self-Test: ${passCount}/${totalCount} PASS (v${CONFIG.version}, Content v${CONTENT_VERSION})`);
  console.table(results.map(r => ({ Check: r.name, Status: r.pass ? "PASS" : "FAIL", Details: r.details })));

  if (!rootEl) return;

  const card = document.createElement("div");
  card.className = "card";
  card.style.maxWidth = "800px";
  card.style.margin = "2rem auto";

  const h1 = document.createElement("h1");
  h1.style.fontSize = "1.5rem";
  h1.style.fontWeight = "800";
  h1.style.marginBottom = "0.5rem";
  h1.textContent = `Self-Test: ${passCount}/${totalCount} PASS`;
  h1.style.color = allPass ? "var(--brand)" : "var(--error)";
  card.appendChild(h1);

  const sub = document.createElement("p");
  sub.style.color = "var(--muted)";
  sub.style.marginBottom = "1.5rem";
  sub.textContent = `Config Version: ${CONFIG.version} | Content Version: ${CONTENT_VERSION}`;
  card.appendChild(sub);

  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.fontSize = "0.875rem";

  const thead = document.createElement("thead");
  const headTr = document.createElement("tr");
  headTr.style.borderBottom = "2px solid var(--border)";
  headTr.style.textAlign = "left";

  const th1 = document.createElement("th");
  th1.style.padding = "0.5rem";
  th1.textContent = "Check";
  headTr.appendChild(th1);

  const th2 = document.createElement("th");
  th2.style.padding = "0.5rem";
  th2.textContent = "Status";
  headTr.appendChild(th2);

  const th3 = document.createElement("th");
  th3.style.padding = "0.5rem";
  th3.textContent = "Details";
  headTr.appendChild(th3);

  thead.appendChild(headTr);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const r of results) {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid var(--border)";

    const td1 = document.createElement("td");
    td1.style.padding = "0.5rem";
    td1.style.fontWeight = "500";
    td1.textContent = r.name;
    tr.appendChild(td1);

    const td2 = document.createElement("td");
    td2.style.padding = "0.5rem";
    td2.style.fontWeight = "700";
    td2.style.color = r.pass ? "var(--brand)" : "var(--error)";
    td2.textContent = r.pass ? "PASS" : "FAIL";
    tr.appendChild(td2);

    const td3 = document.createElement("td");
    td3.style.padding = "0.5rem";
    td3.style.color = "var(--muted)";
    td3.textContent = r.details || "-";
    tr.appendChild(td3);

    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  card.appendChild(table);

  rootEl.appendChild(card);
}

// Auto-run if executed in Node.js
if (typeof process !== "undefined" && process.versions && process.versions.node && process.argv[1]) {
  const scriptPath = (process.argv[1] || "").replace(/\\/g, "/");
  if (scriptPath && (import.meta.url.endsWith(scriptPath) || import.meta.url.includes("selftest.js"))) {
    const res = runAllTests();
    const allPass = res.every(r => r.pass);
    console.log(`\nSelf-Test Results: ${res.filter(r => r.pass).length}/${res.length} PASS\n`);
    for (const r of res) {
      console.log(`[${r.pass ? "PASS" : "FAIL"}] ${r.name} ${r.details ? "(" + r.details + ")" : ""}`);
    }
    if (!allPass) {
      console.error("\nSOME TESTS FAILED!\n");
      process.exit(1);
    } else {
      console.log("\nALL TESTS PASSED!\n");
    }
  }
}
