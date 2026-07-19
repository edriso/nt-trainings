import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import type { Topic } from '../lib/topics'

const cardClasses =
  'group block rounded-2xl border border-zinc-200 bg-white p-5 transition ' +
  'hover:border-accent/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 ' +
  'dark:hover:border-accent/50'

function CardBody({ topic }: { topic: Topic }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl" aria-hidden="true">
          {topic.emoji}
        </span>
        {topic.status === 'up-next' ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Up next
          </span>
        ) : topic.external ? (
          <ArrowUpRight
            size={18}
            className="text-zinc-400 transition group-hover:text-accent"
          />
        ) : null}
      </div>
      <h2 className="mt-3 text-lg font-semibold text-zinc-900 group-hover:text-accent-strong dark:text-zinc-50 dark:group-hover:text-accent">
        {topic.title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {topic.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {topic.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  )
}

export function TopicCard({ topic }: { topic: Topic }) {
  // Some topics (like the AI guide) live on another site.
  if (topic.external) {
    return (
      <a href={topic.external} target="_blank" rel="noreferrer" className={cardClasses}>
        <CardBody topic={topic} />
      </a>
    )
  }

  return (
    <Link to={`/topics/${topic.slug}`} className={cardClasses}>
      <CardBody topic={topic} />
    </Link>
  )
}
