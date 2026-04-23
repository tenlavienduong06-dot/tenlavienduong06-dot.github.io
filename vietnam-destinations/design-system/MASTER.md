# MASTER Design System
# Vietnam Destinations — Static Website

Version: 1.0.0
Author: Hai Nguyen Le
Last Updated: 2026-04-17
Description: Design System tổng hợp cho website Vietnam Destinations dành cho đối tượng quốc tế

---

## Style Profile

| Property | Value | Reasoning |
|---|---|---|
| **Style** | Motion-Driven + Glassmorphism | Interactive SVG map cần smooth animations; glass cards cho destination previews |
| **Primary Color** | `#0EA5E9` (Sky Blue) | Travel/Tourism — gợi bầu trời, biển cả, tự do |
| **Secondary Color** | `#38BDF8` (Light Sky Blue) | Gradient variation của primary |
| **CTA / Accent** | `#F97316` (Adventure Orange) | High contrast, năng động — kêu gọi khám phá |
| **Background** | `#F0F9FF` (Sky tint) | Fresh, airy feeling |
| **Text Primary** | `#0C4A6E` (Deep Ocean) | High contrast on light bg |
| **Text Secondary** | `#475569` (Slate) | Muted descriptions |
| **Border** | `#BAE6FD` (Pale Sky) | Subtle, elegant |
| **Heading Font** | Playfair Display | Elegant, editorial — gợi cảm giác khám phá |
| **Body Font** | Inter | Clean, readable cho đối tượng quốc tế |

---

## CSS Variables (Design Tokens)

```css
:root {
  /* Colors */
  --color-primary: #0EA5E9;
  --color-primary-light: #38BDF8;
  --color-primary-dark: #0284C7;
  --color-accent: #F97316;
  --color-accent-light: #FB923C;
  --color-accent-dark: #EA580C;
  
  --color-bg: #F0F9FF;
  --color-bg-white: #FFFFFF;
  --color-bg-dark: #0C4A6E;
  --color-bg-card: rgba(255, 255, 255, 0.8);
  
  --color-text-primary: #0C4A6E;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;
  --color-text-white: #FFFFFF;
  
  --color-border: #BAE6FD;
  --color-border-light: #E0F2FE;
  
  /* Region Colors */
  --color-north: #10B981;    /* Emerald - núi rừng xanh */
  --color-central: #F59E0B;  /* Amber - cát vàng Trung bộ */
  --color-south: #0EA5E9;    /* Sky - biển miền Nam */
  
  /* Typography */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */
  --font-size-6xl: 3.75rem;   /* 60px */
  
  /* Spacing (8px base) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  
  /* Border Radius */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(14, 165, 233, 0.12);
  --shadow-lg: 0 8px 32px rgba(14, 165, 233, 0.16);
  --shadow-xl: 0 20px 60px rgba(12, 74, 110, 0.2);
  --shadow-glass: 0 8px 32px rgba(14, 165, 233, 0.15);
  
  /* Glass Effect */
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-blur: blur(16px);
  --glass-border: 1px solid rgba(186, 230, 253, 0.5);
  
  /* Animation */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
  --transition-map: 600ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Layout */
  --max-width: 1280px;
  --nav-height: 72px;
}
```

---

## Typography Scale

| Token | Size | Weight | Usage |
|---|---|---|---|
| H1 | 60px / `var(--font-size-6xl)` | 700 | Hero title |
| H2 | 48px / `var(--font-size-5xl)` | 600 | Section title |
| H3 | 36px / `var(--font-size-4xl)` | 600 | Card title |
| H4 | 24px / `var(--font-size-2xl)` | 500 | Sub-section |
| Body L | 18px / `var(--font-size-lg)` | 400 | Lead text |
| Body | 16px / `var(--font-size-base)` | 400 | Body copy |
| Caption | 14px / `var(--font-size-sm)` | 400 | Meta, labels |
| Small | 12px / `var(--font-size-xs)` | 400 | Tiny labels |

---

## Page-by-Page Design Notes

### Home Page
- **Hero**: Full-viewport, ảnh panorama Việt Nam, Playfair Display headline, CTA button accent orange
- **Featured Regions**: 3 glassmorphism cards (Bắc/Trung/Nam), hover lift effect, gợi màu sắc vùng miền
- **Story Strip**: Quote about Vietnam + minimal stats (54 UNESCO sites, 3,260km coastline...)

### Destinations Page (Interactive Map)
- **Bản đồ**: SVG Việt Nam chia 3 vùng màu, hover region → glow + popup với 3 địa danh
- **Popup**: Glassmorphism card, 3 destination buttons klidnutí → navigate to detail
- **Background**: Subtle gradient mesh, animated floating elements

### Destination Detail Page  
- **Hero**: Full-width landscape ảnh + overlay gradient + tên địa danh Playfair Display
- **Content Sections**: Highlights, Best Season visual, Food & Dining cards
- **No map** (confirmed per user requirement)

### About & Contact
- Minimal, clean — không phải focus chính của site

---

## Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
```
