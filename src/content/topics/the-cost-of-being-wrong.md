---
title: The Cost of Being Wrong
description: Why the fear of a miss usually costs more than the miss — expected value, queues and Amdahl's law, in plain numbers.
emoji: ⚖️
order: 36
status: learned
session: 21
date: 2026-10-23
tags: [decisions, risk, flow, process]
resources:
  - title: 2016 Letter to Shareholders — Amazon (PDF)
    url: https://s2.q4cdn.com/299287126/files/doc_financials/annual/2016-Letter-to-Shareholders.pdf
    note: 'The "70% of the information" rule, and the sentence this whole lesson hangs on: "being wrong may be less costly than you think, whereas being slow is going to be expensive for sure."'
  - title: 2015 Letter to Shareholders — Amazon (PDF)
    url: https://s2.q4cdn.com/299287126/files/doc_financials/annual/2015-Letter-to-Shareholders.PDF
    note: Where one-way and two-way doors come from. Read the warning about using the slow process for every decision.
  - title: "Validity of the Single Processor Approach… — Gene Amdahl, 1967 (PDF)"
    url: https://www3.cs.stonybrook.edu/~rezaul/Spring-2019/CSE613/reading/Amdahl-1967.pdf
    note: The original Amdahl's law paper. Three pages, no formula in it — just the argument that the slow part you did not speed up sets the limit.
  - title: "A Proof for the Queuing Formula: L = λW — John Little, 1961 (PDF)"
    url: https://fisherp.mit.edu/wp-content/uploads/2020/05/ContentServer.pdf
    note: Little's law from the source. The first paragraph is enough; it also lists the conditions the law needs.
  - title: Little's Law as Viewed on Its 50th Anniversary — John Little
    url: https://projectproduction.org/journal/reprint-littles-law-as-viewed-on-its-50th-anniversary/
    note: Little himself, fifty years later, on how the formula ended up running factories and software teams. Much easier to read than the proof.
  - title: Kingman's formula — Wikipedia
    url: https://en.wikipedia.org/wiki/Kingman%27s_formula
    note: Why a team at 95% busy has a far longer queue than a team at 80%. The ρ / (1 − ρ) part is the whole story.
  - title: Omission and Commission in Judgment and Choice — Spranca, Minsk & Baron, 1991
    url: https://www.sas.upenn.edu/~baron/papers.htm/oc.html
    note: The research behind "inaction is also a decision". People judge harm caused by doing worse than the same harm caused by not doing.
  - title: "The Reversal Test — Bostrom & Ord, 2006 (PDF)"
    url: https://www.nickbostrom.com/ethics/statusquo.pdf
    note: 'A formal version of "if you were already there, would you go back?" Section I is the useful part.'
  - title: Announcing the 2025 DORA report — Google Cloud
    url: https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report
    note: 'Survey data on AI and delivery: faster throughput, worse stability, and "AI doesn''t fix a team; it amplifies what''s already there." Check dora.dev for the latest year.'
  - title: Elo rating system — Wikipedia
    url: https://en.wikipedia.org/wiki/Elo_rating_system
    note: The expected-score formula, if you want to check the chess numbers in this lesson yourself.
  - title: "Facebook's F8 2014: \"Move fast with stable infra\" — TechCrunch"
    url: https://techcrunch.com/2014/04/30/facebook-api-guarantee/
    note: The counter-argument from the company that made "break things" famous. Fixing the breakage had started to slow them down.
decks:
  - title: The Cost of Being Wrong (October 2026)
    file: the-cost-of-being-wrong-2026-10.pdf
    note: The 18 slides from session 21. The charts are illustrative units, not measured data.
---

## The one rule to remember

> **Fear of being wrong usually costs more than being wrong. Judge a decision by
> what it pays on average, not by whether this one try worked — and keep every
> miss cheap to close.**

Most people hate being wrong. So when a choice comes up, they quietly add the
*pain* of a possible mistake on top of its real price, and they wait. But waiting
has a price too, and nobody sees it. This session put numbers on both sides.

Jeff Bezos said the same thing in Amazon's
[2016 shareholder letter](https://s2.q4cdn.com/299287126/files/doc_financials/annual/2016-Letter-to-Shareholders.pdf):

> "Most decisions should probably be made with somewhere around 70% of the
> information you wish you had. If you wait for 90%, in most cases, you're probably
> being slow… If you're good at course correcting, being wrong may be less costly
> than you think, whereas being slow is going to be expensive for sure."

Read the middle of that again: **"if you're good at course correcting."** The
whole lesson depends on it. Speed is only cheap when a mistake is cheap to undo.
Where it is not — a database migration, a payment flow — you slow down on purpose.
That boundary gets its own section at the end.

Why it matters for us: we hand tickets to AI agents, we roll forward after
launches, and we wait on clients every week. All three are bets. This lesson is
how to price them.

## Score the decision, not the result

The idea comes from games. A good player does not judge one move by whether
it won. They judge the decision: **how often does it win, and what does it pay,
against how often does it lose, and what does that cost?** That is called
**expected value (EV)**:

```text
EV  =  win rate × payoff   −   miss rate × cost
```

If EV is above zero, the choice pays off over many tries, even if it fails today.

Chess shows why one result tells you little. In the Elo rating system, a player
rated 100 points higher is expected to score about **64%** against the weaker
player — not 100%. The stronger player still loses or draws about a third of the
time. To expect three wins out of four you need a gap of about 200 points. (In the
session the 100-point gap was said to mean "three out of four" — the
[Elo formula](https://en.wikipedia.org/wiki/Elo_rating_system) gives 64%. The
point stands, and it is even stronger: good players lose a lot.)

### Win rate is only half the math

People often think a choice must be right more than half the time to be worth
it. That is only true when a win and a miss are the same size. The break-even
win rate is:

```text
break-even win rate  =  cost  ÷  (cost + payoff)
```

| You risk | You can win | You need to be right… |
| --- | --- | --- |
| 1 | 1 | 50% of the time |
| 1 | 2 | **33%** of the time |
| 1 | 3 | 25% of the time |
| 1 | 9 | 10% of the time |

So the useful question is never "am I sure?". It is **"do the wins pay for the
misses?"** When a miss costs almost nothing, you can be wrong most of the time
and still come out ahead.

## Cheap tries beat one careful shot

Here is the same math applied to work. Say waiting for a full answer and then
building costs **4 units** of time. A quick try costs **1 unit**, and if it
misses you close it and try again.

```text
Ask, wait, then build:     [        4 units, one shot        ]
Try, close, try again:     [miss] [miss] [miss] [ship]   = 4 units
```

If each try works one time in four, you need four tries on average — the same 4
units. So **a try that is 4× cheaper only needs to be right 25% of the time to
break even.** Anything above 25% is pure gain.

And it gets better than the diagram. A miss is not wasted: it shows you what
the ticket did not say clearly. So the second try usually lands more often than
the first.

### "What if it's wrong?" is the wrong question

| Old question | Better question |
| --- | --- |
| "What if it's wrong?" | "What does a miss cost me?" — usually a look and a close |
| "Should I try this?" | "What do I point it at?" — try widely, keep what lands |
| "Why did it miss?" (as blame) | "What was unclear in the ticket?" — fix that, too |

One condition, and it is not optional: **this only holds while closing a miss
stays cheap.** Keep each try small. A try that takes a day to review is not a
cheap try.

## Roll forward: a fix costs 10%, a hold costs 100%

When you are unsure about a change, you have two options:

| | What happens | Cost if you were wrong |
| --- | --- | --- |
| **Roll forward** | Ship the change, fix what comes back | A follow-up ticket — roughly 10% more work |
| **Hold for feedback** | The PR (pull request) waits for an answer | All of it is stalled — 100% of the value is late |

The numbers are illustrative, but the shape is real. The same goes for undoing
something: **recommend the undo after the work, don't ask permission before it.**

The session gave a simple test for this:

> "If I was already at place XYZ, would I roll back to place ABC?"

If the honest answer is "no, I would stay", then go. Philosophers Bostrom and Ord
called a stricter version of this the
[reversal test](https://www.nickbostrom.com/ethics/statusquo.pdf) (2006): if you
would not move *back* from the new state, then you need a real reason why the
old state is better. If you cannot find one, the hesitation is probably status
quo bias — the habit of preferring things as they are.

The conditions that make rolling forward safe (someone free to fix it, risky
things held back) are in [The Week Before Launch](the-week-before-launch).

## Waiting is never free

A blocked ticket *feels* free. You are waiting on an answer, so you pick up
another ticket. Nobody is idle. But that parked ticket is not free — it makes
**every** ticket slower. This is **Little's law**, proven by John Little at MIT in
[1961](https://fisherp.mit.edu/wp-content/uploads/2020/05/ContentServer.pdf):

```text
lead time  =  work in progress  ÷  throughput
```

- **Lead time** — how long a ticket takes from start to done, on average.
- **Work in progress (WIP)** — how many tickets are started but not finished.
- **Throughput** — how many tickets the team finishes per week.

A worked example:

| Tickets in progress | Team finishes per week | Average lead time |
| --- | --- | --- |
| 10 | 5 | 2 weeks |
| 15 (five parked, waiting on answers) | 5 | **3 weeks** |

The team did not get slower. Nothing broke. Every ticket simply takes 50% longer,
because five extra tickets are sitting in the line. And parked tickets cost more
than their place in line: PRs go stale, branches need rebasing, and someone has
to rebuild the context in their head when the answer finally comes.

One more thing from queueing theory. The busier a team is, the faster waiting
time grows — and it does not grow in a straight line.
[Kingman's formula](https://en.wikipedia.org/wiki/Kingman%27s_formula) has a
part that looks like `busy ÷ (1 − busy)`:

| How busy the team is | Waiting factor |
| --- | --- |
| 80% | 4 |
| 90% | 9 |
| 95% | 19 |

Going from 90% to 95% busy roughly **doubles** the wait. A team with no slack
has a long queue, even if everyone works hard.

## Amdahl's law: why faster coding barely moves the ticket

A ticket is not just coding. It moves through many steps:

```text
idea → prioritize → assign → clarify → build → review → client QA → sign-off → deploy
```

AI speeds up one of those steps — **build**. Gene Amdahl, a computer architect at
IBM, wrote down the limit on this in
[1967](https://www3.cs.stonybrook.edu/~rezaul/Spring-2019/CSE613/reading/Amdahl-1967.pdf),
for computers rather than tickets: speeding up one part is "wasted unless it is
accompanied by achievements in sequential processing rates of very nearly the same
magnitude." In plain words: **the part you did not speed up sets the limit.**

```text
new time  =  (the part you didn't speed up)  +  (the part you did ÷ speed-up)
```

Let's run the session's examples:

| Build is… of the ticket | Build gets… | Whole ticket gets… |
| --- | --- | --- |
| 20% (2 of 10 days) | 2× faster | **10% faster** (10 days → 9) |
| 30% | 10× faster | 27% faster |
| 30% | infinitely fast | **30% faster — the ceiling** |

That last row is the important one. Our rough estimate is that build is about
30% of a ticket for us. Even a perfect, instant coder could not make our tickets more
than 30% faster. **The other 70% is handoffs and waiting** — and that is where the
real speed is hiding.

Survey data agrees. Google's DORA (DevOps Research and Assessment) team found in
[2025](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report)
that teams using AI ship more, but with less stable releases, and that teams
"constrained by tightly coupled systems and slow processes see little or no
benefit." Their summary: *"AI doesn't fix a team; it amplifies what's already
there."* (Their 2024 report found a small *drop* in throughput. The numbers move
each year — check [dora.dev](https://dora.dev/research/) for the latest.)

## Four ways fear asks for control

Clients feel the fear of being wrong too. It shows up as reasonable-sounding
requests. The talk called them "silent failures": they make the person asking feel
safer, and they slow everyone down.

| What fear sounds like | What is really happening | What we can say |
| --- | --- | --- |
| "Let's wait and decide later." | **Inaction is also a decision.** People judge harm from acting more harshly than the same harm from not acting. | "Waiting is a choice too. Here is what it costs per week." |
| "Let's not rush this." | **The cost of delay is invisible.** A wrong change makes a visible failure; delay makes lost time that nobody can point at. | Put a number on the delay: days, tickets blocked, sales missed. |
| "Can you pull one more analysis?" | **A request for certainty is a request for work.** Asking costs nothing; answering can cost days. | "Sure — if it comes back above 10%, what do we do? And below?" |
| "I need to be confident before we go." | **Whoever buys certainty should see its price.** The person asking gets the safety; the whole team pays in speed. | "This check will take four days of team time. Is it worth that?" |

The first row has a name: **omission bias**, shown by Spranca, Minsk and Baron
in [1991](https://www.sas.upenn.edu/~baron/papers.htm/oc.html). In their
experiments people rated a harm caused by *doing* something as worse than the
same harm caused by *not doing* something. So a delay feels safe, even when it is
not.

The third row is the most useful tool on this page. Ask: **would any possible
answer change the decision?** If the client would go ahead whether the number is
5% or 15%, the analysis is worth nothing, and you can say so kindly. If the
answer does matter, ask them to write the decision down *now* — "above 10% we
do A, below we do B" — so the result triggers action instead of another meeting.

Someone in the room offered the right slogan for this, from G.K. Chesterton's
[*What's Wrong with the World*](https://www.gutenberg.org/ebooks/1717) (1910):
**"If a thing is worth doing, it is worth doing badly."** A rough version now
usually beats a perfect version later.

## The boundary: one-way doors get the slow lane

None of this means "go fast on everything." Bezos split decisions into two kinds
in his
[2015 letter](https://s2.q4cdn.com/299287126/files/doc_financials/annual/2015-Letter-to-Shareholders.PDF):

- **Two-way doors** — you can walk back out. A page update, a copy change, a new
  section. The cost of being wrong is low. **Roll forward.**
- **One-way doors** — you cannot easily come back. The cost of being wrong is
  high. **Slow down: ask, review, test.**

The rule of thumb from the slides: **if you can't undo it in an hour, it gets
the slow lane.** The usual one-way doors:

- Data migrations (especially on production)
- Auth and permissions
- Billing and payments
- Public launches

Notice that this is the *same* math, not an exception to it. A one-way door is a
bet where a miss costs a lot, so the break-even win rate is high and you need
more certainty first. Most of what clients flag as risky is a two-way door. Part
of our job is to say which is which. A worked example of telling them apart is in
[Don't Delete What You Didn't Create](deleting-what-you-didnt-create).

## The strongest arguments against this

A lesson that only shows one side ages badly. Three honest objections:

**1. Averages only help if you survive to the next try.** Expected value
assumes you get to play many times. One big mistake that you cannot undo — lost
customer data, a broken checkout on launch day — does not average out. You do
not get the other 99 tries. *This is exactly why one-way doors get the slow
lane.* The EV rule is for many small, reversible bets, not one large one.

**2. A miss is not really free.** Closing a bad PR costs a reviewer's attention,
and review is a queue too (see Little's law above). If misses pile up, they slow
the review step, and the speed gain disappears. DORA's finding that AI use comes
with *less stable* releases is this effect at scale. Facebook learned it too: it
made "move fast and break things" famous, then in
[2014](https://techcrunch.com/2014/04/30/facebook-api-guarantee/) changed the
motto to "move fast with stable infra", because fixing the breakage had started
to slow them down. **Middle ground:** keep tries small, close misses fast, and
track how much review time the misses take. If it grows, the tries are too big.

**3. Pushing back on a client costs trust.** A client who feels dismissed will
ask for *more* control, not less. Their fear is often about their own boss, not
about us. **Middle ground:** don't argue with the fear — price it. Show the cost
of the delay in their terms, offer the decision-tree question, and let them
choose. They stay in control; they just see the bill.

## How we use this day to day

Before you wait on anything, run through this:

1. **Is it a one-way door?** (Can I undo it in an hour?) If not → slow lane: ask,
   review, test. If yes → keep going.
2. **What does a miss cost?** If it is "a look and a close", try it now.
3. **Am I parking a ticket?** Every parked ticket makes all tickets slower. Make a
   recommendation and move, rather than asking and waiting.
4. **Is the question to the client a real decision?** Ask "what would you do if
   the answer were X?" before anyone spends time finding the answer.
5. **Where does the ticket actually wait?** Speeding up the build step has a
   ceiling. Handoffs — engineering → PM, PM → client, client → engineering — have
   much more room.

## Field notes

**The fast lane is the live example.** Some of our tickets can be picked up by an
AI agent as a first try. Even if the agent is right only 25% of the time, the
misses cost almost nothing — we close the PR — so the fast lane pays for itself.
This only works because we decided, as a team, not to hide that an AI opened a
PR. A culture where an AI PR is normal, and closing one is not embarrassing, is
what keeps the cost of a miss near zero.

**Build is about 30% of a ticket for us.** A rough estimate, not a measurement.
Using the Amdahl table above, that means AI build speed alone can never make our
tickets more than ~30% faster. The other ~70% lives in clarify, client QA and
sign-off. The goal for the next few quarters: make the handoffs consistent and
automate them where we can.

**Client examples from the talk:**

- **"What happened to conversion rate last week?"** turned into four days of
  work at one client, to explain a viral video from the year before. Executives
  felt better; nothing changed for users. That is row 3 of the fear table: a
  request for certainty that nobody priced.
- **An About Us page** felt risky to a client because it shows the team. But it
  is a company page, not something users create. A two-way door: it went live
  months ago and gets updated as feedback comes in.
- **A client CEO who edits the site personally** is being nudged to submit
  tickets instead, so the work goes through the team's queue. The first ticket
  came in the day before this session.

**Two roll-forward calls from the same standup.** One engineer suggested handing
two big pages to client QA for the UI check, even though some functionality was
still pending — *"we shouldn't hold on the QA to that."* That is "a fix costs
10%, a hold costs 100%" in practice: the UI review runs in parallel instead of
queueing behind the last feature. In the other direction, a data migration script
was merged to dev but deliberately **not yet executed**. Merging code is a
two-way door; running a data migration is a one-way door, so it waits for its own
careful step (more in [Bad Data Outlives the Migration](bad-data-outlives-the-migration)).

**A note on the game examples.** The talk illustrated expected value with poker.
This write-up keeps the math and uses work and chess examples instead — the
break-even formula is the same whatever you plug into it.

**How the deck was made.** The slides were written in Markdown and built with the
Marp CLI from a brand kit. Pointing an AI assistant at the brand kit produces
slides in the same style. Related: [Diagrams as Code](diagrams-as-code).

## Try it yourself

1. **Price one ticket you are waiting on.** Pick a ticket that is blocked on a
   question. Write down: what would I build if I had to guess now? What would it
   cost to fix if I guessed wrong? If the fix is smaller than the wait, make the
   guess and send it as a recommendation. 10 minutes.
2. **Run Little's law on your own board.** Count tickets in progress (including
   blocked ones). Count tickets finished in the last two weeks and halve it. Divide
   the first number by the second — that is your average lead time in weeks. Now
   remove the blocked tickets and divide again. The difference is what waiting
   costs you.
3. **Find your Amdahl ceiling.** Take one ticket you closed recently. Roughly how
   many days was it open, and how many of those were you actually building? Build
   days ÷ total days is the most that faster coding could ever save on that
   ticket.
4. **Sort five decisions into doors.** List five things you or a client hesitated
   on this month. Mark each one "two-way" (undo in an hour) or "one-way". For each
   two-way door, write one sentence on what it would have cost to just do it.
