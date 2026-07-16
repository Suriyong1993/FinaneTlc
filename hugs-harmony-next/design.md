# Design — ระบบการเงินคริสตจักรชีวิตสุขสันต์กาฬสินธุ์

Locked design system. Future Hallmark runs read this file first; pages defer
to it. Amend intentionally — the file is the rule.

## System
- Genre · editorial (warm editorial)
- Macrostructure · Application Shell (sidebar + dashboard)
- Theme · catalog Garden
- Axes · light / geometric-sans / warm (accent hue 45°)
- Tone · soft — อบอุ่น น่าเชื่อถือ สง่าแบบคริสตจักร

## Tokens (canonical · `tokens.css` is the source of truth)
```css
:root {
  /* Paper — warm oat cream, never pure white */
  --color-paper:      oklch(97.5% 0.010 80);
  --color-paper-2:    oklch(95% 0.012 80);
  --color-paper-3:    oklch(91% 0.014 78);

  /* Ink — warm dark, never pure black */
  --color-ink:        oklch(18% 0.015 60);
  --color-ink-2:      oklch(40% 0.012 70);
  --color-muted:      oklch(48% 0.012 72);

  /* Rules */
  --color-rule:       oklch(87% 0.012 80);
  --color-rule-2:     oklch(80% 0.010 78);

  /* Accent — burnt amber */
  --color-accent:     oklch(58% 0.175 45);
  --color-accent-2:   oklch(48% 0.17 42);
  --color-accent-ink: oklch(98% 0.005 80);
  --color-accent-bg:  oklch(95% 0.025 70);

  /* Focus ring */
  --color-focus:      oklch(58% 0.19 50);

  /* Semantic */
  --color-positive:   oklch(48% 0.15 160);
  --color-negative:   oklch(42% 0.16 25);
  --color-info:       oklch(42% 0.12 265);

  /* Sidebar (dark surface) */
  --color-sidebar-bg:          oklch(16% 0.012 60);
  --color-sidebar-active-text: oklch(82% 0.14 80);

  /* Typography */
  --font-sans:  "Inter", "Sarabun", ui-sans-serif, system-ui, sans-serif;
  --font-mono:  "JetBrains Mono", "Fira Code", ui-monospace, monospace;

  /* Type scale — major third (1.25) */
  --text-xs:    0.75rem;
  --text-sm:    0.8125rem;
  --text-base:  1rem;
  --text-lg:    1.25rem;
  --text-xl:    1.563rem;
  --text-2xl:   1.953rem;
  --text-3xl:   2.441rem;
  --text-display-s: clamp(2rem, 3.5vw, 2.8rem);
  --text-display:   clamp(2.2rem, 5vw, 3.6rem);

  /* Spacing — 4pt scale */
  --space-3xs: 0.125rem; --space-2xs: 0.25rem;  --space-xs:  0.5rem;
  --space-sm:  0.75rem;  --space-md:  1rem;      --space-lg:  1.5rem;
  --space-xl:  2.5rem;   --space-2xl: 4rem;      --space-3xl: 6rem;

  /* Radius */
  --radius-sm: 6px;  --radius-md: 10px;  --radius-lg: 14px;  --radius-xl: 18px;

  /* Easings */
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:     cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  /* Durations (Garden: 1.2× scale) */
  --dur-micro:  144ms;  --dur-short: 264ms;  --dur-long: 504ms;

  /* Z-index */
  --z-base: 1; --z-raised: 10; --z-dropdown: 100;
  --z-sticky: 200; --z-modal: 400; --z-toast: 500; --z-tooltip: 600;
}
```

## CTA voice
- Primary · accent fill (`--color-accent`) · radius-sm (6px) · 8px/16px padding
- Secondary · hairline outline (`--color-rule`) · same radius
- Danger · negative fill (`--color-negative`) · same radius

All buttons: 8-state discipline (default · hover · focus-visible · active · disabled · loading · error · success). Focus rings appear instantly (`:focus-visible` only), 2px solid, ≥ 3:1 contrast. Hit targets ≥ 36px.

## Motion stance
- Garden theme — gentle, springs welcome (1.2× duration scale)
- Page entrance: single fade-in + translateY(4px → 0), 264ms ease-out
- Button hover: translateY(-1px) + colour shift, 144ms ease-out
- Button active: translateY(0) press-down
- Sidebar icon opacity crossfade: 144ms
- Reduced-motion fallback · ≤150ms opacity crossfade on everything

## Notes
- Backward-compat `--c-*` aliases in `app/globals.css` :root map to Hallmark
  tokens — existing components keep working without changes.
- Font stack preserved: Inter (Latin) + Sarabun (Thai) via next/font/google.
- Paper grain overlay (SVG turbulence noise at 1.6% opacity) sits at `--z-tooltip`.
- Sidebar is dark surface (`--color-sidebar-bg`), content area is light paper.
- `overflow-x: clip` on html/body prevents horizontal scroll on mobile.
- `.btn-*` classes live in globals.css; Tailwind utility classes used alongside.

## Exports
`tokens.css` (in this project) is the source of truth. For Tailwind v4
`@theme`, DTCG `tokens.json`, or shadcn/ui CSS variables, ask *"extend
design.md with Tailwind exports"* (or the format you want) — Hallmark will
append them per [`export-formats.md`](references/export-formats.md).
