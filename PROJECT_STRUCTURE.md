komandro-website/
├── README.md
├── agent.md
├── astro.config.mjs
├── package.json
├── tailwind.config.cjs
├── public/
│   └── images/
│       ├── alumni/
│       │   └── (Alumni photos storage)
│       └── showcase/
│           └── (Showcase project images)
├── src/
│   ├── components/
│   │   ├── AlumniCard.astro       # Reusable alumni card component
│   │   └── Navbar.astro           # Navigation bar with mobile menu
│   ├── content/
│   │   ├── blog/
│   │   │   ├── welcome-2024.md
│   │   │   └── tips-learning-android.md
│   │   └── materials/             # Hierarchical structure for learning materials
│   │       ├── mobile/
│   │       │   ├── flutter-2026/          # Curriculum folder
│   │       │   │   ├── index.mdx          # Curriculum index with metadata
│   │       │   │   ├── 01-installation.mdx
│   │       │   │   └── 02-hello-world.mdx
│   │       │   ├── jetpack-compose-tips.mdx   # Standalone article
│   │       │   └── architecture-patterns.mdx  # Standalone article
│   │       ├── backend/
│   │       ├── frontend/
│   │       ├── ui-ux/
│   │       └── devops/
│   ├── data/
│   │   └── alumni/
│   │       ├── schema.json        # JSON Schema for alumni data validation
│   │       ├── 2015.json          # Alumni batch 2015
│   │       ├── 2023.json          # Alumni batch 2023
│   │       └── 2024.json          # Alumni batch 2024
│   ├── layouts/
│   │   └── Layout.astro           # Base layout component with Navbar
│   ├── pages/
│   │   ├── alumni/
│   │   │   ├── index.astro        # Alumni directory (year grid + Study Turtle info)
│   │   │   └── [year].astro       # Dynamic alumni pages per year
│   │   ├── blog/
│   │   │   ├── index.astro        # Blog listing page
│   │   │   └── [...slug].astro    # Individual blog post pages
│   │   ├── material/
│   │   │   ├── [category]/
│   │   │   │   ├── index.astro              # Category listing (curriculums grid + articles grid)
│   │   │   │   ├── [curriculum]/
│   │   │   │   │   ├── index.astro          # Curriculum detail with lessons list
│   │   │   │   │   └── [lesson].astro       # Individual lesson pages
│   │   │   │   └── [slug].astro             # Standalone article pages
│   │   │   └── index.astro                  # Materials categories overview (5 cards)
│   │   ├── showcase.astro         # Project showcase (Design + Code)
│   │   ├── about.astro            # About page with timeline, team, location map
│   │   └── index.astro            # Home page with hero, stats, achievements, location map
│   └── styles/
│       └── (Global styles if needed)
└── dist/                          # Build output (generated)

ARCHITECTURE SUMMARY:

1. ROUTING STRUCTURE:
   Static routes:
   - /                    # Home with stats and location
   - /about              # About with timeline and location
   - /alumni             # Alumni directory with Study Turtle info
   - /material           # Materials categories overview
   - /blog               # Blog listing
   - /showcase           # Project showcase
   
   Dynamic routes:
   - /alumni/[year]                    # Batch alumni pages
   - /material/[category]              # Category listing
   - /material/[category]/[curriculum] # Curriculum detail
   - /material/[category]/[curriculum]/[lesson] # Lesson pages
   - /material/[category]/[slug]       # Standalone articles
   - /blog/[...slug]                   # Blog posts

2. CONTENT HIERARCHY:
   Materials:
   ├── Category (mobile, backend, frontend, ui-ux, devops)
   │   ├── Curriculums (type: curriculum)
   │   │   ├── index.mdx (metadata)
   │   │   └── [order]-[lesson].mdx (lessons)
   │   └── Standalone Articles (type: article)
   │       └── [article-name].mdx
   
   Blog:
   └── [post-name].mdx

3. DATA SOURCES:
   - Alumni: JSON files in src/data/alumni/ with JSON Schema validation
   - Materials: MDX files in src/content/materials/ with hierarchical structure
   - Blog: MDX files in src/content/blog/
   - Showcase: Hardcoded array in src/pages/showcase.astro

4. KEY FEATURES:
   - Materials: Two-tier system (Curriculums + Standalone Articles)
   - Curriculums: Sequential lessons with order field, index page with metadata
   - Articles: Single-file learning materials
   - Alumni: JSON-based with batch years 2015-2024
   - Showcase: Design (Figma) and Code (GitHub) project cards
   - Location: Google Maps embed on Home and About pages
   - Study Turtle: Alumni organization mention

5. STYLING:
   - Tailwind CSS for all styling
   - Typography plugin for markdown content
   - Primary color: #4CAF50 (Android Green)
   - Secondary: #3DDC84 (Light Green)
   - Background: bg-slate-50 (Soft off-white)
   - Font: Inter

6. NAVIGATION:
   - Navbar component with 6 links: Home, About, Alumni, Materials, Blog, Showcase
   - Mobile-responsive hamburger menu
   - Active state highlighting
   - "Back to Home" links on sub-pages

7. BUILD OUTPUT:
   - Static HTML files
   - Ready for GitHub Pages deployment
   - Configured via astro.config.mjs
   - 21 pages total
