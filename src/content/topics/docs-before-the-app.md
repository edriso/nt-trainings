---
title: Docs Before the App
description: A client will ask twenty questions a day. Eighteen are answerable in writing — build for those before you build a tool.
emoji: 📖
order: 28
status: learned
session: 17
date: 2026-08-17
tags: [documentation, client-work, tooling]
resources:
  - title: Yagni — Martin Fowler
    url: https://martinfowler.com/bliki/Yagni.html
    note: The four costs of building a feature you only think you need — build, delay, carry, repair.
  - title: "Eliminating Toil — Google SRE Book"
    url: https://sre.google/sre-book/eliminating-toil/
    note: The six-part definition of toil. Answering the same question by hand ticks every box.
  - title: Direct Manipulation — Nielsen Norman Group
    url: https://www.nngroup.com/articles/direct-manipulation/
    note: What Shneiderman named in 1983, plus the list of tasks where direct manipulation is the wrong answer.
  - title: Diátaxis — a documentation framework
    url: https://diataxis.fr/
    note: Four kinds of document (tutorial, how-to, reference, explanation) and why mixing them makes docs unreadable.
  - title: Metafield definitions — Shopify
    url: https://shopify.dev/docs/apps/build/custom-data/metafields/definitions
    note: What a definition buys you over a raw JSON blob — validation, and an admin UI that is not a text box.
  - title: Access scopes — Shopify Admin API
    url: https://shopify.dev/docs/api/usage/access-scopes
    note: The read/write split. `read_products` is the whole safety story for a client-facing helper.
  - title: Metafields overview — Shopify
    url: https://shopify.dev/docs/apps/build/custom-data/metafields
    note: The types Shopify supports natively, worth reading before you decide your data has to be JSON.
---

## The one rule to remember

> **Answer the question in writing before you build the thing that answers it.**

The longest discussion in this session was about a client being onboarded that
morning, and what they were about to ask. One framing carried the whole argument:

> "There will be 20 questions a day, 18 of which are super easy to answer, two of
> which should get to us. We'll get all 20 if we don't give them something soon. And
> if we start building an app, then we'll be building an app for 800 questions."

That is a **four-week estimate against a two-day one** — and the two-day version
serves eighteen of every twenty questions. The instinct to reach for an app is
strong, so it is worth being precise about why the docs come first.

## The costs an app has and a docs folder does not

Fowler's [Yagni](https://martinfowler.com/bliki/Yagni.html) names four costs for
anything you build on a *presumption* about what will be needed:

| Cost | The custom admin-tool version of it |
| --- | --- |
| **Build** | Four weeks of scaffolding, UI and click-through |
| **Delay** | Four weeks of not doing the tickets that already exist |
| **Carry** | Every future change to the data model now also changes the app |
| **Repair** | The 800 questions you guessed turn out to be the wrong 800 |

A `docs/` folder has a real build cost and essentially none of the other three.
Better than that: **it tells you what to build.** After two weeks of real questions
you know which three answers people actually need, and *that* is a specification
instead of a guess.

The other frame worth having is Google SRE's definition of
[toil](https://sre.google/sre-book/eliminating-toil/) — work that is "manual,
repetitive, automatable, tactical, devoid of enduring value, and scales linearly as
a service grows." Answering "how do I upload a new image?" by hand for the fourth
time ticks every one of those boxes, including the last: it gets worse in direct
proportion to the client's catalogue. Writing the answer down once is the cheapest
de-toiling move available, and unlike an app it is finished the day you publish it.

## First, check whether the format is the problem

Before writing documentation for something hard, check whether the hard part is
fixable. The sharpest line in the session came from the person who works on the
configuration system every day:

> "I tried to make a new product and it was so difficult to do it, since all the
> information is in the meta field which is JSON, and it's even hard for me who is
> working on that every single day."

**A format that defeats its own daily expert is not a documentation problem.** No
amount of writing fixes a text box that wants hand-authored JSON with correct file
references. So the order of operations is:

1. **Can the platform type it?** In Shopify, a
   [metafield definition](https://shopify.dev/docs/apps/build/custom-data/metafields/definitions)
   turns a free-text metafield into a typed one — with validation and an admin UI
   that is not a raw text area. A `json` metafield with no definition is the worst
   of both worlds: structured data with none of the structure enforced.
2. **Can a reference replace it?** A `file_reference` or `list.file_reference`
   metafield means the client picks a file in the admin instead of typing a URL into
   a JSON string and getting it subtly wrong.
3. **Only then, document what is left.** Whatever genuinely cannot be typed is what
   your docs are for.

Doing this in the other order is how teams end up with a beautiful guide to a form
nobody should have had to fill in.

## The disagreement, written out

Three positions went around the room and none of them was wrong.

**Ship a corpus, not a UI.** A client-facing repo — or a shared Drive folder, since
they probably will not use a forge — holding an instructions file and a `docs/`
folder, plus a **read-only** token for products and metafields. The client asks
their own assistant first: *"I'm adding a new product, can you tell me what the
configuration JSON would look like?"*

**For the configuration itself you still need hands.** Positioning an overlay on a
product image is not a thing you describe in prose. And the person arguing this had
the receipt — when a designer sent one product back four times over email before it
was right, they built a small internal tool and got it right first try:

> "I built a small application, did it in five minutes and I just configured it."

They also wanted the comparison done properly before committing: a platform app, a
small web tool, or the docs-plus-assistant route. All three, benchmarked, then a
recommendation.

**The third position is the one that resolves it:**

> "If the design team are the ones who are responsible for positioning, then you can
> get a version of what you are describing."

The answer depends on **who owns the spatial decision**. If the designer hands over
a correctly positioned asset, the client's remaining job is textual and the docs
route wins. If the client is doing the positioning, they need to see it, and the
visual tool wins.

## The middle ground has a name, and it is from 1983

This is not a matter of taste. It is a known property of the task, named by **Ben
Shneiderman in 1983** in *Direct Manipulation: A Step Beyond Programming
Languages* — the idea that some work belongs in an interface where you act on a
visible object with physical, incremental, immediately reversible actions. Dragging
an overlay into place is the textbook case. Describing the same operation in prose,
in JSON, or to an assistant is fighting the medium.

And the same literature is clear about where direct manipulation *loses*. The
[NN/g summary](https://www.nngroup.com/articles/direct-manipulation/) lists exactly
the other case: it breaks down with **many objects** and with **repetitive tasks**,
where experts are faster with commands and scripts. Nobody wants to drag overlays
onto four thousand products.

So the split is decidable in advance:

| The task | The right tool | Why |
| --- | --- | --- |
| Position an overlay on one new asset | A tiny visual tool | Spatial, needs the eye, reversible — direct manipulation |
| Configure 4,000 products | A generator or bulk import | Repetitive at a scale hands cannot reach |
| "How do I add a new product?" | Docs | It is a question, not a task |
| "This one product looks wrong" | A person | Judgement, and it is the two out of twenty |

Notice that the five-minute tool and the docs folder are **answers to different
rows**. The team was not disagreeing about the strategy; it was disagreeing about
which row the client's work lands in. Which is why the third question — who owns
positioning? — settles it.

## Write for a reader you can name

A teammate spent the weekend rebuilding a conference talk, and the technique they
landed on transfers directly. Instead of walking through the product feature by
feature, they walk two named people through it: a computer-science student taking a
field-biology course who needs to identify something from her own photos, and a
graduate researcher who needs the site to write up a proposal.

Docs written for "the client" are vague and end up as a feature list. Docs written
for *"the person who has a new product, a folder of images, and no idea what a
metafield is"* have a table of contents that writes itself — and they tell you which
of the eighteen easy questions comes first.

If you want a structure rather than inventing one, [Diátaxis](https://diataxis.fr/)
is the framework worth stealing. Its core claim is that four different kinds of
document get written into the same file and ruin each other:

| Kind | Answers | For a client onboarding |
| --- | --- | --- |
| **Tutorial** | "Walk me through it once" | Add one product, start to finish, with a real example |
| **How-to** | "I have a specific job" | "Add a new accessory to an existing product" |
| **Reference** | "What are the fields?" | Every metafield, its type, and what breaks if it is wrong |
| **Explanation** | "Why is it like this?" | Why configuration lives in metafields at all |

Most "documentation is useless" complaints are one of these four wearing another
one's clothes — usually a reference table where someone needed a how-to.

## Read-only, and a human applies it

The safety pattern in this discussion deserves naming, because it is reusable far
beyond one client:

> "We could do a dev thing that didn't just read products and metafields, and then
> the output could be a JSON file that they copy into the metafield."

**Read access to look, no write access to act, and a human performs the last step.**
Three things fall out of it:

- **The blast radius is a paste.** Nothing reaches the catalogue without a person
  putting it there. Compare that with an integration holding `write_products` on a
  live store.
- **The copy-paste step is the review.** It is not friction to be optimised away
  later; it is the only moment anyone looks at the output. The person proposing this
  was explicit that he does not trust the output completely — this is what that
  distrust looks like when it is designed in rather than worried about.
- **Scopes are the enforcement.** Not a prompt, not a policy — Shopify's
  [access scopes](https://shopify.dev/docs/api/usage/access-scopes). A token with
  `read_products` and no write scope cannot be talked into writing.

If the helper later earns write access, that is a decision with evidence behind it.
Starting there is a decision with hope behind it.

## What docs actually cost

The honest counter-argument, because there is one: **documentation rots, and rotten
docs are worse than none.** A wrong answer that reads authoritatively costs more
than a missing answer, and this got sharper the moment agents started reading docs
and repeating them with total confidence. That failure chain is written up in
[Comments & Code Clutter](comments-and-code-clutter) — the same problem, one
directory over.

Three mitigations, all cheap:

- **Docs live next to the thing they describe**, in the same repo, changed in the
  same pull request. Documentation in a separate wiki is documentation that will be
  wrong.
- **A date at the top.** "Last verified 2026-08-17, against theme 4.2" lets a reader
  decide how much to trust it. Nobody can do that with an undated page.
- **One owner per page**, named. Shared ownership of a document means nobody notices
  it is stale.

And the signal that it is finally time to build the tool: **you have written the same
paragraph twice.** Not "someone asked twice" — that is what docs are for. Twice
*written* means the docs cannot hold the shape of the answer, which is precisely what
the overlay-positioning problem ran into.

## Four things worth copying

- **Predict the first question and answer it before handover.** A client team that
  is loosely platform-literate is the worst case for support volume — enough
  knowledge to try things, not enough to finish them. The question predicted in
  this session was a how-to ("how do I add content sections below the fold to only
  *some* products?"), not a feature request. That is a page, not a ticket.
- **Time-box the comparison instead of arguing it.** The decision taken was a
  two-day exploration of the docs-plus-assistant route ahead of committing to a
  four-week custom app, with one person owning a written comparison of all three
  options. Two days of evidence beats two weeks of opinion.
- **The bulk half is a different problem, and it may already be solved.** Around
  70,000 configurations regenerated from a spreadsheet pipeline, with roughly 4,000
  products getting one for the first time, is the repetitive-at-scale row of the
  table above — and it was done with imports, not an app. What remained was the
  per-product judgement row. Check which row you are arguing about before you argue.
- **A five-minute tool is not a throwaway anecdote.** Four rounds of back-and-forth
  versus one shot is a measured comparison, and it is the strongest argument in the
  room that some jobs need a visual tool. "Do not build the app" is a default, not a
  law.

## Try it yourself

1. **Count your own twenty.** Scroll back through the last week in a client channel
   and tally the questions. What fraction were answerable in one paragraph? That
   fraction is your case for a docs folder.
2. **Write one how-to.** Pick the question you have answered most often and write it
   as a how-to: the job in the title, numbered steps, one real example, and a "last
   verified" date.
3. **Type one metafield.** Find a `json` metafield in a store you work on and check
   whether it has a
   [definition](https://shopify.dev/docs/apps/build/custom-data/metafields/definitions).
   If not, work out which native type or `file_reference` would replace part of it.
4. **Sort five tasks into the table.** Take five things a client will need to do and
   put each in one row of the four-row table above. Any task you cannot place is a
   task nobody has thought through yet.
