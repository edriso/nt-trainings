---
title: Sizing Is for Cutting Scope
description: 1, 2, 3, 5, 8, 13 is a terrible way to predict a date and an excellent way to find the four tickets you should renegotiate. Those are different jobs.
emoji: 📏
order: 35
status: learned
session: 20
date: 2026-09-17
tags: [planning, estimation, process, launch]
resources:
  - title: "Planning Poker, or How to Avoid Analysis Paralysis while Release Planning (PDF)"
    url: https://wingman-sw.com/papers/PlanningPoker-v1.1.pdf
    note: James Grenning's original 2002 paper. Four pages, and it already says the point is scope, not precision. Read it before the session.
  - title: Affinity Estimating — Mike Cohn
    url: https://www.mountaingoatsoftware.com/agile/story-points/affinity-estimation
    note: The silent, one-move-each method. About 60 items an hour against roughly 20 for discussion-based poker.
  - title: Why the Fibonacci Sequence Works Well for Estimating — Mike Cohn
    url: https://www.mountaingoatsoftware.com/agile/why-the-fibonacci-sequence-works-well-for-estimating
    note: Where the modified scale comes from, and the weight metaphor that explains why the gaps grow.
  - title: The Scrum Guide
    url: https://scrumguides.org/scrum-guide.html
    note: Search it for "story point" and "velocity". Zero hits each. Useful the next time someone says Scrum requires them.
  - title: "Agility, Uncertainty and Estimation (PDF) — Todd Little"
    url: http://www.toddlittleweb.com/Papers/Agility,%20Uncertainty%20and%20Estimation.pdf
    note: 120 real commercial projects. The median came in 75% over target. The best data on this page.
  - title: "The Cone of Uncertainty (PDF) — Construx / Steve McConnell"
    url: https://www.construx.com/wp-content/uploads/2019/02/CxWhitePaper_ConeOfUncertainty.pdf
    note: 'The cone is a best case, not a promise — "it isn''t possible to be more accurate; it''s only possible to be more lucky."'
  - title: Story Points Revisited — Ron Jeffries
    url: https://ronjeffries.com/articles/019-01ff/story-points/Index.html
    note: '"I may have invented story points, and if I did, I''m sorry now." The strongest argument against this whole lesson, from the source.'
  - title: "#NoEstimates, An Introduction — Allen Holub"
    url: https://holub.com/noestimates-an-introduction/
    note: 'The alternative, stated clearly: forecast from measured throughput and count stories rather than pointing them.'
  - title: MoSCoW Prioritisation — Agile Business Consortium
    url: https://www.agilebusiness.org/dsdm-project-framework/moscow-prioritisation.html
    note: The official definition, including the 60% rule. This is the conversation the sizing pass exists to start.
  - title: The Kanban Guide
    url: https://kanbanguides.org/the-kanban-guide/
    note: 'Throughput is defined as "the exact count of work items". The official metric never mentions points.'
  - title: Throughput Forecaster (free spreadsheet) — Focused Objective
    url: https://github.com/FocusedObjective/FocusedObjective.Resources/raw/master/Spreadsheets/Throughput%20Forecaster.xlsx
    note: Troy Magennis's Monte Carlo forecaster. Feed it your throughput, get a date with confidence bands, for free.
  - title: Reliable Product Launches at Scale — Google SRE book
    url: https://sre.google/sre-book/reliable-product-launches/
    note: What a go/no-go gate looks like when a company takes it seriously. The checklist in Appendix E is the real artefact.
---

## The one rule to remember

> **Sizing a backlog is a bad way to predict a date and an excellent way to find
> the four tickets worth arguing about. Do it for the second reason, and throw the
> numbers away afterwards.**

Almost every argument about story points is an argument about the first job. This
lesson is about the second one, which is the one we actually did.

## The move

A client moved a launch date up by about two weeks. Not because anything was late
— because their paid marketing channels had to be rebuilt on the new platform,
they were already in a lull of not spending on channels that are otherwise ROI
positive, and they did not want to be doing that *and* holiday prep at the same
time. Two dates came out of the call:

> **A go/no-go gate, about two and a half weeks before the launch date.**

The framing of what the launch date meant is worth keeping, because it is what
makes the rest of this urgent:

> "There's not going to be a go/no-go, not [the launch date]. Like, the option is
> we hit it or it gets pushed to January, and that's a nuclear option for
> everyone."

And then the ask:

> "We haven't done spike ticket sizing or anything like that, but just a quick
> golden ratio triage of anything in the queue. Golden ratio being 1, 2, 3, 5,
> 8, 13 — loose estimate of difficulty… The intent is not to get hours per ticket
> fully across. It's just to triage what are the eights and 13s in the queue, and
> can we have discussions with them around why those are difficult, and if they
> can compromise in any way to get them down to ones or twos."

Read that last sentence again, because it is the whole lesson. The output of the
pass is not a date. It is **a shortlist for a negotiation.** The deliverable had
already been described from the client's side in the same call: *"one of the
things they need from us is a list of the items that we think might take a lot
longer."*

## It is Fibonacci, not the golden ratio

Small correction, worth making once and then dropping. 1, 2, 3, 5, 8, 13 is the
**Fibonacci sequence**. The ratio of consecutive Fibonacci numbers *converges*
toward the golden ratio, about 1.618 — but the numbers we use are the ones
furthest from it:

| Step | Ratio |
| --- | --- |
| 2 / 1 | 2.000 |
| 3 / 2 | 1.500 |
| 5 / 3 | 1.667 |
| 8 / 5 | 1.600 |
| 13 / 8 | 1.625 |

So "golden ratio triage" is a nice name for a Fibonacci scale. Nobody is harmed
by the name. Two things are worth knowing behind it:

**The scale in common use is not pure Fibonacci either.** Mike Cohn's version is
1, 2, 3, 5, 8, 13, 20, 40, 100 — deliberately *modified*, because
[in his words](https://www.mountaingoatsoftware.com/agile/why-the-fibonacci-sequence-works-well-for-estimating)
21 "implied a precision we couldn't support". His argument for the growing gaps is
a good one: *"numbers that are too close to one another are impossible to
distinguish as estimates."* You can tell 1 kg from 2 kg by hand. Nobody can tell
20 kg from 21 kg.

**The original Planning Poker deck was not Fibonacci at all.** Grenning's
[2002 paper](https://wingman-sw.com/papers/PlanningPoker-v1.1.pdf) says: *"There
are cards for 1, 2, 3, 5, 7, 10 days and infinity."* Seven and ten, not eight and
thirteen. Fibonacci arrived later with Cohn.

And one thing that settles a recurring argument: **Scrum does not require any of
this.** Search the [Scrum Guide](https://scrumguides.org/scrum-guide.html) for
"story point", "velocity", "Fibonacci" or "planning poker" and you get zero hits
each. All it says about sizing is that backlog items have a size and that *"the
Developers who will be doing the work are responsible for the sizing."*

## The original paper already said this

The best defence of that ask was written in 2002, by James Grenning,
after a release-planning meeting stalled with two senior people arguing while
everyone else checked out:

> "The release-planning objective is to get a ballpark estimate of the effort to
> build the product… **Precision of individual estimates is not the goal.
> Determining the project scope is.**"

Twenty-four years later, that is still the sentence. Two more from the same four
pages, both directly useful:

> "If you can't get consensus, don't sweat it. It is only one story out of many.
> Defer the story, split it, or take the low estimate."

> "If a story is longer than 2 weeks, play the infinity card and make the customer
> split the story."

The infinity card *is* the 13. It was never a number, it was a flag meaning **this
one needs a conversation, not an estimate.** Which is exactly what you are going
to do with the eights and thirteens.

## Do not say "roughly hours"

One thing in the ask is worth changing, and it is not pedantry. The numbers were
described as "roughly hours per ticket". That sentence is an **anchor**, and
anchors are the best-evidenced failure in estimation research.

Jørgensen and Løhre's experiments found that estimates move toward a stated number
*even when the estimators are explicitly told the number is irrelevant*. Knowing
about the bias does not protect you from it — which is also Kahneman and Tversky's
finding about the planning fallacy: *"awareness of a perceptual or cognitive
illusion does not by itself produce a more accurate perception of reality."*

Two practical consequences:

1. Say **"relative size"**, not "roughly hours". The moment a unit is attached,
   somebody will multiply the column and treat the total as a schedule, and the
   scale stops doing the only job you wanted from it.
2. **Whoever speaks first sets the anchor for the room.** Which leads to the next
   section.

## Run it silently

There is a documented method for sizing a whole backlog fast, and it has real
throughput numbers attached. Cohn's
[affinity estimation](https://www.mountaingoatsoftware.com/agile/story-points/affinity-estimation):

| Method | Items per hour |
| --- | --- |
| Planning Poker (discuss each item) | about 20 |
| **Affinity estimation (silent)** | **about 60, sometimes over 100** |

The procedure, and the third step is the clever one:

1. Lay the scale values out — on a wall, a spreadsheet column, a board swimlane.
2. Read each item **just enough to identify it**. No discussion.
3. One estimator silently puts it under a value. Anyone may move it **once**.
4. If somebody wants to move it a **second** time, it goes to the discussion pile
   and is out of play.
5. Run Planning Poker on the discussion pile at the end.

That one-move rule does the whole job for you automatically. **The tickets that
bounce twice are the eights and thirteens**, and they identify themselves without
anyone arguing a number or anchoring anybody. On a queue of 120 tickets, the whole pass
is two hours and the output is a discussion pile of maybe eight items — which is
exactly the list a client asking "what might take a lot longer?" wants.

## The counter-argument, and it is strong

Present this honestly, because the person who invented the thing has disowned it.
Ron Jeffries, in
[Story Points Revisited](https://ronjeffries.com/articles/019-01ff/story-points/Index.html):

> "I like to say that I may have invented story points, and if I did, I'm sorry
> now."

His four objections are all about what happens to the numbers *after* the pass:
comparing teams, tracking estimate against actual, using estimates as pressure,
and false precision in release dates. Allen Holub's
[#NoEstimates piece](https://holub.com/noestimates-an-introduction/) goes further:

> "Estimates are always inaccurate, usually wildly so… Don't estimate. Instead use
> projections based on real measurements to dynamically adjust your scope as you
> learn about the problem. The main metric you need for that is average number of
> stories completed per unit time… Note that I haven't said 'points per sprint.'
> I'm just counting stories."

And there is data behind the counting claim. Vasco Duarte published the
correlation between points completed and *story count* completed across ten
projects: **0.755, 0.83, 0.92, 0.51, 0.88, 0.86, 0.70, 0.75, 0.88.** Mostly high
enough that the two measure much the same thing — with one project at 0.51, which
he flags himself. Worth noting that the
[Kanban Guide](https://kanbanguides.org/the-kanban-guide/) settles the argument by
definition: throughput is *"the exact count of work items"*, not a sum of points.

Here is the reconciliation, and it is why this lesson exists rather than just
linking Jeffries:

> **Every one of those objections is about using points to forecast. None of them
> is about using them to sort.** Sizing to find outliers, then discarding the
> numbers, is the one use almost nobody objects to.

So take the criticism as a rule about the *afterlife* of the numbers: do not put
them in a spreadsheet, do not total them, do not compare this week's total to
last week's, and delete the field when the triage is done.

## The forecast you should actually trust

If you do want a date, and at the gate you will, do not get it by adding up
sizes. Get it from what the team has actually finished.

The evidence that summing estimates does not work is not folklore. Todd Little
published three years of data on **120 commercial projects** at a market-leading
software company:

- The ratio of actual to estimate follows a **log-normal** distribution.
- *"The initial project estimate tends to be a target with only about a 10-20%
  chance of being met."*
- *"The median project comes in at 75% over the target, and the average project
  comes in at 100% over."*
- *"To have 90% confidence, the project estimate would have needed to be 3-4 times
  greater than the target."*
- And the uncomfortable one: he did **not** observe the cone of uncertainty
  narrowing. *"At all stages of the project the range of uncertainty is about a
  factor of four between the p10 and the p90."*

McConnell's [cone](https://www.construx.com/wp-content/uploads/2019/02/CxWhitePaper_ConeOfUncertainty.pdf)
is the optimistic version, and even it carries two warnings people skip:

> "The Cone of Uncertainty represents the **best case** accuracy it's possible to
> have… It isn't possible to be more accurate; it's only possible to be more
> lucky."

> "The Cone narrows **only** as you make decisions that eliminate variability."

That second line is the link back to the triage. **A sizing pass does not narrow
the cone. The scope conversation it triggers does.** Deciding what we will not
build is the variability-eliminating decision; the numbers were only how we found
out which decisions to have.

The method that does work is boring: count how many tickets of roughly this size
we finished in the last four weeks, and simulate forward. Troy Magennis gives the
spreadsheets away free — the
[Throughput Forecaster](https://github.com/FocusedObjective/FocusedObjective.Resources/raw/master/Spreadsheets/Throughput%20Forecaster.xlsx)
takes a backlog size range and your historical throughput and returns a date with
confidence percentiles. This is
[reference class forecasting](https://arxiv.org/pdf/1302.3642) in a spreadsheet:
Flyvbjerg's point is that you should stop forecasting *this* project from
first principles and instead place it in the distribution of projects like it.
Your own last month is the best reference class you will ever have.

## The conversation the sizing is for

The shape of the negotiation got named in the room, and the examples are better
than any framework:

> "If they're willing to make concessions on some of the stuff they didn't
> before… like, this needs to go here, here, here — or what if we built a
> directory page instead? Or if I can't come up with the image, can they become
> pills? Those are the types of things we didn't push back on that caused a
> little bit of the delay."

Notice that none of those are "can we have more time". They are all *"is there a
cheaper thing that gets you the same outcome"*. That has a name and a framework
with a number in it. DSDM's
[MoSCoW](https://www.agilebusiness.org/dsdm-project-framework/moscow-prioritisation.html)
works by **"fixing time, cost and quality and negotiating features"**, and sorts
everything into:

| | What it means |
| --- | --- |
| **Must have** | The *Minimum Usable SubseT* the project guarantees to deliver |
| **Should have** | Important, painful to leave out, solution still viable without it |
| **Could have** | Wanted, less impact if dropped |
| **Won't have this time** | Agreed as out of this timeframe. Said out loud, not silently dropped |

And the number worth taking into the room: **no more than 60% of effort should be
Must Have.** DSDM states that above 60%, the plan "introduces a risk of failure".
If the eights and thirteens are all Musts, you do not have a plan, you have a
hope.

The fourth row is the one teams skip and the one that actually helps. "Won't have
*this time*" is a decision the client participates in. Things silently left out of
a sprint are a surprise on launch week.

## The gate is the point, not the deadline

The go/no-go gate is the real mechanism here, and it is worth saying why a
checkpoint two and a half weeks before launch is better than more diligence on the
launch date itself.

McConnell again: *"organizations should avoid making commitments until the Cone
has been reduced, because until then the commitments will not be supportable."*
The gate is the date you claim the cone has narrowed. Everything in the triage
exists to make that claim checkable.

Two things make a gate real rather than ceremonial:

- **The criteria are agreed before the meeting.** NASA's flight readiness review
  requires *"a launch decision supported by established go/no-go criteria"* as an
  entrance condition. Agreeing what "go" means on the day you need to decide is
  how a gate becomes a discussion about feelings.
- **Somebody owns saying no.** Google's SRE book describes Launch Coordination
  Engineering as literally *"gatekeepers and signing off on launches determined to
  be 'safe'"*, working from a checklist. Their
  [original checklist](https://sre.google/sre-book/launch-checklist/) is public and
  free, and reading it is a good hour.

Your version of "the criteria" is the thing to write down alongside the triage,
in the same week. Something like: every Must Have is merged or in review; the data
import is complete; nothing in the discussion pile is still unresolved. If those
are not written down before the gate, the meeting will be about vibes.

## Five things worth copying

- **Two hours of silent sizing fits in a Thursday. Two hours of Planning Poker
  does not get through a third of the queue.** If the window is "before Monday",
  the method has to match the window.
- **Clean the board before you size it.** In this session one developer found
  seven tickets that were already done and still sitting in the backlog, and
  another was closing items by fixing data rather than writing code. Queue length
  is noisier than it looks, and estimating finished work is the most avoidable
  waste in the room.
- **Record the disagreement about the date, on both sides.** One developer was
  worried the date had tightened; two other people said most of it was already
  built and felt good about it. Nobody thought the date was impossible. A triage
  is not there to prove a date is possible; it is there to find the handful of
  items that would make it impossible if nobody looked.
- **Size against a named assumption when the blocker is content, not code.** If a
  batch of tickets depends on a data import that has not happened, size them as a
  range and write down which assumption you sized against. The data risks
  themselves are in
  [Bad Data Outlives the Migration](bad-data-outlives-the-migration).
- **A deliberately loose ticket is harder to size, and that is fine.** If your
  tickets carry intent rather than a plan (see
  [Agile Words We Use Loosely](ways-of-working)), some of them will be genuinely
  unsizable on sight. That is what the discussion pile is for.

## Try it yourself

1. **Time-box a silent pass.** Take 20 tickets from any queue, put the scale in a
   spreadsheet column, and place each one in under 30 seconds with no discussion.
   Ten minutes. Count how many you wanted to move twice — that is your discussion
   pile, and it is the only output that matters.
2. **Check the anchor effect on yourself.** Size five tickets. Then have somebody
   say "these are probably about three hours each" and size five more. Compare the
   spread.
3. **Build the forecast the other way.** Count the tickets your team actually
   closed in each of the last four weeks. Divide the remaining queue by the lowest
   of those four numbers. That pessimistic date is usually closer to the truth than
   any total of estimates, and it took you two minutes.
4. **Write the go/no-go criteria before the go/no-go.** Three bullets, today, for
   the next milestone you have. If you cannot write them, the gate is decorative.
