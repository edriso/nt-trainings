import { ArrowLeft, BookOpen, CalendarDays, PlayCircle, Presentation } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { DeckList } from '../components/DeckList'
import { Markdown } from '../components/Markdown'
import { ResourceList } from '../components/ResourceList'
import { VideoEmbed } from '../components/VideoEmbed'
import { getTopic, getTopicContent } from '../lib/topics'
import { NotFound } from './NotFound'

export function TopicPage() {
  const { slug } = useParams()
  const topic = slug ? getTopic(slug) : undefined

  // The lesson body is its own chunk, so the home page never downloads it.
  const [content, setContent] = useState<string | null>(null)

  useEffect(() => {
    if (!topic) return

    let active = true
    setContent(null)
    getTopicContent(topic.slug).then((text) => {
      if (active) setContent(text)
    })

    return () => {
      active = false
    }
  }, [topic])

  if (!topic) {
    return <NotFound />
  }

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft size={16} />
        All topics
      </Link>

      <header className="mt-6 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <div className="text-4xl" aria-hidden="true">
          {topic.emoji}
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          {topic.title}
        </h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">{topic.description}</p>
        {(topic.session || topic.date) && (
          <p className="mt-4 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            <CalendarDays size={15} />
            {topic.session && <>Session {topic.session}</>}
            {topic.session && topic.date && <span aria-hidden="true">·</span>}
            {topic.date}
          </p>
        )}
      </header>

      {content === null ? (
        <div
          className="mt-10 animate-pulse space-y-4"
          role="status"
          aria-label="Loading the lesson"
        >
          <div className="h-4 w-11/12 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-9/12 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ) : (
        <>
          <Markdown>{content}</Markdown>

          {topic.decks && topic.decks.length > 0 && (
            <section className="mt-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                <Presentation size={22} className="text-accent" />
                Slides
              </h2>
              <div className="mt-4">
                <DeckList decks={topic.decks} />
              </div>
            </section>
          )}

          {topic.videos && topic.videos.length > 0 && (
            <section className="mt-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                <PlayCircle size={22} className="text-accent" />
                Watch
              </h2>
              <div className="mt-4">
                {topic.videos.map((video) => (
                  <VideoEmbed key={video.youtubeId} video={video} />
                ))}
              </div>
            </section>
          )}

          {topic.resources && topic.resources.length > 0 && (
            <section className="mt-12">
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                <BookOpen size={22} className="text-accent" />
                Go deeper
              </h2>
              <div className="mt-4">
                <ResourceList resources={topic.resources} />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
