---
title: Technical SEO Hygiene & Crawl Budget
description: The SEO half we actually control — status codes, redirects, robots.txt and canonicals — and how to spot-check a site the way Google crawls it.
emoji: 🧹
order: 20
status: learned
session: 11
date: 2026-08-07
tags: [seo, crawling, redirects, hygiene]
resources:
  - title: Large site owner's guide to managing crawl budget — Google Search Central
    url: https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget
    note: Google's own definition of crawl budget, and the honest note on which sites need to care.
  - title: Redirects and Google Search — Google Search Central
    url: https://developers.google.com/search/docs/crawling-indexing/301-redirects
    note: The official difference between permanent and temporary redirects, in Google's words.
  - title: Introduction to robots.txt — Google Search Central
    url: https://developers.google.com/search/docs/crawling-indexing/robots/intro
    note: What robots.txt does and — more importantly — what it does not do.
  - title: Site moves with URL changes — Google Search Central
    url: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
    note: Where the "keep redirects at least 1 year" and "10 hops" numbers come from.
  - title: Verifying Googlebot and other Google crawlers
    url: https://developers.google.com/search/docs/crawling-indexing/verifying-googlebot
    note: Why a user-agent string is a claim, not proof — and how to check properly.
  - title: Screaming Frog SEO Spider
    url: https://www.screamingfrog.co.uk/seo-spider/
    note: The crawler from the session. Free up to 500 URLs, which is enough to learn on.
  - title: lychee — fast link checker (Rust)
    url: https://github.com/lycheeverse/lychee
    note: Open-source, one command, runs in CI. The cheapest way to automate the broken-link half.
  - title: Customize robots.txt on Shopify — robots.txt.liquid
    url: https://shopify.dev/docs/storefronts/themes/architecture/templates/robots-txt-liquid
    note: How to move a Shopify store's robots rules into the theme, where they are reviewable.
---

## The one rule to remember

> **You cannot make Google rank you. You can remove every reason not to.**

SEO is a strange field to work in as a developer: there is no lever marked
"rank higher", the vendors selling you one are usually selling snake oil, and
Google will not tell you the formula. What Google *does* say publicly is
consistent and boring — it wants to show the sites that genuinely serve the
person searching.

That splits SEO neatly in two:

| Half | Who owns it | What it is |
| --- | --- | --- |
| **Content** | Marketing, merchandising, writers | Pages people actually want, that answer the query |
| **Hygiene** | **Us** | No dead links, no wrong redirects, nothing accidentally hidden from Google, fast responses |

We do not own the first half. We own the second half completely, and it is
almost entirely mechanical: a page either returns the right status code or it
does not. This lesson is about that half — the part where "did anything slip in
this deploy?" has a real answer.

The catch is that hygiene decays silently. Nobody files a bug for "the homepage
links to a page that moved two years ago". So you go looking on a schedule.

## The four signals we control

Everything in this lesson is one of these four:

| Signal | The question it answers | How it breaks |
| --- | --- | --- |
| **Status codes** | Does this URL work? | 404s from renamed pages, 500s, redirect chains |
| **robots.txt** | May a crawler fetch this? | One over-broad rule hides a whole content type |
| **Canonical tags** | Which URL is the *real* one? | Query-string variants each look like a separate page |
| **Speed** | Is fetching this cheap? | See [Web Performance](web-performance) — it is a ranking signal too |

Notice what is *not* on the list: keywords, meta keyword tags, word counts,
"domain authority". Google's John Mueller has said plainly that Google
"doesn't use Domain Authority at all when it comes to Search crawling,
indexing, or ranking" — that number is a third-party tool's invention, not a
Google score. Chasing it is how teams end up paying for the snake oil.

## Redirects: 301 vs 302, and the bug that is neither

A redirect says "what you asked for is over there". There are two flavours and
the difference is not about speed — it is about **which URL Google keeps in its
index**. Straight from Google's docs:

| Code | Name | What Googlebot does | Use it when |
| --- | --- | --- | --- |
| **301** | Moved Permanently | Follows it, and "uses the redirect as a signal that the redirect target should be canonical" | The page really moved. The new URL should replace the old one in search results. |
| **302** | Found (temporary) | Follows it, but "doesn't use the redirect as a signal that the redirect target should be canonical" | The page is away for a bit — maintenance, a seasonal takeover, a country splash. The old URL should stay in the index. |

So a 302 left in place by accident is not mainly a latency problem — it is
Google being told, every single crawl, *"keep indexing the old URL, this move
isn't real."* The ranking signals never transfer. That is the actual damage.

Two more codes exist for a specific reason: **307** and **308** are the same
temporary/permanent pair, but they promise not to change the request method.
A 301 or 302 may legally turn a `POST` into a `GET` — fine for a marketing link,
a data-loss bug on a form endpoint. Rule of thumb: pages get 301/302, API and
form endpoints get 308/307.

### The real bug is the link, not the redirect

This was the sharpest point of the session, and it is worth reading twice. Sara
asked: if 301 redirects are bad to find, do they eventually fall off?

**No — and they should not.** A 301 is meant to live basically forever. The
example Tom gave: a Mother's Day 2024 promo page gets shared on Pinterest, and
people keep clicking that link for years. You do not want them landing on "this
sale ended". You 301 it to *Gifts for Mom*, and that redirect keeps earning
traffic. Google's own site-move guidance says to keep redirects "for as long as
possible, generally at least 1 year" — and if you own the domain, longer is
strictly better.

What the crawler was actually flagging is different. The crawl starts at the
homepage, follows every link, then follows every link on those pages, fanning
out. When it reports a 301, it is reporting: **a page on our site links to a URL
that we ourselves have already said moved.**

```
homepage  ──links to──▶  /mothers-day-2024  ──301──▶  /gifts-for-mom
   ▲                            ▲
   └── the bug is here          └── this is correct and should stay
```

The redirect is doing its job. The *internal link* is stale. Fix the `href`, and
the 301 goes back to serving only the outside world. Every internal link that
points at a redirect costs a real user an extra round trip, and costs the
crawler a fetch it did not need to spend.

Finding a **302** on an internal link is worse again: we are linking to a URL we
have publicly declared is not the permanent home of that content.

### Chains

`A → B → C` works, but each hop is another request. Google will follow up to
**10 hops**, and recommends "no more than 3 and fewer than 5". Collapse chains
to point straight at the final URL — especially the classic four-hop opener:

```
http://example.com  →  https://example.com  →  https://www.example.com  →  https://www.example.com/
```

One small mechanical detail worth knowing: a **301 is cacheable by default**,
so a returning browser can skip the hop entirely. Two consequences. Good: 301s
cost repeat visitors nothing. Bad: an accidental 301 is *painful* to undo,
because browsers that already cached it keep obeying it long after you fix the
server. When you are unsure whether a move is permanent, ship a 302, then
promote it to 301 once you are sure.

And prefer server-side redirects over `window.location`. A JavaScript redirect
only works for clients that run JavaScript, and it never carries the clean
"this moved" signal a status code does.

## Crawl budget — and when to actually worry about it

Google will not fetch an unlimited number of URLs from your site. Any site can
theoretically generate infinite pages, so Google's crawlers budget their
attention. In Google's words, crawl budget is **"the set of URLs that Google can
and wants to crawl"**, made of two parts:

- **Crawl capacity limit** — how hard Google is willing to hit your server
  without hurting it. Slow or erroring responses lower it.
- **Crawl demand** — how much Google *wants* your URLs, based on size, update
  frequency, and content quality.

Now the part that gets left out of most SEO advice, and that you should say out
loud the next time crawl budget comes up in a meeting: **Google says this
guidance is for very large sites.** Their thresholds are 1 million+ pages
changing weekly, or 10,000+ pages changing daily, or lots of URLs stuck at
"Discovered – currently not indexed". A 5,000-page store is not budget-limited.

So why did the session spend time on it? Because the *behaviour* crawl budget
punishes is worth avoiding at any size, for its own reasons:

> Generating a page per city — "custom jewelry in Austin", ×500,000 — is a bad
> idea whether or not you have a crawl budget problem. It is thin, near-duplicate
> content that no human asked for, and Google's quality systems handle that
> directly. The crawl-budget argument is the *second* reason not to do it.

Where budget genuinely bites us is the boring end: faceted URLs
(`?color=blue&size=m&sort=price`) multiplying a 200-product catalogue into
tens of thousands of near-identical pages, session IDs in URLs, endless
pagination, and slow responses shrinking the capacity limit. Google's list of
fixes is short — consolidate duplicates with canonicals, block genuinely
useless URL patterns in robots.txt, return real 404s (or 410s) for pages that
are gone, keep sitemaps honest with `lastmod`, avoid redirect chains, and get
faster.

## robots.txt: the file that hides your own site from you

`robots.txt` is one file at the domain root that says which URL patterns a
crawler may fetch. It is the highest-leverage, highest-risk file in technical
SEO: three characters can hide a content type across an entire store.

That is not hypothetical. A rule intended to stop crawlers wasting budget on
query-string URLs —

```
User-agent: *
Disallow: /*?
```

— also matches every image whose URL happens to carry a query string, which on
a modern CDN or image pipeline is *all of them* (`?width=800&v=3`). Google is
explicit about the consequence: media blocked in robots.txt will not appear in
search results. On a jewellery or homeware store, image search is real revenue.
That exact rule, added in good faith to protect crawl budget, is how a site we
built ended up with zero indexable product images.

Two things to internalise:

1. **robots.txt controls crawling, not indexing.** Google says it "is not a
   mechanism for keeping a web page out of Google" — a disallowed URL "can
   still be indexed if linked to from other sites", showing up as a bare link
   with no description. To keep a page *out of the index*, use a `noindex` meta
   tag or header, or a password. Blocking it in robots.txt actively prevents
   Google from seeing the `noindex` you added.
2. **Wildcards are broader than they look.** `Disallow: /*?` is not "block
   filter URLs". It is "block everything with a `?` anywhere in it".

Practical rule for our team: treat any robots.txt change like a schema
migration. Small diff, explicit reason, someone else reads it, and test it in
Search Console's robots.txt report before it ships.

## "How do crawlers get past bot protection?" — Mohamed's question

Mohamed asked how a crawler handles a site with a CAPTCHA or bot protection in
front of it. The honest answer from the room was "not sure" — here is the full
one, because the mechanics are genuinely useful and the conclusion is not the
obvious one.

**A user-agent string is a claim, not proof.** `Googlebot/2.1` in a header is
just text; anyone can send it. That is why Google publishes two ways to
*verify* a crawler really is theirs: a reverse DNS lookup that must resolve to
`googlebot.com`, `google.com` or `googleusercontent.com` and then forward-resolve
back to the same IP, or matching the request IP against Google's published JSON
IP ranges. Bot protection is built on that distinction: not "what do you call
yourself" but "can that be verified".

Cloudflare formalises it as a **Verified Bots** programme. A crawler qualifies
by being honest about who it is (signed requests, published IP ranges with a
stable user agent, or reverse DNS) *and* by behaving — respecting robots.txt,
keeping request rates sane, and not using evasion tactics. Verified bots pass;
unverifiable traffic claiming to be a search engine gets challenged.

Which points at the right move, and it is not a clever one:

> When an audit crawl gets blocked on a site **we** run, the fix is to allowlist
> our own crawler — a WAF rule matching a distinctive user agent we set
> ourselves, or our office IP — for the duration of the crawl. Not to disguise
> the crawler as a browser.

Two reasons. First, it works reliably; fingerprint games do not. Second, if a
tool needs to hide what it is to audit your own property, the tool is being
used on someone else's property. Getting past protections on a site you do not
control is not an SEO technique, it is someone else's incident.

One related thing Tom noticed live that matters more for our stack: the crawler
was reading **raw HTML, not rendered pages**. Anything a Shopify section paints
in with JavaScript is invisible to that crawl — links inside it never get
followed, so a clean report can hide a whole broken subtree. Both Screaming Frog
and Googlebot *can* render JavaScript, but it is a mode you switch on, and it is
much slower. Check which mode you are in before believing a green result.

## The spot-check that is worth doing

The value is not in the report. It is in triage: a crawl will hand you a hundred
findings, ninety-five of which do not matter. Some vendors send a monthly
"you have 4 broken images!" email — that is noise dressed as urgency.

Sort by blast radius, not by count:

| Severity | Looks like | Why it is that bad |
| --- | --- | --- |
| **Drop everything** | A robots rule or `noindex` hiding a whole template or content type | Nothing in that group can rank. Invisible in analytics until traffic falls off a cliff. |
| **This sprint** | Internal links to 404s; a 301 pointing at a 404; a 302 on a permanent move | Real users hit dead ends; ranking signals leak. |
| **Next sprint** | Internal links to 301s; chains longer than 3; missing or duplicate titles | Slow bleed — wasted round trips and muddled signals. |
| **Log it** | Broken links to third-party sites; one missing alt text | Worth fixing, never worth a meeting. |

The workflow, once or twice a month and after any big deploy:

1. **Crawl the site** (start at the homepage — the crawler discovers the rest).
2. **Sort by status code.** Anything not `200` or a deliberate `301` gets a look.
3. **Filter for internal links to 3xx.** This is the list that becomes tickets.
4. **Open robots.txt yourself** and read it as a stranger. What pattern might it
   be catching that you did not intend?
5. **Check indexability counts.** A sudden change in "non-indexable" is the
   alarm that matters.
6. **Cross-check in Search Console.** It is the only source that shows what
   Google actually did, rather than what a crawler predicts.

Two crawler quirks worth knowing before you conclude a site is broken: the free
Screaming Frog tier stops at 500 URLs (a big store hits that in the first
handful of collection pages, and a media-heavy site burns it on images), and a
crawl seeded at an apex domain that redirects to `www` can report the seed URL
as "non-indexable" and stop — that is a config detail, not a dead site.

### Tools

| Tool | Cost | Use it when |
| --- | --- | --- |
| **Screaming Frog** | Free to 500 URLs / paid licence | The visual audit. Sort, pivot, export CSV. Best first stop. |
| **Google Search Console** | Free | Ground truth on what Google indexed. Non-negotiable, and it is the only one Google guarantees. |
| **[lychee](https://github.com/lycheeverse/lychee)** | Free, open source | Broken-link checking in CI on every PR. One binary, one command. |
| **[linkchecker](https://github.com/linkchecker/linkchecker)** | Free, open source | Same job in Python, if you want to script around it. |
| **[katana](https://github.com/projectdiscovery/katana)** | Free, open source | Fast crawling with optional headless rendering, when you need the URL list itself. |
| **[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)** | Free, Google | Per-page SEO/performance checks wired into the pipeline, not site-wide crawling. |
| **`curl -sIL`** | Free | Checking one specific redirect chain, right now, in five seconds. |

The team's instinct in the session — look for something open source before buying
a per-seat licence — is the right one for the *automatable* half. A link
checker in CI catches regressions on the day they ship, which a monthly desktop
crawl cannot. Keep one visual crawler around for the once-a-month human look;
put `lychee` in the pipeline for everything else.

## Field notes from real audits

Four findings from one afternoon of crawling live stores, so the advice above has
something concrete behind it:

- **Every product image blocked, on a store we had just built.** A `robots.txt`
  rule disallowing query-string URLs — added deliberately to protect crawl
  budget — matched the image URLs too, so nothing could be indexed in image
  search. The first fix was not the rule: it was moving the robots rules **out of
  the site-builder's visual editor and into the theme** (on Shopify, that is
  `robots.txt.liquid`), so the file lives in git, shows up in a diff, and gets
  reviewed like code. Fix reviewability first; the rule itself is a one-liner
  after that.
- **A pile of internal 301s and 302s off one homepage.** Not broken pages —
  stale `href`s. This is the "fix the link, not the redirect" ticket class, and
  it makes a good first pull request for anyone new to a codebase.
- **A crawl that stopped at the first URL.** The seed was the apex domain, which
  redirects to `www`; the crawler reported the entered domain as non-indexable
  and went no further. Crawl the canonical hostname, or the report is empty for
  the wrong reason.
- **Some robots questions have a true answer, and some are preference.** Block
  it, or canonical it? Both can be defensible. Do not go heavy on robots edits
  alone — get a second opinion from whoever owns SEO before shipping one.

On tooling budget: one shared licence is plenty for occasional visual runs, with
open-source tools doing anything you want automated. The free tier is enough to
learn every concept in this lesson.

## Try it yourself

1. **Trace a redirect chain.** Pick any short link or old URL you have around and run
   `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' <url>`, then
   `curl -sI <url>` to read the raw `Location` headers hop by hop. How many hops? Was
   each one a 301 or a 302 — and does that match whether the move looks permanent?
2. **Read a real robots.txt as an adversary.** Open `/robots.txt` on any store
   you work on. For each `Disallow` line, write down one URL you think the team
   *did not* mean to block. Check one of them in Search Console's robots.txt
   report.
3. **Crawl a small site and triage it.** Run free Screaming Frog against a site
   under 500 pages. Export the CSV, filter to internal links pointing at 3xx,
   and sort your findings into the four severity rows above. Which single
   finding would you actually open a ticket for?
4. **Put a link checker in CI.** Add `lychee` to a repo you own
   (`lychee --no-progress './**/*.md'` is a fine start) and watch it fail on a
   link you break on purpose. That is the monthly crawl, automated.
