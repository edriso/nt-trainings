---
title: Marketing & Business Impact
description: The three budgets a marketing lead balances, the money words behind them, and how to say what a ticket was worth.
emoji: 📣
order: 21
status: learned
session: 11
date: 2026-08-07
tags: [marketing, attribution, business]
resources:
  - title: About Quality Score — Google Ads Help
    url: https://support.google.com/google-ads/answer/6167118
    note: Read this one closely. Google says outright that Quality Score is a diagnostic, not an auction input.
  - title: About Ad Rank — Google Ads Help
    url: https://support.google.com/google-ads/answer/1722122
    note: The mechanism that actually sets your position and your cost per click.
  - title: About Google Ads — Google Ads Help
    url: https://support.google.com/google-ads/answer/6349091
    note: The official overview of how paid search works and what advertisers pay for.
  - title: Get started with attribution — Analytics Help
    url: https://support.google.com/analytics/answer/10596866
    note: How credit for a sale gets assigned to a channel — and why no two tools agree.
  - title: Owned, Paid, and Earned Media — Penn State Extension
    url: https://extension.psu.edu/owned-paid-and-earned-media-for-effective-marketing
    note: A short, jargon-free explainer of the 2009 framework (Daniel Goodall) that the three-budget split is a version of.
  - title: Interaction to Next Paint (INP) — web.dev
    url: https://web.dev/articles/inp
    note: Check the current Core Web Vitals here rather than trusting any deck — the metrics themselves change.
---

## The one rule to remember

> **Every ticket we ship is someone's marketing dollar at work.**

Clients almost never ask whether the code is clean. They ask *"I spend $10k a
month on Google and Facebook — which one is working?"* and *"was this feature
worth building?"*. If you can answer those two questions in the client's own
units, you stop being the person who builds tickets and start being the person
who is asked what to build.

The good news: the vocabulary is small, it is arithmetic, and once you can name
the numbers the conversations get much shorter.

## The three budgets

A marketing lead — a CMO, or the founder wearing that hat — looks at roughly
three buckets and moves money between them. This is a working version of the
classic **paid / owned / earned** split, named by Daniel Goodall at Nokia in
2009:

| Bucket | What it is | What it costs | How fast it responds |
| --- | --- | --- | --- |
| **Organic / SEO** | People who find you through search, or type your name | Nobody's clicks are billed, but it costs *our time* — content, hygiene, speed | Slow. Months. It is a long-term bet, not a tap you turn. |
| **Paid / PPC** | Search and social ads. Pay per click on Google, Meta, and friends | A real cost per click, billed daily | Instant, and instantly reversible. Turn it off, traffic stops today. |
| **Email & SMS** | Customers you already have and can contact directly | Almost nothing per send | Fast, but the list is finite — you can only send so often before people leave. |

Three things a dev should take from that table:

- **"Free" organic traffic is not free.** It is prepaid. The invoice is our
  hours: technical hygiene, page speed, content. The client knows this — Tom's
  framing was that they do not consider it free, they consider it a long-term
  investment. So "how much do we spend on SEO?" is really "how much of the team's
  time do we point at it?".
- **Paid is the only tap with an instant valve.** Which is why it gets cut first
  when cash is tight, and why paid performance questions arrive urgently.
- **Email is the only channel we own.** No auction, no algorithm change. Which
  is why "capture the email" features are worth more than they look.

## The money words

Six terms cover most conversations. They are all division:

| Term | What it means | How it is worked out |
| --- | --- | --- |
| **CPC** — cost per click | What one visit from an ad costs | ad spend ÷ clicks |
| **Conversion rate** | Share of visits that end in the thing you want | conversions ÷ sessions |
| **AOV** — average order value | What a typical order is worth | revenue ÷ orders |
| **CAC** — customer acquisition cost | What it costs to win one *new customer* | spend ÷ new customers |
| **LTV** — lifetime value | What a customer is worth over the whole relationship | total expected profit per customer |
| **ROAS** — return on ad spend | Revenue produced per unit spent | revenue ÷ ad spend |

The pair that drives decisions is **CAC and LTV**. If a customer is worth $150
over their lifetime and costs $40 to acquire, that channel is worth feeding. If
they cost $180, it is burning money — no matter how good the click-through rate
looks. A widely used rule of thumb is an LTV:CAC ratio around **3:1**, which is a
heuristic from investor practice rather than a law of nature; the honest version
is that the ratio has to cover everything CAC leaves out (product cost,
shipping, support, returns).

Watch out for the word "conversion". It means whatever the tool was configured
to count — a purchase, an add-to-cart, a newsletter signup, a phone tap. Two
dashboards reporting different conversion rates are usually both right about
different events. Always ask *conversion to what?*

## Quality Score: what is true, and what everyone gets wrong

Here is where the session's SEO thread and its marketing thread meet — and where
the popular version of the story is wrong in a way worth knowing, because clients
and vendors will repeat it to you.

**The popular version:** good SEO raises your site's "quality score", a
behind-the-scenes rating from spammy to trustworthy; a high score makes Google
charge you less per ad click and rank you higher organically.

**What Google actually documents:**

- **Quality Score is a diagnostic, not a price.** It is a 1–10 number per
  *keyword* in a Google Ads account, built from three things: expected
  click-through rate, ad relevance, and landing page experience. Google states
  flatly that it "is not an input in the ad auction" and "is not a key
  performance indicator and should not be optimized".
- **The thing that sets your cost is Ad Rank.** Every search runs an auction, and
  Ad Rank decides both your position and what you actually pay. Its inputs are
  your bid, **ad and landing page quality**, Ad Rank thresholds, how
  competitive the auction is, the search context (device, location, query), and
  the expected impact of your ad assets. And Google does say the thing that
  matters here: *"Higher quality ads can often lead to lower CPCs. That means
  you pay less per click when your ads are higher quality."*
- **Organic ranking does not use any of this.** Ads and Search are separate
  systems. There is no site-wide score you can raise to rank better — as covered
  in [Technical SEO Hygiene](technical-seo-hygiene), Google says it does not keep
  a general authority score for a site at all. Buying ads does not help your
  organic rankings, and having good rankings does not lower your ad prices
  directly.

So the popular version has the **conclusion roughly right and the mechanism
wrong**, and the mechanism is where our work lives. The real bridge between the
two channels is one thing:

> **The landing page.** "Landing page experience" is an explicit component of ad
> quality, and page experience and speed are signals in organic Search. Making
> the page fast, relevant to what was promised, and easy to use is the one fix
> that pays in both channels at once.

That is the most useful sentence in this lesson for a developer, because it turns
"we improved LCP" into an argument about ad bills. See
[Web Performance](web-performance) for the speed half.

## The three numbers to watch weekly

For an account in maintenance mode — launched, now being tended — the reporting
habit worth keeping is small: **total revenue, total users, conversion rate**,
week over week. Three numbers, one table, every week.

Their power is in how they move *together*:

| Users | Conv. rate | Revenue | Usual story |
| --- | --- | --- | --- |
| ↑ | ↓ | ↑ | Paid spend went up. Cheaper, colder traffic. Normal, not a bug. |
| ↓ | ↑ | ↓ | Paid got cut. The remaining visitors are the keen ones. |
| flat | ↓ | ↓ | **Look at the site.** Something we shipped, or something broke. |
| flat | ↑ | ↑ | The good one. Same traffic, more of it converting — this is what CRO buys. |

The trap in row two is worth spelling out: **conversion rate can rise while
revenue falls.** If someone reports "conversion rate is up 12%" with no traffic
number next to it, you do not yet know whether that is good news. Ratios need
their denominator in the room. And the row that should always pull our attention
is the third — flat traffic with a falling rate is the one that is usually *us*.

## Turning a ticket into a business case

The move is to convert your change into money using numbers the client already
publishes. One formula covers most of it:

```
extra revenue per month
  = monthly sessions × (new conversion rate − old conversion rate) × AOV
```

Worked example, with the kind of numbers a mid-size store actually has —
250,000 sessions a month, 2.9% purchase conversion, $85 average order:

```
today:      250,000 × 2.90% × $85  = $616,250 / month
+0.1 pt:    250,000 × 3.00% × $85  = $637,500 / month
                                     ─────────
                                     +$21,250 / month  (≈ $255k a year)
```

A tenth of a percentage point — barely visible on a dashboard — is a quarter of a
million dollars a year. That is the real argument for measuring small changes
instead of arguing about them, and it is the same arithmetic behind
[Experimentation Velocity](experimentation-velocity).

Two rules for using this honestly:

1. **State it as a range, and say it is an estimate.** "If this holds, roughly
   $15k–25k a month." Never present a modelled number as a measured one.
2. **Prefer a measured delta to an assumed one.** The formula above is a
   *forecast* until an [A/B test](ab-testing) supplies the real difference. The
   forecast is for deciding what to build; the test is for claiming credit.

And if the change does not touch conversion at all — a faster build, a fixed
redirect, a test suite — the business case is cost or risk, not revenue: hours
saved per week, incidents avoided, ad spend not wasted on a page that 404s.

## Attribution, briefly

Every tool will give you a different answer for "which channel made this sale",
because a customer who saw an Instagram ad, searched your name, clicked an
email, and then bought has genuinely been touched by four channels. Attribution
is the set of rules for splitting that credit — last click, first click,
data-driven — and none of them is the truth, they are conventions.

Two practical rules:

- **The store is the source of truth for revenue.** For our clients that means
  Shopify. GA4 is the source of truth for *where traffic came from*. If they
  disagree on revenue, Shopify wins — see [Google Analytics 4](google-analytics-4).
- **Compare like with like over time.** One tool, one attribution setting, week
  over week. Switching tools mid-argument makes every trend meaningless.

## Field notes

- **The weekly table is a real habit, not a theory.** On the accounts we
  maintain, someone keeps exactly the revenue / users / conversion-rate view
  described above and posts it every week. Worth copying rather than inventing:
  as a build moves from net-new into maintenance, that table is how anyone
  notices a regression no error tracker will catch.
- **Internal decks age faster than the argument they make.** A 2023 deck we still
  reference argued that paid-ad cost and organic rank are both tied to Core Web
  Vitals. The argument holds — via landing page experience, not via a site-wide
  score — but the metrics it names have moved on: First Input Delay has been
  replaced by [Interaction to Next Paint](https://web.dev/articles/inp). Take the
  reasoning from a deck and re-check every number against web.dev.
- **Budget is not the same as scope.** A budget originally spread over three
  months, compressed into one, is the same work with better cash flow for the
  client — and it can open the door to expansion rather than closing it. When a
  client shortens a timeline, the interesting question is which of the two they
  are actually optimising.

## Try it yourself

1. Open the [GA4 demo account](https://support.google.com/analytics/answer/6367342), go to Acquisition, and compare Paid Search with Organic Search. Which produces more revenue *per session*? Now write the one sentence you would send a client about it.
2. Take the store you work on. Find monthly sessions, conversion rate and AOV, and run the business-case formula for a 0.1 percentage-point gain. Was the answer bigger or smaller than you expected?
3. Find a real ad on Google for a product you know, click it, and grade the landing page on the three Quality Score components: does the ad's promise match the headline, is the page fast, is the next step obvious? Write down the one change you would test first.
4. Take the last ticket you shipped and write its business case in two sentences — who it affects, and which of revenue, cost, or risk it moves. If you cannot name the number, say so; that is a useful finding too.
