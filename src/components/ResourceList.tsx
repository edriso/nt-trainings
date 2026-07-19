import { ArrowUpRight } from 'lucide-react'
import type { TopicResource } from '../lib/topics'

/** The "Go deeper" links at the end of a lesson. */
export function ResourceList({ resources }: { resources: TopicResource[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {resources.map((resource) => (
        <li key={resource.url}>
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="group flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-accent/50 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-accent/50"
          >
            <span className="flex items-center justify-between gap-2 font-medium text-zinc-900 group-hover:text-accent-strong dark:text-zinc-50 dark:group-hover:text-accent">
              {resource.title}
              <ArrowUpRight size={16} className="shrink-0 text-zinc-400" />
            </span>
            {resource.note && (
              <span className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {resource.note}
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  )
}
