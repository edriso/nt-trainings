import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** Renders lesson Markdown. Styling lives in the .prose rules in src/index.css. */
export function Markdown({ children }: { children: string }) {
  return (
    <article className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Open external links in a new tab; keep in-page anchors as-is.
          a({ href, children, ...props }) {
            const isExternal = href?.startsWith('http')
            return (
              <a
                href={href}
                {...props}
                {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {children}
              </a>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </article>
  )
}
