---
title: Onboarding Yourself
description: How to get useful in your first two weeks on a codebase nobody has time to explain — and the one thing only a newcomer can fix.
emoji: 🧭
order: 31
status: learned
session: 19
date: 2026-09-16
tags: [onboarding, process, documentation]
resources:
  - title: Claude Code best practices — Ask codebase questions
    url: https://code.claude.com/docs/en/best-practices
    note: Anthropic's own onboarding section. The example questions are the ones you would ask a senior, and that is the point.
  - title: Common workflows — understand a new codebase
    url: https://code.claude.com/docs/en/common-workflows
    note: The documented step-by-step, including asking for a glossary of project-specific terms.
  - title: CLAUDE.md memory
    url: https://code.claude.com/docs/en/memory
    note: 'The test for what belongs in it: "a new teammate would need the same context to be productive".'
  - title: GitLab handbook — general onboarding
    url: https://handbook.gitlab.com/handbook/people-group/general-onboarding/
    note: A public handbook that says out loud what most companies only imply — take two full weeks, and do not feel you have to contribute heavily.
  - title: How we use Golden Paths to solve fragmentation — Spotify Engineering
    url: https://engineering.atspotify.com/2020/08/17/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem/
    note: '"Rumour-driven development" is the best name anyone has given the failure mode this lesson is about.'
  - title: Scripts to Rule Them All — GitHub
    url: https://github.com/github/scripts-to-rule-them-all
    note: The cure for a half-done setup checklist. Same script names in every repo, so contributors learn one pattern. The repo is archived; the convention is not.
  - title: How To Ask Questions The Smart Way — Eric S. Raymond
    url: http://www.catb.org/~esr/faqs/smart-questions.html
    note: Skip the tone, keep the "Before You Ask" checklist and the "describe the goal, not the step" section. (The link may warn about the certificate; it is fine.)
  - title: Don't ask to ask, just ask
    url: https://dontasktoask.com/
    note: One short page that will save you and everyone around you a lot of round trips.
  - title: No Hello
    url: https://nohello.net/en/
    note: The other half of the same idea, with the phone-call analogy that makes it stick.
  - title: How to Contribute to Open Source
    url: https://opensource.guide/how-to-contribute/
    note: Where the 28% figure comes from — a documentation fix is a real contribution, not a consolation prize.
  - title: Documentation quality — DORA
    url: https://dora.dev/capabilities/documentation-quality/
    note: The research behind "write it down". Read the caveat in the lesson before quoting the percentages.
  - title: Brooks's law
    url: https://en.wikipedia.org/wiki/Brooks%27s_law
    note: Why a new person costs a senior person time, stated in 1975 and still the constraint.
---

## The one rule to remember

> **Spend the first hour with the repository, not with a person. Then spend the
> person's hour on the questions the repository could not answer.**

That is not a rule about being self-sufficient or not bothering anyone. It is a
rule about what a senior's hour is *for*. Anything in the code is a bad use of
it. Anything that is only in their head is the best use of it there will ever be.

## The hour before the meeting

This came out of a new developer's first standup. The exchange worth recording is
the one where he asked for time before help:

> "I have the repositories all loaded locally. I'd like to get maybe at least an
> hour to go through and at least come to you with questions rather than just a
> blank stare."

And the lead's version of the same instinct, pointed at a specific tool:

> "I think Claude can help us self-serve a lot, and our repositories are set up so
> that Claude can help you self-serve. So for that hour, if you look at asking
> Claude about the repository, I think you'll have a lot of information that comes
> up that you can self-serve on — and then meet with [the senior dev]."

Both of those are the same move, and it is the oldest advice in the field. Eric
Raymond's *How To Ask Questions The Smart Way* has been making the argument since
the 1990s, and its checklist ends with the line for us:

> "If you're a programmer, try to find an answer by **reading the source code**."

His reasoning is not about self-reliance either:

> "When you ask your question, display the fact that you have done these things
> first… Better yet, display what you have **learned** from doing these things."

"Rather than just a blank stare" is that sentence, said by someone who had not
read it.

## What you can actually ask the repo

That claim is documented, almost word for word. Anthropic's best-practices page
has a section called **Ask codebase questions**, and its framing is exact:

> "When onboarding to a new codebase, use Claude Code for learning and
> exploration. You can ask Claude the same sorts of questions you would ask
> another engineer… **Using Claude Code this way is an effective onboarding
> workflow, improving ramp-up time and reducing load on other engineers.** No
> special prompting required: ask questions directly."

Their example questions are the shape to copy — not "explain the codebase", which
gets you a summary of the folder names, but the specific things you would actually
interrupt someone for:

- How does logging work?
- How do I make a new API endpoint?
- What edge cases does `<ThatOneClass>` handle?
- Why does this code call `foo()` instead of `bar()` on line 333?

The [documented walkthrough](https://code.claude.com/docs/en/common-workflows)
adds a sequence: a broad overview first, then architecture patterns, then the data
models, then one subsystem. And one instruction that is worth more than the rest
put together:

> "Request a **glossary of project-specific terms**."

Every codebase has fifteen words that mean something local. On a store build they
might be *mask*, *customizer engine*, *asset mapping*, *handoff*, *delta upload*.
Nobody will think to explain them, because nobody remembers learning them. A glossary you generate
in your first hour and then correct over your first fortnight is the single most
reusable thing a new person can produce.

Two honest limits, because this only works if you know where it stops:

- **It reads the code, so it knows what the code does, not why.** Every "we tried
  that and it broke" lives in a person or a pull request thread. That is exactly
  the residue your senior's hour is for.
- **A large exploration eats your context.** The docs' own answer is to delegate
  it: *"use a subagent to investigate how our auth system handles token refresh"*,
  so only the findings come back.

## Two weeks is a norm, not a favour

The lead set the expectation twice, in almost the same words on consecutive days:

> "It's a loose expectation for the next two weeks that you just get a good
> footing and get fit in culturally. Don't try to YOLO something to prod."

> "The goal is to get feedback, not to land a huge amount of velocity as you ramp
> up."

That sounds like generosity. It is closer to arithmetic, and two companies that
publish their handbooks have landed on the same number. GitLab:

> "**We don't expect you to hit the ground running from day one.** We highly
> recommend taking at least two full weeks for onboarding… Please feel free to
> participate in your team's work in your first two weeks, but **don't feel like
> you have to contribute heavily.**"

Spotify, describing why they built standard tutorials, coined the best name anyone
has for the failure mode:

> "**Rumour-driven development** — the only way to find out how to do something was
> to ask your colleague."

which, they add, "simply wasn't scalable". Their fix, the Golden Paths, is
explicitly aimed at the same window: *"new engineers are encouraged to do the
tutorial corresponding to their primary discipline during their first two weeks."*

The reason behind the number is fifty years old. Brooks's law — *"adding manpower
to a late software project makes it later"* — has two causes, and both are
onboarding costs: new people need ramp-up time, and **experienced staff must
divert their own output to teach them.** Worth knowing the qualifier that most
retellings drop: Brooks was talking about projects *already behind schedule*.
Adding people earlier is fine. What never changes is that the senior's hours are
the scarce resource, which is the whole reason the first hour should go to the
repo.

## "Ship on day one" is mostly folklore

Present the counter-argument, because you will hear it. Plenty of engineering
cultures boast that new hires push to production on their first day, and it is
used to make a two-week ramp sound slow.

Going looking for a first-party source for that, on the engineering blogs of the
companies it is usually attributed to, mostly turns up nothing. The one real
source is Meta's, and read what it actually says:

> "Since **the first week at Bootcamp** I was allowed to write code fixes that
> were released to the whole world."

Alongside, from the same blog: *"I spent **7 weeks** in Bootcamp, working on tasks
for several projects."* So the real model is a seven-week supervised programme in
which you ship small fixes from week one. The popular retelling compresses that
into "ships to prod on day one", which is a different claim and not one anybody
seems to have published.

Which makes the reconciliation easy, and it is what the lead described anyway:

> **Ship something small immediately. Do not own something large immediately.**

A first pull request in week one is good — it exercises the whole pipeline, it
proves your environment works, and it gets you feedback while feedback is cheap.
"Don't YOLO something to prod" is a rule about blast radius, not about waiting.

## The thing only you can see

Here is the part a new person should be told explicitly, because most are not.

**You can see things about this project that nobody else can, and the window is
about two weeks wide.** Then it closes permanently, because you will know the
answers and stop being able to see the questions. The bias has a name and a proper
citation: the **curse of knowledge**, first demonstrated experimentally by Camerer,
Loewenstein and Weber in 1989 — once you know something, you cannot accurately
model a mind that does not.

That is exactly why one team's setup docs turned out to have four holes that
nobody had noticed:

| What the new dev hit | What it actually was |
| --- | --- |
| "When I download the repository, the plugins are just a part of that, right? Or do I have to install those separately?" | A separate install, documented somewhere else |
| "When it says the dev seats, that just means have my terminal set up and ready?" | It means *logged in*, which is not what the phrase says |
| "The only thing I didn't see an invite for was Figma" | A missing invite, not a missing doc — *"that is on me"* |
| Machine hardening half-done | A checklist step nobody had reason to re-read |

None of those is anyone's fault, and that is the point: every one of them is
invisible to a person who already has it working. **The newcomer is the only
instrument that detects them, and it only works while it is new.**

So the deal runs both ways. You get two weeks of patience; the project gets the
one thing you uniquely have. Write down every place you got stuck, on the day you
got stuck, and turn it into a pull request before you forget why it was confusing.

This is standard practice, not a make-work task. The Open Source Guide reports
that **28% of casual contributions to open source are documentation** — typo
fixes, reformatting, translations — and opens with: *"a common misconception about
contributing to open source is that you need to contribute code."* Anthropic's own
test for what belongs in a `CLAUDE.md` is the same idea in one line: add it when
*"a new teammate would need the same context to be productive."*

There is research behind caring about this, with a caveat attached. DORA's work on
documentation quality finds that good internal documentation **amplifies** every
other technical capability — the same practice produces a far larger lift to
organisational performance in teams whose docs are above average. Read those
percentages as effects on a modelled construct rather than hours saved, and note
that DORA studies documentation, not onboarding specifically. The direction is
solid; the magnitudes are not a stopwatch.

## Turn the checklist into a script

The deeper fix for a half-finished setup is to stop having a checklist. GitHub's
**Scripts to Rule Them All** convention is one page (archived in 2024, still the
standard) and the argument is the whole thing:

> "If your scripts are normalized by name across all of your projects, your
> contributors only need to know the pattern, not a deep knowledge of the
> application."

Five names, the same in every repo:

| Script | What it does |
| --- | --- |
| `script/bootstrap` | Installs dependencies. Only that. |
| `script/setup` | Gets a fresh clone into a working state, and resets it back to that state later |
| `script/update` | Run after a pull: bootstrap, then migrations |
| `script/server` | Starts the app |
| `script/test` | Runs the suite, and the linter |

Every one of those four surprises is a line in `script/setup` or a printed
message at the end of it. A checklist item can be skipped silently; a script step
either exits 0 or it does not. The rest of the cross-platform side of this — why
his setup broke in the first place, and the three-line file that fixes most of it —
is in [Works on My Machine](works-on-my-machine).

If you want the argument for why checklists work at all when experts are involved,
the evidence is unusually strong and comes from surgery rather than software. The
WHO surgical safety checklist trial (Haynes et al., *NEJM* 2009) ran across eight
hospitals and nearly 8,000 patients: the death rate fell from **1.5% to 0.8%**, and
inpatient complications from **11.0% to 7.0%**. Nineteen items, and the people
skipping them were surgeons. Checklists are not for people who do not know what
they are doing — they are for people who know exactly what they are doing and are
going fast.

## Asking well, without asking less

The last piece is the etiquette, and the failure mode is asking *badly*, not
asking too much. Three short pages cover it:

- **[Don't ask to ask](https://dontasktoask.com/).** *"The solution is not to ask
  to ask, but just to ask."* "Is anyone familiar with the customizer?" makes
  someone commit before they know to what. The actual question reaches the person
  who can answer it, including someone who was not reading at the time.
- **[No Hello](https://nohello.net/en/).** *"Imagine calling someone on the phone,
  going hello! then putting them on hold."* Across time zones — and a distributed
  team can span eight of them — a question with its content attached can be answered
  while you sleep. A "hi" cannot.
- **[Describe the goal, not the step](http://www.catb.org/~esr/faqs/smart-questions.html).**
  Raymond's example: not *"how do I get the colour picker to take a hexadecimal
  value?"* but *"I'm trying to replace the colour table on an image, and the only
  way I can see is editing each slot, but the picker won't take hex."* The second
  one lets someone tell you the path is wrong.

And the counterweight, because all of that can curdle into "figure it out
yourself" and that is a worse outcome. Amy Edmondson's 1999 work on psychological
safety established the link between teams where people feel safe raising problems
and teams that learn faster. A team where the newcomer is rehearsing their question
for forty minutes is not saving anyone time. **A rough question asked in fifteen
minutes beats a polished one asked at the end of the day.** Do the hour with the
repo because it makes your question better, not because asking is expensive.

## Six things worth copying

- **The two-hour shape.** Clone the repos, spend an hour with them, then take an
  hour with a senior. The morning after, the new dev's own summary was *"a little
  overwhelming at first, but I feel like I'm working my way through it — he did a
  very good job of introducing me to it."* Defend that sequence as a default rather
  than re-deciding it each time.
- **Ask which repo is the easy one.** If your team runs several projects, one of
  them is markedly more complicated than the others, and everybody already knows
  which. Starting on the simpler codebase is sequencing, not coddling. The kind of
  data complexity that makes one project harder is written up in
  [Tags, Metafields & Getting 12,000 Products In](shopify-product-data).
- **Get the routing map, not just the architecture.** The most useful thing said in
  this new dev's second standup was an aside about a colleague: *"whenever we have
  anything customizer, he's superman… you give him a problem, 30 minutes later you
  see a PR."* Who to ask for what is real knowledge, it is nowhere in the repo, and
  it is the highest-value thing to take out of a human hour.
- **A docs sweep is a legitimate first assignment.** After a workflow changed, the
  new dev's task was to go through the docs with an AI assistant and make sure the
  new workflow was referenced everywhere. It is a real contribution, it is exactly
  what the newcomer's window is for, and it teaches the repo layout as a side
  effect. The broader case is in [Docs Before the App](docs-before-the-app).
- **Name your known trap in bold, at the top.** Every team has one step that
  everybody gets wrong — a plugin that installs separately from the repo, a tool
  that has to be logged into rather than merely installed. When two people in a row
  ask the same question, that is not two questions, it is a missing line.
- **Raise access requests before day one.** A missing design-tool invite costs a
  morning. GitLab schedules access requests as a standard day-two task precisely
  because they are predictable. So are yours: repo, design tool, chat, any
  client-side collaborator account, and the AI seats.

## Try it yourself

1. **Generate the glossary.** In any repo you work in, ask for a glossary of
   project-specific terms. Count how many you could not have defined precisely.
   That number is what a new person is up against on day one.
2. **Ask a "why" question and check it.** Pick a decision in your codebase that
   looks odd and ask the repo why it is that way. Then ask a person. The gap
   between the two answers is the map of what has to stay human.
3. **Write your stuck list.** If you have joined anything in the last month, list
   every place you got stuck. Open one pull request against the docs today, while
   you can still remember why it was confusing.
4. **Turn one checklist item into a script line.** Find the step in your setup docs
   that people most often skip, and move it into `script/setup` so it cannot be
   skipped.
