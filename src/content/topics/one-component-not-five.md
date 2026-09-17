---
title: One Component, Not Five
description: Hand an AI tool a design and it will rebuild a component you already have, off by one padding value. The fix is not a better prompt — it is making the component findable.
emoji: 🧱
order: 33
status: learned
session: 20
date: 2026-09-17
tags: [components, design-system, ai, refactoring]
resources:
  - title: The Wrong Abstraction — Sandi Metz
    url: https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction
    note: The strongest argument against consolidating too eagerly, and the one-line test for whether you have merged two things that were not the same.
  - title: The WET Codebase — Dan Abramov (transcript)
    url: https://www.deconstructconf.com/2019/dan-abramov-the-wet-codebase
    note: The three real costs of an abstraction, including the social one nobody writes down.
  - title: AHA Programming — Kent C. Dodds
    url: https://kentcdodds.com/blog/aha-programming
    note: '"Avoid Hasty Abstractions", and the most balanced version of this argument — he has been burned by both sides.'
  - title: Atomic Web Design — Brad Frost
    url: https://bradfrost.com/blog/post/atomic-web-design/
    note: Where atoms, molecules and organisms come from. The vocabulary is the point, because you cannot search for a thing you cannot name.
  - title: Design Systems 101 — Nielsen Norman Group
    url: https://www.nngroup.com/articles/design-systems-101/
    note: The component-library versus pattern-library distinction, and an honest list of what a design system costs to keep.
  - title: Figma MCP server — tools and prompts
    url: https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/
    note: '`search_design_system` exists so an agent can "reuse existing design system elements rather than creating new ones from scratch". That is our bug, named by the vendor.'
  - title: Figma Code Connect
    url: https://developers.figma.com/docs/code-connect/
    note: Maps a Figma component to the real component in our repo, so a tool returns our code instead of inventing some. Check the plan requirement before planning around it.
  - title: Storybook — AI and MCP
    url: https://storybook.js.org/docs/ai
    note: The components manifest and the docs toolset, whose stated job is helping an agent reuse what you already built. Free, in your repo, and preview-stage.
  - title: Rule of three (computer programming)
    url: https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)
    note: Two copies is not a problem, three is. Attributed to Don Roberts and popularised by Fowler's Refactoring.
  - title: StranglerFigApplication — Martin Fowler
    url: https://martinfowler.com/bliki/StranglerFigApplication.html
    note: How to consolidate without a freeze and without a big-bang rewrite.
  - title: jscpd — copy/paste detector
    url: https://github.com/kucherenko/jscpd
    note: The tool that actually detects near-duplicates. `--baseline` plus `--fail-on-new-clones` is the setting for a codebase that already has some.
  - title: Knip
    url: https://knip.dev/
    note: Finds the component files nobody imports any more — the cleanup half of a consolidation pass.
---

## The one rule to remember

> **A component that cannot be found will be rebuilt. Discovery is the feature,
> not the component.**

Every fix in this lesson is a way of answering one question faster than a person
or a model can rebuild the thing: *does this already exist here?*

## Two people described the same bug

One developer, on why he was building a shared component library:

> "The thing with AI is, you give it a Figma design and it will rebuild the same
> component that was existing somewhere else, even if they just had a small
> difference of, let's say, padding or background. So I did some consolidation to
> bring those into one component that can be shared across."

Another, describing the same thing happening to him that week:

> "I was doing a subnav collection page and it had a heading, description and
> breadcrumbs, and I sent it to Claude, explained everything, how it should work.
> And it basically **didn't find the section that is actually on top of the
> collection**. It built a new one that is worse."

Read those two carefully, because they are not quite the same complaint and the
difference is the whole lesson.

The first is a *generation* problem: given a picture, the tool writes code. The
second is a **search** problem: the tool looked, did not find, and so it built. He
had explained what he wanted correctly. The prompt was not the failure. The failure
was that a correct description of an existing component did not resolve to that
component.

And it is not an AI problem. A new developer does exactly the same thing, for
exactly the same reason — someone in their first week said so in the same standup,
before they had written a line:

> "Making sure that I'm not creating new classes when they already exist."

Which means the fix is not "prompt better". It is the same fix that has always
worked for humans: **make the thing findable and name it something searchable.**

## What the lint actually catches

The answer in the room was reasonable and deserves a straight check:

> "We have a pretty good lint process for some of that… but [two of us] will do
> code reviews, I'll be around as well."

The second half is doing all the work, and it is worth saying why, because it
changes where we should spend effort.

**No linter detects a duplicate component.** ESLint is per-file by design and has
no cross-file similarity model. Core ESLint's duplicate rules are `no-dupe-args`,
`no-dupe-keys`, `no-duplicate-imports` and friends — all syntactic, all within one
file. `eslint-plugin-react` ships over a hundred rules and the only one with
"duplicate" in the name is `jsx-no-duplicate-props`, which is about props on a
single element.

`eslint-plugin-tailwindcss` is genuinely useful and genuinely not this. Its nine
rules normalise class strings: consistent ordering, canonical spellings,
shorthands, contradicting classnames, unknown classnames. (On Tailwind v4 it needs
`settings.tailwindcss.cssConfigPath` pointing at your CSS entry, since there is no
config file to read.) What that buys you is real but indirect — **two near-identical
components become textually comparable**, which is what a duplicate detector needs.

Here is the honest tool table:

| Tool | Catches | Does not catch |
| --- | --- | --- |
| ESLint + `eslint-plugin-tailwindcss` | Unknown classes, contradicting classes, class order | That this component already exists |
| **jscpd** | Near-duplicate blocks across files, including renamed and near-miss clones | Semantic duplicates that share no tokens |
| **Knip** | Component files and exports nobody imports any more | Duplication itself |
| **Code review** | Everything above, when the reviewer happens to know | Whatever the reviewer has not seen |

[jscpd](https://github.com/kucherenko/jscpd) is the one worth adding. It is a
copy-paste detector using Rabin-Karp with language-aware tokenisation, it reports
SARIF so findings land in GitHub code scanning, and crucially it has the flags for
a codebase that already contains duplicates:

```bash
jscpd src --min-tokens 70 --reporters console,sarif
jscpd src --baseline .jscpd-baseline.json --fail-on-new-clones
```

Record today's duplication as a baseline, then fail CI only on **new** clones. You
do not have to fix the backlog to stop it growing, which is the same argument as
[Refactoring in Small Steps](refactoring-in-small-steps). Expect false positives:
two legitimately similar sections will trip it, and that is the cost of the check.

## Make the library findable to the machine

This is the part that actually solves the search problem, and the tooling caught
up recently enough that most people have not noticed.

**Storybook's components manifest is the strongest option, and it is free and
lives in the repo.** Storybook now generates JSON manifests describing every
component and story, and exposes them over MCP. The stated purpose of its docs
toolset is exactly our bug:

> "The docs toolset provides tools that **help the agent reuse components from
> your Storybook when generating UI**… This helps ensure the generated UI is
> consistent with your existing design system and uses the components you've
> already built."

The agent calls `docs-list` for the catalogue and `docs-show` for a component's
props and examples. Storybook even publishes the `CLAUDE.md` text to pair with it:
*"always use the MCP tools to access Storybook's component and documentation
knowledge before answering or taking any action."* Limits to know before planning
around it: the API is preview-stage, and the components manifest is generated only
for React, `@storybook/angular-vite` and `@storybook/vue3-vite` today.

**On the Figma side the mechanism is Code Connect**, which maps a Figma component
to the real component in your repo, so Dev Mode and the MCP server return *"the
true-to-production code snippets from your design system instead of autogenerated
code examples."* The Figma MCP server then exposes `get_code_connect_map`, and one
tool whose description could have been written from that standup:

> **`search_design_system`** — "Searches across all connected design libraries to
> find components, variables, and styles matching a text query. **Returns matching
> assets so the agent can reuse existing design system elements rather than
> creating new ones from scratch.**"

Two caveats before anyone plans a sprint around it. Code Connect is **plan-gated**
— the docs state it needs a Dev or Full seat on the Organization or Enterprise
plans — so check your seats first. And the mapping is maintained by hand: *"when
component APIs change in your codebase, update the corresponding Code Connect
mappings."* Nothing enforces that, so a stale mapping sends the agent at a
component that has moved on.

**And the cheap thing to do today, before any of it.** Write down where the library
lives and the rule that you search it first. In Claude Code that belongs in
`.claude/rules/` with a `paths:` frontmatter entry so it loads only when someone
touches component files, and the procedure ("search the catalogue, use the match,
extend with a variant if it differs only by padding") belongs in a skill, which
loads on use rather than costing context all session.

One honest note on that, from Anthropic's own docs, because it explains why the
two-reviewer rule stays:

> "CLAUDE.md content is delivered as a user message after the system prompt… Claude
> reads it and tries to follow it, but **there's no guarantee of strict
> compliance**."

An instruction raises the odds. A hook is the only hard gate. Review is still the
backstop.

## The counter-argument, and it is a good one

Do not read this lesson as "always extract a shared component". The best-known
essay in the field argues the opposite, and it is right about a different failure.
Sandi Metz, from her RailsConf 2014 talk:

> **"Duplication is far cheaper than the wrong abstraction."**

Her sequence is worth reading in full because everyone has lived it: somebody sees
duplication, extracts it, and is happy. Time passes. A new requirement is *almost*
the same, so somebody adds a parameter and a conditional. Then another. Then:

> "Loop until code becomes incomprehensible… You appear in the story about here,
> and your life takes a dramatic turn for the worse."

Dan Abramov names three costs of an abstraction: **accidental coupling** (fix a bug
in the shared thing and you now own every call site), **indirection** (you promised
one layer, you got five), and the social one that nobody writes down:

> "Nobody really has time to refactor or unwind this abstraction, especially if
> you're a new person on the team… Who wants to be the person who says, let's use
> copy paste here? How long do you think you're going to be on that team?"
>
> "**Easy-to-replace systems tend to get replaced with hard-to-replace systems.**"

Kent C. Dodds calls his version **AHA — Avoid Hasty Abstractions** (an acronym he
credits to Cher Scarlett) and is the most balanced of the three, having been burned
both ways: *"I inherited a codebase that made very heavy use of code duplication and
one time I had to fix a bug in eight different places"* and, in the same codebase,
*"the abstraction was bad and I wished that the code had been duplicated instead."*
His rule: **optimise for change first**, and wait until the commonalities "scream at
you".

The classical version is the **rule of three**: two copies do not need refactoring,
three do. (Attributed to Don Roberts and popularised by Fowler's *Refactoring* —
not, as it is often repeated, to Robert Glass.)

Here is why none of that contradicts building the library. **This failure is the
opposite one.** Metz, Abramov and Dodds are all warning about extracting an abstraction *too
early*, before you understand the cases. We built a correct component, shipped it,
used it — and then failed to *find* it. That is not premature abstraction, it is
lost inventory.

## The one test to apply while merging

What the counter-argument does give us is the rule for the consolidation pass
itself, and it is Metz's, in one sentence:

> **"If you find yourself passing parameters and adding conditional paths through
> shared code, the abstraction is incorrect."**

Print that on the pull request. Two sections that differ only by padding are one
component with a spacing variant. Two sections that need a boolean to decide
whether the breadcrumbs render *above* or *inside* the heading block are two
components wearing one name, and merging them makes the codebase worse than the
duplicate did.

The practical phrasing for review:

| What you had to add to merge them | Verdict |
| --- | --- |
| A design-token value (spacing, colour, size) | Merge. This is what tokens are for — see [Design Tokens](design-tokens) |
| A named variant (`variant="compact"`) with no branching inside | Merge, carefully |
| A boolean prop plus an `if` in the body | Stop. Two components. |
| A second boolean | You already stopped one prop ago |

## Consolidating without a freeze

Nobody can stop feature work to unify components, and they should not try. The
pattern is Fowler's **strangler fig**: new work uses the library from today, old
duplicates migrate as they are touched, and both investment and return arrive
gradually and visibly.

A workable order:

1. **Name and publish the library first**, even if it has three components in it.
   An empty catalogue nobody can search is the current state.
2. **Point the tools at it** — Storybook manifest, the rule file, Code Connect if
   the plan allows.
3. **Baseline jscpd** so new duplication fails CI while the old duplication does
   not.
4. **Migrate on touch.** When a ticket lands in a file with a duplicate, that
   ticket migrates it. [jscodeshift](https://github.com/facebook/jscodeshift) is
   worth learning for the mechanical ones — it wraps recast, so it preserves the
   original formatting and the diff only contains the lines that had to change.
   A reviewable diff is the whole game.
5. **Sweep with Knip** afterwards to find the component files nobody imports any
   more, and delete them. Which is its own conversation — see
   [Don't Delete What You Didn't Create](deleting-what-you-didnt-create).

## Name it so somebody can search for it

The last piece is vocabulary, and it is cheaper than any tool. You cannot search
for a thing you cannot name.

Brad Frost's **atomic design** gives the standard names: atoms (a label, an input,
a button), molecules (small groups working as a unit), organisms (*"relatively
complex UI components… distinct sections of an interface"*), templates and pages.
That heading-plus-description-plus-breadcrumbs block is a textbook **organism**, and
Frost's line about them is the argument for the whole library: *"Organisms
demonstrate those smaller, simpler components in action and serve as distinct
patterns that can be used again and again."*

One distinction from NN/g that will save an argument later: a **component library**
holds individual UI elements; a **pattern library** holds groupings and layouts.
Most "we need a component library" conversations are actually about patterns, and
mixing the two in one catalogue is how catalogues get hard to search.

And their warning, which is the reason this is a habit rather than a project:

> Design systems "require continuous maintenance and oversight to ensure they don't
> become outdated, obsolete, or **overcrowded with redundant entries**."

A catalogue with two Card components in it is worse than no catalogue, because now
searching returns the wrong answer confidently.

## Five things worth copying

- **A library announced in a standup is still undiscoverable.** The reaction in the
  room was *"kudos for just nonchalantly saying 'oh, I just made this new component
  library we can all use'."* Real praise, and also the warning: the next step after
  building it is not more components, it is a page that lists them.
- **Do the naming pass before the crunch, not during it.** The project most likely
  to sprout duplicates is the complicated one under a launch deadline, where every
  new section gets built from a Figma frame in a hurry. That is exactly when nobody
  has time to search first.
- **Your newest developer is the best test of findability.** Someone building UI
  from Figma in their first fortnight will find the existing component or they will
  not. If a person in week one cannot find it, no rule file will help a model. See
  [Onboarding Yourself](onboarding-yourself).
- **Check which Tailwind docs you are quoting.** The much-repeated *"don't use
  `@apply` just to make things look cleaner"* line is from the v3 docs. The v4
  "Managing duplication" page dropped it and argues positively instead, with a
  four-step ladder: a loop if the markup repeats in one place, multi-cursor editing
  if it is a one-off, **a component if it is reused across files**, and custom CSS
  last.
- **The same shape shows up outside components.** A team member proposing to rework
  the header, and a colleague half-remembering that somebody tried it before and
  stopped, is the identical failure: a decision that exists and cannot be found.
  That one is written up in
  [Shopify Templates](shopify-templates-and-the-editor).

## Try it yourself

1. **Run the duplicate detector on a repo you know.** `npx jscpd src --min-tokens 70`.
   Look at the top three results and decide, for each, whether it is one component
   or two. That decision is the skill; the tool only finds candidates.
2. **Try the search test.** Pick a component you know exists, describe it to your
   assistant the way you would describe it to a person, and ask it to build that
   section. Did it find yours? If not, the problem is findability, and now you know
   it for certain.
3. **Apply the merge test to a real pair.** Take two near-duplicate components and
   write out exactly what you would have to add to unify them. If the answer
   contains the word "boolean", leave them alone.
4. **Write the three-line rule file.** Where the library lives, that you search it
   first, and what to do when a design differs by one padding value. Ten minutes,
   and it is the highest-leverage thing on this list.
