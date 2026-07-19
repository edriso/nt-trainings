import { Link, Outlet, ScrollRestoration } from 'react-router'
import { BackToTop } from './BackToTop'
import { GitHubIcon } from './GitHubIcon'
import { ThemeToggle } from './ThemeToggle'

const REPO_URL = 'https://github.com/edriso/nt-trainings'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
              NT
            </span>
            <span className="text-zinc-900 dark:text-zinc-50">Trainings</span>
          </Link>
          <div className="flex items-center gap-1">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="View source on GitHub"
              className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              <GitHubIcon size={18} />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-200 py-6 dark:border-zinc-800">
        <p className="mx-auto max-w-3xl px-4 text-sm text-zinc-500 dark:text-zinc-400">
          NoTambourine team trainings — learning together, one topic at a time.
        </p>
      </footer>

      <BackToTop />
      <ScrollRestoration />
    </div>
  )
}
