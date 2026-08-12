---
title: Code Review
description: What a pull request review is really for, and how to leave feedback that a person actually wrote.
emoji: 👀
order: 19
status: learned
session: 12
date: 2026-08-10
tags: [code-review, pull-requests, collaboration]
videos:
  - title: Implementing a Strong Code-Review Culture (Confreaks / RailsConf)
    youtubeId: PJjmw9TRB7s
resources:
  - title: "The Standard of Code Review — Google Engineering Practices"
    url: https://google.github.io/eng-practices/review/reviewer/standard.html
    note: The best short answer to "when do I approve this?" — and the rule that reviewers must not demand perfection.
  - title: "How to write code review comments — Google Engineering Practices"
    url: https://google.github.io/eng-practices/review/reviewer/comments.html
    note: Ten minutes, and it fixes most of what makes review comments land badly.
  - title: "Speed of Code Reviews — Google Engineering Practices"
    url: https://google.github.io/eng-practices/review/reviewer/speed.html
    note: Where the "one business day" rule comes from, and why a slow review costs more than a harsh one.
  - title: "Small CLs — Google Engineering Practices"
    url: https://google.github.io/eng-practices/review/developer/small-cls.html
    note: The author's half of the job. 100 lines is fine, 1000 lines is too big.
  - title: "Modern Code Review: A Case Study at Google (ICSE-SEIP 2018)"
    url: https://sback.it/publications/icse2018seip.pdf
    note: The paper with the real numbers — median change 24 lines, median one approver, approval in under 4 hours.
  - title: "Expectations, Outcomes, and Challenges of Modern Code Review (ICSE 2013)"
    url: https://www.microsoft.com/en-us/research/publication/expectations-outcomes-and-challenges-of-modern-code-review/
    note: The study that showed what teams expect from review is not what review actually delivers.
  - title: "Code Review at Cisco Systems (SmartBear case study, PDF)"
    url: https://static1.smartbear.co/support/media/resources/cc/book/code-review-cisco-case-study.pdf
    note: 2,500 reviews, 3.2 million lines. Where the "200–400 lines at a time" number comes from.
  - title: "Don't be a meat proxy — Simon Willison"
    url: https://simonwillison.net/2026/Aug/3/dont-be-a-meat-proxy/
    note: The post that put the phrase in the air a week before our session. Two paragraphs.
  - title: "AI-Generated 'Workslop' Is Destroying Productivity — Harvard Business Review"
    url: https://hbr.org/2025/09/ai-generated-workslop-is-destroying-productivity
    note: What relayed AI output costs the person who receives it, with a survey behind the number.
  - title: "Stacked pull requests are now in public preview — GitHub Changelog"
    url: https://github.blog/changelog/2026-07-30-stacked-pull-requests-are-now-in-public-preview/
    note: Public preview since 30 July 2026, free on every repo. The alternative to a comment round.
---

## The one rule to remember

> **A review is a second person understanding your change. Everything that does
> not help that is decoration.**

Almost every argument about code review is settled by that sentence. Is a
page-long comment good? Only if it helps someone understand the change. Is a
fast "looks good" bad? Only if nobody understood the change.

It matters more for a team like ours than for most. We are remote, we work across
several codebases, and we deliberately do **not** have a separate QA person — you
QA your own work as you build it (the trade-off is written up in
[Regression Testing](regression-testing)). So on most changes, the pull request
review is the *only* moment a second person looks at the work. If that moment
gets faked, the step did not happen.

## What a review is actually for

Most people would say "to catch bugs". Two of the largest studies of real reviews
say that is not where the value shows up.

**Microsoft, 2013.** Bacchelli and Bird asked developers and managers what they
expected from code review — the top answer was finding defects. Then they
classified hundreds of real review comments to see what those reviews actually
produced. Defects were a minority. The consistent outputs were knowledge
transfer, team awareness, alternative solutions, and shared code ownership. The
biggest reported *challenge* was the plain one: **understanding the change**.
([paper](https://www.microsoft.com/en-us/research/publication/expectations-outcomes-and-challenges-of-modern-code-review/))

**Google, 2018.** Sadowski and colleagues describe Google's review process as
being about education, code readability, and shared ownership. The numbers are
the surprising part:

| At Google | The number |
| --- | --- |
| Median size of a change | **24 lines** |
| Changes touching fewer than 10 files | about 90% |
| Median number of approvers | **1** |
| Median time from send to approval | under 4 hours |

([paper](https://sback.it/publications/icse2018seip.pdf))

One approver. Twenty-four lines. Approved the same morning. That is a process
built around one goal — *make it cheap for a second person to understand this* —
and everything else follows from it.

So the honest scoreboard:

| What people say review is for | What it reliably delivers |
| --- | --- |
| Catching bugs | Some bugs — real, but not the main return |
| Gatekeeping quality | **Knowledge transfer** — two people now know this code |
| Being thorough | **Team awareness** — you learn what is changing around you |
| Approving the work | **A second opinion on the approach**, while changing it is still cheap |
| Covering yourself | **Shared ownership** — nobody is the only person who can touch a file |

## Don't be a meat proxy

This was the heart of session 12, and Tom named the failure exactly:

> You ask somebody a question on Slack. They paste your question into Claude,
> and paste the answer back to you.

He half-remembered the phrase for it, and it is a real one: **meat proxy**,
coined by [Niklas Gruhn](https://gruhn.me/blog/2026-08-03/) on 3 August 2026 and
picked up by [Simon Willison](https://simonwillison.net/2026/Aug/3/dont-be-a-meat-proxy/)
the same day — one week before our session, which is why it was in the air.
It means a person who relays AI output without reading it: a human delivery
layer between a model and another human.

Three reasons it fails, and they stack:

1. **Nothing was added.** The reader has the same model you do, and would rather
   drive it themselves. In Gruhn's words: *"I can talk to Claude myself. It's
   going to be faster and I get to control the context."* If your contribution is
   the copy and the paste, you can be skipped.
2. **The cost moved to them.** Generating a page takes seconds; reading a page
   takes minutes. AI text is long, confident, wrong in a few places you have not
   marked, and increasingly jargon-dense. Gruhn's example, which he had to look up
   almost word by word: *"NATS control-plane events: stream leader election / R3
   quorum re-form during pod churn."* You saved five minutes and spent fifteen of
   someone else's.
3. **The review never happened.** The whole point was a second brain. A relay is
   not a second brain, and now the pull request carries a green check that means
   nothing.

**And it runs the other way too.** Tom shared the original post after the session,
and its sharpest paragraph is not about reviewers at all. It is about authors:

> Shipping *some* code can be done with close to zero effort now: Copy/paste the
> ticket description into Claude Code. Don't look at the code or read what Claude
> has written. If there's any feedback from reviewers, copy/paste that into Claude
> Code as well. If necessary, iterate.
>
> That works. But who has done the implementation? **The reviewers did, using
> Claude Code, and you as a meat proxy.**

That is the version worth watching for in yourself, because it does not feel like
relaying anything. It feels like shipping. The tell is simple: **if you cannot
answer a question about your own diff without going back to the model**, the
review is not a second opinion on your work. It *is* the work, and it has quietly
moved onto somebody else's plate.

That second cost has been measured. In a September 2025 study of 1,150 US
full-time workers by BetterUp Labs and Stanford's Social Media Lab, around 40%
said they had received AI-generated "workslop" in the previous month, and each
instance took an average of **one hour and 56 minutes** to deal with — roughly a
$186 monthly tax per person. The part that should worry us more than the money:
about 42% of receivers said they trusted the sender less afterwards.
([HBR](https://hbr.org/2025/09/ai-generated-workslop-is-destroying-productivity))

The extreme version is public. The curl project's security inbox filled with
AI-generated vulnerability reports that read plausibly and were not real. By
mid-2025 roughly 20% of submissions were slop, the confirmed-vulnerability rate
had fallen from north of 15% to under 5%, and — the number that matters — each
report pulled in three or four of curl's seven security volunteers for anywhere
from 30 minutes to three hours.
([Death by a thousand slops](https://daniel.haxx.se/blog/2025/07/14/death-by-a-thousand-slops/))
In January 2026 Daniel Stenberg
[ended the bug bounty](https://daniel.haxx.se/blog/2026/01/26/the-end-of-the-curl-bug-bounty/)
over it. Every one of those reports was cheap to send and expensive to read.
That is the same mechanism as a 900-word PR comment, just aimed at strangers.

**The rule, which is Willison's and now ours:** read it, understand it, validate
it, then write the response in your own words. Writing it yourself is not a
politeness — it is the proof that you did the first three.

What that looks like in practice:

| Instead of | Post this |
| --- | --- |
| 12 auto-generated inline comments | One comment, three bullets, in your voice |
| "Claude flagged a possible race condition in `useCart`" | "`useCart` refetches on focus — if the cart mutation is still in flight, does the stale response win? I could not talk myself out of it." |
| A page of analysis pasted raw | Your two sentences first, then `<details>` or a link: *extra detail below if you care* |

That last row is the compromise Tom described at the end of the session — *one
comment, authored, with bullets, and "extra detail below if you care"*. It is a
good one. Long supporting detail can still be shared. It just cannot *be* the
message.

## Where the team disagreed: is AI review worth running at all?

Both sides were argued in the session and both are right about something.

**Andrej's case against.** By the time he opens a flagged issue it is usually
either outdated or "makes sense in general, but not for what this PR does". Long
AI comments confuse the diff, cost real context to read, and can generate new
issues that were never issues. He is not describing noise in the abstract — he is
describing time already spent.

**Mohamed's case for.** On a build with a lot of generated output, a review pass
that actually *runs* things — scripts that compare the output of one build against
another — catches what reading a diff cannot. His honest caveat was that on UI
work it usually reports what he already knew.

**Tom's middle ground, and it is the useful bit:** stop treating this as a yes/no
question. It is a quality scale. And notice where the split falls — Mohamed's
example is not really review, it is *verification*. If two people's machines are
the same machine, then "I ran the comparison script across both builds and they
match" belongs in the **pull request description**, not in a review round a day
later.

The research lands in the same place. Crupi, Tufano and Bavota (2026) compared
ChatGPT's review comments against 447 real human comments on 179 pull requests.
The model matched only 10% of the human comments (23% counting partial matches)
while producing **2.4× more comments overall**. Of the extra ones, about 40% were
judged meaningful — so it does find real things humans missed. The authors are
blunt about the conclusion: use it as an additional check, not as a replacement,
and not as a way to save review time, "since human reviewers would still need to
perform their manual inspection".
([paper](https://arxiv.org/abs/2602.11925))

Read that ratio again, because it is the whole argument: **more than half of the
extra findings are not worth a comment.** Somebody has to be the filter. If it is
not you, it is the author.

So, the workflow we landed on:

1. **Run the review pass.** It is cheap and it does catch things.
2. **Read every finding and delete the ones that are not true here.** This is the
   actual work, and it is the part being skipped.
3. **Rewrite what survives as your own comment.** One comment, a few bullets.
4. **Never auto-post.** A skill that comments for you is a meat proxy with extra
   steps. If you build a PR review skill, "do not post comments" is a requirement
   of the skill, not a preference.
5. **Push mechanical checks upstream** — into CI, or into the PR description as
   "already verified", so they never become a review round at all.

And Tom's test for whether step 5 is being done, which is the sharpest line in
the session:

> **If all you are doing is running a pre-prepared thing, share it with the team
> so they can run it earlier.**

A check that only ever fires at review time is a check we chose to run at the most
expensive moment. If your review is a skill you kick off, commit the skill. Then
the author runs it before opening the PR, and your review goes back to being the
thing only a person can do.

## How to write the comment

Google publishes its internal review guidance, and it is the best short reading on
this anywhere. The parts that matter most:

- **Approve once the change definitely improves the codebase**, even if it is not
  perfect. "Reviewers should not require perfection" is stated policy, not a vibe.
  A reviewer chasing an ideal blocks a change that was already an improvement.
- **Comment on the code, never on the developer.** Not "you did not handle the
  empty case" but "this does not handle the empty case".
- **Explain why.** A suggestion with a reason teaches; a suggestion without one is
  an order.
- **Label anything non-blocking, explicitly.** Google uses prefixes:

| Prefix | Means |
| --- | --- |
| `Nit:` | Polish. Take it or leave it, I am approving either way |
| `Optional:` / `Consider:` | A real idea, still your call |
| `FYI:` | Not for this PR at all, just worth knowing |

  Unlabelled comments default to "I am asking for a change", which is how a
  nitpick turns into a day of delay.
- **Preference is not a principle.** Where two approaches are genuinely equivalent
  and the author can say why theirs works, the reviewer defers. The style guide is
  the authority on style; opinions are not.
- **Speed beats depth.** Google's rule is one business day maximum for a first
  response. The finding underneath it is worth knowing: developers mind a large
  change request far less when it arrives fast. Slowness is what makes review feel
  adversarial.
  ([standard](https://google.github.io/eng-practices/review/reviewer/standard.html),
  [comments](https://google.github.io/eng-practices/review/reviewer/comments.html),
  [speed](https://google.github.io/eng-practices/review/reviewer/speed.html))

## Veto real deltas only

The team decision from the session, in one line: **a review comment is for a real
delta.** Everything else has a better home than a comment round.

| What you found | Where it goes |
| --- | --- |
| A requirement was missed, or this breaks something | The review. Block it. This is the job |
| A bug, a security hole, an irreversible mistake | The review. Block it |
| "I would have done it differently, both work" | `Nit:` or nothing |
| "I would rather just fix this myself" | A **stacked PR** on top of theirs |
| "We should do this everywhere, not just here" | A new issue, or a rule in the repo's `CLAUDE.md` |
| "Does this actually run?" | CI, or the PR description |

The stacked-PR row is the new option. GitHub put
[stacked pull requests](https://github.blog/changelog/2026-07-30-stacked-pull-requests-are-now-in-public-preview/)
into public preview on 30 July 2026, free on every repository. You could always
open a PR against another PR's branch; what is new is that the UI now handles it
properly:

- Each PR targets the layer below it, not the main branch.
- You review **only that layer's diff**, so a reviewer is not re-reading the base.
- Merging the top one lands every unmerged layer below it in one operation.
- Existing checks, branch protection, and required reviews all still apply.
- Set-up is `gh extension install github/gh-stack`, or use the web UI.

Why it matters: the alternative to "here is a comment, please change this before
you merge" used to be nothing. Now the alternative is a two-line PR that takes you
a minute and takes the author zero. That converts a 24-hour handoff into a diff
someone can just approve — and it is a much healthier default than holding a merge
hostage over a preference.

Caveat worth saying out loud: this is a **public preview**, and merge-queue support
was still rolling out at the time of the session. Do not build a critical release
process on it yet.

## Small changes are the cheapest upgrade

Almost everything above gets easier if the diff is small, and this is the author's
half of the job. Andrej raised the same point back in session 6 from the other
direction — short comments on small PRs — and the research says size is the lever
underneath both.

The SmartBear study at Cisco — 2,500 reviews over 3.2 million lines of code —
found the ceiling sits around **200 to 400 lines at a time**. Past that, defect
detection falls off. Review slower than ~400 lines per hour and you are above
average at finding defects; faster than ~450 and defect density drops in 87% of
cases. A 200–400 line review over 60–90 minutes was where 70–90% of the defects
turned up.
([case study](https://static1.smartbear.co/support/media/resources/cc/book/code-review-cisco-case-study.pdf))

Google's guidance is stricter: **100 lines is a reasonable change, 1000 is too
large** — and remember their median in practice is 24. File count counts too: 200
lines in one file is fine, the same 200 spread over 50 files is not.

The reason to care is not tidiness. It is that a 1,200-line PR does not get a
worse review — it gets a *fake* one. Nobody reads it. They skim, they approve, and
the second-person-understands-the-change step silently did not happen. If your
change is genuinely big, that is exactly what stacked PRs are for.

Corollary worth saying out loud: if a review comment needs three paragraphs, the
problem is usually not the comment. Either the change is too big, or the
conversation belongs in a call.

## Say what you already checked

The fastest way to shorten a review is to remove the questions before they get
asked. Two habits, both from the session:

**Write the description as "what I already did".** Tom's framing: if you ran the
build comparison, the migration script and the smoke test, say so — *you do not
need to verify this, this, or this*. A reviewer's time then goes to judgement
instead of re-running what you ran.

**Ask for the review you actually want.** Tom does this constantly, and it works:
*"I had Claude do this, can somebody spot check I did not 500-error it?"* Or point
at the person: *"John built this component — John, can you look at the database
part specifically?"* A targeted ask gets a real review. "PTAL" gets a rubber stamp.

Both of these are the same move as writing a two-sentence ticket instead of a
generated page of requirements — see [Ways of Working](ways-of-working) for where
that landed.

## Three things we changed after this session

**Gate on blast radius, not on file count.** We removed the code-owner requirement
on documentation Markdown, so anyone can push docs without waiting on an approval.
Hooks stay gated on purpose: a hook is code that runs automatically on a
teammate's machine, and repo worms have been going around. Prose that is wrong
gets fixed in a follow-up; a hook that is wrong runs everywhere. The worms in
question, and what they actually did, are written up in
[Supply Chain Security](supply-chain-security).

**Check which repo before you raise it — and raise it anyway.** Sara spotted
commits landing directly on a `master` branch and flagged it. It turned out to be
a different repository than the one being discussed. Both halves of that are worth
keeping: the instinct was right, because a direct push to the default branch skips
every single thing in this lesson, and the response to a false alarm was "good call
out". A team where that question feels expensive to ask stops getting asked.

**Give the tool something to copy.** The plan for better tickets is not a reminder,
it is a GitHub issue template plus a skill that points at it. Claude is very good
at mimicking, so the cheapest way to get the shape you want is to put the shape in
the repo. See [Ways of Working](ways-of-working) for the ticket standard itself.

The AI half of all this — which model to use, how to keep a session from eating
your weekly limit, how to run a review in a fresh context — lives in
[Claude GOAT](https://edriso.github.io/claude-goat/) rather than here, same split
as [AI for Developers](ai-for-developers).

## Try it yourself

1. Open the last pull request you reviewed. Count how many of your comments were
   blocking, and how many were preference. If the preferences were not labelled
   `Nit:`, that is the fix, and it takes ten seconds per comment.
2. Take the last review you ran through an AI tool. For each finding, ask: is this
   true *in this PR*? Keep the survivors, rewrite them as one comment with bullets.
   Notice how many you deleted — the Crupi study says it should be over half.
3. Read [How to write code review comments](https://google.github.io/eng-practices/review/reviewer/comments.html).
   It is about ten minutes and it is the highest-value link on this page.
4. On your next change over ~400 lines, split it into a stack instead:
   `gh extension install github/gh-stack`, then two PRs where the second targets
   the first. Ask for a review on the bottom one only.
