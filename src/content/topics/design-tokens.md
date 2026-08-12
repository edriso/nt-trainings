---
title: Design Tokens & Theming Many Stores
description: Why "accent-20" breaks the moment you add a second brand, and the one extra layer that fixes it.
emoji: 🎨
order: 22
status: learned
session: 14
date: 2026-08-12
tags: [design-systems, css, theming, tokens]
resources:
  - title: "Design Tokens specification reaches first stable version — W3C"
    url: https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/
    note: The announcement, October 2025. Before this the format was a moving target; now it is worth building on.
  - title: "Design Tokens Community Group — specification repo"
    url: https://github.com/design-tokens/community-group
    note: The spec itself, including the alias syntax. Read the format module rather than any tool's docs.
  - title: "Naming Tokens in Design Systems — Nathan Curtis"
    url: https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676
    note: The reference text on token naming. Long, but the taxonomy section alone will settle most arguments.
  - title: "Input settings — Shopify theme architecture"
    url: https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings
    note: Read the color_scheme_group section. Shopify built a semantic token layer into the platform and called it something else.
  - title: "Using CSS custom properties — MDN"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties
    note: How the browser half works, including the fallback syntax that makes a missing token harmless.
  - title: "You Don't Need All Those Tokens (Yet)"
    url: https://www.designsystemscollective.com/you-dont-need-all-those-tokens-yet-df9e78a157d2
    note: The best case against building three layers on day one. Read it before you tokenise everything.
---

## The one rule to remember

> **Name a token for the job it does, not for the value it holds.**

Sara hit this exactly in the session, and it is worth quoting because the problem
is completely clear from the question:

> The announcement bar in two of our stores is set to a variable like
> `accent-20`. In the third store it's not necessarily `accent-20`, it's
> `accent-40`. So I think we still need a way to differentiate — okay, this is
> the variable that's going to go for this particular store. It's not one to one.

Nobody in the room had an answer. There is a good one, it is a solved problem in
design systems, and the fix is smaller than it looks.

## Why `accent-20` breaks

`accent-20` is a **position on a colour scale**. It says *the 20% step of the
accent ramp*. It says nothing about what it is for.

So when the section Liquid says "the announcement bar background is `accent-20`",
it has quietly hard-coded a design decision from one brand into shared code. Add
a brand whose accent is lighter and needs the 40% step, and there is no clean
place to put that fact. Your options are all bad: fork the section, add an `if`
per store, or override the colour further down the cascade and hope.

The missing piece is a name for the **role**:

```css
/* Store A tokens */          /* Store C tokens */
--announcement-bar-bg:        --announcement-bar-bg:
  var(--accent-20);             var(--accent-40);
```

Now the section only ever says `var(--announcement-bar-bg)`. Which step of the
ramp that resolves to is a per-store fact, living in one per-store file, and the
shared code never learns about it. That is the whole trick.

## The three layers

This is the standard shape, and it is worth knowing the vocabulary because every
tool uses it. The
[Design Tokens Community Group](https://github.com/design-tokens/community-group)
spec — which reached
[its first stable version](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/)
in October 2025 — calls the pointer from one token to another an **alias**,
written `{group.token}`.

| Layer | Also called | Example | Answers |
| --- | --- | --- | --- |
| **Primitive** | global, base, ramp | `accent-20`, `blue-800`, `space-4` | *What values does this brand own?* |
| **Semantic** | alias, role, decision | `surface-raised`, `text-muted`, `announcement-bar-bg` | *What is this value for?* |
| **Component** | scoped | `button-primary-bg`, `card-border` | *What does this one component use?* |

Only the primitive layer is allowed to contain an actual colour. Everything above
it is a reference. That gives you one property worth the whole exercise: **you
can swap the bottom layer and nothing above it changes.** That is what a second
brand is. It is also what dark mode is, which is why teams that did tokens for
theming get dark mode nearly free.

The direction of dependency is the part people get wrong. A primitive must never
know what uses it. `accent-20` is not "the announcement bar colour" — it is the
20% step, and it may be used in nine places or none.

## Shopify already built this and called it something else

Worth knowing before writing any custom variable plumbing, because the platform
ships a semantic layer natively.

Shopify's `color_scheme_group` setting builds named **colour schemes**, and each
scheme has a required `role` object. The roles are, per
[Shopify's own docs](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings):

`role.background`, `role.text`, `role.primary_button`, `role.secondary_button`,
`role.primary_button_border`, `role.on_primary_button`, `role.links`,
`role.icons` — and more.

Read that list again with the table above in mind. `background`, `text`,
`links`, `on_primary_button` are **semantic tokens**. They are names for jobs.
Merchants then pick a scheme per section with the `color_scheme` setting, and one
theme can define many schemes.

There is also `color_palette` in `settings_schema.json` — 2 to 20 named colours,
one palette per theme, referenced from other settings as
`{{ settings.colors.primary }}`. That is the primitive layer.

So the platform's intended shape is exactly the three-layer model:

```
color_palette          →  primitives   (this brand's colours)
color_scheme + role.*  →  semantics    (background, text, links)
section settings       →  which scheme this section uses
```

If you are writing per-store `if` statements to pick colours, that is usually a
sign of skipping the scheme layer and reaching for the palette directly.

## Where the layers go too far

The counter-argument is real, and worth taking seriously before you tokenise
everything you own. Every layer you add is a name somebody has to learn, a
lookup somebody has to follow, and a decision somebody has to maintain. The
common failure mode is not too few tokens — it is **a token nobody can find**, so
they give up and write `#1a1a1a`.

The sharpest version of this argument is Han's, and it is worth knowing because
it tells you exactly *which* tokens deserve a semantic layer:
**semantic tokens earn their keep where the value changes with context but the
meaning does not.** Colour is the clearest case — a brand swap or dark mode
changes every value while "the announcement bar background" keeps meaning the same
thing. Spacing usually is not: dark mode does not change your gutter. So
`--space-4` can stay a primitive and the component can own its own spacing logic,
while colour gets the full role layer.
([the case for waiting](https://www.designsystemscollective.com/you-dont-need-all-those-tokens-yet-df9e78a157d2))

That test happens to point straight at our problem. The thing varying across our
stores *is* colour, which is exactly where the layer pays for itself.

Two more honest limits:

- **Component tokens are usually premature.** `button-primary-bg` earns its
  keep when the button genuinely diverges from the general surface rules. Until
  then it is an alias to an alias.
- **A semantic name you cannot agree on is a warning, not a naming problem.** If
  three people cannot say whether something is `surface-raised` or
  `surface-overlay`, the design does not have a rule there yet. Adding a token
  freezes the confusion in place.

And Han's asymmetry is the reason to lean late rather than early: *"Adding a
semantic token later, when you understand your system, is easy. Removing one that
was wrong from the start is hard."* So the practical test is **add a semantic
token the second time a value is used for the same reason** — first use, inline
the primitive; second use with the same intent, name the intent.

## The recipe for our actual problem

Sara's question, answered as a checklist:

1. **List the roles, not the colours.** Walk the storefront and write down the
   jobs: announcement bar background, announcement bar text, page background,
   card surface, body text, muted text, link, primary button, button label.
   Ten to twenty names for a storefront is normal.
2. **Keep the role names identical across every store.** This is the rule that
   makes the shared code work. Same names, different values.
3. **Give each store one file of primitives** — its actual ramp — and one file
   mapping every role to a primitive. Only this second file differs per store,
   and the diff between two stores is now readable in one screen.
4. **Ban primitives from sections.** A section that says `var(--accent-20)` is a
   bug even when it renders correctly, because it is the thing that will break
   on store four. Sections reference roles only.
5. **Ship the fallback.** `var(--announcement-bar-bg, var(--accent-20))` means a
   store that has not defined the role yet still renders, instead of rendering
   transparent. ([MDN on fallbacks](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties))

Step 4 is the one that needs enforcing, because it is invisible in review. A
grep in CI for primitive names inside section files is about five lines and
catches it permanently — the same "push the mechanical check upstream" move from
[Code Review](code-review).

## Field notes from our stores

**The announcement bar, concretely.** We run several storefronts from one theme
codebase. In two of them the announcement bar background resolves to `accent-20`;
in a third the same visual role wants `accent-40`. There is nothing wrong with
either value — the bug is that the section knows the number. Introducing one role
token (`--announcement-bar-bg`, or a per-store colour scheme) removes the
question permanently, and it removes it for the next store too, which is the real
return.

**Branding colours landed before the roles did.** Sara added the third store's
brand colours and fonts early to show the client something, which was the right
call for the demo and is exactly when this problem appears: primitives arrive
first, and the role layer only gets built when a second brand disagrees. Worth
naming as a pattern rather than a mistake — the second brand is what *reveals*
which names were roles and which were values.

**The same idea, one level up.** Keeping shared code brand-agnostic and pushing
per-brand facts to the edges is the same architectural instinct as the multi-site
question in
[Subdomains, Subfolders & Headless CMS](subdomains-and-headless-cms): one system,
many surfaces, with the differences held in as few places as possible.

## Try it yourself

1. Grep a section file for primitive names — anything matching a scale like
   `accent-`, `-100`, `-800`. Every hit is a design decision hard-coded into
   shared code. Count them; that number is your migration.
2. Take the announcement bar. Add one role token, point the two existing stores
   at their current value and the third at its own, and confirm all three render
   unchanged. Nothing should look different — that is the win.
3. Open a store's theme editor and find the colour scheme picker. Read
   [the `color_scheme_group` docs](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings)
   and map each `role.*` name to a CSS variable you already have. If a role has
   no matching variable, you have found a name you were missing.
4. Pick a component you think needs its own tokens. Try to describe each one
   using only semantic names instead. If you can, you just avoided a layer.
