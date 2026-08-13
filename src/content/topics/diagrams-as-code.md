---
title: Diagrams as Code
description: Explaining a system to a client without opening a design tool — and keeping the diagram true six months later.
emoji: 📐
order: 26
status: up-next
tags: [documentation, diagrams, communication]
resources:
  - title: "Creating diagrams — GitHub Docs"
    url: https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams
    note: GitHub renders Mermaid in any Markdown file, issue or pull request. This is the official how-to.
  - title: "Mermaid documentation"
    url: https://mermaid.js.org/intro/
    note: The syntax reference. Skim the flowchart and sequence diagram pages and you have 90% of what we need.
  - title: "Mermaid Live Editor"
    url: https://mermaid.live/
    note: Type on the left, diagram on the right, shareable link. The fastest way to draft one.
  - title: "The C4 model for visualising software architecture"
    url: https://c4model.com/
    note: Simon Brown's answer to "what should be in this diagram?" — pick a zoom level for your audience and stay at it.
---

## Why this topic is coming up

> **A diagram in the repo is documentation. A diagram in a screenshot is a
> rumour.**

Sara's action item out of session 14 is a Mermaid chart showing a client how the
multi-store deploy works. That is a small task with a big idea behind it: the
system we most need to explain — merge goes to staging, a tag goes live, the
fan-out hits every store — is already written down in
[Maintaining Live Sites](maintaining-live-sites) as prose and tables. A picture of
it would land in one look. And if that picture is **text in the repository**, it
gets reviewed in the pull request that changes the pipeline, instead of quietly
going stale in someone's Slack history.

## What we would cover

**Why text beats a drawing tool.** A Mermaid diagram is a fenced code block.
GitHub renders it natively in Markdown files, issues and pull requests, which
means it diffs, it gets reviewed, and it lives next to the thing it describes. No
export step, no "who has the source file", no diagram that still shows the
architecture from March.

**Picking the right diagram for the audience.** This is the part that decides
whether a client understands it, and it is where most diagrams fail — by showing
everything. The [C4 model](https://c4model.com/) is the useful frame: choose a
zoom level and stay at it. A client wants the *context* level — boxes they
recognise, arrows they can follow. An engineer joining the project wants a level
down. Putting both in one picture serves neither.

**The three shapes that cover almost everything we do:**

| Mermaid type | Use it when | Example for us |
| --- | --- | --- |
| `flowchart` | Something moves through steps and branches | The deploy: merge → staging → tag → approval → fan-out |
| `sequenceDiagram` | Who calls whom, in what order | A product customiser calling its render and pricing services, then checkout |
| `stateDiagram` | One thing has modes and transitions | An order's lifecycle, or a theme's draft/live states |

**The honest limits.** Mermaid's automatic layout is fine and not beautiful — you
give up fine control over exactly where a box sits, which is a real cost when the
audience is a client and the diagram is the deliverable. Complex diagrams get
tangled and are usually a signal to split them, not to fight the layout. And it
is not a whiteboard: for thinking out loud, a whiteboard still wins.

**Writing one that survives.** The trap is a diagram that documents everything
and therefore gets updated never. The version that lasts is small, has an
audience written at the top, and lives in the same folder as the code it
describes — the same instinct as the path-scoped notes we keep in `CLAUDE.md`
files.

## Until the session

1. Open [mermaid.live](https://mermaid.live/) and draw the deploy pipeline from
   [Maintaining Live Sites](maintaining-live-sites) as a `flowchart`. Fifteen
   minutes, and you will find the step you could not explain.
2. Put it in a Markdown file, push it, and look at it on GitHub. Confirm it
   renders without any build step.
3. Show it to somebody who does not work on that repo. Every question they ask is
   a label that needs fixing — which is the whole reason to draw it before the
   client call rather than during it.
