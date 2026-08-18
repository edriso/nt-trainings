---
title: The Week Before Launch
description: What you can still measure on a site that is behind a password, what you honestly cannot, and how to triage the feedback that lands in the last week.
emoji: 🚦
order: 29
status: learned
session: 18
date: 2026-08-18
tags: [launch, performance, testing, process]
resources:
  - title: Testing authenticated pages — Lighthouse docs
    url: https://github.com/GoogleChrome/lighthouse/blob/main/docs/authenticated-pages.md
    note: The four documented ways to point Lighthouse at a page behind a login. Read this before anyone says it cannot be done.
  - title: Shopify Lighthouse CI GitHub Action
    url: https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci
    note: Audits the home, product and collection page on every pull request — and takes the storefront password as a repository secret.
  - title: Performance best practices for Shopify themes
    url: https://shopify.dev/docs/storefronts/themes/best-practices/performance
    note: Shopify's own list, ordered by impact. Most pre-launch findings on a storefront will be somewhere on it.
  - title: Theme Check — AssetSizeJavaScript
    url: https://shopify.dev/docs/storefronts/themes/tools/theme-check/checks/asset-size-javascript
    note: One example of the whole class of problem the linter catches for free, before anyone opens a browser.
  - title: Third-party JavaScript performance — web.dev
    url: https://web.dev/articles/third-party-javascript
    note: Why the scripts you cannot see before launch are the ones that decide the score after it.
  - title: Performance budgets 101 — web.dev
    url: https://web.dev/articles/performance-budgets-101
    note: Google's argument against "we will look at speed after launch". The strongest case for the other side.
  - title: Lighthouse CI
    url: https://github.com/GoogleChrome/lighthouse-ci
    note: Run Lighthouse on every commit and fail the build on a regression. The delta is the useful part, not the score.
  - title: FrequencyReducesDifficulty — Martin Fowler
    url: https://martinfowler.com/bliki/FrequencyReducesDifficulty.html
    note: 'The source of "if it hurts, do it more often" — the argument behind pushing a deploy you are not fully sure about.'
  - title: The Scrum Guide
    url: https://scrumguides.org/scrum-guide.html
    note: 'Where "the Product Owner is one person, not a committee" comes from — the structural version of routing a request instead of answering it.'
---

## The one rule to remember

> **Measure everything that does not depend on being live. Schedule the rest for
> the day after.**

Launch week is not a smaller version of a normal week. Two things change at once.
The site is nearly finished, so the bugs left are the ones nobody can reproduce
yet. And feedback starts arriving from people who have never seen the project
before, in a list that looks exactly like a backlog and is not one.

This lesson is built around a question asked at the end of a session, a week out
from a store launch:

> "Before launch, are we going to run some Lighthouse testing or some other types
> of testing for us to see where we lack and fix everything before launch?"

The answer in the room was "we can, but it is difficult" — the site was behind a
login, and the third-party scripts that usually do the damage were not live yet.
That is right about the constraint, and it is worth taking further, because
"difficult" hides the useful split: some pre-launch measurements are perfectly
valid and some are worthless. Telling them apart is the whole skill.

## A login is not the blocker

Start here, because this is the part most people get wrong. "The site is password
protected" is not a reason Lighthouse cannot run. Lighthouse's own documentation
lists four ways past it:

| Way | What you do | Reach for it when |
| --- | --- | --- |
| **Chrome DevTools** | Log in normally, open the Lighthouse panel, **uncheck "Clear storage"**, run | You want one look, right now |
| **`--extra-headers`** | `lighthouse <url> --extra-headers='{"Authorization":"…"}'` | The gate is basic auth or a token |
| **A debugging Chrome** | Launch Chrome with an open debug port, log in by hand, then `lighthouse <url> --disable-storage-reset --port <port>` | You want to repeat runs without scripting the login |
| **Puppeteer** | Script the login, hand the logged-in page to Lighthouse | It has to run in CI |

Lighthouse calls Puppeteer *"the most flexible approach for running Lighthouse on
pages requiring authentication"*
([docs](https://github.com/GoogleChrome/lighthouse/blob/main/docs/authenticated-pages.md)).

On Shopify there is a shorter path still, and it is official. Shopify ships a
[Lighthouse CI GitHub Action](https://shopify.dev/docs/storefronts/themes/tools/lighthouse-ci)
that *"runs a Lighthouse audit as part of your continuous integration process for
every pull request that you create. It tests the performance of your theme's home
page, a product page, and a collection page."* On the password problem it is
explicit:

> "If your store is password protected, then you should also add a repository
> secret that contains your store password. If you don't provide it, then
> Lighthouse is redirected to the password page and can't accurately test your
> theme's performance."

So the login is a config line. The real constraint is different, and bigger: what
a pre-launch number actually *means*.

## Two kinds of finding, and only one is trustworthy yet

Split every audit result in two. Is this a property of **the code**, or a property
of **the environment it ran in**?

| Property of the code — act on it now | Property of the environment — wait for launch |
| --- | --- |
| Image with no `width`/`height` (layout shift) | LCP measured in seconds |
| The LCP image lazy-loaded, or hidden behind an animation | TTFB, and anything about the CDN |
| A render-blocking script in `<head>` | Total page weight once the apps are installed |
| Missing `srcset`, images served far larger than displayed | INP under real traffic |
| Accessibility failures — contrast, labels, focus order | Anything from CrUX or Search Console |
| Broken structured data, wrong canonical, missing alt text | The cost of third-party tags |

The left column is stable. `loading="lazy"` on the hero image is wrong on your
laptop, wrong on staging and wrong in production, and the fix is the same in all
three. Those findings are worth collecting now, and a pre-launch Lighthouse run
pays for itself on them alone.

The right column is where "difficult" was the right word. A staging box is not a
production box, a development theme is not the live theme, and — the big one —
the tag manager is empty.

## The part you genuinely cannot see yet

The reason, put plainly in the session:

> "All the stuff that kills you is the third-party plugins, and those won't be
> live until launch. So there's no Google Pixel or all the Facebook meta tag
> stuff."

That is not a small caveat. web.dev's
[third-party JavaScript](https://web.dev/articles/third-party-javascript) guidance
notes that many popular embeds ship **over 100 KB of JavaScript, sometimes up to
2 MB**, and that because the code is outside your control it brings problems your
own code does not: extra connections and DNS lookups, main-thread blocking, and
behaviour that can change without a deploy on your side.

Which gives you two rules for the last week:

1. **Do not promise a number.** A green score on a staging site with no pixels,
   no chat widget, no consent banner and no review app is a measurement of a site
   that will never exist. Report findings, not scores.
2. **The day the tags go on is a measuring day.** Put it in the plan before
   launch, not after someone asks why the site got slower.

One more thing worth knowing before you read any storefront's score: Shopify warns
in its own
[performance best practices](https://shopify.dev/docs/storefronts/themes/best-practices/performance)
about *"apps that cheat Lighthouse and PageSpeed tests, such as apps that inject
transparent elements or serve different pages to crawlers"*. A suspiciously good
score on a heavy store is a thing to check, not to celebrate.

## The linter is the cheap 90%

The other half of the answer was about return on effort:

> "The architecture is pretty codified… it'll catch the majority of our linter
> stuff, setup is pretty good. It catches image lazy loading flags and stuff that
> otherwise you're in the… if you're doing the 90% that we're doing, the 10%
> doesn't have a lot of ROI."

This is a real argument and it is easy to check, because Shopify's linter is
public. [Theme Check](https://shopify.dev/docs/storefronts/themes/tools/theme-check/checks/asset-size-javascript)
ships rules that are pure performance findings, caught at commit time with no
browser involved at all:

- **`AssetSizeJavaScript`** — flags a JavaScript file over a compressed size
  threshold (10,000 bytes by default). A performance budget, enforced, per file.
- **`RemoteAsset`** — flags assets loaded from someone else's CDN. Browsers now
  partition the HTTP cache by the requesting site, so a shared CDN copy is no
  longer a shortcut and costs you an extra connection instead.
- **`ImgLazyLoading`** — whose documentation carries the correction most people
  need: lazy loading *"has been observed to be more detrimental than helpful when
  used everywhere"*, and `loading="lazy"` belongs **only** on elements that are
  not visible on first paint.

If a rule can be a lint rule, make it one. A finding that arrives in a pull
request costs a minute. The same finding, found by hand in launch week, costs an
afternoon and an argument about whether it matters.

## Where the argument goes the other way

The honest counter-argument to "we will look at performance after launch" comes
from Google, and it is not soft. The whole point of a
[performance budget](https://web.dev/articles/performance-budgets-101) is that it
gets set *early*:

> "The purpose of a performance budget is to make sure you focus on performance
> throughout a project… setting it early will help prevent backtracking later."

The logic: performance is a design constraint, not a phase. If the first time
anyone measures is after launch, every decision that made the site slow has
already been made, shipped and paid for once. Removing a component from a live
site costs far more than not choosing it during the build.

Both things are true, and the middle ground is specific:

> **Read a pre-launch run as a delta, not as a score.**

Absolute numbers from a staging box are meaningless. The *difference* between two
runs on the same box is not. That is exactly what
[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) is for: run it per
pull request, compare against the branch you are merging into, and fail the build
when a change adds 400 KB. Nobody has to believe the number for that to be
useful — they only have to believe the subtraction.

So for launch week: no site-wide audit sprint, yes to a per-PR check that catches
regressions, and a dated calendar entry for the real measurement once the tags are
live.

## Ship the deploy, then roll forward

The same week produced a decision that looks like the opposite of caution and is
not — pushing a build to staging without waiting for it to be perfect:

> "I want to get the new one out and figure out just how we hit refresh. So if
> something's broken, I'll continue to work on that. I have the next couple hours
> free to just stamp down whatever is in staging, but try not to merge anything
> risky."

And, about a set of migrated pages that came back from the designer looking rough:
*"I might just launch it and do the same two-hour roll forward."*

Martin Fowler's name for this instinct is
[FrequencyReducesDifficulty](https://martinfowler.com/bliki/FrequencyReducesDifficulty.html)
— **"if it hurts, do it more often."** A deploy you have been sitting on for two
weeks is frightening precisely because it is two weeks wide. The fix is not to
polish it harder; it is to make deploys smaller and more frequent until each one
is boring.

But "push it anyway" is only safe with conditions attached, and all three were
said out loud:

1. **Someone is free to fix it now.** "I have the next couple hours free" is the
   load-bearing part of that sentence. Rolling forward with nobody watching is
   just breaking something.
2. **Risky things are held back.** "Try not to merge anything risky" — the deploy
   is deliberately made boring first. Approved, low-blast-radius work only.
3. **It goes to staging, not production.** A staging environment is what makes
   "accepting some breakage" a cheap sentence instead of an expensive one.

Take away any one of those and this becomes recklessness with a quote attached.
The deployment mechanics that make rolling forward fast — cache busting, and the
difference between merging and releasing — are in
[Handling Browser Cache During Deployments](deployment-browser-cache) and
[Maintaining Live Sites](maintaining-live-sites).

## The QA list is not a backlog

The second half of launch week is the feedback, and it needs a different reflex
from normal ticket work. The rule set in this session was a time box:

> "If anything seems like a bigger lift, or more than a one to two hour task, hold
> off on it."

The reasoning behind it is the part worth keeping:

> "The feedback that we're going to get from them is not a request. Sometimes it's
> 'I didn't know this was going to work this way', or 'should we reformat all of
> our things?' despite never having talked about it. And they're not coming from
> people who have the decision — they're coming from people who are probing
> questions to gain understanding. So don't go off on a two-day refactor… It's not
> coming from the CEO."

Three different things arrive in the same list, and they need three different
answers:

| What it actually is | Looks like | What it needs |
| --- | --- | --- |
| **A question** | "Why does it do this?" | An answer, in the thread. Zero code. |
| **A defect** | It does not match what was agreed | A ticket, and it is on you |
| **A change request** | New behaviour nobody scoped | Route it to whoever decides, with a cost attached |

Most of a launch-week QA list is the first row, and the failure mode is treating
it as the third. The Scrum Guide states the structural version of this:

> "The Product Owner is one person, not a committee… Those wanting to change the
> Product Backlog can do so by trying to convince the Product Owner."

Note what that does *not* say. It does not say ignore people. It says requests get
routed to whoever owns the trade-off, instead of being settled by whoever reads
them first. The same session applied it to a design question that arrived from an
unexpected direction: it went onto the board for the producer to triage, rather
than straight to the designer who would have to do the work.

Routing is not bureaucracy here. It is how a request gets weighed against
everything else in the launch, by someone who can see everything else in the
launch.

The one-to-two-hour box does the same job in miniature. It is not a claim that big
tickets do not matter — it is a claim that launch week is the worst possible
moment to decide that they do.

## Four things worth copying

**Point QA at what is actually shipping.** When a client is still triaging the
catalogue, QA effort on a product that is about to be unpublished is effort spent
twice — once doing it, once discovering it did not count. Ask for the shortlist
first; in this case it was a top-50 list that already existed.

**Close the stale issues before you count the open ones.** Building a QA list
from every open issue and closing everything that had gone stale with no commits
against it removed 17 tickets in an afternoon. Launch week is the one week where
the shape of the list is worth more than the length of it.

**Queue the launch-dependent work deliberately.** Structured-data cleanup,
redirects and the robots file all have effects that can only be seen once crawlers
can reach the site (the mechanics are in
[Technical SEO Hygiene](technical-seo-hygiene)). They are not "behind schedule";
they are correctly ordered. Say so, or someone will read the backlog as a delay.

**Capture the "before" while the old site is still up.** Field data needs a
public, crawled site, so a password-protected pre-launch site will never have any.
If you want a before-and-after graph a client can check, the "before" has to be
pulled while the old site is live — see [Web Performance](web-performance). It has
a deadline, and the deadline is launch day.

## Try it yourself

1. **Run Lighthouse on something behind a login.** Open a staging site you have
   access to, log in, open DevTools → Lighthouse, **uncheck "Clear storage"**, and
   run it. Then run it again *with* the box checked and watch it audit the login
   page instead. That difference is the whole trap.
2. **Sort one report into two columns.** Put every finding in "property of the
   code" or "property of the environment". Fix one from the left column today.
   Write the right column into a note dated for launch day.
3. **Time-box a real QA list.** Take the next feedback list you get and label each
   row *question*, *defect*, or *change request* before doing anything. Count how
   many are questions. That number is usually the surprise.
4. **Find one finding a linter could have caught.** Look at the last performance
   fix you made by hand and check whether a rule already exists for it — start
   with the [Theme Check list](https://shopify.dev/docs/storefronts/themes/tools/theme-check/checks/asset-size-javascript).
   If one does, switching it on is worth more than the fix was.
