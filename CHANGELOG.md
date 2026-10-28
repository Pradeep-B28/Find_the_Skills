# Changelog

All notable changes to Job Post X-Ray are documented in this file.

---

## [1.0.0] - 2026-10-28

Initial production release of Job Post X-Ray by Wrench Wise.

### Added
- **Matching Engine**: Client-side regex engine supporting 332 active skills, 1,901 skill aliases, 4 compound skills, and 25 career roles across tech and non-tech tracks.
- **Rule Engine**:
  - Exact whole-word boundary matching to prevent partial false positives.
  - Longest-match prioritization so compound tokens take precedence.
  - Context lookaround windows for ambiguous short names (Go, R, Tally).
- **Requirements Parser**: Extracts years of experience ranges, degrees, locations, and certifications into structured requirements.
- **Visual X-Ray Scanner**:
  - Real-time animated scanning beam moving through the job text film strip.
  - Interactive highlights for tech skills, soft skills, and requirements.
  - Real-time skill counter and beam audio feedback.
- **Interactive Checklist**:
  - Tap-to-tick interface to mark existing skills.
  - Live percentage match calculation with SVG ring animation.
  - Gap analysis identifying missing skills and bridge recommendations.
- **Program and Career Switch Recommendation**:
  - Automated mapping of skill gaps to Wrench Wise cohorts (SDE, FSD, AI/ML, GenAI).
  - Domain bridge paths for non-tech professionals transitioning into tech.
  - Direct WhatsApp advisory integration with pre-filled enquiry message.
- **Social Sharing and Comparison**:
  - Canvas-rendered share cards for WhatsApp Status (9:16) and social feeds (4:5).
  - Privacy-preserving compare links carrying only skill IDs (`?s=...`) without exposing user job post text.
  - Head-to-head comparison banner for visitors opening shared links.
- **Accessibility and Theme**:
  - Full keyboard navigation and visible focus states.
  - ARIA live announcements for screen readers.
  - Light and dark themes with system preference detection and header toggle.
  - Reduced motion mode respecting system preferences.
- **Testing and Presenter Tools**:
  - In-browser automated test runner (`?test=1`).
  - Terminal content verification script (`tools/verify-content.mjs`).
  - CLI unit tests (`js/selftest.js`).
  - Automated demo mode for sample roles (`?demo=1`).
  - Presenter mode for live workshops and webinars (`?present=1`).
