---
title: Maintaining Live Sites
description: What changes once a site is live — monitoring, safe deploys, and catching regressions before clients do.
emoji: 🔧
order: 10
status: up-next
tags: [maintenance, monitoring, deploys]
resources:
  - title: Performance budgets 101 — web.dev
    url: https://web.dev/articles/performance-budgets-101
    note: Set limits before things get slow, so regressions get caught instead of discovered.
  - title: Site Reliability Engineering (free book)
    url: https://sre.google/sre-book/table-of-contents/
    note: Google's classic on running production systems. Deeper than we need, but the mindset chapters are gold.
  - title: Rage clicks — Sentry docs
    url: https://docs.sentry.io/product/issues/issue-details/replay-issues/rage-clicks/
    note: A user clicking the same thing three times in seven seconds is a bug report nobody had to file.
---

## Why this topic is coming up

> **Launch is day one, not the finish line.**

Building a new site and maintaining a live one are different jobs. On a live
store every deploy touches real users and real money, and nobody files a ticket
when things get *slowly* worse — you have to notice it yourself.

## What we will cover

- **Knowing it is up** — quick smoke tests after a deploy (GA4 Realtime is a
  surprisingly good one — see [Google Analytics 4](google-analytics-4)).
- **Error monitoring** — the half of quality that tests cannot cover, because a
  test only checks what someone thought of in advance. Sentry is the tool we are
  standardising on: real stack traces tied to a release, plus *frustration
  signals* like rage clicks and dead clicks that turn a silently broken button
  into an alert. See [Integration Testing](integration-testing) for where this
  sits next to the test suite.
- **Catching slow decay** — watching Core Web Vitals trends over weeks
  (see [Web Performance](web-performance)) and Search Console for SEO issues,
  instead of waiting for a client to complain.
- **Deploying safely** — small changes, easy rollbacks, and how deploys work
  across multiple stores/environments.
- **Release rhythm** — deploying a tag rather than whatever is on a branch, and
  freezing staging before a client demo so what they see on Monday is what we
  signed off on Friday. Boring, and it prevents the worst kind of surprise.
- **The boring-but-vital stuff** — app and dependency updates, broken-link
  checks, and keeping tracking working after theme changes.

## Until the session

1. Pick a live site you work on and run the ten-minute GA4 orientation from the [analytics lesson](google-analytics-4).
2. Look the same site up on [Treo](https://treo.sh/sitespeed) — is it getting slower over the last year? Would anyone have noticed?
