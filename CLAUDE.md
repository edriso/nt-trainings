# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this project is

A small public site for the NoTambourine team trainings: every session we learn a
topic together (performance, SEO, A/B testing, AI, …) and write it down as a short,
junior-friendly lesson. The audience is junior-to-mid developers reading in their
second language — clarity beats cleverness, always.

- **Live site:** https://edriso.github.io/notambourine-trainings/
- **Repo:** https://github.com/edriso/notambourine-trainings

## Commands

```bash
npm run dev       # local dev server
npm run build     # tsc + vite build + copies index.html to 404.html (GitHub Pages SPA fallback)
npm run preview   # serve the production build
npm run lint      # oxlint
```

Always run `npm run build` before pushing — it type-checks everything.

## Architecture (short version)

The site is content-driven. Lessons are Markdown files; the React app is just the
shell that renders them.

```
src/
  content/topics/*.md   ← THE CONTENT. One file = one topic. Add a file, done.
  lib/topics.ts         ← loads all topic files at build time, parses frontmatter (yaml)
  components/           ← Layout, TopicCard, Markdown renderer, VideoEmbed, ResourceList
  pages/                ← Home (topic grid), TopicPage (lesson), NotFound
  index.css             ← Tailwind v4 theme tokens + .prose styles for lesson Markdown
  main.tsx              ← routes (TopicPage is lazy-loaded to keep the home bundle small)
```

Key decisions (do not undo them casually):

- **Tailwind CSS v4, CSS-first.** There is no `tailwind.config.js`. Theme tokens
  live in the `@theme` block in `src/index.css`. The accent color is one token
  (`--color-accent`) — change it there to re-brand the whole site.
- **Dark mode** is a `dark` class on `<html>`, set by an inline script in
  `index.html` (prevents theme flash) and toggled by `src/hooks/useTheme.ts`.
- **GitHub Pages** serves the site under `/notambourine-trainings/`. That path is
  set as `base` in `vite.config.ts` and flows into the router via
  `import.meta.env.BASE_URL`. The build copies `index.html` to `404.html` so deep
  links work on Pages.
- **System fonts only, lazy-loaded lesson page.** This site teaches performance;
  it should stay fast. Check bundle sizes in the build output when adding
  dependencies, and prefer no new dependencies at all.

## How to add a topic (THE RULE)

One topic = one Markdown file in `src/content/topics/`. The file name becomes the
URL (`web-performance.md` → `/topics/web-performance`). No code changes needed.

### Frontmatter template

```yaml
---
title: Topic Name
description: One sentence a junior instantly understands.
emoji: 🧩            # one emoji that represents the topic (shown on cards)
order: 5             # position on the home page (lower = earlier)
status: learned      # "learned" (covered in a session) or "up-next" (planned)
session: 2           # optional: which training session covered it
date: 2026-08-01     # optional: session date, YYYY-MM-DD
tags: [tag-one, tag-two]   # 2–4 lowercase kebab-case tags
external: https://…  # optional: card links out instead of opening a lesson page
videos:              # optional: embedded at the end under "Watch"
  - title: Video Title (Channel Name)
    youtubeId: XXXXXXXXXXX
resources:           # optional: link cards at the end under "Go deeper"
  - title: Resource Name
    url: https://…
    note: One short line saying why this link is worth clicking.
---
```

### Lesson body structure

Follow this shape (see `web-performance.md` for the reference example):

1. **Open with the big idea** — a first `##` section that gives the one rule or
   mental model to remember, ideally as a `>` blockquote, plus why the topic
   matters for us as devs.
2. **Explain the core concepts** — a few `##` sections with plain-language
   headings ("Two ways to measure speed", not "Measurement Methodologies").
   Use comparison tables for either/or concepts and short code blocks only when
   code explains it better than words.
3. **Make it practical** — a section on how we actually apply this in day-to-day
   work (a workflow, a checklist, or a tool table with "use it when…").
4. **End with `## Try it yourself`** — 2–4 numbered, concrete exercises the reader
   can do in under 15 minutes, always the last Markdown section.
5. Videos and resources go in **frontmatter**, not in the body — the site renders
   them as "Watch" and "Go deeper" sections automatically.

### Writing style rules

- **Simple English.** Short sentences. Common words. Explain every acronym the
  first time it appears ("RUM (Real User Monitoring)").
- **Evergreen over up-to-date.** Topics change; the lesson should not need
  constant maintenance. Teach the concepts and *link* to official docs
  (web.dev, MDN, Google Search Central) for anything that changes over time —
  numbers, thresholds, tool screenshots, version details. When you must state a
  number that may change, add "check <official link> for the latest".
- **Link the official source, not blog posts,** unless the blog post is a
  timeless classic (like the Kroger performance series).
- **No people photos and nothing haram** — no images of women, no music-focused
  content, etc. Prefer emoji, tables, and code blocks; the design does not need
  images.
- **Verify before embedding.** Only embed a YouTube video after confirming the ID
  and title are real (e.g. via `https://www.youtube.com/oembed?url=…`). Use the
  `youtube-nocookie.com` embed (the `VideoEmbed` component already does).
- **AI topics:** do not write AI lessons here. The AI guide lives in the
  [claude-goat](https://github.com/edriso/claude-goat) repo; this site only links
  to it (see `ai-for-developers.md` for the external-card pattern).
- Content shared from client/PE-firm decks is often **confidential** — never
  commit those files to this public repo. Extract the general, public knowledge
  and link public resources instead.

## Git conventions

- Commit messages: short imperative subject, conventional prefix welcome
  (`feat:`, `fix:`, `docs:`, `chore:`).
- **No AI signatures** — do not add "Generated with Claude" lines or
  `Co-Authored-By: Claude` trailers to commits or PRs.
- Work directly on `main` is fine for content; use branches for risky changes.
- Push to `main` deploys automatically (`.github/workflows/deploy.yml`).
