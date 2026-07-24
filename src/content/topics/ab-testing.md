---
title: A/B Testing & CRO
description: How teams test ideas on real users instead of guessing — and how devs build and read those tests.
emoji: 🧪
order: 5
status: learned
session: 3
date: 2026-07-22
tags: [ab-testing, cro, analytics]
videos:
  - title: "A/B Testing Pitfalls: Getting Numbers You Can Trust is Hard (CXL)"
    youtubeId: HEGI5QN3fXE
resources:
  - title: A/B testing — Optimizely glossary
    url: https://www.optimizely.com/optimization-glossary/ab-testing/
    note: A clear plain-English explanation of the core idea.
  - title: AB Testguide — significance calculator
    url: https://abtestguide.com/calc/
    note: Paste visitors and conversions for A and B, see the verdict and the two probability curves.
  - title: A/B test duration calculator (Dynamic Yield)
    url: https://marketing.dynamicyield.com/ab-test-duration-calculator/
    note: Tells you how long a test must run before you even start it. Use it to kill bad test plans early.
  - title: RICE prioritization — Intercom
    url: https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/
    note: The original write-up of the Reach, Impact, Confidence, Ease scoring model.
  - title: Trustworthy Online Controlled Experiments (book site)
    url: https://experimentguide.com/
    note: The reference book on running experiments properly, by ex-Microsoft/Amazon experimenters.
  - title: GoodUI — patterns and test results
    url: https://goodui.org/
    note: A catalog of UI patterns with evidence from real A/B tests.
---

## The one rule to remember

> **Replace "I think" with "we measured".**

An A/B test shows two versions of something to two random groups of users:

- **A (control):** the page as it is today.
- **B (variant):** the page with one change — a new headline, layout, or flow.

Then you compare a metric that matters (usually conversion rate: how many people
buy, sign up, or click). If B clearly wins, you ship B. If not, you learned
something cheaply instead of betting the whole site on a guess.

This is the heart of **CRO** (Conversion Rate Optimization): make more money from
the *same* traffic by improving the experience, one measured change at a time.
Agencies sell CRO as a separate program, but the healthier way to think about it
is: it is just a product process where every idea comes with a measurement. The
goal of product work is to release the farthest-reaching, most impactful,
easiest-to-build features — testing is how you *know* you did.

## The three outcomes of every test

Whatever you test, only three things can happen. Experienced teams see roughly:

| Outcome | How often | What it means |
| --- | --- | --- |
| **Win** | ~30% (if you are good) | You found something users care about. Do *more* in that direction. |
| **Nothing** | ~50% | Users did not care either way. Ship it if you like it — it did not hurt — and stop testing similar ideas. |
| **Lose** | ~20% | The test just saved you real money. Keep the control, and learn which direction *not* to go. |

Two lessons hide in this table:

- **Half of "obviously better" ideas do nothing.** Without a test you would never
  know — you would celebrate the launch and move on.
- **A "did not lose" is often the real goal.** For a redesign or a rebrand, the
  honest promise is not "this will make more money" — it is "this will not
  *lose* money by confusing people". Framed that way, flat results are wins too.

And if someone claims a 100% win rate, they are not testing anything they were
unsure about — which means they are not learning anything.

## Choosing what to test: RICE

With a backlog of 100 ideas, which do you test first? A common scoring model is
**RICE**:

- **Reach** — how many users does this touch?
- **Impact** — how much does it change their experience?
- **Confidence** — is there any evidence this works (data, past tests, research)?
- **Ease** — how cheap is it to build?

High reach + high impact + high confidence + easy to build goes first. But do not
over-engineer the spreadsheet: arguing whether idea #8 should really be #9 is
time not spent shipping tests. **Velocity beats perfect ordering** — ten decent
tests launched teach you more than two "perfect" ones still being scored. Pick
the top few, launch, learn, repeat.

## How it works under the hood

The core mechanic is simple and worth understanding as a dev:

1. **Bucket the user.** When a visitor arrives, randomly assign them 0 (control) or 1 (variant).
2. **Remember the bucket** (for example in `localStorage`) so they see the *same*
   version on every visit. Flip-flopping ruins the data.
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

That is nearly the whole engine — a real in-house "micro-library" for this is
under 300 characters of JavaScript. Hosted platforms (Optimizely, VWO,
GrowthBook…) add a visual editor, targeting, dashboards, and statistics on top.

The trade-off to understand:

- **Hosted tools are asynchronous by nature.** Their script must load before the
  change applies, so visitors can see the control *flash* before the variant
  appears — and the script itself costs speed (see
  [Web Performance](web-performance)).
- **An in-house bucket function is synchronous.** Call it, get a 0 or 1 back
  instantly, branch in your own code — tests live in the codebase and workflow
  the team already uses.

Either way, fight the flicker by branching **as early as possible**: run the
bucket code inline in the `<head>`, set a class on `<html>`, and let CSS apply
the change before the first paint.

**Feature flags** are the same mechanics grown up: ship a feature turned off,
ramp it to 1%, 10%, 50% of users, and measure at each step. A good flagging
platform is an A/B testing platform wearing work clothes.

## Reading the result: is it real or just luck?

Flip a coin 10 times and get 6 heads — is the coin biased? Of course not
necessarily; small samples are noisy. A/B results are the same: variant B having
a few more sales this week proves nothing by itself.

**Statistical significance** is the standard way to ask *"how likely is this
difference to be pure luck?"* You do not need to do the math by hand — paste
visitors and conversions for A and B into a
[significance calculator](https://abtestguide.com/calc/) and read the verdict.
Two settings to understand:

- **Confidence (usually 95%).** "I accept being fooled by luck at most 5% of the
  time." Raising it to 99% means fewer false wins but much longer tests.
- **One-sided vs two-sided.** One-sided asks *"is B better than A?"* Two-sided
  asks *"is B different from A, in either direction?"* Two-sided is stricter.
  Most testing tools default to 95% one-sided.

The calculator draws two overlapping probability curves — one for each variant's
*true* conversion rate. When the curves mostly overlap, you know nothing yet.
More traffic pulls them apart — or proves they were never different.

## How long must a test run?

Before launching, put your numbers into a
[duration calculator](https://marketing.dynamicyield.com/ab-test-duration-calculator/).
It takes four inputs — baseline conversion rate, expected uplift, number of
variants, daily traffic — and tells you how many weeks you need. The findings
generalize:

- **Small effects on small conversion rates take months.** A headline tweak
  measured against *purchases* on a 2%-conversion store can need two months.
- **Every extra variant stretches the test.** Three homepage heroes instead of
  two can push a test past its useful life. Be stingy with variants.
- **The lever you actually control: measure closer to the change.** A homepage
  hero does not directly cause purchases — it causes *clicks to the product
  page*. Click-through might have a 40% baseline instead of 2%, so the same
  test resolves in days instead of months. Pick the nearest sensible metric and
  trust that revenue follows it.

Rules of thumb for the calendar: **always run full weeks** (weekend shoppers
behave differently from Tuesday shoppers), one to two weeks is the sweet spot,
and past four weeks everyone stops caring about the test — including you.

## Things that make tests trustworthy

- **Test one thing at a time.** If you change five things and win, which one worked?
- **Decide the duration up front** with a calculator — not "until it looks good".
- **No peeking-and-stopping.** Stopping the moment B pulls ahead inflates false wins.
- **Same user, same bucket, always.** Across pages, sessions, and visits.
- **Watch the speed cost.** Testing scripts are third-party JavaScript — loaded
  badly, they slow the site and hurt the very conversion you measure.
- **Report from one referee.** Send the bucket into your analytics (for example
  as a [GA4](google-analytics-4) audience) and compare cohorts there, instead of
  trusting each tool's own scoreboard.

Running several tests at once is fine, by the way. You cannot control every
variable anyway — traffic mix changes daily — and randomization spreads the other
tests evenly across both groups. Velocity through the queue matters more than
laboratory purity.

## Try it yourself

1. Open the [significance calculator](https://abtestguide.com/calc/) and enter 1,000 visitors with 25 conversions vs 1,000 with 30. Significant? Now multiply everything by 10. What changed, and why?
2. Take a project you know and put its real numbers into the [duration calculator](https://marketing.dynamicyield.com/ab-test-duration-calculator/). How long would a 5% uplift test take? Now pick a metric closer to the change and watch the duration collapse.
3. Read three test results on [GoodUI](https://goodui.org/) — note how often the "obvious" winner loses.
4. Sketch one A/B test for your current project as a RICE row: the one change, the single metric that decides it, and your Reach/Impact/Confidence/Ease guesses.
