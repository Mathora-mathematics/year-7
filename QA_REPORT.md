# QA report

Static validation performed before packaging:

- **PASS** — Lessons: 70/70
- **PASS** — All have 4 starters: 70/70
- **PASS** — All have 2 learning-content slides: 70/70
- **PASS** — All have 3 examples: 70/70
- **PASS** — All have 20 practice questions: 70/70
- **PASS** — All have 12 homework questions: 70/70
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
