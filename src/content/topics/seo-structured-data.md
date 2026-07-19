---
title: SEO Basics & Structured Data
description: What developers can actually do for SEO — clean HTML, fast pages, and schema markup.
emoji: 🔍
order: 2
status: learned
session: 1
date: 2026-07-16
tags: [seo, structured-data, schema]
resources:
  - title: SEO Starter Guide — Google Search Central
    url: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
    note: Google's own beginner guide. The best single place to start.
  - title: Structured Data — Google Search Central
    url: https://developers.google.com/search/docs/appearance/structured-data
    note: Which schema types Google understands, and what rich results they unlock.
  - title: Schema.org Validator
    url: https://validator.schema.org/
    note: Paste a URL or code snippet and check your structured data is valid.
  - title: Rich Results Test
    url: https://search.google.com/test/rich-results
    note: Google's tester — shows which rich results your page can get.
  - title: Google Search Console
    url: https://search.google.com/search-console
    note: Where Google reports indexing problems, Core Web Vitals, and structured data errors.
---

## SEO from a developer's seat

SEO (Search Engine Optimization) is a big field, but the developer part of it is
surprisingly small and concrete. Search engines want three things from us:

1. **Crawlable, clean pages** — meaningful HTML, working links, no broken pages.
2. **Fast pages** — Core Web Vitals are a ranking signal (see the
   [Web Performance](web-performance) lesson — it is the same story from the SEO angle).
3. **Machine-readable meaning** — structured data that explains what a page *is*.

Marketing owns keywords and content. We own the technical foundation.

## The technical SEO checklist

Things a developer can check on any site:

- **One clear `<h1>`** per page, headings in a logical order.
- **Title and meta description** set and unique per page.
- **Semantic HTML** — real `<a href>` links (crawlers do not click JavaScript buttons), `<nav>`, `<main>`, alt text on images.
- **No broken links** or endless redirect chains.
- **Mobile-friendly** — Google indexes the mobile version of your site first.
- **HTTPS** everywhere.
- **`robots.txt` and sitemap** not blocking pages by accident.

None of these are exotic — they are just good HTML. That is the secret: most
technical SEO is writing the HTML we should be writing anyway.

## Structured data (schema markup)

Structured data is a bit of JSON you put in the page that tells search engines, in
their language, what the page contains: *this is a product, it costs $49, it has
4.7 stars from 92 reviews.*

Why bother? Because it unlocks **rich results** — the fancy search listings with
stars, prices, FAQs, and images. Those get more clicks than plain blue links.

The vocabulary lives at [schema.org](https://schema.org/), and the format Google
recommends is **JSON-LD** in a script tag:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Espresso Machine 3000",
  "offers": {
    "@type": "Offer",
    "price": "449.00",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "92"
  }
}
</script>
```

Common types for e-commerce work: `Product`, `Offer`, `AggregateRating`,
`BreadcrumbList`, `FAQPage`, `Organization`, `Article`.

## Always validate

Structured data fails silently — a typo just means no rich result, with no error
in your console. So after adding or changing markup, always run it through:

- **[Schema.org Validator](https://validator.schema.org/)** — is the markup valid at all?
- **[Rich Results Test](https://search.google.com/test/rich-results)** — does *Google* understand it, and which rich results can it produce?

And keep an eye on **Search Console**, which reports structured data errors across
the whole site over time.

## Try it yourself

1. Open a big e-commerce product page, view source, and search for `application/ld+json`. Read what they tell Google.
2. Paste that page's URL into the [Rich Results Test](https://search.google.com/test/rich-results) and see what it detects.
3. Run the checklist above on a project you work on. How many boxes does it tick?
