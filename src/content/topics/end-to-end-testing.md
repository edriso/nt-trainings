---
title: End-to-End Testing
description: A real browser clicking through the real site — the only test that proves the button actually works.
emoji: 🎭
order: 10
status: learned
session: 8
date: 2026-07-30
tags: [testing, e2e, playwright]
resources:
  - title: Playwright
    url: https://playwright.dev/
    note: The tool the industry settled on. Start with the docs, not a tutorial - they are unusually good.
  - title: Best Practices — Playwright
    url: https://playwright.dev/docs/best-practices
    note: Read this before writing test number two. Most E2E pain comes from ignoring the first three rules here.
  - title: Locators — Playwright
    url: https://playwright.dev/docs/locators
    note: The official selector priority order, which is the opposite of what most teams assume. Settles rule 2 in this lesson.
  - title: Auto-waiting — Playwright
    url: https://playwright.dev/docs/actionability
    note: The five actionability checks that run before every click. This page is why you never write a fixed sleep again.
  - title: Trace Viewer — Playwright
    url: https://playwright.dev/docs/trace-viewer
    note: The feature that makes a failure in CI debuggable - a recording of the run you can step through afterwards.
  - title: Authentication — Playwright
    url: https://playwright.dev/docs/auth
    note: How to log in once and let every test reuse it. The answer to our password-protected storefronts.
  - title: Browsers — Playwright
    url: https://playwright.dev/docs/browsers
    note: Read the WebKit section before promising anyone Safari coverage. It is a pre-release WebKit build, not Safari.
  - title: "Just Say No to More End-to-End Tests — Google Testing Blog"
    url: https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html
    note: The strongest argument against this layer, from the people with the most of it. Read it first, not last.
  - title: The Practical Test Pyramid — Martin Fowler
    url: https://martinfowler.com/articles/practical-test-pyramid.html
    note: Where UI tests belong and how few you need. The section on "the pyramid is not about the words" is the useful part.
  - title: "The Forgotten Layer of the Test Automation Pyramid — Mike Cohn"
    url: https://www.mountaingoatsoftware.com/blog/the-forgotten-layer-of-the-test-automation-pyramid
    note: The pyramid from the person who drew it. His point is that the middle layer, not the top, is the one teams skip.
  - title: Eradicating Non-Determinism in Tests — Martin Fowler
    url: https://martinfowler.com/articles/nonDeterminism.html
    note: The systematic guide to why browser tests go flaky and how to fix each cause. This layer's occupational hazard.
  - title: Mocks Aren't Stubs — Martin Fowler
    url: https://martinfowler.com/articles/mocksArentStubs.html
    note: Where stub, fake, spy and mock get their precise meanings. Worth reading once so you stop using them interchangeably.
  - title: "WebDriver — W3C standard"
    url: https://www.w3.org/TR/webdriver2/
    note: The browser-automation standard every browser implements, and the reason modern tools stopped needing a test lab.
---

## The one rule

> **Every other test proves the pieces are right. This one proves a customer can buy.**

An **end-to-end (E2E)** test drives a real browser like a very fast user. It
opens a page, clicks real buttons, types real text, and checks what appears on
the screen. Nothing is mocked, and the test has no idea how the code is
organised underneath.

That last part is the whole point, and Andrej's framing in the session was the
right one:

| This is an E2E test | This is not |
| --- | --- |
| "User uploads a photo, engraves a name, adds to cart, and sees the correct price in the cart." | `formatPrice(1999)` returns `$19.99`. That is a unit test. |

The key word is **journey**, not function. Our automated checks today prove that
pages *render*. They prove nothing about whether anything *works*. E2E is the
only layer that can tell us the *Add to cart* button is still wired to
something.

## Where it sits, and the honest argument against it

The **test pyramid** is a budget: how many of each kind of test to write. Credit
where it is due, because the name gets used as though it were a law of nature.
Mike Cohn drew it in conversation with Lisa Crispin around 2003, described it at
a scrum gathering in 2004, and published it as the "Test Automation Pyramid" in
*Succeeding with Agile* (2009). Jason Huggins arrived at the same idea
independently around 2006, which is a pleasing detail: he is the same person who
started Selenium, so the shape and the tool grew up together. Fowler records the
history on [his bliki](https://martinfowler.com/bliki/TestPyramid.html).

| Layer | Share | Character |
| --- | --- | --- |
| **E2E** | ~10% | slow, expensive, most confidence |
| **Integration** | ~20% | module plus module, usually no browser |
| **Unit** | ~70% | fast, cheap, isolated |

Those percentages come from Mike Wacker's
["Just say no to more end-to-end tests"](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
(Google, April 2015), and the post is worth reading before you advocate for this
layer, because it is written by people drowning in it. Its four complaints are
specific:

1. **Feedback arrives too late.** A big E2E suite cannot finish inside one build
   cycle, so you learn about the break hours after the change landed.
2. **A failure does not localise.** The test says "cart is empty". It does not
   say which of the 26 customizer modules broke.
3. **Flakiness erodes trust**, which is the subject of its own section below.
4. **One broken component gates every release**, because the test spans
   everything.

Wacker's name for getting the ratio backwards is the **ice cream cone**:
hundreds of slow browser tests balanced on no base at all. Worth holding onto,
because it is the exact failure mode a keen team walks into after a good talk on
E2E.

**The counterpoint, which matters more for us.** Kent C. Dodds' "testing
trophy" argues the opposite for frontend-heavy apps: the integration layer pays
best, because unit tests on UI components tend to check implementation rather
than behaviour, so they break on every refactor and buy nothing. Andrej's slide
concedes this is closer to our truth, and he is right. We are almost pure
frontend: Liquid plus web components, with Shopify as a backend we do not test.
Both arguments are recorded in full in [Integration Testing](integration-testing)
and on the [Code Testing](code-testing) map.

**And the question the pyramid raises about us specifically.** We have no unit
tests. The pyramid says start at the bottom. Andrej's answer, which was on his
prepared-questions slide before anyone asked it, is the strongest version of the
case:

> On a project with zero tests, E2E gives the most proven value per day
> invested, because it catches bugs across the whole chain at once. Unit tests
> follow naturally when an E2E fails and you need to localise.

That is a genuine disagreement with Wacker, and neither side is being careless.
The reconciliation is that they are answering different questions. Wacker is
describing what a suite should look like at rest, after years of investment.
Andrej is describing the first fortnight on a codebase with nothing. Starting at
the top and starting *and staying* at the top are different mistakes, and only
the second one is the ice cream cone.

## What one test looks like

Three phases, **Arrange / Act / Assert**, also called Given / When / Then:

| Phase | Also called | What it does |
| --- | --- | --- |
| Arrange | Given | set up state: open the product page, clear the cart |
| Act | When | perform the action: click *Add to cart* |
| Assert | Then | check the result: cart shows 1 item, price is right |

Andrej's example from the session, which is the clearest version of it:

```js
test('engraved pendant reaches the cart with correct properties', async ({ page }) => {
  // Arrange
  await page.goto('/products/heart-photo-locket');

  // Act
  await page.getByTestId('customizer-trigger').click();
  await page.getByTestId('engrave-line-1').fill('Andrej');
  await page.getByTestId('customizer-add-to-cart').click();

  // Assert
  await expect(page.getByTestId('cart-count-live-region')).toHaveText('1');
});
```

The test does not know `custom.customizer-store.js` exists. It only knows what
the user sees.

## Answering John's question: what do you actually test?

John asked the sharpest question of the session, and asked it twice because the
first answer did not fully land: *"You're saying when, but what exactly to
test? We have a lot of behaviours. If the customizer has 10 steps, are we doing
an E2E test for the entire flow, or halfway?"*

He had earned the right to ask. He described a Next.js project with over 1,500
tests that took more than ten minutes to run, where he never wrote a test and
only ever ran them on the command line. That is what the question is really
about: how do you avoid building that.

The answer is not a number, it is a rule:

> **Every flow that earns money or loses customer data gets one test. Nothing
> else does.**

Not a count, and not a coverage percentage. Andrej's slide put the realistic
scale at **15 to 30 tests, not 300**, and organised them in three layers by
priority. This was the most useful slide of the session.

**Layer 1, the critical commercial flow.** About five tests. The revenue path:
if it breaks, we do not sell.

```
PDP loads → customizer opens → text is engraved → preview updates →
Add to cart → cart holds the correct properties (text, font, metal)
and the correct price → checkout opens
```

So the answer to John's "entire flow or halfway" is: the entire flow, once, for
the product family that matters most. Not one test per step. A test per step is
ten chances to be flaky and ten things to maintain, and it still would not prove
the steps work in sequence, which is the only thing E2E is for.

**Layer 2, parity tests per product family.** This is the project-specific win,
and it is the answer to the "10 steps" worry, because it does not multiply
tests, it multiplies data:

```js
const FAMILIES = [
  { handle: 'heart-locket',         faces: 2, expectMask: true  },
  { handle: 'oval-locket',          faces: 2, expectMask: true  },
  { handle: 'fingerprint-keychain', faces: 1, expectMask: false },
];

for (const f of FAMILIES) {
  test(`${f.handle} renders all faces and its mask`, ...);
}
```

One test, N products. Add a family to the table and it is covered. Andrej's
reason for reaching for this is that our gap register is full of "heart works,
oval doesn't" and "birthstone binding doesn't bind", which is precisely the bug
shape a table-driven test catches and a hand-written test per product never
will, because nobody writes the twelfth one.

**Layer 3, fleet smoke per store.** Five stores, shared code plus per-store
data. One test that checks brand tokens are emitted and the customizer opens,
run against each store. This catches the "works on store one, breaks on store
number four" class of bug that is structurally built into a fleet model.

The three layers are also a good answer to the *when* half of John's question,
which is in the pipeline section further down.

## Five rules, and one worth correcting

Four of Andrej's five rules are exactly right and need no elaboration:

1. **Test behaviour, not implementation.** If a test breaks when you refactor
   internals without changing behaviour, the test is wrong.
2. *(see below)*
3. **Never sleep on a fixed timer.** `sleep(2000)` is the main source of
   flakiness. Wait on state, not on a clock.
4. **Isolation and idempotency.** Test 2 must not depend on test 1 having
   passed. Each makes its own data and cleans up.
5. **Deterministic data.** A test that grabs "the first product in the
   collection" breaks when marketing changes the sort order. Pin a specific SKU
   or handle.

Rule 2 is the selector hierarchy, and the session slides had it inverted. The slide says
`data-testid` → ARIA role → visible text → never a CSS class. Playwright's
[own guidance](https://playwright.dev/docs/locators) puts them the other way up:

| Priority | Locator | Why |
| --- | --- | --- |
| 1 | `getByRole()` | "the closest way to how users and assistive technology perceive the page" |
| 2 | `getByLabel()` | form controls, via their real label |
| 3 | `getByPlaceholder()` | inputs with no label |
| 4 | `getByText()` | non-interactive elements: `div`, `span`, `p` |
| 5 | `getByAltText()`, `getByTitle()` | images and tooltips |
| 6 | `getByTestId()` | the explicit escape hatch |
| never | CSS, XPath | the DOM changes; `.btn-primary > div:nth-child(3)` dies at the first redesign |

The half of the rule the slides got right is the important half: **never a CSS
class**. And a test ID is a perfectly legitimate tool, described in the docs as
an "explicit testing contract", which is exactly what our 66 Liquid files full
of `data-testid` already are.

But the ordering is not pedantry, and it is worth understanding why the docs
argue for it. A `getByRole('button', { name: 'Add to cart' })` test fails when
the button stops being reachable as a button, or when its accessible name
disappears. A `getByTestId('add-to-cart')` test passes in both of those cases,
because a `data-testid` survives anything. So the role-based locator is testing
something the test ID cannot see: that the control is still a control, still
labelled, and still usable by a screen reader. You get an accessibility check
for free, on the exact flows you care most about.

The practical rule for us, which keeps both: **reach for `getByRole` first and
fall back to `getByTestId` when the markup gives you nothing to grab.** In a
canvas-heavy customizer that fallback will be often, and that is fine. It should
be a decision, not a default.

## Flaky tests

> A flaky test is worse than a red test. A red test tells you something true.

**Flaky** means the same code passes and fails on different runs. It is this
layer's occupational hazard, and Tom named it as his own experience with E2E:
"flaky tests are really hard to get around... it's like *wait five seconds and
then click and hope that everything loaded*". Which is exactly the mechanism.

The causes and their fixes, from the session:

| Cause | Fix |
| --- | --- |
| Fixed waits | auto-wait on a condition, not on a clock |
| Animations, transitions | wait for `animationend`, or disable animations in test mode |
| Shared state between tests | a fresh browser context per test |
| External APIs | mock third parties, never your own backend |
| Races on lazy-loaded modules | wait for a visible ready marker, not a timer |
| Time, timezone, randomness | freeze the clock, seed the random |

The first row is mostly solved by the tool, and it is worth knowing the
mechanism rather than trusting the word "auto-wait". Before every action,
Playwright runs [five actionability checks](https://playwright.dev/docs/actionability)
and retries until they pass:

| Check | Means |
| --- | --- |
| **Visible** | has a non-empty bounding box, and is not `visibility: hidden` |
| **Stable** | same bounding box for two consecutive animation frames |
| **Receives events** | is the actual hit target at the click point, so no overlay is stealing it |
| **Enabled** | not `disabled`, and not inheriting disabled from a parent |
| **Editable** | enabled, and not `readonly` |

The "stable" check is the one that quietly removes Tom's whole category of pain:
a button sliding in under a CSS transition is not clickable yet, and Playwright
knows that without being told. The "receives events" check catches the bug you
would otherwise spend an afternoon on, where the click lands on an invisible
overlay and the test reports that the button did nothing.

**The policy matters more than the fixes.** Andrej proposed one, and it is the
right one:

> A flaky test gets quarantined and ticketed within 24 hours. Not "re-run until
> green".

Auto-retry until green hides a real race condition and converts it into a
production incident nobody will ever trace back to that test. The measured case
for taking this seriously is in [Regression Testing](regression-testing): across
4.2 million tests, Google found that **84% of green-to-red transitions were
flakiness rather than a real bug**. Once that is true on a team, everyone learns
to press re-run, including on the one time in six that found something. That is
how a suite dies: not deleted, just disbelieved.

## Picking a tool, and two claims to correct

| Tool | Strength | Weakness |
| --- | --- | --- |
| **Playwright** | all three engines, auto-wait, trace viewer, parallel by default, free | younger ecosystem than Cypress |
| **Cypress** | excellent developer experience, time-travel debugging | weak multi-browser, paid dashboard |
| **Selenium** | industry standard, every language | verbose, manual waits, most flake |
| **Puppeteer** | lightweight | Chrome only, and not a test framework |

Playwright is the right pick for us, and the three reasons given in the session hold. Two
statements around it need correcting, both worth the paragraph because both
would change a decision.

**Playwright is free, with no test limit.** Andrej said in the room that
"Playwright is actually free, but building more than, I don't know, 30 tests is
a paid version". That is not the case, and his own slide says "free" correctly,
so this was a slip in the telling rather than in the research. Playwright is
[Apache 2.0](https://github.com/microsoft/playwright/blob/main/LICENSE): no test
cap, no seats, no fee, commercial use fine. Nothing about the number of tests
you write is metered.

The confusion is real, though, and it belongs to the other tool. **Cypress
Cloud** has a free tier of 500 test results a month across 3 users, and when you
exceed it, parallelisation switches off and new results stop appearing in the
dashboard. That is a hosted-dashboard limit, not a framework limit, and it is a
genuine reason to prefer Playwright: the features Cypress puts behind that meter,
parallel runs and a result history, are in the Playwright package.

**"WebKit" is not "Safari".** The strongest argument for Playwright is
that its WebKit engine tests Safari and iOS, and that this matters to us because
the customizer has known mobile-keyboard problems. The argument survives, but
weaker than stated. Playwright's WebKit is built from WebKit main, often ahead
of what Apple has shipped, and [the docs are explicit](https://playwright.dev/docs/browsers)
that it "doesn't work with the branded version of Safari since it relies on
patches". Two consequences:

- `devices['Desktop Safari']` is a user-agent and viewport preset on that build.
  It is emulation, not Safari.
- Anything living in Safari's browser layer rather than the engine is out of
  scope: Apple Pay, extensions, `WKWebView` behaviour, and ITP as actually
  shipped.

Also, feature fidelity depends on the host OS, so for anything media-related the
docs recommend running WebKit on macOS rather than the cheaper Linux runner.

The honest version: Playwright WebKit is a **pre-release WebKit engine check**.
It will catch engine-level regressions early, which is genuinely valuable and
which Chrome-only tooling cannot do at all. It will not settle "does this work
on my customer's iPhone". For a mobile-keyboard bug specifically, that still
wants a real device.

## Where it goes in the pipeline

Two insertion points, and Tom designed most of this out loud in the session.

**Pre-merge, on the pull request.** Layer 1 only, against a staging theme. It
blocks the merge, so the bug never reaches `main`.

**Post-deploy, before the release is stamped good.** Layers 2 and 3. If it fails
on live, that is a rollback signal.

Tom's version added a constraint worth keeping: run the full thing **after merge
to main, not on every commit of every PR**. His reasoning was about attention
rather than compute. A check that runs on every push trains people to ignore it;
a check that runs on merge is something you either watch for fifteen minutes or
get told about by a Slack bot. He also drew the line at production: "we just
don't want to hammer prod with a lot of bots." The session agreed and was more
precise about where the line falls. Read-only smoke against production is fine.
Anything that writes, meaning add to cart and checkout, runs against staging or
uses test-mode payments. Never a real transaction on a live store.

The other idea of Tom's is the one to build first, because it is cheap and it
changes daily life:

> **Scope tests to categories, and write the category names down where Claude
> will read them.** "I'm building a feature on the customizer, so run only the
> customizer-tagged tests." It skips home-to-category-to-product and goes
> straight to the flow you are touching, so you run it locally in seconds instead
> of pushing to CI to find out.

Playwright supports this directly through tags and projects, and it composes
with the three layers above: layer 1 is your pre-merge tag, layers 2 and 3 are
the nightly and post-deploy set.

## Keeping the suite alive, the session's best idea

Andrej's other proposal was to stop treating test-writing as a separate chore:
have a skill or a hook notice when a critical flow changes, and have a subagent
update or add the E2E test in the same pass as the feature.

Tom's answer sorted it into the right box, and the distinction is the useful
part. If it is something we do *every time we build something*, it does not
belong in a one-off prompt. It belongs in `CLAUDE.md` and the docs the model
already reads, so it happens by default rather than when someone remembers.

This lines up with the rule that came out of session 7 and has research behind
it: [DORA](https://dora.dev/capabilities/test-automation/) found delivery
performance improves when **developers**, not a separate QA group, own the
automated tests. Andrej's slide says the same thing in one line: the developer
who writes the feature writes its E2E test, in the same pull request. Hand it to
someone else and the tests permanently lag the code.

Andrej's own story is the argument for it, and Muhammad supplied the detail from
chat, being unable to use his mic that morning. Andrej's Scandiweb hiring
assignment was to build a project in a month, and the E2E suite came with it: you
ran the tests to find out whether what you built was finished. The suite was the
specification. That is the version of this that works, and it only works when the
tests arrive with the feature.

**The velocity objection, which is fair.** John's worry about test-driven
development was that it slows you down: you reason out how the test should look,
then start implementing and realise the test needs rewriting. That is a real cost
and the team already found the compromise in session 5, recorded in
[Unit Testing](unit-testing): test first when the rule is already known, test
after while you are still discovering the shape. E2E happens to sit on the
comfortable side of that line. A checkout journey is the one requirement that is
never ambiguous, so writing the test first costs nothing here even if it would
cost something on a vague ticket.

## What E2E does not solve

Andrej raised this deliberately, and said why: a proposal that oversells gets
rejected on the first hard question. It was the most professional moment of the
session.

| It does not prove | That is |
| --- | --- |
| the design is pixel-correct | visual regression testing, covered in [Regression Testing](regression-testing) |
| accessibility | an audit, with axe |
| performance | Lighthouse or load testing, see [Web Performance](web-performance) |
| *where* the break is | a unit test's job. E2E tells you *that* it broke |

And it is not free. A 200-test suite can take 40 minutes and needs constant
maintenance, which is John's 1,500-test project seen from the other end.

The hardest case for us is the one Andrej conceded rather than argued, which is
why it is worth trusting the rest of it: **how do you test a canvas?** E2E
can check the canvas drew something and is not blank by reading pixels, and it can
check the cart properties that result. "Does the photo mask render a heart
instead of a square" needs visual regression, which is a separate step and not
part of this proposal.

## Terms people confuse

| Term | How it differs from E2E |
| --- | --- |
| **Integration test** | two or more modules, usually with no browser. E2E goes through every layer including the UI. See [Integration Testing](integration-testing) |
| **Smoke test** | a subset: is the app breathing at all. We have this, and it never clicks a button |
| **Regression test** | guards a fixed bug from returning, and can live at any level. See [Regression Testing](regression-testing) |
| **UAT** | a human confirming the solution meets the business need. E2E is a machine confirming the flow technically works |

Worth reading alongside the two-axis idea from session 7: unit, integration and
E2E are levels of **scope**, while regression, confirmation and smoke are
statements of **intent**. One file is routinely both.

**Test doubles**, since the session listed them and the words get swapped around. The
taxonomy is Gerard Meszaros' from *xUnit Test Patterns* (2007), and Fowler's
["Mocks Aren't Stubs"](https://martinfowler.com/articles/mocksArentStubs.html) is
the readable version:

| Double | What it does |
| --- | --- |
| **Stub** | returns a canned answer |
| **Mock** | a stub that also asserts it was called correctly |
| **Fake** | a working but simplified implementation, such as an in-memory database |
| **Spy** | records calls without changing behaviour |

In a true E2E test you mock **nothing of your own**. At most you mock third
parties: the payment gateway, analytics.

## Try it yourself

1. **Record a test without writing one.** In any project, run
   `npm init playwright@latest`, then `npx playwright codegen <url>`. Click
   through a flow and watch it write the code. Ten minutes, and it is the fastest
   way to understand what this layer actually is.
2. **Check the selector rule on real markup.** Open a product page on a store you
   work on and pick one control you would need to click in a test. Can you reach
   it with `getByRole('button', { name: ... })`? If not, that is either a missing
   test ID or a missing accessible name, and knowing which is the useful part.
3. **Argue the other side.** Read Mike Wacker's
   [Just say no to more end-to-end tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
   and come back with the strongest objection to Andrej's phase 1. If the plan
   survives it, that is worth knowing before we spend two days.
4. **Name your one test.** Pick the single journey on a store you work on that
   would cost us money if it broke silently tonight. Write it out as
   Arrange / Act / Assert in three lines of plain English. That is the first test,
   and probably the only one that matters for a while.
