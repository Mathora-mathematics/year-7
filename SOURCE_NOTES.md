# Source alignment notes

The website was built from the supplied materials:

- `Year 7 SoW 2026-2027 (1).xlsx`
- `Cambridge Checkpoint Mathematics Coursebook Stage 7.pdf`
- `Cambridge Checkpoint Mathematics Coursebook Stage 8 (1).pdf`
- New English School logo supplied in the conversation

The lesson titles, curriculum objectives and order follow the school scheme of work. Stage 7 material is treated as the secure foundation; Stage 8 material is intentionally used to raise the ceiling for the able Year 7 set, particularly in the second worked example and in the middle section of independent practice. The final practice section is a synthesis/reasoning layer.

The site does **not** redistribute the source textbooks. It contains adapted lesson content and source references only.


## Actual textbook integration — 23 September 2026

The current source pack was rechecked directly against:
- `Year 7 SoW 2026-2027 (1).xlsx`
- `Cambridge Checkpoint Mathematics Coursebook Stage 7.pdf`
- `Cambridge Checkpoint Mathematics Coursebook Stage 8 (1).pdf`

Every one of the 70 website lessons now has an explicit Stage 7 and Stage 8 printed-page mapping in `data/textbook-map.js`. The mapping follows the school SOW references first; where the SOW does not name a specific coursebook section, the nearest relevant Stage 7 foundation and Stage 8 stretch pages are used.

The public repository deliberately does **not** redistribute the full coursebook PDFs. The teacher loads the two supplied PDFs locally through the **Textbooks** control. PDF.js renders the mapped page on-device, and the lesson automatically detects/crops the worked-example region while retaining a button to open the complete mapped page for context.

This means the classroom lesson can show the actual source-book example/diagram while keeping the full copyrighted source files off the public GitHub Pages deployment.
