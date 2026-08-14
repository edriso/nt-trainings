---
title: Subdomains, Subfolders & Headless CMS
description: Whether moving a blog to /blog is worth the money, how a reverse proxy gets you there without a migration, and what changes when content arrives through an API.
emoji: 🌐
order: 20
status: learned
session: 13
date: 2026-08-11
tags: [seo, cms, architecture, domains]
resources:
  - title: Managing multi-regional sites — Google Search Central
    url: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
    note: The closest thing Google publishes to a subdomain-vs-subdirectory comparison. Read the cons column — none of them is about ranking.
  - title: Site moves with URL changes — Google Search Central
    url: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
    note: Everything a URL move actually costs. Read it before agreeing to one.
  - title: Site reputation abuse — Google spam policies
    url: https://developers.google.com/search/docs/essentials/spam-policies
    note: Why "put it in a subfolder so it inherits the domain's authority" stopped being a tactic and became a policy violation.
  - title: Updating our site reputation abuse policy — Google Search Central Blog
    url: https://developers.google.com/search/blog/2024/11/site-reputation-abuse
    note: November 2024. The update that removed the "but we have editorial oversight" defence.
  - title: "[GA4] Set up cross-domain measurement — Analytics Help"
    url: https://support.google.com/analytics/answer/10071811
    note: The strongest non-ranking argument for one domain. Subdomains are free; a second domain is configuration someone has to remember.
  - title: Add a website or platform property — Search Console Help
    url: https://support.google.com/webmasters/answer/34592
    note: A Domain property already covers every subdomain. Worth knowing before anyone uses "one property" as an argument.
  - title: Specifying an override host — Fastly
    url: https://www.fastly.com/documentation/guides/full-site-delivery/domains-and-origins/specifying-an-override-host/
    note: The single setting that makes a reverse proxy work — and the one that quietly breaks it.
  - title: "Developer guide: Backends — Fastly"
    url: https://www.fastly.com/documentation/guides/integrations/non-fastly-services/developer-guide-backends/
    note: One hostname, several origins, routed by path. That is the whole subfolder trick in one page.
  - title: Host your blog under /blog on your www domain — thoughtbot
    url: https://thoughtbot.com/blog/host-your-blog-under-blog-on-your-www-domain
    note: A worked example with the CDN config. Written years ago; the mechanics have not moved.
  - title: Working with webhooks — Webflow Data API
    url: https://developers.webflow.com/data/docs/working-with-webhooks
    note: What a CMS can push at you on publish, plus signature verification and the retry behaviour you have to plan around.
  - title: Rate limits — Webflow Data API
    url: https://developers.webflow.com/data/reference/rate-limits
    note: 60 requests a minute on lower plans, 120 on higher ones. Check the number before you design a polling loop.
  - title: HTTP caching — MDN
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching
    note: Freshness, revalidation, stale-while-revalidate. The vocabulary for "how old is this blog post allowed to be?"
---

## The one rule to remember

> **Google mostly does not care where your content lives. Your analytics, your
> CMS and whoever maintains it care a great deal.**

Sara asked a good question at the end of this session: if we are bringing a blog
in-house, is it just redirects plus the CMS API? The answer took fifteen minutes
and covered domains, a CDN, and two completely different ways a CMS can hand you
content.

The useful part is that the reason people reach for first — *it will rank better
on one domain* — is the weakest reason on the list, and the reasons that actually
hold up are ones nobody mentioned.

This comes up on nearly every client an agency has. The store is on one domain,
the blog is somewhere else, and someone asks whether that is costing money.

## Four places a blog can live

| Where | Looks like | Who renders the HTML |
| --- | --- | --- |
| **A separate domain** | `example-blog.com` | The CMS vendor |
| **A subdomain** | `blog.example.com` | The CMS vendor, on a hostname you own |
| **A subfolder, proxied** | `example.com/blog` | Still the CMS vendor — a CDN in front makes the URL look local |
| **A subfolder, in your app** | `example.com/blog` | Your app, with content pulled from the CMS API |

Look at the last two rows. **The URLs are identical.** Google cannot tell them
apart, a reader cannot tell them apart, and a link to either one is the same
link.

That is the reframe to carry out of this lesson: *"should the blog be at
`/blog`?"* and *"should we own the blog's code?"* are two separate questions with
two separate price tags. They get discussed as one question, which is how a cheap
URL change turns into a rebuild.

## What Google actually says

Google does not publish a "subdomains rank worse" statement, because it is not
their position. The closest thing to an official comparison is in the
multi-regional docs, where Google lists the trade-offs of each URL structure:

| Structure | Google's pros | Google's cons |
| --- | --- | --- |
| **Subdomain** (`de.example.com`) | Easy to set up, allows different server locations, easy separation of sites | Users might not recognise the targeting from the URL alone |
| **Subdirectory** (`example.com/de/`) | Easy to set up, low maintenance (same host) | Same recognition issue, single server location, separation of sites is harder |

Read the cons column twice. Every entry is operational — servers, maintenance,
how obvious the URL is to a human. **Neither entry mentions ranking**, in a
document whose entire purpose is telling you how to structure URLs for Search.

Google's search advocates have said the same thing in public for years, with one
consistent piece of *organisational* advice attached: keep related content
together where it genuinely belongs together, and use a subdomain where the thing
really is separate. That is guidance about how to organise a site, not a lever.

And the market has not converged either:

| Company | Their blog lives at | Shape |
| --- | --- | --- |
| Google | `blog.google` | Its own domain |
| GitHub | `github.blog` | Its own domain |
| Cloudflare | `blog.cloudflare.com` | Subdomain |
| Shopify | `shopify.com/blog` | Subfolder |
| Stripe | `stripe.com/blog` | Subfolder |

These are companies with world-class SEO teams and a lot to gain from any real
edge. They split evenly. That is the honest state of the evidence, and it is
worth having on hand the next time someone presents the subfolder as settled.

### The part that *has* changed since 2024

There is one modern wrinkle, and it cuts against the folk theory rather than for
it. The reasoning behind "move it to a subfolder" has always been *the subfolder
inherits the domain's authority*. In November 2024 Google made that exact
mechanism, when it is used to host someone else's content, a spam policy:

> "Site reputation abuse is a tactic where third-party content is published on a
> host site mainly because of that host's already-established ranking signals."
> — [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

Google's circumvention note goes further: creating new subdomains *or
subdirectories* to keep violating the policy can restrict search eligibility
altogether.

Your own blog on your own domain is not site reputation abuse — nobody should
read this as a warning about the move. Read it as evidence about the theory. If
"authority flows down the path" were the free win it is sold as, Google would not
have needed a policy to stop people harvesting it.

## The arguments that are actually strong

Here is the same decision with the weak reasons stripped out and the real ones
ranked:

| Argument for one domain | How strong | Why |
| --- | --- | --- |
| **Analytics stays whole** | **Strong** | A second registrable domain splits one visitor into two users and two sessions unless someone configures cross-domain measurement |
| **Internal links and one crawl path** | Medium | Blog-to-product links become links within one site; one sitemap, one crawl, no separate discovery problem |
| **One cookie, tag and consent scope** | Medium | Same-site means shared first-party cookies, one tag setup, one banner to get right |
| **Brand and trust** | Medium | People do read URLs. `example.com/blog` is obviously the same company; a separate domain is a small act of faith |
| **One place to report on** | **Weak** | A Search Console **Domain** property already covers every subdomain automatically |
| **It will rank better** | **Weakest** | Unproven, contested, and the reason most often used to sell the project |

The analytics one deserves its own paragraph, because it is the argument that
actually wins and it is measurement, not SEO.

Google's tag sets its cookies at the highest domain level it can — on
`blog.example.co.uk` the cookie lands on `.example.co.uk` — so **movement between
subdomains is measured as one visit with no extra configuration.** A genuinely
different domain gets a different cookie: the same human becomes two users with
two sessions, and the first site shows up as the *referrer* of the second. Your
own blog appears in the reports as an external traffic source.
([GA4 cross-domain measurement](https://support.google.com/analytics/answer/10071811))

That is not a rounding error, it is the specific thing that makes "does the blog
drive revenue?" unanswerable — and that question is the whole reason anyone funds
a blog. See [Marketing & Business Impact](marketing-business-impact) for what
happens to a business case when attribution is broken, and
[Google Analytics 4](google-analytics-4) for where sessions and referrals come
from.

## The disagreement, written out

This was the sharpest moment in the session, and both sides are right about
different things. Tom, on the marketing pressure to consolidate:

> "A lot of people in marketing will be like, we should spend a lot of money to
> move this to `example.com/blog`. I don't 100% agree with that investment. I
> think it'd be better made elsewhere."

**The marketing case.** One domain is one story. Content, products and brand all
accrue in the same place, links from the blog point at products inside the same
site, and the analytics above actually work. Their instinct that scattered
content is worth less is not wrong.

**The engineering case.** Every URL that changes is a redirect you now maintain
forever, a chance to lose a page, and a period of instability Google itself warns
you to expect. The upside is speculative and slow; the downside is concrete and
immediate. That asymmetry — not the SEO theory — is the real reason to be
cautious.

**The middle ground, and it is a genuinely useful one:**

> **Price the move, not the idea.** If subfolder URLs cost a CDN rule, do it —
> the reasons above are enough to justify an afternoon. If they cost a
> re-platform, that needs a business case that does not rest on ranking.

Which is exactly why the four-row table at the top matters. Most teams argue
about the *idea* and then get quoted for the most expensive version of it.

## The reverse proxy: subfolder URLs without a migration

This is the cheap version, and it is more common in the wild than people expect.

```
reader → example.com/blog/a-post
             │
             ▼
        CDN edge  ──  /blog/*  → CMS origin   (Host header rewritten)
                  └─  /*       → the main app
```

One hostname faces the world. The edge picks a backend by path. The reader's URL
never changes, and Google sees a plain `example.com/blog/a-post` served with a
`200`.

The setting that makes it work is the **override host**: the CMS origin only
answers to its own hostname, so the edge rewrites the `Host` header on the way
through while leaving the visible URL alone.
([Fastly](https://www.fastly.com/documentation/guides/full-site-delivery/domains-and-origins/specifying-an-override-host/))

Five things break, and the first three break silently:

1. **Absolute URLs in the CMS output.** Every `href="https://blog.example.com/…"`
   the CMS renders throws the reader straight back out of the subfolder. Most
   CMSs have a path-prefix setting for this. Check the rendered HTML, not the
   editor preview.
2. **The canonical tag.** If the CMS keeps emitting
   `<link rel="canonical" href="https://blog.example.com/a-post">`, you have built
   the subfolder and then explicitly told Google to ignore it. This is the most
   common way a proxy setup delivers exactly nothing.
3. **`robots.txt` and sitemaps.** `example.com/robots.txt` can only be answered by
   one origin — decide which, and make sure the blog's sitemap is reachable under
   the proxied path and listed. [Technical SEO Hygiene](technical-seo-hygiene) has
   the longer version of this problem, and it is the same problem.
4. **Caching and purging.** Your edge now caches someone else's pages. Hitting
   Publish in the CMS does not purge your CDN unless you wire that up.
5. **Blast radius.** The proxy sits in front of the store too. A bad rule for
   `/blog/*` is a config change on the path that also serves checkout — see
   [Maintaining Live Sites](maintaining-live-sites).

And whichever route you take, the old URLs get `301`s that stay forever. Google
asks for at least a year; if you own the domain, longer is strictly better. The
[SEO monitoring lesson](seo-monitoring-tools) has the before-and-after migration
checklist.

## Two ways a CMS gives you content

This generalises to nearly every modern CMS, so it is worth writing down
properly.

First, why these products exist at all — and it is not the writing experience:

> "Let's say you're a global company and you have a blog. You need all the
> permissions for who can edit what content. So rather than just have a WordPress
> site, they have all these complex enterprise [systems where] these people have
> these permissions to do these things."

**You are paying for the permission model, the workflow and the audit trail.**
WordPress on a box handles the words fine. It is *approvals across a
hundred-person marketing org* that costs money. Knowing that tells you which
parts of the vendor you can safely replace and which you cannot.

Then the two modes, which is the actual decision:

| | **Hosted theme** (autopublish) | **Headless** (via API) |
| --- | --- | --- |
| Who renders the HTML | The CMS, from a theme uploaded to it | Your app |
| Who owns the design | Whoever can edit the theme in the CMS | You, in your repo, in review |
| Publishing | Editor clicks Publish, it is live | Editor clicks Publish, and your app has to find out |
| Performance and Core Web Vitals | The vendor's problem, and their ceiling | Yours — good and bad |
| How it fails | Vendor is down, blog is down | Sync breaks, blog is silently stale |
| Cost to change something | Edit a theme in a browser | A real front-end project |

The trap is that headless looks obviously correct to engineers, because we get
the code. What we also get is the caching, the preview flow the editors already
had for free, and a brand-new bug class: *"it says published but the site does
not show it."*

Take headless when you want one design system across content and commerce, or
when the vendor theme is genuinely capping the site. Not because APIs feel
tidier.

## What does not belong in the CMS at all

Two sessions later Sara asked the practical version of this, about the legal
pages: *"those pages that are /pages, those are from the CMS — do we need to be
pulling them dynamically, or do we just hardcode that copy?"* The answer was the
team decision of that session, and it is shorter than the question:

> "We're hard coding everything that we can on this one. Nothing comes from the
> CMS other than the blog stuff."

That is not a shortcut, and it is worth knowing why, because "it is content, so
it goes in the CMS" is the default everyone reaches for.

**A CMS earns its place when someone who is not a developer edits that page,
repeatedly, and can find where.** All three conditions, or it is costing more
than it returns. Run the legal pages through them:

| Condition | Blog post | Privacy policy / terms |
| --- | --- | --- |
| Edited by someone who is not a developer | Yes, constantly | Almost never — it comes from a lawyer |
| Edited often | Weekly | Once or twice a year |
| The editor can find the edit box | Yes, it is their tool | **No.** They log a ticket in chat instead |

That third row was the real evidence. The legal copy was already technically
editable in the platform, and what actually happened was: *"somebody logs a ticket
in Slack anyway, because they can't find the place to edit it."* A CMS nobody can
navigate is not a content system, it is a slower deploy with a login page.

There is a second reason that is specific to legal pages and easy to miss. If
your consent flow ever has to be defended, **you have to be able to show which
version of the notice the user was shown.** GDPR Article 7(1) puts the burden on
you: *"the controller shall be able to demonstrate that the data subject has
consented"* ([Art. 7 GDPR](https://gdpr-info.eu/art-7-gdpr/)). A page in git has
that for free — every wording change is a dated, attributed, diffable commit. A
CMS field that somebody overwrote in March usually does not.

**The fair counter-argument**, and it is real: hard-coded copy means a typo fix
is a pull request and a deploy. If your deploy is slow or scary, that pushes
people toward asking a developer to "just quickly change it", which is exactly
the bottleneck the CMS was sold to remove. The answer is not to move the copy —
it is to make the deploy cheap. Where the deploy is genuinely expensive and the
copy genuinely changes weekly, put it in the CMS and accept the trade.

**And check the exit before you check in.** The same week, one of us was scripting
an export of a live theme out of a hosted video platform from the browser
console, because the product has no download-theme button — even though the
templates are Liquid, the same as Shopify. That generalises:

> **Content you cannot export on demand is content you do not own.** Before you
> put anything into a system, find the export path. If the answer is "we would
> script it out of the console", you already know what leaving costs.

## Keeping a copy in sync: poll, webhook, or on demand

Sara asked whether all this is the same as a nightly cron that already queries
the blogs. It is not, and the distinction deserves a name:

- An **index** stores enough to *find* something — title, URL, tags. That is what
  a site-search cron does: search for "learning" and it returns matching blogs,
  people and videos, then links out to them.
- A **mirror** stores the content itself, because you are the one rendering it.

An index can be hours stale and nobody notices. A mirror that is hours stale is a
publishing bug with an editor on the phone. *"We already query the blogs"* and
*"we have the content"* are very different statements.

If you go headless, you pick one of three:

| Strategy | How it works | Good | Bad |
| --- | --- | --- | --- |
| **Poll** | Hit the API every N minutes | Dead simple; self-healing, since the next run fixes whatever the last one missed | Stale by up to one interval; spends rate limit on "nothing changed" |
| **Webhook** | The CMS calls you when something publishes | Near-instant and cheap | You own retries, replays and signature checks — and an event that fires while you are deploying is just gone |
| **On demand** | Fetch at request time, cache the response | Never stale, no sync state to debug | Every reader waits on the vendor; vendor down means your pages are down |

In practice the answer is usually **webhook plus a slow poll as a backstop**. The
webhook makes it fast, the poll makes it eventually correct, and the combination
survives the failure that neither survives alone.

Webflow's own numbers make the case better than the argument does: a failed
webhook is retried **3 times at 10-minute intervals**, and after repeated failures
the webhook is **deactivated until support re-enables it**. Any design whose
freshness depends on nothing failing for half an hour is not a design. Rate limits
matter for the poll half — 60 requests a minute on lower plans, 120 on higher ones
— so a naive "fetch every article every five minutes" loop hits the ceiling on a
real content library.

Two things to get right on the webhook receiver, because they are the ones people
skip:

- **Verify the signature.** Webflow sends `x-webflow-signature` and
  `x-webflow-timestamp`, HMAC-SHA256 over the payload. Check both, and reject
  anything older than about five minutes so a captured request cannot be replayed
  later. An unauthenticated publish endpoint is an open write to your site's
  content.
- **Make the handler idempotent.** Retries mean you *will* get the same event
  twice. Same rule as a product import in
  [Maintaining Live Sites](maintaining-live-sites): the second run has to update,
  not duplicate.

Then decide, deliberately, how old a page may be — and let the CDN carry it rather
than your app.
[`stale-while-revalidate`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
is the right shape for a blog: serve the cached copy instantly, refresh it in the
background, and nobody ever waits on the CMS.

## Patch it, or move it?

The trigger for the whole conversation was mundane. The blog went down, Tom
patched it, and then asked the better question: is patching where this time should
keep going?

> **Patch what is cheap to patch. Migrate when the patches stop being cheap, or
> when the thing you keep patching is not the thing you want to own.**

Three questions that actually settle it:

1. **Will it recur?** One outage is not a signal. The third one in a month is.
2. **Does the patch teach you anything about the replacement?** If understanding
   the breakage is also the research for the migration, it is not wasted time.
3. **Would you rebuild it the same way?** If yes, keep patching — a migration that
   lands you somewhere identical bought nothing.

And the fourth question, which is the one that decides it in an agency: **what
does not get built while you migrate?** That is the same test applied to the
`/blog` move above, and it is the right one to apply to both.

## Four things worth copying from the real setup

The stack behind this discussion is ordinary, and every part of it generalises:

- **A CMS in autopublish mode behind a CDN.** A theme is uploaded to the CMS much
  like a WordPress theme; the CMS publishes it to a blog hostname, which is served
  through the CDN onto the main site's path. The URLs a reader sees are already
  the consolidated ones — the proxy is doing its job today. Check this before
  scoping a consolidation project: you may already have what you are about to pay
  for.
- **Know whether your cron is an index or a mirror.** A nightly job that powers
  site search across blogs, people and videos never pulled article bodies. Any
  plan that assumes the content is already held is starting from the wrong place.
- **The cheap option is usually "rebuild the theme where it already lives".**
  Pulling content through the API and rendering it yourself is the interesting
  option; re-skinning the hosted theme is often the one that ships.
- **Put the API credentials in the shared password manager first.** Whichever
  route you take needs them, and "in one person's notes" is the version that fails
  on the day that person is unreachable — the handover lesson in
  [Maintaining Live Sites](maintaining-live-sites) applies directly.

One more piece of context that keeps the consolidation argument honest: a company
running several sibling brand domains, each aimed at a different product line, is
not making a mistake. **Consolidation is an argument about one brand's content,
not about one company's brands.** Google's own docs list "easy separation of
sites" as a *pro* of keeping things apart.

## Try it yourself

1. **Find out where five blogs live.** Pick five companies you rate and look at
   their blog URL. Subfolder, subdomain, or its own domain? For each, write one
   sentence guessing why. You will find no consensus, which is the point.
2. **Read the HTML a proxy would have to fix.** Take any blog on a subdomain and
   run `curl -s <post-url> | grep -oE '(rel="canonical"[^>]*|href="https://[^"]*")' | sort -u | head -30`.
   How many of those would need rewriting to work under `/blog`? That count is the
   real cost of the "cheap" option.
3. **Price the move for a site you run.** Three lines: which URLs change, which
   redirects you would owe forever, and what breaks in analytics on day one. Then
   answer the question above — is that cheaper than one CDN rule, or not?
4. **Design the sync and then break it.** For any CMS you use, choose poll,
   webhook or on demand, then write down exactly what happens if your endpoint is
   down for 40 minutes. If the answer is "the blog is silently stale until someone
   notices", add the backstop poll.
