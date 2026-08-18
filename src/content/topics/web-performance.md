---
title: Web Performance & Site Speed
description: How to measure how fast a site really feels for users, and how to make it faster.
emoji: ⚡
order: 1
status: learned
session: 1
date: 2026-07-16
tags: [performance, core-web-vitals, tooling]
videos:
  - title: Optimize for Core Web Vitals (Chrome for Developers)
    youtubeId: AQqFZ5t8uNc
resources:
  - title: Web Vitals — web.dev
    url: https://web.dev/articles/vitals
    note: The official page for Core Web Vitals. Always check here for the current metrics and targets.
  - title: Learn Performance — web.dev
    url: https://web.dev/learn/performance
    note: A free full course. Great next step after this lesson.
  - title: PageSpeed Insights
    url: https://pagespeed.web.dev/
    note: Paste any URL and get both real-user data and a synthetic report.
  - title: CrUX Vis
    url: https://cruxvis.withgoogle.com/
    note: Google's visual dashboard for real-user (CrUX) data.
  - title: Treo Site Speed
    url: https://treo.sh/sitespeed
    note: An easy-to-read view of CrUX data, with week-by-week trends.
  - title: WebPageTest
    url: https://www.webpagetest.org/
    note: Detailed synthetic runs with a shareable waterfall view. Around since 2002.
  - title: Google Search Console
    url: https://search.google.com/search-console
    note: Shows Core Web Vitals and SEO issues for sites you have access to.
  - title: Interaction to Next Paint (INP) — web.dev
    url: https://web.dev/articles/inp
    note: The metric for how fast a page responds to clicks, taps, and typing. Replaced First Input Delay (FID) in 2024.
  - title: Optimize Interaction to Next Paint — web.dev
    url: https://web.dev/articles/optimize-inp
    note: Concrete ways to make interactions feel instant — break up long tasks, do less in event handlers.
  - title: Response Time Limits — Nielsen Norman Group
    url: https://www.nngroup.com/articles/response-times-3-important-limits/
    note: The timeless 0.1s / 1s / 10s rule for how fast an interface must feel. The basis of perceived performance.
  - title: Optimize the transfer size of text — web.dev
    url: https://web.dev/articles/reduce-network-payloads-using-text-compression
    note: How gzip and Brotli shrink text files, and why compression beats chasing an ever-smaller minified file.
  - title: "Making the world's fastest website, and other mistakes"
    url: https://dev.to/tigt/making-the-worlds-fastest-website-and-other-mistakes-56na
    note: The famous "Kroger case study" series. Long, funny, and full of lessons about speed vs value.
  - title: CrUX methodology — Chrome for Developers
    url: https://developer.chrome.com/docs/crux/methodology
    note: The eligibility rules. Why a password-protected staging site will never appear in field data.
  - title: CrUX API — Chrome for Developers
    url: https://developer.chrome.com/docs/crux/api
    note: 28-day rolling window, refreshed daily, reported at the 75th percentile. The three facts that explain every surprise.
  - title: Page experience in Google Search
    url: https://developers.google.com/search/docs/appearance/page-experience
    note: Google's own hedging — "there is no single signal", and relevance still wins over speed.
---

## The one rule to remember

> **Make the site fast for your users, and the tools will catch up.**

Performance is not about getting a green score. It is about real people waiting for
your page. Scores and reports are just *proxies* — helpful signs that point at the
real thing, which is user experience.

Why should we care as devs?

- **Faster sites sell more.** Slow pages lose visitors before they see anything.
- **Google cares.** Core Web Vitals feed into SEO ranking and paid-ads quality scores.
- **It is our job.** Clients often buy "performance work" — we need to know what to fix and what to say no to.

## Two ways to measure speed

Everything in performance falls into one of two buckets. Knowing which one you are
looking at is half the skill.

| | RUM (Real User Monitoring) | Synthetic |
| --- | --- | --- |
| **What it is** | Data collected from real visitors' browsers | One test run from a machine in a lab |
| **Example** | CrUX (Chrome UX Report), Treo | Lighthouse, PageSpeed Insights lab report, WebPageTest |
| **Good for** | Knowing what users *actually* experience — your north star | Finding *what* to fix, with instant feedback |
| **Weakness** | Slow to update (CrUX rolls over ~28 days) | One run ≠ real life; results vary between runs |

A simple way to say it:

> **Judge yourself with RUM. Debug with synthetic.**

A synthetic run is one robot loading your page once. Real users are on old phones,
slow networks, and moving trains. That is why a single run can look very different
from what most users feel — pages also load a bit differently every single time.

## Core Web Vitals

Core Web Vitals are Google's small set of user-experience metrics, collected from
real Chrome users and published in the **CrUX report** (Chrome UX Report). Google
uses them as a ranking signal, so clients care about them a lot.

The current three (check [web.dev](https://web.dev/articles/vitals) for the latest —
Google updates them over time):

- **LCP — Largest Contentful Paint.** How long until the biggest thing on screen
  (usually the hero image or heading) is visible. *"Can I see it?"*
- **INP — Interaction to Next Paint.** How long the page takes to respond after you
  click, tap, or type. *"Can I use it?"*
- **CLS — Cumulative Layout Shift.** How much the page jumps around while loading.
  *"Does it stay still?"*

Two supporting metrics you will meet everywhere:

- **TTFB — Time to First Byte.** How fast the server starts answering.
- **FCP — First Contentful Paint.** How long until *anything* appears.

Each metric points at a different kind of fix. A bad **LCP** usually means image or
loading-order work (we can fix that). A bad **TTFB** on a hosted platform like
Shopify usually means the server is out of our hands — different conversation with
the client.

## The toolbox

These are the tools we actually use, and when to reach for each one:

| Tool | Type | Use it when… |
| --- | --- | --- |
| [PageSpeed Insights](https://pagespeed.web.dev/) | Both | You want a quick overview: CrUX summary on top, synthetic audit below. |
| [Lighthouse in Chrome DevTools](https://developer.chrome.com/docs/lighthouse) | Synthetic | You are fixing something and want instant feedback after each change. |
| [CrUX Vis](https://cruxvis.withgoogle.com/) | RUM | You want Google's own view of real-user data over time. |
| [Treo](https://treo.sh/sitespeed) | RUM | You want easy trends, week by week — great to show progress before the 28-day cycle ends. |
| [WebPageTest](https://www.webpagetest.org/) | Synthetic | You need a detailed waterfall you can share with a client. |
| [Search Console](https://search.google.com/search-console) | RUM | You have site access and want Core Web Vitals next to SEO issues. |

**Tip:** in Chrome DevTools you can throttle the network (for example "Fast 4G") and
disable cache to feel what real users feel. Just remember to turn throttling off
after — everyone forgets once.

## How to work a performance ticket

A simple repeatable flow:

1. **Look at RUM first.** Which Core Web Vital is actually bad for real users?
2. **Run a synthetic audit** (Lighthouse or PageSpeed Insights) to get a list of suggestions.
3. **Walk through the red items** and ask: *can we realistically fix this, and is it worth it?*
   Some things (like a client's cookie banner) may be untouchable.
4. **Fix, then re-run Lighthouse** for instant feedback.
5. **Watch RUM over the next weeks** (Treo makes this easy) to confirm real users got faster.

Remember the score is weighted: a few metrics carry most of the points. Focus on the
metric that is actually failing, not on chasing 100.

## Checking a site you have no access to

Field data is **public**. You can read the real-user performance of a competitor's
site — or a site you are about to rebuild, before you have touched anything —
without any access to it at all. In session 17 someone pulled a live site up on
[Treo](https://treo.sh/sitespeed) mid-call: *"this is what we're competing
against."*

The chain the data travels is worth knowing, because it explains every limitation
you will run into:

1. Chrome users who opted into usage reporting send their **real** metrics back.
2. Google aggregates those into the **CrUX** dataset.
3. The [CrUX API](https://developer.chrome.com/docs/crux/api) serves a **28-day
   rolling average**, refreshed daily; [BigQuery](https://developer.chrome.com/docs/crux/bigquery)
   publishes a **monthly** table on the second Tuesday of the following month.
4. Every metric is reported at the **75th percentile** — the experience of the
   unluckiest quarter of page loads, not the typical one.
5. Treo and CrUX Vis are readable views over that same data. No tool has better
   numbers than another; they all read from CrUX.

Three things about this catch people out.

**A staging site has no field data, and cannot get any.** CrUX needs the page to be
[publicly discoverable](https://developer.chrome.com/docs/crux/methodology) — a
non-200 status, an `X-Robots-Tag: noindex` header, or a `noindex` meta tag
disqualifies it — *and* the origin needs a minimum number of real visitors, a
threshold Google deliberately does not publish. A password-protected pre-launch site
fails both tests at once, which is exactly what came up here: *"there's no way to get
a version of the new one because it's password protected, and nobody's crawling it."*

The practical consequence is a deadline: **if you want a before-and-after on public
field data, capture the "before" while the old site is still live.** (What you
*can* still measure on that password-protected site is
[The Week Before Launch](the-week-before-launch).) Once it is
switched off, that history is only available for the origin, and only for as long as
the dataset keeps it. Screenshot it, or pull the numbers into a note, on the day you
start the project.

The same lag applies at the other end. A relaunched site does not show up as a step
change — the 28-day rolling window means a launch bleeds into the graph over about a
month, and the monthly BigQuery table will not reflect a mid-month launch at all.
Expect to wait before the good news is visible, and tell the client that before they
ask.

**You cannot subtract percentiles.** The dashboard on screen showed **TTFB 4.6 s**
and **LCP 4.1 s** for the same origin, which looks impossible — the first byte cannot
arrive after the largest paint. It is not impossible, because each figure is an
*independent* 75th percentile over a different set of page loads. The visits that
produced the slowest quarter of TTFB are not the visits that produced the slowest
quarter of LCP. Use each percentile to answer its own question, and never do
arithmetic across two of them.

**An all-green profile is not the same as a good site.** That same screen had
TTFB 4.6 s, FCP 3.7 s and LCP 4.1 s all red, while **INP was 96 ms and CLS was
0.00** — both comfortably green. That shape is common and it says something specific:
*once the bytes arrive, the page is fine.* Nothing shifts around, interactions are
fast, and the entire problem is getting a first response out of the server. That aims
the work at hosting, caching and the CDN, not at JavaScript.

The reverse case matters just as much. A store described in the same session as
having "the worst theme I've ever seen" was **all green**. Core Web Vitals measure
whether a page loads and responds well; they cannot see whether it is any good.
Google says so itself on the
[page experience](https://developers.google.com/search/docs/appearance/page-experience)
page: there is *"no single signal"*, and Search *"always seeks to show the most
relevant content, even if the page experience is sub-par."* Green vitals are table
stakes, not a competitive advantage.

One last reason to prefer the public dataset over your own dashboard at relaunch:
**you do not control it.** As it was put in the session, *"it's a good use case to be
able to point to a public graph and be like, see, this was when we launched."* A
number a client can check without trusting your instrumentation is a stronger kind of
evidence — the same argument as [Proving It Works](proving-it-works), scaled up from
a pull request to a whole project.

## Performance is a trade-off, not a boolean

The fastest possible site is a blank white page — and it sells nothing. Every
feature (analytics, chat widgets, A/B testing scripts, cookie banners) costs speed
and brings value. Our job is not "delete everything slow"; it is to **weigh speed
against value** and find smarter ways to keep both.

Classic examples of good trade-off thinking:

- Load third-party scripts **after** the page is usable, not before.
- Lazy-load images below the fold; eager-load the hero image.
- Only load a heavy component (like a product customizer) on the pages that use it.
- Delay non-critical popups a second or two instead of showing them on first paint.

The [Kroger case study](https://dev.to/tigt/making-the-worlds-fastest-website-and-other-mistakes-56na)
in "Go deeper" is a brilliant (and funny) long read on exactly this tension.

## Compression: how big pages get small

Before a page reaches the browser, the server — or a **CDN** (Content Delivery
Network, the cache layer between your server and your users) — can **compress**
text files (HTML, CSS, JavaScript, SVG) so far fewer bytes travel over the
network. Two algorithms do almost all of this:

- **gzip** — everywhere, and has been for decades.
- **Brotli** — newer, and usually 10–20% smaller than gzip for text. Supported
  by every modern browser.

You do not compress in your own code; you switch it on at the server or CDN and
the browser un-compresses automatically. To check it is actually happening, open
DevTools → Network, click the document/CSS/JS file, and look for
**`content-encoding: br`** (Brotli) or `gzip` in the response headers. If it
says neither, you are shipping raw text — often the single biggest, cheapest win
available.

Two things that surprise people:

- **Compression is not minification — and it matters more.** Minifying
  (stripping whitespace and comments) removes some bytes, but gzip and Brotli
  already collapse repetition, so once compression is on, minifying on top adds
  only a little more. The real mistake is skipping or mis-configuring
  compression while fussing over the minified file size — turn on Brotli first;
  it is the far bigger win.
- **Streamed or dynamic pages can slip through uncompressed.** A CDN compresses
  best when it holds the whole file (a cached, static asset). A page rendered
  fresh for every request and *streamed* to the browser can be sent before the
  CDN gets a chance to compress it — so a "dynamic" route can quietly ship many
  times larger than the cached version of the same page. If a page is
  mysteriously heavy, check whether it is served dynamically and whether
  compression survives that path. (Compressing a stream also adds a little
  latency, since the compressor needs a chunk of bytes to work on — a real
  trade-off, not a free win.)

## What about single-page apps?

Page-load metrics mostly measure the *first* load. For app-like experiences
(dashboards, product customizers), the metric that matters most is **INP** — how
fast the UI responds when the user interacts.

Common INP killers:

- Too many event listeners doing heavy work (the old jQuery days: an analytics
  listener on the whole document meant *every* click ran extra JavaScript).
- Long JavaScript tasks that block the main thread.

To dig in, use the **Performance panel** in Chrome DevTools: record while you click
around, then read the flame chart to see which functions eat the time. Searching
"performance tuning single page app" plus your framework name goes a long way.

## Fast, or feeling fast?

Users do not carry a stopwatch. They judge speed by how the page *feels*, and
that is often not what a tool measures — two sites with identical numbers can
feel worlds apart.

The classic thresholds (from the Nielsen Norman Group) are worth memorising:

- **Under ~0.1s** feels instant — like direct manipulation.
- **~1s** keeps a user's train of thought unbroken.
- **~10s** is the edge of patience; past it, show progress or lose them.

That is the responsiveness **INP** captures — how fast the page reacts to a tap,
click, or keypress. Acknowledge every interaction quickly enough to feel instant
(that ~0.1s again) — even if the reply is just a spinner or a disabled button —
and the app feels alive. (Check [web.dev](https://web.dev/articles/inp) for INP's
current "good" target.) A few habits buy a lot of "feel":

- **Give instant feedback.** Acknowledge the click *now* (a spinner, a skeleton
  screen, an optimistic checkmark); finish the real work after.
- **Do work before it is asked for.** Start the expensive step during a natural
  pause. A photo app can begin uploading in the background while the user is
  still typing a caption, so "Post" feels instant. Warm a cache the moment
  intent is clear — for example, prefetch a customizer's assets on the "Start"
  click, before the user needs them.
- **Cache what you will reuse.** If typing each letter re-fetches the *same*
  preview image, cache it — the second keystroke should cost nothing.
- **Debounce bursts.** Firing a request on every keystroke is wasteful; waiting
  until typing pauses is cheaper — but it trades away the instant feel. Which
  one wins is a real [A/B test](ab-testing) question, not a guess.

And a genuinely counter-intuitive one: **sometimes slower feels better.**
Harvard researchers Ryan Buell and Michael Norton called it the *labor
illusion* — a travel site that pauses to show "searching 200 airlines…" can feel
more thorough, and more trustworthy, than one that returns the same results
instantly. The goal was never the smallest number. It is a site that feels
**premium and in control** — speed serves that; it is not the whole of it.

## Try it yourself

1. Open [PageSpeed Insights](https://pagespeed.web.dev/) and test a site you use daily. Mobile first — it is stricter.
2. Find which Core Web Vital is worst. Is it a "we can fix this" one (LCP) or a "server problem" one (TTFB)?
3. Open the same site in Chrome DevTools → Lighthouse and run a local audit. Compare with the online result.
4. Look the site up on [Treo](https://treo.sh/sitespeed) and check: is it getting faster or slower over the last year?
