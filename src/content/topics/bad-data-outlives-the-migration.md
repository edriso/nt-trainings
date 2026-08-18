---
title: Bad Data Outlives the Migration
description: A move from one platform to another carries the mess with it. Here is how 14 birthstones became 34 options, and why your UI should read from a fixed list instead.
emoji: 🗃️
order: 30
status: learned
session: 18
date: 2026-08-18
tags: [data-modeling, shopify, migration, metaobjects]
resources:
  - title: About metaobjects — Shopify
    url: https://shopify.dev/docs/apps/build/metaobjects
    note: What a metaobject is, and why one definition with many entries is the right shape for a fixed list.
  - title: Data modeling with metafields and metaobjects — Shopify
    url: https://shopify.dev/docs/apps/build/metaobjects/data-modeling-with-metafields-and-metaobjects
    note: When to use a reference type instead of a text field. The difference between pointing at a list and copying from it.
  - title: metaobjectByHandle — Shopify Admin GraphQL
    url: https://shopify.dev/docs/api/admin-graphql/latest/queries/metaobjectByHandle
    note: The stable way to look an entry up. Handles survive a rename; display names do not.
  - title: Subsystems of ETL Revisited — Kimball Group
    url: https://www.kimballgroup.com/2007/10/subsystems-of-etl-revisited/
    note: Subsystem 1 of 34 is data profiling. Twenty years old and still the reason to count your data before you move it.
  - title: Controlled vocabulary
    url: https://en.wikipedia.org/wiki/Controlled_vocabulary
    note: The name librarians gave this problem long before we had it. A fixed list of allowed terms, and everything points at it.
  - title: Effective ML, revisited — Jane Street
    url: https://blog.janestreet.com/effective-ml-revisited/
    note: Where "make illegal states unrepresentable" comes from. The idea works far outside the type system it was written for.
---

## The one rule to remember

> **A migration moves your data. It does not clean it.**

Nothing about copying rows from one system into another makes them more correct.
If the old platform let someone type a stone name into a free-text field for eight
years, the new platform now has eight years of typed stone names — and a shiny new
admin UI that makes them much easier for a client to notice.

That is the story below. It took twenty minutes of one session and it is the most
useful twenty minutes of data modelling we have written up.

## What we found

The client opened a product customizer, went to the birthstone selector, and
counted **34 variants of birthstone**. Nobody on the build side thought there were
34. The conversation that followed is worth reading as a shape, because it is what
"we don't trust our own data" sounds like:

> "Do you remember if it was 14 or 12? That was the final number. Or 13."
> "I thought it was 13."

Then somebody opened Settings → Custom data → Metaobjects, and the entries list
said **14**. Two of them were pairs on the same month: **April** carries cubic
zirconia *and* diamond, **December** carries blue topaz *and* tanzanite. Twelve
months, fourteen stones, and a UI showing thirty-four options.

The gap between 14 and 34 was never a feature. It was leftovers.

## Where the extra twenty came from

The source is the most common source there is:

> "I think what happened is the Magento export had a lot of bad data, and they're
> now seeing it in Shopify and they're pointing that out. So I don't think it's
> anything that we did."

That last sentence is true and it does not help. Once the data is in your store,
in your customizer, being counted by your client, it is your problem regardless of
who typed it in 2019.

The mechanism that turned bad rows into a bad UI is the part to learn. The
customizer built its list of options **by reading the products**. Every distinct
birthstone string that appeared anywhere in the imported catalogue became an
option in the picker. Do that, and your dropdown is a report on your data quality.
Misspellings become options. Old naming conventions become options. `Aquamarine`,
`aquamarine` and `Aquamarine ` become three options.

There is a mirror-image bug in the same design: a product with **one** birthstone,
where that one stone lives in the product's own data rather than in the shared
list — so the picker shows one option instead of the fourteen a customer should be
able to choose from.

Same root cause, opposite symptom. The options came from the data instead of from
a decision.

## The fix has a name

The proposal in the meeting was exactly right:

> "If we're having a final list of birthstones… take the information of *does the
> product have a birthstone* and *how many options for it*, and just render the
> pre-made list of the birthstones."

And the rule that follows from it:

> "We should always show all 14 wherever the birthstone option is."

Librarians have called this a
[controlled vocabulary](https://en.wikipedia.org/wiki/Controlled_vocabulary) for
about a century: a fixed list of allowed terms that everything else points at,
instead of everyone writing their own. Data people call the same thing **reference
data**. In Shopify it has a specific home —
[metaobjects](https://shopify.dev/docs/apps/build/metaobjects): one definition
(Birthstone), many entries (the fourteen), referenced from products through a
metafield rather than copied into them.

The difference in one line:

| Options come from… | What the picker shows | What a typo does |
| --- | --- | --- |
| **The product data** (derived) | Whatever anyone ever typed | Adds an option |
| **A metaobject list** (declared) | The fourteen, always, in order | Nothing — it is not on the list |

There is a second, quieter win. When the list is declared, the product only has to
answer two much smaller questions: *does this product take a birthstone at all,*
and *how many slots does it have?* Those are facts about the product. The names of
the stones never were.

## Make the wrong state impossible

The phrase for this comes from Yaron Minsky at Jane Street, in a 2010 lecture:
**make illegal states unrepresentable**
([Effective ML, revisited](https://blog.janestreet.com/effective-ml-revisited/)).
It was written about type systems, and it transfers cleanly to data modelling.

Ask of any bug: *could this state have existed at all?*

- If the picker reads free text from products, "April — Cubic Zirconia" and
  "april cubic zirconia" are both perfectly representable. You are left writing
  validation, cleanup scripts and a de-duplication mapping, forever.
- If the picker reads a list of fourteen metaobject entries, a fifteenth
  birthstone is not a bug you fix. It is a state that cannot be written down.

Shopify gives you the enforcement for free. A metafield defined as a
`metaobject_reference` (or `list.metaobject_reference` for many) can only hold
pointers to real entries in that definition
([data modeling docs](https://shopify.dev/docs/apps/build/metaobjects/data-modeling-with-metafields-and-metaobjects)).
There is no way to point it at a stone that does not exist. Validation you do not
have to write is validation that cannot drift.

## Two identifiers, and only one is safe to build on

This is the practical question the meeting raised and did not finish, so here is
the answer. The question was:

> "If they go in and hide what is probably a duplicate birthstone that was named
> something because the Magento export had it named something — does that mess up
> the customizer?"

It depends entirely on what the customizer stores. A Shopify metaobject entry has
two names, and they behave very differently:

| | **Display name** | **Handle / GID** |
| --- | --- | --- |
| Where it comes from | The first text field in the entry | Generated from the display name, then fixed |
| Changes when someone edits the entry | Yes | No |
| Safe to key logic on | **No** | Yes |
| How you look it up | By reading and matching a string | [`metaobjectByHandle`](https://shopify.dev/docs/api/admin-graphql/latest/queries/metaobjectByHandle), or by GID |

So: if the customizer matches on the display name, then a merchant tidying up
"Cubic Zirconia " to "Cubic Zirconia" in the admin has just shipped a bug, and
nobody will connect the two events. If it holds the handle or the GID, the rename
is invisible and everything keeps working.

The general rule, worth carrying to every platform:

> **Never key logic on a string a human is allowed to edit in an admin UI.**

Which gives the client a straight answer instead of a shrug: *hiding a duplicate
is safe once we render from the metaobject list and store handles. Until then, it
is a code change performed through the admin.*

## Count it before you move it

None of this was discovered by reading code. It was discovered because someone
counted, and the counts disagreed: 34 in the picker, 14 in the metaobjects,
"13, I think" in everybody's memory.

That counting step has a formal name and a long pedigree. In Ralph Kimball's
much-cited breakdown of ETL (Extract, Transform, Load) architecture, the very
first of thirty-four subsystems is **data profiling**:

> "Data Profiling (subsystem 1) — Explores a data source to determine its fit for
> inclusion as a source and the associated cleaning and conforming requirements."
> ([Kimball Group](https://www.kimballgroup.com/2007/10/subsystems-of-etl-revisited/))

Subsystem *one*. Before extraction. The whole industry agreed decades ago that you
look at the data before you move it, and it still gets skipped on nearly every
project, because moving the data feels like progress and counting it does not.

Profiling is not a tool you have to buy. For a catalogue import it is four
questions, and half an hour:

1. **How many distinct values does this field have?** Compare with how many there
   are supposed to be. `34` against an expected `14` ends the investigation
   immediately.
2. **List them and sort them.** Casing differences, trailing spaces and near-twins
   line up next to each other and become obvious.
3. **How many rows are empty?** An option nobody filled in is a different problem
   from an option filled in wrongly.
4. **Which of these do we have a decision about?** Every value with no owner is a
   question for the client, and it is far cheaper to ask before launch than after.

Run those before the import and the mapping from 34 to 14 is a spreadsheet you
build once. Run them after, and it is an investigation across two live systems,
which is what this one became.

## It does not stay in one system

The last thing worth taking from this: bad data spreads, on a schedule you do not
control. Someone asked about a misspelled month name, and the answer traced the
path:

> "Whatever is defined on Shopify, that product gets created in the inventory
> system. So then it's recorded incorrectly there too."

Shopify was the source; the downstream system inherited the typo automatically.
Nobody made a mistake in the second system at all. Two useful consequences:

- **Fix it upstream or fix it forever.** Correcting the copy downstream without
  correcting the source means the next sync undoes your work. Find the system that
  writes first.
- **Check where the client is actually looking.** Notably, the **orders** were
  correct — the mess was in the option list, not in what customers had bought.
  That distinction changes how urgent the bug is, and it took one question to
  establish. Ask it early: *is this wrong everywhere, or wrong in one view?*

## The counter-argument, because a fixed list is not free

Rendering a declared list solves the bug and buys three new obligations. Say them
out loud before choosing it:

- **Somebody has to own the list.** Fourteen entries need an owner the day a
  fifteenth stone gets added, or the "single source of truth" quietly becomes a
  fifteenth source of stale.
- **A fixed list can be the thing that is wrong.** The data said 34 and the list
  said 14 — the list won because a human decision backed it. If the list were
  itself a guess, rendering from it would just be a tidier way of being wrong. In
  this case the confirmation was still outstanding: some records carried only a
  month, others carried stone names, and the two did not add up, so the final
  month-to-name mapping stayed a question for the client.
- **You still have to migrate the old values.** Existing products point at
  strings; they need to point at entries. That is a one-time mapping job, and it
  is real work — it is just work you do once, instead of a bug you fix repeatedly.

The honest version of the rule is therefore narrower than "always use a fixed
list":

> **Declare the list when the set of valid values is a decision. Derive it when
> the set is genuinely whatever the data says.**

Birthstones are a decision. Twelve months, fourteen stones, agreed with the
client. Product tags on an open-ended catalogue might not be — and the line
between those two cases is drawn in more detail in
[Tags, Metafields & Getting 12,000 Products In](shopify-product-data).

## Four things worth copying

**Write the open question in two parts, not one.** "Confirm the birthstone list"
is not answerable. "Confirm the months, confirm the stone names, and confirm which
months legitimately carry two stones" is. Until all three come back, any mapping
down from 34 is provisional — and saying so protects you later.

**Split "how the data gets in" from "what the data is".** Those are genuinely
different investigations and they can run in parallel: one person keeps the import
work moving, another traces where the extra values came from. That split is why
the answer arrived in a day instead of three.

**A migration that duplicated one thing duplicated more.** Duplicate product
titles had turned up separately during visual QA. Same import, same family of
problem. When you find one, go looking for its siblings before the client does.

**Do not fix this by hiding rows.** The instinct when a client says "there are 34
and there should be 14" is to hide twenty things in the admin. That leaves the
picker still reading from products, still able to grow a thirty-fifth option on
the next import, and now with twenty hidden rows nobody remembers the reason for.
Fix the read path, then clean up.

## Try it yourself

1. **Profile one field, right now.** Pick any field on a store or database you
   work with, list its distinct values, and sort them. Count how many you expected
   before you look at the number. The gap is the lesson.
2. **Trace one dropdown backwards.** Find a select or filter in something you have
   built and answer: are these options declared somewhere, or derived from
   whatever is in the data? If derived, work out what a typo would do to it.
3. **Find a string your code keys on.** Search a repo for a comparison against a
   human-editable label — a product title, an option name, a tag, a collection
   name. Ask what breaks if someone fixes the capitalisation in the admin
   tomorrow.
4. **Write the mapping.** Take two columns — every value that exists, and the
   value it should become. Fourteen rows of "keep", twenty rows of "map to". That
   spreadsheet is the deliverable this kind of bug actually needs, and it is
   twenty minutes of work.
