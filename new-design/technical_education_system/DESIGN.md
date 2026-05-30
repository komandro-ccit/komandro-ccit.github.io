---
name: Technical Education System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3c4a3f'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6c7b6e'
  outline-variant: '#bbcbbc'
  surface-tint: '#006d3b'
  primary: '#006d3b'
  on-primary: '#ffffff'
  primary-container: '#3ddc84'
  on-primary-container: '#005c31'
  inverse-primary: '#43e188'
  secondary: '#555f6f'
  on-secondary: '#ffffff'
  secondary-container: '#d6e0f3'
  on-secondary-container: '#596373'
  tertiary: '#006e1c'
  on-tertiary: '#ffffff'
  tertiary-container: '#74d873'
  on-tertiary-container: '#005d16'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#66fea2'
  primary-fixed-dim: '#43e188'
  on-primary-fixed: '#00210e'
  on-primary-fixed-variant: '#00522b'
  secondary-fixed: '#d9e3f6'
  secondary-fixed-dim: '#bdc7d9'
  on-secondary-fixed: '#121c2a'
  on-secondary-fixed-variant: '#3d4756'
  tertiary-fixed: '#94f990'
  tertiary-fixed-dim: '#78dc77'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#005313'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  slate-dark: '#1F2937'
  android-green: '#3DDC84'
  classic-green: '#4CAF50'
  surface-light: '#F8FAFC'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1120px
  gutter: 24px
---

## Brand & Style

The design system is engineered for a technical, developer-centric audience, specifically tailored for the Komandro CCIT community. The brand personality is **scholarly yet innovative**, prioritizing clarity of information above all else. It aims to evoke a sense of structured progress—transforming the complexity of code into digestible, sequential learning paths.

The chosen aesthetic is **Modern Minimalist with a focus on Systematization**. This approach utilizes heavy whitespace to reduce cognitive load during intense study sessions. The visual language draws inspiration from high-end documentation platforms and modern IDEs, emphasizing a clean, "no-nonsense" interface that allows the content—whether a standalone tutorial or a deep-dive series—to remain the primary focus.

## Colors

This design system utilizes a high-energy green palette contrasted against deep, sophisticated neutrals. 

- **Primary (#3DDC84):** A vibrant "Android Green" used for primary actions, progress indicators, and active states. It signals growth and technical proficiency.
- **Secondary (#1F2937):** A deep slate-gray used for primary typography and dark-mode surfaces. It provides the necessary weight and authority for a technical brand.
- **Tertiary (#4CAF50):** A more grounded green used for subtle accents, success states, and differentiating between "Single Material" and "Series Material" badges.
- **Neutral (#F8FAFC):** The primary canvas color. This near-white slate reduces eye strain compared to pure white, essential for long-form reading.

Color is applied functionally: use green to denote "pathway progress" and slate to denote "structural stability."

## Typography

The typography system relies exclusively on **Inter** to maintain a systematic, utilitarian feel. The hierarchy is strictly enforced to distinguish between instructional content and meta-information.

- **Headlines:** Use tight letter-spacing and heavy weights (700-800) for section titles to create strong anchors on the page.
- **Body:** Set with generous line-height (1.5x - 1.6x) to ensure legibility during long tutorials.
- **Series Labels:** Uppercase labels with slight tracking (letter-spacing) are used for "SERIES" or "TUTORIAL" tags to provide immediate context.
- **Monospaced elements:** While the UI is Inter, all code snippets and inline technical terms must revert to a standard system monospace font to preserve the developer-centric mental model.

## Layout & Spacing

The design system employs a **Fixed-Fluid Hybrid Grid**. Content is housed in a centered container with a maximum width of 1120px to prevent line lengths from becoming unreadable on ultra-wide monitors.

- **Desktop (1024px+):** 12-column grid with 24px gutters. Sidebars are used for "Series Navigation" (sticky) on the left and "Table of Contents" on the right.
- **Tablet (768px - 1023px):** 8-column grid. Sidebars collapse into an off-canvas drawer or a top-level accordion.
- **Mobile (< 767px):** 4-column grid with 16px margins.
- **Spacing Rhythm:** Based on an 8px scale. Use `lg` (48px) for vertical section spacing and `md` (24px) for component internal padding.

## Elevation & Depth

To maintain a "technical" and "clean" feel, this design system avoids heavy, muddy shadows. Instead, it uses **Tonal Layering** and **Low-Contrast Outlines**.

- **Level 0 (Background):** #F8FAFC.
- **Level 1 (Cards/Sidebar):** #FFFFFF with a 1px solid border (#E2E8F0).
- **Interactive States:** On hover, a card should not gain a heavy shadow; instead, it receives a 2px border of the primary color (#3DDC84) or a very subtle, diffused "ambient glow" (blur: 12px, opacity: 0.05).
- **Separation:** Use thin horizontal rules (#E2E8F0) to separate series chapters, maintaining a flat, architectural look.

## Shapes

The shape language is **Soft and Precise**. A consistent border-radius of 4px (Soft) is applied to all interactive elements.

- **Buttons & Inputs:** 4px radius for a crisp, professional appearance.
- **Cards:** 8px (rounded-lg) to subtly distinguish the content container from the background.
- **Progress Bars:** Fully rounded (pill) to provide a visual contrast against the otherwise rectilinear grid, emphasizing the "flow" of learning.

## Components

### Buttons
- **Primary:** Background #3DDC84, text #1F2937, bold weight. No gradient.
- **Secondary:** Transparent background, 1px border #1F2937, text #1F2937.

### Learning Cards
- **Single Material:** Features a top-aligned tag "TUTORIAL" in slate. Focus on a clear H3 title and a 2-line summary.
- **Series Material:** Features a left-border accent of #3DDC84. Displays a "Step X of Y" counter and a progress bar at the bottom of the card.

### Input Fields
- Understated style: #FFFFFF background, 1px #E2E8F0 border. Focus state switches border to #3DDC84 with a 2px thickness.

### Series Navigation (The "Path")
- A vertical stepper component. Completed steps use a solid #3DDC84 circle with a checkmark. Current step uses a hollow #3DDC84 circle. Future steps use #E2E8F0.

### Code Blocks
- Dark themed (#1F2937 background) even in light mode. Syntax highlighting should use the primary green for keywords and a soft blue for variables. Include a "Copy" button in the top-right corner.