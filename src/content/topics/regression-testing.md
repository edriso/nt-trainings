---
title: Regression Testing
description: Proving the things that already worked still work — after every change, without testing everything by hand.
emoji: 🔁
order: 9
status: learned
session: 7
date: 2026-07-29
tags: [testing, regression, ci]
videos:
  - title: "GTAC 2016: How Flaky Tests in Continuous Integration (Google TechTalks)"
    youtubeId: CrzpkF1-VsA
resources:
  - title: "regression testing — ISTQB Glossary"
    url: https://glossary.istqb.org/en_US/term/regression-testing
    note: The standard definition, in one sentence. Also settles the regression-vs-confirmation confusion.
  - title: SelfTestingCode — Martin Fowler
    url: https://martinfowler.com/bliki/SelfTestingCode.html
    note: The goal behind the whole idea — a suite you trust enough to let it tell you the build is good.
  - title: "The State of Continuous Integration Testing @Google"
    url: https://research.google.com/pubs/archive/45880.pdf
    note: Where the numbers in this lesson come from. Slide 20 — only 1.23% of their 4.2M tests ever caught a break — is the one to read before arguing for retest-all.
  - title: "A Safe, Efficient Regression Test Selection Technique — Rothermel & Harrold (1997)"
    url: https://www.cs.purdue.edu/homes/xyzhang/fall07/Papers/p173-rothermel.pdf
    note: The paper that defined "safe" test selection, and proved you cannot be both safe and minimal. Section 4 has the numbers.
  - title: "Predictive Test Selection — Machalica et al. (2018)"
    url: https://arxiv.org/abs/1810.05286
    note: How Facebook replaced the hand-written map with a learned model. The modern answer to "which tests should I rerun?"
  - title: "Flaky Tests at Google, and How We Mitigate Them"
    url: https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html
    note: What happens to a big regression suite over time, and what it costs. Read before you have this problem.
  - title: "Test automation — DORA capabilities"
    url: https://dora.dev/capabilities/test-automation/
    note: The research answer to "who should own the failing test?" — and why a flaky suite cancels the benefit.
  - title: Visual comparisons — Playwright
    url: https://playwright.dev/docs/test-snapshots
    note: The official how-to for catching visual regressions by comparing screenshots to a committed baseline.
  - title: StrykerJS — mutation testing
    url: https://stryker-mutator.io/
    note: How to test your tests. Breaks your code on purpose and tells you which breaks the suite failed to notice.
  - title: "Test and debug Shopify Functions"
    url: https://shopify.dev/docs/apps/build/functions/test-debug-functions
    note: The first-party answer to Sara's find — fixture-driven integration tests that run the real compiled WASM binary.
  - title: Shopify Lighthouse CI GitHub Action
    url: https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci
    note: The closest thing to an automated regression gate for a Liquid theme. Audits home, product and collection on every PR.
  - title: Theme Check
    url: https://shopify.dev/docs/storefronts/themes/tools/theme-check
    note: Our current Liquid safety net — and worth knowing exactly what a linter cannot catch.
  - title: Selenium history
    url: https://www.selenium.dev/history/
    note: Straight from the project. Useful context for why Tom's "teams of Selenium engineers" era looked the way it did.
decks:
  - title: Regression Testing (July 2026)
    file: regression-testing-2026-07.pdf
    note: John's session slides — the three approaches, the cycle, and the takeaways. Slide 5's chart is labelled illustrative; the measured numbers are in this lesson instead.
---

## The one rule

> **New code is guilty until the existing tests prove otherwise.**

That is John's closing line from the session, and it is the whole topic in one
sentence. A **regression** is when something that used to work stops working.
Regression testing is the deliberate answer to *"we fixed the bug, but did we
break three other things?"* — the question no amount of careful coding makes go
away.

Why we care right now: we are five people editing shared themes, often with AI
help. John's example was exact — imagine Mohamed builds step one of the
customizer, John builds step two, and the model helpfully "tidies" step one on
the way past. Step two works. Step one is broken, nobody looked at it, and it
ships. That is a regression, and the only thing that catches it cheaply is a test
that was already there.

## Three words the session mixed together

Mohamed asked the sharpest question of the session: *what is the difference
between regression testing and feature testing — are they different things?*
John's answer in the room was "regression can be part of feature testing", which
is true but leaves the words blurry. Here it is properly.

| Term | The question it asks | When it runs |
| --- | --- | --- |
| **Confirmation testing** (or retesting) | Is the bug I just fixed actually gone? | Once, on the fix |
| **Regression testing** | Did fixing it break anything that used to work? | Forever after, on every change |
| **Feature testing** | Does the new thing do what the ticket said? | While building the new thing |

[ISTQB](https://glossary.istqb.org/en_US/term/regression-testing) draws the first
line most people blur: re-running the exact test that caught the bug is
**confirmation**, not regression. Regression is everything *else* you run to check
the fix did no collateral damage. Two different jobs.

And the third line is the one that matters day to day:

> **Every test you keep becomes a regression test the day after you write it.**

You do not write "a regression test". You write a feature test today, and
tomorrow — when someone else edits near it — that same test is doing regression
duty. Which is why "regression testing" describes a *job your existing suite
does*, not a folder in your repo.

## Tom's reframe, and the one correction it needs

Tom made the best observation in the session: regression, integration and feature
testing "are almost all the same thing" — same frameworks, same files — and what
changes is *the lens you look through*. Regression looks backwards at code that
already exists; integration looks at whether the new thing works end to end.

That is right, and it is worth sharpening by one degree:

- **Unit, integration and end-to-end** are levels of **scope** — how much of the
  system is real when the test runs. See [Unit Testing](unit-testing) and
  [Integration Testing](integration-testing).
- **Regression, confirmation and smoke** are statements of **intent** — why you
  are running it this time.

So they are not competing labels; they are two different axes. A single Vitest
file can be a unit test (scope) and a regression test (intent) at the same time,
and usually is. This is why John could not cleanly separate them and why nobody
in the room could either: the question "is this a regression test?" has no answer
until you ask "when are you running it, and what are you hoping it tells you?"

## Who fixes the red test?

Mohamed's follow-up: *if my change breaks your test, who updates it — me or you?*

John's answer was "whoever is implementing the feature", with the exception that
if the fix genuinely belongs on his side, it is his. That is exactly right, and
there is research behind it rather than just team preference.
[DORA](https://dora.dev/capabilities/test-automation/) — the long-running study
behind *Accelerate* — found that **when developers are primarily responsible for
creating and maintaining the automated tests, delivery performance improves.**
Not testers, not a separate QA team: the people writing the code.

So the working rule:

1. **You broke it, you own it.** A red test on your branch is your problem until
   proven otherwise, even if you did not write the test.
2. **Read it before you change it.** The test is a claim about behaviour someone
   agreed to. If your change makes that claim false on purpose, update the test
   *and say so in the pull request*. If it makes it false by accident, you found
   your bug.
3. **Never delete a red test to go green.** That is the single move that turns a
   suite into decoration.

The trap in point 2 is real and worth naming, because it is the easiest way to
lose the whole benefit: a test you edit until it passes is not a test. If you
cannot explain *why* the old expectation was wrong, the old expectation was
probably right.

## Which tests to rerun — and what is actually measured

The deck's three approaches are the standard framing, and they are a good mental
model:

| Approach | What runs | Deck's cost note |
| --- | --- | --- |
| **Retest-all** | Every case in the suite | Total coverage, highest cost |
| **Selective** | Only the tests mapped to what changed | Targeted, low cost |
| **Progressive** | New tests for the new feature, plus a check it did not disturb the old | New + old, medium cost |

The deck also flags its own catch, and it is the important sentence on the slide:
*"selective runs depend on a trustworthy map of which tests cover which code —
without it, you are guessing."* That map is the entire difficulty. Everything
below is about how real teams build one.

**One honest note on the chart.** Slide 5 plots coverage against cost —
retest-all at 100/100, selective at 65/30, progressive at 80/55 — and labels
itself *"Illustrative relative values."* It is a shape, not a measurement, and
the deck is straight about that. The measured numbers are more interesting than
the illustration, and they point somewhere slightly different.

**What the foundational paper found.** Gregg Rothermel and Mary Jean Harrold's
[*A Safe, Efficient Regression Test Selection Technique*](https://www.cs.purdue.edu/homes/xyzhang/fall07/Papers/p173-rothermel.pdf)
(1997) is where the vocabulary comes from. A technique is **safe** if it selects
*every* test that could reveal a fault — you give up no bug-finding power, only
run time. Two results are worth carrying around:

- On small programs (a few hundred lines), their tool selected **55.6%** of the
  suite on average — a 44% saving.
- On a 49,316-line system with 1,035 tests, it selected **4.8%** — cutting over
  **95%** of the run, and 82–93% of the wall-clock time.

Selection gets *better* the bigger the codebase, which is the opposite of the
instinct that it is a shortcut for small projects. The other finding is a hard
limit worth knowing: you **cannot** have a technique that is both safe and
perfectly minimal. Some tests you rerun will turn out to have been unnecessary.
That waste is the price of safety, and it is not a bug in your tooling.

**The number that should change how you think about retest-all.** Google analysed
a month of results across 4.2 million tests
([slides](https://research.google.com/pubs/archive/45880.pdf)) and found that
**only 1.23% of their tests ever caught a break at all.** Not 1.23% per run —
ever. The other 98.77% ran, passed, cost money, and never once earned it. That is
the strongest argument for selection anyone has produced, and it is empirical
rather than a rule of thumb.

The same analysis found what makes a change risky, which is how you build the map
without a research team:

- Files that change **frequently** are more likely to break something.
- Files touched by **three or more different developers** are more likely to break
  something.
- Changes **closer in the dependency graph** to a test are more likely to break it.

**Where the industry went next.** Facebook replaced the hand-written map with a
learned one — [Predictive Test Selection](https://arxiv.org/abs/1810.05286)
(2018) trains a model on historical pass/fail data to predict which tests a given
change is likely to break. In production it caught **more than 99.9%** of
regressions while running about **a third** of the tests that even
*could* be affected. Google built the same kind of thing. We are nowhere near
needing this, but it is useful to know the ceiling: the answer to "which tests
should I rerun?" is a solvable data problem, not a matter of taste.

For us, at our size, the deck's rules of thumb are the right call — with one
addition that comes straight out of the Google findings:

> Scope the run to the risk, and treat **shared** code as high-risk regardless of
> how small the diff looks. A one-line change to a snippet six templates include
> is a bigger change than fifty lines in one section.

## The tax nobody budgets for

John's takeaway — *every failure is information, never mute it* — is the correct
principle, and it gets hard for a measurable reason. From the same Google data:

| Measurement | Google's number |
| --- | --- |
| Tests with *some* level of flakiness | almost **16%** of 4.2M tests |
| Test executions returning a flaky result | a steady **1.5%** |
| **Pass → fail transitions caused by flakiness, not by a real bug** | **84%** |
| Compute spent re-running tests to identify flakes | **2–16%** |

That 84% is the one to remember, and it is worth reading precisely: of all the
moments a test **went from green to red**, roughly five in six were flakiness
rather than a real break. Once that is true on your team, everybody learns to press
re-run — including on the one time in six that found a real bug. This is how a
suite dies: not deleted, just disbelieved.

The talk those numbers come from is in **Watch** below — worth the time, because it
is the same people explaining what they did about it. Their honest conclusion is
worth quoting, because it is not "eliminate flakiness":
*"Testing systems must be able to deal with a certain level of flakiness."* Their
insertion rate roughly matched their fix rate despite dedicated effort. What they
built instead was infrastructure — automatically re-running a failure transition
**10 times** to classify it, and keeping a database of known-flaky tests so a
human never has to guess.

DORA's version of the same rule is the one to hold us to:
*"when the tests pass we should be confident the software is releasable, and test
failures should indicate a real defect."* A suite that fails for other reasons is
not a cheaper suite. It is a suite with a broken output.

The practical move at our size: when a test flakes, it gets **fixed or
quarantined the same day**, with an owner. Not muted, not ignored, and not left
red — a permanently red check trains everyone to stop reading checks.

## How do you know the suite would catch anything?

This did not come up in the session, and it is the question hiding under the whole
topic. Your suite is green. Would it actually go red if someone broke something?

Coverage does not answer that — it tells you a line *ran*, not that anything
checked the result. **Mutation testing** answers it directly: the tool changes
your code on purpose (flips a `>` to `>=`, deletes a line, swaps `true` for
`false`), reruns your tests, and reports which changes your suite failed to
notice. A change nobody caught is a "survived mutant" — a real gap, in a specific
place, with the exact line named.

[StrykerJS](https://stryker-mutator.io/) does this for JavaScript and TypeScript
and has [a Vitest runner](https://stryker-mutator.io/docs/stryker-js/vitest-runner/),
which is the runner our Shopify function tests already use — so this is a thing
we could try this week rather than a nice idea.

Run it once on a suite you are proud of. It is humbling in a useful way, and it is
the only tool that reliably finds the test you *thought* you wrote.

## The break no assertion catches

The class of regression the session did not reach: the layout that shifted, the
button that went white on white, the modal that now opens behind the header.
Every assertion passes. The page is broken.

**Visual regression testing** compares a screenshot against a committed baseline
image and fails on the difference.
[Playwright's `toHaveScreenshot()`](https://playwright.dev/docs/test-snapshots)
is the standard way, and the workflow is: commit the baseline, and when a diff
appears, either fix the code or accept the new baseline deliberately.

The catch that will cost you an afternoon: **a Linux CI runner renders text
slightly differently from your laptop**, so baselines taken locally fail in CI
forever. The fix is to generate baselines in the same environment that checks
them — in practice, in Docker or by committing whatever CI produced. Budget for
this before you promise anyone screenshot tests.

Worth knowing for us specifically: this is the *only* automated technique that
catches a purely visual break in a Liquid theme, which is a large share of what
we actually ship.

## Answering John's question: how do you test a Liquid theme?

John asked this at the end and nobody in the room had an answer: *"I'm not sure
how to unit test with Liquid — has anyone ever done that anywhere?"* It is the
most useful question of the session, because it is the gap between the theory and
the work most of us do. Here is the researched answer, including the dead ends.

**There is no first-party Liquid unit-test framework, and the obvious candidate is
not one.** Shopify publishes
[`Shopify/liquid-spec`](https://github.com/Shopify/liquid-spec), which sounds
exactly right and is not — it is a conformance suite for people *building a Liquid
engine*, to check their parser and renderer behave correctly. It tests Liquid, not
your Liquid. Rule that out early.

**Theme Check is a linter, and knowing its limit is the point.**
[Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check)
catches syntax errors, missing templates, unused snippets, deprecated tags and
some performance smells — by reading the code, never running it. So it cannot
catch a logic error, a wrong price, or a section that renders empty for one
product type. Tom's instinct in the session that "linting up front is really
helpful" is correct; the honest completion of the sentence is *"…and it cannot see
behaviour at all."*

So the four things that genuinely work, cheapest first:

| Approach | What it catches | Cost |
| --- | --- | --- |
| **Move the logic into JS and unit-test that** | Anything with a real rule in it — pricing, validation, formatting | Lowest. Vitest, no infrastructure |
| **Smoke checks on rendered pages** | Template errors, blank pages, a deploy that silently did not land | Low. A script and a list of URLs |
| **[Lighthouse CI action](https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci)** | Performance and accessibility regressions, per pull request | Low. First-party GitHub Action |
| **Browser tests (Playwright)** | Add to cart, the customizer, checkout — the flows that make money | Highest, and the only thing that proves a button works |

The first row is the real answer to John's question, and it reframes it usefully:
**you do not unit-test Liquid — you stop putting testable logic in Liquid.**
Liquid is a template language; it is bad at rules and there is no seam to test it
through. Anything with a rule in it belongs in JavaScript, or in a Shopify
Function — either way it becomes ordinary code with an ordinary test runner.
Liquid's job is to render what it is handed.

The third row is the one we should act on, because it is first-party, it is a
GitHub Action, and we do not have it. It audits the home, product and collection
pages on every pull request and fails below a score threshold you set — a
performance regression gate for a theme, which is precisely the thing
[Web Performance](web-performance) says we should never regress on and currently
check by hand.

## Selenium, Playwright, and why Tom's aside matters

Tom called himself "old guard" on Selenium and made a point that is easy to miss:
it used to be **teams of people** writing Selenium tests as their whole job,
rather than individual engineers writing tests for the code they had just built.
The [project's own history](https://www.selenium.dev/history/) explains why.

Selenium started in 2004 at ThoughtWorks, built by Jason Huggins as
"JavaScriptTestRunner" for testing an internal app. Its early architecture drove
the browser from inside the page with injected JavaScript, which meant fighting
the browser's security model — so a separate proxy server, **Selenium Remote
Control**, was built to work around it. That was a lot of moving parts, and the
scaffolding needed people to maintain it. Simon Stewart then built **WebDriver**,
which talked to browsers through native, browser-specific drivers instead of
injected JavaScript. The two projects merged into Selenium 2, and that
driver-based approach eventually became the
[W3C WebDriver standard](https://www.w3.org/TR/webdriver2/) every browser now
implements.

So the shift Tom is describing is not fashion, it is architecture: when the
harness stopped being a thing you had to run and maintain, test-writing stopped
needing a dedicated team. That is the same conclusion DORA reached from the data,
arrived at from the other direction — and it is why "the developer who wrote it
writes the test" is now the default rather than a stance.

Tom also argued something related and worth recording, because it cuts against
common practice: **not having a separate QA step is a benefit**, because you all
QA your own work as you build it, and handing a ticket to someone else means they
must ramp up on context you already have. Especially with our deliberately
ambiguous tickets, where much of the judgment is not written down. The
counter-argument is real — you cannot see your own blind spots, which is exactly
what a fresh pair of eyes is for — and our answer to it is pull-request review
rather than a QA stage. Worth checking honestly in a few months whether review is
actually catching the things a separate QA pass would.

Session 12 came back to exactly that, and sharpened it: if the review is a
relayed AI comment nobody read, then a team like this has neither a QA step nor a
fresh pair of eyes. [Code Review](code-review) is where that argument, and what we
decided to do about it, is written down.

## Can you really deploy on Friday?

John's aside — with a regression suite you can *"deploy on Friday without having
to worry"* — sounds like bravado and is closer to true than it sounds, with one
condition attached.

The DORA research programme's central finding is that speed and stability **do not
trade off**: the teams that deploy most often also have the *lowest* change
failure rates and recover fastest. The premise behind "no Friday deploys" — that
going slower is safer — is not supported.

The condition is the part that matters: those teams are fast *because* of the
capabilities, not instead of them.
[Test automation](https://dora.dev/capabilities/test-automation/) is one of the
capabilities the research identifies as driving that outcome, along with
continuous integration, small changes, and monitoring. So the honest version of
John's claim:

> Friday is not the risk. Not being able to see what broke, and not being able to
> put it back, is the risk. Fix those two and the calendar stops mattering.

Which is a fair description of where we actually are. We have small changes,
linting, review, and a rollback path. What we do not have is the *seeing* half —
which is why Tom's Sentry decision in this session matters more than it sounded.
See [Maintaining Live Sites](maintaining-live-sites).

## What this looks like on a Shopify build

The general ideas above land differently on a theme than on an application, so
here is the concrete version for the work most of us do — using only first-party
tooling and patterns you can copy.

**Shopify Functions get real integration tests, and this is the good news.** Sara
found the [binary testing
changelog](https://shopify.dev/changelog/binary-testing-for-shopify-functions)
during the session, and it is the strongest regression story available anywhere in
a Shopify build. The pattern:

- A fixture is a **JSON file** — one input, one expected output — dropped into
  `tests/fixtures/`.
- The test file **reads the directory** and generates one test per fixture, so a
  new scenario is a new JSON file and no new test code.
- The suite **compiles the function to WebAssembly and runs the fixtures through
  the real binary**, which is the whole point: a unit test on the source cannot
  catch a compilation or serialisation break, and that is exactly the kind of
  break that only shows up in production.
- Fixtures can come from **real production input**. `shopify app dev` writes a log
  file per function execution, and those files drop straight into the fixtures
  folder — so your regression corpus is collected rather than imagined.

Wire the suite into CI ahead of the deploy step and a red suite cannot ship. That
is a complete regression gate for the part of a Shopify build where money is
calculated, and it costs almost nothing to set up because the templates ship with
it.

**The parity test: a pattern worth stealing.** A very common shape in commerce
work is the same number living in two places on purpose — one copy renders the
price the shopper reads, another copy is what actually gets charged server-side.
Usually there is a code comment saying *keep these in sync*, and a comment is not a
guard. Reprice one copy, forget the other, and the shopper sees one price and pays
another.

The fix is a nine-line test that reads both files off disk and compares them:

```js
const CONSTANT = /^\s*(?:export\s+)?const PRICE_CENTS = (\d+);/m;

it("display copy and billed copy charge the same amount", async () => {
  expect(await centsIn(billedFile)).toBe(await centsIn(displayFile));
});
```

Two details make it work rather than merely exist. **If the constant is missing,
fail loudly** — a rename must not "pass" by comparing two `undefined`s. And
**trigger the suite when either side changes**, which in GitHub Actions means
listing both paths under `on.push.paths`. That list is a hand-written selection map,
and it is fragile in precisely the way the research predicts: rename a file and the
map is silently wrong with nothing failing to tell you. Worth a comment explaining
why the second path is there, because the two files are related by a business rule
rather than by an import, and no tool can infer that.

**A theme smoke check should assert more than a 200.** We had this written down as
"did the page return 200 instead of 500", which sells the technique short. A useful
post-deploy check fetches a handful of key templates — home, a product, a
collection, cart, search — and per page asserts:

| Check | The failure it catches |
| --- | --- |
| HTTP 200 | The page is gone or erroring |
| Not redirected to the storefront password page | The lock is on and nothing is really being tested |
| Body contains `</html>` | The response died halfway through rendering |
| No `Liquid error` marker in the body | A template threw but Shopify still served a 200 |
| The rendered `Shopify.theme` id matches the theme you asked to preview | **The preview silently fell back to the live theme** — you QA'd the wrong theme and never knew |

That last assertion is the interesting one, and it is the shape the best regression
tests take: it catches a case where every other check passes and your conclusion is
still wrong.

Run it **before and after** each push, on every store, and it becomes a genuine
gate rather than a formality. What it still cannot see is whether anything *works* —
add to cart, a product customiser, checkout. That gap is
[end-to-end](end-to-end-testing) shaped, and no amount of page fetching closes it.

## Try it yourself

1. **Find the regression test you already wrote.** Open the last test you added
   anywhere. Ask: if a teammate edits the code near it next month, would this test
   catch their mistake? If yes, you have been writing regression tests all along —
   that is the point of this lesson.
2. **Write a parity test.** Find any value that exists in two places in a codebase
   you work on — a price, a limit, a feature flag, a magic string shared between
   front end and back end. Write the five-line test that asserts they match, then
   change one copy and watch it fail. This is the cheapest high-value regression
   test most codebases are missing.
3. **Add a fixture without writing a test.** On any Shopify Function, copy a file
   from `tests/fixtures/`, change one value in the input, work out the expected
   output by hand, and rerun. Your case is picked up automatically. That is what
   "no test code per scenario" buys you.
4. **Check the 1.23% claim on yourself.** Look at a CI run on a project you work
   on. How long does the suite take, and can you name a single test in it that has
   ever caught a real bug? Whatever your answer, it is the honest starting point
   for deciding what to run when.
