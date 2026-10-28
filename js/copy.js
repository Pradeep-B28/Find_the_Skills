// What it does: holds all user-facing copy and the t() interpolation function.
// Uses: none.
// Used by: all UI screens, cards, score.js, links.js, and selftest.js.

export const COPY = {
  home: {
    eyebrow: "For any job post",
    title: "Job Post X-Ray",
    subtitle: "Paste a job post. See every skill it asks for, and how many you already have.",
    pasteLabel: "Paste the full job post",
    placeholder: "Copy the whole post from LinkedIn, Naukri or any job site, then paste it here.",
    count: "{count} / {max}",
    tooLong: "Only the first {max} characters will be scanned.",
    clipboard: "Paste from clipboard",
    clipboardFail: "Couldn't read the clipboard. Long-press the box and choose Paste.",
    clear: "Clear",
    go: "X-ray this job post",
    private: "Your job post stays on this device. Nothing is uploaded or saved.",
    linkOnly: "We can't open links. Open the job post, copy all of its text, and paste it here.",
    samples: "No job post handy? Try one:",
    how1: "Paste a job post",
    how2: "See every skill it asks for",
    how3: "Tick yours and see your match",
    aboutTitle: "How the X-ray works",
    aboutBody: "It looks for about 330 skills by name: tech skills like React or SQL, job skills like Tally, SEO or AutoCAD, and soft skills like communication. It also lists what else the post asks for, like experience and education. Unusual tools and wording may be missed. The sample posts were written by the Wrench Wise team.",
    compareBtn: "Check my match"
  },
  post: {
    role: "{article} {role} job post",
    any: "a job post"
  },
  scan: {
    label: "Job post X-ray",
    jobCounter: "Job skills",
    softCounter: "Soft skills",
    keyJob: "Job skills",
    keySoft: "Soft skills",
    keyReq: "Also asks for",
    jobPart: "{n} job skills",
    "jobPart.one": "1 job skill",
    softPart: "{n} soft skills",
    "softPart.one": "1 soft skill",
    found: "{job} and {soft} found",
    foundOne: "{part} found",
    role: "Looks like {article} {role} job",
    next: "Tick the skills you have",
    edit: "Edit the post",
    truncated: "Only the first {max} characters were scanned.",
    noneTitle: "No skills found",
    noJobTitle: "No job skills found",
    fewTitle: "Only {n} job skills found",
    "fewTitle.one": "Only 1 job skill found",
    fewBody: "Paste the full job post, including the requirements or skills section.",
    anyway: "Continue anyway",
    sample: "Try a sample"
  },
  check: {
    title: "This job post asks for {n} job skills",
    "title.one": "This job post asks for 1 job skill",
    titleSoft: "This job post asks for {n} soft skills",
    "titleSoft.one": "This job post asks for 1 soft skill",
    titleLink: "Your friend's job post asks for {n} job skills",
    "titleLink.one": "Your friend's job post asks for 1 job skill",
    titleLinkSoft: "Your friend's job post asks for {n} soft skills",
    "titleLinkSoft.one": "Your friend's job post asks for 1 soft skill",
    sub: "Tick the ones you already have. Be honest. Nobody else sees this.",
    softHead: "Soft skills",
    softNote: "Scored separately from job skills.",
    reqHead: "Also asks for",
    reqNote: "For your info. Not counted in your match.",
    roleChange: "Change",
    roleOther: "Other role",
    remember: "Remember my ticks on this device",
    fromLast: "Ticked from last time",
    clearAll: "Clear all",
    showPost: "Show in the post",
    note: "We count skills we can name. Experience and degrees are listed under Also asks for and never scored.",
    ticked: "{n} ticked",
    go: "Show my match",
    mentions: "x{n}"
  },
  result: {
    matchedJob: "job skills matched",
    matchedSoft: "soft skills matched",
    pct: "{pct}% match",
    have: "You have ({n})",
    learn: "To learn ({n})",
    softHave: "Soft skills you have ({n})",
    softBuild: "Soft skills to build ({n})",
    reqNote: "Check these too. They are not part of your match.",
    gapTitle: "Close the gap",
    notIn: "Not in this program: {list}",
    syllabus: "Based on each program's published syllabus.",
    readyTitle: "Ready to apply",
    readyBody: "You have every skill this job post asks for. Want to aim higher? See what else you could learn.",
    allPrograms: "See all programs",
    others: "Other Wrench Wise programs",
    otherLine: "covers {n} of your missing skills",
    "otherLine.one": "covers 1 of your missing skills",
    another: "Check another job post",
    change: "Change my ticks"
  },
  switch: {
    title: "Add tech to what you already know",
    whyDefault: "It starts from the basics."
  },
  cta: {
    whatsapp: "Talk to us on WhatsApp",
    program: "See the program",
    website: "Visit wrench-wise.com"
  },
  session: {
    label: "Free live session",
    btn: "Save my seat"
  },
  share: {
    title: "Send this to a friend",
    image: "Share my match",
    whatsapp: "Send on WhatsApp",
    copy: "Copy link",
    copied: "Copied",
    status: "Status",
    post: "Post",
    imageAsk: "How many do you have?",
    imageMore: "+{n} more",
    imageAny: "Job post"
  },
  presenter: {
    end: "Questions? Ask in the chat."
  },
  footer: {
    built: "Built with code by Wrench Wise",
    learn: "Learn to build apps like this"
  },
  req: {
    expRange: "{min} to {max} years",
    expRangeM: "{min} to {max} months",
    expPlus: "{min}+ years",
    expPlusM: "{min}+ months",
    expExact: "{n} years",
    "expExact.one": "1 year",
    expExactM: "{n} months",
    "expExactM.one": "1 month",
    noticeD: "Notice period up to {n} days",
    "noticeD.one": "Notice period up to 1 day",
    noticeM: "Notice period up to {n} months",
    "noticeM.one": "Notice period up to 1 month"
  },
  tier: {
    ready: "Ready to apply",
    strong: "Strong match",
    good: "Good start",
    building: "Building up",
    fresh: "Fresh start"
  },
  lines: {
    jobMatch: "You match {have} of {total} job skills.",
    jobZero: "You match 0 of {total} job skills. Every one of them can be learned.",
    jobAll: "You match all {total} job skills.",
    softMatch: "You match {have} of {total} soft skills.",
    softLine: "Soft skills: {have} of {total}.",
    programGap: "The {program} covers {covered} of the {missing} skills you're missing.",
    programAll: "The {program} covers all {missing} skills you're missing.",
    programOne: "The {program} covers the one skill you're missing.",
    programNone: "None of our programs teach these skills yet.",
    carryHave: "Skills you have that carry over to tech: {list}.",
    carryFound: "Skills in this job that carry over to tech: {list}.",
    switchNext: "A good next step: the {program}.",
    bannerWithM: "A friend has {m} of the {total} {kind} a {role} asks for. How many do you have?",
    bannerNoM: "Someone sent you the {total} {kind} a {role} asks for. How many do you have?",
    bannerJobWord: "job skills",
    bannerSoftWord: "soft skills",
    h2hAhead: "You have {you}. Your friend has {friend}. You're ahead on this one.",
    h2hTie: "You both have {you}. It's a tie.",
    h2hBehind: "Your friend has {friend}. You have {you}. Plenty of time to catch up."
  }
};

export function t(key, values = {}) {
  let lookupKey = key;
  if (values && (values.n === 1 || values.n === "1")) {
    const candidate = `${key}.one`;
    if (getRawCopy(candidate) !== undefined) {
      lookupKey = candidate;
    }
  }

  let text = getRawCopy(lookupKey);
  if (text === undefined) {
    text = getRawCopy(key);
  }
  if (typeof text !== "string") {
    return key;
  }

  return text.replace(/\{(\w+)\}/g, (match, prop) => {
    return values[prop] !== undefined ? String(values[prop]) : match;
  });
}

function getRawCopy(key) {
  const parts = key.split(".");
  let cur = COPY;
  for (let i = 0; i < parts.length; i++) {
    if (cur == null || typeof cur !== "object") return undefined;
    if (i < parts.length - 1 && parts.slice(i).join(".") in cur) {
      return cur[parts.slice(i).join(".")];
    }
    cur = cur[parts[i]];
  }
  return cur;
}
