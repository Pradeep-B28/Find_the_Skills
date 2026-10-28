// Everything the X-ray knows, in one place. The app reads content only through js/content.js.
// To add skills, programs, roles or samples, follow content/SCHEMA.md, then run: node tools/verify-content.mjs

export { GROUPS, SKILLS } from "./skills.js";
export { COMBOS } from "./combos.js";
export { PROGRAMS } from "./programs.js";
export { ROLES } from "./roles.js";
export { SAMPLES } from "./samples.js";
export { REQ_TYPES, REQS } from "./requirements.js";

// Raise by 1 whenever anything in content/ changes.
export const CONTENT_VERSION = 1;
