# Student Explainer: How Job Post X-Ray Works

Welcome! Job Post X-Ray is a clean, dependency-free web application. It parses messy job post text, extracts technical and soft skills, identifies job requirements, and calculates match percentages, all entirely inside your browser.

Here is a breakdown of what this project teaches, the core computer science concepts behind it, and how each rule is implemented.

---

## 1. What This App Teaches

1. **Text Search without Bloat**: You do not always need heavy third-party packages or server-side artificial intelligence models to understand text. Deterministic pattern matching is fast, runs offline, protects user privacy, and costs zero dollars to host.
2. **Whole-Word Matching**: Text matching must respect word boundaries. Searching for "c" or "go" as simple substrings would match almost every English sentence. Regular expressions use `\b` word boundaries to match exact tokens.
3. **Picking the Longest Match**: When multiple patterns can match the same characters, the longest one must win. If a post says "React Native", matching "React" first would misclassify the mobile framework.
4. **Context Windows**: Some words are ambiguous in English. "Go" can be a verb or a programming language. "R" can be a letter or a statistical tool. By inspecting a character window before and after the term, we confirm the presence of domain-specific cues (like "Golang", "Kubernetes", "programming", or "statistics") before counting a match.
5. **Reading Numbers with Patterns**: Human job descriptions write numbers in diverse formats: "3-5 years", "3 to 5 yrs", "5+ years", or "at least 3 years". Regular expressions with capture groups standardize these into structured minimum and maximum values.
6. **Separating Data from Code**: All skills, keywords, requirements, and course definitions live in declarative data files under `content/`. The scanning engine in `js/engine/` contains only pure algorithms. This separation allows non-programmers to update skills without breaking application logic.

---

## 2. Core Engine Rules (with Real Test Cases)

Every engine rule is proven by automated test cases in `tools/cases.js`. Here are the primary rules:

### Rule 1: Whole-Word Boundary Matching
- **Why it matters**: Short keywords like `c`, `go`, or `sql` appear inside common English words like "cat", "good", and "prerequisite".
- **Example from cases.js**:
  `"Knowledge of C/C++"` matches `["c", "cpp"]`.
  `"Grade C or above in all subjects"` matches `[]`.
- **How it works**: The regex engine checks word boundaries before and after each alias to make sure letters on either side are punctuation or spaces, not part of a longer word.

### Rule 2: Longest Match Wins
- **Why it matters**: A longer alias represents a more specific skill than a shorter substring.
- **Example from cases.js**:
  `"React Native and React"` matches `["rn", "react"]`.
- **How it works**: Before scanning, all aliases are sorted by character length in descending order. When an alias matches, the matched text range is marked so shorter sub-tokens cannot match the same characters.

### Rule 3: Context Lookaround Windows
- **Why it matters**: English words like "go", "react", "spring", or "excel" have common non-technical meanings.
- **Examples from cases.js**:
  - `"Experience with Go and Kubernetes"` matches `["go", "k8s"]`.
  - `"A go-getter attitude with Python"` matches `["motivated", "py"]` (not `go`).
  - `"We react quickly to change"` matches `[]` (not `react`).
  - `"Spring 2027 graduates can apply"` matches `[]` (not `spring`).
  - `"Advanced Excel and Power BI"` matches `["excel", "powerbi"]`.
- **How it works**: For skills marked with context requirements, the engine inspects up to 100 characters before and after the matched word. If none of the approved domain words appear within that window, the match is discarded.

### Rule 4: Combo Skill Expansion
- **Why it matters**: Job postings frequently specify industry stacks in compact acronyms such as "MERN" or "MEAN".
- **Example from cases.js**:
  `"MERN stack developer"` matches `["mongodb", "express", "react", "node"]`.
- **How it works**: Combo definitions expand a single keyword into its underlying skill components while recording the character span for visual highlighting.

### Rule 5: Negation and False Alarm Filtering
- **Why it matters**: Sentences mentioning "R&D" or "REST" should not accidentally trigger other single-letter skills.
- **Examples from cases.js**:
  - `"Our R&D team in Chennai"` matches `[]` (does not match `r`).
  - `"Work with the rest of the team"` matches `[]` (does not match `rest`).
  - `"Build REST APIs"` matches `["rest"]`.
- **How it works**: Exclusion patterns and boundary markers check for attached symbols like `&` and specific lowercase stop contexts.

### Rule 6: Experience Extraction from Patterns
- **Why it matters**: Experience requirements appear in dozens of different grammatical styles.
- **Examples from cases.js**:
  - `"0 to 2 years of experience"` matches `["exp:0-2y"]`.
  - `"Experience: 3+ years"` matches `["exp:3+y"]`.
  - `"Founded 15+ years ago"` matches `[]`.
- **How it works**: The requirements engine requires explicit employment terms (such as "experience", "yrs", or "in sales") and ignores corporate age references or degree lengths (like "4 year degree").

### Rule 7: Education and Degree Classification
- **Why it matters**: Capitalized words like "BE" could be the verb "to be" or a Bachelor of Engineering degree.
- **Examples from cases.js**:
  - `"B.E./B.Tech in CSE"` matches `["edu:btech", "edu:csdeg"]`.
  - `"MUST BE ABLE TO TRAVEL"` matches `[]` (not `edu:btech`).
- **How it works**: Single acronym degrees look for nearby degree keywords (like "in", "degree", or engineering branches) before confirming an educational requirement.

---

## 3. How the App is Built

The application architecture follows strict web fundamentals:
- **No Build Step**: It runs directly from source files using native ES module imports (`import { scan } from './engine/skills.js'`).
- **No External Libraries**: Zero dependencies in `package.json`. No frameworks, bundlers, or third-party CSS.
- **Component Separation**:
  - `content/`: Plain data files defining skills, roles, programs, and requirements.
  - `js/engine/`: Pure deterministic logic functions. They take strings or arrays and return clean JavaScript objects.
  - `js/cards/` and `js/screens/`: UI rendering functions that construct DOM nodes safely without insecure methods.
  - `js/audio.js`: Direct Web Audio API synthesis creating pleasant blips and hums using sine wave oscillators.
  - `tools/`: Automated verification scripts executed using standard Node.js.

---

## 4. Three Extension Tasks for Students

Want to practice extending this codebase? Here are three real engineering tasks:

### Task 1: Add a New Skill with a Tricky Test Case
1. Open `content/skills.js`. Pick a modern tool not yet in the list (for example, `duckdb` or `polars`).
2. Add the skill object under the appropriate group with clean lowercase aliases.
3. Open `tools/cases.js`. Add a test sentence in `CASES` testing both a positive hit and an ambiguous false positive sentence.
4. Run `node tools/verify-content.mjs`. Ensure all checks pass with 100% accuracy.

### Task 2: Split Must-Have and Good-to-Have Skills
1. Look at `js/engine/skills.js`. The scanner returns character offsets (`start`, `end`) for each match.
2. In the scan screen (`js/screens/scan.js`), scan the raw text for headings like `"Preferred Qualifications"`, `"Good to have"`, or `"Bonus points"`.
3. Separate the found skills into two arrays based on whether their start index appears before or after that heading.
4. Render two distinct pill sections in the checklist UI: "Core Requirements" and "Bonus Skills".

### Task 3: Build "Paste Your Resume" Auto-Ticking
1. On the home screen, add an optional secondary text area labeled "Paste your resume to auto-tick skills".
2. When the user clicks X-Ray, run `scan(resumeText)` in parallel with `scan(jobText)`.
3. Compare the detected skill IDs.
4. When rendering the tick screen (`js/screens/tick.js`), automatically mark any skill ID present in both lists as ticked.
5. Watch the match score update instantly without the candidate needing to click every pill manually.
