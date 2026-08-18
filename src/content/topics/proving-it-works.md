---
title: Proving It Works
description: What goes in a pull request besides the diff — templates, screenshots, and the half of QA a machine cannot do.
emoji: 🧾
order: 26
status: learned
session: 16
date: 2026-08-14
tags: [pull-requests, quality, testing, tooling]
videos:
  - title: Checking is Inside Testing (Rapid Software Testing)
    youtubeId: Dd-bW06CSZ8
resources:
  - title: Creating a pull request template for your repository — GitHub Docs
    url: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository
    note: Where the file goes, how to ship more than one, and the query parameter that picks between them.
  - title: "Testing and Checking Refined — James Bach & Michael Bolton"
    url: https://www.satisfice.com/blog/archives/856
    note: The two definitions that settle "can a machine do QA?". First published 2013, still being refined.
  - title: "A Surgical Safety Checklist to Reduce Morbidity and Mortality in a Global Population (NEJM, 2009)"
    url: https://www.nejm.org/doi/full/10.1056/NEJMsa0810119
    note: Nineteen items, eight hospitals, deaths cut from 1.5% to 0.8%. The evidence that short checklists work.
  - title: Painless Bug Tracking — Joel Spolsky
    url: https://www.joelonsoftware.com/2000/11/08/painless-bug-tracking/
    note: The three things every report needs. Written in 2000, and a screenshot on its own still only supplies one of them.
  - title: Setting up CI — Playwright
    url: https://playwright.dev/docs/ci-intro
    note: The workflow snippet that turns a test run into a downloadable report, trace and screenshots.
  - title: Visual comparisons — Playwright
    url: https://playwright.dev/docs/test-snapshots
    note: Screenshot assertions, and the environment pinning you need before they stop being flaky.
  - title: Public buckets — Cloudflare R2
    url: https://developers.cloudflare.com/r2/buckets/public-buckets/
    note: Why the free r2.dev URL is development-only, and what a custom domain buys you.
  - title: Rate limits and access — Figma MCP server
    url: https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/
    note: The real numbers behind "try six calls and see if it stops you".
  - title: Flameshot
    url: https://flameshot.org/
    note: Free, open source, Linux/macOS/Windows, and it has the numbered-counter tool. The cross-platform answer to the Mac-only screenshot app.
---

## The one rule to remember

> **A change is finished when a second person can see that it works without
> redoing your work.**

Two questions came up in this session and neither got an answer in the room. Tom
asked both:

> "What's the best PR structure? How can we leverage headless browsers to
> generate screenshots and put them in there to show that we did the QA — or is
> that something we want to do? Is QA only like a human thing?"

This lesson answers both. The short version: the structure is a **checklist**,
and QA is **two different jobs sharing one name** — one that a machine should
already be doing for us, and one that it cannot do at all.

Why it matters more on a small team: there is no separate QA person, so the pull
request is usually the only moment a second person looks at the work. That
trade-off is written up in [Code Review](code-review). This lesson is the
author's half of it — what you put in the pull request so the review can be about
judgement instead of about re-running what you already ran.

## A pull request template is a checklist

The mechanics are boring and take two minutes. Put a Markdown file at any of
these paths and GitHub pre-fills every new pull request with it:

```text
.github/pull_request_template.md      ← the usual home
pull_request_template.md              ← repo root also works
docs/pull_request_template.md
.github/PULL_REQUEST_TEMPLATE/*.md    ← several templates, pick with ?template=bugfix.md
```

Two rules that catch people out: the template only takes effect once it is
**merged into the default branch**, and unlike issues there is no YAML *form*
version for pull requests — it is a Markdown file, so nothing in it is required.
([GitHub docs](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository))

The interesting part is what goes in it, and the honest evidence comes from
outside software.

**The checklist that worked.** In 2007–08 the World Health Organization put a
**19-item** checklist into eight hospitals across eight countries — Seattle,
Toronto, London, Auckland, Amman, New Delhi, Manila and Ifakara — across 7,688
operations. Deaths fell from **1.5% to 0.8%**. Complications fell from **11% to
7%**. Same surgeons, same hospitals, same patients; the only new thing was a
one-page list read aloud at three moments.
([NEJM](https://www.nejm.org/doi/full/10.1056/NEJMsa0810119),
[summary](https://news.harvard.edu/gazette/story/2009/01/surgical-safety-checklist-drops-deaths-and-complications-by-more-than-one-third/))

Read the design, not just the result. Nineteen items for *surgery*. One page.
Read at three specific moments rather than whenever someone remembered. Every
item was something that kills people when it is skipped — not everything a
theatre team is supposed to do.

**The checklist that does nothing.** A template long enough to be thorough gets
ticked without being read. That failure has a name in every industry that uses
checklists, and the mechanism is the same everywhere: once the list is longer
than the attention available, ticking it becomes the task, and the ticking is
indistinguishable from the doing.

There is a new reason to care about this. **An agent will tick every box you give
it, instantly and convincingly.** A checkbox a person might have left blank out of
honesty comes back ticked. So the template has to be built out of things that are
*falsifiable by the reviewer* — a link they can click, an output they can read —
and not out of promises.

That gives the rule:

> **Every line in the template must be a line a reviewer would otherwise have to
> ask for. If nobody would ask, delete the line.**

A starting shape, five fields, no checkboxes:

```markdown
## What changed
One or two sentences. What a reader needs to know before the diff.

## Why
Link the issue. If there is no issue, say why in one line.

## How to check it
The URL, the page, the exact steps. Assume the reviewer has never seen this feature.

## What I already ran
Commands, test output, screenshots. Say which commit or build it ran against.

## What I did not cover
The honest gap. This is the most useful field on the page.
```

That last field is the one worth defending when somebody wants to cut it. "What I
did not cover" is the only field that cannot be faked into looking good, so it is
the one that tells a reviewer where to actually spend their attention.

## The half of QA a machine can do, and the half it cannot

The question — *is QA only like a human thing?* — has a real answer, and it is
about 25 years old. James Bach and Michael Bolton split the word in two, and once
you see the split the question stops being hard:

> **Testing** is the process of evaluating a product by learning about it through
> experiencing, exploring, and experimenting.
>
> **Checking** is the mechanistic process of verifying propositions about the
> product.
>
> — [Testing and Checking Refined](https://www.satisfice.com/blog/archives/856)

A *proposition* is anything that can be true or false: the price shows £42, the
page returns 200, the add-on appears as its own line item. Verifying one is
mechanical. A machine can do it, faster than you, every time you push.

Testing is the other thing — the part where you notice that the price is right
but the currency symbol is wrong for this store, which nobody wrote a proposition
about because nobody thought of it. Their line: **"Testing encompasses checking,
whereas checking cannot encompass testing."**

So the answer:

| The work | Who does it | Where it belongs |
| --- | --- | --- |
| Does the page load, at 200, with the right theme? | Machine | CI, on every deploy |
| Does the add-on come through as a separate line item? | Machine, once someone writes the proposition | A test, then CI |
| Does this look right at 375px? | Machine takes the picture, **person judges it** | Screenshot in the pull request |
| What else did this change break? | Person | You, before you open the PR |
| Is this what the client actually meant? | Person | You, or the review |
| Does anything here feel wrong? | Person | Only a person ever |

**The screenshot part of QA is checking, and it should be automated.** The "what
else did I just break" part is testing, and no amount of tooling replaces it.
There is a hidden third answer in the question too: a lot of what gets called QA
is checking that nobody ever automated, so it gets done by hand, late, by whoever
is least happy about it.

There is a sharp corollary. If a check only ever runs when a reviewer runs it,
it was scheduled at the most expensive possible moment — same rule as the one in
[Code Review](code-review): if all you are doing is running a pre-prepared thing,
share it so the author runs it first.

## What makes a screenshot evidence

Joel Spolsky wrote the shortest useful thing about this in 2000. A report needs
exactly three parts:

1. **Steps to reproduce**
2. **What you expected to see**
3. **What you saw instead**

([Painless Bug Tracking](https://www.joelonsoftware.com/2000/11/08/painless-bug-tracking/))

A bare screenshot supplies part of number three and nothing else. That is the
whole reason an annotation tool is not a tooling preference:

> "It's stupid, but in Google Analytics, if you send somebody a screenshot, they
> don't know how to recreate it. So being like *screenshot, menu, folder, one
> click there* and it adds a one to it."

The numbered circles **are** the steps to reproduce. Annotating a screenshot is
the cheapest way to add the two thirds that were missing, and it takes about
fifteen seconds.

What to put on the picture, in order of how much time it saves the reader:

- **Numbers** on the clicks, in order. This is the repro.
- **A box or arrow** around the thing you mean, so the reader is not hunting.
- **The address bar left in**, or the URL typed underneath. A screenshot with no
  URL is a screenshot of somewhere.
- **Which build.** Commit SHA, theme name, or "staging at 10:40". More on this
  below, because it is the one people skip.
- **A redaction box** over anything a client should not see, before you upload it
  anywhere.

Tools, since the answer people reach for first is usually Mac-only:

| Tool | Platform | Why you would pick it |
| --- | --- | --- |
| [Shottr](https://shottr.cc/) | macOS | Fast, has the counter tool, scrolling capture, one-time payment |
| [Flameshot](https://flameshot.org/) | Linux, macOS, Windows | Free and open source, **has the numbered-counter tool**, and it is scriptable from the command line |
| [Gyazo](https://gyazo.com/) | Cross-platform | The "capture, get a URL instantly" model |
| macOS Markup / Windows Snipping Tool | Built in | Fine for an arrow. No counters, no upload |

Flameshot is the direct answer to *"I'm not sure if they have a Linux flavour"* —
it is cross-platform, free, and it has the exact feature that makes the workflow
worth adopting.

## Headless screenshots: what they prove, and what they do not

Yes, you can generate them in CI, and it is not much work. Playwright's own CI
guide is the pattern: run the tests, then upload the report as a build artifact.

```yaml
- uses: actions/upload-artifact@v4
  if: ${{ !cancelled() }}
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

([Playwright CI](https://playwright.dev/docs/ci-intro))

Two upgrades on plain screenshots, both free once this is wired up:

- **Traces beat screenshots.** A Playwright trace replays the whole run — every
  action, the DOM at each step, network, console. A screenshot shows you the end
  state; a trace shows you how it got there. Attach the trace and a reviewer can
  answer their own question without asking you.
- **Screenshot assertions** (`toHaveScreenshot`) turn "it looks right" into a
  proposition a machine can check. The honest cost is in the
  [docs](https://playwright.dev/docs/test-snapshots): rendering differs between
  operating systems and even browser versions, so unless you pin the environment
  — the official Docker image, or CI-generated baselines — you get failures that
  are about font hinting rather than about your change. Pin it, or the suite
  teaches people to ignore red.

And the limit, stated plainly, because a screenshot in a pull request is
persuasive out of proportion to what it proves:

| A screenshot proves | A screenshot does not prove |
| --- | --- |
| It rendered | It works |
| At that viewport | At any other viewport |
| On that commit, at that moment | That it still does |
| The happy path got that far | Anything about the paths you did not shoot |

## Say which build it ran against

The most useful thing in this session was not a technique, it was a five-second
failure. Somebody ran a test order on a client store, reported that the line
items did not show up in the finance report, and then:

> "I'm not sure if they ran it before or after we activated the function."

That single sentence destroyed the whole test. Not because the tester did
anything wrong — because the result arrived without a build stamp, and a result
without a build stamp cannot be told apart from a result about a different build.
Two people then have to redo the work to find out which one it was.

> **Evidence with no version on it is not evidence. It is a rumour with a
> screenshot attached.**

The fix is one line in the pull request, or one line under the screenshot:

```text
Checked on: staging, theme "main-a3f91c2", 2026-08-14 10:40, pricing app ON
```

Cheap habits that make this automatic:

- Put the commit SHA in the page somewhere (a `<meta>` tag, a build banner on
  non-production) so every screenshot carries it for free.
- Have CI name its artifacts after the SHA rather than "report".
- When you ask someone else to test, tell them what to write down, not just what
  to click.

The client on that project did the same thing in the other direction: they
reverted payments back to **test mode** that morning specifically so test
checkouts would run. Making an environment testable on purpose is the same move
as stamping the build — both are about the result being trustworthy afterwards.

## Where the evidence lives after the thread scrolls

A screenshot pasted into a chat channel has three problems: the client cannot see
it, search will not find it in a month, and it dies with the channel's retention
setting. CI artifacts are better and still temporary — Playwright's own example
sets `retention-days: 30`, and 30 days is a normal ceiling.

The shape that solves it is a small object store behind a domain you control —
an **R2 bucket** or an S3 bucket, credentials in the shared password manager — so
a screenshot, an HTML page or a generated report becomes a link anyone can open,
including a client who has no access to your AI tooling and never will.

If you set one up, read the docs before you use the free URL:

- Cloudflare's `r2.dev` subdomain is **rate limited and intended for development
  only**.
- A **custom domain** is what gets you the CDN cache, WAF rules and access
  control. Same bucket, production-shaped.
- ([Public buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/))

One caution that belongs right next to it: a public bucket is *public*.
Everything on it is world-readable to anyone with the URL, and an unlisted URL is
not a permission. Client screenshots with order data, customer names or
unreleased pricing do not go there.

## A QA bot is the obvious next step

The shape people keep converging on: a bot that runs a headless browser against
any pull request carrying a particular tag or checklist, adding a quality pass
that CI does not do — screenshots included. Everything on this page is what would
make its output trustworthy rather than decorative, and the table above is the
ceiling on what it can prove. It is also the kind of thing to build *between*
launches, not during one ([The Week Before Launch](the-week-before-launch)).

## Four things worth copying

- **Open the template as a pull request, not as a commit.** A template is a
  team agreement about what a pull request owes its reader, so it should get the
  same review as the code. Ours is in flight on one repo now, with one round of
  feedback outstanding — that round is the point.
- **Ship the issue template at the same time.** Same reasoning as the PR one, and
  the reason it works with agents is that models are very good at mimicking:
  showing the shape is cheaper than describing the shape in every prompt. See
  [Code Review](code-review).
- **Turn a recurring manual check into a proposition.** "When a product is added
  with an accessory, does the accessory show as its own line item on the order,
  and in the finance report?" is a sentence that is true or false, which by the
  split above means it belongs in a test rather than in someone's afternoon.
- **Know what your design tool's API limits actually are before you invent a
  workaround.** A team heuristic of *"make six calls and see if it stops you"*
  turned out to be exactly right, for a reason nobody knew: per
  [Figma's own limits](https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/),
  a View or Collab seat gets roughly **6 calls a month**, while a Dev or Full seat
  gets **200 a day** on Professional and **600 a day** on Organization. So "can
  you make a seventh call?" is literally a seat test. (And while we are here: MCP
  is **Model Context Protocol**, which auto-generated meeting notes love to
  expand into something else.)

## Try it yourself

1. **Write the five-field template** for one repo you work in, put it at
   `.github/pull_request_template.md`, and open it as a pull request. Delete any
   line a reviewer would not have asked for. It should fit on one screen.
2. **Audit your last pull request against the split.** List every check you ran
   by hand. For each one, ask whether it was checking (a true/false proposition)
   or testing (you were looking around). Every checking row is a thing CI could
   have done while you slept.
3. **Annotate one screenshot properly.** Take a bug you would normally paste raw,
   add numbered steps, a box on the thing you mean, the URL and the build. Time
   yourself — it is about fifteen seconds — then compare it with what you would
   have sent.
4. **Try to date a result.** Find a test result someone posted in chat last week
   and try to work out which commit or build it ran against. If you cannot, that
   is the habit in this lesson, and it costs one line.
