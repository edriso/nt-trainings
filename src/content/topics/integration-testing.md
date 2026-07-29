---
title: Integration Testing
description: Prove the pieces work together — real routes, a real database, and no mocks in between.
emoji: 🔗
order: 8
status: learned
session: 6
date: 2026-07-28
tags: [testing, integration-tests, ci]
videos:
  - title: How to write integration tests over your API (Web Dev Cody)
    youtubeId: rBx3ur9ntRA
  - title: "Integrated Tests Are A Scam — J.B. Rainsberger (DevTernity)"
    youtubeId: fhFa4tkFUFw
resources:
  - title: Integration Test — Martin Fowler
    url: https://martinfowler.com/bliki/IntegrationTest.html
    note: The narrow vs broad distinction that ends most "is this an integration test?" arguments.
  - title: "Software Engineering at Google, ch. 11 — Testing Overview"
    url: https://abseil.io/resources/swe-book/html/ch11.html
    note: Test size vs test scope, the localhost rule, and the 80/15/5 mix. Free to read online.
  - title: "Write tests. Not too many. Mostly integration. — Kent C. Dodds"
    url: https://kentcdodds.com/blog/write-tests
    note: The testing-trophy argument for spending most of your effort at this layer.
  - title: Testcontainers — Getting Started
    url: https://testcontainers.com/getting-started/
    note: Throwaway real databases for tests, in Docker. Start here, then read the Node guide.
  - title: Testcontainers for Node.js
    url: https://node.testcontainers.org/
    note: The JavaScript API, including the PostgreSQL module used in this lesson.
  - title: Integration testing with Prisma
    url: https://www.prisma.io/docs/orm/prisma-client/testing/integration-testing
    note: A complete worked setup — separate test database, real migrations, cleanup between suites.
  - title: Mock Service Worker (MSW)
    url: https://mswjs.io/docs/
    note: Fake the network instead of your own modules, so front-end tests exercise the real code paths.
  - title: Contract Test — Martin Fowler
    url: https://martinfowler.com/bliki/ContractTest.html
    note: How to trust a fake service — the piece that lets you stop running everything together.
  - title: Pact — consumer-driven contract testing
    url: https://pact.io/
    note: The tool that grew out of the "integrated tests are a scam" argument. Read it after the video.
  - title: Creating PostgreSQL service containers — GitHub Docs
    url: https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers
    note: The official way to give a CI job its own throwaway database.
  - title: "Everyone cites that '100x more expensive' research… — The Register"
    url: https://www.theregister.com/2021/07/22/bugs_expense_bs/
    note: Where the famous cost-of-defects graph came from, and why the number is folklore.
  - title: Test your theme — Shopify
    url: https://shopify.dev/docs/storefronts/themes/store/test-theme
    note: Shopify's own QA checklist, for the part of our work that has no local server to test.
---

## The one rule

> An integration test checks that separate pieces of our code work together —
> the route, the database, the auth, the queue — with the **real** things
> running instead of fakes.

A [unit test](unit-testing) proves one function is right. An integration test
proves the wiring is right, and the wiring is where our bugs actually live:
the column that was renamed, the route that never accepted `PATCH`, the
permission check that runs *after* the row is already updated.

Why we care: every unit can be green while the feature is broken. A shopper
can be charged, and the order never written. Integration tests are the cheapest
layer that catches "all the parts are fine, the machine still doesn't work".

## What changes when you leave unit-test land

|  | Unit test | Integration test |
| --- | --- | --- |
| What actually runs | One function | A route, its database, its auth |
| Fakes | Anything that leaves the process | As few as you can get away with |
| Speed | Milliseconds | Tens of milliseconds to seconds |
| Setup | An input value | A database with the right rows in it |
| When it goes red | This function's logic is wrong | The pieces disagree about something |
| Proves | The rule is right | The feature works |

Two vocabularies help here, and both are worth stealing.

[Martin Fowler](https://martinfowler.com/bliki/IntegrationTest.html) splits the
term in two, because people use one word for two very different things:

- **Narrow** integration test — only *our* service runs; anything remote is a
  test double. Fast, and it lives in the normal test suite.
- **Broad** integration test — every real service has to be up. Fowler suggests
  calling that a **system** or **end-to-end** test instead, and says that if
  your only integration tests are broad ones, go and try the narrow style.

[Google](https://abseil.io/resources/swe-book/html/ch11.html) ignores names and
classifies by **size** — what a test is *allowed to touch*:

| Size | May use | So it can |
| --- | --- | --- |
| **Small** | One process. No network, no disk, no `sleep` | Be fast and never flake |
| **Medium** | Several processes, and `localhost` only | Talk to a database on your own machine |
| **Large** | Other machines over the network | Test the whole system, slowly |

That middle row is the useful definition of the layer this lesson is about: a
**medium** test may start a database, as long as everything stays on your own
machine. The moment a test reaches out to a shared staging server it becomes a
large test, and inherits every problem large tests have — someone else's data,
someone else's deploy, someone else's downtime.

## How much of this should we write?

Two respected answers, and the honest position is that they disagree:

- **The pyramid.** Google aims for roughly **80% unit, 15% integration, 5%
  end-to-end** by test count. Wide base, narrow top.
- **The trophy.** [Kent C. Dodds](https://kentcdodds.com/blog/write-tests)
  argues front-end teams should spend *most* of their effort on integration
  tests, because that is where confidence per hour is highest — "integration
  tests strike a great balance on the trade-offs between confidence and
  speed/expense".

Both are describing the same trade-off from different codebases. What actually
decides it for a given project is where your risk sits. Pure logic — money,
dates, parsing — is cheapest to protect with unit tests. Wiring — routes,
permissions, forms, migrations — is only really proven at this layer. Our client
work is mostly wiring, which is why this session mattered more than the counts
suggest. See [Code Testing & the Testing Pyramid](code-testing) for the map of
the whole series.

## What to cover — John's question, answered properly

In the session John asked the question that decides whether any of this is worth
doing: *how do you determine the scope of the tests?* The honest answer given in
the room was "part judgment call, part what the tooling recommended, and it has
to stay around two minutes". That is a good instinct. Here is the version you
can defend in a planning meeting.

**Start from the journeys, not the code.** Google's SRE practice calls these
[critical user journeys](https://sre.google/resources/practices-and-processes/product-focused-reliability-for-sre/)
— the sequences a user must complete for the product to have any value at all.
List them, order them by what it costs the business when they break, and cover
them top-down. On a store that is: browse → add to cart → checkout. On an admin
app: sign in → invite a teammate → approve a request.

**Then filter by what a broken one costs.** Three filters that do most of the
work:

| Cover it | Skip it, for now |
| --- | --- |
| It **changes data** (`POST`, `PUT`, `PATCH`, `DELETE`) | It only reads (`GET`), and getting it wrong is visible immediately |
| It **touches several tables** in one action — a status flip plus an audit row plus an email | It touches one row and nothing else depends on it |
| It **decides who may do what** — roles, ownership, tokens | Layout, copy, styling → visual checks instead |
| It **expires, schedules, or retries** — anything time-based | Code you plan to delete this week |
| A **bug you just fixed** that crossed two pieces | Anything a unit test already proves properly |

The write-only filter is a good first cut: a `GET` that breaks usually announces
itself on the next page load, while a `PATCH` that silently writes the wrong row
is exactly the bug that reaches a customer first. The "several tables" rule is a
proxy for the same thing — the more places one action writes to, the more ways
it can half-succeed.

**Ship it in phases.** The first pass does not need to be complete; it needs to
exist and stay fast. Cover the top journeys, call that phase zero, and let the
next phases be a decision you make later with real failures to point at.

**And the tie-breaker, same as the unit lesson:** *if this breaks quietly, who
finds out — CI or a customer?* If the honest answer is a customer, and money,
data or access is involved, it is in scope.

## The real database is the point

The reason this layer earns its keep is that nothing is pretending. Your
migrations really ran, your foreign keys really exist, your SQL really is valid
for the engine you ship on. Testcontainers exists for exactly this: *"you can
write tests that depend on the same services you use in production without mocks
or in-memory services"* ([Testcontainers docs](https://testcontainers.com/getting-started/)).
It needs Docker, and it hands you a throwaway database per test run.

```js
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { beforeAll, afterAll } from 'vitest'

let container

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:17-alpine').start()
  process.env.DATABASE_URL = container.getConnectionUri()
  await runMigrations()          // the real migrations, once per run
}, 120_000)                      // the first image pull is slow — say so, or CI times out

afterAll(async () => {
  await container.stop()         // the database and its data disappear with it
})
```

Then a test reads like a small story about the feature:

```js
it('approving an application flips the status and records who did it', async () => {
  const id = await seedApplication({ status: 'pending' })          // Arrange

  const res = await fetch(`${baseUrl}/api/applications/${id}/approve`, {
    method: 'POST',
    headers: { authorization: `Bearer ${adminToken}` },
  })                                                              // Act

  expect(res.status).toBe(200)                                    // Assert
  expect(await statusOf(id)).toBe('approved')
  expect(await auditRowsFor(id)).toHaveLength(1)
})
```

Same **Arrange, Act, Assert** beats as a unit test. Only the Arrange got
bigger, because "the world" now has to be in a known state first.

### Keeping tests out of each other's way

One test's leftover rows are the next test's mystery failure. Three options,
cheapest first:

| Pattern | How | Watch out |
| --- | --- | --- |
| **Transaction per test** | `BEGIN` in `beforeEach`, `ROLLBACK` in `afterEach` | Only works if the code under test uses **that same connection** |
| **Truncate between tests** | `TRUNCATE … RESTART IDENTITY CASCADE` after each test | Slower, but it works no matter how many connections exist |
| **Fresh container per file** | Start the container in `beforeAll` of each file | Slowest. Reach for it when a suite is stubborn |

The caveat in row one is the one that bites people. If your test calls your app
over HTTP, the app has its own connection pool, and your transaction is
invisible to it — so the rollback rolls back nothing your test actually did.
Testing through a real HTTP request? Truncate.

### One guard worth writing before anything else

The nightmare in this layer is a suite that truncates tables — against staging.
Point tests at a database you created for them, keep it in `.env.test`, and make
the suite refuse to run anywhere else:

```js
// tests/setup.js — runs before every integration test
const url = process.env.DATABASE_URL ?? ''
const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url)

if (!local) {
  throw new Error(
    `Integration tests only run against a local database. Got: ${url.replace(/:[^:@]*@/, ':***@')}`,
  )
}
```

Cheap, ugly, and one day it will save someone's afternoon. The same rule applies
to `prisma migrate reset` and friends: destructive commands belong to
disposable databases only.

## Two flavours you will actually write

### Back end: a route and its database

That is the example above — real HTTP request, real database, no fakes. It
answers *"does this endpoint do what the ticket says, including the parts that
happen after the response?"*

### Front end: components and a fake network

On the front end, "integration" usually means several components rendered
together, driven the way a user drives them, with only the **network** faked.
[MSW](https://mswjs.io/docs/) intercepts at the network level rather than
patching `fetch`, so your own code stays untouched — it *"bets on the platform"*
instead of meddling with your application's integrity.

```js
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const server = setupServer(
  http.post('/api/subscribe', () => HttpResponse.json({ ok: true }, { status: 201 })),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))  // catch calls you forgot
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('thanks the user after a successful sign-up', async () => {
  render(<SignupForm />)

  await userEvent.type(screen.getByLabelText(/email/i), 'someone@example.com')
  await userEvent.click(screen.getByRole('button', { name: /sign up/i }))

  expect(await screen.findByText(/thanks/i)).toBeVisible()
})
```

Two habits in there worth copying: `onUnhandledRequest: 'error'` turns a request
you forgot to fake into a loud failure instead of a silent one, and querying by
label and role means the test breaks when the *behaviour* changes, not when a
class name does.

## Things that expire: don't wait, write the past

A real case from the session: an invite link that dies after seven days. You
cannot wait a week, and faking the clock does not help either — the database
stamps its own `now()`, and your fake timer never reaches it.

So write the past instead. Seed the row as if it were created eight days ago:

```js
it('refuses an invite that has expired', async () => {
  const token = await seedInvite({ expiresAt: daysAgo(1) })   // already dead on arrival

  const res = await acceptInvite(token)

  expect(res.status).toBe(410)
  expect(await memberCount()).toBe(0)                          // and nobody got added
})
```

The rule generalises: **for time in the database, control the data; for time in
your own code, control the clock** (`vi.useFakeTimers()`). Mixing them up is why
"expiry" tests are famously flaky. And note the second assertion — the
interesting half of a negative test is usually proving the side effect did *not*
happen.

## Is Playwright an integration test?

Tom asked this out loud in the session and nobody had a clean answer, so:
**usually no, it is an end-to-end test** — and Playwright can do all three
layers, which is exactly why the label confuses people.

| What you drive | What it is | Playwright API |
| --- | --- | --- |
| A real browser through real pages | End-to-end | `page.goto()`, `page.click()` |
| HTTP endpoints, no browser | Integration / API test | [`request` context](https://playwright.dev/docs/api-testing) |
| One component on a harness page | Component test | [component testing](https://playwright.dev/docs/test-components) (experimental) |

The distinction that matters is not the tool, it is **how much has to be alive
for the test to run**. A test that needs a deployed site, a queue and a payment
sandbox is a large test whatever you call it: keep a handful for the money
paths, and expect to babysit them.

One practical warning Tom already flagged in the room: driving a browser does
not catch everything. A button that renders and clicks fine can still throw in
the console, or work on Chrome and die on Safari. Which is what monitoring is
for — see below.

## Do TypeScript types replace integration tests?

Tom's other point, and it is a good one: if the front end and the API are typed
and built together, a broken contract fails the **build** instead of a test. So
where does that leave integration tests?

**Where types genuinely win.** Inside one build — a monorepo where the front end
imports the route's own types — renaming a field or dropping `PATCH` is a
compile error. That deletes a whole category of low-value integration test, and
it deletes it *earlier* than any test could. Worth leaning into.

**Where types quietly do nothing.** Types vanish at runtime, and they never
crossed the network in the first place:

- Two separately deployed repos. Yours compiles against last week's shape; theirs
  shipped a change this morning. Both builds green, production broken.
- JSON arriving from anywhere — an API, a webhook, a form. `as any`,
  `as unknown as User`, or a plain wrong annotation and the compiler is satisfied
  while the data is not.
- Everything that is not a shape: permissions, ordering, uniqueness, "the row
  was actually written".

**So the honest answer:** types shrink the *shape* half of the problem and leave
the *behaviour* half untouched. Two things close the rest of the gap:

1. **Validate at the edge.** Parse untrusted JSON with a schema validator (Zod,
   Valibot) at the boundary, so a wrong payload fails loudly at the door with a
   useful message, instead of three functions later as `undefined`.
2. **Contract tests, when the boundary is a deploy boundary.**
   A [contract test](https://martinfowler.com/bliki/ContractTest.html) checks
   that your fake of someone else's service still matches the real thing. The
   consumer records what it expects, the provider replays that recording in *its*
   pipeline and finds out before deploying that it is about to break you — which
   is what [Pact](https://pact.io/) automates. Fowler's note is worth keeping:
   these run on the rhythm of the other service's changes, not on every push, and
   a failure is a conversation, not a broken build.

## Why earlier is cheaper — and what that famous graph really proves

The idea Tom put on the board is right and it is the reason we are doing any of
this: **move the moment you find out as early as you can.** Requirements is
cheapest — you edit a sentence. Coding is cheap — the editor is already open. In
review it costs two people. In production it costs an incident, a client call,
and whatever the bug did while nobody was looking.

Then there is the graph everybody cites, the one where a bug costs 1× in
requirements and 100× in maintenance. It is worth knowing where it comes from,
because someone will eventually ask you to defend it:

- The numbers are usually credited to the "IBM Systems Sciences Institute".
  That was an **internal IBM training programme, not a research body**, and the
  trail ends at *course notes* quoted in a 1987 textbook.
- Laurent Bossavit went looking for the study behind it and found no study —
  no dataset, no method, nothing more recent than 1981. He collected this and
  similar claims in *[The Leprechauns of Software Engineering](https://leanpub.com/leprechauns)*.
  [The Register](https://www.theregister.com/2021/07/22/bugs_expense_bs/) walked
  the same citation chain and reached the same place.
- What *is* supported is the direction, not the multiplier: short feedback loops
  and code review measurably improve quality. Nobody has earned the right to the
  number 100.

**How to use this.** Make the argument from feedback loops, which everyone in the
room has felt — *"I found out in 90 seconds instead of on Monday from the
client"* — and drop the fake precision. Ironically, quoting an unsourced
statistic to a client is the same class of mistake as shipping an untested
change: it works right up until someone checks.

## Where these run: laptop → hook → CI

Same principle applied to the pipeline. Each stage should be as slow as it is
allowed to be, and no slower:

| Stage | Runs | Because |
| --- | --- | --- |
| On save | Type-check, unit tests in watch mode | Instant, while the code is still in your head |
| `pre-commit` | Format, lint, secret scan — staged files only | Seconds. Any slower and people work around it |
| `pre-push` | Type-check plus the integration suite, if it is quick | Last cheap chance before you involve anyone else |
| CI, on the PR | Everything, on a clean machine, with its own database | The only stage nobody can skip |
| Before deploy | The suite must be green | So a red suite blocks the release, not a person |

The caveat on hooks: they are a **speed tool, not a boundary**. `--no-verify`
exists, a fresh clone has no hooks installed, and CI runs on a machine where
"works on my laptop" carries no weight. Put the fast checks in hooks to save
yourself a round trip, and keep the authority in CI. That is also why the
deploy gate matters more than any hook: it is the one check that cannot be
skipped in a hurry.

Two numbers to design the suite around:

- **Keep it in single digits of minutes.** Nobody waits twenty minutes for a
  PR check; they merge and hope. Two minutes for the phase-zero suite is a good
  target.
- **Flakiness has a hard ceiling.** Google runs at about **0.15%** flaky and
  notes that around **1%**, tests start losing their value — people stop
  believing red. A test you re-run until it passes is worse than no test,
  because it teaches the team to ignore failures.

Integration tests are where flakiness is born, and nearly always for one of four
reasons: leftover data, tests that assume an order, a fixed `sleep` instead of
waiting for a condition, or a real clock. Fix the cause; do not add a retry.

One last habit from the session worth stealing: **write the policy where people
and tools will actually read it.** A line in the repo's contributing notes —
"an endpoint that writes to more than one table ships with an integration test"
— turns a judgment call into a default, and any decent code assistant reading
that file will start suggesting the test for you. (Our AI practices live in the
[Claude GOAT guide](ai-for-developers), not here.)

## What integration tests cannot catch

Every test only checks what someone thought of in advance. Production is where
you find out what you did not. That is the other half of the strategy —
sometimes called shift-**right** — and it is why error monitoring sits next to
the test suite rather than under it:

- **Errors you never predicted**, with a stack trace and the release that
  introduced them. [Sentry](https://docs.sentry.io/product/explore/session-replay/)
  is the tool the team is standardising on.
- **Frustration signals**, which are surprisingly close to a test assertion.
  Sentry counts a
  [**rage click**](https://docs.sentry.io/product/issues/issue-details/replay-issues/rage-clicks/)
  when someone clicks the same element three or more times inside seven seconds,
  and a **dead click** when a `<button>`, `<a>` or `<input>` leads to no DOM
  change or scroll within seven seconds. A dead click on "Add to cart" is a bug
  report nobody had to file.
- **The slow decay** — a page that gets heavier every sprint. More on that in
  [Maintaining Live Sites](maintaining-live-sites) and
  [Web Performance](web-performance).

Read it the other way round too: every real incident is a missing test with a
name. Fixing a production bug without adding the test that would have caught it
is how the same bug comes back.

## What this looks like on Shopify

Tom asked whether anyone has ever seen an integration test *for Shopify*, and
the reason it feels awkward is real: a theme is Liquid that **Shopify's servers**
render. There is no local server to boot in a container, so the pattern from the
first half of this lesson has nowhere to attach. Split the work by where the
seam is:

| The thing | What you can actually test | With |
| --- | --- | --- |
| **Liquid theme code** | Lint it, then check it in a browser | [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check), then the [theme QA checklist](https://shopify.dev/docs/storefronts/themes/store/test-theme) |
| **Functions** (cart transform, validation, discounts) | Real logic, real payloads, locally, in milliseconds | Vitest, plus `shopify app function run` with a captured input |
| **App back end** (routes, webhooks, our own database) | Exactly the pattern above | Vitest + Testcontainers |
| **The whole storefront** | Real browser against a preview theme or dev store | Playwright — a few, for the money paths |

The middle row is the sweet spot, and Shopify documents it directly: capture a
real input payload from the logs, replay it through the function, assert on the
output. Shopify's own scaffold puts these in `tests/` with fixtures in
`tests/fixtures/`, recommends **Vitest** for JavaScript functions, and ships
`@shopify/shopify-function-test-helpers` for exercising the built WebAssembly the
way the platform will
([docs](https://shopify.dev/docs/apps/build/functions/test-debug-functions)).
`shopify app function replay` re-runs a logged execution, which makes a
production bug into a fixture in about a minute.

Practical read for our stack: **push the decisions out of Liquid and into
functions or the app**, and the testable surface grows without anyone writing a
browser test.

Session 7 took this further and it is worth following up on:
[Regression Testing](regression-testing) covers the researched answer to "how do
you unit-test Liquid?" (short version — you do not, you move the logic out), plus
the fixture-driven pattern for testing the compiled WebAssembly, and why testing
the *binary* rather than the source is the point.

## Common mistakes

- **Mocking so much that only the mocks are tested.** If the database, the auth
  and the queue are all fake, you have written a slow unit test. The
  [unit lesson](unit-testing) has the rule: the more you fake, the less you prove.
- **Testing against staging.** Shared state, someone else's deploy mid-run, and
  a truncate away from a bad day. Own the database or do not touch it.
- **`await sleep(2000)` instead of waiting for a condition.** This is the number
  one cause of a suite that fails only in CI, where machines are slower.
- **A suite that has to run in one exact order.** Tests should be shufflable;
  if they are not, something is leaking between them.
- **Asserting only the response code.** `200` and the row never written is the
  exact bug this layer exists to catch. Assert the effect, not just the reply.
- **Re-running until green.** That is not a pass, it is a habit that ends with
  nobody trusting the suite.
- **One giant test for a whole journey.** When it goes red you learn "checkout
  is broken" and nothing else. Smaller tests name the failure for you.

## Try it yourself

1. **List the journeys, then draw the line.** Take a project you work on and
   write down its top three critical user journeys. For each, name the one write
   operation that would hurt most if it silently did the wrong thing. That list
   is your phase zero — usually three to five tests, not fifty.
2. **Get a throwaway database running in ten minutes.** With Docker running:
   `npm i -D vitest @testcontainers/postgresql`, then start a container in
   `beforeAll`, run your migrations against `getConnectionUri()`, insert a row
   and read it back. The point of the exercise is watching the container appear
   and disappear.
3. **Write one test that proves an effect, not a response.** Pick an endpoint
   that writes to two places. Assert the status code *and* both writes. Then
   comment out the second write and confirm your test goes red — a test you have
   never seen fail is not yet a test.
4. **Break the isolation on purpose.** Add a second test that assumes the row
   from the first one still exists. Run the file, then run the tests in the
   other order and watch it fail. Now fix it with a transaction rollback or a
   truncate, and you will never debug that class of failure blind again.
5. **Find your own dead click.** In a live project, ask where a user could click
   something that does nothing. Then decide honestly which layer would have
   caught it: unit, integration, end-to-end, or only monitoring.
