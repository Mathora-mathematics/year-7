# QA report

Static validation performed before packaging:

- **PASS** — Lessons: 70/70
- **PASS** — All have 4 starters: 70/70
- **PASS** — All have 2 learning-content slides: 70/70
- **PASS** — All have 3 examples: 70/70
- **PASS target** — All have 24 practice questions after enrichment: 70/70
- **PASS target** — All have 14 homework questions after enrichment: 70/70
- **PASS** — All starter answers populated: 70/70
- **PASS** — All example answers populated: 70/70
- **PASS** — All practice answers populated: 70/70
- **PASS** — All homework answers populated: 70/70
- **PASS** — Both book sources recorded: 70/70
- **PASS** — SOW / source references recorded: 70/70

JavaScript syntax was checked with Node for `app.js`, `diagrams.js` and `data/lessons.js`.
All 70 lesson objects include the school objective, Stage 7 source, Stage 8 source, questions, answers and diagram metadata.
The construction and geometry diagrams are generated as SVG so they remain crisp on classroom displays.

The supplied coursebooks are not redistributed inside the website ZIP; the site contains adapted lesson content and source references.


## 23 September 2026 upgrade

The repository now includes automated GitHub Actions QA. The validation checks:
- JavaScript syntax for the lesson engine, base diagrams, diagram upgrades, lesson data and enrichment packs.
- 70/70 lessons present.
- 24 practice questions and 14 homework questions per lesson.
- Matching solution counts and practice-source tags.
- A contextual learning note for every lesson.
- No exact duplicate question within a lesson's practice/homework bank.

The enrichment layer was designed from the supplied Stage 7 and Stage 8 coursebook patterns: fluency, representation, contextual application, reverse problems, error spotting, explanation, comparison and open reasoning. It adapts these structures rather than redistributing textbook pages.
