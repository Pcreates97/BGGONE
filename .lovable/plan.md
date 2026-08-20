# Playful Background Remover — Frontend Build Plan

A single, animated, playful landing page for an open-source background remover. UI-only for now: the removal engine is a clearly-marked placeholder stub, ready to be wired up later. Focus on desktop visual polish per your note (not fully responsive yet, but no horizontal overflow).

## Project name

Temporary name **"Poof"** with a small peeling-image logo mark. Centralized in `src/config/site.ts` so you can rename in one line later.

## Visual identity

- Background `#F7F5EF`, text `#151515`
- Primary accent electric purple `#7C3AED`
- Secondary lime `#C6F24E`, supporting coral `#FF7A59`
- Thick dark borders (2–3px), large rounded corners, soft offset shadows for a "sticker/toy" feel
- Tokens added to `src/styles.css` under `@theme inline` + `:root` (oklch)
- Typography: Space Grotesk (display, heavy) + Inter (body), loaded via `<link>` in `__root.tsx`

## Page structure (single route `/`)

1. Floating playful header — Poof logo, nav (How it works, Open Source), black GitHub button
2. Hero — floating badge, giant two-line headline with one word highlighted/rotated sticker-style, subcopy, decorative floating doodles (sparkles, blobs, scissors, checkerboard fragment)
3. **Background Remover workspace** (centerpiece) — large bordered canvas with all states
4. "Seriously. It's this easy." — three big numbered steps with scroll-in stagger
5. Open-source / privacy — three feature blocks
6. Dark GitHub CTA section with animated code-pattern background
7. Minimal footer

## Tool states (the hero canvas)

- **idle**: drag-and-drop zone, big upload illustration, "DROP YOUR IMAGE HERE" + "CHOOSE AN IMAGE" button, format hints. Hover + drag-over states with purple border, lift, bounce, text swap to "YES! DROP IT HERE!"
- **selected**: image preview (object-contain) + metadata (name/dims/size), primary "REMOVE THAT BACKGROUND ✨" button + "Choose another"
- **processing**: custom scanning-line animation over the original image, rotating status messages ("Finding the subject…", "Convincing the background to leave…"), indeterminate progress bar (no fake %)
- **success**: result card on checkerboard, "BACKGROUND = GONE ✨" badge, DOWNLOAD PNG / COMPARE / DO ANOTHER ONE. Small confetti burst on entry (one-shot)
- **error**: friendly inline error card, no `alert()`
- **compare**: chunky draggable before/after slider with mouse + touch handling

Download is disabled unless a real processed Blob exists. No fake results.

## Placeholder background-removal service

`src/lib/backgroundRemoval.ts` exports `removeBackground(file: File): Promise<Blob>` that currently throws `NotImplementedError` with a TODO. The UI catches this and shows a clear "Engine not wired up yet" error state so you can plug in the real model later without touching UI code.

## Interactions & motion

- Framer Motion (`motion` package) for spring hovers, drag-over, state transitions, scroll-in stagger, decorative floats
- Button micro-interactions: translateY on hover, shadow shift, press state
- Cursor-reactive drift on hero doodles (desktop only, disabled on touch)
- Respects `prefers-reduced-motion`

## Responsiveness

Per your note: build desktop-first, not fully responsive. I'll still prevent horizontal overflow and keep the layout usable at smaller widths (stacking where trivial), but I won't invest in intentional mobile layouts / touch-optimized comparison slider. Easy to layer on later.

## SEO / head

Route `/` sets title "Free Open-Source Background Remover — Poof", matching description, og:title/description/type, twitter:card. No og:image yet. Font `<link>` tags in `__root.tsx`.

## File / component structure

```
src/
  config/site.ts                  // name, tagline, GitHub URLs
  types/image.ts
  lib/
    imageValidation.ts
    imageUtils.ts                 // object URL helpers, filename sanitize
    backgroundRemoval.ts          // placeholder engine + TODO
  hooks/
    useImageUpload.ts
    useBackgroundRemoval.ts       // state machine: idle→selected→processing→success/error
  components/
    Header.tsx
    Hero.tsx
    HeroDecorations.tsx
    BackgroundRemover.tsx         // orchestrates states
    ImageUploader.tsx             // drop zone
    ImagePreview.tsx
    ProcessingAnimation.tsx
    ResultPreview.tsx
    BeforeAfterComparison.tsx
    ErrorState.tsx
    HowItWorks.tsx
    OpenSourceSection.tsx
    GitHubCTA.tsx
    Footer.tsx
    ui/Sticker.tsx, Doodle.tsx    // small decorative primitives
  routes/
    __root.tsx                    // + font <link>, sitewide meta
    index.tsx                     // composes all sections
  styles.css                      // updated tokens
```

## Dependencies to add

- `motion` (Framer Motion successor, lightweight)
- `canvas-confetti` (one-shot success burst)

## Out of scope (per your spec)

Auth, DB, Supabase, dashboard, pricing, blog, testimonials, fake stats, extra pages, real ML engine.

## Deliverable

A single polished playful `/` page with the full state machine and placeholder engine, ready for you to swap `backgroundRemoval.ts` with a real implementation.
