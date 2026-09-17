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
}

/**
 * Metadata for every topic is loaded eagerly, because the home page lists all
 * of them. Lesson bodies are loaded one at a time, on demand.
 *
 * `?meta` is handled by the `topic-frontmatter` plugin in vite.config.ts: it
 * parses the frontmatter at build time and returns only that, so none of the
 * lesson prose reaches the home-page bundle. To add a topic you still only add
 * a file to src/content/topics.
 */
const metaFiles = import.meta.glob('../content/topics/*.md', {
  query: '?meta',
  import: 'default',
  eager: true,
}) as Record<string, TopicMeta>

const bodyFiles = import.meta.glob('../content/topics/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

/** web-performance.md -> "web-performance" */
function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace('.md', '')
}

export const topics: Topic[] = Object.entries(metaFiles)
  .map(([path, meta]) => ({ ...meta, slug: slugFromPath(path) }))
  .sort((a, b) => a.order - b.order)

export function getTopic(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug)
}

const bodyBySlug = new Map(
  Object.entries(bodyFiles).map(([path, load]) => [slugFromPath(path), load]),
)

/**
 * Fetches one lesson body, without the frontmatter block the build already
 * parsed. Each topic is its own chunk, so this downloads one lesson's prose.
 */
export async function getTopicContent(slug: string): Promise<string> {
  const load = bodyBySlug.get(slug)
  if (!load) {
    throw new Error(`No topic file for "${slug}".`)
  }

  const raw = await load()
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/)
  return (match ? match[1] : raw).trim()
}
