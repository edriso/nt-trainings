---
title: SEO Monitoring & Screaming Frog
description: Tools for tracking SEO health, migrations, and redirects across large site updates
emoji: 🐸
order: 19
status: learned
session: 9
date: 2026-08-04
tags: [tools, seo, migration]
---

## The Big Idea

> **During a migration, URLs break and search engines lose rank signals.** Monitoring tools like Screaming Frog crawl your site as Google does, show you the damage *before* launch, and let you verify redirects are working—turning a chaotic launch into a calm one.

When you move a site, restructure URLs, or change domains, you risk losing years of search rankings, user trust (broken links), and traffic. But most developers don't see these problems until weeks after launch when users start complaining or analytics drop. Screaming Frog and similar tools let you find and fix these issues *during* testing, not after going live.

## What is SEO monitoring?

SEO monitoring means watching your site the way Google does: crawling every page, checking links, reading titles and metadata, verifying redirects work. Most migrations fail not because of bad content, but because:

- **Broken internal links** point to URLs that no longer exist
- **Forgotten redirect chains** (A → B → C) that lose ranking power
- **Status code issues** (404s instead of redirects, or 500 errors)
- **Meta tag mismatches** (titles, descriptions not migrated)
- **Canonicals misconfigured** (telling Google the old URL is the "real" one)

A few hours of checking before launch prevents weeks of fixing after.

## Meet Screaming Frog

Screaming Frog SEO Spider is a crawler—a tool that starts at your home page, follows every internal link, and reports what it finds. It comes in two flavors:

- **Free version**: Crawls up to 500 URLs per site, enough for small sites or testing
- **License version**: Unlimited crawls, API access, integrates with Search Console and Google Analytics

### What it shows you

When you point Screaming Frog at a URL, it crawls and reports:

- **HTTP status codes** (200 = working, 301 = redirected, 404 = broken, 500 = server error)
- **Page titles and meta descriptions** (so you can spot missing or duplicate ones)
- **Canonical tags** (is Google being told the right URL is canonical?)
- **Redirect chains** (A → B → C tells you which ones waste ranking power)
- **Internal link anchors** (what text do links use? Are they descriptive?)
- **External links** (which ones are broken?)
- **Images and alt text** (are images tagged for accessibility and SEO?)

### How developers use it in migrations

You don't need to be an SEO expert. The workflow is simple:

1. **Pre-migration baseline**: Crawl your live site and note the status codes and counts (X working pages, Y redirects, etc.).
2. **Crawl the staging site** (your new structure) and compare. Are old URLs returning 200 or 301? Are there new 404s?
3. **Check redirect mappings** by searching for the old URL in the crawl results. Is it returning 301 to the new URL? Does the chain end at a 200?
4. **Spot-check title and metadata** to ensure they moved correctly.
5. **Run it again pre-launch** as a final sanity check.

After launch, you can crawl weekly to catch any new issues (bad deployments, forgotten URLs).

## Integrating monitoring with redirects

Redirects are where SEO monitoring gets hands-on. A 301 redirect tells Google "move here permanently" and passes ranking signals. But a redirect chain (A → B → C) is weaker than A → C directly.

### How Screaming Frog checks redirects

When you crawl the new site and Screaming Frog encounters an old URL responding with a 301, it shows:

- The source URL (old one)
- The status (301)
- Where it redirects to (the new URL)
- Whether that destination is a 200 (working) or another redirect (a chain)

**Red flags to look for:**

- A 301 that points to a 404 (broken redirect)
- A chain longer than 2 steps (A → B → C is weak; A → B is strong)
- A 301 that points to a different domain incorrectly
- Old URLs returning 200 instead of redirecting (content duplication)

### Common redirect mistakes during migrations

1. **Missing redirects**: Old URL not mapped to new one. Returns 404.
   - Fix: Add the 301 rule to your web server or CDN.

2. **Wrong destination**: Redirect points to a typo or wrong page.
   - Fix: Check your redirect map file (often a spreadsheet or config) for accuracy.

3. **Redirect to wrong protocol or domain**: Redirect from `http://old.com/page` to `https://new.com/page` but domain isn't live yet.
   - Fix: Test with `curl -I` before the DNS cutover.

4. **JavaScript redirects instead of HTTP 301s**: Using `window.location` in JS instead of server-side redirects.
   - Problem: Google crawlers see the old URL and may not follow the redirect. Search bots don't always execute JavaScript.
   - Fix: Use server-side redirects (Apache mod_rewrite, Nginx, Vercel redirects, Cloudflare rules).

## Connecting monitoring to analytics and tracking

SEO monitoring isn't just about links—it's about understanding traffic impact. Screaming Frog can integrate with Search Console and Google Analytics to show you which pages are losing impressions or clicks.

### What to check after migration

1. **Search Console** (Google's official tool):
   - Check the "Coverage" report for crawl errors.
   - Look at "Performance" to see if clicks or impressions dropped.
   - Use the URL Inspection tool to verify Google crawled the new URL.

2. **Analytics (GA4)**:
   - Compare traffic week-over-week for the migrated pages.
   - Check bounce rate and session duration—if they spike, something's broken.
   - Look for 404 errors in the logs (if you track them).

3. **Server logs**:
   - Screaming Frog's companion tool, Log File Analyser, lets you upload server logs and see how Googlebot crawled your site.
   - Check: Did Googlebot crawl both old and new URLs? Are there 404s in the bot logs?

## Alternatives to Screaming Frog

You don't have to buy Screaming Frog. Other tools solve similar problems:

| Tool | Cost | Best for |
|------|------|----------|
| **Screaming Frog** | Free (500 URLs) / License | Full technical audits, detailed reports |
| **Ahrefs Site Audit** | Paid | Link analysis + crawling (SEO agency workflow) |
| **SEMrush Site Audit** | Paid | Competitive analysis + crawling |
| **Lighthouse (Chrome)** | Free | Performance + SEO for single pages (not site-wide) |
| **Google Search Console** | Free | Official Google data; limited to pages Google has crawled |
| **curl + shell scripts** | Free | Developers who want full control; check a specific URL or list |
| **Netpeak Spider** | Paid | Desktop tool like Screaming Frog; Windows only |
| **Apache Nutch** | Free | Open-source crawler; for custom crawling workflows |

### Which one for migrations?

- **Small site (< 500 pages)**: Use free Screaming Frog. Fast, visual, no setup.
- **Custom workflow (checking specific URLs, automation)**: Write a simple `curl` script.
- **Checking live traffic impact**: Use Google Search Console (free, authoritative).
- **Integrated SEO + link analysis**: Ahrefs or SEMrush (overkill for devs, better for marketers).

## Practical: Your migration checklist

Here's a workflow for coordinating a migration with Screaming Frog:

### 1 week before launch

- [ ] Crawl the live site with Screaming Frog. Note the count of 200 pages, 301s, 404s.
- [ ] Export the results (CSV). Set it aside—this is your baseline.
- [ ] Build your redirect map (spreadsheet: old URL → new URL).
- [ ] Deploy redirects to staging.

### 2 days before launch

- [ ] Crawl staging with Screaming Frog.
- [ ] Compare to baseline. Are the same number of pages reachable?
- [ ] Filter for all 301s in staging results. Spot-check 10–15: do they end at 200? Do they point to the right new URL?
- [ ] Search for any 404s that shouldn't be there.
- [ ] Check 5 randomly selected pages for title and metadata accuracy.

### Launch day

- [ ] Run one final crawl on staging immediately before cutting over.
- [ ] Monitor Search Console Indexing report. You should see the new URLs appear.

### 1 week after launch

- [ ] Crawl the live site with Screaming Frog.
- [ ] Compare to baseline (same pages reachable? Same title accuracy?).
- [ ] Check Search Console Coverage report for crawl errors.
- [ ] Look at GA traffic. Any sharp drops on specific page groups?

## Try it yourself

### Exercise 1: Crawl a small site and read the report

Download free Screaming Frog and crawl a small public site (e.g., a blog under 100 pages). Export the results as CSV.

- How many pages returned 200? How many 301s or 404s?
- Open the CSV and filter for status code = 301. Pick one redirect. Does the destination make sense?
- Check a page title—how many characters is it? (Google usually shows 50–60 characters on mobile.)

**Goal**: Get comfortable reading a crawl report and understanding HTTP status codes.

### Exercise 2: Find a redirect chain in the wild

Using curl from your terminal, trace a redirect chain:

```bash
curl -I https://example.com/old-page
```

This shows the first response. If it's a 301, follow it:

```bash
curl -I https://example.com/new-page
```

Keep going until you see a 200. Count the steps. If it's more than 2 steps (A → B → C), that's a weak chain.

**Goal**: Understand redirect chains and practice using curl to verify them.

### Exercise 3: Compare a live site before and after a small change

Crawl a live site you manage. Make a small URL change (rename one page). Crawl again. Use Screaming Frog's "Compare" feature or export both as CSVs and diff them.

- What pages show new 404s?
- Did any internal links to the renamed page break?
- Did the redirect work?

**Goal**: Practice catching breakage *before* it affects real users.

### Exercise 4: Set up Search Console monitoring for a site

If you manage any site, add it to Google Search Console (verify ownership via DNS or HTML file upload). Check the "Coverage" report.

- How many pages has Google indexed?
- Are there crawl errors or excluded pages?
- Check "Performance" → pick a top page. How many clicks and impressions did it get last week?

After a migration, revisit this report weekly for the first month. A drop in clicks or impressions means Google is re-evaluating your pages.

**Goal**: Learn to use Google's official SEO tools alongside crawling tools.
