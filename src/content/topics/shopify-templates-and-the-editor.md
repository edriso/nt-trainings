---
title: Shopify Templates & Why the Editor Can't See Your Page
description: The page exists, the code exists, the link works — and the theme editor still won't show it. Here is the actual reason.
emoji: 🧩
order: 23
status: learned
session: 14
date: 2026-08-12
tags: [shopify, themes, templates, debugging]
resources:
  - title: "Change your theme's templates — Shopify Help Center"
    url: https://help.shopify.com/en/manual/online-store/themes/theme-structure/templates
    note: "The one sentence that answers this whole lesson is in here: assignable templates come from the live theme only."
  - title: "Templates — Shopify theme architecture"
    url: https://shopify.dev/docs/storefronts/themes/architecture/templates
    note: JSON versus Liquid templates, and the 1000-JSON-template ceiling.
  - title: "Alternate templates — Shopify theme architecture"
    url: https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates
    note: The naming rule (name.suffix.json) and the rule that you can't replace a default template with an alternate one.
  - title: "JSON templates — Shopify theme architecture"
    url: https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates
    note: Why a section needs a preset to be addable in the editor, and why a template without a layout can't be customised at all.
  - title: "shopify theme push — CLI reference"
    url: https://shopify.dev/docs/api/shopify-cli/theme/theme-push
    note: Read the --ignore and --nodelete flags before your first push to a live store.
---

## The one rule to remember

> **Theme code says what a page *can* look like. Store data says which page uses
> it. The theme editor edits the data, not the code.**

So "the template file exists in the repo" and "a merchant can open it in the
editor" are two completely separate facts, and the gap between them is where a
whole afternoon goes.

Sara lost most of a day to this and said the honest thing out loud: *"I'm just
frustrated with Shopify. I don't know the ecosystem as well as I thought. I'm
confused on why I don't see the landing pages in the template editor, but the
links exist and they're in the code, but they're not editable."* The room could
not solve it live, and the guesses — maybe JSON files get ignored? — were
reasonable and wrong. Here is the real answer.

## The answer, from Shopify's own docs

When you assign a template to a page in the admin (**Online Store → Pages →** the
page **→ Theme template**), the dropdown is not reading your repository. It is
reading the **published** theme. Shopify's help centre states it plainly:

> **"The template options that display are based on the available templates only
> in your current live theme."**
> — [Change your theme's templates](https://help.shopify.com/en/manual/online-store/themes/theme-structure/templates)

That is it. If your `page.landing.json` and friends live in a development or
unpublished theme, the admin will offer you only the templates that exist in the
live theme — which is exactly what Sara saw when the dropdown showed two options
and she knew there were more in the code. The storefront links worked because a
theme *preview* renders from the unpublished theme; the admin dropdown does not.

Two consequences worth internalising:

- **Nothing was broken and nothing was ignored.** The files were fine. The
  question "is that template in the code?" — John's instinct in the room — was
  the right question, and the answer being "yes" is what makes this confusing.
- **Template assignment is store data, not theme code.** It survives publishing a
  new theme, and it is not in your repo. Which means it is also not in your
  deploy, and it will not follow a theme from staging to production by itself.

## Four things must all be true

For a merchant to open a page in the theme editor and change it, all four of
these have to line up. Check them in this order — it goes cheapest first:

| # | Must be true | How it fails |
| --- | --- | --- |
| 1 | The template file exists in the theme | Wrong folder, or a typo in the suffix |
| 2 | The template is in the **live** theme | The dropdown is empty or short — the case above |
| 3 | A resource is **assigned** to that template | Template exists, no page uses it, so there is nothing to open |
| 4 | The template is a **JSON** template with a layout | A `.liquid` template has no sections to drag; a template without a layout *"can't be customized in the theme editor"* ([docs](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates)) |

Mohamed's tip in the session — *"you can click on template preview, you'll find
the template on the right sidebar"* — is the workaround for #3. The editor's own
selector lets you open a template directly, without a page being assigned to it,
which is how you check your work before any store data exists.

## How a Shopify page is actually assembled

Worth having the whole chain in your head, because almost every "why can't I edit
this" question is a layer confusion.

| Layer | File | Who owns it |
| --- | --- | --- |
| **Layout** | `layout/theme.liquid` | Developers. The `<html>` shell every page shares |
| **Template** | `templates/page.landing.json` | Developers create it, **merchants fill it** |
| **Sections** | `sections/*.liquid` | Developers. The reusable blocks, with a `{% schema %}` |
| **Blocks** | inside a section's schema | Developers define, merchants add and reorder |
| **Global settings** | `config/settings_schema.json` | Developers define the form, merchants fill it |
| **Merchant's answers** | `config/settings_data.json` | **Merchants**, via the editor |

There are two template file types, and the difference decides whether the editor
is useful at all:

- **JSON templates** (`.json`) are *data*: a `sections` object, an `order` array,
  and each section's settings. Merchants can add, remove and reorder sections.
- **Liquid templates** (`.liquid`) are *markup*. Full control for a developer,
  nothing to drag for a merchant.

([templates](https://shopify.dev/docs/storefronts/themes/architecture/templates))
If a client is ever going to touch a page, it has to be a JSON template. That is
not a preference; it is the mechanism.

One more rule that catches people: a section can only be **added** in the editor
if its schema defines a `preset`. Shopify's docs are explicit — *"Section files
without presets should be included in the JSON file manually, and can't be
removed using the theme editor."* So a section that is invisible in the "Add
section" list is usually missing a preset, not broken.

### Alternate templates

The landing pages in question are **alternate templates** — extra versions of a
template type. The naming rule is
`template-name.suffix.file-type`, so `page.landing.json` is the `landing`
variant of the `page` template. And one constraint worth knowing before you plan
around it: *"You can't replace the default template with an alternate
template."* If the default is wrong, you edit the default.
([docs](https://shopify.dev/docs/storefronts/themes/architecture/templates/alternate-templates))

## The template a client can clone from

Sara's follow-up was the more important request: *"in the future, if the client
needs to, we should have a landing page they could clone from to create new
pages."* That exists, and it is built into the editor:

1. Theme editor → the **page selector** at the top → choose the template type
   (for example **Pages**).
2. Click **Create template**.
3. Give it a unique name, and **choose an existing template to base it on**.
4. Assign it to a page in the admin (**Online Store → Pages → Theme template**).

Step 3 is the clone. Which makes the deliverable clear: ship one well-built
`page.landing.json` in the **live** theme, and the client can produce every
future landing page from it without a developer. That is a much better handoff
than "ask us and we'll add a template".

## The part that bites during deploys

Since JSON templates and `config/settings_data.json` are **theme files**, they are
in scope for `shopify theme push` — which means a push can replace the section
layout and settings a merchant arranged in the editor. Their work is data, but it
lives in files you deploy.

The habits that avoid it:

- **Pull before you push** on any store someone has been editing.
- **Ignore the merchant-owned files** when you only mean to ship code. The
  `--ignore` flag or a `.shopifyignore` file covers
  `config/settings_data.json` and `templates/*.json`
  ([CLI reference](https://shopify.dev/docs/api/shopify-cli/theme/theme-push)).
- **Know that ignore patterns behave differently between `dev` and `push`.** Test
  the ignore on a throwaway theme once, rather than discovering it on a live one.

This is the same class of problem as
[Handling Browser Cache During Deployments](deployment-browser-cache): the deploy
is not just code, and the thing you forget about is the state that was already
there.

## Field notes from our stores

**What actually happened, start to finish.** Sara had several landing page
templates, one per product category, sitting in the code. The storefront links
resolved because she was in a theme preview. The admin's **Theme template** dropdown showed only
two options because it lists the live theme's templates. She and Andrej both
remembered seeing the full list before — which is consistent, because the live
theme changed underneath them. Andrej took the action item to confirm after the
session; the check is one line: **is this template in the published theme?**

**Sara's guess, and why it was a good guess.** *"I'm wondering if it's just
something on the ignore list because it's a JSON file, so it's getting ignored."*
Wrong here, but pointing at something real — `.shopifyignore` and `--ignore`
genuinely do skip `templates/*.json`, and a repo configured that way would leave
templates missing from a store. Worth checking the ignore file second, after the
live-theme question.

**Add it to the QA pass.** "Can the client edit this page in the theme editor?"
is not the same test as "does the page load?", and only the first one tells you
whether the handoff works. Cheapest place to catch it is whoever builds the
template, on the day they build it.

## Try it yourself

1. Open **Online Store → Pages →** any page → **Theme template**. Count the
   options. Now open the theme code and count `templates/page.*.json`. If the
   numbers differ, you have just reproduced this whole lesson.
2. In the theme editor, use the page selector to open a template that no page is
   assigned to. That is the trick that lets you build and check a template before
   any store data points at it.
3. Pick a section that does not appear in the editor's "Add section" list. Open
   its `{% schema %}` and look for `presets`. Add one, and watch it appear.
4. On a **development** theme, run `shopify theme pull`, change a section's order
   in the editor, then `shopify theme push` without any ignore flags. Watch your
   editor change get overwritten. Now do it again with
   `--ignore templates/*.json`.
