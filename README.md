# NES Mathematics — Year 7 interactive lesson site

A static, GitHub Pages-ready mathematics lesson website for New English School.

## What is included

- **70 Year 7 lessons**, one for every lesson title in the supplied 2026–27 Year 7 scheme of work.
- Every lesson is mapped to an **actual Stage 7 page and Stage 8 page** from the supplied Cambridge Checkpoint coursebooks.
- Content alignment from the supplied **Cambridge Checkpoint Mathematics Coursebook Stage 7** and **Stage 8**.
- Each lesson contains:
  - editorial/minimal cover
  - 4-question retrieval starter
  - 2 explicit teaching / learning-content slides
  - a Stage 7 → Stage 8 source/progression slide
  - an **actual Stage 7 textbook page/excerpt slide** and **actual Stage 8 textbook page/excerpt slide** rendered from the teacher's local PDFs
  - 3 worked examples (Stage 7 foundation, Stage 8 stretch, reasoning synthesis)
  - 24 progressive independent-practice questions, including context, reverse, error-analysis and open reasoning
  - 14 homework questions with matched fluency, application and reasoning
  - full starter, example, practice and homework solutions
- SVG mathematics diagrams and visual models with multiple variants across examples, including geometry, coordinates, statistics, probability, FDP, area and constructions.
- Reveal/hide **individual solutions** beside each question or reveal all answers globally.
- Full-screen slide presentation.
- Keyboard navigation and touch/swipe navigation.
- Built-in on-screen teacher whiteboard.
- **Write directly on every teacher working grid** with pen, colour, undo and clear controls; Apple Pencil / stylus input works through pointer events.
- Slide overview.
- Print / Save as PDF through the browser.
- Search and unit filters on the home page.
- Responsive layout for laptops, classroom displays and tablets.
- No npm build step: this is plain HTML, CSS and JavaScript.

## Upload to GitHub Pages

1. Create a new GitHub repository, for example `nes-maths`.
2. Unzip this folder.
3. Upload **the contents of this folder** to the repository root. `index.html` should sit at the top level of the repository.
4. In GitHub open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Choose your main branch and the **/(root)** folder, then save.
7. GitHub will publish the site at a URL such as `https://YOUR-USERNAME.github.io/nes-maths/`.

The site uses hash-based lesson URLs such as `#/lesson/38/5`, which work cleanly on GitHub Pages without a server-side router.

## Load the two textbooks once

Because this repository is public, the full copyrighted coursebook PDFs are **not uploaded to GitHub**. Instead, click **Textbooks** on the home page and choose the supplied Stage 7 and Stage 8 PDFs. They are stored locally in IndexedDB on that browser/device.

Every lesson then renders the correct mapped source page and automatically crops the worked-example region. The teacher can also open the full mapped page from the lesson.

## Teacher controls

- **← / →** — previous / next slide
- **A** — show or hide answers
- **B** — open the teacher whiteboard
- **O** — open slide overview
- **Home / End** — first / final slide
- **Esc** — return to the lesson library, or close an overlay
- **Print icon** — print or save the lesson as a PDF
- **Textbooks** — load/replace the Stage 7 and Stage 8 coursebook PDFs
- **Pen on a worked-example grid** — write directly in the squared working area; choose black/blue/red, undo or clear

## File structure

```text
NES_Year7_Maths_Website/
├── index.html
├── 404.html
├── .nojekyll
├── manifest.webmanifest
├── sw.js
├── README.md
├── assets/
│   ├── css/
│   │   └── site.css
│   ├── images/
│   │   ├── nes-logo.png
│   │   └── favicon.svg
│   └── js/
│       ├── app.js
│       ├── diagrams.js
│       ├── diagram-upgrades.js
│       └── textbooks.js
└── data/
    ├── lessons.js
    ├── textbook-map.js
    └── source-alignment.json
```

## Adding future year groups

The site is intentionally data-driven. The lesson player is reusable. For Year 8, 9, 10 or KS5, create a matching lesson data file using the same lesson object structure, then add a year selector to the home page. `diagrams.js` can also be expanded with A-level diagrams, mechanics force diagrams, statistics distributions, vectors, calculus visuals and so on.

## Content source note

The lesson sequence and objectives are aligned to the supplied school scheme of work. The Stage 7 and Stage 8 coursebooks are used as the content spine and source of exercise structure. The web lessons use adapted/reworked teaching examples and question sets, and can render the **actual mapped textbook page locally** from the teacher's supplied PDFs. The PDFs themselves are never published by the site. The source alignment for every lesson is stored in `data/source-alignment.json` and is also shown inside each lesson.

## Design note

The design deliberately uses a restrained editorial style: warm white, black, fine rules, controlled NES cyan accents, serif display typography, generous white space and minimal interface chrome. The diagrams are SVG so they stay sharp on classroom projectors and high-resolution displays.
