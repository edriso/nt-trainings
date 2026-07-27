---
title: Unit Testing
description: Prove one small piece of code is right — automatically, in milliseconds.
emoji: 🔬
order: 7
status: learned
session: 5
date: 2026-07-27
tags: [testing, unit-tests, vitest]
videos:
  - title: "Unit Testing (Vitest) Tutorial #1 — What is Unit Testing? (Net Ninja)"
    youtubeId: XdDZKeM5_pQ
  - title: "Unit Testing (Vitest) Tutorial #7 — Test Driven Development (Net Ninja)"
    youtubeId: 9VVCUhcV2gA
resources:
  - title: Vitest — Getting Started
    url: https://vitest.dev/guide/
    note: The test runner we use. Install, first test, watch mode — start here.
  - title: Vitest — Mocking
    url: https://vitest.dev/guide/mocking
    note: The official how-to for faking time, network, modules and files, when your code depends on them.
  - title: Unit Test — Martin Fowler
    url: https://martinfowler.com/bliki/UnitTest.html
    note: Why nobody agrees on the word "unit" — and the solitary vs sociable distinction that answers most arguments.
  - title: Mocks Aren't Stubs — Martin Fowler
    url: https://martinfowler.com/articles/mocksArentStubs.html
    note: The long read that names every kind of fake object and shows what each one costs you.
  - title: "Testing on the Toilet: Don't Mock Types You Don't Own — Google"
    url: https://testing.googleblog.com/2020/07/testing-on-toilet-dont-mock-types-you.html
    note: One page on why faking someone else's library hurts later, and the wrapper that fixes it.
  - title: "Software Engineering at Google, ch. 13 — Test Doubles"
    url: https://abseil.io/resources/swe-book/html/ch13.html
    note: How a very large codebase decides between the real thing, a fake, and a mock. Free to read online.
  - title: How to know what to test — Kent C. Dodds
    url: https://kentcdodds.com/blog/how-to-know-what-to-test
    note: A practical way to pick what deserves a test when you cannot test everything.
  - title: "3A — Arrange, Act, Assert (Bill Wake)"
    url: https://xp123.com/3a-arrange-act-assert/
    note: The original post that named the pattern, from 2001.
  - title: "FIRST — Ottinger & Schuchert"
    url: https://agileinaflash.blogspot.com/2009/02/first.html
    note: Where the FIRST checklist comes from, one screen long.
decks:
  - title: Unit Testing (July 2026)
    file: unit-testing-2026-07.pdf
    note: The slides from the session — includes a Vitest cheat sheet on the last pages.
---

## The one rule

> A unit test gives one small piece of code an input and checks the output — by
> itself, in milliseconds, with no database, no browser and no network.

That is the whole idea. A unit is the smallest useful piece of your code, and in
practice that is almost always **one function**. The test is a robot that keeps
asking that function the same question forever, for free.

Why we care: every feature we ship becomes code someone edits later. Without
tests, each change is a gamble — *did I just break checkout?* A unit test turns
that gamble into an answer you get in one second. That is what lets a team move
fast **and** sleep at night.

And when it fails, it fails at the right moment: automatically, in CI
(Continuous Integration — the robot that runs our tests on every push), the
minute someone pushes the code. Not days later, from a customer who noticed
they were charged the wrong price.

## Three beats: Arrange, Act, Assert

Every unit test in every language is the same three beats. **Arrange** sets up
the input, **Act** runs the one thing you are testing, **Assert** says what you
expected.

```js
import { describe, it, expect } from 'vitest'
import { formatPrice } from '../../src/utils/formatPrice'

describe('formatPrice', () => {
  it('formats cents as dollars', () => {
    const cents = 129900                    // Arrange
    const label = formatPrice(cents)        // Act
    expect(label).toBe('$1,299.00')         // Assert
  })
})
```

Given this **input**, I expect this **output**. That is the job. The pattern is
usually shortened to **AAA**, and it was named by Bill Wake back in 2001 — Kent
Beck's book on test-driven development is what made it famous.

If the function is `async`, only one thing changes — you `await` it:

```js
it('reads the price from the file', async () => {
  const cents = await centsIn('pricing.js')
  expect(cents).toBe(1000)
})
```

## Good tests are FIRST

FIRST is the checklist for a test worth keeping.

| Letter | Means | In practice |
| --- | --- | --- |
| **F**ast | Milliseconds | You run the whole suite without thinking about it |
| **I**ndependent | No test needs another | Any order works; nothing shared between them |
| **R**epeatable | Same result every run | No real clock, no network, no `Math.random()` |
| **S**elf-validating | It passes or fails on its own | No reading console output and squinting |
| **T**imely | Written with the code | While the logic is still fresh in your head |

One rule sits underneath all five: **test what the function gives back, not how
it is written inside.** If your test knows the steps, every refactor breaks it
for no reason. If your test only knows the input and the output, you can rewrite
the insides freely and the test still protects you.

## When to write one — and when not to

This was John's question in the session, and it is the right one to ask: *when
should we test, and when should we not bother?* The gut check is one sentence:

> Input goes in, output comes out, no browser or database in between → unit test.

The longer version:

| Write a unit test | Reach for a different tool |
| --- | --- |
| Money: prices, tax, discounts, fees | Layout and styling → visual checks |
| Parsing and formatting: dates, CSV rows, slugs | "Does the page load at all" → smoke test |
| Validation and branching you would hate to get wrong | Wiring with no decisions in it → integration test |
| Two values that must stay in sync | A third-party library's own behaviour → not our code, not our test |
| A bug you just fixed — the cheapest test you will ever write, because the rule is already known | Throwaway spike code you plan to delete this week |
| A rule the ticket states out loud ("orders over $75 ship free") | Anything that only makes sense with a real database or browser → integration / end-to-end |

Three signals you are at the **wrong layer** and should stop:

1. **The setup is bigger than the code under test.** Ten lines of fake objects
   to check a two-line function? Either the function needs splitting, or this
   belongs in an integration test.
2. **The test restates the implementation.** If you can only write the test by
   copying the steps of the function, it will break on every refactor and catch
   nothing. Skip it.
3. **The code makes no decisions.** A function that just passes values from A to
   B has nothing to be wrong about. Test the pieces it calls, and let an
   integration test cover the wiring.

Also true: a test that *can never fail* is worse than no test, because it buys
false confidence. `expect(result).toBeDefined()` on a function that always
returns an object is a green tick that proves nothing.

## "But my function calls other services"

The second half of John's question, and the part that trips everyone up: *in
real life my function calls other services — how do I unit test that?*

### A unit is a behaviour, not a file

Nothing says a unit test may only ever run one function. If your function calls
another small, fast function **in our own codebase**, let it run for real. The
testing world has names for the two styles ([Martin
Fowler](https://martinfowler.com/bliki/UnitTest.html)):

| | Solitary | Sociable |
| --- | --- | --- |
| What actually runs | Only your function; every collaborator is replaced by a fake | Your function plus its real, fast helpers |
| Best for | Code that reaches out of the process | Pure logic spread over a few small functions |
| The cost | More setup, and the test learns your internal wiring | One broken helper fails several tests at once |

Sociable is the sane default for our work. You are not cheating; it is still a
unit test as long as it stays fast and repeatable.

### Draw the line at the outside world

Fake something only when it breaks **F**ast or **R**epeatable — that is, when it
leaves the process:

- the network (an API, a payment provider, a carrier's rates)
- a database or the filesystem
- the clock (`new Date()`) and randomness (`Math.random()`)
- anything with a rate limit, a bill, or someone else's uptime

Everything inside that line can just run.

### The best fix is not a fake — it is a seam

Before reaching for mocking tools, try splitting the function into the
**decision** (pure logic, easy to test) and the **plumbing** (talks to the
world, boring, nothing to decide). This is the old "humble object" idea, also
known as *functional core, imperative shell*.

Hard to test, because the function goes to the network itself:

```js
// ❌ one function doing both jobs
export async function shippingLabel(order) {
  const res = await fetch(`https://rates.example.com/?zip=${order.zip}`)
  const { cents } = await res.json()
  return cents === 0 ? 'Free shipping' : formatPrice(cents)
}
```

Split it, and the interesting half needs no fakes at all:

```js
// ✅ the decision — pure. This is what deserves a unit test.
export function labelFor(cents) {
  return cents === 0 ? 'Free shipping' : formatPrice(cents)
}

// ✅ the plumbing — thin and dumb. No branching, so almost nothing to get wrong.
export async function shippingLabel(order, fetchRates = liveRates) {
  const { cents } = await fetchRates(order.zip)
  return labelFor(cents)
}
```

Notice the second parameter with a default value. That is **dependency
injection** in its cheapest form: production passes nothing and gets the real
thing, the test hands in a fake and never touches the network.

```js
it('says Free shipping when the carrier returns zero', async () => {
  const fakeRates = async () => ({ cents: 0 })            // Arrange
  const label = await shippingLabel({ zip: '10001' }, fakeRates)  // Act
  expect(label).toBe('Free shipping')                      // Assert
})
```

### The fakes, from cheapest to most expensive

When you do need a stand-in, these are the options. The umbrella word is **test
double** (like a stunt double in a film):

| Double | What it is | Reach for it when |
| --- | --- | --- |
| **Dummy** | A value passed only to fill a parameter, never used | The signature demands an argument this path ignores |
| **Stub** | Returns a canned answer | "Pretend the API said this." Covers most cases — start here |
| **Fake** | A real but simplified implementation (in-memory instead of a database) | You call it many times and want it to actually behave |
| **Spy** | A stub that also records how it was called | You must prove a side effect happened ("we did send the email") |
| **Mock** | A spy with expectations baked in — fails if the calls do not match | Rarely. It asserts *how* your code works, so refactors break it |

The order matters: prefer the real thing, then a stub or a fake, and treat mocks
as a last resort. In Vitest the tools are `vi.fn()` for a throwaway function,
`vi.spyOn()` to watch a real one, `vi.mock()` to replace a whole module, and
`vi.useFakeTimers()` to control time.

```js
import { vi, it, expect } from 'vitest'

it('does not email a customer without an address', async () => {
  const send = vi.fn()                        // a spy: records the calls
  await notify({ email: null }, send)
  expect(send).not.toHaveBeenCalled()
})
```

### Two rules that save you pain later

- **Don't mock what you don't own.** Never fake a third-party SDK's shape
  directly. Your fake freezes today's version of their API, so the day you
  upgrade, the tests still pass while production breaks. Wrap the library in a
  small function of your own, and fake *that*. ([Google's one-pager on
  this](https://testing.googleblog.com/2020/07/testing-on-toilet-dont-mock-types-you.html))
- **The more you fake, the less you prove.** A test where everything is faked
  only tests your fakes. If you find yourself faking four things to test one
  function, that is the signal to write an integration test instead — which is
  exactly the layer Sara's session covers.

## Should we write the test first? (TDD)

This is where the session got interesting, and the disagreement is worth
recording honestly.

**The case for test-driven development (TDD)** — write the failing test, then
just enough code to pass it, then clean up (red → green → refactor). Writing the
test first forces you to decide what "done" means before you start, and it
catches the case you would have forgotten. In the session, writing the tests
first is exactly what surfaced an empty-string input that the function did not
handle yet.

**The case against it in our kind of work** — most of our tickets arrive with
high ambiguity. When requirements are still moving, TDD makes you write the
thing twice: once as a test that defines it, once as the code. We are not
publishing SDKs (Software Development Kits) that other teams depend on, so there
is no contract with an outside consumer to protect. And a test that goes red
because you changed something that was never a hard requirement is pure
whiplash.

Both are true. The workable middle:

- **Test first when the rule is already known** — a bug you are fixing, money
  math, "these two values must match", a validation rule written in the ticket.
  Zero ambiguity, so zero rework.
- **Test after, or not at all, while you are still discovering the shape** —
  spikes, layout work, one-off glue. Get it working in the browser first.
- **The tie-breaker:** *if this breaks quietly, who finds out — CI or a
  customer?* If the honest answer is "a customer", and money or data is
  involved, write the test.
- **On "you write the code twice":** that is a real smell — but only when the
  test restates the implementation. A test earns its keep when it states the
  **contract** (`129900 cents → '$1,299.00'`, shown price equals billed price),
  not the steps.
- **If a test fails on a change that was never a requirement,** the test
  asserted too much. Assert the one behaviour the ticket cares about and delete
  the rest.

## Common mistakes

Every one of these is just a broken FIRST rule:

- **Testing how it works instead of what it does** → the test breaks on every
  refactor. Check input and output only.
- **Flaky tests** — the real clock, `Math.random()`, the live network → fake
  them, so the result is the same every run.
- **Tests that lean on each other** → each one stands alone; reset shared state
  in `beforeEach`.
- **A test that cannot fail** — no real `expect`, or only `toBeDefined()` → check
  the actual value.
- **One test checking twenty things** → one behaviour per test, with a name that
  tells you exactly what broke.
- **Chasing 100% coverage** — coverage is a map of untested lines, useful as a
  guide. Fully covered trivial code still proves very little.

## Vitest in one screen

We use [Vitest](https://vitest.dev/guide/) because our projects already build
with Vite, so there is nothing extra to configure. The API is the same shape as
Jest, so the habit transfers.

```bash
npm test              # run once (this is what CI runs)
npx vitest            # watch mode: reruns on save
npx vitest run -t     # filter by test name, e.g. -t "formats cents"
npx vitest --coverage # which lines never ran
```

The matchers that cover almost everything:

| Matcher | Checks |
| --- | --- |
| `toBe(x)` | Exactly equal — numbers, strings, booleans |
| `toEqual(obj)` | Same shape and values, for objects and arrays |
| `toBeCloseTo(n)` | Floating-point maths, where `0.1 + 0.2 !== 0.3` |
| `toContain(x)` | An item in an array, or text inside a string |
| `toThrow()` | The call is supposed to blow up |
| `resolves` / `rejects` | Promises: `await expect(p).resolves.toBe(1)` |
| `toHaveBeenCalledWith(...)` | A spy was called the way you expected |

The convention we follow: source in `src/`, tests mirroring it in `tests/`, one
file per unit — `src/utils/formatPrice.js` gets `tests/utils/formatPrice.test.js`.

## Where this sits in the bigger picture

Unit tests are the base of the pyramid: there are many of them, they are cheap,
and they run in milliseconds. Climbing up, each layer proves more about the real
experience but costs more and breaks more often. See the **Code Testing & the
Testing Pyramid** topic for the shape of the whole suite — the next sessions
carry on up: Sara takes **integration** testing, John takes **regression**
testing.

## Try it yourself

1. **Write your first one, in five minutes.** In any Vite project:
   `npm i -D vitest`, add `"test": "vitest run"` to `scripts`, then create
   `tests/utils/formatPrice.test.js` with the AAA example from the top of this
   lesson. Run `npm test` and watch it go green.
2. **Break it on purpose.** Change the expected string to `'$1,299'` and run it
   again. Read the failure output — that is what a teammate will see at 2pm on a
   Friday, so it should say what actually went wrong.
3. **Find the seam.** Open a function you own that calls an API. Split it into a
   pure `decide()` and a thin `fetchAndDecide()`, then unit test only the pure
   half. If that feels awkward, you have found where the code needs the split.
4. **Answer John's question on your own code.** Pick one function in a project
   you work on and decide out loud: unit test, integration test, or no test —
   and which line of the table above made the call.
