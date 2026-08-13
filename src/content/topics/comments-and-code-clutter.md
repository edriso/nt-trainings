---
title: Comments & Code Clutter
description: Half the pull request is comments nobody will read. Here is which ones to keep, which to delete, and what they actually cost.
emoji: 🧹
order: 24
status: learned
session: 15
date: 2026-08-13
tags: [code-quality, comments, refactoring, ai-assisted-code]
videos:
  - title: Don't Write Comments (CodeAesthetic)
    youtubeId: Bf7vDBBOBUA
  - title: A Philosophy of Software Design (Talks at Google)
    youtubeId: bmSAYlu0NcY
resources:
  - title: "APoSD vs Clean Code — a debate between John Ousterhout and Robert Martin"
    url: https://github.com/johnousterhout/aposd-vs-clean-code
    note: The two loudest voices on comments arguing it out in public, in writing. Read the comments section and pick your own middle.
  - title: "What to look for in a code review — Google Engineering Practices"
    url: https://google.github.io/eng-practices/review/reviewer/looking-for.html
    note: Where "comments should explain why, not what" is written down as policy rather than opinion.
  - title: "Do Code and Comments Co-Evolve? (WCRE 2007, PDF)"
    url: https://www.zora.uzh.ch/server/api/core/bitstreams/1ef6e85e-6f76-41ad-8070-e4fba4b97513/content
    note: Three real codebases tracked over years. The paper behind "comments rot" being a measured thing, not a saying.
  - title: "The Maintainability Gap — GitClear, 2026"
    url: https://www.gitclear.com/the_ai_code_quality_maintainability_gap
    note: 623 million changes measured across 2023–2026. Duplication and error-masking up, refactoring down. Numbers will move, the direction is the point.
  - title: "The Shopify platform — theme performance best practices"
    url: https://shopify.dev/docs/storefronts/themes/best-practices/performance/platform
    note: The answer to "do comments make the bundle bigger on a Shopify theme?" Read the minification paragraph.
  - title: "comment tag — Shopify Liquid reference"
    url: https://shopify.dev/docs/api/liquid/tags/comment
    note: Two lines that tell you which of your template comments reach the browser and which never do.
  - title: "Optional chaining (?.) — MDN"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
    note: The operator that deletes most of the redundant guards in this lesson. Check browser support at the bottom of the page.
---

## The one rule to remember

> **Delete the comment when the code already says it. Write one when the code
> cannot.**

John put the working version of this in the room, and it is the one to keep in
your head at review time:

> *"If a senior dev can look at the code and understand it, remove that comment."*

The reason this came up now is not that we suddenly care about style. It is that
the volume changed. John was reading pull requests himself instead of letting a
tool run first, and what he found was comments making up nearly half the diff,
plus small pieces of logic that do nothing. His question to the room was the
honest one: these are called harmless, so *why does it still bother me?*

This lesson is the answer to that question, and it is not the answer he expected.

## Three kinds of comment show up in a pull request

Sorting them takes about two seconds each, and once you can name them the review
gets much faster.

| Kind | Looks like | What to do |
| --- | --- | --- |
| **Narration** | `// loop through the products` above a loop through the products | Delete. The line under it is the documentation. |
| **Scaffolding** | `// per Figma: <link>`, `// see PR #412`, `// as discussed in the ticket` | Delete. It was a note to the author, mid-task, and it is already stale. |
| **Load-bearing** | `// Shopify rounds this before we do, so subtract first` | **Keep.** This is the one people forget to write. |

Scaffolding is the category that stung the most in this session. Andrej named it
directly: one of the codebases we work in is full of comments pointing at Figma
frames, at issues, at pull requests. His objection was not aesthetic. A link in a
comment looks like an answer, so you go and open it, and it costs you a minute
and gives you nothing, because the frame moved or the pull request merged six
weeks ago.

A comment that points somewhere else is a promise the code cannot keep.

## The argument that was never settled

This is worth knowing, because you will hear both sides quoted at you with total
confidence, and both sides are serious people.

**Robert Martin** (*Clean Code*, 2008) treats comments as a defeat: *"Comments
are always failures. We must have them because we cannot always figure out how
to express ourselves without them."* He also says *"I look at every comment as
potential misinformation"* and prefers a long descriptive function name to a
line of prose.

**John Ousterhout** (*A Philosophy of Software Design*, 2018) thinks that is
backwards and says so with a number: *"For me the cost of missing comments is
easily 10–100x the cost of incorrect comments."* His argument is that names are
a terrible compression format. A name cannot tell you what happens on an empty
list, or which unit the number is in, or why the obvious approach fails here.

The two of them argued it out in public, in writing, and
[the whole thing is on GitHub](https://github.com/johnousterhout/aposd-vs-clean-code).
It is genuinely good reading and neither of them wins.

**The middle ground we can actually use:** they are arguing about two different
places in the file, and once you split those, most of the disagreement goes away.

- **Inside a function body**, Martin is right. If you needed a sentence to
  explain the next three lines, the three lines are the problem. Name the
  variable, extract the function, delete the sentence.
- **At the boundary** — a function's contract, a config constant, a workaround —
  Ousterhout is right, and this is where our codebases are actually thin. The
  comment nobody writes is the expensive one.

So "fewer comments" is the wrong goal to write down. **Fewer narration comments,
more load-bearing ones** is the goal, and it usually means the comment count
barely moves while the diff gets a lot easier to read.

## What comments really cost

John connected this to bundle size, remembering the work where even whitespace
was being trimmed. That instinct is right about *something*, but on a Shopify
theme it is not right about bytes. Here is the real accounting.

**What never reaches the browser:**

- Anything in `{% comment %}` … `{% endcomment %}` or an inline `{% # … %}`.
  Liquid parses it and outputs nothing.
  ([Liquid reference](https://shopify.dev/docs/api/liquid/tags/comment))
- Comments in theme `assets/*.css`, and in `assets/*.js` — Shopify's docs say it
  *"automatically minifies CSS files, as well as JavaScript files that use valid
  syntax to ES5, when they're requested by the storefront."* Everything then
  ships over the CDN with Brotli or gzip on top.
  ([Shopify platform docs](https://shopify.dev/docs/storefronts/themes/best-practices/performance/platform))

**What does reach the browser:**

- HTML comments — `<!-- like this -->` — in any `.liquid` template. Those are
  output, not stripped.
- Inline `<script>` and `<style>` blocks inside `theme.liquid` or a section.
  Minification is a *file* thing.
- Any asset already named `.min.js` or `.min.css`, which Shopify serves
  untouched on purpose.

Two caveats worth remembering rather than memorising: that ES5 clause means a
theme file using modern syntax may not get minified at all, and Shopify serves
the original file whenever the minified version would somehow be larger. Both are
in the doc above, and both are one Network-tab check away — which is exercise 2
at the bottom.

**So the real cost is not kilobytes. It is two other things.**

**Attention.** A reviewer has a limited budget of care per diff, and it is spent
on whatever is in front of them. Comment noise does not add bytes to the
customer; it takes the reviewer's budget and spends it on nothing. That is the
same budget the actual bug in the diff was hoping for. It connects straight back
to [Code Review](code-review): a review is a second person *understanding* the
change, and every line that does not help that is decoration.

**Rot.** Fluri, Würsch and Gall tracked comments and code across ArgoUML, Azureus
and Eclipse JDT Core and found that when a comment *did* change with its code, it
changed in the same commit 97% of the time — but newly added code was barely
commented at all. Read that the right way round: comments do not get updated
later. They get updated with the change or never. Every comment you keep is a
line you have signed up to maintain forever, and the ones you stop maintaining do
not go quiet — they start lying.

That is the honest answer to *"they're harmless"*. A narration comment costs
nothing today and turns into misinformation on a Tuesday in nine months.

## The guard that guards a guard

The other half of John's complaint was logic that does nothing. His example, in
the shape he found it:

```js
// the object may not have items, and items may be empty
if (order.items && order.items.length && order.items.length > 0) {
  render(order.items)
}
```

Three checks, one meaning. `order.items.length` and `order.items.length > 0` are
the same test written twice. The whole thing is one line:

```js
if (order.items?.length) {
  render(order.items)
}
```

Why does this survive review? Because each piece looks defensible on its own, and
because deleting someone's safety check feels like the risky move. It is not. **A
redundant check is a claim about the data, and a wrong claim.** It tells the next
reader "`members` might be a non-array with a length, or the length might be
negative" — so they go and look, and find out neither is true, and you have spent
their afternoon.

This is not a new problem, but it is a much bigger one now. GitClear measured 623
million code changes from 2023 to 2026 and found duplicated blocks up 81%,
error-masking constructs up 47%, and refactoring line-moves down 70% against the
2022 baseline. The individual numbers will move; the shape will not. Generated
code is additive by default. It writes the new thing. It very rarely deletes the
old thing, and *nothing else in the pipeline deletes it either* unless a person
decides to.

That is the job the review step just quietly inherited.

## Making it stick

The team's instinct in the room was right — write it down rather than remember
it — but *where* you write it decides whether it works.

**Put the standard in `CLAUDE.md`, as an outcome, not a ban.** "Never write
comments" is a rule a model will follow until something else in the context
outranks it, and then you get the opposite. Anthropic hit this in their own
system prompt and replaced a long prohibition with a goal: *write code that reads
like the surrounding code — match its comment density, naming, and idiom.* Aim at
that shape. A file with good comments teaches the tool more than a paragraph of
rules does.

**Run the cleanup before the pull request, not during review.** Sara's *mad
boring* skill and John's *scrub comments* skill both do the same job, and both
belong in the author's loop. A check that only ever fires at review time is a
check we chose to run at the most expensive possible moment — the same argument
as in [Code Review](code-review), and it applies to your own tooling too.

**Vet the skill before you trust it.** John's warning deserves repeating as-is:
*"a lot of times I've run into skills online and they promise heaven, and when I
use them they're just… it works, but it has some side effect that is usually not
good."* Read the file — a skill is a Markdown file, it takes two minutes. Run it
on a branch first and read the diff. Anything that installs, fetches, or runs
something for you is a different risk class entirely; that story is in
[Supply Chain Security](supply-chain-security).

**Be careful with the cleanup ticket.** Mohamed's point is fair: while you are
building, some of those comments are genuinely helping you, so a cleanup ticket
at the end is reasonable. The failure mode is just as real — a cleanup ticket is
the single easiest ticket in any backlog to keep not doing, and by the time
anyone opens it the code has moved. The version that survives contact with a
deadline: **the file you are already touching gets cleaned in the pull request
that touches it.** The ticket is for the leftovers, and it gets an owner and a
date, or it does not exist.

**Start the next project with this file.** Andrej's suggestion was the best
sentence in the session: put everything we learned here into the `CLAUDE.md` of
the *next* project on day one, so the mistakes we found do not get made again
from scratch. That is the only version of "documenting best practices" that has
ever worked — not a document about the past, but the starting configuration of
the next thing.

## What we are changing

**Where the scaffolding is.** Our worst offender is a large, heavily generated
feature, and Andrej named the exact pattern: comments referring not just to Figma
frames but to issue numbers and pull requests. Those pull requests are merged.
Anyone following one of those links is spending a minute to learn nothing. When
you are next in one of those files, delete them as you pass.

**The skills that already exist on this team.** Sara wrote *mad boring* (trims
extra Figma comments, holds decision notes to two lines) two days before this
session and has been running it on recent pull requests. John has *scrub
comments*, built on the senior-dev test above. Sara's plan is to distribute *mad
boring* as a GitHub Gist plus the shared repo.

**We ran the snake-oil check on the starred repo.** The one Mohamed found is
[claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice),
and the result is a good demonstration of why John's rule is worth the two
minutes. On the outside it is about as safe as an unofficial repo gets: MIT
licence, tens of thousands of stars, pushed the same week, no install step, no
setup script. It is also not really a best-practices *skill* — it is a large
catalogue of workflows, agents, hooks and skills to browse, which is genuinely
useful for that.

The finding is in `.claude/settings.json`, where the permission allowlist starts
with `Edit(*)`, `Write(*)`, `Bash(*)` and `WebFetch(domain:*)`. That is not a
trap — it is a demo repo, and those settings make its own demos run without
prompts. But `.claude/` is precisely the folder people copy wholesale out of a
repo like this, and dropping that file into a real project turns off the approval
prompt for every shell command and every file write. John's sentence, exactly:
*it works, but it has some side effect that is usually not good.*

**So the rule we are taking from it: read the settings before the skills.** A
skill you dislike costs you one session. A permissions file you did not read
changes what every future session may do without asking. Take the file you came
for, not the folder it lives in. The longer version, plus what to look for in
`.mcp.json` and `.claude/hooks/`, is in
[Claude GOAT](https://edriso.github.io/claude-goat/docs/skills-craft).

**Why nobody could see a shared Skills tab.** This came up live and went
unanswered: Sara has skills on claude.ai, everyone else looked under Customize →
Skills and found only Anthropic's built-ins, no *Shared* tab. That is not a
missing account. Skill sharing on a Team or Enterprise plan is **off by default**
and an organisation owner has to turn it on — there are two separate toggles
under Organization settings → Skills, one for sharing with named colleagues and
one for publishing to the organisation directory, and the *Share* button does not
appear until one of them is on
([Anthropic help](https://support.claude.com/en/articles/13119606-provision-and-manage-skills-for-your-organization)).
Shared skills arrive read-only. The Gist works fine in the meantime; a repo-
committed `.claude/skills/` directory works better, because it is versioned and
it follows the project.

**Then we ran the same check on our own skills.** Sara has five shared from her
claude.ai account — `eod-update`, `pm-daily`, `weekly-dev-recap`, `shipped` and
`amend` — and they turned out to be the better worked example, precisely because
they are good skills and the findings are still real. All five are clean on the
dimension that actually hurts people: no installs, no fetches, no bundled
scripts, no MCP servers. Just `git`, `gh` and `date`. Two things came out of
reading them anyway.

**`allowed-tools` is the contract. The description is not.** Three of the five
allow `Bash(gh api:*)` while stating in prose that they never post anything. Both
statements are true, and only one of them is enforced: `gh api -X POST` and
`gh api -X DELETE` sit inside that grant. Nothing here is going to post anything,
because the instructions are clear and they get followed. But a permission is
what the harness allows *when the instructions are not followed*, which is the
entire reason it is a separate field. Narrow it to the calls you actually make,
or drop `gh api` and take the prompt.

**A check that fails quietly is worse than one that fails.** `weekly-dev-recap`
and `pm-daily` build their date window with `date -v-7d`. That is the BSD form:
it works on macOS and does not exist on Linux. Watch what happens on a Linux
machine:

```bash
$ date -v-7d +%Y-%m-%d
date: invalid option -- 'v'

$ gh pr list --state merged --search "merged:>" --json number --limit 5
[]                                   # exit code 0
```

The search string collapses to `merged:>`, `gh` returns an empty list, and it
returns it *successfully* — so the skill's own
`|| echo "gh CLI not configured"` fallback never fires. The recap does not
error. It reports that nothing shipped. Run against this repo over a week with
five merged pull requests, it would have said zero.

`date -d '7 days ago' +%F` is the GNU form, and
`date -d '7 days ago' +%F 2>/dev/null || date -v-7d +%F` covers both. The
transferable part is the shape, not the fix: **anything in a skill's context
block runs on somebody else's machine.** Make it portable, and make it loud when
it breaks. An empty result and a broken command look identical in a report, and
the report is the thing going to a client.

**Credit where it is due.** `amend` is the design to copy. It is the only one of
the five that writes anything, and it is the most carefully guarded: it checks
whether the previous commit is already pushed and stops if it is, scans for
`.env` and `*.pem` before staging, refuses `--no-verify`, and explicitly forbids
itself every git command it does not need. And `shipped` is the best-commented
file on this team, in exactly the way the top of this lesson argues for. *"A
search commit cited issue #361 while the actual PR was #458 — trust the SHA
search over the inline number"* is load-bearing. Nobody would ever reconstruct it
from the code, and deleting it would cost the next person an afternoon.

**The AI half of this lives elsewhere.** How to make the tool produce less of
this in the first place, how to vet a skill, and how to run a review in a fresh
context are all in [Claude GOAT](https://edriso.github.io/claude-goat/), same
split as [AI for Developers](ai-for-developers). This lesson is the part that
would still be true if the code were typed by hand — which it was, for the
thirty years those two books were arguing about it.

## Try it yourself

1. Open your last merged pull request and label every comment in it: narration,
   scaffolding, or load-bearing. Count them. If load-bearing is the smallest
   group, that is the finding — write one real one for the trickiest thing in
   that diff.
2. Settle the bundle-size question with your own eyes. Load a storefront page,
   open DevTools → Network, and click a theme `.js` or `.css` asset. Is the
   response minified? Now do the same for the HTML document and search it for
   `<!--`. You now know exactly which of your comments ship.
3. Find one redundant guard in code you own — a `&&` chain, a length check that
   repeats itself, a `try/catch` that swallows and returns the same value. Rewrite
   it as one line and check nothing breaks. Notice how much shorter the *reason*
   for the code becomes.
4. Read the comments section of the
   [Ousterhout vs Martin debate](https://github.com/johnousterhout/aposd-vs-clean-code),
   pick the side you disagree with, and write two sentences on why they have a
   point. Bring it to the next session.
