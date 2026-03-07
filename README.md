# Komandro CCIT-FTUI Website

A multipage static website for Komandro CCIT-FTUI (Komunitas Android) built with Astro and Tailwind CSS.

## Tech Stack

- **Framework:** Astro (Static Site Generation)
- **Styling:** Tailwind CSS with Typography plugin
- **Content:** MDX and Astro Content Collections
- **Data:** JSON files with JSON Schema validation
- **Maps:** Google Maps Embed API

## Project Structure

```
src/
├── components/          # Reusable Astro components
│   ├── AlumniCard.astro
│   └── Navbar.astro
├── content/            # Astro Content Collections
│   ├── blog/          # Blog posts (MDX)
│   │   ├── welcome-2024.md
│   │   └── tips-learning-android.md
│   └── materials/     # Learning materials (MDX) - Hierarchical structure
│       ├── mobile/
│       │   ├── flutter-2026/          # Curriculum folder
│       │   │   ├── index.mdx          # Curriculum metadata
│       │   │   ├── 01-installation.mdx
│       │   │   └── 02-hello-world.mdx
│       │   ├── jetpack-compose-tips.mdx   # Standalone article
│       │   └── architecture-patterns.mdx  # Standalone article
│       ├── backend/
│       ├── frontend/
│       ├── ui-ux/
│       └── devops/
├── data/
│   └── alumni/       # Alumni JSON data files
│       ├── schema.json  # JSON Schema definition
│       ├── 2015.json    # Alumni batch 2015
│       ├── 2023.json    # Alumni batch 2023
│       └── 2024.json    # Alumni batch 2024
├── layouts/          # Page layouts
│   └── Layout.astro
├── pages/           # Page routes
│   ├── alumni/
│   │   ├── index.astro              # Alumni directory (year grid)
│   │   └── [year].astro             # Dynamic alumni pages per year
│   ├── blog/
│   │   ├── index.astro              # Blog listing page
│   │   └── [...slug].astro          # Individual blog post pages
│   ├── material/
│   │   ├── [category]/
│   │   │   ├── index.astro          # Category listing (curriculums + articles)
│   │   │   ├── [curriculum]/
│   │   │   │   ├── index.astro      # Curriculum detail page
│   │   │   │   └── [lesson].astro   # Individual lesson pages
│   │   │   └── [slug].astro         # Standalone article pages
│   │   └── index.astro              # Materials categories overview
│   ├── showcase.astro               # Project showcase page
│   ├── about.astro                  # About page with location map
│   └── index.astro                  # Home page with stats and location
└── styles/          # Global styles

public/
├── images/
│   ├── alumni/      # Alumni photos
│   └── showcase/    # Showcase project images
└── favicon.svg
```

## Features

### Pages
- **Home Page:** Hero section, impact stats, location map, achievement highlights
- **About Page:** History since 2015, organizational structure, location map
- **Alumni Directory:** Grid of batch years (2015-2024) with dynamic routing
- **Materials:** 
  - Category-based organization (Mobile, Backend, Frontend, UI/UX, DevOps)
  - Structured curriculums with sequential lessons
  - Standalone articles and guides
- **Blog:** Content collections for articles and updates
- **Showcase:** Project showcase from alumni (Design & Code categories)

### Materials System
- **Curriculums:** Multi-lesson learning paths (e.g., Flutter 2026)
  - Index page with metadata
  - Sequential lessons with order field
  - Progress tracking support
- **Standalone Articles:** Single-topic learning materials
- **Categories:** Mobile Development, Backend, Frontend, UI/UX, DevOps

### Alumni System
- JSON-based data with schema validation
- Batch years from 2015 to current year
- Photo display with consent management
- Role-based sorting (Ketua, Wakil Ketua, etc.)

### Study Turtle Integration
- Alumni organization mention on alumni page
- Mentoring and career development programs

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This site is configured for GitHub Pages deployment. The static build is output to the `dist/` directory.

## Content Management

### Adding a Curriculum
1. Create folder: `src/content/materials/[category]/[curriculum-name]/`
2. Add `index.mdx` with curriculum metadata (type: curriculum)
3. Add lesson files: `01-lesson-name.mdx`, `02-lesson-name.mdx`, etc.
4. Set `order` field in frontmatter for lesson sequencing

### Adding a Standalone Article
1. Create file: `src/content/materials/[category]/[article-name].mdx`
2. Set appropriate category and difficulty in frontmatter

### Adding a Blog Post
1. Create file: `src/content/blog/[post-name].mdx`
2. Set title, description, author, date, and tags in frontmatter

### Adding Alumni Data
1. Edit or create JSON file: `src/data/alumni/[year].json`
2. Follow schema defined in `src/data/alumni/schema.json`
3. Include required fields: id, name, role, batch, consent

### Adding Showcase Projects
1. Edit `src/pages/showcase.astro`
2. Add project object to `projects` array
3. Set type as 'design' (Figma) or 'code' (GitHub)
4. Include title, description (~160 chars), URL, author, batch
