# Content: what each field means

Everything the X-ray knows lives in this folder: the skills it looks for, the stacks (like MERN), the Wrench Wise programs, the job roles, the "Also asks for" list and the sample job posts.

After any change here, run this from the project folder. It must end with `RESULT: ALL PASS`.

```
node tools/verify-content.mjs
```

The check runs the real engines (`js/engine/`) on every alias, every sample post and every tricky sentence in `tools/cases.js`, so a broken alias cannot go live.

## Groups (`skills.js`, top of the file)

| Field | What it is |
|---|---|
| `id` | 2 to 12 lowercase letters. |
| `name` | Shown as a heading over the chips, like "Finance and accounts". |
| `kind` | `tech` (skills our programs can teach), `work` (job skills from other fields) or `soft` (soft skills). |

Tech and work skills together are "job skills". Soft skills get their own score and never decide which program is suggested.

## Skills (`skills.js`)

| Field | What it is |
|---|---|
| `id` | 1 to 12 lowercase letters or digits, like `react` or `tally`. **Never change or reuse an id.** Shared links carry ids. |
| `name` | Shown on chips, for example "Node.js". |
| `group` | One of the group ids, like `web` or `finance`. |
| `aliases` | Ways a job post writes this skill, in lowercase. Capitals in the post do not matter. A space also matches a hyphen, so `fine tuning` finds "Fine-Tuning". |
| `cased` | Optional. Aliases that must match capitals exactly. Use these for short words that are also normal English: `Go`, `R`, `REST`, `Excel`, `Tally`, `Word`. |
| `context` | Optional, `true` or leave it out. When true, the `cased` aliases only count if another skill is found within 60 characters. "Tally and GST" counts. "Tally the numbers" does not. |
| `not` | Optional. Lowercase phrases that cancel this skill where they appear, like `go getter` or `audit logs`. |
| `bridge` | Optional, `true` or leave it out. The skill carries over to tech (Excel, SQL, communication, problem solving). Shown on the switch-to-tech card. |
| `retired` | Optional. `true` stops the X-ray looking for it, but old links that contain it still work. **Retire, never delete.** |

Rules the engine already follows, so you do not need aliases for them:
- Whole words only. `java` never matches inside "JavaScript".
- The longest match wins. "React Native" beats "React". "Creative problem solving" beats "Problem solving".
- "C" is never read inside "C++" or "C#", and "R" is never read inside "R&D".
- Web links and email addresses are ignored. "B.Com" is not a web address.

Every alias can belong to only one skill. The check fails if two skills share an alias.

## Combos (`combos.js`)

Stack names that mean several skills at once. `mern` finds MongoDB, Express.js, React and Node.js.

| Field | What it is |
|---|---|
| `id` | Lowercase letters or digits. |
| `aliases` | Lowercase ways the stack is written. Avoid normal words: use `mean stack`, never `mean`. |
| `skills` | The skill ids it stands for, in order. At least 2. |

## Programs (`programs.js`)

| Field | What it is |
|---|---|
| `id` | Lowercase letters or digits. Listed in `config.programs` to switch it on. |
| `name` | The full program name. Must start with "Certification Program in". Never shortened anywhere in the app. |
| `page` | The program's page on wrench-wise.com, or `""` to use the main website. |
| `covers` | Job skill ids this program teaches. **Only skills in the published syllabus, never soft skills.** An instructor must sign off any change. |
| `retired` | Optional. `true` stops recommending it. |

How the app picks a program on a tech post: the one that covers the most of the missing job skills. If two tie, the role's preferred program wins. If they still tie, the one covering more of all the post's job skills. Then the order in `config.programs`.

## Roles (`roles.js`)

| Field | What it is |
|---|---|
| `id` | Lowercase letters or digits. Links carry it, so never change it. |
| `name` | For example "Data Analyst". Shown as "Looks like a Data Analyst job". |
| `article` | Optional. `"an"` if the name starts with a vowel sound, like "Accounts Executive" or "HR Recruiter". Default `"a"`. |
| `track` | `tech` or `nontech`. Tech posts get the program card. Non-tech posts get the switch-to-tech card. |
| `core` | At least 5 job skill ids typical of this role. Never soft skills. |
| `program` | Tech roles: the preferred program for ties, or `null`. Non-tech roles: the program on the switch card, or `null` to use `config.switchProgram`. |
| `switchWhy` | Non-tech roles only. One or two plain sentences on why that program is a good next step. Only claims the syllabus backs up. |

The role with the most core skills found wins, if it has at least `config.limits.minRoleHits`. Ties go to the role higher in the list. The person can always change the role.

## Also asks for (`requirements.js`)

Things a post asks for that are not skills: experience, education, job type, work mode, location, joining, languages, certifications and other conditions. They are shown, never ticked and never scored.

| Field | What it is |
|---|---|
| `REQ_TYPES` | The headings, in the order they are shown. `exp` and `notice` must exist: the engine fills them from numbers. |
| `id` | 1 to 12 lowercase letters or digits. Unique across all requirements. |
| `type` | One of the `REQ_TYPES` ids. |
| `name` | Shown in the list, like "B.E. or B.Tech". |
| `aliases`, `cased`, `context`, `not` | Exactly as for skills. |

Years of experience ("0 to 2 years", "3+ yrs", "minimum 2 years") and notice periods ("notice period: 30 days") are read by `js/engine/requirements.js`, so they are not listed here. Its rules are at the top of that file.

## Samples (`samples.js`)

| Field | What it is |
|---|---|
| `id` | `s` and a number, like `s12`. |
| `title` | Shown on the "Try a sample" chip. `config.samplesOnHome` picks which chips show. |
| `role` | The role id the X-ray must guess for this post. |
| `text` | The job post. Written by us, never copied from a real company. |
| `expected` | Exactly the skill ids the X-ray must find, in order (job and soft skills together). |
| `expectedReqs` | Exactly the "Also asks for" keys it must find, in order, like `exp:0-2y` or `edu:btech`. |
| `demoHave` | The skills demo mode ticks as "I have this". |

If the check prints something different from `expected` or `expectedReqs`, decide which is right before changing the sample.

## Writing rules

- Plain English. No emojis. No long dashes.
- Never use: guarantee, placement, salary, lakh, "get hired", "seats left", useless, or anything that mocks the reader.
- When a real job post is read wrongly, add that sentence to `tools/cases.js` with the right answer, fix the alias, and run the check.
