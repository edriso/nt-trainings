import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

export function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-6xl" aria-hidden="true">
        🧭
      </p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Page not found
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        This page does not exist (or was moved).
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-medium text-white transition hover:bg-accent-strong"
      >
        <ArrowLeft size={16} />
        Back to all topics
      </Link>
    </div>
  )
}
