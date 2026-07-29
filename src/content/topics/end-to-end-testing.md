---
title: End-to-End Testing
description: A real browser clicking through the real site — the only test that proves the button actually works.
emoji: 🎭
order: 10
status: up-next
tags: [testing, e2e, playwright]
resources:
  - title: Playwright
    url: https://playwright.dev/
    note: The tool the industry settled on. Start with the docs, not a tutorial — they are unusually good.
  - title: Best Practices — Playwright
    url: https://playwright.dev/docs/best-practices
    note: Read this before writing test number two. Most E2E pain comes from ignoring the first three rules here.
  - title: Trace Viewer — Playwright
    url: https://playwright.dev/docs/trace-viewer
    note: The feature that makes a failure in CI debuggable — a recording of the run you can step through afterwards.
  - title: "Just Say No to More End-to-End Tests — Google Testing Blog"
    url: https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html
    note: The strongest argument against this layer, from the people with the most of it. Read it first, not last.
  - title: The Practical Test Pyramid — Martin Fowler
    url: https://martinfowler.com/articles/practical-test-pyramid.html
    note: Where UI tests belong and how few you need. The section on "the pyramid is not about the words" is the useful part.
  - title: Eradicating Non-Determinism in Tests — Martin Fowler
    url: https://martinfowler.com/articles/nonDeterminism.html
    note: The systematic guide to why browser tests go flaky and how to fix each cause. This layer's occupational hazard.
  - title: "WebDriver — W3C standard"
    url: https://www.w3.org/TR/webdriver2/
    note: The browser-automation standard every browser implements, and the reason modern tools stopped needing a test lab.
---

## Why this topic is coming up

> **Every other test proves the pieces are right. This one proves the site works.**

Andrej presents this one, the day after John's
[regression testing](regression-testing) session — and it is the layer that closes
the biggest hole we actually have.

Our automated checks today prove that pages **render**. They prove nothing about
whether anything **works**: add to cart, the customizer, checkout. An
**end-to-end (E2E)** test drives a real browser like a very fast user — clicking,
typing, waiting — so it is the only kind of test that can tell us the *Add to
cart* button is still wired to anything.

## What the session should answer

- **Where the line is.** Tom asked in session 6 whether clicking a button through
  an automated browser counts as an integration test. The answer, and why the label
  matters less than the two questions underneath it, is in
  [Integration Testing](integration-testing). The short version: this is a
  different layer, and it does not replace the one below it.
- **How few is enough.** Google's own testing team published
  ["Just say no to more end-to-end tests"](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
  and suggested a mix of roughly **70% unit, 20% integration, 10% E2E** — because
  these are the tests that go flaky, take an afternoon to debug, and then get
  ignored. Anyone advocating for this layer should be able to argue the other side.
- **Why they go flaky, and the fixes.** Timing, shared state, test order, real
  networks. Playwright's auto-waiting removes a whole category, and
  [Fowler's guide](https://martinfowler.com/articles/nonDeterminism.html) covers
  the rest cause by cause. This is the session's most useful half hour.
- **Debugging a failure you cannot see.** A test that fails only in CI is the
  normal case. [Trace Viewer](https://playwright.dev/docs/trace-viewer) records the
  run — DOM snapshots, network, console — so you can step through it afterwards
  instead of guessing.
- **The journeys worth the cost.** For us that is almost certainly: product page →
  configure → add to cart → cart → checkout reachable. One per store, money-path
  only.

## What it would change for us

Concretely: a post-deploy smoke check can prove every key template still
**renders** — and that is where our automated checks currently stop. It cannot tell
you the *Add to cart* button is still wired to anything, that a product customiser
still saves what the shopper picked, or that checkout is reachable. Every item on
that list is an end-to-end test, and nothing below this layer can substitute for
one. The gap is spelled out in the
[regression testing](regression-testing) lesson.

## Until the session

1. Install Playwright on any project (`npm init playwright@latest`) and record one
   test with `npx playwright codegen <url>` — clicking through a flow and watching
   it write the code is the fastest way to understand what this layer is.
2. Read Playwright's [best practices](https://playwright.dev/docs/best-practices)
   page. Come with one rule you think we would break immediately.
3. Pick the one journey on a store you work on that would cost us money if it broke
   silently. That is the first test, and probably the only one that matters for a
   while.
