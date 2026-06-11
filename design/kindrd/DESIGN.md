---
name: Kindrd
colors:
  surface: '#fff8f4'
  surface-dim: '#e0d9d3'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2ed'
  surface-container: '#f4ece7'
  surface-container-high: '#efe7e1'
  surface-container-highest: '#e9e1dc'
  on-surface: '#1e1b18'
  on-surface-variant: '#5b4138'
  inverse-surface: '#33302c'
  inverse-on-surface: '#f7efea'
  outline: '#8f7066'
  outline-variant: '#e3bfb3'
  surface-tint: '#aa3600'
  primary: '#a63500'
  on-primary: '#ffffff'
  primary-container: '#d04400'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59c'
  secondary: '#1b6c42'
  on-secondary: '#ffffff'
  secondary-container: '#a5f4bf'
  on-secondary-container: '#237248'
  tertiary: '#645a52'
  on-tertiary: '#ffffff'
  tertiary-container: '#7d736a'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#822800'
  secondary-fixed: '#a5f4bf'
  secondary-fixed-dim: '#8ad7a4'
  on-secondary-fixed: '#00210f'
  on-secondary-fixed-variant: '#00522e'
  tertiary-fixed: '#eee0d5'
  tertiary-fixed-dim: '#d1c4ba'
  on-tertiary-fixed: '#211a14'
  on-tertiary-fixed-variant: '#4e453d'
  background: '#fff8f4'
  on-background: '#1e1b18'
  surface-variant: '#e9e1dc'
typography:
  display-hero:
    fontFamily: Fraunces
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Fraunces
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Fraunces
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style

The design system for this platform is built on the philosophy of "Warm Humanism." It seeks to bridge the gap between digital efficiency and the tactile, trustworthy nature of a physical community noticeboard. The target audience consists of individuals looking for intentional, high-quality social connections, moving away from the gamified nature of traditional matchmaking apps.

The design style is **Modern Organic**. It prioritizes high-quality serif typography, generous whitespace, and a palette derived from natural materials (paper, ink, and clay). The emotional response should be one of safety, groundedness, and genuine invitation. Elements feel curated rather than manufactured, utilizing subtle paper-like textures and soft, purposeful strokes to create a sense of place.

## Colors

The palette is anchored by a warm, off-white background that reduces eye strain and avoids the clinical feel of pure white. 

- **Primary (Burnt Orange):** Used for call-to-actions, primary brand moments, and high-energy touchpoints. It represents the "spark" of connection.
- **Secondary (Green):** Reserved for success states, available slots, and growth-related community indicators.
- **Ink & Muted:** Headings use a deep, near-black ink for maximum legibility, while secondary text uses a warm grey-brown to maintain the "grounded" aesthetic.
- **Surface & Border:** Surfaces are pure white to create subtle lift against the off-white background, defined by soft, low-contrast borders.

## Typography

This design system employs a sophisticated typographic hierarchy that balances editorial character with functional clarity.

- **Fraunces** is the voice of the brand. It should be used in its Soft Italic variant for headlines to emphasize the "human" and "crafted" nature of the community.
- **Inter** provides a neutral, highly-legible counterpoint for all functional UI, descriptions, and user-generated body text.
- **JetBrains Mono** is used sparingly for metadata, tags, and slot counts, providing a systematic, "organized" feel that mimics the stamped or typed labels on a noticeboard.

## Layout & Spacing

The layout follows a **8px square grid system** to ensure mathematical harmony across all components.

- **Grid Model:** A 12-column fluid grid is used for desktop, scaling down to a 4-column grid for mobile.
- **Margins:** Desktop views utilize wide "safe areas" (min 80px) to maintain a centered, editorial feel. Mobile views use a 24px side margin to ensure content doesn't feel cramped.
- **Rhythm:** Vertical rhythm is maintained by using 16px (md) or 24px (lg) spacing between related content blocks, and 48px (xxl) between major sections.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and physical metaphors rather than aggressive shadows.

1.  **Level 0 (Base):** The #F7F4EF background.
2.  **Level 1 (Surface):** White cards (#FFFFFF) with a 1px border (#E5DED4). These appear "resting" on the background.
3.  **Level 2 (Interactive):** Upon hover or focus, cards may gain a very soft, diffused ambient shadow (10% opacity Ink color) with a 4px blur, suggesting a slight lift.

Avoid using backdrop blurs or heavy gradients. The depth should feel like layers of thick paper or cardstock.

## Shapes

The shape language is "Softly Geometric." While the grid is rigid, the corners are eased to maintain the approachable brand personality.

- **Standard (md):** 12px. Used for activity cards, main content containers, and large buttons.
- **Small (sm):** 6px. Used for input fields, nested elements, and small buttons.
- **Large (lg):** 20px. Reserved for featured "Hero" cards or prominent modal containers.
- **Pill:** Fully rounded edges are reserved exclusively for JetBrains Mono tags and category pills.

## Components

### Activity Cards (Signature Element)
The primary component of the design system.
- **Structure:** White surface with a 12px radius.
- **Left Edge:** A 6px vertical solid stripe of color (Accent for social, Green for active, or Tonal Grey for past).
- **Header:** Large Fraunces Soft Italic title (headline-md).
- **Indicators:** Segmented "Slot" indicators using small 8x8px squares (filled Green for occupied, outlined for empty).

### Buttons
- **Primary:** Burnt Orange background, White text, 12px radius. No gradient.
- **Secondary:** Accent Soft (#FFF0E8) background with Burnt Orange text.
- **Tertiary/Ghost:** No background, Ink text with a bottom underline.

### Tags & Pills
- **Style:** JetBrains Mono text inside a pill-shaped container.
- **Color:** Light grey (#E5DED4) background with Muted (#7A7067) text.

### Inputs
- **Field:** White background with #E5DED4 border. 6px radius.
- **Focus:** Border changes to #E8500A with a 1px solid weight.
- **Label:** Inter Medium, 14px, Ink color.

### Lists
- Clean, un-bordered lists with 16px padding and a subtle horizontal separator (#E5DED4) between items. Use Fraunces for list item titles to maintain the editorial feel.