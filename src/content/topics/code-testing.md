---
title: Code Testing & the Testing Pyramid
description: Unit, integration, component, and end-to-end tests — what each one is for, and how much of each to write.
emoji: ✅
order: 10
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
  - title: "Software Engineering at Google, ch. 11 — Testing Overview"
    url: https://abseil.io/resources/swe-book/html/ch11.html
    note: How one very large codebase thinks about test size and scope. Free to read online.
---

## Why this topic is coming up

> **Tests are what let you change code without fear.**

Every feature we ship becomes code someone edits later. Without tests, each
change is a gamble — *did I just break checkout?* Tests turn that gamble into a
quick, automated answer, which is exactly what lets a team move fast *and* sleep
at night.

Rather than one big session, we are walking up the pyramid one layer per
session, each presented by whoever knows that layer best. This card is the map;
the full lesson lands once we have climbed the whole thing.

## The layers, and who is covering them

The **testing pyramid** is really a budget: how many of each kind of test to
write.

| Layer | What it checks | Session |
| --- | --- | --- |
| **Unit** | One function on its own. Tiny, fast, run in the thousands | ✅ Covered — see the **Unit Testing** topic (Mohamed, session 5) |
| **Integration** | A few pieces working together, e.g. a form calling a fake API. Often the best confidence per line of test | Next — Sara |
| **Component** | A UI component rendered and clicked the way a user would | Planned |
| **End-to-end (E2E)** | A real browser driving the whole app, like a robot user going through checkout. Slow and precious; keep them few | Planned |
| **Regression** | Confirming the features that already worked still work after a change | Planned — John |

The trade-off the pyramid captures: as you climb, tests get **slower, costlier,
and flakier**, but each one proves *more* about the real experience.

## The argument we still have to settle

Two things came up in the unit-testing session that this lesson has to answer
properly:

1. **How much of each layer?** Kent C. Dodds' "testing trophy" argues front-end
   teams should lean on **integration** tests over unit tests, because that is
   where the confidence per hour spent is highest. The classic pyramid says the
   base should be widest. We will land on something that fits client work.
2. **Test first, or test after?** The team split on test-driven development: it
   removes guesswork when the requirement is already known, and it duplicates
   effort when the ticket is still ambiguous — which most of ours are. The
   working compromise is written up in the **Unit Testing** lesson; the strategy
   version belongs here.

## Until the session

1. Open a project you work on. Does it have tests? If so, which layer are they —
   unit, integration, or E2E?
2. Read Kent C. Dodds'
   "[Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)"
   and come with one point you agree or disagree with.
3. Ask yourself the honest question for your current ticket: if this broke
   quietly tomorrow, which layer of test would have caught it?
