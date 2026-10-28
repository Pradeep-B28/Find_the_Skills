# Job Post X-Ray: Project Brief (v1, built to upgrade)

You are building a web app in this folder. Read this whole file before writing any code. Then read `content/SCHEMA.md`. Follow the phases in Section 11 in order, and stop at the end of each phase.

Some files are already here. Keep them:
- `config.js`: every business setting (Section 5)
- `content/`: the locked lists: 332 skills in 21 groups, stacks, 4 programs, 25 roles, 103 "Also asks for" items, 11 sample job posts and `SCHEMA.md`
- `js/engine/matcher.js`: the locked engine that finds skills in a job post
- `js/engine/requirements.js`: the locked engine that finds experience, education and the rest of "Also asks for"
- `js/engine/gap.js`: the locked engine that works out the scores, the role, the post kind and the program
- `tools/verify-content.mjs` and `tools/cases.js`: the content check and 147 tricky sentences it must read correctly
- `package.json`: only so Node can run the content check. It has no dependencies. Never add any.

---

## 1. What we are building

Job Post X-Ray reads any job post: tech, marketing, accounts, sales, HR, design, core engineering or teaching. The person pastes a post from LinkedIn, Naukri or any job site. A glowing scan beam sweeps down the post like an X-ray, and everything it asks for lights up:
- **Job skills** in cyan: React, SQL, Tally, SEO, AutoCAD, Canva and about 300 more.
- **Soft skills** in green: communication, teamwork, problem solving and 27 more.
- **Also asks for** in amber: years of experience, degrees, work mode, location, notice period, languages, certifications and conditions like a two-wheeler or night shifts.

Two counters tick up as the beam passes: "Job skills 19" and "Soft skills 3".

Then the person ticks the skills they already have. The result lands: **"You match 7 of 19 job skills."** and **"Soft skills: 1 of 3."** The "Also asks for" list sits below for them to check, never scored.

What comes next depends on the post:
- **A tech post** shows the program that closes the gap: **"The Certification Program in AI-Powered Full Stack Development covers 10 of the 12 skills you're missing."**
- **A non-tech post** (marketing, accounts, sales, HR, design, mechanical and more) shows the switch-to-tech card: which of their skills carry over to tech, and a good next program.

One tap opens WhatsApp to our sales team with the role, the score and the missing skills already typed in. One tap sends a friend the same skill list so they can check their own match.

The headline moments are the scan, the tick list and the match reveal. Spend the most care there.

**The message.** Job posts look scary. The X-ray shows exactly what is being asked, and every one of those skills can be learned. We never promise a job, an interview or a result.

**It must look like it belongs to wrench-wise.com.** Same colours, font, button shapes and white cards as the site (Section 7). The X-ray film is dark, like a real X-ray on a lightbox.

**The business goal.** This app is a lead magnet for all four Wrench Wise programs. Someone pasting a job post is actively job hunting, which makes them a high-intent lead. Tech posts bring people who want to close a gap. Non-tech posts bring career switchers. The sales team gets the role, the score and the exact missing skills in the first message.

Who it is for:
- **Final-year students and freshers** looking at their first job posts.
- **Career switchers** from marketing, accounts, sales, HR, design or core engineering, checking how far they are from a tech role.
- **Working professionals** eyeing a move into AI, data or full stack.
- **Reel viewers.** It must look great in screen recordings, vertical and horizontal.

When there is a trade-off, follow this order:
1. The scan, the tick list and the match look stunning.
2. Every skill, requirement and number is exactly right (Section 10).
3. The job post never leaves the device.
4. It runs smoothly on a mid-range Android phone.
5. The WhatsApp and share buttons work in one tap.
6. It is easy to upgrade (Section 3).
7. Everything else.

---

## 2. Hard rules

1. **Code.** Plain HTML, CSS and JavaScript (ES modules) only. No frameworks, libraries, CDNs, npm packages or web fonts. The only image files are the logo, the link preview image and app icons. Draw everything else in code: icons as inline SVG, share images on a canvas.
2. **Front-end only.** No backend, database, API keys, AI calls or accounts. Never use `eval`, `new Function`, `setTimeout` with a string, or inline `onclick` attributes.
3. **Locked files.** Never edit anything in `content/`, `tools/` (except `tools/og.html`, which you create) or `js/engine/`. Run `node tools/verify-content.mjs` at the start of every phase. It must end with `RESULT: ALL PASS`. If you think a skill, requirement, sample or engine rule is wrong, stop and tell me. Do not fix it yourself.
4. **One engine.** Only `js/engine/matcher.js` finds skills in text, only `js/engine/requirements.js` finds "Also asks for" items, and only `js/engine/gap.js` works out scores, roles, post kinds and programs. No other file searches text or does that maths.
5. **The job post stays on the device.** The pasted text lives only in memory while the page is open. Never save it (no `localStorage`, `sessionStorage`, IndexedDB or cookies), never put any of it in a URL, never send any of it to analytics or anywhere else, and never `console.log` it.
6. **Storage.** `localStorage` may hold only three keys: `jpx-theme`, `jpx-muted` and `jpx-skills` (skill ids, only when the person switches on "Remember my ticks"). Wrap every read and write in try and catch, and make the app work fine when storage is blocked.
7. **No personal data.** The app never asks for a name, phone number or email.
8. **External scripts.** Only GA4 and the Meta Pixel, and only when their IDs are set in `config.js`. Never load them with `?test=1`, `?demo=1` or `?present=1`.
9. **Tone.** Never mock the person. Low matches get encouragement. Never suggest a non-tech career is worse than a tech one. Never promise a job, an interview or a result. Never use these anywhere a user can see them: stupid, dumb, idiot, noob, loser, useless, "take your job", "replace you", guarantee, placement, salary, lakh, "get hired", "seats left", or any countdown.
10. **Program names.** Always the full name from `content/programs.js`. Never shorten it.
11. **Writing style.** All UI text and docs are in plain English with short sentences. No emojis. No em dashes (the long dash).
12. **Safety.** The pasted post is untrusted text. Never use `innerHTML` or `insertAdjacentHTML` with changing values. Build the post, highlights, chips and all dynamic text with text nodes and `textContent`.
13. **Hidden means hidden.** `base.css` must include `[hidden] { display: none !important; }`. (In an earlier project, a CSS rule kept a "hidden" debug panel visible on the live site.)
14. **No debug output live.** No debug panels, test overlays or `console.log` in the live app. Test output appears only with `?test=1`.
15. **File size.** One job per file, under about 350 lines. Start every JS file with a 3-line comment: what it does, what it uses, what uses it.
16. **Phases.** At the end of every phase, stop and give a Phase Report (Section 12). Do not start the next phase until I say so.
17. **Stubborn bugs.** If the same bug survives two fix attempts, stop. Explain it in plain words and give me options. Do not keep looping.
18. **My actions.** I am not from a tech background. When you need me to do something (click, log in, approve), give numbered click-by-click steps.
19. **Commands.** Before running a terminal command, tell me in one line what it does.
20. **Branding.** Wrench Wise only. No other company names, logos or brand colours. No real people's names. The sample posts never name a real company.

---

## 3. Built to upgrade

We have rebuilt earlier apps to add features. This one must be easy to grow. **An upgrade should feel like adding data or one new file, not rewriting code.** Follow every rule here.

1. **One settings file.** `config.js` holds every business setting. Changing the WhatsApp number, the programs on offer, the switch program, the sample chips, limits, links, analytics IDs or features must never need a code change anywhere else.
2. **One text file.** `js/copy.js` holds every word the person sees, except content (skill, requirement, program and role names, `switchWhy`, samples). Group the text by screen. Fill values with a small `t(key, values)` function, for example `t("result.softLine", { have: 1, total: 3 })`. When a value named `n` is 1 and a key ending in `.one` exists, `t()` uses that key instead ("1 job skill", not "1 job skills"). A Tamil version later is then a new `copy.ta.js`, not a rewrite.
3. **Content as data.** Skills, groups, stacks, programs, roles, requirements and samples live in `content/`, follow `SCHEMA.md` and are listed in `content/index.js`. The app reads them only through `js/content.js`. Ids are permanent: a skill is retired with `retired: true`, never deleted. Retired skills are never searched for, but old links that contain them still work. **A new field (for example healthcare or law) is a new group and its skills in `skills.js`, plus a role in `roles.js`. No code changes.**
4. **Links that never break.** Compare links carry skill ids, a role id and a number. Never the post. Accept 3 to `config.limits.maxLinkSkills` ids, so links survive new skills. Any new URL option must be optional.
5. **Screens are modules.** `js/router.js` shows one screen at a time. Each screen file exports `mount(root)`, `enter(params)` and `leave()`. Adding a screen means one new file and one line in the router's list.
6. **Cards are modules.** The result screen's lower cards (program card, switch card, ready card, "Also asks for", other programs, session, share) are each one file in `js/cards/` with `render(model)` returning an element or `null`. The result screen picks which cards to show from `score.js`. A new card is one new file and one line.
7. **An event bus.** App code never calls sound, analytics or sharing code directly. It sends events through `js/events.js` (`emit(name, data)` and `on(name, handler)`), and those modules listen. Adding a new tracker or effect means a new listener only. Use exactly these events:

| Event | Data |
|---|---|
| `app:ready` | none |
| `xray:start` | `source` (`paste`, `sample`, `demo`), `chars` |
| `xray:done` | `jobCount`, `softCount`, `reqTypes`, `roleId`, `kind`, `truncated` |
| `xray:few` | `jobCount`, `softCount` |
| `check:toggle` | `id`, `have` |
| `role:change` | `roleId` |
| `skills:remember` | `on` |
| `result:shown` | `kind` (`tech`, `nontech`), `mainKind` (`job`, `soft`), `total`, `have`, `pct`, `softTotal`, `softHave`, `programId`, `covered`, `missingIds`, `roleId`, `source` (`post`, `link`) |
| `cta:sales` | `kind`, `programId`, `have`, `total` |
| `cta:program` | `programId`, `spot` (`result`, `switch`, `others`) |
| `cta:website` | `spot` (`home`, `result`, `footer`) |
| `cta:session` | none |
| `link:open` | `count`, `hasM` |
| `share:image` | `size` (`post`, `status`) |
| `share:whatsapp` | none |
| `share:copy` | none |
| `theme:change` | `theme` |
| `sound:toggle` | `muted` |

8. **Logic without the page.** `content.js`, `session.js`, `score.js`, `links.js` and the three engine files contain no DOM code. They take inputs and return results. This makes them testable, and lets a future feature (a resume X-ray, a compare-two-posts view) reuse them.
9. **Design tokens.** Every colour, shadow and easing lives in `styles/tokens.css`. JavaScript reads tokens with `getComputedStyle`. A new look touches one file.
10. **Feature flags.** Every optional feature checks `config.features`. Turning one off hides it cleanly, with no errors and no empty gaps.
11. **Versions.** `config.version` (starting at 1.0.0) shows in the footer as "v1.0.0". The self-test prints it with `CONTENT_VERSION`. Keep `CHANGELOG.md`. Tag each release in git (`v1.0.0`).
12. **Tests grow with features.** Every feature adds its own checks to `selftest.js`. All must pass before any release.
13. **Upgrades use branches.** v1 deploys from `main` in Phase 6. Every later upgrade happens on a branch named `upgrade-<name>`, gets a Vercel preview link, and is merged only after I reply "Ship it". `UPGRADE_GUIDE.md` (Phase 6) explains this in plain words.

---

## 4. Tech setup

- Check `node --version` is 18 or newer.
- Run locally with a simple static server: `npx serve .`
  - If that fails, use `python -m http.server 8000`.
- Use ES modules (`<script type="module">`).
- Folder structure (new files in plain text, files already here marked "given"):

```
job-post-xray/
  index.html
  manifest.json
  package.json          given. Only for the content check. No dependencies.
  config.js             given. Every business setting (Section 5)
  styles/
    tokens.css          every colour, shadow and easing (Section 7)
    base.css            reset, layout, header, footer, buttons, cards
    xray.css            the film, beam and highlights
    result.css          chips, ring, cards
  assets/               logo.png (I provide), og-image.png, app icons
  content/              given and locked
    index.js            exports everything below
    skills.js           332 skills in 21 groups (tech, other job skills, soft)
    combos.js           MERN, MEAN, MEVN and C/C++
    programs.js         4 programs and what each covers
    roles.js            25 roles (13 tech, 12 non-tech)
    requirements.js     "Also asks for": 9 types, 103 items
    samples.js          11 sample job posts
    SCHEMA.md           what each field means
  tools/
    verify-content.mjs  given and locked. Run with: node tools/verify-content.mjs
    cases.js            given and locked. 147 tricky sentences (the self-test runs them too)
    og.html             you build it. Draws the link preview image (Section 9)
  js/
    engine/             given and locked
      matcher.js        finds skills in text
      requirements.js   finds "Also asks for" items, merges film highlights
      gap.js            scores, role guess, post kind, programs, carry-over
    main.js             starts the app, reads URL flags, starts the router
    router.js           shows one screen at a time
    events.js           tiny event bus
    copy.js             every piece of UI text, and t()
    content.js          loads content, builds both engine indexes once, lookups. No DOM
    session.js          the current post in memory: text, found skills, ticks, role. No DOM
    score.js            tiers, lines, labels, lists, which cards to show. No DOM
    links.js            compare links, WhatsApp links, UTM links, analytics payload text. No DOM
    store.js            safe localStorage for the three allowed keys
    theme.js            light and dark switch
    share.js            share sheet, WhatsApp, copy link
    shareImage.js       draws share images
    analytics.js        GA4 and Meta Pixel, listening to events
    demo.js             demo mode
    presenter.js        presenter mode (nice to have)
    selftest.js         runs with ?test=1
    screens/
      home.js           paste box, samples, hero
      scan.js           the X-ray
      check.js          tick your skills
      result.js         the match
    cards/
      program.js        close the gap (tech posts)
      switch.js         add tech to what you already know (non-tech posts)
      ready.js          nothing missing
      reqs.js           also asks for
      others.js         other Wrench Wise programs
      session.js        free live session
      share.js          send this to a friend
    fx/
      film.js           lays out the post with highlights, using text nodes only
      beam.js           the scan beam and the light-up timing
      hero.js           the home screen film loop
      ring.js           the match ring
      countup.js        counting numbers
      sound.js          Web Audio sounds and mute
      stamp.js          the tier stamp
  README.md
  UPGRADE_GUIDE.md
  CHANGELOG.md
  STUDENT_EXPLAINER.md
  REEL_SCRIPT.md
```

- **How to call the engines** (from `content.js` only):
  - At startup: `buildIndex({ skills: SKILLS, combos: COMBOS })` and `buildReqIndex({ reqs: REQS })`, once each.
  - `scan(text, index, config.limits.maxChars)` returns `{ matches, skills, counts, length, truncated }`. `matches` are `{ start, end, ids }` positions in the original text, in order, never overlapping. `skills` are ids in order of first appearance. `counts` says how often each was found.
  - `findRequirements(text, reqIndex, config.limits.maxChars)` returns `{ items, spans }`. Each item has a `key` (like `exp:0-2y` or `edu:btech`), a `type`, and either an `id` (a listed item) or numbers (`min`, `max`, `plus`, `unit` for experience; `amount`, `unit` for notice).
  - `mergeSpans(matches, spans, softIds)` gives the film's highlights: `{ start, end, kind, ids, key }` with kind `job`, `soft` or `req`, in order, never overlapping.
  - From `gap.js`: `splitKinds`, `guessRole` (job skills only), `postKind`, `matchReport`, `mainScore`, `rankPrograms`, `pickProgram` (job skills only), `carryOver` and `switchProgram`. Read the comments at the top of each engine file.
- **One animation loop.** A single `requestAnimationFrame` loop drives the beam, the hero and the ring. Use delta time, capped at 0.05 s, so speed is the same on 60Hz and 120Hz screens. CSS animations are fine for simple UI motion.
- **Hidden tab.** Pause the loop and all animation when the tab is hidden (`visibilitychange`).
- **Sharp canvases.** Size canvases to their CSS size times `devicePixelRatio`, capped at 2.
- **Resize and rotation.** Debounce by 150 ms and re-measure the film. Never restart a scan that is running.
- Add a `.gitignore` with `node_modules/`, `.DS_Store` and `Thumbs.db`.

---

## 5. config.js

`config.js` is already in the folder. Keep its structure and comments. You may change only:
- `salesWhatsApp`, when I give you the number
- `siteUrl`, in Phase 6

What each setting does:
- `programs`: which programs the app may recommend. The order breaks ties. Nothing else may hard-code a program id.
- `switchProgram`: the program on the switch-to-tech card when the non-tech role has none of its own, or no role was guessed.
- `samplesOnHome`: the sample chips on the home screen, in order.
- `salesWhatsApp`: digits only, country code first, 11 to 15 digits. If empty or not in that format, hide the WhatsApp sales button and show "See the program" instead.
- `website` and `utm`: build every link to wrench-wise.com and to program pages, adding `utm_content` (`home`, `result`, `switch`, `others` or `footer`) so we can tell the buttons apart.
- `session`: when `enabled` is true, show the free session card on the home and result screens.
- `analytics`: an empty ID switches that tracker off.
- `limits`: `maxChars` (longer posts are cut), `minChars` (the X-ray button stays off below this), `minSkills` (fewer job skills found shows the "paste the full post" message), `minRoleHits` (for the role guess), `maxLinkSkills`, `maxReqsPerType` (most "Also asks for" items shown under one heading). Nothing else may hard-code these numbers.
- `features`: switches. Every optional feature checks its switch.
  - `softSkills` off: soft skills are dropped right after the scan. They are not shown, counted, ticked, scored or put in links.
  - `requirements` off: no "Also asks for" list anywhere and no amber highlights.
  - `switchCard` off: non-tech posts show "Visit wrench-wise.com" in place of the switch card.

---

## 6. Features

### Must have

**A. Home screen**
- **Background:** `--bg-grad` with a very faint grid (24px squares, `--brand` at 5% opacity) and two large soft glows (`--accent` at 8%) drifting slowly, 20 to 30 second loops, `transform` and `opacity` only.
- **Hero film** (`fx/hero.js`): a small version of the X-ray film (6C) showing the first 7 lines of sample s1. Every 5 seconds the beam sweeps it, the skills and requirements light up and the counters count. On laptop it is tilted in 3D (rotateX 6deg, rotateY -10deg) and follows the pointer by up to 5 degrees. Flat on phone.
- **Text:** eyebrow chip "For any job post". Title "Job Post X-Ray" in weight 800 with the brand gradient as text fill (solid `--brand` if gradient text is not supported). Subtitle from copy.js.
- **Paste card** (a white card):
  - Label "Paste the full job post", then a `<textarea>` (at least 160px tall on phone, 220px on laptop) with the placeholder from copy.js.
  - A character counter under it, like "1,240 / 15,000", using `config.limits.maxChars`. Above the limit it turns `--warn` and says the extra will not be scanned.
  - "Paste from clipboard" (secondary button with a clipboard icon), shown only when `navigator.clipboard.readText` exists and `features.clipboardPaste` is on. If reading fails or is refused, show `home.clipboardFail` under the box.
  - "Clear" (text button), shown when the box has text.
  - Primary button "X-ray this job post", full width on phone, disabled until the text has `config.limits.minChars` characters. Ctrl+Enter (Cmd+Enter on Mac) also runs it.
  - A privacy line with a lock icon: "Your job post stays on this device. Nothing is uploaded or saved."
- **Link only:** if the trimmed text is a single web address (one line starting with `http` or `www`), do not scan. Show `home.linkOnly` under the box instead.
- **Samples:** "No job post handy? Try one:" then one chip per id in `config.samplesOnHome`, using the sample's `title`. Tapping a chip fills the box with the sample text, scrolls to the box and focuses the X-ray button. It does not start the scan.
- **How it works:** three small steps with inline SVG icons (`home.how1` to `home.how3`).
- **How the X-ray works** (a `<details>`): `home.aboutBody`.
- **Session card**, if `config.session.enabled` (6F).
- **Compare banner**, if the page was opened from a valid compare link (6G). It sits above the paste card.
- **Layout:** on phone, stacked: header, title, subtitle, paste card, samples, hero film, how it works, about, footer. At 390 x 844 the title, subtitle, the text box and the X-ray button are all visible without scrolling. On laptop, two columns: text and paste card on the left, a larger hero film on the right.

**B. Reading the post** (`content.js` and `session.js`, no DOM)
- `content.js` exposes:
  - lookups: `skill(id)`, `group(id)`, `kindOf(id)` (`tech`, `work` or `soft`), `program(id)`, `role(id)`, `sample(id)`, `programsOn()` (from `config.programs`, skipping retired ones)
  - lists: `softIds`, `techIds`, `bridgeIds`
  - `scanPost(text)`: runs both engines once and returns `{ scan, job, soft, reqs, film }`. When `features.softSkills` is off, `soft` is empty and soft matches are removed from `scan` and `film`. When `features.requirements` is off, `reqs` is empty and there are no `req` film spans.
  - `guessRole(jobIds)` (returns null when `features.roleGuess` is off)
  - `groupedJob(jobIds)`: job skills grouped in the order of `GROUPS`, keeping found order inside each group
  - `groupedReqs(items)`: `[{ type, name, labels }]` in `REQ_TYPES` order, at most `maxReqsPerType` labels each, using `reqLabel` from `score.js`
- `session.js` holds the current check in memory: `source` (`post` or `link`), `text` (post only), the scan result, the job ids, the soft ids, the requirement items, the ticked ids, the role id and, from a compare link, the friend's `m`. It has `startFromText(text)`, `startFromLink(parsed)`, `toggle(id)`, `setRole(id)`, `clearTicks()` and `report()`. `report()` returns:
  - `kind` from `postKind`
  - `job` and `soft` from `matchReport`, and `main` from `mainScore`
  - on a tech post: `program` from `pickProgram` and `ranked` from `rankPrograms`, both with job skills only
  - on a non-tech post: `switchProgram` and `carry` from `carryOver` (job skills, then soft skills)
- **Remembered ticks:** when `features.rememberSkills` is on and `jpx-skills` holds ids, found skills that are in it start ticked, and the tick screen shows "Ticked from last time" with "Clear all".
- "Check another job post" forgets the text, the scan, the requirements and the ticks (remembered ticks stay saved).

**C. The X-ray** (`screens/scan.js`, `fx/film.js`, `fx/beam.js`)
- **The film panel:** a dark card (`--film-bg`, 16px radius, `--shadow-xl`) with:
  - a faint grid (`--film-grid`, 24px squares)
  - four small L-shaped corner marks (`--film-mark`), like a real X-ray film
  - a top strip with "Job post X-ray" in the mono font, 11px, uppercase, letter spacing 0.12em, `--film-label`
  - on the right of that strip, two live counters in tabular numbers: "Job skills" and "Soft skills" (only "Job skills" when soft skills are off)
  - a small key under the strip: three dots with "Job skills", "Soft skills" and "Also asks for"
- **The post inside** (`fx/film.js`): the scanned text (up to `maxChars`) in the sans font, 14px on phone and 15px on laptop, line height 1.6, `--film-text-pre`, `white-space: pre-wrap`, `overflow-wrap: anywhere`. Each `mergeSpans` span becomes a `<mark>` built with `textContent`, with class `hit-job`, `hit-soft` or `hit-req`, `data-ids` or `data-key`, and a `title` of its names. Everything between spans is plain text nodes. If the post was cut, add `scan.truncated` at the end in `--film-label`.
- **Height:** the film is at most 62dvh tall on phone and 70dvh on laptop. Longer posts scroll inside it.
- **The beam** (`fx/beam.js`):
  - A horizontal line across the film: 3px tall, `--film-beam`, with a glow (`0 0 24px` in `--film-glow`) and a soft trail above it (60px tall, `--film-glow` at 18% fading to nothing).
  - Duration: 1.6 s plus 0.25 s for every 1,000 characters, at most 3.4 s, eased in and out.
  - If the post is taller than the film, the beam moves down to 45% of the film's height and then stays there while the text scrolls up under it, so every line passes the beam. Move the text with `transform` only.
  - When the beam reaches a highlight's top edge, it lights up over 220 ms, scaling from 1.08 to 1:
    - job skills: `--film-hit-bg`, `--film-hit-text`, a 1px `--film-glow` outline and a soft glow
    - soft skills: `--film-soft-bg`, `--film-soft-text`, a 1px `--film-soft-glow` outline and a soft glow
    - requirements: no fill, `--film-req-text`, and a 2px dashed `--film-req-line` underline
  - Highlights on the same line light up left to right, 40 ms apart.
  - Each counter goes up by one for each new skill of its kind (not for repeat mentions), with a blip sound. Requirements play a softer tick and are not counted.
  - When the beam finishes: unlit text fades to `--film-text` over 400 ms, the beam fades out, and the text scrolls back to the top.
  - Tapping the film during the scan jumps to the finished state.
- **After the scan** (state `ok` from `scanState`, Section 10): a bar slides up (a bottom sheet on phone, under the film on laptop) with the found line in weight 800 (like "19 job skills and 3 soft skills found"), the role line if guessed ("Looks like a Full Stack Developer job"), the primary button "Tick the skills you have" and a text button "Edit the post" (back to home with the text still in the box). An `aria-live` region reads the found line.
- **Too few skills** (`scanState`):
  - `none` (no job or soft skills): title "No skills found", the body from copy.js, buttons "Edit the post" (primary) and "Try a sample".
  - `few` (fewer than `minSkills` job skills): title "Only 2 job skills found" ("No job skills found" for 0), the same body, buttons "Edit the post" (primary) and "Continue anyway".
- Send `xray:start` when the X-ray button is tapped, then `xray:done` or `xray:few` at the end.

**D. Tick your skills** (`screens/check.js`)
- **Header:** "This job post asks for 19 job skills" in weight 800 ("Your friend's job post asks for 19 job skills" from a compare link; "soft skills" when there are no job skills). Under it: "Tick the ones you already have. Be honest. Nobody else sees this."
- **Role** (when `features.roleGuess` is on): a chip "Looks like a Full Stack Developer job" and a "Change" text button that opens a native `<select>` of every role name plus "Other role". With no guess, show the select with "Other role" chosen. Changing the role changes the post kind, the card on the result and the words in the WhatsApp message, share text and share image. Send `role:change`.
- **Job skills**, grouped by `groupedJob`, each group with a small label (the group name). Each chip is a `<button aria-pressed>` at least 44px tall, showing the skill name and, when the post mentions it 2 or more times, a small "x2" badge.
  - Not ticked: `--chip-bg`, `--border`, `--text`.
  - Ticked: `--have-bg`, `--have-text`, a check icon and a `--brand` border.
  - Tapping toggles it with a quick scale from 0.96 to 1 (150 ms) and a soft click sound. Send `check:toggle`.
- **Soft skills** (when any): a heading "Soft skills" with the note "Scored separately from job skills.", then chips that work the same way, in found order.
- **Also asks for** (when any): a read-only card with the heading "Also asks for" and the note "For your info. Not counted in your match." One row per `groupedReqs` group: the type name, then its labels as plain pills in `--req-bg`, `--req-text` and `--req-border`. Not tappable.
- **Show in the post** (only when there is text): a `<details>` that shows the film again, fully lit and still, so people can see where each item was asked for.
- **Remember my ticks** (when `features.rememberSkills` is on): a switch "Remember my ticks on this device", off by default. On: save the ticked ids to `jpx-skills` (merged with ids saved before, at most 200) and keep them in sync. Off: delete `jpx-skills`. Send `skills:remember`.
- **Note:** `check.note`.
- **Sticky bottom bar:** "6 ticked" and the primary button "Show my match". It works with 0 ticked. Leave enough space at the bottom of the page so the bar never covers the last chip.

**E. The match** (`screens/result.js`)
1. **The ring** (`fx/ring.js`): an SVG ring, 168px on phone and 200px on laptop, showing the main score from `mainScore` (job skills, or soft skills when the post has no job skills). Track `--ring-track`. The stroke uses the brand gradient and fills to have/total over 0.9 s. In the centre: the have number counting up and "/19", weight 800, 40px, with "job skills matched" (or "soft skills matched") under it. Under the ring: "37% match" using `pct`.
2. **The tier stamp** lands next to the ring: scale 1.4 to 1, rotated -6deg, 220 ms, using `tier(have, total)` (Section 10).
3. **The match line** from `matchLine(main)`, then the soft line from `softLine(main, soft)` with a thin bar (`--soft-bar` on `--ring-track`) filled to soft have/total. Hide the soft line when it is empty.
4. **Head-to-head**, if the check came from a compare link with `m` (Section 10).
5. **Chip lists**, in found order: "You have (7)" with green chips and check icons, then "To learn (12)" with `--miss-bg` and `--miss-text` chips. Then, for soft skills, "Soft skills you have (1)" and "Soft skills to build (2)" in the same styles. Hide any list that is empty.
6. **The main card** (one of these, chosen by `score.js`):
   - **Tech post, something missing, a program covers it** (`cards/program.js`), titled "Close the gap":
     - The program line from `programLine(...)`.
     - The missing job skills this program covers, as chips with a `--brand` check.
     - If some are not covered: "Not in this program: Data structures and algorithms and Next.js" in small `--muted` text, using `list(...)`.
     - Primary button "Talk to us on WhatsApp" (the sales link) when `salesWhatsApp` is valid, and a text link "See the program". Otherwise the primary button is "See the program".
     - "See the program" opens the program's `page` with UTM, or the website with UTM when `page` is empty (`utm_content=result`).
     - A small note: "Based on each program's published syllabus."
   - **Tech post, no program covers the gap:** the same card with "None of our programs teach these skills yet." and the WhatsApp button (generic message, Section 10) or "Visit wrench-wise.com".
   - **Nothing missing** (any post, `cards/ready.js`): titled "Ready to apply" with `result.readyBody`, the button "See all programs" (website with UTM) and the WhatsApp button (generic message).
   - **Non-tech post, something missing** (`cards/switch.js`, when `features.switchCard` is on), titled "Add tech to what you already know":
     - The carry-over line from `carryLine(carry)` (hidden when empty).
     - The ticked bridge skills as green chips (or the found bridge skills as plain chips when none are ticked), at most 6.
     - The switch line from `switchLine(program)`, then the role's `switchWhy` (or `switch.whyDefault` with no role) in `--text-2`.
     - Primary button "Talk to us on WhatsApp" (the switch message) when `salesWhatsApp` is valid, and a text link "See the program" (`utm_content=switch`). Otherwise the primary button is "See the program".
     - With no switch program: the carry-over line, then "Visit wrench-wise.com".
     - With `features.switchCard` off: just "Visit wrench-wise.com".
7. **Also asks for** (`cards/reqs.js`, when any): the same groups as on the tick screen, with the note "Check these too. They are not part of your match."
8. **Other programs** (`cards/others.js`, tech posts only, when `features.otherPrograms` is on, a `<details>`): "Other Wrench Wise programs", listing every other ranked program that covers at least one missing job skill: its full name, "covers 3 of your missing skills", and a link (`utm_content=others`).
9. The session card if on (6F), and the share card (6H).
10. Buttons: "Check another job post" and "Change my ticks" (back to the tick screen with the same ticks).
11. An `aria-live` region reads the match line. Send `result:shown`.

**F. Calls to action** (this is why the app exists)
- **The sales message** is built only by `links.js`. Section 10 has the exact text. On a tech post it names the role, the score, up to 4 missing job skills and the recommended program. On a non-tech post it names the role, the score and the switch program.
- **Session card** (when `session.enabled`): label "Free live session", the session title, the `when` text, and a button "Save my seat" opening `session.url` in a new tab.

**G. Compare links** (`links.js`)
- **Making one:** `compareLink(origin, ids, roleId, have)` = origin + `/?s=` + every found skill id (job and soft, in found order) joined with dots + `&r=` + role id (left out when there is no role) + `&m=` + the main score's have. Origin is `config.siteUrl`, or `location.origin` while that is empty. Hide "Copy link" when there are more than `maxLinkSkills` ids.
- **Reading one:** `readCompare(search)` returns `{ ids, roleId, m }` or `null`. Valid only if:
  - `s` has 3 to `maxLinkSkills` ids, all made of lowercase letters and digits, all unique, and every id exists (retired ids are fine).
  - `r` is absent, or an existing role id.
  - `m` is absent, or a whole number from 0 to the number of ids.
  - If any part is present but invalid, the whole link is invalid.
- **Opening a valid link:** the home screen shows a banner above the paste card with the banner text from Section 10 and a button "Check my match", which opens the tick screen with those skills (split into job and soft with `splitKinds`) and that role. There is no post text, so "Show in the post" and "Also asks for" are hidden. Send `link:open`.
- **Invalid links** are ignored quietly. No error message.
- After reading the link, remove the query from the address bar with `history.replaceState`, and keep the parsed link in memory.
- Respect `features.compareLinks`.

**H. Sharing** (`share.js`, `shareImage.js`)
- A share card on the result screen, titled "Send this to a friend", with three buttons:
  - "Share my match": makes the share image and opens the phone share sheet with the image and the share text when `navigator.canShare({ files })` is true. Otherwise it downloads the PNG as `job-post-xray-7-of-19.png`.
  - "Send on WhatsApp": opens `https://wa.me/?text=` plus the encoded share text.
  - "Copy link": copies the compare link. Changes to "Copied" for 2 seconds. Use `navigator.clipboard.writeText` with a hidden textarea fallback.
- Two size pills above the buttons: "Status" (1080 x 1920, selected by default) and "Post" (1080 x 1350).
- If the person cancels the share sheet, ignore the error quietly.
- **The share image**, drawn on a hidden canvas:
  - `--bg-grad` background, a 6px brand gradient bar at the top, the logo top left.
  - "Job Post X-Ray" in weight 800, and the role, like "Full Stack Developer job post" ("Job post" with no role).
  - A dark film card with up to 12 skill chips (job skills first, then soft skills): have chips lit in `--film-glow` (soft skills in `--film-soft-glow`) with a check, missing chips outlined in `--film-mark`, and "+7 more" when there are more.
  - The main score huge, like "7/19", with the 7 in the brand gradient, and "job skills matched" (or "soft skills matched") under it, then the tier badge.
  - Footer: "How many do you have?" and the site address.
  - **Never any of the post text, and never the "Also asks for" items.** Skill names only.
  - Status size uses the extra height for a larger film card. Nothing important within 220px of the top or bottom edge, where Status bars cover it.

**I. Sound** (`fx/sound.js`)
- Web Audio only, synthesised in code. No sound files. Create the AudioContext on the first tap.
- Sounds:
  - Beam hum: a quiet 110 Hz sine with a slow filter sweep for the length of the scan, fading in and out over 120 ms, gain 0.05.
  - Job skill blip: a 60 ms sine gliding from 880 Hz to 1320 Hz. Each new skill is 2 semitones higher, wrapping after 8. At most one blip every 50 ms.
  - Soft skill blip: the same, one octave lower and a little quieter.
  - Requirement tick: a 30 ms 660 Hz triangle, gain half of the blip.
  - Tick: a 6 ms click when a chip is toggled.
  - Result: a short three-note rising arpeggio, plus a brief sparkle at 100%.
- Master volume 0.25.
- A speaker button in the header mutes and unmutes. Save the choice as `jpx-muted`. Respect `features.sound`.

**J. Branding**
- **Header:** the logo (`assets/logo.png`, 28px tall), a thin divider, then "Job Post X-Ray" in weight 800. On the right: the mute button and the theme button. A 3px brand gradient bar runs under the header. If the logo file is missing, use a clean text wordmark "Wrench Wise".
- **Footer**, small and quiet: "Built with code by Wrench Wise", a link "Learn to build apps like this" (website with UTM, `utm_content=footer`) and the version, like "v1.0.0".

**K. Layout**
- **Phone portrait first** (360 to 430px wide).
- **The reel frame:** at 390 x 844, the whole film with the beam and both counters fits on screen during the scan, and on the result screen the ring, the tier stamp, the match line and the soft line are visible without scrolling.
- **Laptop (900px and wider):** home in two columns; the film centred at up to 760px wide; the tick screen with chips on the left and a sticky summary card (counts and "Also asks for") on the right; the result with the ring and lines on the left and the main card on the right. Max content width 1100px.
- **General:**
  - Use `100dvh` so mobile browser bars do not cut the layout.
  - Respect notches and the home bar with `env(safe-area-inset-*)`.
  - Touch targets at least 44px.
  - No horizontal scrolling at any width from 360px up, even when a pasted post has very long words or links.

**L. Demo mode** (for recording reels)
- Opens with `?demo=1`. Options: `&sample=s1` to `&sample=s11` (default s1), `&theme=light` or `&theme=dark`, and `&loop=0` to stop after one run.
- A visible tap dot (a 28px translucent circle) does everything:
  1. On home, it taps the text box. The sample text appears in 3 chunks over 0.6 s, as if pasted. After 0.5 s it taps "X-ray this job post".
  2. The scan plays in full. After 1.2 s it taps "Tick the skills you have".
  3. On the tick screen it ticks the sample's `demoHave` skills one at a time, 0.45 s apart, in the order they appear on screen, scrolling as needed. It pauses 1 s on the "Also asks for" card. Then it taps "Show my match".
  4. The result holds 4 s, smooth-scrolls to the main card and holds 3.5 s, scrolls to the share card and holds 1.5 s, then scrolls back up and starts again.
- With s1 the result is "You match 7 of 19 job skills." and the Full Stack program "covers 10 of the 12 skills you're missing."
- With s7 the result is "You match 4 of 13 job skills." and the switch card suggests the Certification Program in Artificial Intelligence & Machine Learning.
- Demo mode never sends analytics, never saves anything and never changes the address bar.
- It must look clean in vertical (9:16 phone) and horizontal (16:9 laptop).

**M. Analytics** (`analytics.js`, listening to events only)
- Load only when the ID is set in `config.js`. Never with `?test=1`, `?demo=1` or `?present=1`.
- Build every payload in one pure function, `payloadsFor(eventName, data)`, which returns the GA4 and Meta calls to make. The self-test checks it (Section 10).
- **GA4.** Set `page_location` to the page address without the query. Events:

| GA4 event | Parameters |
|---|---|
| `xray_start` | `source`, `chars_band` (`under_1k`, `1k_3k`, `3k_6k`, `over_6k`) |
| `xray_scan` | `job_found`, `soft_found`, `req_types`, `role`, `kind` |
| `xray_few` | `job_found`, `soft_found` |
| `match_result` | `kind`, `main_kind`, `total`, `have`, `pct`, `soft_total`, `soft_have`, `program`, `covered`, `missing_ids`, `role`, `source` |
| `whatsapp_sales_click` | `kind`, `program`, `have`, `total` |
| `program_click` | `program`, `spot` |
| `website_click` | `spot` |
| `session_click` | none |
| `share_image` | `size` |
| `share_whatsapp` | none |
| `copy_link` | none |
| `compare_link_open` | `count`, `has_m` |

- `missing_ids` is the missing job skill ids joined with commas, built by `links.js`, never longer than 100 characters (stop before the id that would go over). `req_types` is the requirement types found, in `REQ_TYPES` order, joined with commas. `role` is `none` when there is no role. `program` is the program card's program on a tech post, the switch program on a non-tech post, or `none`.
- **Meta Pixel.** `PageView` on load. The standard `Lead` event on the WhatsApp sales click. Custom events `XrayScan` (`job_found`, `kind`) and `MatchResult` (`program`, `pct`, `kind`).
- Send nothing else. **Never any of the post text.**
- `match_result` matters: the most common `missing_ids` tell us what reels, free sessions and ads to make next, and the share of `kind=nontech` tells us how many career switchers we reach (see `UPGRADE_GUIDE.md`).

### Nice to have (only if time allows, in this order)
1. **Presenter mode** (`?present=1`, `features.presenterMode`), for our free live sessions on Zoom or Meet:
   - The film text is at least 20px, and the layout suits a shared laptop screen.
   - Keys 1 to 8 load the samples in `config.samplesOnHome` order. Enter runs the X-ray or moves to the next screen. H shows or hides the highlights on the film. T ticks the sample's `demoHave` skills.
   - Hide the WhatsApp CTA and the share card. The result screen says "Questions? Ask in the chat."
   - No analytics events and nothing saved.
2. **Tap to tick:** on the tick screen, tapping a skill highlight inside "Show in the post" ticks or unticks that skill.
3. **Installable app:** `manifest.json` with app icons, so it can be added to the home screen.

---

## 7. Visual style: matched to wrench-wise.com

These values were measured from the live wrench-wise.com site: emerald as the main brand colour, teal and cyan as accents, gray text, white cards and soft emerald-to-cyan gradients. The film, chip and requirement colours are added for this app.

**Colours.** Every colour is a CSS variable in `styles/tokens.css`. JavaScript reads them with `getComputedStyle`. First visit follows the device's light or dark setting. The theme button switches it and saves `jpx-theme`.

**Site tokens**

| Token | Light (default) | Dark |
|---|---|---|
| `--bg` | `#FFFFFF` | `#0F172A` |
| `--bg-grad` | `linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 45%, #ECFEFF 100%)` | `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)` |
| `--surface` | `#FFFFFF` | `#1E293B` |
| `--surface-2` | `#F3F4F6` | `#334155` |
| `--border` | `#E5E7EB` | `#334155` |
| `--text` | `#111827` | `#F1F5F9` |
| `--text-2` | `#374151` | `#CBD5E1` |
| `--muted` | `#6B7280` | `#94A3B8` |
| `--brand` | `#059669` | `#10B981` |
| `--brand-strong` | `#047857` | `#34D399` |
| `--brand-soft` | `#D1FAE5` | `rgba(16,185,129,0.15)` |
| `--accent` | `#0891B2` | `#22D3EE` |
| `--success` | `#059669` | `#34D399` |
| `--warn` | `#B45309` | `#FBBF24` |
| `--error` | `#E11D48` | `#FB7185` |

**Chip, ring and requirement tokens**

| Token | Light (default) | Dark |
|---|---|---|
| `--chip-bg` | `#FFFFFF` | `#1E293B` |
| `--have-bg` | `#D1FAE5` | `rgba(16,185,129,0.18)` |
| `--have-text` | `#065F46` | `#6EE7B7` |
| `--miss-bg` | `#FFF1F2` | `rgba(251,113,133,0.14)` |
| `--miss-text` | `#9F1239` | `#FDA4AF` |
| `--ring-track` | `#E5E7EB` | `#334155` |
| `--soft-bar` | `#10B981` | `#34D399` |
| `--req-bg` | `#FFFBEB` | `rgba(251,191,36,0.12)` |
| `--req-text` | `#92400E` | `#FCD34D` |
| `--req-border` | `#FDE68A` | `rgba(251,191,36,0.35)` |

**Film tokens** (the film is dark in both themes, like a real X-ray)

| Token | Light (default) | Dark |
|---|---|---|
| `--film-bg` | `#050B16` | `#02060F` |
| `--film-grid` | `rgba(34,211,238,0.07)` | `rgba(34,211,238,0.06)` |
| `--film-mark` | `rgba(148,163,184,0.45)` | `rgba(148,163,184,0.45)` |
| `--film-label` | `#94A3B8` | `#94A3B8` |
| `--film-text-pre` | `#CBD5E1` | `#CBD5E1` |
| `--film-text` | `#94A3B8` | `#94A3B8` |
| `--film-glow` | `#22D3EE` | `#22D3EE` |
| `--film-hit-bg` | `rgba(34,211,238,0.18)` | `rgba(34,211,238,0.20)` |
| `--film-hit-text` | `#ECFEFF` | `#ECFEFF` |
| `--film-soft-glow` | `#34D399` | `#34D399` |
| `--film-soft-bg` | `rgba(52,211,153,0.18)` | `rgba(52,211,153,0.20)` |
| `--film-soft-text` | `#ECFDF5` | `#ECFDF5` |
| `--film-req-line` | `#FBBF24` | `#FBBF24` |
| `--film-req-text` | `#FEF3C7` | `#FEF3C7` |
| `--film-beam` | `linear-gradient(90deg, transparent, #22D3EE 15%, #10B981 50%, #22D3EE 85%, transparent)` | same as light |

**Brand gradient:** `--brand-grad: linear-gradient(90deg, #059669, #0D9488, #06B6D4)`. Use it for the primary button, the bar under the header, the title text, the ring and the share image bar.

**Fonts**
- Text: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (the site's own stack). Headings weight 800 with letter spacing -0.01em. Body weight 400 to 500.
- Mono (film labels and counters): `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", "Courier New", monospace`.
- All numbers use `font-variant-numeric: tabular-nums` so they do not jump while counting.

**Shapes:** buttons, pills and chips fully rounded (999px). Cards and the film 16px. The tier stamp 8px.

**Shadows** (light theme; in dark use the same shapes with `rgba(0,0,0,0.40)`)
- `--shadow-sm: 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)`
- `--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)`
- `--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)`
- `--shadow-xl: 0 20px 40px -12px rgba(15,23,42,0.35)`

**Meta:** `theme-color` meta tag `#FFFFFF` (light) and `#0F172A` (dark) using media queries. In `manifest.json`: `theme_color` `#059669`, `background_color` `#FFFFFF`.

**Contrast:** all text at least 4.5 to 1 against its background. Check with DevTools.

**Motion rules**
- UI animates only `transform` and `opacity`. Never width, height, top, left or margins.
- Easing: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` and `--ease: cubic-bezier(0.4, 0, 0.2, 1)` (the site's own curve). Durations 150, 200, 300 and 500 ms.
- Professional and calm. Small distances. Nothing bounces more than once.
- **Reduced motion** (`prefers-reduced-motion: reduce`):
  - No beam. All highlights appear lit at once, the counters show their totals and the text dims without animation.
  - The hero film shows its finished, lit state, still, with no tilt.
  - The ring and the soft bar appear full at once. Stamps appear without scaling. Numbers show without counting.
  - No drifting glows. Fades are under 150 ms. Sounds still play unless muted.

---

## 8. Words (copy.js)

Use exactly these. Values in braces are filled by `t()`. `{post}` is `post.role` with the role filled in, or `post.any`. Keys ending in `.one` are used when `n` is 1.

| Key | Text |
|---|---|
| `home.eyebrow` | For any job post |
| `home.title` | Job Post X-Ray |
| `home.subtitle` | Paste a job post. See every skill it asks for, and how many you already have. |
| `home.pasteLabel` | Paste the full job post |
| `home.placeholder` | Copy the whole post from LinkedIn, Naukri or any job site, then paste it here. |
| `home.count` | {count} / {max} |
| `home.tooLong` | Only the first {max} characters will be scanned. |
| `home.clipboard` | Paste from clipboard |
| `home.clipboardFail` | Couldn't read the clipboard. Long-press the box and choose Paste. |
| `home.clear` | Clear |
| `home.go` | X-ray this job post |
| `home.private` | Your job post stays on this device. Nothing is uploaded or saved. |
| `home.linkOnly` | We can't open links. Open the job post, copy all of its text, and paste it here. |
| `home.samples` | No job post handy? Try one: |
| `home.how1` / `how2` / `how3` | Paste a job post / See every skill it asks for / Tick yours and see your match |
| `home.aboutTitle` | How the X-ray works |
| `home.aboutBody` | It looks for about 330 skills by name: tech skills like React or SQL, job skills like Tally, SEO or AutoCAD, and soft skills like communication. It also lists what else the post asks for, like experience and education. Unusual tools and wording may be missed. The sample posts were written by the Wrench Wise team. |
| `home.compareBtn` | Check my match |
| `post.role` | {article} {role} job post |
| `post.any` | a job post |
| `scan.label` | Job post X-ray |
| `scan.jobCounter` | Job skills |
| `scan.softCounter` | Soft skills |
| `scan.keyJob` / `keySoft` / `keyReq` | Job skills / Soft skills / Also asks for |
| `scan.jobPart` / `scan.jobPart.one` | {n} job skills / 1 job skill |
| `scan.softPart` / `scan.softPart.one` | {n} soft skills / 1 soft skill |
| `scan.found` | {job} and {soft} found |
| `scan.foundOne` | {part} found |
| `scan.role` | Looks like {article} {role} job |
| `scan.next` | Tick the skills you have |
| `scan.edit` | Edit the post |
| `scan.truncated` | Only the first {max} characters were scanned. |
| `scan.noneTitle` | No skills found |
| `scan.noJobTitle` | No job skills found |
| `scan.fewTitle` / `scan.fewTitle.one` | Only {n} job skills found / Only 1 job skill found |
| `scan.fewBody` | Paste the full job post, including the requirements or skills section. |
| `scan.anyway` | Continue anyway |
| `scan.sample` | Try a sample |
| `check.title` / `check.title.one` | This job post asks for {n} job skills / This job post asks for 1 job skill |
| `check.titleSoft` / `check.titleSoft.one` | This job post asks for {n} soft skills / This job post asks for 1 soft skill |
| `check.titleLink` / `check.titleLink.one` | Your friend's job post asks for {n} job skills / Your friend's job post asks for 1 job skill |
| `check.titleLinkSoft` / `check.titleLinkSoft.one` | Your friend's job post asks for {n} soft skills / Your friend's job post asks for 1 soft skill |
| `check.sub` | Tick the ones you already have. Be honest. Nobody else sees this. |
| `check.softHead` | Soft skills |
| `check.softNote` | Scored separately from job skills. |
| `check.reqHead` | Also asks for |
| `check.reqNote` | For your info. Not counted in your match. |
| `check.roleChange` | Change |
| `check.roleOther` | Other role |
| `check.remember` | Remember my ticks on this device |
| `check.fromLast` | Ticked from last time |
| `check.clearAll` | Clear all |
| `check.showPost` | Show in the post |
| `check.note` | We count skills we can name. Experience and degrees are listed under Also asks for and never scored. |
| `check.ticked` | {n} ticked |
| `check.go` | Show my match |
| `check.mentions` | x{n} |
| `result.matchedJob` | job skills matched |
| `result.matchedSoft` | soft skills matched |
| `result.pct` | {pct}% match |
| `result.have` | You have ({n}) |
| `result.learn` | To learn ({n}) |
| `result.softHave` | Soft skills you have ({n}) |
| `result.softBuild` | Soft skills to build ({n}) |
| `result.reqNote` | Check these too. They are not part of your match. |
| `result.gapTitle` | Close the gap |
| `result.notIn` | Not in this program: {list} |
| `result.syllabus` | Based on each program's published syllabus. |
| `result.readyTitle` | Ready to apply |
| `result.readyBody` | You have every skill this job post asks for. Want to aim higher? See what else you could learn. |
| `result.allPrograms` | See all programs |
| `result.others` | Other Wrench Wise programs |
| `result.otherLine` / `result.otherLine.one` | covers {n} of your missing skills / covers 1 of your missing skills |
| `result.another` | Check another job post |
| `result.change` | Change my ticks |
| `switch.title` | Add tech to what you already know |
| `switch.whyDefault` | It starts from the basics. |
| `cta.whatsapp` | Talk to us on WhatsApp |
| `cta.program` | See the program |
| `cta.website` | Visit wrench-wise.com |
| `session.label` | Free live session |
| `session.btn` | Save my seat |
| `share.title` | Send this to a friend |
| `share.image` | Share my match |
| `share.whatsapp` | Send on WhatsApp |
| `share.copy` | Copy link |
| `share.copied` | Copied |
| `share.status` / `share.post` | Status / Post |
| `share.imageAsk` | How many do you have? |
| `share.imageMore` | +{n} more |
| `share.imageAny` | Job post |
| `presenter.end` | Questions? Ask in the chat. |
| `footer.built` | Built with code by Wrench Wise |
| `footer.learn` | Learn to build apps like this |
| `req.expRange` / `req.expRangeM` | {min} to {max} years / {min} to {max} months |
| `req.expPlus` / `req.expPlusM` | {min}+ years / {min}+ months |
| `req.expExact` / `req.expExact.one` | {n} years / 1 year |
| `req.expExactM` / `req.expExactM.one` | {n} months / 1 month |
| `req.noticeD` / `req.noticeD.one` | Notice period up to {n} days / Notice period up to 1 day |
| `req.noticeM` / `req.noticeM.one` | Notice period up to {n} months / Notice period up to 1 month |

The tier names, match lines, soft line, program lines, carry-over and switch lines, compare banners, head-to-head lines, sales messages and share text are in Section 10. Put them in copy.js too, and build them only through `score.js` and `links.js`.

---

## 9. Link preview (the WhatsApp card)

- **In `index.html`:**
  - Title: "Job Post X-Ray by Wrench Wise"
  - Description: "Paste any job post. See every skill it asks for, and how many you already have."
  - Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type` (website), plus `twitter:card` set to `summary_large_image`.
- **`og:image` and `og:url`** must be full addresses. Use a placeholder until Phase 6, then set the real live address.
- **The preview image:**
  - If I have put my own `assets/og-image.png` in the folder, use it.
  - Otherwise, build `tools/og.html` at 1200 x 630: `--bg-grad` background, the film card showing the first lines of sample s1 with the beam halfway down and the items above it lit in all three colours, the counters reading "Job skills 6" and "Soft skills 0", the words "Job Post X-Ray" in weight 800, and the logo.
  - Open it in Chrome at exactly that size, save a screenshot as `assets/og-image.png`, and keep it under 300 KB.

---

## 10. Correctness checks (must pass)

### 1. Content check

`node tools/verify-content.mjs` must end with `RESULT: ALL PASS`. It already passes. It reports 332 active skills (157 tech, 145 other job skills, 30 soft), 1,901 skill aliases and 364 requirement aliases checked, 11 samples that each pass, and 100 of 100 skill sentences and 47 of 47 requirement sentences read correctly. It runs the real engines, so any alias that cannot find its own item, and any sample that reads differently, fails the check.

### 2. Self-test

When the URL has `?test=1`, run `selftest.js` and show a clear PASS or FAIL table on the page and in the console, with `config.version` and `CONTENT_VERSION` at the top. Every value below must match exactly. They were worked out twice, in JavaScript and in Python, and both agree. All checks use the default `config.js`, with the s-samples' `demoHave` as the ticked skills.

**a. Content loading**
- 332 active skills in 21 groups: 157 tech, 145 other job skills, 30 soft. 37 bridge skills.
- 4 combos, 4 programs, 25 roles (13 tech, 12 non-tech), 11 samples, 103 requirements in 9 types. All ids unique.
- Every id in `config.programs` and `config.samplesOnHome` exists, and `config.switchProgram` is in `config.programs`.

**b. The engines in the browser**
- Scanning each sample in the browser gives exactly its `expected` and `expectedReqs` lists.
- Import `CASES` and `REQ_CASES` from `tools/cases.js` and run all 147. Every one must match.
- Highlight counts:

| Sample | Skill highlights | Requirement highlights | Film: job / soft / req |
|---|---|---|---|
| s1 | 26 | 8 | 23 / 3 / 8 |
| s2 | 25 | 6 | 23 / 2 / 6 |
| s3 | 15 | 5 | 13 / 2 / 5 |
| s4 | 20 | 3 | 18 / 2 / 3 |
| s5 | 23 | 3 | 21 / 2 / 3 |
| s6 | 17 | 2 | 15 / 2 / 2 |
| s7 | 17 | 7 | 14 / 3 / 7 |
| s8 | 14 | 6 | 12 / 2 / 6 |
| s9 | 14 | 8 | 7 / 7 / 8 |
| s10 | 13 | 6 | 9 / 4 / 6 |
| s11 | 16 | 8 | 14 / 2 / 8 |

- s1 mention counts: mongodb 2, express 2, react 2, node 2, js 2, auth 2, aitools 2. Every other s1 skill 1.

**c. s1 in detail**
- Job skills grouped (`groupedJob`): `js, ts, react, html, css, nextjs, express, node, rest, auth, mongodb, sql, docker, aws, github, git, dsa, oop, aitools`
- Soft skills: `motivated, comm, team`
- Also asks for (`groupedReqs`):
  - Experience: 0 to 2 years
  - Education: B.E. or B.Tech, BCA, MCA
  - Work mode: Hybrid
  - Location: Chennai
  - Joining: Immediate joiners
- s2 Also asks for: Experience: 2 to 4 years / Education: B.E. or B.Tech, Computer Science or IT / Location: Bengaluru / Joining: Notice period up to 30 days
- s7 Also asks for: Experience: 1 to 3 years / Education: Any graduate, MBA or PGDM / Work mode: On-site / Location: Chennai / Languages: English, Tamil

**d. Tech samples with their `demoHave` ticked** (programs in `config.programs` order)

| Sample | Role | Job match | % | Tier | Soft | Program | Covers | Not in program |
|---|---|---|---|---|---|---|---|---|
| s1 | fsd | 7 of 19 | 37 | Building up | 1 of 3 | fsd | 10 of 12 | dsa, nextjs |
| s2 | java | 4 of 20 | 20 | Fresh start | 1 of 2 | fsd | 4 of 16 | spring, hibernate, postgres, junit, maven, jenkins, kafka, rabbitmq, k8s, c, cpp, agile |
| s3 | da | 3 of 10 | 30 | Building up | 1 of 2 | aiml | 6 of 7 | tableau |
| s4 | mle | 4 of 17 | 24 | Fresh start | 1 of 2 | aiml | 9 of 13 | docker, aws, go, rust |
| s5 | gai | 4 of 17 | 24 | Fresh start | 1 of 2 | genai | 11 of 13 | llamaindex, finetune |
| s6 | fe | 5 of 13 | 38 | Building up | 1 of 2 | fsd | 5 of 8 | sass, figma, nextjs |

**e. Non-tech samples with their `demoHave` ticked**

| Sample | Role | Job match | % | Tier | Soft | Switch program | Carry-over ticked | Carry-over found |
|---|---|---|---|---|---|---|---|---|
| s7 | mkt | 4 of 13 | 31 | Building up | 2 of 3 | aiml | excel, comm, detail | webanalytics, excel, graphic, comm, analytical, detail |
| s8 | acct | 4 of 12 | 33 | Building up | 1 of 2 | aiml | excel, detail | mis, excel, detail |
| s9 | sales | 2 of 6 | 33 | Building up | 3 of 5 | aiml | comm | comm |
| s10 | hr | 3 of 6 | 50 | Good start | 2 of 4 | aiml | comm | comm, stake |
| s11 | mech | 3 of 9 | 33 | Building up | 2 of 2 | sde | problem, learn | problem, learn |

Carry-over lines:
- s7: "Skills you have that carry over to tech: Excel, Communication and Attention to detail."
- s11: "Skills you have that carry over to tech: Problem solving and Willingness to learn."
- Nothing ticked, found excel, mis, detail, time, comm, problem: "Skills in this job that carry over to tech: Excel, MIS reporting, Attention to detail, Time management and 2 more."
- Nothing found: no line.

Switch lines:
- s7: "A good next step: the Certification Program in Artificial Intelligence & Machine Learning."
- s11: "A good next step: the Certification Program in AI-Powered Software Engineering & DSA."

**f. Rankings** (`rankPrograms`, as id:missing covered/all found covered)
- s1: `fsd:10/15 sde:8/12 genai:1/3 aiml:0/3`
- s5: `genai:11/15 aiml:10/13 fsd:3/6 sde:0/0`

**g. Role guesses** (job skills only)

| Found job skills | Role |
|---|---|
| py, ml, stats, pandas | ds |
| py, pandas, stats, sql, excel | da |
| html, css, js, react | fsd |
| java, spring, rest, sql, micro | java |
| tally, gst, excel | acct |
| seo, sem, smm | mkt |
| photoshop, canva, figma, html | null (no role reaches 3) |
| py, git, langchain | null |
| kotlin, swift | null |
| (none) | null |

**h. Post kind, main score and scan state**

| Job skills | Role | Post kind |
|---|---|---|
| excel, sql, tally, gst | none | tech (2 tech, 2 other: a tie goes to tech) |
| seo, sem, py | none | nontech |
| (none) | none | nontech |
| js | none | tech |
| seo, sem, py | fsd | tech (the role decides) |
| js, react | mkt | nontech (the role decides) |

`mainScore`: job 1 of 2 with soft 0 of 1 gives job 1/2 50. Job none with soft 2 of 3 gives soft 2/3 67. Nothing at all gives soft 0/0 0.

`scanState(job, soft, minSkills 3)`: 0, 0 is `none`. 0, 3 is `few`. 2, 1 is `few`. 3, 0 is `ok`. 19, 3 is `ok`.

**i. Program picks**

| Found | Settings | Picked |
|---|---|---|
| py, git, langchain (all missing) | no role | fsd, covers 3 |
| py, git, langchain (all missing) | role program genai | genai, covers 3 |
| py, git, langchain (all missing) | `config.programs` = aiml, genai only | aiml, covers 3 |
| kotlin, swift, flutter (all missing) | no role | null |
| js, react, node | nothing missing | null |

`switchProgram` (fallback aiml):

| Role | Programs on | Result |
|---|---|---|
| mkt | all four | aiml |
| design | all four | fsd |
| mech | all four | sde |
| none | all four | aiml |
| design | sde, aiml, genai | aiml (fsd is off, so the fallback) |
| none | sde, fsd | null (the fallback is off) |
| fsd (a tech role) | all four | aiml (tech roles never set the switch program) |

**j. Tiers.** The rule is a percentage of have/total: all of them "Ready to apply", 75% or more "Strong match", 50% or more "Good start", 25% or more "Building up", otherwise "Fresh start".

| Have of 19 | Tier |
|---|---|
| 0 to 4 | Fresh start |
| 5 to 9 | Building up |
| 10 to 14 | Good start |
| 15 to 18 | Strong match |
| 19 | Ready to apply |

**k. Percent** (`pct` from the engine, rounded half up): 7 of 19 = 37, 1 of 3 = 33, 2 of 3 = 67, 1 of 8 = 13, 3 of 8 = 38, 0 of 5 = 0, 5 of 5 = 100.

**l. Lines**

| Case | Line |
|---|---|
| job, 7 of 19 | You match 7 of 19 job skills. |
| job, 0 of 19 | You match 0 of 19 job skills. Every one of them can be learned. |
| job, 19 of 19 | You match all 19 job skills. |
| soft, 2 of 3 (no job skills) | You match 2 of 3 soft skills. |
| soft line, s1 | Soft skills: 1 of 3. |
| soft line when the main score is soft, or no soft skills | (no line) |

Program lines:
- s1: "The Certification Program in AI-Powered Full Stack Development covers 10 of the 12 skills you're missing."
- s3: "The Certification Program in Artificial Intelligence & Machine Learning covers 6 of the 7 skills you're missing."
- Covers 3 of 3: "The Certification Program in AI-Powered Full Stack Development covers all 3 skills you're missing."
- Covers 1 of 1: "The Certification Program in AI-Powered Full Stack Development covers the one skill you're missing."
- No program: "None of our programs teach these skills yet."

**m. Lists** (`list(names)`): up to 5 names are joined with commas and a final "and". More than 5 shows the first 4, then "and N more".

| Names | Result |
|---|---|
| (none) | (empty) |
| React | React |
| React, Node.js | React and Node.js |
| A, B, C | A, B and C |
| A, B, C, D, E | A, B, C, D and E |
| A, B, C, D, E, F | A, B, C, D and 2 more |
| A to L (12 names) | A, B, C, D and 8 more |

**n. Requirement labels** (`reqLabel`): `exp:0-2y` is "0 to 2 years", `exp:3+y` is "3+ years", `exp:1y` is "1 year", `exp:1.5y` is "1.5 years", `exp:6+m` is "6+ months", `notice:30d` is "Notice period up to 30 days", `notice:1m` is "Notice period up to 1 month", `notice:2m` is "Notice period up to 2 months". Listed items use their `name`.

**o. Sales messages.** The test number `910000000000` is for the test only and never goes in config.

s1 with its `demoHave` (tech, role fsd, program fsd), `salesUrl` gives exactly:

```
https://wa.me/910000000000?text=Hi%2C%20I%20checked%20a%20Full%20Stack%20Developer%20job%20post%20on%20Job%20Post%20X-Ray.%20I%20match%207%20of%2019%20job%20skills.%20I'm%20missing%20MongoDB%2C%20Express.js%2C%20React%2C%20Node.js%20and%208%20more.%20I'd%20like%20to%20know%20more%20about%20the%20Certification%20Program%20in%20AI-Powered%20Full%20Stack%20Development.
```

s7 with its `demoHave` (non-tech, role mkt, switch program aiml) gives exactly:

```
https://wa.me/910000000000?text=Hi%2C%20I%20checked%20a%20Digital%20Marketing%20Executive%20job%20post%20on%20Job%20Post%20X-Ray.%20I%20match%204%20of%2013%20job%20skills.%20I'd%20like%20to%20add%20tech%20skills%2C%20and%20know%20more%20about%20the%20Certification%20Program%20in%20Artificial%20Intelligence%20%26%20Machine%20Learning.
```

The message text before encoding:
- Tech: "Hi, I checked {post} on Job Post X-Ray. I match {have} of {total} job skills. I'm missing {list}. I'd like to know more about the {program}."
- Non-tech: "Hi, I checked {post} on Job Post X-Ray. I match {have} of {total} job skills. I'd like to add tech skills, and know more about the {program}."
- Tech, nothing missing, no role, 5 skills: "Hi, I checked a job post on Job Post X-Ray. I match all 5 job skills. I'd like to know more about Wrench Wise programs."
- Tech, no program covers the gap (role mob, 0 of 3, missing Kotlin, Swift, Flutter): "Hi, I checked a Mobile App Developer job post on Job Post X-Ray. I match 0 of 3 job skills. I'm missing Kotlin, Swift and Flutter. I'd like to know more about Wrench Wise programs."
- Non-tech, no role, no switch program, 2 of 6: "Hi, I checked a job post on Job Post X-Ray. I match 2 of 6 job skills. I'd like to add tech skills, and know more about Wrench Wise programs."
- Non-tech, no role, soft skills only, 2 of 3, switch program aiml: "Hi, I checked a job post on Job Post X-Ray. I match 2 of 3 soft skills. I'd like to add tech skills, and know more about the Certification Program in Artificial Intelligence & Machine Learning."

Also: if `config.salesWhatsApp` is not empty, it must be 11 to 15 digits only.

**p. Compare link and sharing.** For s1 with its `demoHave`, `compareLink("https://job-post-xray.vercel.app", found, "fsd", 7)` gives exactly:

```
https://job-post-xray.vercel.app/?s=mongodb.express.react.node.html.css.rest.github.git.js.dsa.oop.auth.sql.ts.nextjs.docker.aws.aitools.motivated.comm.team&r=fsd&m=7
```

The share text for that result is exactly:

```
I X-rayed a Full Stack Developer job post. It asks for 19 job skills and I have 7. How many do you have? https://job-post-xray.vercel.app/?s=mongodb.express.react.node.html.css.rest.github.git.js.dsa.oop.auth.sql.ts.nextjs.docker.aws.aitools.motivated.comm.team&r=fsd&m=7
```

and its WhatsApp share link is exactly:

```
https://wa.me/?text=I%20X-rayed%20a%20Full%20Stack%20Developer%20job%20post.%20It%20asks%20for%2019%20job%20skills%20and%20I%20have%207.%20How%20many%20do%20you%20have%3F%20https%3A%2F%2Fjob-post-xray.vercel.app%2F%3Fs%3Dmongodb.express.react.node.html.css.rest.github.git.js.dsa.oop.auth.sql.ts.nextjs.docker.aws.aitools.motivated.comm.team%26r%3Dfsd%26m%3D7
```

Other share texts:
- All matched, no role: "I X-rayed a job post. It asks for 5 job skills and I have all of them. How many do you have? https://job-post-xray.vercel.app/?s=js.react.node.html.css&m=5"
- Soft skills only: "I X-rayed a job post. It asks for 3 soft skills and I have 2. How many do you have? https://job-post-xray.vercel.app/?s=comm.team.problem&m=2"

**q. Reading compare links** (`readCompare`)

| Query | Result |
|---|---|
| `?s=js.react.node&r=fsd&m=2` | valid: 3 ids starting with js, role fsd, m 2 |
| `?s=js.react.node` | valid: 3 ids, no role, no m |
| `?s=comm.team.problem&m=0` | valid: 3 ids (all soft), no role, m 0 |
| `?s=py.sql.excel&r=mkt&m=1` | valid: 3 ids, role mkt, m 1 |
| `?s=js.react&m=1` | invalid (fewer than 3) |
| `?s=js.react.js&m=1` | invalid (repeated id) |
| `?s=js.react.xyz&m=1` | invalid (unknown skill) |
| `?s=JS.React.Node&m=1` | invalid (capitals) |
| `?s=js.react.node&m=4` | invalid (m above 3) |
| `?s=js.react.node&m=two` | invalid (m not a number) |
| `?s=js.react.node&r=pilot&m=1` | invalid (unknown role) |
| `?s=js..react.node` | invalid (empty id) |
| the first 60 skill ids in content order | valid: 60 ids |
| the first 61 skill ids in content order | invalid (more than 60) |
| (no query) | null |

The first 60 ids are: `py.java.js.ts.c.cpp.cs.go.rust.kotlin.swift.php.ruby.scala.r.dart.matlab.shell.html.css.react.angular.vue.nextjs.redux.tailwind.bootstrap.sass.jquery.responsive.figma.uiux.node.express.django.flask.fastapi.spring.hibernate.dotnet.laravel.rails.nestjs.rest.graphql.micro.auth.sockets.kafka.rabbitmq.maven.sql.mysql.postgres.mongodb.nosql.redis.oracle.mssql.firebase`

**r. Banners and head-to-head lines**
- s1 link with m: "A friend has 7 of the 19 job skills a Full Stack Developer job post asks for. How many do you have?"
- s1 link without m: "Someone sent you the 19 job skills a Full Stack Developer job post asks for. How many do you have?"
- js, react, node, html, css, no role, m 2: "A friend has 2 of the 5 job skills a job post asks for. How many do you have?"
- comm, team, problem, no role, m 1: "A friend has 1 of the 3 soft skills a job post asks for. How many do you have?"

| You | Friend | Line |
|---|---|---|
| 9 | 7 | You have 9. Your friend has 7. You're ahead on this one. |
| 7 | 7 | You both have 7. It's a tie. |
| 4 | 7 | Your friend has 7. You have 4. Plenty of time to catch up. |

**s. Analytics payloads** (`payloadsFor`, no scripts loaded)
- s1 with its `demoHave`: `missing_ids` is exactly `mongodb,express,react,node,rest,dsa,auth,ts,nextjs,docker,aws,aitools` and `req_types` is exactly `exp,edu,mode,place,notice`.
- s2: `missing_ids` is exactly `spring,hibernate,rest,micro,postgres,testing,junit,maven,jenkins,kafka,rabbitmq,docker,k8s,c,cpp` (the next id would pass 100 characters).
- s7: `missing_ids` is exactly `digitalmkt,sem,metaads,leadgen,contentmkt,webanalytics,graphic,perfmkt,wordpress`, `kind` is `nontech` and `program` is `aiml`.
- Run `payloadsFor` for every event in the Section 3 table with s1 data. No parameter value is longer than 100 characters, and none contains any 20-character piece of the s1 post text.

**t. Words**
- No text in copy.js contains a banned word from Rule 9, an emoji or a long dash.
- Every program name shown comes from `content/programs.js` in full.

**u. Privacy and storage**
- After a full run with s1 and "Remember my ticks" off, `localStorage` holds no keys other than `jpx-theme` and `jpx-muted`.
- With it on, it also holds `jpx-skills`, a JSON list of skill ids only.
- No storage key, no address and no analytics payload contains any 20-character piece of the s1 post text.

**v. Feature switches** (run with a copy of `CONFIG` changed in memory)
- `softSkills` off: s1 gives 19 skills, all job skills, 23 film highlights of kind job and none of kind soft, and the compare link has no soft ids.
- `requirements` off: s1 gives no requirement items and no `req` film spans.

### 3. Other checks
1. **Console.** No console errors on any screen.
2. **Speed.** In Chrome DevTools at 390 x 844 with CPU throttling set to 4x: the beam scan on sample s2 and the result animations average above 50 fps, and the home hero above 45 fps. Report the numbers.
3. **Layout.** Screenshots at 360 x 740, 390 x 844, 768 x 1024 and 1440 x 900. No horizontal scroll anywhere, including with a pasted post that contains a 200-character link.
4. **Reel frame.** A temporary `?preview=s1` to `?preview=s11` opens straight to the scan of that sample. At 390 x 844, the whole film, beam and both counters fit on screen for all eleven.
5. **Brand match.** Open wrench-wise.com and the app side by side and screenshot both. Fix anything that does not look like the same company. Search the code for colour values and confirm every one comes from Section 7.
6. **Tone.** Search all user-facing text for the banned words in Rule 9. There must be none.
7. **Safety.** Search the code for `innerHTML`, `insertAdjacentHTML`, `eval(`, `new Function` and `onclick=`. None may appear. Paste `<img src=x onerror=alert(1)>` and `<b>React</b>` into the box and X-ray them: they must show as plain text, and React must still light up.
8. **Contrast.** All text at least 4.5 to 1, including the amber requirement text on the film.
9. **Links.** Open one valid compare link and two invalid ones from table (q). Report what happens.

---

## 11. Phases

Total target is about 8 hours. Take the time needed to get each phase right.

### Phase 0: Setup and content check (target 20 min)
- **Do:**
  - Run `node --version`, then `node tools/verify-content.mjs`.
  - `git init`, add `.gitignore`.
  - Create the folders from Section 4, `styles/tokens.css` with every token from Section 7, and an `index.html` shell with the header and footer.
  - Start the local server.
- **Report:** the Node version, the full content check output, and a screenshot of the shell page.

### Phase 1: Wiring and self-test (target 75 min)
- **Build:** `events.js`, `copy.js` (every key from Section 8 and the lines from Section 10), `content.js`, `session.js`, `score.js`, `links.js`, `store.js`, the `payloadsFor` function in `analytics.js` (no script loading yet), and `selftest.js` with checks a to v.
- **Report:** the full self-test table. Every value must match Section 10. Do not continue with a mismatch. Explain it in plain words instead.

### Phase 2: The X-ray (target 100 min)
- **Build:**
  - The home screen paste card, character counter, clipboard paste, link-only message and sample chips
  - `fx/film.js`, `fx/beam.js` and `screens/scan.js`: the film with three highlight kinds, the beam, the light-ups, both counters and the after-scan bar
  - The "too few skills" states
  - The temporary `?preview=s1` to `?preview=s11` views
- **Report:**
  - Screenshots mid-scan and after the scan for s1, s7 and s9, at 390 x 844 and 1440 x 900
  - The reel frame check for all eleven samples
  - The scan fps with 4x CPU throttling
  - The two safety pastes from check 7

### Phase 3: Tick screen, match and home polish (target 110 min)
- **Build:**
  - `router.js` and the remaining screens
  - The tick screen: grouped job chips, soft chips, mention badges, the role chip and select, "Also asks for", "Show in the post", remember ticks, the sticky bar
  - The result: ring, tier stamp, match line, soft line, chip lists, and the cards in `js/cards/` (program, switch, ready, also asks for, other programs, session)
  - The home hero film loop and the background
  - Sound
- **Report:**
  - Screenshots on phone and laptop of home, the tick screen for s1 and s7, and the result with a program (s1), with the switch card (s7), with no program (a Mobile App Developer post) and with nothing missing
  - Click steps for me to X-ray a sample and reach the result in Chrome

### Phase 4: Compare links and sharing (target 60 min)
- **Build:**
  - Reading compare links, the home banner, the link tick screen and the head-to-head line
  - The share card, both share image sizes, WhatsApp share and copy link
  - Link preview tags and `og-image.png`
- **Report:** both share images for s1 and for a 100% match, the link test results from check 9, and a screenshot of the compare banner.

### Phase 5: Polish (target 60 min)
- **Build:**
  - Dark theme and the theme button
  - Reduced motion
  - Demo mode
  - Analytics loading, wired to events through `payloadsFor`
  - Accessibility: keyboard use, focus rings, `aria-live` for the found line and the match line
  - Remove the temporary `?preview` views
  - Then, only if time allows, the Nice to Have items in order
- **Report:**
  - Screenshots in both themes
  - Confirmation that demo mode loops cleanly with s1, s5 and s7
  - The speed numbers and the brand match screenshots
  - Click steps for me to check analytics: GA4 DebugView, and the Meta Pixel Helper Chrome extension

### Phase 6: Docs and deploy (target 45 min)
- **README.md:**
  - What the app is and the live link
  - How to use it in 3 steps
  - How to run it locally, and how to run the content check
  - "How it works" in 6 short points: whole-word aliases, the longest match wins, context words like Go, R and Tally, reading experience from numbers, the beam timing, and links that carry skill ids instead of the post
  - "Built by Wrench Wise"
- **UPGRADE_GUIDE.md**, in plain words for me, with these recipes:
  1. Change the WhatsApp number, programs on offer, switch program, sample chips, session card, limits or links (`config.js` only)
  2. When a real job post is read wrongly: add that sentence to `tools/cases.js` with the right answer, fix or add the alias in `content/skills.js` or `content/requirements.js`, run the content check
  3. Add a new skill, or retire one (`retired: true`, never delete)
  4. Add a whole new field, like healthcare or law: a new group in `skills.js` with `kind: "work"`, its skills, a non-tech role in `roles.js` with its `switchWhy`, and one sample post
  5. Add an "Also asks for" item, like a new city, degree or certification
  6. Change what a program covers (instructor sign-off first, then the content check), or add a new program and list it in `config.programs`
  7. Change which program a non-tech role suggests (`program` and `switchWhy` in `roles.js`)
  8. Turn a feature on or off (`config.features`)
  9. Use GA4 to plan content: the most common skills in `missing_ids` are the topics for reels, free sessions and ads. The share of `kind=nontech` shows how many career switchers use it. A high share of `xray_few` means real posts use words we are missing, so collect a few and add aliases
  10. Release steps: raise `config.version` (and `CONTENT_VERSION` if content changed), add a `CHANGELOG.md` entry, tag in git
  11. How to run any future upgrade with Antigravity, including this ready-to-paste prompt:
      > Read PROJECT_BRIEF.md, UPGRADE_GUIDE.md and CHANGELOG.md. I want to add: [describe the feature]. Create a branch called upgrade-[short-name]. Follow Section 3 of PROJECT_BRIEF.md. Plan the work in phases and stop after each one with a Phase Report. Do not change content/, tools/ or js/engine/ unless I ask. Keep every self-test and the content check passing, and add tests for the new feature. Give me the Vercel preview link and wait. Merge only when I reply "Ship it".
  12. Upgrades this structure is ready for, and what each needs: must-have versus good-to-have skills (the engines already give positions, so a new step can find the "Good to have" heading), a Tamil version (`copy.ta.js` and a language switch), a resume X-ray that ticks your skills from your pasted resume (the same engines and the same privacy rules), comparing two job posts side by side, a "Your profile vs this job" check of experience and degree against the "Also asks for" list, a Mechanical and CFD program card (a program in `programs.js` and the mech role's `program`), and AI-based reading of posts (needs a backend and an API key, so it is a separate project)
- **CHANGELOG.md:** a "1.0.0" entry listing what v1 includes.
- **STUDENT_EXPLAINER.md:** for students:
  - What the app teaches: text search, whole-word matching, picking the longest match, a context window, reading numbers with patterns, and keeping data separate from code
  - The engine rules in plain words, each with one example sentence from `tools/cases.js`
  - How the app is built, in plain words
  - 3 extension tasks: add a new skill and a tricky sentence that both pass the content check, split must-have and good-to-have skills using the "Good to have" heading, and build "Paste your resume" to tick skills automatically
- **REEL_SCRIPT.md:** four scripts, each with a hook as on-screen text in the first 2 seconds, a shot list matched to demo mode timing, captions, optional voiceover lines and a closing line with Wrench Wise:
  - Vertical, 30 seconds (`?demo=1&sample=s1`): "Job posts look scary. Let's X-ray one."
  - Horizontal, 60 seconds (`?demo=1&sample=s5&theme=dark`): "What does a Generative AI Engineer job really ask for?"
  - Vertical, 30 seconds (`?demo=1&sample=s7`): "In marketing? You already have more tech skills than you think."
  - Comment bait: freeze after the scan of one sample, "Comment the role you want. We'll X-ray one for it next."
  - The sample posts are written by us. Captions never say they come from a real company.
  - No emojis, no em dashes, none of the banned words
- **Deploy:**
  1. Help me push the folder to GitHub. I will give you my empty repository URL.
  2. Deploy it on Vercel as a static site, with no build command.
  3. Set `config.siteUrl`, `og:url` and `og:image` to the live address, then redeploy.
  4. Give click-by-click steps for anything I must do myself.
  5. Confirm the live site works on a phone-sized screen, that `?test=1` passes live, and that one compare link opens correctly.
  6. Tag the release `v1.0.0` and push the tag.
  7. Give me the live link, the demo links for s1, s5 and s7, and the presenter link.

---

## 12. Phase Report format

- **What I built** (3 to 5 bullets)
- **How to check it** (click steps)
- **Screenshots** (phone and laptop, where relevant)
- **Not working or cut,** explained in plain words
- **Time used** against the target

---

## 13. If something keeps breaking

- If the same bug survives two fix attempts, stop. Explain it in plain words and give me options. Do not keep looping.
- If I say "Park it", move that feature to a "Parked" list in the Phase Report and continue with the next phase.
- If I want to ship sooner, park in this order:
  1. Presenter mode and tap to tick
  2. The Post size share image (keep Status)
  3. The home hero loop (keep a still, lit film)
  4. The "Other Wrench Wise programs" list
  5. The beam hum and the requirement tick sound (keep the skill blips)
  6. The film key under the strip

**Never park:**
- The scan with the beam, the three highlight kinds and both counters
- The tick screen with job skills, soft skills and "Also asks for"
- The result with the ring, the match line, the soft line, the program card, the switch card and the WhatsApp CTA
- Compare links and the Status share image
- The content check, the self-test and every value in Section 10
- Every rule in Section 3
- The privacy, tone and safety rules
- Light and dark theme
- Demo mode
- Reduced motion rules
- Deployment
