// Every business setting for Job Post X-Ray lives in this file.
// Change values here. Never hard-code any of these anywhere else in the app.
// After any change, open the app with ?test=1 and check that every test passes.

export const CONFIG = {
  version: "1.0.0",

  // The live address, with no slash at the end, for example "https://job-post-xray.vercel.app".
  // Set in Phase 6. While empty, the app uses the address it was opened from.
  siteUrl: "",

  // Programs the app may recommend. The order breaks ties (see content/SCHEMA.md).
  // Remove an id to stop recommending that program. Ids are in content/programs.js.
  programs: ["sde", "fsd", "aiml", "genai"],

  // The program on the switch-to-tech card for a non-tech post when the role has no program of its own,
  // or no role was guessed. Must be one of the ids in programs.
  switchProgram: "aiml",

  // The sample chips on the home screen, in order. Ids are in content/samples.js.
  samplesOnHome: ["s1", "s3", "s5", "s7", "s8", "s9", "s10", "s11"],

  // Sales WhatsApp number: country code then number, digits only, for example "919000000000".
  // While empty, the WhatsApp sales button is hidden and "See the program" shows instead.
  salesWhatsApp: "917550077725",
  website: "https://wrench-wise.com/",
  utm: { source: "job-post-xray", medium: "web-app", campaign: "job-post-xray-2026" },

  // Free live session card on the home and result screens. Turn on when a session is coming up.
  session: {
    enabled: false,
    title: "",
    when: "", // plain text, for example "Sunday 9 November, 8:30 PM IST"
    url: ""
  },

  // Analytics. An empty ID switches that tracker off.
  analytics: {
    ga4Id: "",
    metaPixelId: "1504538090837971"
  },

  limits: {
    maxChars: 15000,    // longer posts are cut here, with a note
    minChars: 40,       // the X-ray button stays off below this
    minSkills: 3,       // fewer job skills found than this shows the "paste the full post" message
    minRoleHits: 3,     // job skills needed before the app guesses a role
    maxLinkSkills: 60,  // most skills a compare link can carry
    maxReqsPerType: 4   // most "Also asks for" items shown under one heading
  },

  // Optional features. false hides the feature completely, with no errors.
  features: {
    sound: true,
    darkTheme: true,
    roleGuess: true,
    softSkills: true,     // false: soft skills are not looked for, shown or scored
    requirements: true,   // false: no "Also asks for" list and no amber highlights
    switchCard: true,     // false: non-tech posts show "Visit wrench-wise.com" instead of the switch card
    clipboardPaste: true,
    rememberSkills: true,
    compareLinks: true,
    shareImage: true,
    otherPrograms: true,
    presenterMode: true
  }
};
