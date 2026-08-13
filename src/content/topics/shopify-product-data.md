---
title: Tags, Metafields & Getting 12,000 Products In
description: Two people can both be right about Shopify tags and still be arguing. Here is the line between them, and how bulk data actually gets into a store.
emoji: 🏷️
order: 25
status: learned
session: 15
date: 2026-08-13
tags: [shopify, metafields, collections, data-migration]
resources:
  - title: "Adding filters with Shopify Search & Discovery — Help Center"
    url: https://help.shopify.com/en/manual/online-store/storefront-search/search-and-discovery-filters
    note: The filter sources, the 25-filter ceiling, and the sentence about tag filters not being translated. Read that last one twice.
  - title: "Filtering products using product metafields — Help Center"
    url: https://help.shopify.com/en/manual/custom-data/metafields/filtering-products
    note: Which metafield types can be filtered on, and the switch you have to turn on in the definition before any of it works.
  - title: "Automated (smart) collections — Help Center"
    url: https://help.shopify.com/en/manual/products/collections/automated-collections
    note: What a collection can match on, and the 60-conditions-per-collection ceiling.
  - title: "Importing products with a CSV file — Help Center"
    url: https://help.shopify.com/en/manual/products/import-export/import-products
    note: The free built-in importer, its 15 MB limit, and the spreadsheet-sorting trap that silently drops your images.
  - title: "Bulk import data with the GraphQL Admin API"
    url: https://shopify.dev/docs/api/usage/bulk-operations/imports
    note: The JSONL route. Not rate-limited, 100 MB per file, 24 hours to finish. This is what the big tools are doing underneath.
  - title: "stagedUploadsCreate — GraphQL Admin API"
    url: https://shopify.dev/docs/api/admin-graphql/latest/mutations/stageduploadscreate
    note: How a file that is not on a public URL gets into Shopify Files. The answer to "the images are in Dropbox".
  - title: "Products import/export template — Matrixify docs"
    url: https://matrixify.app/documentation/products/
    note: The column reference for the tool we actually use. Note how metafield columns are named — that is most of the learning curve.
---

## The one rule to remember

> **Tags group products. Metafields describe them. A filter needs a description,
> not a group.**

That single line resolves the disagreement this session opened with, and it is
worth having ready the next time someone asks "can't we just use tags?"

## The question, and why both answers were right

Sara brought it from the product manager, who was building collections and
planning to use tags, but had been told the filters *"don't work very well with
tags."* Andrej answered from experience: on every Shopify project he has worked
on, smart collections matching on tags worked fine, and our import already put
multiple tags on every product for exactly that purpose.

Nobody was wrong. They were answering two different questions.

| The question | What does the work | Are tags good at it? |
| --- | --- | --- |
| *Which products are in this collection?* | Automated ("smart") collection conditions | **Yes.** This is what tags are for. |
| *Now narrow it down — colour, material, size* | Storefront filters (Search & Discovery) | **No.** And the reasons are specific. |

Building a collection and filtering inside one look similar from the admin, so
they get talked about as one thing. They are separate systems with separate
limits.

## Why tags make a bad filter

Four concrete reasons, all of them in Shopify's own docs.

**1. Every tag collapses into one filter.** Shopify's rule is that *"each filter
source can only be used one time for a store's filters."* Tags are a single
source. So you cannot have a **Colour** filter and a **Material** filter both
built from tags — you get one **Tags** box containing `silver`, `cotton`,
`gift`, `new-2026` and everything else, in one list, for the customer to squint
at.

**2. A tag has no type.** It is a string somebody typed. `Silver`, `silver` and
`Sliver` are three different tags and the storefront will happily show you all
three. A metafield definition has a type — single line text, a list, a number,
true/false — and it stays consistent across 12,000 products because it has to.

**3. Tag filters are not translated.** From the same help page: *"Translations
aren't supported for the Vendor and Tags filter values. The product tag filter
only displays to customers shopping in your store's default language."* This one
is not theoretical for us: a store we work on ships in **two languages**, so a
tag-based filter would show in one of them and be invisible in the other. On a
multilingual store, that reason alone settles it.

**4. You cannot curate the values.** With a metafield filter you choose which
values appear. With tags, whatever exists in the catalogue shows up, including
the internal ones you never meant a customer to see.

Worth knowing before you design anything: a store gets **up to 25 filters
total**, a filter group holds **up to 200 unique values**, and a store can have
**up to 1,000 filter groups**. Check the help page for the current numbers — they
move — but the shape of the constraint does not.

One catch that eats an afternoon if you miss it: a metafield does not become
filterable just because it exists. You have to turn the filtering option on in
the **metafield definition** itself, and only some types are eligible.

## Where tags are still exactly right

Do not read this as "rip the tags out". Andrej's position holds everywhere except
the filter box:

- **Automated collection conditions.** A collection can match on up to 60
  conditions, and tags are the natural thing to match on. This is the job the
  import already did.
- **Admin-side work.** Finding, bulk-editing and sorting products in the admin.
- **Anything that is not a product attribute.** `preorder`, `clearance-2026`,
  `do-not-index`. A metafield for those would be over-engineering.

The practical division: **if a customer would ever click it, make it a metafield.
If only we will ever act on it, a tag is fine.**

## Four ways to get bulk data in

| Route | Good for | Watch out for |
| --- | --- | --- |
| **Admin CSV import** | Simple product data, free, no install | 15 MB per file, and no metafields. Sorting the sheet in Excel can silently break image links. |
| **Matrixify** | What we use. Products, variants, images, variant images, tags, prices and metafields in one sheet | Column naming is the whole learning curve: `Metafield: …` for product level, `Variant Metafield: …` for variants. |
| **Admin GraphQL bulk operations** | Anything custom or repeatable | JSONL up to 100 MB, must finish inside 24 hours. It is *not* rate-limited, which is the whole reason it exists. |
| **A workflow tool** (n8n, Zapier) | Recurring imports someone non-technical triggers | You now own a second system. See the next section. |

For files that are not already on a public URL — the Dropbox case — the entry
point is `stagedUploadsCreate`: Shopify hands you a signed target, you upload to
it, then you attach the resulting file to a product. That is the plumbing
underneath every "bulk image upload" tool you will ever evaluate.

## The lifestyle images problem, and why the boring answer won

The real ask: a product owner who does not write code has lifestyle images in
Dropbox, already named to match products, and wants them on the products without
dragging 200 files one at a time.

Three answers went around the room.

**John's:** an n8n workflow plus a small Shopify app for the API token. She picks
a Dropbox folder, clicks *run workflow*, done. Technically correct, and he is
right that this is a solved problem — *"if she just wants to upload lifestyle
images, we just need the product ID, the image source, and an API token key."*

**Andrej's:** the images already live in Shopify Files, so uploading was never the
hard part. His question was the sharp one: *"is that an image for a section or a
product?"* Where does it go, and what changes when it lands?

**Mohamed's, which is what we agreed:** she sends the folder and tells us which
products; we upload to Files and build a Matrixify sheet that links each image to
its product.

Two things to take from that.

**The blocker was never the upload — it was the mapping.** A folder of files
tells you the file. It does not tell you which product it belongs to, or whether
it is the third gallery image or a section background. That mapping is a human
decision, and a workflow that guesses it will be wrong at scale and wrong
silently. Andrej's question *is* the work; everything else is transport.

**Do not build a tool for a job that has happened once.** A workflow you own is
a thing that breaks later, when the token rotates or the folder gets renamed, and
it breaks for the person least able to fix it. Doing it by hand this time also
tells you what the tool would need to do — and if it happens a third time, build
it then, from real requirements instead of guessed ones.

## What a real import taught us

**The scale we are actually working at.** Around 12,000 products came in from the
first import, with images and variant images. Another 6,000 needed extra
per-product configuration on top. Roughly 100 metafields were missing across the
imported catalogue and had to come from a separate source. None of this is
exceptional volume for Shopify — it is exactly the volume at which drag-and-drop
stops being a plan.

**QA the import, not the script.** Everything above was found by running quality
assurance passes over the imported data, not by re-reading the importer. The
clearest example: a blocker meant the script silently skipped a whole class of
metafield for any product with fewer than two sides. The script looked fine. The
products were wrong. **The output is the only thing that tells you the truth** —
the same argument as [Regression Testing](regression-testing), applied to data
instead of code.

Practical habit from that: after any bulk import, count. How many products should
have this metafield, how many do? A one-line count catches a class of bug that
reading code does not.

**Tags are already on everything.** Our imports tagged every product for
collection matching. Adding filter metafields is additive — new definitions
alongside the tags, not a migration off them.

**The tools we settled on.** Shopify MCP to move the files, Matrixify to link
them to products. Both are already in the workflow, which is most of why this
was the right call.

**One more page to read first.** If the products import fine but a page will not
open in the theme editor, that is a different problem entirely and it is written
up in [Shopify Templates](shopify-templates-and-the-editor).

## Try it yourself

1. Open any collection page on a store you work on and look at the filters. For
   each one, work out whether it is coming from a tag, a product option, or a
   metafield. Then check the store's default language and ask what a shopper in
   the other language sees.
2. Create one metafield definition on a dev store — single line text, say
   `Material` — turn on the filtering option in the definition, set it on three
   products, and add it as a filter in Search & Discovery. Ten minutes, and the
   whole tags-versus-metafields argument becomes obvious.
3. Export 10 products with Matrixify and open the sheet. Find the `Metafield: …`
   columns and the image rows. Change one value, re-import, confirm it landed.
   That round trip is the skill; everything else is column names.
4. Take a folder of images you have lying around and write down what a script
   would need to know to file them correctly. You will get past "the filename"
   in about thirty seconds — that is the mapping problem in this lesson.
