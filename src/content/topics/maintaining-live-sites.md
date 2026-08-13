---
title: Maintaining Live Sites
description: What changes once a site is live — monitoring, safe deploys, and catching regressions before clients do.
emoji: 🔧
order: 29
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
  - title: Source maps — Sentry docs
    url: https://docs.sentry.io/platforms/javascript/sourcemaps/
    note: The step that turns a useless minified stack trace into a real file and line. Skipping it wastes the whole tool.
  - title: "Test automation — DORA capabilities"
    url: https://dora.dev/capabilities/test-automation/
    note: The research behind "deploy more often, break things less". The capabilities are what make it true, not the calendar.
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

## Two things session 7 settled

**Merging is not releasing.** The rule worth adopting deliberately: a merge to the
main branch publishes to a **staging** environment automatically, and a production
release is a separate, explicit act — a tag push, not a branch push. The mechanism
matters as much as the intention. If the release path accepts a branch, "we froze
staging" is a promise everyone has to remember rather than something the pipeline
enforces. Two details that catch people out:

- **A release from a branch should be rejected outright**, and the tagged commit
  checked to confirm it descends from the main branch — otherwise a side branch can
  be tagged into production.
- **After a merge, preview the staging environment, not production.** Once a merge
  no longer reaches production, checking the live site after merging shows you the
  *previous* release. This one bites everybody once.

**Error monitoring is the half that makes frequent releases safe.** The
[research on delivery performance](https://dora.dev/capabilities/test-automation/)
finds that speed and stability go together rather than trading off — but the teams
that get both have the capabilities that produce it, including the ability to see
what broke. So the honest version of "can we deploy on Friday?" is: *can you see
what broke, and can you put it back?* Tests answer neither question once the code
is live.

Two things to get right when setting error monitoring up, because both are easy to
skip and both decide whether the tool is useful:

1. **Upload source maps.** Minified production JavaScript produces stack traces
   like `t is not a function at a.js:1:48211`, which tell you nothing. The
   monitoring tool needs the
   [source maps](https://docs.sentry.io/platforms/javascript/sourcemaps/) from the
   production build to map that back to a real file and line. It is a build step,
   not a settings toggle.
2. **Tie every error to the release.** If releases are tags, feed the tag through.
   That turns *"errors went up"* into *"errors went up on this release"*, which is
   the difference between an investigation and a rollback.

## What session 12 added: the cutover you cannot rehearse

Everything above assumes the deploy is ours. Some are not. A platform migration
signed off by the client means the store or the account transfers to somebody
else's ownership — and the moment it does, the agency loses access until it is
reconfigured. The realistic estimate in our case: expect 500 errors on merges to
the main branch for 24 to 48 hours, flying blind. Nobody picks that timing. It
lands when the contract lands.

A cutover owned by a third party cannot be rehearsed and cannot be rolled back,
so the levers are different from a normal deploy:

| Normal deploy | Third-party cutover |
| --- | --- |
| Test on staging first | There is no staging for someone else's ownership transfer |
| Roll back if it breaks | You wait for the other side |
| Deploy when it is ready | It happens when the contract lands |
| Alert on errors | **Announce the errors in advance**, so they are not an incident |

That last row is the one people skip and it is the cheapest. During an announced
window, a 500 is expected output. During an unannounced one, three engineers
independently start debugging the same known outage, which is the actual cost.

Two more levers that cost nothing:

**Hold back the piece nobody can QA yet.** The same week, a CDN change carried a
set of crawler-facing files across but deliberately left one page out, because
that page has an account-creation flow nobody had walked through. Ship what you
can verify; park what you cannot. The A/B test on that page waits a week and
loses nothing.

**Choose the hour.** The switch went out once the client's team had gone to sleep.
Not because it was expected to break — because if it did, the people who would
page us were not watching. Timing is a free lever on any change whose blast
radius you cannot fully predict.

## Migrating data: import everything, decide later

The more transferable decision from the same session, and it comes up on every
store transfer.

The question was narrow: a batch of products exists only in the old platform's
export, not on the live store. Import them as **drafts** so the storefront does
not change, or **live** so they behave like real products? And the follow-up: with
roughly 18,000 products per store, many of them disabled in the old system, do
those come across at all?

The decision was **import everything, and import it live.** The reasoning is a
cost comparison rather than a preference, and it is worth being able to
reconstruct:

1. **Draft products hide the bug you are trying to find.** The point of importing
   early was to QA the storefront against real products. A draft that never
   renders a product page proves nothing.
2. **Deleting is cheaper than enumerating.** Getting a definitive keep-or-drop
   list for 18,000 products out of a client costs more, and blocks, than the
   client opening the admin after handover and disabling what they no longer
   sell. Five minutes of their time against days of ours.
3. **Only one data source was actually trustworthy.** One store had good data; the
   rest had drifted. Deciding store by store what is "correct" is a research
   project. Importing and pruning is not.

The detail that makes all of this safe is the one to check before copying the
pattern anywhere else: **the import has to be idempotent.** A later run must update
the existing records rather than creating duplicates, so a too-generous import is
recoverable and a disable-script can follow later. If a re-import created a second
copy of every product, the whole decision flips and you import conservatively
instead.

> **In a migration, make the reversible choice, and check that it really is
> reversible before you rely on it.**

## Until the session

1. Pick a live site you work on and run the ten-minute GA4 orientation from the [analytics lesson](google-analytics-4).
2. Look the same site up on [Treo](https://treo.sh/sitespeed) — is it getting slower over the last year? Would anyone have noticed?
