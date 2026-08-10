---
title: Experimentation Velocity
description: Why a testing program is measured in decisions per month, not wins — and how "not worse" is a faster question than "better".
emoji: ⏱️
order: 18
status: learned
session: 11
date: 2026-08-07
tags: [ab-testing, experimentation, decision-making]
resources:
  - title: Experiment velocity planner — NoTambourine
    url: https://notambourine.com/experiment-velocity
    note: The tool this lesson is built around. Put a store's real numbers in and read the planning statement out loud.
  - title: Online Controlled Experiments — Kohavi's KDD 2015 keynote (PDF)
    url: https://exp-platform.com/Documents/2015-08OnlineControlledExperimentsKDDKeynoteNR.pdf
    note: Where the one-third/one-third/one-third split and "experiment often" come from, with twelve years of Microsoft data behind them.
  - title: Trustworthy Online Controlled Experiments (book site)
    url: https://experimentguide.com/
    note: Kohavi, Tang & Ya Xu — the reference book for guardrail metrics, SRM, and running tests you can believe.
  - title: How Not To Run An A/B Test — Evan Miller
    url: https://www.evanmiller.org/how-not-to-run-an-ab-test.html
    note: The classic on peeking. Explains why "let's run it a bit longer" quietly wrecks your error rate.
  - title: Non-Inferiority Designs in A/B Testing (PDF) — Georgi Georgiev
    url: https://www.analytics-toolkit.com/pdf/Non-Inferiority_Designs_in_AB_Testing_2017.pdf
    note: The best practical write-up of non-inferiority for web tests — including the cascading-loss risk.
  - title: Non-Inferiority Clinical Trials to Establish Effectiveness — FDA guidance (PDF)
    url: https://www.fda.gov/media/78504/download
    note: Where the method comes from. Skim the margin chapter; the reasoning transfers exactly.
  - title: Canarying Releases — Google SRE Workbook
    url: https://sre.google/workbook/canarying-releases/
    note: How the big-company version of "ramp it up slowly and kill it automatically" actually works.
  - title: Diagnosing Sample Ratio Mismatch in A/B Testing — Microsoft Research
    url: https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/
    note: The one automated check that tells you an experiment's data cannot be trusted.
---

## The one rule to remember

> **A testing program's job is not to find winners. It is to stop shipping
> losers, quickly.**

That sentence sounds like a downgrade in ambition. It is the opposite. If you
measure a program by wins, you end up running few, large, carefully-argued tests
and treating every flat result as a failure. If you measure it by **decisions per
month**, you run many, decide fast, and the wins arrive as a by-product.

This lesson is the sequel to [A/B Testing & CRO](ab-testing). That one is about
how a single test works. This one is about the *program* — why it moves slowly,
and the two changes that speed it up most: asking a smaller question, and
measuring closer to the change.

## The friction is not technical

Worth saying plainly, because it is counter-intuitive and it was the core of the
session: **the hard part of an experimentation program is not the code.**

The code is a bucket function, a branch, and an event. It is genuinely small —
see the sketch in [A/B Testing & CRO](ab-testing). What is expensive is
everything wrapped around it: getting an idea agreed, deciding whether it is more
important than the next idea, aligning on what would count as success, and then —
after the result lands — arguing about what the result meant.

The arithmetic Tom put on this is the useful bit:

> Twelve people spending an hour aligning on whether an experiment is worth
> running costs more than just building both experiments.

So when the question is *"should we run A or B first?"*, the default answer
should usually be **both**. Prioritisation is worth doing when the queue is
enormous or the builds are genuinely expensive — that is what RICE is for in the
[A/B testing lesson](ab-testing) — but the moment ranking two cheap changes takes
longer than shipping them, the ranking is the waste.

This is not just our opinion. Kohavi's conclusion after twelve years of running
Microsoft's experiment platform was the same: *"Avoid the temptation to try and
build optimal features through extensive planning without early testing of
ideas. Experiment often."* He quotes Mike Moran: **"If you have to kiss a lot of
frogs to find a prince, find more frogs and kiss them faster."**

## Why most ideas do not win — and why that is fine

Every test does one of three things. Rough industry numbers, also in the
[A/B testing lesson](ab-testing): about **30% win, 50% do nothing, 20% lose**.
Kohavi's published figures from Microsoft are close and easier to remember —
*one third* positive and significant, *one third* flat, *one third* negative and
significant — and he notes that at Bing, a heavily-optimised product, the success
rate is **lower**. His summary: *"If you start running controlled experiments, you
will be humbled."*

The interesting part is not the split. It is how differently teams handle the
three outcomes:

| Result | What the room does | What it should do |
| --- | --- | --- |
| **Win** (~30%) | Champagne. "My idea worked." | Ship it, then ask what *else* is true in that direction. |
| **Flat** (~50%) | Panic. "I was sure this would win. Can we explain it? Can we run it longer?" | Nothing to explain. You are now free. Ship it if you like it, or drop it — and stop testing near-identical ideas. |
| **Lose** (~20%) | Panic, differently. "Did we run it wrong? Can we trust the numbers?" | **Bank the win.** You were about to ship that. You didn't. |

Two of those three reactions are the actual bottleneck in the program.

**The flat result.** "Let's run it a bit longer and see" feels like diligence.
It is statistically corrosive. Evan Miller's classic write-up puts a number on
it: stopping the moment you see p < 0.05, while checking continuously, turns a
5% false-positive rate into about **26%**. Peek ten times and your "1%
significance" is really about 5%. You do not get to extend a test because you
did not like the answer — decide the duration up front, or use a method designed
for continuous monitoring (sequential testing, sometimes sold as "always-valid"
p-values, which Optimizely and others implement precisely so peeking stays
honest).

**The loss.** A prevented loser is money earned, and it does not feel like it
because there is no line item for revenue you did not destroy. Tom's version:
*"You're no longer walking into the door every morning and hitting yourself in
the head."* Keeping the control after a losing test **is** the win — it is the
same money as a successful launch, arriving invisibly.

## The two questions a test can answer

This is the genuinely new idea in the session, and the one the
[velocity planner](https://notambourine.com/experiment-velocity) is built on.
Most teams only ever ask the first question:

| | **Superiority test** | **Non-inferiority test** |
| --- | --- | --- |
| The question | "Is B *better* than A?" | "Is B *not meaningfully worse* than A?" |
| Shape | Two-sided — different in either direction | One-sided — only the downside matters |
| You must agree up front on | The smallest improvement worth having | The largest loss you are willing to accept (the **margin**) |
| A pass means | You have evidence of a gain | You have ruled out the loss you named. **Not** that you gained anything. |
| Use it when | Proof of improvement is what unlocks the release | The change ships for another reason and you only need to know it is safe |

That second column is not a shortcut somebody invented for web analytics. It
comes from clinical trials: when you already have a working drug, it is
unethical to test a new one against a placebo, so you test whether it is *not
worse than the existing treatment by more than a pre-agreed margin*. The FDA has
published guidance on how to choose that margin since 2016. A non-inferiority
test with a margin of zero simply *is* a one-sided superiority test — same
machinery, different question.

### Why it is so much faster

Because the question is smaller, the evidence needed is smaller. In Georgiev's
worked comparison, a non-inferiority design for an easy, reversible change —
ruling out a 2% loss — needed roughly **8% of the sample size** of a superiority
test looking for a 5% gain: an order-of-magnitude speed-up on the same traffic.

Read that comparison carefully, because it is not a free lunch. Part of the
saving comes from the smaller question, and part comes from the margin (2%) being
smaller than the effect the superiority test was hunting (5%). The general rule
still holds — *ruling out a loss is cheaper than proving a gain* — but the size of
the saving depends entirely on the margin you pick.

When does this fit our work? More often than you would think:

- A **rebrand or redesign.** The honest promise was never "this makes more
  money". It was "this does not lose money by confusing people".
- A **refactor or platform migration** with real engineering upside — the reason
  to ship is maintenance cost, and you need to know the customer did not suffer.
- **Removing** something: a field, a step, a script. The win is speed and
  simplicity; the test is whether conversion held.
- Anything **cheap, reversible, and uncontroversial**. If re-testing later costs
  nothing, demanding proof of a lift is expensive theatre.

Which is exactly the planner's framing: *"A safe result rules out the agreed
loss. It does not prove a win."* Say that sentence when you present the result,
every time, and you will never oversell one.

### The catch, and it is a real one: biocreep

Present the honest counter-argument along with the method. If you accept "no more
than 2% worse" five times in a row, you can end up **10% worse** overall, with
every individual test having passed. Clinical statisticians call this
**biocreep**; in web testing it is cascading loss. Small acceptable losses
compound into one unacceptable one, and nothing in the individual tests will ever
flag it.

The mitigation is simple and belongs in any program that adopts this:

> Every few cycles, run one test with the **current live version as the variant
> and a version from several tests ago as the control.** If the accumulated drift
> is real, that test finds it. Nothing else will.

Two supporting habits: set the margin *before* you see data (a margin negotiated
after the fact is not a guardrail, it is a rationalisation), and keep the margin
tight enough that you would genuinely be willing to lose it — 5% relative on
purchase conversion sounds small until you multiply it out with the arithmetic in
[Marketing & Business Impact](marketing-business-impact).

## Choose the lens: measure close to the change

The single biggest lever on how fast you can decide is **which metric decides**.
Rare events need enormous traffic; common events do not.

Here is the planner's illustrative store — 250,000 sessions a month, $85 average
order, a homepage test reaching 80% of traffic — and how long each choice of
decision metric takes to reach a safe answer:

| Decision metric | Baseline rate | Days to decide |
| --- | --- | --- |
| Bounce rate | 38% | 14 (the floor) |
| PDP view rate | 56% | 14 (the floor) |
| Add-to-cart rate | 8.5% | 14 |
| Begin-checkout rate | 4.7% | 25 |
| **Purchase conversion** | **2.9%** | **41** |

Same test, same traffic, same change. Deciding on purchases takes **27 days
longer** than deciding on product-page views. And note the floor: no lens goes
below 14 days, because you always run whole weeks — weekend shoppers are not
Tuesday shoppers, and a test that skips a weekend has measured a different
population.

Read the table honestly in both directions:

- **Moving up the funnel buys speed.** A homepage hero does not cause purchases;
  it causes clicks to product pages. Measuring the thing your change actually
  touches is not cheating, it is better measurement.
- **Moving up the funnel costs certainty.** More product-page views is not more
  revenue. You are trusting that the funnel below your metric stays roughly
  constant — usually true, occasionally very wrong (a change that pushes people
  to the wrong products lifts PDP views and lowers revenue).

The rule of thumb: **decide on the nearest metric your change plausibly causes,
and keep purchase conversion as a guardrail rather than the verdict.** If the
guardrail moves badly, ignore the verdict.

## Fix two, calculate the third

Three numbers define a test plan, and they trade off against each other. Pick
two, and the third is determined:

| | What it is | Planner example |
| --- | --- | --- |
| **Duration** | How long until you can decide | 41 days |
| **Evidence threshold** | How sure you need to be | 90% |
| **Acceptable loss** | The margin — the worst you will tolerate | 5% relative (0.15 percentage points on a 2.9% baseline) |

Want to decide sooner? Accept a bigger possible loss, or accept less certainty,
or change the lens. There is no fourth option. Any conversation that demands
"faster *and* more certain *and* tighter" on the same metric and traffic is
asking for something that does not exist — and being able to say that calmly, with
the table above, is most of the value of understanding this.

**Reading the forecast honestly.** The planner reports a *distribution*, not a
date: "80% of simulated tests reach 90% evidence within 41 days" — that is what
**P80** means, 80 out of 100 simulated runs. In that same scenario P50 was 15
days and P90 was 60. So the typical run finishes in a fortnight and the unlucky
one takes two months. Plan the calendar on P80, not on P50, or every test will
feel late.

One more phrase to keep: this is a forecast *assuming the variation performs like
the control*. It tells you when you would have enough evidence if nothing is
wrong. It cannot tell you when you will find a win.

### The bottleneck nobody notices: lanes × duration

Now do the division the planner's assumptions imply, because this is the part
that reframes the whole program. Its modelled scenario assumes **4 test-ready
changes a month** and **1 concurrent test lane** with a 41-day purchase-lens
test:

```
365 days ÷ 41 days per test × 1 lane  ≈  8 decisions a year
48 test-ready changes a year          →  40 never get tested
```

The idea pipeline is not the constraint. **Lanes × duration is.** Which means the
two things that actually raise a program's throughput are:

1. **Shorter tests** — mostly by choosing a closer lens, sometimes by asking the
   non-inferiority question instead.
2. **More lanes** — running several tests at the same time. This worries people,
   and it should worry them less than it does: randomisation spreads each test
   evenly across the other tests' groups, and you cannot hold the world still
   anyway (traffic mix changes daily). Overlap is a smaller risk than a queue.

The planner's own headline follows from that arithmetic: 8 completed decisions a
year against 2, on the same stream of ideas — the gain comes from the decision
*rule*, not from having better ideas.

## The version we cannot have, and the part we can

Tom described how this works at Facebook and Google scale: every merged branch
gets a deployed instance, takes 0.01% of traffic, and an automated decision tree
kills it if any signal looks bad or ramps it to 1% and upward if it looks fine.
There is no single version of those products — you are in a thousand experiments
at once.

That is real, it has a name — **progressive delivery** — and the public playbook
is Google's SRE workbook chapter on canarying. The shape is always the same: send
a small slice of traffic to the new version, analyse it automatically against the
old one, then widen the slice in steps (something like 1% → 5% → 25% → 50% →
100%), pausing or rolling back automatically the moment a signal goes bad. It is bought with two luxuries we do
not have: enormous traffic (so 1% is still statistically meaningful in hours) and
years of platform investment.

We have Shopify and JavaScript. So take the shape, not the machinery:

| Their version | Our version |
| --- | --- |
| Automated traffic ramp per branch | A sticky 0/1 bucket per visitor from a named experiment ([the code](ab-testing)) |
| Automated kill on bad signals | A guardrail metric someone actually looks at, and a flag you can flip to 0 without a deploy |
| Thousands of concurrent experiments | Two or three lanes, and a convention for naming them |
| Statistical significance in hours | Whole weeks, and a decided duration |

The one piece worth copying above all others is the **kill switch**. Being able
to turn an experiment off in seconds, without a deploy, is what makes it
psychologically safe to launch more of them — and psychological safety is the
actual throughput constraint, as the whole first half of this lesson argues.

## Before you trust any of it: valid measurement

A better decision rule cannot repair broken measurement. It makes broken
measurement *worse*, because you act on it sooner. The planner puts a six-item
checklist in front of the forecast for exactly this reason, and every item is a
developer's job:

| Check | What goes wrong without it |
| --- | --- |
| **The assignment unit is defined** | Bucketing per *session* instead of per visitor means the same person sees both versions. |
| **Returning units keep one variation** | A bucket that is not sticky mixes the groups and washes out any real difference. |
| **Exposure logging covers both arms** | If only the variant fires an event, you cannot compute the control's rate at all. |
| **Metric definitions match across arms** | Counting "add to cart" differently in the two versions produces a difference that is pure instrumentation. |
| **Traffic allocation is documented** | Nobody can reproduce or debug a split whose actual ratio is unknown. |
| **Bot and internal traffic rules exist** | Bots and our own QA sit in one bucket and invent a winner. Kohavi reports **over 50% of Bing's traffic is bot-generated**. |

Two checks to add from the literature:

- **Sample Ratio Mismatch (SRM).** You planned a 50/50 split; you observe
  52/48. That gap means something in the pipeline is dropping or misassigning
  users, and until you know what, *no* result from that test is usable. Kohavi
  compares running without an SRM check to a car without seatbelts. It is one
  cheap automated test and it should gate every result.
- **Twyman's law.** *"If you see a massive improvement to your OEC, call
  Twyman's law and find the flaw."* A spectacular result is more likely to be a
  bug than a breakthrough. Triple-check before you celebrate — and "OEC" here is
  Kohavi's term for the single agreed metric a test is judged on, which is worth
  arguing about *once*, up front, rather than per test.

## What velocity is actually worth — and the honest read

The planner models the money: on its illustrative store, switching from
"only ship proven winners" to "rule out meaningful harm" produces a median
**+$36k** over twelve months, **8** completed decisions instead of 2, and
**2** harmful changes caught.

Now read the rest of the output, because this is the part that earns the tool
trust: the likely range is **−$156k to +$261k**. It crosses zero. The honest
summary is *"the median case is positive and the spread is wide"* — not "this
makes $36k".

It also reports that the faster process caught **no more** harmful releases than
the current one. That is not a flaw in the model, it is the model being candid:
the gain is throughput, not safety. Both policies stop the bad stuff; one of them
gets through six more decisions a year while doing it.

Treat the whole thing as what it says it is on the tin: *"Planning model. Not a
live experiment monitor."* Its job is to make an argument concrete before the
work starts — to turn "we should test more" into "here is the metric, here is the
margin, here is the number of days, here is what we will be able to say at the
end". That artefact — the **planning statement** — is the deliverable:

> *If the variation performs like the control, 80% of simulated tests reach 90%
> evidence within 41 days. The variation can show no more than a 5.0% relative
> decrease in purchase conversion.*

Write that sentence before a test starts and most of the arguments described at
the top of this lesson never happen.

## The counter-argument worth keeping

The strongest case against velocity-first is the **local maximum**, and it is a
fair one. A stream of small, safe, fast tests optimises your current design
toward its ceiling — and then keeps confirming that ceiling. A genuinely
different design will often *lose* its first test, because it is being compared
against something years of tuning have polished, and because it is new and
unfamiliar to returning users. Optimise long enough and you get the best possible
version of a page you should have replaced.

Both things are true, and they are not actually in conflict:

- **High velocity for cheap, reversible changes.** This is where the
  non-inferiority question, the closest sensible lens, and "just run both" all
  belong. Most of the queue lives here.
- **A small number of deliberate big swings**, judged differently: longer
  windows, non-inferiority against the old design rather than a demand for
  immediate lift, and qualitative evidence (user testing, support tickets, sales
  calls) alongside the numbers. You are asking "is this a better foundation?",
  which a two-week conversion test genuinely cannot answer.

The failure mode to avoid is treating every change as a big swing. That is where
the twelve-person alignment call comes from — and it is how a program ends up
with two carefully-argued tests a year and no idea whether either worked.

## Try it yourself

1. Open the [velocity planner](https://notambourine.com/experiment-velocity), enter a real store's monthly sessions and AOV, and change only the decision metric. Write down the days for the purchase lens and for one lens above it. What would you have to believe for the faster lens to be a fair decision?
2. In the same planner, fix duration at 14 days and let it calculate the acceptable loss. Is that margin one you would actually sign your name to? If not, you have just learned something about the traffic you have.
3. Do the biocreep arithmetic on paper: five consecutive changes, each 2% worse, on a 2.9% purchase conversion and $85 AOV at 250,000 sessions a month. How much annual revenue disappeared while every single test "passed"?
4. Take one ticket in your current sprint and write its planning statement in the planner's format — metric, evidence threshold, margin, days. If you cannot name the margin, that is the conversation to have before you build it.
