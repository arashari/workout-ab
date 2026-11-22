# Workout A & B

A dumbbell workout checklist for the gym: one exercise per screen, swipe to advance,
and every exercise is marked done automatically as you scroll past it.

**Live:** https://workout-ab.543710.xyz (installable PWA — works offline)

## How it works

- **Workout A and B alternate daily.** On load the app picks the one you did *not* do
  last, so skipping a day still alternates; the suggested tab is tagged `TODAY`.
- **Progress tracks itself.** A card counts as done once it scrolls up past the sticky
  bar. Marks are kept for the day and reset when the date changes; they persist across
  reloads in `localStorage`.
- **Full-screen snapping** on phones: each card is exactly one screen, so one swipe
  moves one exercise. Desktop shows a two-column grid.
- **Animated demos** are two-frame animated WebP files (start → finish position).

## Layout

```
wrangler.jsonc            Cloudflare Worker config (static assets + custom domain)
public/
  index.html              the whole app: markup, CSS, JS
  manifest.webmanifest    PWA manifest
  sw.js                   service worker (offline precache, network-first HTML)
  art/*.webp              18 animated exercise demos
  icons/                  app icons (192, 512, maskable, apple-touch)
```

No build step, no dependencies.

## Local preview

```bash
npx wrangler@latest dev      # http://localhost:8787
```

## Deploy

```bash
npx wrangler@latest deploy
```

`wrangler.jsonc` attaches the `workout-ab.543710.xyz` custom domain; drop the `routes`
block to deploy to `<worker>.<account>.workers.dev` instead.

If you change an image in `art/`, bump `VERSION` in `public/sw.js` so installed copies
re-precache it. HTML is network-first, so text changes need no version bump.

## Credits

- **Exercise artwork** — [Superlift](https://www.thesuperliftapp.com), downloaded as
  two-frame WebP pairs (start/finish position). The loop shows the two key positions,
  not smooth motion.
- **Workout list** — ["The BEST Dumbbell Only Workout"](https://www.youtube.com/watch?v=6Lrd6hpSly8)
  by trainer winny on YouTube.
- **Tutorial videos** — linked per exercise; each card links the Superlift page it came
  from as well.

Form cues are short coaching reminders, not a substitute for an in-person form check.
