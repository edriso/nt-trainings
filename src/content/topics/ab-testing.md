---
title: A/B Testing & Experimentation
description: How teams test ideas with real users instead of guessing — and how devs make that possible.
emoji: 🧪
order: 3
status: up-next
tags: [ab-testing, cro, analytics]
resources:
  - title: A/B testing — Optimizely glossary
    url: https://www.optimizely.com/optimization-glossary/ab-testing/
    note: A clear plain-English explanation of the core idea.
  - title: Trustworthy Online Controlled Experiments (book site)
    url: https://experimentguide.com/
    note: The reference book on running experiments properly, by ex-Microsoft/Amazon experimenters.
  - title: GoodUI — patterns and test results
    url: https://goodui.org/
    note: A catalog of UI patterns with evidence from real A/B tests.
---

## What is an A/B test?

An A/B test shows two versions of something to two random groups of users:

- **A (control):** the page as it is today.
- **B (variant):** the page with one change — a new headline, layout, or flow.

Then you compare a metric that matters (usually conversion rate: how many people
buy, sign up, or click). If B clearly wins, you ship B. If not, you learned
something cheaply instead of betting the whole site on a guess.

This is the heart of **CRO** (Conversion Rate Optimization): make more money from
the *same* traffic by improving the experience, one measured change at a time.

## Why teams love it

> The goal of product work is to release the farthest-reaching, most impactful,
> easiest-to-build features.

Every idea sounds good in a meeting. A/B testing replaces "I think" with "we
measured". It also protects you: about half of all "obviously better" changes turn
out to be neutral or *worse* when tested. Without a test you would never know.

The maturity ladder most companies climb:

1. **Hero phase** — one person runs occasional tests with a tool.
2. **Program phase** — a team runs a steady pipeline of tests.
3. **Culture of experimentation** — everyone frames work as experiments; big
   companies test almost everything they ship.

## How it works under the hood

The core mechanic is simple and worth understanding as a dev:

1. **Bucket the user.** When a visitor arrives, randomly assign them 0 (control) or 1 (variant).
2. **Remember the bucket** (for example in `localStorage` or a cookie) so they see
   the *same* version on every visit. Flip-flopping ruins the data.
3. **Apply the change** if they are in the variant bucket.
4. **Track events** (views, clicks, purchases) with the bucket attached, so
   analytics can compare the two groups.

A tiny sketch of the idea:

```js
// Runs once per visitor, result is remembered.
function getBucket(experimentId) {
  const key = `exp-${experimentId}`
  let bucket = localStorage.getItem(key)
  if (bucket === null) {
    bucket = Math.random() < 0.5 ? '0' : '1'
    localStorage.setItem(key, bucket)
  }
  return Number(bucket)
}

if (getBucket('new-hero-text') === 1) {
  document.querySelector('h1').textContent = 'Find the pup of your dreams'
}
```

Real platforms (Optimizely, VWO, GrowthBook, or an in-house microlib) add
targeting, dashboards, and statistics on top — but this is the engine inside all
of them.

## Things that make tests trustworthy

- **Test one thing at a time.** If you change five things and win, which one worked?
- **Enough traffic, enough time.** Small samples lie. Run tests to a planned size,
  not "until it looks good".
- **Full weeks.** Weekend users behave differently from weekday users.
- **No peeking-and-stopping.** Stopping the moment B pulls ahead inflates false wins.
- **Watch the speed cost.** Testing scripts are third-party JavaScript — loaded
  badly, they slow the site and hurt the very conversion you measure (see the
  [Web Performance](web-performance) lesson).

## Try it yourself

1. Open a favorite online store in two browsers (or normal + incognito). Can you spot any differences? You may be inside someone's experiment right now.
2. Read three test results on [GoodUI](https://goodui.org/) — note how often the "obvious" winner loses.
3. Sketch an A/B test for a project you work on: what is the one change, and what single metric decides the winner?
