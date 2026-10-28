# Job Post X-Ray

Paste any job post. See every skill it asks for, and how many you already have.

Live application: [https://job-post-xray.vercel.app/](https://job-post-xray.vercel.app/)

---

## How to Use It

1. **Paste or pick a role**: Paste text from any job post into the box, or click one of the sample roles on the home screen.
2. **Watch the scan**: An animated scanning beam highlights technical skills, soft skills, and requirements such as experience, degrees, and locations.
3. **Tick what you know**: Select the skills you already have to get an instant match score, review your gaps, and see a direct learning path to bridge them.

---

## Running Locally

Job Post X-Ray runs on modern web standards with pure HTML, CSS, and ES modules. It requires no build tools, bundlers, or package installations.

To run locally using Python:
```bash
# Start a local static file server
python -m http.server 8085
```

Open your browser to:
```
http://localhost:8085/
```

### Running the Checks

To verify all skill rules, aliases, and sample posts:
```bash
node tools/verify-content.mjs
```

To run the automated engine self-tests in your terminal:
```bash
node js/selftest.js
```

To run all self-tests directly in your browser:
```
http://localhost:8085/?test=1
```

---

## How It Works

1. **Whole-word aliases**: The engine matches keywords using strict word boundaries. This prevents false hits, so words like "Go" do not trigger inside "Good" or "Django".
2. **Longest match wins**: Multi-word aliases take priority over single words. For example, "React Native" matches as a mobile framework rather than triggering a partial match for "React".
3. **Context words for short tokens**: Ambiguous terms such as Go, R, and Tally look for domain context words within a surrounding character window before counting as a match.
4. **Reading experience from numbers**: Regular expressions inspect number patterns to capture experience ranges, minimum years, and thresholds such as "3 to 5 years" or "5+ years".
5. **Beam timing**: The scan beam moves at a fixed reading speed across the text. Longer job descriptions take proportionally longer to scan, capped at a comfortable ceiling.
6. **Privacy-first compare links**: Shared links encode only skill identifiers, guessed role, and score in the web address. The text of the job post stays on the user device and is never sent to a server.

---

## Special URL Parameters

- `?test=1`: Runs the automated test suite in the browser.
- `?demo=1&sample=s1`: Starts automated demo mode on sample s1.
- `?present=1`: Enables presenter mode with enlarged fonts and shortcut keys (1 to 8, Enter, H, T).

---

## Built by Wrench Wise

Built by [Wrench Wise](https://wrench-wise.com/).
Practical, cohort-based tech education designed to turn engineering fundamentals into working software.
