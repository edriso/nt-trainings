---
title: Refactoring in Small Steps
description: Why an 800-file cleanup gets closed without review, and how to get the same result in pieces someone can say yes to.
emoji: ♻️
order: 27
status: learned
session: 17
date: 2026-08-17
tags: [refactoring, code-review, velocity]
videos:
  - title: Workflows of Refactoring — Martin Fowler at OOP 2014 (heise conferences)
    youtubeId: vqEg37e4Mkw
resources:
  - title: Workflows of Refactoring — Martin Fowler
    url: https://martinfowler.com/articles/workflowsOfRefactoring/
    note: The written version of the talk below. The three workflows in this lesson come from here.
  - title: Opportunistic Refactoring — Martin Fowler
    url: https://martinfowler.com/bliki/OpportunisticRefactoring.html
    note: Why "we will do a refactoring sprint later" almost never happens, and what to do instead.
  - title: An example of preparatory refactoring — Martin Fowler
    url: https://martinfowler.com/articles/preparatory-refactoring-example.html
    note: Where "make the change easy, then make the easy change" comes from, worked through on real code.
  - title: Branch By Abstraction — Martin Fowler
    url: https://martinfowler.com/bliki/BranchByAbstraction.html
    note: The technique that makes "do it piecemeal" actually possible when the start and end states differ.
  - title: Strangler Fig Application — Martin Fowler
    url: https://martinfowler.com/bliki/StranglerFigApplication.html
    note: Replacing a system gradually while it stays live. The named alternative to a rewrite.
  - title: Sacrificial Architecture — Martin Fowler
    url: https://martinfowler.com/bliki/SacrificialArchitecture.html
    note: The other side of the argument — when throwing the code away is the correct answer.
  - title: "Things You Should Never Do, Part I — Joel Spolsky"
    url: https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/
    note: The Netscape rewrite, and why old code looks worse than it is. From 2000 and still the best argument against starting over.
  - title: "Software Engineering at Google — Large-Scale Changes"
    url: https://abseil.io/resources/swe-book/html/ch22.html
    note: How Google lands changes across millions of files. The answer is sharding, not one big review.
  - title: "Code Review at Cisco Systems (SmartBear, 2,500 reviews)"
    url: https://static1.smartbear.co/support/media/resources/cc/book/code-review-cisco-case-study.pdf
    note: The study behind "200–400 lines". Ten months, 3.2 million lines, and the point where defect-finding falls off.
  - title: "Modern Code Review: A Case Study at Google (ICSE 2018)"
    url: https://sback.it/publications/icse2018seip.pdf
    note: Median change size at Google is 24 lines. Useful the next time a 400-file pull request feels normal.
  - title: "Refactoring — Martin Fowler (book)"
    url: https://martinfowler.com/books/refactoring.html
    note: The 1999 book with Beck, Brant, Opdyke and Roberts that gave the practice its name and its catalogue.
---

## The one rule to remember

> **A refactor is worth exactly what a reviewer can safely say yes to.**

Over a weekend, a codebase-architecture skill was pointed at a repo and allowed to
run. It produced a change that pulled an internal admin app and a public-facing one
onto a single shared component library — and the author's own verdict on Monday is
the useful part:

> "I went way too crazy on trying to consolidate. I think it's somewhat usable, but
> it's probably 800 files of touching that is not worth review. […] Close that and
> just do a piecemeal as you go."

Nothing about that change was wrong in intent. It failed on a different axis
entirely: **nobody could review it.** And the reason given is the one worth writing
down, because it applies to every big refactor anyone has ever proposed:

> "I was making some assumptions of the architecture. You built them and would have
> more knowledge."

This matters more now than it did two years ago. An agent makes a large refactor
**cheap to produce and no cheaper to review.** The bottleneck moved, and the skill
that got scarce is not writing the change — it is cutting it into pieces a human can
accept one at a time.

## Why big diffs die in review

This is one of the few things in our field with real numbers behind it, and
[Code Review](code-review) carries them in full. The two that matter here:
reviewers find defects best at **200–400 lines at a time** and fall off sharply
past that ([SmartBear's study of 2,500 reviews at Cisco](https://static1.smartbear.co/support/media/resources/cc/book/code-review-cisco-case-study.pdf)),
and Google's **median change is 24 lines**, with over 10% touching a single line
([ICSE 2018](https://sback.it/publications/icse2018seip.pdf)).

Which means an 800-file diff is not a hard review. It is not a review.

The mechanism is simple once you say it out loud:

| Diff size | The question the reviewer actually answers |
| --- | --- |
| 20 lines | "Is this correct?" |
| 200 lines | "Is this correct, and does it fit?" |
| 800 files | "Do I trust the author?" |

That last one is a vote of confidence with a green button attached — and the honest
response to it is the one taken here: withdraw the change. This lesson is about not
putting a reviewer in that position in the first place.

## Big change, small pull request — they are different things

The most useful correction here: **"the change was too big" and "the pull request
was too big" are not the same sentence.** Google routinely lands changes across
millions of files. They just never land them as one review.

Their tooling for it (an internal platform called Rosie) exists to
[split a large change into shards](https://abseil.io/resources/swe-book/html/ch22.html)
that are tested, reviewed, and committed **independently**, with two rules that
transfer to any team:

- **Each shard must be committable on its own** — no cross-shard dependency, or
  else the dependent pieces get grouped into the same shard.
- **Each shard must be small enough that rolling it back breaks nothing else.**

So the 800-file consolidation was not too ambitious. Its **shard size was one**.
Same change, cut into thirty pull requests that each leave the site working, and it
would have landed over two weeks with nobody staying late.

## The three refactors that actually happen

If refactoring only happens when someone schedules a "refactoring sprint", it does
not happen. Martin Fowler's
[Workflows of Refactoring](https://martinfowler.com/articles/workflowsOfRefactoring/)
names the ones that survive contact with a real backlog:

| Workflow | When you do it | What it looks like |
| --- | --- | --- |
| **Litter-pickup** | You are passing through and something is ugly | Fix it now, in this branch, if it is small. The boy-scout rule. |
| **Comprehension** | You had to work out what the code does | Put what you learned back into the code — better names, an extracted function — so the next person skips that work |
| **Preparatory** | You are about to add a feature and the shape is wrong | Reshape first, in its own commit, then add the feature |

Preparatory refactoring is the one that pays for itself immediately, and it has the
best one-line summary in the industry. Fowler credits it to **Kent Beck**:

> "For each desired change, make the change easy (warning: this may be hard), then
> make the easy change."

Jessica Kerr's image for it is the one that sticks: you drive *north* to reach the
highway before heading east, instead of going straight east through the woods. The
detour is not a detour.

Notice what all three have in common — **the refactor rides along with work someone
already asked for.** That is why they get reviewed. A reviewer looking at a small
reshaping *plus* the feature it enabled can see why it happened. A reviewer looking
at 800 files of reshaping with no feature attached cannot.

## How to actually do it piecemeal

"Do it piecemeal" is not advice until you know how to get from a broken-up
architecture to a shared one without a flag day in the middle. Two named techniques
cover almost every case:

**Branch by abstraction** — for replacing something *in place*.

1. Introduce an abstraction over the thing you want to change (a wrapper, an
   interface, a single module everything imports).
2. Move callers onto the abstraction, **one pull request at a time**. The old
   implementation is still doing the work. Nothing has changed behaviourally.
3. Add the new implementation behind the same abstraction.
4. Switch over, then delete the old one and — if it has no other use — the
   abstraction too.

Every step ships. Every step is revertable. Nothing sits on a branch for a week.

**Strangler fig** — for replacing something *alongside*. The new thing grows around
the old one, taking traffic route by route, until the old one has nothing left to
serve and gets deleted. Fowler named it after the vines in Queensland that germinate
in a tree's branches and grow down to the ground; the honest reason it wins is in his
own note on why replacements fail:

> "Replacements seem easy to specify, but often it's hard to figure out the details
> of existing behavior."

Which is the general form of the point made about the 800-file change. The person
who built it knows things the plan does not.

## When starting over is the right call

A lesson that only argued one side would be easy to ignore, so here is the strongest
version of the other one.

Fowler's [Sacrificial Architecture](https://martinfowler.com/bliki/SacrificialArchitecture.html)
argues that sometimes code *should* be built to be thrown away. eBay went Perl
(1995) → C++ (1997) → Java (2002), and "much of that success was built on the
discarded software of the 90's". He quotes Google's rule of thumb: **design for
~10× growth, plan to rewrite before ~100×.** When the architecture is wrong for the
load or the shape you now have, no amount of small steps gets you there.

And the strongest argument *against* rewriting, which is 26 years old and has not
aged a day — Joel Spolsky on Netscape 6:

> "It's harder to read code than to write it."

His point is that the ugly function you want to delete is usually a pile of bug
fixes wearing a bad name. "Old code has been used. It has been tested. Lots of bugs
have been found, and they've been fixed." Rewriting throws away the fixes and keeps
only the confidence.

A rule you can actually apply:

- **The code merely looks bad** → refactor, in small steps, while doing feature
  work. Never a project of its own.
- **The architecture is wrong for the load or shape you now have**, and you can
  afford to run both at once → replace it, strangler-fig style, route by route.
- **You cannot afford to run both** → you are not rewriting, you are gambling. Say
  that out loud before you start.

## Closing a pull request is a real outcome

The other decision in this session is the one people find hardest, so it gets its
own section. The guidance on a stack of open pull requests, all of them touching
one-shot data scripts:

> "Those are not deprecated, but they've been run. The product output is there. So
> don't spend time on those. Just close them."

A one-shot script that has **already run** is not code you maintain. The output
exists, in the store, in the data. Reviewing the script afterwards is pure cost with
no possible benefit — you cannot un-run it, and you are not going to run it again.

So before opening a review, ask: **what changes if this merges?** If the answer is
"nothing anyone can observe", close it. Two habits make that cheap:

- **Say why in the closing comment.** One line — "already run, output is in the
  catalogue, closing rather than reviewing" — so nobody reopens the question in
  three weeks. This is the same argument as
  [Comments & Code Clutter](comments-and-code-clutter): the reasoning is the part
  worth keeping, not the artefact.
- **Triage by review cost, not by author.** The split used here: *"if it's quick and
  easy to review and merge, merge it. If it's a pain to QA, please just throw it
  away."* Whether a change is worth reviewing depends on what it costs to verify,
  and that is a property of the diff, not of who wrote it.

The cheapest version of all of this is the author closing their own pull request,
which is what happened. It costs one comment and saves someone else a day.

## Shipping a redesign in slices

The same instinct showed up as a launch strategy, and it is worth naming because it
is the deployment-shaped version of the same idea.

Rather than a "blog redesign" project, the plan is to let the blog **converge** on
the new design as the pieces land — new header, new footer, standardised as they go.
And for pages that need client approval: launch the page at its own URL, do not
route it at the CDN yet, and switch the routing on once it is approved.

That is **deploy decoupled from release**, done with routing instead of feature
flags. The page is live, reachable, and reviewable at its own URL; the CDN decides
when it becomes *the* page. Approval stops being a gate in front of deployment and
becomes a switch after it. The routing mechanics are in
[Subdomains, Subfolders & Headless CMS](subdomains-and-headless-cms), and the
"merged is not released" half is in
[Maintaining Live Sites](maintaining-live-sites).

The trade-off to be honest about: an unrouted page is still **public**. It is
crawlable if anything links to it, and it will not carry the design a client signed
off on. If that matters, `noindex` it until it is routed — and check that the header
comes off when the page goes live.

## Four things worth copying

- **Give a generated diff a second step that cuts it up.** The tool that produced
  the 800-file change was not wrong to find what it found. It was missing the step
  that turns one change into thirty pull requests, and that step is still a human's.
  Same shape as the argument in [Proving It Works](proving-it-works): an agent will
  happily hand you something that looks finished.
- **A large *upstream* diff is a different animal.** Pulling in a vendor's theme or
  library update touches a lot of files too, but you are comparing against a known
  good source and the alternative is drifting off their version forever. Size is not
  the signal; **who wrote it and what you compare it to** is.
- **Write the hard constraint down before you split the work.** "This app must stay
  pixel-perfect, that one may shift" is exactly what tells you the order of the
  pull requests — the shared library goes in behind the pixel-perfect side first,
  with zero visual delta, and the other side migrates afterwards where nobody is
  counting pixels.
- **Notice how much of your process needs one vendor to be up.** A forge outage can
  stop reviews and issue cleanup dead. What still works offline: running the test
  suite, reading a diff you already pulled, writing the pull request description.

## Try it yourself

1. **Measure your last pull request.** Run `git diff --stat main` on your current
   branch. If it is over ~400 changed lines, find the seam where you could have
   split it in two, and say out loud which half you would have shipped first.
2. **Do one comprehension refactor.** Next time you have to read code twice to
   understand it, rename one thing or extract one function so the second reading is
   not needed. Commit it separately from your feature work.
3. **Practise branch by abstraction on paper.** Take something you would like to
   replace in your codebase and write the four steps: the abstraction, the caller
   move, the new implementation, the deletion. Count how many pull requests it is.
4. **Find a closable pull request.** Open your oldest open PR and answer one
   question: what changes if this merges? If the answer is "nothing observable",
   close it with a one-line reason.
