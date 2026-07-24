---
title: Code Testing & the Testing Pyramid
description: Unit, integration, component, and end-to-end tests — what each one is for, and how much of each to write.
emoji: ✅
order: 9
status: up-next
tags: [testing, quality, ci]
resources:
  - title: The Test Pyramid — Martin Fowler
    url: https://martinfowler.com/bliki/TestPyramid.html
    note: The canonical write-up — many fast unit tests at the base, few slow end-to-end ones at the top.
  - title: "Write tests. Not too many. Mostly integration. — Kent C. Dodds"
    url: https://kentcdodds.com/blog/write-tests
    note: The popular counter-take (the "testing trophy") — favour integration tests for the most confidence per effort.
  - title: Pyramid or Crab? Find a testing strategy that fits — web.dev
    url: https://web.dev/articles/ta-strategies
    note: A balanced tour of the pyramid, trophy, honeycomb… and how to pick one for your own project.
---

## Why this topic is coming up

> **Tests are what let you change code without fear.**

Every feature we ship becomes code someone edits later. Without tests, each
change is a gamble — *did I just break checkout?* Tests turn that gamble into a
quick, automated answer, which is exactly what lets a team move fast *and* sleep
at night. Sara suggested we cover the shape of a healthy test suite next.

## What we will cover

The **testing pyramid** — a simple budget for how many of each kind of test to
write:

- **Unit** — one function or component in isolation. Tiny, fast, run in the
  thousands.
- **Integration** — a few pieces working together (a form calling a fake API).
  Often the sweet spot for confidence per line of test.
- **Component** — a UI component rendered and clicked the way a user would.
- **End-to-end (E2E)** — a real browser driving the whole app, like a robot user
  clicking through checkout. Slow and precious; keep them few.

The trade-off the pyramid captures: as you climb, tests get **slower, costlier,
and flakier**, but each one proves *more* about the real experience. We will
also weigh the popular counter-view — Kent C. Dodds' "testing trophy," which
argues front-end teams should lean on **integration** tests over unit tests —
and land on something that fits our projects.

## Until the session

1. Open a project you work on. Does it have tests? If so, which layer are they —
   unit, integration, or E2E?
2. Read Kent C. Dodds'
   "[Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)"
   and come with one point you agree or disagree with.
