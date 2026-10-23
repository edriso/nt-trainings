---
title: Links That Carry State
description: A URL can open a page already set up — the right product, the right variant, a full cart. What to put in a link, what never to put in one, and how to read it safely.
emoji: 🔗
order: 38
status: learned
session: 21
date: 2026-10-23
tags: [shopify, urls, privacy, frontend]
resources:
  - title: Product variants and deep links — Shopify
    url: https://shopify.dev/docs/storefronts/themes/product-merchandising/variants
    note: The official docs for ?variant= and ?option_values= on product pages, and how the theme picks the selected variant.
  - title: Create cart permalinks — Shopify
    url: https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks
    note: One link that fills a cart with chosen variants and quantities. Read the limitations section.
  - title: URLSearchParams — MDN
    url: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    note: The built-in way to read and build query strings in JavaScript. No library needed.
  - title: Best practices to avoid sending PII — Google Analytics
    url: https://support.google.com/analytics/answer/6366371?hl=en
    note: '"Both the URL path and parameters must be free of PII." Also explains data redaction for query parameters.'
  - title: Referrer-Policy — MDN
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
    note: What part of your URL other sites see when someone clicks away. The modern default is safer than it used to be — but only for that one leak.
  - title: Cross Site Scripting Prevention Cheat Sheet — OWASP
    url: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
    note: Why a value read from the URL must be treated as untrusted text. The "safe sinks" section is the practical part.
  - title: Consolidate duplicate URLs — Google Search Central
    url: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
    note: Why many links to one page should point to one canonical URL, and how to tell Google which one.
  - title: Liquid access to query params (discussion #1872) — Shopify/liquid
    url: https://github.com/Shopify/liquid/discussions/1872
    note: The open request for a query string in theme Liquid. Explains why your own parameters are read in JavaScript today.
---

## The one rule to remember

> **Put choices in the link — which product, which variant, which campaign. Never
> put who the person is.**

A good link opens a page that is already set up: the right product, the right
colour, the customizer on the right step. That removes clicks, and every removed
click on the way to checkout matters. But a URL is not a private place. It gets
copied, logged, shared and sent to analytics tools. So anything that identifies
a person — a name, an email, a token that unlocks something — does not belong in
it.

This came up in session 21, when a new homepage customizer needed to send
shoppers to the product page, and someone asked whether we could go one step
further with a personal "by your name" link. The first idea is excellent. The second needs
care, and this lesson explains why.

## The parts of a URL, and who sees each one

```text
https://shop.example.com/products/name-necklace?variant=4242&utm_source=email#preview
\___/   \______________/ \____________________/ \_______________________________/ \_____/
scheme       host                path                        query                fragment
```

| Part | Sent to the server? | Who else can see it |
| --- | --- | --- |
| **Path** (`/products/name-necklace`) | Yes | Server logs, analytics, browser history |
| **Query** (`?variant=4242&utm_source=email`) | Yes | Same as the path — plus anyone the link is shared with |
| **Fragment** (`#preview`) | **No** — it stays in the browser | Browser history, and any script running on the page |

The query is the usual place for state. Each `key=value` pair is separated by
`&`. Keep the keys short and lowercase, and keep the values to IDs and choices.

## What Shopify already understands

Before inventing parameters, use the ones the platform supports. They work on
every theme and need no custom code.

| Link | What it does | Use it when… |
| --- | --- | --- |
| `/products/handle?variant=ID` | Opens the product page with that variant selected | You know the exact variant (size, colour, metal) |
| `/products/handle?option_values=ID1,ID2` | Selects by option value IDs, one per option, in option order | You build links from option choices instead of variant IDs |
| `/cart/ID:QTY,ID:QTY` | A **cart permalink**: fills the cart and goes to checkout | Email or ad links that should skip straight to buying |
| `?utm_source=…&utm_medium=…&utm_campaign=…` | Campaign tags read by analytics | Any link you share outside the site |

Two details from the
[official variant docs](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants)
that catch people:

- The theme reads the linked variant through `product.selected_or_first_available_variant`.
  If the URL names a variant, that variant wins — and developers have
  [reported](https://community.shopify.dev/t/the-selected-or-first-available-variant-can-return-an-unavailable-variant/36105)
  that this holds **even when it is sold out.** Test your links against sold-out
  variants.
- With `option_values`, *"one option value ID must be provided per product option
  and the order must match the option order."*

Cart permalinks have their own
[limitations](https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks)
— for example, they do not work with selling plans (subscriptions). Check that page
before you build a campaign around one.

## Your own parameters: read them in JavaScript

Theme Liquid renders on Shopify's servers and does not get the query string — the
`request` object has the path and host, but not your custom parameters. There is
an [open discussion](https://github.com/Shopify/liquid/discussions/1872) asking
for it. Until then, read your own parameters in the browser:

```js
const params = new URLSearchParams(window.location.search);
const step = params.get("step");          // "engraving" or null
const allowed = ["design", "engraving", "review"];

if (allowed.includes(step)) {
  customizer.goTo(step);                   // only known values do anything
}
```

Three habits that keep this safe:

1. **Allowlist, don't trust.** A URL is user input. Anyone can type anything into
   it. Accept only values you expect, and ignore the rest.
2. **Never put a URL value into HTML.** `element.innerHTML = params.get("name")`
   turns a link into a script injection (XSS, cross-site scripting). Use
   `element.textContent`, which treats the value as plain text — the
   [OWASP cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
   calls this a "safe sink".
3. **Limit the length.** An engraving field has a character limit in the product;
   apply the same limit to the value from the URL.

## The "by your name" link: a good idea with one trap

The idea from the session: we know a shopper's name from email, so the email
link could open the name necklace customizer **with their name already in it**.
It is a strong idea — the shopper sees the finished product before doing
anything.

The trap is where that name travels once it is in the URL:

- **Analytics.** Google Analytics records the full page URL. Google's own
  [policy](https://support.google.com/analytics/answer/6366371?hl=en) says *"both
  the URL path and parameters must be free of PII"* (Personally Identifiable
  Information), and lists names and email addresses as examples.
- **Ad pixels and other scripts** on the page can read the URL too.
- **Server and app logs** keep it.
- **Sharing.** A shopper forwards the link, or posts it, and their name goes
  with it.
- **Search engines**, if a personal link ever gets crawled.

The cross-site `Referer` header is the one leak that has improved: modern
browsers default to
[`strict-origin-when-cross-origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy),
so other sites only see your domain, not the query. Everything else on the list
still applies.

**So how do we build it?** In order of preference:

| Approach | How it works | Trade-off |
| --- | --- | --- |
| **Prefill a design word, not the person** | The link carries the *text to engrave* chosen in the campaign (`?text=Mom`), not the shopper's identity | Less personal, but no PII at all |
| **First name only, redacted from analytics** | `?name=Sam`, read once, then removed from the address bar with [`history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState); `name` added to GA4's data redaction list | Works, but you must check every script that loads *before* the removal |
| **An opaque token** | `?p=7f3a…` that the page swaps for the name through a call you control | The most private; needs a small backend or app |

**Never** put an email address, a phone number, or anything that logs a person in
or unlocks a discount into a URL. That last group is a known weakness class —
sensitive data in query strings — because URLs end up in history, logs and
monitoring tools, and HTTPS does not hide them from any of those.

## Don't let links multiply your pages

Every different query string is, to a search engine, a different URL. A thousand
campaign links to one product page can look like a thousand pages. Shopify
themes output a canonical tag (`<link rel="canonical">`) on product pages; check
that it points to the clean product URL, so all those links count as one page.
Google explains why in
[Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## URL, storage, or cart?

State can live in more than one place. Pick by asking "should this survive being
shared?"

| Put it in… | When the state should… | Example |
| --- | --- | --- |
| **The URL** | be shareable and bookmarkable | Product, variant, customizer step, filters |
| **`localStorage`** | stay on this device only | An unfinished design, a dismissed banner |
| **Cart attributes / line item properties** | travel with the order to checkout and fulfilment | The engraving text, the chosen font |

## Field notes

**The fast lane already speaks this language.** A homepage customizer we built
sends the shopper to the product detail page (PDP) when they click "Start
customizing". The PDP side already reads three parameters:

| Parameter | What it does |
| --- | --- |
| `?variant=<id>` | Picks the variant. It is one candidate among several, and the code rejects a missing ID or one from another product — the allowlist habit from above. |
| `?customizer=open` | Opens the customizer dialog on page load, so the shopper lands *inside* the wizard. This is the fast lane. |
| An "edit this cart line" parameter | Re-opens an existing cart line for editing. Auto-open is deliberately skipped when it is present, because the edit restore runs first. |

So a homepage link like `/products/<handle>?variant=<id>&customizer=open` does
the whole job with no new code on the PDP. Mapping the configurator to product and
variant IDs looked like it might be slow; it was turned around in a day.

**The design itself rides on the cart line, not the URL.** The customizer writes
the shopper's choices as `properties[...]` on the `/cart/add` submit, including a
hidden machine-readable record and the uploaded photo as a real file part. That
is the "cart attributes / line item properties" row of the table above, and it is
the right place: it reaches the order and fulfilment. The URL only says where to
start.

**The name link is still an idea, not a ticket.** If it becomes one, the ticket
should say which row of the "by your name" table we picked, and the PR should
show the GA4 redaction setting and a check that no pixel fires before the name
leaves the address bar. [Proving It Works](proving-it-works) covers what that
evidence looks like.

## Try it yourself

1. **Deep-link a variant.** Open any product on a dev store, find a variant ID
   (in the admin URL of the variant), and open `/products/<handle>?variant=<id>`.
   Then try a sold-out variant. What does the page select?
2. **Build a cart permalink.** Make a `/cart/<id>:1,<id>:2` link for two variants
   on a dev store and open it in a private window. Where do you land?
3. **Audit one URL.** Click a marketing email link from any store you use, then
   copy the address bar. List every parameter. Is anything in there that
   identifies you?
4. **Break your own reader.** Add `?step=<b>hi</b>` to a page that reads a
   parameter. Does it show as text or as bold? If bold, you found an
   `innerHTML` that should be `textContent`.
