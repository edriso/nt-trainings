import { topics } from '../lib/topics'
import { TopicCard } from '../components/TopicCard'

export function Home() {
  const learned = topics.filter((topic) => topic.status === 'learned')
  const upNext = topics.filter((topic) => topic.status === 'up-next')

  return (
    <div>
      <section className="py-6 sm:py-10">
        <p className="text-sm font-medium tracking-wide text-accent-strong uppercase dark:text-accent">
          NoTambourine team trainings
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Topics we learn to become better devs.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Every training session we pick a topic, learn it together, and write it down
          here in simple English — so anyone on the team can catch up anytime.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          Topics
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {learned.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </section>

      {upNext.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            Up next
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {upNext.map((topic) => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
