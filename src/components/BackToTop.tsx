import { useEffect, useState } from 'react'
import { ArrowUp, X } from 'lucide-react'

/**
 * "Back to top" button, following the common UX guidelines:
 * - only appears after the user scrolls about two screens down
 * - bottom-right corner, does not cover the reading column
 * - a real <button> with a text label (icon-only is too ambiguous)
 * - the small ✕ hides it for the rest of the tab session
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('back-to-top-dismissed') === 'true',
  )

  useEffect(() => {
    if (dismissed) return

    let ticking = false
    function onScroll() {
      // requestAnimationFrame keeps scroll handling cheap (runs once per frame).
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 2)
        ticking = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  if (dismissed) return null

  function scrollToTop() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  function dismiss() {
    sessionStorage.setItem('back-to-top-dismissed', 'true')
    setDismissed(true)
  }

  return (
    <div
      className={`group fixed right-5 bottom-5 z-20 transition duration-200 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/90 px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-md backdrop-blur transition hover:border-accent/50 hover:text-accent-strong dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:text-accent"
      >
        <ArrowUp size={16} />
        Top
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Hide the back to top button"
        className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 opacity-0 shadow-sm transition group-hover:opacity-100 hover:text-zinc-900 focus-visible:opacity-100 pointer-coarse:opacity-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <X size={12} />
      </button>
    </div>
  )
}
