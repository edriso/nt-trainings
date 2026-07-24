---
title: Maintaining Live Sites
description: What changes once a site is live — monitoring, safe deploys, and catching regressions before clients do.
emoji: 🔧
order: 8
status: up-next
tags: [maintenance, monitoring, deploys]
resources:
  - title: Performance budgets 101 — web.dev
    url: https://web.dev/articles/performance-budgets-101
    note: Set limits before things get slow, so regressions get caught instead of discovered.
  - title: Site Reliability Engineering (free book)
    url: https://sre.google/sre-book/table-of-contents/
    note: Google's classic on running production systems. Deeper than we need, but the mindset chapters are gold.
---

## Why this topic is coming up

> **Launch is day one, not the finish line.**

Building a new site and maintaining a live one are different jobs. On a live
store every deploy touches real users and real money, and nobody files a ticket
when things get *slowly* worse — you have to notice it yourself.

## What we will cover

- **Knowing it is up** — quick smoke tests after a deploy (GA4 Realtime is a
  surprisingly good one — see [Google Analytics 4](google-analytics-4)).
- **Catching slow decay** — watching Core Web Vitals trends over weeks
  (see [Web Performance](web-performance)) and Search Console for SEO issues,
  instead of waiting for a client to complain.
- **Deploying safely** — small changes, easy rollbacks, and how deploys work
  across multiple stores/environments.
- **The boring-but-vital stuff** — app and dependency updates, broken-link
  checks, and keeping tracking working after theme changes.

## Until the session

1. Pick a live site you work on and run the ten-minute GA4 orientation from the [analytics lesson](google-analytics-4).
2. Look the same site up on [Treo](https://treo.sh/sitespeed) — is it getting slower over the last year? Would anyone have noticed?
