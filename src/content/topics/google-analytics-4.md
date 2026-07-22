---
title: Google Analytics 4
description: Where website data comes from, which report answers which question, and why the numbers never match the backend.
emoji: 📊
order: 3
status: learned
session: 2
date: 2026-07-21
tags: [analytics, ga4, ecommerce]
videos:
  - title: Google Analytics 4 Tutorial for Beginners (Analytics Mania)
    youtubeId: -Y-RQtYLpHM
resources:
  - title: How Google Analytics works — Analytics Help
    url: https://support.google.com/analytics/answer/12159447
    note: Google's own plain-language overview. The best official starting point.
  - title: GA4 Demo account — Analytics Help
    url: https://support.google.com/analytics/answer/6367342
    note: Free access to a real store's GA4 data. Perfect for practicing without any setup.
  - title: Recommended events — GA4 developer reference
    url: https://developers.google.com/analytics/devguides/collection/ga4/reference/events
    note: The official list of event names and parameters. Always use these names, never invent your own.
  - title: Default channel group — Analytics Help
    url: https://support.google.com/analytics/answer/9756891
    note: How Google decides that a session counts as "Organic Search", "Paid Social", and so on.
  - title: Campaign URL Builder
    url: https://ga-dev-tools.google/campaign-url-builder/
    note: Google's tool for building links with UTM parameters — and learning what each one means.
  - title: BigQuery Export — Analytics Help
    url: https://support.google.com/analytics/answer/9358801
    note: How to get the raw event rows behind GA4, for when the built-in reports are not enough.
  - title: Google Tag Manager overview
    url: https://support.google.com/tagmanager/answer/6102821
    note: One container that deploys many marketing tags without code changes on every page.
  - title: Umami
    url: https://umami.is/
    note: An open-source, cookieless alternative — useful to understand what analytics looks like without cookies.
---

## The one rule to remember

> **GA4 compares traffic sources. The backend counts money.**

GA4 (Google Analytics 4) is great at one question: *how did my traffic sources
perform against each other?* Facebook versus Google, email versus organic search —
GA4 is a fair referee, because each ad platform grades its own homework.

It is **not** the place to ask *"how much did we sell yesterday?"* The store's own
backend (for example the Shopify admin) answers that. GA4 and backend numbers
never match, and we will see why below — it is normal, not a bug.

Why should we care as devs?

- **We install the tracking.** When it is wrong, every report built on it is wrong.
- **We get asked "why don't these numbers match?"** all the time. Now you can answer.
- **Data drives decisions.** Our [A/B testing](ab-testing) results are read out of these reports.

## Everything is an event

Older Google Analytics ("Universal Analytics") was built around *sessions*
(visits). GA4 was rebuilt around **events**.

| | Universal Analytics (old) | GA4 (current) |
| --- | --- | --- |
| **Core unit** | Session (a visit) | Event (a thing that happened) |
| **A page view is…** | A hit inside a session | Just another event (`page_view`) |
| **Sessions are…** | The primary thing | Computed *from* events afterwards |

An event is one row of data: a name (`page_view`, `purchase`), parameters
(which page, which product), a timestamp, and a user key. A **session** is what
GA4 builds by grouping one user's events together — it ends after the visitor
goes quiet for 30 minutes (the default). Everything you see in GA4 reports is a
roll-up of this event stream, and the raw rows can be exported to BigQuery
(Google's SQL warehouse) if you ever need to query them directly.

## How the data gets in

In the GA4 admin you create a **data stream** for your site, and it gets a
**measurement ID** that looks like `G-XXXXXXXXXX`. Then the site loads the
tracking snippet:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

This little snippet uses a classic third-party pattern that is worth understanding
as a developer — the **asynchronous queue**:

1. `dataLayer` is just a plain array, created immediately.
2. `gtag(...)` just pushes its arguments into that array.
3. So the page can "call" analytics right away, even though the real script has
   not loaded yet — calls simply queue up.
4. When the external script finally loads, it replays everything in the queue,
   then listens for new pushes and processes them live.

That is why the script can load `async` (good for [performance](web-performance))
without losing any early events.

On hosted platforms this is usually one click — Shopify's Google channel app asks
you to pick a measurement ID and installs everything. Many teams also use
**GTM (Google Tag Manager)**: you install one GTM container, and marketers can
then deploy GA4, ad pixels, and other tags from a web UI without a developer
editing the site for every new tag.

## The events that matter for a store

GA4 only knows what you send it. Google publishes a list of **recommended
events**, and the e-commerce reports only light up if you use their exact names:

| Event | When it fires |
| --- | --- |
| `page_view` | Every page load — the baseline event. |
| `view_item` | A product page is viewed. |
| `view_item_list` | A collection/category page (or product carousel) is viewed. |
| `add_to_cart` | An item goes into the cart. |
| `begin_checkout` | Checkout starts. |
| `purchase` | An order is placed — carries the revenue. |

Every e-commerce event carries an `items` array. Only `item_id` and `item_name`
are required; the rest (category, price, brand…) unlock deeper reports:

```js
gtag('event', 'view_item', {
  currency: 'USD',
  value: 449,
  items: [{ item_id: 'SKU_123', item_name: 'Espresso Machine 3000' }]
})
```

Why this matters: with `view_item` and `purchase` both tagging the item, GA4 can
compute a **per-product conversion rate** — how many people who *saw* this
product *bought* it. That is how "which products convert best?" gets answered.

On most platforms an app or tag manager fires these events for you. But when a
report looks broken, this event stream is where you debug: is the event firing,
and does it carry the right parameters?

## Which report answers which question

GA4 has a lot of screens. In practice a few of them answer almost every question:

| The question | Where to look |
| --- | --- |
| Is the site up? Did tracking break after the deploy? | **Realtime** (last 30 minutes) |
| Where do visits come from? | **Acquisition → Traffic acquisition** |
| Which channel brings *new* people? | **Acquisition → User acquisition** (first visit) |
| Which pages get the most views? | **Engagement → Pages and screens** |
| What sells, and what converts? | **Monetization → E-commerce purchases** |
| Mobile or desktop? Which earns more? | **User → Tech → Tech details** |

Two ideas make all these reports readable:

- **Source / medium.** Every session is labeled with where it came from
  (`google / cpc`, `facebook / paid-social`). These labels come from **UTM
  parameters** — `utm_source`, `utm_medium`, `utm_campaign` — that marketers add
  to links, plus the referrer for untagged visits. "Direct" means GA4 has no
  idea: typed URL, most apps, or a lost referrer.
- **Channel groups.** Source/medium pairs roll up into friendly buckets like
  "Organic Search" and "Paid Social" — the right zoom level for an owner or CMO
  (Chief Marketing Officer).

In any report you can switch the **primary dimension** (the drop-down on the
first column) and add a **secondary dimension** (the `+` button) to pivot the
same data a different way — for example Tech details by device category, with
source/medium as the second column.

## Why GA4 never matches the backend

The most common client question: *"GA4 says X, Shopify says Y — which is broken?"*
Neither. They can never match, because:

- **Consent banners.** Visitors who decline cookies are invisible to GA4 — often
  a third of traffic in some regions. Google partially *models* (estimates) what
  it cannot see.
- **Ad blockers** block the script entirely for some visitors.
- **Different definitions.** Refunds, test orders, time zones, and "what counts
  as a session" are all counted differently.
- **Broken hand-offs.** Cross-domain checkouts or redirects can lose the trail
  (a giveaway: a landing page report full of checkout URLs with tracking IDs).

So use each tool for what it is good at: **money questions go to the backend,
channel-comparison questions go to GA4.** On the same theme, cookieless tools
like Umami skip cookies entirely (they fingerprint a hash of technical details
that resets daily), so they see closer-to-true traffic totals without a consent
banner — a nice cross-check, and a glimpse of where analytics is heading.

## Orient on a new site in ten minutes

Given access to a new client's GA4, three looks tell you most of the story:

1. **Monetization → Overview.** Roughly how much per month? This right-sizes
   every later conversation — a $50k/month store and a $5M/month store deserve
   different efforts.
2. **Engagement → Pages and screens.** Where does traffic actually land — home
   page, product pages, or collection pages? That is where improvements pay off.
3. **User → Tech → Tech details**, pivoted by device category. Compare traffic
   share against revenue share. A classic finding: ~60% of *visits* are mobile,
   but desktop earns more per visitor — which suggests ideas like capturing
   mobile visitors (newsletter, wishlist) so they can finish on desktop later.

If you bookmark one report, make it Tech details — active users, conversion rate,
and revenue in one table, ready to pivot by any dimension.

## Try it yourself

1. Add the free [GA4 demo account](https://support.google.com/analytics/answer/6367342) (a real merchandise store) to your Google account. In **Acquisition → Traffic acquisition**, find the top channel of the last 28 days.
2. Still in the demo account, open **User → Tech → Tech details** and switch the primary dimension to device category. Which device brings more users — and which converts better?
3. On any site with Google tracking, open the browser console and type `window.dataLayer`. Read what the page pushed before the script loaded. Can you find the measurement ID (`G-…`) in the page source?
4. Build a link with the [Campaign URL Builder](https://ga-dev-tools.google/campaign-url-builder/) and make sure you can explain `utm_source`, `utm_medium`, and `utm_campaign` in one sentence each.
