---
title: Ways of Working
description: Grooming, discovery, spikes, PR reviews and release rhythm — the shared vocabulary a team needs to stop talking past each other.
emoji: 🧭
order: 15
status: up-next
tags: [process, agile, code-review]
resources:
  - title: The Scrum Guide
    url: https://scrumguides.org/scrum-guide.html
    note: The whole thing is 13 pages and it is the actual source. Refinement is defined here, "grooming" is not.
  - title: Spike — Extreme Programming
    url: http://www.extremeprogramming.org/rules/spike.html
    note: Where the word comes from — a throwaway experiment to answer one technical question.
  - title: Spikes — Scaled Agile Framework
    url: https://scaledagileframework.com/spikes/
    note: "The longer modern write-up: when a spike is worth it, and how to time-box one."
  - title: Dual-Track Agile — Marty Cagan
    url: https://www.svpg.com/dual-track-agile/
    note: Why discovery and delivery run in parallel rather than one before the other.
  - title: Small CLs — Google Engineering Practices
    url: https://google.github.io/eng-practices/review/developer/small-cls.html
    note: Google's guidance on pull-request size, and why a big one gets a worse review.
  - title: Best Practices for Code Review — SmartBear
    url: https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/
    note: "The Cisco study numbers: how many lines a human can actually review before they stop finding bugs."
---

## Why this topic is coming up

> **Half of every process argument is two people using the same word for
> different things.**

In session 6 Sara asked how we should define **grooming**, **discovery** and
**spike**, having noticed they were being used interchangeably. Tom's answer was
the right one: these are standard agile terms with standard meanings, so look
them up, bias towards the standard rather than inventing our own, and then
propose a plan. This card is that homework; the session settles the plan.

## The three words, as the standards define them

| Word | What it actually means | You are done when |
| --- | --- | --- |
| **Refinement** (was "grooming") | The ongoing work of adding detail, order and an estimate to backlog items so they are ready to be picked up. A continuous activity, not a ceremony you must book | The next few items are clear enough that anyone on the team could start one |
| **Discovery** | Working out *what* to build and whether it is worth building at all — the customer problem, not the implementation | You know which problem is worth solving, and roughly what would count as solving it |
| **Spike** | A time-boxed technical experiment to answer one question and de-risk an estimate. From Extreme Programming; the code is usually thrown away | The question is answered — even if the answer is "we cannot do it this way" |

Two footnotes worth knowing, because they explain why people disagree:

- **"Grooming" is the older word.** Scrum renamed it *refinement* over a decade
  ago and the current [Scrum Guide](https://scrumguides.org/scrum-guide.html)
  does not use "grooming" at all. Most teams still say both. Use *refinement* in
  writing, understand *grooming* when a client says it.
- **Discovery is not phase one.** The point of
  [dual-track agile](https://www.svpg.com/dual-track-agile/) is that discovery
  and delivery run *at the same time*, continuously — discovery is not a stage
  you finish before coding starts.

The one-line test when someone says "we should spike this":

- *We know what we want, it just is not ready* → **refinement**.
- *We do not know what we want yet* → **discovery**.
- *We know what we want, we do not know if or how it can be built* → **spike**.

## What the session has to decide

The definitions are free; the plan is the work. Open questions to land:

1. **Does a spike get a ticket, a time-box and a written outcome?** (Strong
   recommendation: yes to all three. An open-ended spike is just unbilled
   research, and a spike whose findings live only in someone's head has to be
   redone.)
2. **Where does discovery output live** so it survives into the ticket that
   builds it?
3. **Who needs to be in refinement,** and how far ahead do we keep the backlog
   ready — one sprint, two, or just "the next few things"?

## Small PRs, small review comments

The other decision from session 6, raised by Andrej: for a small pull request —
roughly 30 to 100 lines — leave **short, concrete review comments**, because a
long essay on a tiny change costs more to read and resolve than the change cost
to write.

That instinct turned out to be the whole of session 12, with the research behind
it, so it now has its own lesson: **[Code Review](code-review)** covers what a
review is actually for, the sizes at which reviews stop working, how to label a
comment so it does not block by accident, and what to do instead of a comment
round.

The one line to keep here: if a review comment needs three paragraphs, the
problem is usually not the comment. Either the change is too big, or the
conversation belongs in a call.

## How specific should a ticket be?

Session 7 added the other half of this, and it is a deliberate position rather than
a preference. Sara said that as she writes tickets she wants to get better at the
exact requirements, and asked everyone to push back whenever one is unclear. Tom's
answer went the other way:

> **A ticket should carry the intent and the constraints. The plan is the
> implementer's to make.**

His reasoning: AI-assisted ticket writing has been useful in some ways and "way too
specific on the requirements" in others. The failure mode is a ticket that reads
like a specification — *write this file this way* — which quietly moves a technical
decision away from the person with the code in front of them. So the direction of
travel is **deliberately less specific**: link the design, attach the screenshot,
state the outcome, and leave the approach to whoever picks it up.

| A ticket must have | A ticket should not have |
| --- | --- |
| A link to the design, where one exists | A file-by-file implementation plan |
| A screenshot of the current state | Invented acceptance criteria nobody agreed with the client |
| The outcome we want, and any hard constraint | A guess at the approach, stated as a requirement |

Two things make this work rather than just being under-specification:

**Ambiguity has to be answerable.** "Reach out if anything is unclear" is only a
real offer if asking is fast and costs nothing socially. That is the actual
mechanism, and it is the part worth protecting.

**Looser tickets raise the value of review.** With less written down, a reviewer is
the main place a misunderstanding gets caught — which connects this directly to the
small-PR section above. It also means "ready" cannot be defined as *the plan is
written*, since a good ticket now deliberately leaves the plan open. That definition
is one of the open questions below.

## Session 12: the template is the mechanism

Session 7 settled *what* a ticket should carry. Session 12 answered the obvious
next question — how do you make that happen every time, when the person writing
the ticket is in a hurry and has an AI assistant open?

Tom's answer was not "remind people". It was: **Claude is very good at
mimicking.** So give it something to mimic. A GitHub issue template in the repo,
plus a skill that points at the template, gets the ticket shape for free on every
issue, from every person, without anyone remembering a house rule.

The failure mode being designed out is specific, and everyone in the session
recognised it:

1. You type two sentences that carry the real intent.
2. The model expands them into a page and a half of requirements — file names,
   acceptance criteria, an approach — none of which anyone agreed with the client.
3. Weeks pass. Most of that page is now wrong.
4. The two true sentences are still in there somewhere, buried.

> **Generated requirements rot. Intent does not.** That is the whole argument for
> the short ticket.

The standard that works in practice is about two sentences per ticket — enough
for a person *or* a model to expand at the moment of work rather than weeks
before it. Expansion is cheap and can be redone with current information. A page
written in advance can only go stale.

The mechanics, since this is the part people ask about:

- Templates live in **`.github/ISSUE_TEMPLATE/`** on the default branch. A `.md`
  file is a free-text starting point; a `.yml` **issue form** renders real form
  fields and can mark them required.
  ([GitHub docs](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates))
- **The skill points at the template; it does not restate it.** Two copies of the
  same rules drift, and the model follows whichever one it read last.

The same thinking applies on the other end of the ticket, where a generated page
lands in a review comment instead of an issue: see [Code Review](code-review).

## Release rhythm

The third strand: how work actually reaches production — deploying a tag instead
of whatever is on a branch, and freezing staging before a client demo. That side
lives in [Maintaining Live Sites](maintaining-live-sites), and what blocks a
merge is an open question in
[Code Testing & the Testing Pyramid](code-testing).

## Until the session

1. Take your last three tickets and label each one: refinement, discovery, spike,
   or delivery. If two of them are ambiguous, bring them — those are the useful
   cases.
2. Open your most recent pull request and count the lines changed. Over 400? Find
   the seam where you could have split it in two.
3. Bring one review comment you received that made the fix obvious, and one that
   sent you round in circles. The difference between them is the standard we are
   trying to write down.
