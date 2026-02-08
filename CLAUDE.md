# Port — Zach Hammer's Portfolio Site

## Overview

A static portfolio site built with Astro. Four content types: video, image, web, music. Deployed on Vercel. Images stored via Git LFS.

## Core Principles

- **CSS only, no JavaScript.** The entire site ships zero client-side JS. All interactivity (hover previews, BackBar animation) is pure CSS. If a feature would require JS, flag it explicitly before proceeding.
- **Static generation.** All pages are pre-rendered at build time. No SSR.
- **Keep it simple.** Minimal dependencies, no over-engineering.

## Tech Stack

- **Astro v5** (static output)
- **remark-breaks** for Markdown line break preservation
- **yaml** package for parsing order.yaml
- **Git LFS** for all images (png, gif, jpeg, jpg)
- **Vercel** for deployment (Git LFS enabled in project settings)

## Project Structure

```
src/
  content.config.ts          # Zod schemas for all 4 collections
  data/
    order.yaml               # Controls homepage display order
    video/*.md               # Video entries (vimeoId)
    image/*.md               # Image entries (single or array of images)
    web/*.md                 # Web project entries (url, optional screenshot)
    music/*.md               # Music entries (bandcampId, bandcampType)
  pages/
    index.astro              # Homepage with sections + separator previews
    [slug].astro             # Unified detail page for all content types
  components/
    BackBar.astro            # CSS-only animated back navigation bar
  layouts/
    Base.astro               # Shared HTML shell, global styles
scripts/
  validate.js                # Checks order.yaml matches .md files on disk
public/
  images/
    pieces/                  # Full artwork images
    previews/                # Hover preview GIFs/PNGs for homepage
    separators/              # Decorative separator images (top, middle, bottom)
```

## Content Collections

All collections share an optional `preview` field:
```yaml
preview:
  image: "/images/previews/example.gif"  # optional for image collection (defaults to first image)
  separator: 1                            # which separator (1-3) to show preview on
  position: "center 70%"                  # optional CSS object-position
```

- **video**: title, date?, vimeoId, preview?
- **image**: title, date?, image (string or string[]), preview?
- **web**: title, date?, url, screenshot?, preview?
- **music**: title, date?, bandcampId, bandcampType (album|track), preview?

## Homepage

- Sections display in order: video, web, image, music/poetry
- Comma-separated links within each section
- 3 separator images between sections
- Hover preview: CSS `:has()` selectors swap separator images on link hover
- Dynamic CSS rules generated at build time via `<style is:global set:html={...} />`
- Mail icon footer with wing emoji hover effect

## Detail Pages

- Flat URLs: `/{slug}` (no collection prefix)
- Type-specific rendering: Vimeo iframe, image(s), web iframe + screenshot, Bandcamp embed
- BackBar component for navigation back to home
- Optional date shown as `(date)` next to title
- Markdown body rendered below embed

## Key Patterns

- **order.yaml** controls what appears on the homepage and in what order. The validate script errors if a slug is listed but has no matching .md file, and warns if .md files exist but aren't listed.
- **Build command**: `node scripts/validate.js && astro build`
- **BackBar animation**: Pre-rendered frames with CSS `@keyframes` + `visibility` + `step-end`. No JS.
- **Preview hover**: CSS `:has(a[data-preview="slug"]:hover)` toggles opacity on separator images. No JS.
- **Scoped vs global CSS**: Dynamic style blocks need `is:global` to avoid Astro's scoped `data-astro-cid-*` attributes.

## GIF Preview Generation

Generate preview GIFs from video files using ffmpeg:
```bash
ffmpeg -y -ss <start_seconds> -t <duration> -i "input.mov" \
  -vf "fps=10,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 public/images/previews/<slug>.gif
```
- 480px wide, full palette, 10fps
- Target ~1.5-2MB per GIF (2-4 second clips work best)

## Adding Content

1. Create `src/data/<collection>/<slug>.md` with appropriate frontmatter
2. Add slug to `src/data/order.yaml` in desired position
3. Add any images to `public/images/pieces/` or `public/images/previews/`
4. Run `npm run build` to validate and build
