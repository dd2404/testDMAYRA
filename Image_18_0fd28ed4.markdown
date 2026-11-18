---
name: Artisanal Heritage Bakery
colors:
  surface: '#fff8f6'
  surface-dim: '#e1d8d6'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2f0'
  surface-container: '#f5ecea'
  surface-container-high: '#efe6e4'
  surface-container-highest: '#e9e1df'
  on-surface: '#1e1b1a'
  on-surface-variant: '#554336'
  inverse-surface: '#342f2e'
  inverse-on-surface: '#f8efed'
  outline: '#887364'
  outline-variant: '#dbc2b0'
  surface-tint: '#904d00'
  primary: '#8d4b00'
  on-primary: '#ffffff'
  primary-container: '#b15f00'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb77d'
  secondary: '#a5345d'
  on-secondary: '#ffffff'
  secondary-container: '#ff7ba4'
  on-secondary-container: '#760b3a'
  tertiary: '#7b5500'
  on-tertiary: '#ffffff'
  tertiary-container: '#9b6b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#ffb1c5'
  on-secondary-fixed: '#3f001a'
  on-secondary-fixed-variant: '#861a45'
  tertiary-fixed: '#ffdead'
  tertiary-fixed-dim: '#fabc4d'
  on-tertiary-fixed: '#281900'
  on-tertiary-fixed-variant: '#604100'
  background: '#fff8f6'
  on-background: '#1e1b1a'
  surface-variant: '#e9e1df'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 21px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system defines an artisanal Malaysian culinary brand built on craftsmanship, heritage, and warmth. Grounded in Balik Pulau, Penang, the visual personality evokes the warmth of early-morning baking, melting pure butter, and celebratory gifting rituals. It balances traditional layered pastry heritage with a luxurious, contemporary gifting e-commerce experience.

### Core Attributes
- **Artisanal & Honest:** Generous, tactile, and sensory. Avoid sterile minimalism or cold corporate styling.
- **Warm & Indulgent:** Uses warm dairy creams, toasted crust tones, honey glazes, and deep berry accents.
- **Refined Heritage Glassmorphism:** Elegant, frosted translucent surfaces that sit over warm cream backdrops, evoking layered textures without visual clutter.
- **Mobile-First Conversational Commerce:** Tuned for WhatsApp ordering integrations, localized pickup and delivery prompts, and bite-sized trust signals.

## Colors

The palette is strictly tuned for light mode, reflecting natural daylight on artisan bakery surfaces.

### Palette Roles
- **Primary (`#D97706`):** Golden Honey Butter. Used for primary conversion actions, active states, key banners, and focal pricing points.
- **Secondary (`#831843`):** Rich Prune / Spiced Roselle Berry. Anchors festive accents, premium trust badges, artisanal stamps, and high-tier callouts.
- **Tertiary (`#E5A93C`):** Toasted Honey. Accentuates star ratings, subtle border halos, secondary micro-interactions, and highlight pills.
- **Neutral Core (`#292524`):** Warm Espresso. Delivers softer contrast than pure black for long-form reading, technical specs, and ingredient lists.
- **Canvas & Backgrounds:**
  - Base canvas: `#FAF7F2` (Warm Ivory Rice)
  - Card/Modal base surface: `#FFFDF9` (Fresh Cream)
  - Frosted overlays: `rgba(255, 253, 249, 0.82)` to `rgba(255, 255, 255, 0.90)` with border accents in `rgba(229, 169, 60, 0.22)`

## Typography

The type scale combines the editorial craftsmanship of `Playfair Display` with the legible structure of `Plus Jakarta Sans`.

- **Headlines (`Playfair Display`):** Reserved for product names, flavor notes, editorial banners, and collection titles. Use italic variants sparingly for artisan notes (e.g., *Resepi Tradisi Turun-Temurun*).
- **Body & Numerical Data (`Plus Jakarta Sans`):** Selected for high legibility on mobile viewports. Sets all pricing, delivery timelines, storage tips, and ingredient declarations.
- **Labels & Microcopy:** Kept uppercase or title case with deliberate tracking for badge pills, ensuring rapid scanning during checkout.

## Layout & Spacing

Designed mobile-first with an optimal target viewport width of `390px` to cater to mobile shoppers.

- **Mobile (Base to 640px):** 4-column fluid layout with `1rem` outer canvas margin and `1rem` gutters. Product grids default to 2 columns with tight, structured visual rhythm.
- **Tablet (641px to 1024px):** 8-column layout with `1.5rem` outer margins. Content containers max out comfortably to preserve reading legibility.
- **Desktop (1025px+):** 12-column layout capped at `1200px` max-width to retain intimacy and prevent the warm bakery aesthetic from feeling sparse.
- **Vertical Rhythm:** Consistent multi-step scale based on a `4px` grid, relying on `space-md` for internal component padding and `space-xl` for section separation.

## Elevation & Depth

Visual hierarchy uses frosted glassmorphic tiers set over butter-and-cream tonal backgrounds.

### Glassmorphic Spec
- **Standard Card Glass:**
  - Background: `rgba(255, 253, 249, 0.82)`
  - Backdrop Blur: `14px`
  - Border: `1px solid rgba(255, 255, 255, 0.7)` with inner gradient rim `rgba(229, 169, 60, 0.15)`
  - Shadow: `0 8px 24px -4px rgba(67, 36, 12, 0.06), 0 2px 6px -1px rgba(67, 36, 12, 0.03)`
- **Floating Modals & Checkout Sheets:**
  - Background: `rgba(255, 255, 255, 0.92)`
  - Backdrop Blur: `20px`
  - Shadow: `0 16px 40px -8px rgba(67, 36, 12, 0.12), 0 0 0 1px rgba(229, 169, 60, 0.2)`
- **Sticky Bottom Navigation / Action Bar:**
  - Background: `rgba(250, 247, 242, 0.88)`
  - Backdrop Blur: `16px`
  - Border Top: `1px solid rgba(229, 169, 60, 0.25)`

## Shapes

The roundedness language mirrors freshly baked goods—curved, approachable, and smooth:
- **Buttons, Form Inputs, Standard Cards:** Built at level `2` (`0.5rem` / `8px`) base radius.
- **Badges, Action Pills, and Filter Chips:** Fully rounded pill shapes (`9999px`) to emphasize artisan stamps and certification.
- **Product Card Image Frames:** `0.75rem` (`12px`) top rounding to nest into card shells naturally.

## Components

### Buttons
- **Primary (CTA / Add to Cart):** Solid `#D97706` background, crisp white `#FFFFFF` text, `0.5rem` border radius, subtle honey glow on hover/active (`box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35)`).
- **Secondary (WhatsApp Order / Direct Enquiry):** Rich burgundy `#831843` background, white text, communicates immediate personalized service.
- **Tertiary / Ghost:** Transparent base with `1px solid rgba(217, 119, 6, 0.3)`, text in `#D97706`.

### Badge Pills & Value Tags
- **Pure Butter (`Mentega Tulen`):** Background `#FEF3C7` (Warm Butter Cream), text `#92400E`, border `1px solid #FCD34D`.
- **Butter Marjerin:** Background `#F5F5F4` (Neutral Stone), text `#44403C`, border `1px solid #E7E5E4`.
- **Shelf Life (`5 Hari Suhu Bilik`):** Glassmorphic background `rgba(255, 255, 255, 0.85)`, text `#831843`, border `1px solid rgba(131, 24, 67, 0.2)`.
- **Flat Rate Delivery (`Balik Pulau RM5 Flat`):** Background `#831843`, text `#FFFDF9`, border none; conveys locality and special flat-rate convenience.

### Product Cards
- Translucent white base with `14px` backdrop-filter blur.
- High-resolution imagery framed with warm inset shadows.
- Price displayed in bold espresso (`#292524`) paired with unit indicator (`/ loaf` or `/ pack`).
- Floating top badges for recipe grade ("Pure Butter" vs "Marjerin Blend").

### Form Fields & Order Inputs
- Background: `rgba(255, 255, 255, 0.7)`.
- Inactive border: `1px solid rgba(120, 113, 108, 0.25)`.
- Active focus state: `1px solid #D97706`, with `0 0 0 3px rgba(229, 169, 60, 0.18)` focus ring.
- Labels: `label-md` in `#44403C`.

### Floating Sticky Order Bar (Mobile-Specific)
- Pinned to bottom viewport (`390px` width safe zone).
- Shows live subtotal, layer cake selection summary, and direct "Tempah Sekarang / Add to Cart" conversion button.