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
  - title: "Making the world's fastest website, and other mistakes"
    url: https://dev.to/tigt/making-the-worlds-fastest-website-and-other-mistakes-56na
    note: The famous "Kroger case study" series. Long, funny, and full of lessons about speed vs value.
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

## Try it yourself

1. Open [PageSpeed Insights](https://pagespeed.web.dev/) and test a site you use daily. Mobile first — it is stricter.
2. Find which Core Web Vital is worst. Is it a "we can fix this" one (LCP) or a "server problem" one (TTFB)?
3. Open the same site in Chrome DevTools → Lighthouse and run a local audit. Compare with the online result.
4. Look the site up on [Treo](https://treo.sh/sitespeed) and check: is it getting faster or slower over the last year?
