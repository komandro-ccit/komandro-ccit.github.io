---
name: Technical Precision & Community
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
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#8b501d'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffb175'
  on-tertiary-container: '#79420e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#66fea2'
  primary-fixed-dim: '#43e188'
  on-primary-fixed: '#00210e'
  on-primary-fixed-variant: '#00522b'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb781'
  on-tertiary-fixed: '#2f1400'
  on-tertiary-fixed-variant: '#6e3905'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  success-green: '#4CAF50'
  surface-border: '#E2E8F0'
  text-muted: '#64748B'
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
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system for Komandro CCIT-FTUI is rooted in a **Corporate / Modern** aesthetic that balances technical rigor with an approachable community spirit. It prioritizes clarity and functional beauty, utilizing a high-contrast light mode to ensure information density remains readable.

The visual language draws inspiration from modern developer documentation and tech-forward academic platforms. Key characteristics include:
- **Cleanliness:** Ample whitespace to reduce cognitive load during complex technical navigation.
- **Precision:** Alignment to a strict grid to reflect the engineering and programming focus of the organization.
- **Vibrancy:** Strategic use of the "Android Green" to provide energy and focus within a largely neutral environment.

## Colors
This design system employs a **High-Contrast Light** palette. The primary color, a vibrant Android green (`#3DDC84`), is reserved for interactive elements, progress indicators, and primary call-to-actions to ensure it remains impactful without overwhelming the user.

- **Primary:** Android Green for action and brand identity.
- **Secondary:** Deep Navy/Black (`#111827`) for high-contrast typography and structural elements.
- **Neutral:** A cool-toned off-white (`#F8FAFC`) for background surfaces to reduce screen glare compared to pure white.
- **Surface Tints:** Use a subtle border color (`#E2E8F0`) to define containers instead of heavy shadows.

## Typography
**Inter** is utilized exclusively to maintain a systematic and utilitarian feel. The hierarchy relies on significant weight variations (ExtraBold for titles vs. Regular for body) to guide the eye.

- **Headlines:** Use tighter letter-spacing for large displays to create a "locked-in" professional look.
- **Body:** Standardized at 16px for optimal readability. 
- **Labels:** Small caps or bold weights are used for categorizing content or "Overlines" above main headings.
- **Mobile Scaling:** Headlines scale down by approximately 25% on mobile devices to prevent awkward line breaks while maintaining impact.

## Layout & Spacing
The layout follows a **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile. 

- **Rhythm:** An 8px base unit (4, 8, 16, 24, 32, 48, 64) governs all padding and margins.
- **Hero Layout:** The modernized hero section uses a "Split-Visual" approach. Content is left-aligned with a massive `headline-xl`, while the right side is reserved for high-fidelity technical illustrations or code snippets.
- **Whitespace:** Generous vertical padding (minimum 80px between major sections) is mandatory to give the technical content "room to breathe."

## Elevation & Depth
The system uses **Low-contrast outlines** combined with **Tonal layers** to establish hierarchy.

- **Level 0 (Background):** `#F8FAFC` (Neutral).
- **Level 1 (Cards/Surface):** Pure `#FFFFFF` with a 1px solid border of `#E2E8F0`.
- **Level 2 (Interaction):** A soft, subtle shadow (`y-4, blur-12, opacity-0.05`) is applied only during hover states to indicate interactivity.
- **No Heavy Shadows:** To maintain a "clean and professional" look, avoid deep or dark shadows. Depth should feel physical but barely there.

## Shapes
The design system uses **Soft** roundedness (`0.25rem` or `4px`) for most elements.

- **Buttons & Inputs:** Use the base 4px radius for a crisp, technical look.
- **Cards:** Use `rounded-lg` (8px) to distinguish larger content containers from interactive UI components.
- **Icons:** Should follow a linear, 2px stroke weight with slight corner rounding to match the UI.

## Components
- **Buttons:** Primary buttons use a solid `#3DDC84` background with `#111827` text for maximum contrast. Secondary buttons use a ghost style with a `#E2E8F0` border.
- **Chips:** Used for programming languages or tags. Small, 12px text, semi-bold, with a background tint of the primary color at 10% opacity.
- **Input Fields:** 1px border, 12px vertical padding. Focus state switches the border color to Primary Green with a subtle outer glow.
- **Cards:** White background, 8px radius, 1px border. For "Member" or "Project" cards, use a top-aligned image followed by structured text.
- **Hero Section:** A full-width container with a minimum height of 70vh. Use a large-scale `headline-xl` and a primary CTA button that spans at least 200px in width for impact.