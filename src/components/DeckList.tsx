import { FileText } from 'lucide-react'
import type { TopicDeck } from '../lib/topics'

/** The "Slides" PDF cards at the end of a lesson. Files live in public/decks/. */
export function DeckList({ decks }: { decks: TopicDeck[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {decks.map((deck) => (
        <li key={deck.file}>
          <a
            href={`${import.meta.env.BASE_URL}decks/${deck.file}`}
            target="_blank"
            rel="noreferrer"
            className="group flex h-full items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-accent/50 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-accent/50"
          >
            <FileText size={20} className="mt-0.5 shrink-0 text-zinc-400 transition group-hover:text-accent" />
            <span className="flex flex-col">
              <span className="flex flex-wrap items-center gap-2 font-medium text-zinc-900 group-hover:text-accent-strong dark:text-zinc-50 dark:group-hover:text-accent">
                {deck.title}
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  PDF
                </span>
              </span>
              {deck.note && (
                <span className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {deck.note}
                </span>
              )}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
