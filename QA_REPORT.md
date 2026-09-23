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


## Textbook integration and working-grid upgrade

- All 70 lessons now have a Stage 7 and Stage 8 printed-page mapping.
- The website reads the supplied coursebook PDFs locally in the browser using PDF.js and IndexedDB.
- The exact mapped book page is rendered inside the lesson and the worked-example region is automatically detected/cropped from the page.
- A full-page viewer is available if the teacher wants the surrounding textbook context.
- The full textbook files are not committed to the public repository.
- Worked examples now include a direct pen canvas over the squared teacher-working grid with colour, undo and clear controls.
- Detailed revealed solutions use topic-specific multi-step teaching routines rather than answer-only feedback.
- Practice is split into 4 questions per slide and solution pages are split further to maximise classroom font size.
- Automated QA validates all 70 textbook mappings as well as lesson/question/answer alignment.
