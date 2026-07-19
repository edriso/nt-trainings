import type { TopicVideo } from '../lib/topics'

/** Embeds a YouTube video using the privacy-friendly no-cookie player. */
export function VideoEmbed({ video }: { video: TopicVideo }) {
  return (
    <figure className="my-4">
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
          title={video.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full"
        />
      </div>
      <figcaption className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        {video.title}
      </figcaption>
    </figure>
  )
}
