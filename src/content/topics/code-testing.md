---
title: Code Testing & the Testing Pyramid
description: Unit, integration, component, and end-to-end tests — what each one is for, and how much of each to write.
emoji: ✅
order: 30
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
| **Unit** | One function on its own. Tiny, fast, run in the thousands | ✅ [Unit Testing](unit-testing) (Mohamed, session 5) |
| **Integration** | A few pieces working together — a route and its real database, or a form and a fake API. Often the best confidence per line of test | ✅ [Integration Testing](integration-testing) (Sara, session 6) |
| **Regression** | Confirming the features that already worked still work after a change | ✅ [Regression Testing](regression-testing) (John, session 7) |
| **End-to-end (E2E)** | A real browser driving the whole app, like a robot user going through checkout. Slow and precious; keep them few | Next — Andrej, see [End-to-End Testing](end-to-end-testing) |
| **Component** | A UI component rendered and clicked the way a user would | Planned |
| **Smoke** | The "is it alive at all" check straight after a deploy | Partly covered in [Regression Testing](regression-testing) — see also [Maintaining Live Sites](maintaining-live-sites) |

The trade-off the pyramid captures: as you climb, tests get **slower, costlier,
and flakier**, but each one proves *more* about the real experience.

The layers are not the whole strategy, either. Two things sit outside the
pyramid and catch what it cannot: **types and linting** underneath it (a
compile error is the cheapest possible test), and **error monitoring** above it,
because production is where you find the bugs nobody thought to test for.

## One thing the layers list gets wrong

Worth flagging on the map itself, because it is the confusion the sessions kept
running into: the six rows above are not all the same kind of thing.

- **Unit, integration, component and E2E** are levels of **scope** — how much of
  the system is real when the test runs.
- **Regression and smoke** are statements of **intent** — why you are running it
  this time.

They are two axes, not one list. A single test file is routinely a unit test by
scope *and* a regression test by intent, which is why "is this an integration
test?" never had a clean answer. Session 7 worked this out; the full argument is in
[Regression Testing](regression-testing).

## The argument we still have to settle

Three things are still open once we finish climbing:

1. **How much of each layer, for our kind of work?** Both sides are written up
   in [Integration Testing](integration-testing) — Google's roughly 80/15/5
   pyramid against Kent C. Dodds' "testing trophy", which argues front-end teams
   get the most confidence per hour from integration tests. Neither is wrong; the
   mix depends on whether your risk sits in logic or in wiring. What we still owe
   ourselves is a default for a *new client project* on day one.
2. **Test first, or test after?** The team split on test-driven development: it
   removes guesswork when the requirement is already known, and it duplicates
   effort when the ticket is still ambiguous — which most of ours are. The
   working compromise is in [Unit Testing](unit-testing); the strategy version
   belongs here.
3. **What blocks a merge?** Tests existing and tests *gating* are different
   decisions. Which checks are required, which are advisory, and what happens on
   a red suite at 5pm on a Friday.

One axis that is *not* still open, and that cuts across every row of the table:
Bach and Bolton split the word *testing* itself. **Checking** is verifying a
proposition that can be true or false — a machine does that better than you, on
every push. **Testing** is exploring to find the propositions nobody wrote down,
and only a person does that at all. Every layer above is a place to put checks;
none of them replaces the looking-around part. The split, and what it means for
what goes in a pull request, is in [Proving It Works](proving-it-works).

## Until the session

1. Open a project you work on. Does it have tests? If so, which layer are they —
   unit, integration, or E2E?
2. Read Kent C. Dodds'
   "[Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)"
   and come with one point you agree or disagree with.
3. Ask yourself the honest question for your current ticket: if this broke
   quietly tomorrow, which layer of test would have caught it?
