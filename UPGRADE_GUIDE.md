# Upgrade Guide

This guide explains how to maintain, edit, and expand Job Post X-Ray. Every recipe uses plain steps that anyone on the team can follow.

---

## Recipe 1: Change Business Settings

All business configuration lives in one file: `config.js`. Do not edit application code for business changes.

- **Change WhatsApp number**: Update `salesWhatsApp` with digits only (for example `"917550077725"`). If empty, the WhatsApp button is hidden.
- **Change programs on offer**: Edit the `programs` array in `config.js`. To pause a program, remove its ID from the array.
- **Change switch program**: Update `switchProgram` in `config.js` to one of the valid program IDs (such as `"aiml"` or `"sde"`).
- **Change sample chips on home**: Update `samplesOnHome` with the list of sample IDs from `content/samples.js`.
- **Change upcoming live session**: Set `session.enabled` to `true`, then fill in `session.title`, `session.when`, and `session.url`.
- **Change post character or skill limits**: Update values under the `limits` object.

After any change in `config.js`, run `node tools/verify-content.mjs` and `node js/selftest.js` to ensure all checks pass.

---

## Recipe 2: Fix a Wrongly Read Job Post

When a real post is misread:
1. Open `tools/cases.js`.
2. Add the exact sentence under `SKILL_CASES` or `REQ_CASES`, with the exact skills or requirements it should produce.
3. Open `content/skills.js` or `content/requirements.js`.
4. Add the missing alias or tighten existing aliases. If the term is ambiguous like Go or R, add suitable words to `contextWords`.
5. Run `node tools/verify-content.mjs`. All 147 test cases must pass.

---

## Recipe 3: Add or Retire a Skill

- **To add a new skill**:
  1. Open `content/skills.js`.
  2. Find the correct group, or add a new group if needed.
  3. Add the skill object with a unique ID, clean name, kind (`"tech"`, `"work"`, or `"soft"`), and aliases in lowercase.
  4. Run `node tools/verify-content.mjs` to ensure the ID is unique and aliases do not conflict.
- **To retire a skill**:
  - Never delete a skill ID. Old compare links depend on IDs remaining stable.
  - Set `retired: true` on the skill object. The engine will ignore it in new scans while keeping old shared links intact.

---

## Recipe 4: Add a New Field (e.g. Healthcare, Law, Finance)

1. Open `content/skills.js`. Add a new group with `kind: "work"` (for example, `health` or `law`).
2. Add the specific skills for that domain under this group.
3. Open `content/roles.js`. Add a role object for this field with `kind: "nontech"`, its title, keywords, and `switchWhy` text explaining how domain expertise connects to tech.
4. Open `content/samples.js`. Add one realistic sample job post for this role so users can test it from the home screen.
5. Run `node tools/verify-content.mjs` to confirm the new role and sample are recognized.

---

## Recipe 5: Add an "Also Asks For" Requirement

1. Open `content/requirements.js`.
2. Identify the requirement type: `degree`, `cert`, `location`, `tool`, or `workplace`.
3. Add the requirement item with a unique ID and lowercase aliases.
4. Add a test sentence in `tools/cases.js` under `REQ_CASES`.
5. Run `node tools/verify-content.mjs` to verify.

---

## Recipe 6: Change Program Coverage or Add a Program

- **Change coverage**:
  1. Get written sign-off from the lead instructor on the specific skills covered.
  2. Open `content/programs.js` and update the `covered` list for that program ID.
  3. Run `node tools/verify-content.mjs` to check that all covered skills exist in `content/skills.js`.
- **Add a new program**:
  1. Add the program definition to `content/programs.js` with its ID, title, short description, link, and covered skill IDs.
  2. Add the program ID to the `programs` array in `config.js`.
  3. Run `node tools/verify-content.mjs` and `node js/selftest.js`.

---

## Recipe 7: Change the Switch Program for Non-Tech Roles

1. Open `content/roles.js`.
2. Find the non-tech role (for example, `mkt`, `acct`, or `mech`).
3. Update its `program` property to the target program ID (such as `"aiml"`, `"fsd"`, or `"sde"`).
4. Update its `switchWhy` text with a plain-language explanation of why this target program fits someone from that background.
5. Run `node tools/verify-content.mjs`.

---

## Recipe 8: Turn Feature Flags On or Off

Feature flags live in `config.js` under `features`:
- `sound`: Set to `true` or `false` to enable or disable audio blips.
- `softSkills`: Set to `false` if you want the scanner to focus only on technical and job skills.
- `requirements`: Set to `false` to hide the "Also asks for" section.
- `copyLink`: Set to `false` to hide the copy link button on results.
- `compareBanner`: Set to `false` to hide the compare banner when someone visits a shared link.
- `themeToggle`: Set to `false` to pin the app to light mode.

---

## Recipe 9: Use GA4 Data to Plan Content and Curriculum

Check Google Analytics 4 custom events regularly:
- **`missing_ids`**: The most frequent missing skill IDs tell you exactly what students lack. Use these topics for Instagram reels, YouTube walkthroughs, free weekend masterclasses, and ad copy.
- **`kind=nontech`**: The percentage of non-tech scans shows how many career switchers are using the tool. A rising percentage indicates strong demand for switch programs.
- **`xray_few`**: A high count of scans finding fewer than 3 skills means real-world posts are using synonyms not yet captured in `content/skills.js`. Collect 5 to 10 sample posts, extract the missing terms, and add them as aliases.

---

## Recipe 10: Release Steps

1. In `config.js`, bump `version` (for example from `"1.0.0"` to `"1.1.0"`).
2. If `content/` changed, bump `CONTENT_VERSION` in `content/SCHEMA.md`.
3. Add a dated entry to `CHANGELOG.md` detailing the changes.
4. Run `node tools/verify-content.mjs` and `node js/selftest.js`.
5. In your browser, open `http://localhost:8085/?test=1` and ensure 100% tests pass.
6. Commit changes to git and create a git tag:
   ```bash
   git add .
   git commit -m "Release v1.1.0"
   git tag v1.1.0
   git push origin master --tags
   ```

---

## Recipe 11: How to Run Any Future Upgrade with Antigravity

Copy and paste this exact prompt when asking an AI assistant to make updates:

> Read PROJECT_BRIEF.md, UPGRADE_GUIDE.md and CHANGELOG.md. I want to add: [describe the feature]. Create a branch called upgrade-[short-name]. Follow Section 3 of PROJECT_BRIEF.md. Plan the work in phases and stop after each one with a Phase Report. Do not change content/, tools/ or js/engine/ unless I ask. Keep every self-test and the content check passing, and add tests for the new feature. Give me the Vercel preview link and wait. Merge only when I reply "Ship it".

---

## Recipe 12: Future Upgrades the Structure is Ready For

1. **Must-Have vs. Good-to-Have Skills**:
   The engine already records character start and end offsets for all matches. A heading detector can locate strings like "Preferred Qualifications" or "Nice to Have" and classify subsequent skills into a secondary bucket.
2. **Tamil Version**:
   Create `js/copy.ta.js` alongside `js/copy.js`. Add a language toggle in the header to switch UI strings while reusing the exact same scanning engines.
3. **Resume X-Ray**:
   Allow candidates to paste their resume on the home screen. Run the same client-side engine to automatically pre-tick the skills they already possess. This adheres to privacy rules because text never leaves the client browser.
4. **Side-by-Side Job Post Comparison**:
   Scan two job descriptions simultaneously to show common skills, unique skills, and the optimal skill set that addresses both roles.
5. **Candidate Profile vs. Job Check**:
   Allow users to input their graduation degree, years of experience, and location. Compare these inputs directly against the "Also asks for" items detected in the post.
6. **Mechanical and CFD Program Card**:
   When the Wrench Wise CFD course opens, add `cfd` to `content/programs.js` and point the `mech` role's `program` property in `content/roles.js` directly to it.
7. **AI-Based Post Reading**:
   For complex semantic understanding, a dedicated backend microservice with an API key can supplement the fast client-side regex engine. Keep this as a separate opt-in project so the core app remains 100% serverless, private, and free to host.
