---
title: Reading a Launch's Numbers
description: '"Orders up 10% since launch" is a good start, not a result. How to tell what the launch did from what would have happened anyway.'
emoji: 📈
order: 37
status: learned
session: 21
date: 2026-10-23
tags: [analytics, measurement, launch, ecommerce]
resources:
  - title: "Inferring Causal Impact Using Bayesian Structural Time-Series Models — Brodersen et al., 2015"
    url: https://arxiv.org/abs/1506.00356
    note: Google's paper on estimating what would have happened without a launch. Read the abstract and Figure 1; the picture explains the whole idea.
  - title: CausalImpact — Google (R package docs)
    url: https://google.github.io/CausalImpact/CausalImpact.html
    note: The free tool from that paper, with a worked example. Useful when there is no clean control group.
  - title: Difference in differences — Wikipedia
    url: https://en.wikipedia.org/wiki/Difference_in_differences
    note: The method behind "compare our change to a store that did not change". The diagram is the fastest way in.
  - title: Twyman's law — Wikipedia
    url: https://en.wikipedia.org/wiki/Twyman%27s_law
    note: '"Any figure that looks interesting or different is usually wrong." Short, and worth remembering before you share a big number.'
  - title: "Trustworthy Online Controlled Experiments — Kohavi, Tang & Xu (2020)"
    url: https://www.cambridge.org/core/books/trustworthy-online-controlled-experiments/D97B26382EB0EB2DC2019A7A7B518F59
    note: The standard book on measuring changes online. Chapter 3 is about Twyman's law and the novelty effect.
  - title: Regression toward the mean — Wikipedia
    url: https://en.wikipedia.org/wiki/Regression_toward_the_mean
    note: Why a change made after a bad month will look like it worked, even if it did nothing.
  - title: ShopifyQL COMPARE TO — Shopify
    url: https://shopify.dev/docs/api/shopifyql/latest/syntax/compare-to
    note: The official way to compare against last year with weekdays lined up (previous_year_match_day_of_week).
---

## The one rule to remember

> **A before-and-after number is not a result until you know what would have
> happened anyway.** The launch effect is the gap between what happened and that
> "anyway" line — not the gap between this month and last month.

After a launch, everyone wants one number. The client wants to hear the new site
works; we want to hear our work paid off. That is fine, and celebrating is fine.
But a raw before/after number mixes the launch with everything else that changed
at the same time: the season, the ads, the way orders are counted. If we credit
the launch with all of it, we will promise the next client the same result and
miss.

This matters for devs, not only marketers. We are the people who know what
changed on launch day — tracking, checkout, redirects, emails — and that is
exactly what moves the numbers.

## The number we got

Take a typical report, nine days after a launch (illustrative numbers, close to
a real one we saw):

| Metric | Change from baseline |
| --- | --- |
| Orders | **+10%** |
| Revenue | **+9%** |
| Best single day | a new record |

Two quick readings anyone can do in their head:

**1. Revenue grew a little slower than orders, so the average order got a bit
smaller.** Average order value (AOV) is revenue ÷ orders. If orders are ×1.10 and
revenue is ×1.09, then AOV is 1.09 ÷ 1.10 ≈ 0.99 — about **1% lower**. Not bad on
its own: more people bought, and each bought slightly less. But it is worth
knowing, because a homepage that pushes a cheaper product would show exactly this
pattern.

**2. The best day is the least useful number on the page.** One record day is the
most exciting figure and the one with the most luck in it. Compare averages per
day, or better, per full week. ([Twyman's law](https://en.wikipedia.org/wiki/Twyman%27s_law),
which Ronny Kohavi made famous in online experimentation: *"any figure that looks
interesting or different is usually wrong."* Not *always* wrong — but check it
first.)

## Five things that move the numbers that are not the launch

| What else changed | How it fools you | How to check |
| --- | --- | --- |
| **The calendar** | October leads into the holiday season. Sales climb anyway. Nine days also hold one or two weekends depending on the start day. | Compare full weeks. Compare to the same weeks last year, with weekdays lined up. |
| **Marketing** | If ads were paused before launch and restarted after, the "after" includes the ads coming back. | Ask the marketing lead what spend did in both windows. Put it next to the number. |
| **Measurement** | A new platform can count orders differently: test orders, cancelled orders, tax and shipping in "revenue" or not. | Check how "order" and "revenue" were defined on both sides before you compare them. |
| **Novelty** | Returning customers explore a new site, and launch emails bring a spike. Both fade. | Look at the trend inside the window. Is week 2 as strong as week 1? |
| **Regression to the mean** | If the baseline was a weak stretch, the next stretch looks better even if nothing changed. | Use a longer baseline — several weeks or the same period last year — not just "the week before". |

That third row deserves a second look whenever a launch is also a **re-platform**
(moving a store from one system to another). The before number comes from the old
system's reports and the after number from Shopify's. If the two disagree on what
counts as an order, part of the "+10%" could be a definition. This is the kind of
thing Twyman's law is about: a surprising number is more often a measurement
change than a real change of the same size.

## Pick a baseline on purpose

"From baseline" only means something once you say which baseline. Here are the
usual choices, from quickest to most trustworthy:

| Baseline | Good for | Weakness |
| --- | --- | --- |
| **The period just before** (e.g. last 9 days) | A fast first look | Season and marketing changes are mixed in |
| **Same dates last year** | Removes most of the season | Last year's weekdays fall on different dates; the business may have grown since |
| **Same weekdays last year** | Removes season *and* weekday pattern | Still ignores growth and this year's marketing |
| **A control group** — a similar store that did *not* change | Removes season, marketing trends and most noise | You need a store or market that really stayed the same |
| **A model of "what would have happened"** (Google's CausalImpact) | When there is no clean control group | Needs a good amount of history and some care |

Shopify's query language supports the third row directly: ShopifyQL's
[`COMPARE TO previous_year_match_day_of_week`](https://shopify.dev/docs/api/shopifyql/latest/syntax/compare-to)
shifts the comparison back 52 weeks so Mondays line up with Mondays — which the
docs note matters for retail, where weekday patterns are strong.

## The control group trick (difference in differences)

The fourth row is the most useful idea on this page, and it has a name:
**difference in differences**. You measure the change in the store that launched,
then subtract the change in a similar store that did not, over the same days.

Made-up numbers to show the shape:

| | Before | After | Change |
| --- | --- | --- | --- |
| Store that launched | 100 orders/day | 110 orders/day | **+10%** |
| Similar store, no change | 100 orders/day | 105 orders/day | +5% |
| **Launch effect (roughly)** | | | **≈ +5 points** |

The +5% is the season, the market, the holidays — everything that hit both
stores. What is left is a much fairer estimate of what the launch did.

It only works if the two stores really are alike and really were treated alike
(same ad changes, same promotions). When no such store exists, Google's
[CausalImpact](https://google.github.io/CausalImpact/CausalImpact.html)
([Brodersen et al., 2015](https://arxiv.org/abs/1506.00356)) builds the
"what would have happened" line from other time series instead — for example,
search traffic for the brand, or the sales of a product line the launch did not
touch.

## How long to wait before you say anything firm

- **Wait for full weeks.** At least two complete weeks, so both sides contain the
  same mix of weekdays and weekends.
- **Watch the trend inside the window.** A launch effect that is real stays. A
  novelty effect shrinks week by week.
- **Re-check after the next big calendar event.** A launch in October is not
  really tested until it has been through the holiday peak.

The same ideas show up in controlled tests; see "How long must a test run?" in
[A/B Testing & CRO](ab-testing).

## The fair counter-argument: "Why not just celebrate?"

Because celebrating and measuring are not in conflict — they are two different
sentences. The client is happy, the store is selling more, and the team turned a
complex feature around in a day. All true. The risk is only in the *next*
sentence: "the new site increased orders by 10%". That is a claim about cause,
and if it turns out to be mostly the season, it costs trust later.

**Middle ground:** report the number with its context in one line, and promise a
fairer read later. For example:

> "Orders are up 10% in the first nine days versus the period before launch. Part
> of that is seasonal and part is ads coming back online; we'll share a
> same-weeks-last-year comparison once we have two full weeks."

That sentence celebrates, it is honest, and it sets up the better number.

## A launch report in five lines

Use this template for any launch, big or small:

1. **What changed and when** — the date, and everything that changed with it
   (site, tracking, ads, prices, emails).
2. **The baseline you chose and why** — "same weekdays last year" or "previous two
   weeks", not just "baseline".
3. **The numbers** — orders, revenue, AOV, conversion rate, per full week.
4. **What else could explain them** — go through the five rows of the table above.
5. **When you will re-check** — a date in the calendar, not "later".

## Field notes

- **The baseline has a known dent in it.** Before launch, the client was in a
  stretch of not spending on paid channels that are normally profitable, because
  those channels had to be rebuilt on the new platform (see
  [Sizing Is for Cutting Scope](sizing-is-for-cutting-scope)). If the baseline
  covers that lull, part of the increase is the ads coming back. Ask which days the
  baseline covers before quoting it.
- **It was a re-platform**, so check that "order" and "revenue" mean the same
  thing in the old system's report and in Shopify's before comparing them.
- **We may get a natural control group for free.** The client wants the
  customizer homepage on a sister store too. If it rolls out to one store first,
  the other store is the control for a few weeks — a difference-in-differences
  read at no extra cost. Roll out one store at a time on purpose, and write down
  the dates.

## Try it yourself

1. **Do the AOV check.** Take any "orders up X%, revenue up Y%" sentence you have
   seen this month. Compute (1 + Y) ÷ (1 + X). Above 1 means bigger orders; below 1
   means smaller. Two minutes.
2. **Line up the weekdays.** In Shopify analytics (or a ShopifyQL query), compare
   the last 14 days with the same 14 days last year, then with the same *weekdays*
   last year. How different are the two answers?
3. **List what else changed.** For the last launch you worked on, write down every
   change that went live the same week — not only code. Which of them could move
   orders on their own?
4. **Rewrite one sentence.** Take a launch claim from a Slack thread or a report
   and rewrite it in the "celebrate, then context, then when we'll re-check"
   shape from the middle-ground example above.
