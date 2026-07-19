# NoTambourine Trainings

Topics we learn together as a team to become better developers.

**Live site:** https://edriso.github.io/notambourine-trainings/

Every training session we pick a topic (performance, SEO, A/B testing, AI, …),
learn it together, and write it down here in simple English so anyone on the team
can catch up anytime.

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) on [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config, light/dark themes)
- [React Router](https://reactrouter.com/) for pages
- Lessons are plain Markdown files rendered with [react-markdown](https://github.com/remarkjs/react-markdown)

## Run it locally

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build     # type-check + production build (output in dist/)
npm run preview   # serve the production build locally
npm run lint      # lint with oxlint
```

## Add a new topic

1. Create a new file in `src/content/topics/`, for example `git-workflows.md`.
2. Copy the frontmatter from an existing topic and fill it in.
3. Write the lesson following the structure described in [CLAUDE.md](./CLAUDE.md)
   (that file is the single source of truth for how lessons are written).

That is it — no code changes needed. The site picks up new files automatically.

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages through the
workflow in `.github/workflows/deploy.yml`.
