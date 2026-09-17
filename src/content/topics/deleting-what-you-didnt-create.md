---
title: Don't Delete What You Didn't Create
description: A cleanup pull request got stopped over one metaobject with "Google Shopping" in the name. Here is how to tell a safe delete from a one-way door.
emoji: 🚪
order: 32
status: learned
session: 19
date: 2026-09-16
tags: [shopify, data, code-review, risk]
resources:
  - title: metaobjectDefinitionDelete — Shopify GraphQL Admin API
    url: https://shopify.dev/docs/api/admin-graphql/latest/mutations/metaobjectDefinitionDelete
    note: Read the one-line description. It cascades to every entry, and there is no flag to stop it.
  - title: Manage metafield definitions — Shopify
    url: https://shopify.dev/docs/apps/build/metafields/definitions
    note: Where `deleteAllAssociatedMetafields` is documented. It defaults to false, which is the whole difference between the two mutations.
  - title: Custom data ownership — Shopify
    url: https://shopify.dev/docs/apps/build/custom-data/ownership
    note: What `$app` and `app--<id>` namespaces mean, and why an ordinary namespace tells you nothing about who owns it.
  - title: Metaobject object — Shopify GraphQL Admin API
    url: https://shopify.dev/docs/api/admin-graphql/latest/objects/Metaobject
    note: '`createdByApp` and `createdByStaff` are right there. One query answers "did we make this?" for metaobjects.'
  - title: Bulk operations — Shopify
    url: https://shopify.dev/docs/api/usage/bulk-operations/queries
    note: How to count non-null values across every product, so "it is not used" becomes a number instead of a feeling.
  - title: When and how products expire — Google Merchant Center
    url: https://support.google.com/merchants/answer/160586
    note: The 30-day refresh window. This is why a broken feed is noticed a month after the commit that broke it.
  - title: Fixing Merchant Center warnings and account suspensions
    url: https://support.google.com/merchants/answer/13693195
    note: The recovery path, in business days. Reverting your commit does not start it any sooner.
  - title: The Drift from Domesticity — G.K. Chesterton (PDF)
    url: https://thedomesticempress.com/wp-content/uploads/2022/07/Drift-From-Domesticity-the-Thing.pdf
    note: The original fence passage from 1929. Read the second paragraph, which almost everyone omits and which is the useful half.
  - title: 2015 Letter to Shareholders — Amazon (PDF)
    url: https://s2.q4cdn.com/299287126/files/doc_financials/annual/2015-Letter-to-Shareholders.PDF
    note: Where one-way and two-way doors come from, including the warning about treating everything as Type 1.
  - title: Automating dead code cleanup — Meta Engineering
    url: https://engineering.fb.com/2023/10/24/data-infrastructure/automating-dead-code-cleanup/
    note: 100 million lines deleted, and the method is the point — static analysis plus runtime logs, because static analysis alone cannot see dynamic callers.
  - title: Tearing down the Chesterton's Fence principle — LessWrong
    url: https://www.lesswrong.com/posts/FtCdvfkoMf7H3XkhK/tearing-down-the-chesterton-s-fence-principle
    note: The best argument against the rule in this lesson. Worth reading before you use the rule to block someone.
---

## The one rule to remember

> **Before you delete it, answer two questions: who made it, and can I put it
> back? You need both answers. Neither one on its own is enough.**

Cleanup is good work. Nobody in this lesson is arguing for keeping junk. The
argument is about what counts as evidence that something is junk, and about
noticing the one item in a batch of twenty that behaves differently from the
other nineteen.

## The pull request that got stopped

A developer had been cleaning up metafields and metaobjects on a live store and
opened a batch of pull requests deleting the unused ones. The lead was merging
them and stopped on one:

> **Lead:** "I saw your PRs come through for deleting meta objects. I understand
> the cleanup of the customizer ones. There was one with Google Shopping. Are we
> deleting that because it's no longer used? Did we create that, or how did that
> get created? Just before I merge…"
>
> **Developer:** "It's not being used at all. I can recheck, but I checked, it
> wasn't used at all on the project."
>
> **Lead:** "But somebody else created it, is my point. Not us."

And then the rule, stated plainly:

> "If somebody else created it, we shouldn't delete it. Let's just leave it there
> even if it's dirty. The other ones will merge."

Notice what that is not. It is not "stop the cleanup" — nineteen of the twenty
merged that morning. It is not "you were careless" — the developer had checked,
and his answer, that the team created all of them, was his honest reading of the
store. It is one item pulled out of a batch and given a different process, because
the lead could name a specific bad outcome for that one item and not for the
others:

> "The Google Shopping ones worried me. I just don't want to delete something
> that's like a feed sync or something like that."

He took the audit as his own action item rather than pushing it back. That
matters too: the person who raises the doubt owns clearing it, or the doubt just
becomes a stalled pull request.

## Chesterton did not say never delete

The principle has a name and it is nearly a hundred years old. G.K. Chesterton,
in *The Thing* (1929):

> "There exists in such a case a certain institution or law; let us say for the
> sake of simplicity, a fence or gate erected across a road. The more modern type
> of reformer goes gaily up to it and says, 'I don't see the use of this; let us
> clear it away.' To which the more intelligent type of reformer will do well to
> answer: 'If you don't see the use of it, I certainly won't let you clear it
> away. Go away and think. Then, when you can come back and tell me that you do
> see the use of it, I may allow you to destroy it.'"

Almost everybody stops quoting there, and the stopping point is what turns a
useful rule into an excuse. The next paragraph is the half you want:

> "The gate or fence did not grow there. It was not set up by somnambulists who
> built it in their sleep… Some person had some reason for thinking it would be a
> good thing for somebody. And until we know what the reason was, we really
> cannot judge whether the reason was reasonable… If he knows how it arose, and
> what purposes it was supposed to serve, he may really be able to say that they
> were bad purposes, or that they have since become bad purposes, or that they
> are purposes which are no longer served."

Chesterton hands you three grounds for removal, and one of them —
*purposes which are no longer served* — covers most real cleanup work. He also
says *"I may allow you to destroy it"*. The fence is a **burden of proof, not a
veto.**

Worth knowing the counter-argument too, because this rule is genuinely abused.
The [critique on LessWrong](https://www.lesswrong.com/posts/FtCdvfkoMf7H3XkhK/tearing-down-the-chesterton-s-fence-principle)
is that it gets used to make people "calm and accepting, yet embarrassed and
incurious", and to imply that anyone proposing a change simply knows less than
whoever built the thing. Both failure modes are real. If you invoke the fence,
you have taken on the job of finding out why it is there — which is exactly what
the lead did here.

## Which door is this?

The sharper tool is Jeff Bezos's, from Amazon's
[2015 shareholder letter](https://s2.q4cdn.com/299287126/files/doc_financials/annual/2015-Letter-to-Shareholders.PDF):

> "Some decisions are consequential and irreversible or nearly irreversible —
> one-way doors — and these decisions must be made methodically, carefully,
> slowly… But most decisions aren't like that — they are changeable, reversible —
> they're two-way doors… Type 2 decisions can and should be made quickly by high
> judgment individuals or small groups."

And, in the same letter, the warning that keeps this from becoming caution for
its own sake:

> "As organizations get larger, there seems to be a tendency to use the
> heavy-weight Type 1 decision-making process on most decisions, including many
> Type 2 decisions. The end result of this is slowness, unthoughtful risk
> aversion, failure to experiment sufficiently, and consequently diminished
> invention."

So sort the batch by door, not by feeling. On Shopify the platform has already
decided which is which, and the two mutations behave in opposite ways:

| What you are deleting | What actually happens | Door |
| --- | --- | --- |
| A **metafield definition**, `deleteAllAssociatedMetafields: false` (the default) | The definition goes. Every stored value survives, untyped and hidden from the admin. Recreate the definition and the values reappear. | **Two-way** |
| A **metafield definition**, `deleteAllAssociatedMetafields: true` | Values are deleted asynchronously. Required when the namespace is `$app`. | **One-way** |
| A **metaobject definition** | *"Also deletes all related metafield definitions, metaobjects, and metafields asynchronously."* There is no flag to prevent it. Shopify's merchant docs: it *"can't be undone."* | **One-way** |
| Anything feeding an **external system** — a product feed, an ERP, a partner API | Nothing local breaks. Something outside your store does, on its own schedule. | **One-way, delayed** |

That table is most of the lesson. A batch of "delete the unused custom data"
pull requests is not one kind of change — it is two kinds of change wearing the
same title, and the review has to split them.

## "I searched the project" is a claim about one repo

That evidence, "I searched the project", is the evidence almost everyone gives,
and it is worth looking at honestly, because it is *good* evidence for the thing
it covers and no evidence at all for the thing that matters.

Here is what a grep of the theme genuinely does find:

```bash
# metafields, dotted and bracket forms, both quote styles
grep -rn "metafields\.mm-google-shopping" .
grep -rn "metafields\[.mm-google-shopping.\]" .
# metaobjects, by type
grep -rn "metaobjects\.\|metaobjects\[" .
```

Bracket notation is not optional trivia — Shopify's
[Liquid reference](https://shopify.dev/docs/api/liquid/objects/metafield) requires
it whenever a key collides with a filter name, so `size`, `first` and `last` will
only ever appear in the bracket form. Search both.

Now the consumers that grep structurally cannot reach:

| Consumer | Why the repo cannot see it |
| --- | --- |
| **The theme editor** | Section choices live in [JSON templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates) and `settings_data.json`. A merchant can wire a metafield into a section with **zero commits** to your repo. |
| **Dynamic keys** | `metafields[some_var]` is legal Liquid, and no grep for the key will ever match it. |
| **Shopify Flow** | [Reads metafields as variables and writes them through actions](https://help.shopify.com/en/manual/shopify-flow/getting-started/concepts/metafields), entirely outside any repository. |
| **Installed apps** | Read and write through the Admin API. Not in your repo, not in any repo you have. |
| **Headless frontends and feeds** | Storefront API consumers and external feed, ERP or PIM systems. |

And the fact that makes all of this matter: **Shopify has no "where used"
button.** `metafieldsCount` tells you how many values exist, not who reads them.
`Metafield.reference` resolves pointers going *out*, never in. There is no
platform feature that answers "what breaks if this disappears", and the admin's
own advice is manual — go and check whether it is connected to a block or section
in your live theme.

So the honest phrasing of that finding is: *"nothing in this repository reads
it."* That is true, useful, and not the same sentence as *"nothing reads it."*

## Why the Google Shopping one was the right one to stop on

The instinct picked the single item in the batch with a consumer outside the
building, and the timing is what makes it nasty.

Google Merchant Center expires product data on a **30-day** clock:
*"All products expire from your Merchant Center account 30 days after the last
refresh."* Shopify's own Google & YouTube channel documentation says the same
thing from the other side — it syncs automatically inside that window
*"to avoid account suspension or loss of product data."*

Follow the sequence through:

1. Tuesday: the field that populates a feed attribute is deleted. Nothing breaks.
   The store looks fine. The pull request is closed and forgotten.
2. For up to a month, already-submitted product data keeps serving.
3. Items start getting disapproved as data goes missing. Required attributes are
   not a suggestion: without them,
   [Google says](https://support.google.com/merchants/answer/7052112) your product
   *"won't be able to serve in ads and free listings."*
4. Somebody notices Shopping traffic is down. Nobody connects it to a cleanup
   commit from five weeks ago.
5. The fix is not `git revert`. It is a re-review at Google, which
   [*"typically take up to 3-7 business days"*](https://support.google.com/merchants/answer/13693195),
   with an escalating cool-down if the re-review fails.

Which gives the sentence worth carrying out of this lesson:

> **Reversible is not the same as recoverable.** You can undo the commit in
> thirty seconds and still lose a month of Shopping traffic and a week of review
> queue.

One honest caveat, and it strengthens the point rather than weakening it. The
`mm-google-shopping` namespace is well known across the Shopify ecosystem, and
Shopify does not document it anywhere on shopify.dev or help.shopify.com. There
is no page to look it up on. That is *precisely* why "did we create this?" was
the right question: the platform was never going to answer it for you.

## What would actually count as evidence

Three checks, in increasing cost. Most deletes need only the first.

**1. Ask the platform who made it.** For metaobjects this is solved and almost
nobody knows it. The `Metaobject` and `MetaobjectDefinition` objects carry
`createdByApp` and `createdByStaff`:

```graphql
query {
  metaobjectDefinitionByType(type: "some_type") {
    name
    createdByApp { title }
    createdByStaff { name }
  }
}
```

That query answers the question outright, with no guessing and no grep.

For **metafield definitions** it does not exist — there is no `createdBy` field
on `MetafieldDefinition` at all. The only ownership signal is the namespace:

- `app--<id>…` or `$app` → an app owns it, definitively.
- `shopify--…` or a [standard definition](https://shopify.dev/docs/apps/build/metafields/list-of-standard-definitions) → Shopify controls the shape.
- **Anything else** → merchant-owned, which means *anyone*: a staff member, us, a
  client, or an app that predates reserved namespaces. Proves nothing.

Also worth knowing, because it explains a lot of the junk: when an app is
uninstalled, Shopify deletes its definitions and *temporarily retains the values
without a definition*. Those orphaned, definition-less metafields cluttering the
admin are often the fossil of an app somebody removed years ago — not a mistake,
and not yours to clean up in a hurry.

**2. Count it instead of feeling it.** `metafieldDefinition { metafieldsCount }`
gives you the number of values. A
[bulk operation](https://shopify.dev/docs/api/usage/bulk-operations/queries) gives
you the non-null ones across all 12,000 products. "Zero values on every product"
is an argument. "I looked and did not see it" is not.

**3. For anything expensive, prove it with runtime data.** This is what Meta's
dead-code system does, and their write-up is the best answer to "how would you
ever know": it combines a static dependency graph with **operational logs of
actual usage**, plus a textual-reference fallback, specifically because static
analysis cannot see dynamic invocation. Five years in, it has automatically
deleted **over 100 million lines of code** across 370,000 change requests.

Read that number the right way. Meta is the most aggressive deleter in the
industry *and* spends most of the effort on proving unused before removing. Those
are not opposite instincts. They are the same discipline.

## The other direction: scaffolding you did create

The same session had the mirror image of this, and putting them side by side is
the point. The lead, on a signup flow being moved out of a bolted-on tool and into
the main application:

> "It also cleaned up a ton of the stuff that we had as technical debt for the
> pre-launch. We have a Google worksheet. We need to create accounts for people.
> We need to transfer studios. None of that is supported anymore, and we can just
> go ahead and rip it out too. So it should be like a massive delete and cleanup."

Every check in this lesson passes instantly on that one. The team created it.
Everyone knows why: there was no signup flow, so accounts were made by hand from a
spreadsheet. Everyone knows the purpose ended, because the new code path does it
automatically. In Chesterton's words, these are *purposes which are no longer
served*, and he is explicitly fine with removing them.

> **Provenance cuts both ways.** "We made it" is the strongest argument for
> deleting something, not just the weakest argument against.

The practical version: **pre-launch scaffolding has an expiry date, so write the
date down when you build it.** The manual spreadsheet, the seed script, the
temporary admin page, the "just for the migration" metafield. Each one is a
two-way door on the day you build it and a permanent fixture six months later,
once somebody has quietly started depending on it. A ticket that says *"delete
the handoff spreadsheet path once signup ships"*, opened the day you build the
spreadsheet path, costs nothing and is the difference between a massive delete
and a haunted codebase. Martin Fowler makes the same argument about
[feature toggles](https://martinfowler.com/articles/feature-toggles.html) —
treat them as inventory with a carrying cost and add the removal task at the same
time you add the toggle.

## Five things worth copying

- **Run the provenance query before you open the pull requests**, not during
  review, and put the result in the description. It turns twenty review
  conversations into one table.
- **Whoever raises the doubt clears it.** A reviewer who blocks a delete on
  "are you sure?" and walks away has produced a stalled pull request, not a
  safeguard.
- **Split the pull request by door type.** Metafield definitions with the default
  flag in one PR, metaobject definitions in another. The first is a skim; the
  second deserves a name, a provenance check and a value count per definition.
  This is the same argument as
  [Refactoring in Small Steps](refactoring-in-small-steps) — a reviewer can say
  yes to a small homogeneous change and cannot say yes to a mixed bag.
- **Stores with scattered custom data are the worst case, and you usually know
  which ones they are.** When a single feature reads from several metaobjects,
  several file references, one main metafield and dozens of others, "I searched
  and it is unused" is a weaker claim than usual, because the reference may be
  assembled at runtime from three places. The structural fix is in
  [Bad Data Outlives the Migration](bad-data-outlives-the-migration); the
  review-time fix is to count values before deleting anything.
- **Know which definitions are code-managed.** If a CI/CD process creates your
  metafield definitions, they come back on the next deploy, and an argument about
  deleting them by hand is an argument about nothing.

## Try it yourself

1. **Run the provenance query.** Pick any metaobject definition in a store you
   have access to and query `createdByApp` and `createdByStaff` on it. Ten
   seconds, and you now know a thing about your store that a grep would never
   have told you.
2. **Break your own grep.** Find a metafield used in a live theme, then search the
   repo for its key in the dotted form only. If the theme uses bracket notation or
   a section setting, your search comes back clean on something that is very much
   in use. That silence is the failure mode.
3. **Sort a real batch by door.** Take the last cleanup PR you opened or reviewed
   and label each deletion two-way or one-way using the table above. If they are
   not all the same, split the PR.
4. **Date one piece of scaffolding.** Find something temporary in a repo you work
   in — a seed script, a manual step, a migration-only field — and open the ticket
   that deletes it, today, with the condition that releases it written in the
   body.
