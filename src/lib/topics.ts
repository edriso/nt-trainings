import { parse } from 'yaml'

/** A video that gets embedded at the end of a lesson. */
export type TopicVideo = {
  title: string
  /** The ID from the YouTube URL, e.g. "AQqFZ5t8uNc" from youtube.com/watch?v=AQqFZ5t8uNc */
  youtubeId: string
}

/** An external link shown in the "Go deeper" section of a lesson. */
export type TopicResource = {
  title: string
  url: string
  /** One short line explaining why this link is useful. */
  note?: string
}

/** A PDF deck shown in the "Slides" section of a lesson. */
export type TopicDeck = {
  title: string
  /** File name inside public/decks/, e.g. "unit-testing-2026-07.pdf" */
  file: string
  /** One short line saying what the deck adds (and how dated it is). */
  note?: string
}

/** The metadata at the top of each lesson file (the YAML frontmatter). */
export type TopicMeta = {
  title: string
  description: string
  emoji: string
  /** Lower numbers show first on the home page. */
  order: number
  /** "learned" = we covered it in a session. "up-next" = planned for a future session. */
  status: 'learned' | 'up-next'
  tags: string[]
  /** Which training session covered this topic (optional). */
  session?: number
  /** When we learned it, as YYYY-MM-DD (optional). */
  date?: string
  /** If set, the topic card links to this URL instead of a lesson page. */
  external?: string
  videos?: TopicVideo[]
  resources?: TopicResource[]
  /** PDF decks (in public/decks/) rendered as a "Slides" section. */
  decks?: TopicDeck[]
}

export type Topic = TopicMeta & {
  /** URL part, taken from the file name: web-performance.md -> "web-performance" */
  slug: string
  /** The lesson body as Markdown. */
  content: string
}

/**
 * Load every .md file in src/content/topics at build time.
 * To add a new topic you only need to add a new file there — no code changes.
 */
const files = import.meta.glob('../content/topics/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function parseTopic(path: string, raw: string): Topic {
  const slug = path.split('/').pop()!.replace('.md', '')

  // Split the file into frontmatter (between the two "---" lines) and body.
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    throw new Error(`Topic file "${slug}.md" is missing its frontmatter block.`)
  }

  const meta = parse(match[1]) as TopicMeta
  return { ...meta, slug, content: match[2].trim() }
}

export const topics: Topic[] = Object.entries(files)
  .map(([path, raw]) => parseTopic(path, raw))
  .sort((a, b) => a.order - b.order)

export function getTopic(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug)
}
