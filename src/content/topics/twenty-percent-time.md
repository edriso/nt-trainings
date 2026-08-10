---
title: 20% Time & Experimentation
description: Allocating dedicated time to learning and experimentation—Google model applied to web development
emoji: 🧪
order: 11
status: learned
session: 9
date: 2026-08-04
tags: [development, practice, learning]
---

## The Big Idea

> **Spend one day per week on learning and experimentation.** Not meetings, not the roadmap — build something new, try that tool everyone talks about, fix the annoying pattern in the codebase that nobody owns. Twenty percent time is your permission to grow.

This matters because junior developers often feel trapped in feature delivery, learning only what their current project demands. Real growth happens when you experiment outside the roadmap, debug problems nobody assigned you, and turn curiosity into code. Companies that protect 20% time see happier developers, faster problem-solving, and unexpected innovations. Your career will move faster too.

## What Is 20% Time?

Twenty percent time is a block of work hours (roughly one day per week) that you spend however helps *you* learn and improve — within reason. The name comes from the rule: if you work five days a week, Thursday afternoon is yours. Google used this to build Gmail and Google News; smaller teams use it to let junior developers level up without slowing shipping.

It is **not:**
- A Friday hangout or recovery time
- Time to catch up on Slack or emails
- Assigned busywork your manager thinks is educational
- Working on side projects on company time (unless your company says so)

It **is:**
- Learning a language, framework, or library your team might use next
- Fixing that piece of tech debt that frustrates you
- Building a small tool to automate something repetitive
- Writing clear docs, tests, or examples for future junior devs like you
- Exploring how the codebase works in a part you don't touch yet
- Studying a problem you saw in production and want to understand deeper

## Core Concepts: Four Kinds of 20% Time

**Skill-building time** — Learn something your team uses. Dive into your framework's source code. Write a test suite for an untested module. Work through a tutorial on something you'll likely need next quarter.

**Exploration time** — Try a tool or pattern nobody's asked you to use yet. Prototype a faster build setup. Test a new library alongside the current one in a sandbox. See if a different approach could solve a recurring problem.

**Debt time** — Fix the annoying thing. Improve error messages. Refactor a confusing function. Delete dead code. Write a runbook for the deploy process so the next person doesn't ask the same questions.

**Teaching time** — Write a lesson for other junior devs. Record a walkthrough of a complex feature. Create examples. Pair with a teammate on something you know well. Turn what you learned into something others can use.

## How 20% Time Works in Practice

**Protect the time.** If your manager says "you have 20% time," that means Thursday 2pm–5pm is not for Zoom calls, not for urgent production bugs (unless they're truly critical), and not for "just a quick thing." Treat it like a meeting you cannot move.

**Set a rough goal, stay flexible.** "Learn Astro" is okay. "Understand how our API caching works" is okay. "I'll just see what I feel like" is too vague — you'll end up answering Slack. You don't need a Jira ticket, but you do need a direction.

**Solo work first, pairing second.** Most 20% time is you and your code, headphones on, no interrupts. If you pair, pick someone who's as curious as you are — not someone delegating work to you.

**Keep a log.** In a doc or your notebook, jot down:
- What did I try today?
- What did I learn?
- What surprised me?
- What do I want to try next week?

This is for *you*, not your manager, but it helps you see patterns (e.g., "I keep coming back to database queries" is a signal to deepen that skill).

## Using 20% Time Effectively: Three Habits

**Choose projects that teach you something real.** Not "I'll organize my bookmarks." Real: "I'll read the source code of the HTTP library we use and learn how retries work." Real: "I'll add monitoring to the caching layer to understand our actual hit rate." Real: "I'll build a small CLI tool using the language I want to learn."

**Document as you go.** Write a brief README, a Slack post, or a comment in the code explaining what you found. Why? Because three weeks later you'll forget. And because someone else will hit the same question and your notes will save them an hour.

**Fail small and reflect.** You'll start things that don't work out. A library you thought would help but doesn't. A refactoring that got too tangled. That's not a waste — it's learning. Spend five minutes writing down why it didn't work ("The abstraction added more boilerplate than it saved"). That reflection becomes knowledge.

## Presenting Your Findings

You don't need a slide deck, but sharing what you learned makes your 20% time visible and useful to the team.

**For a quick win** (e.g., "I automated our deployment checklist"):
- Post a short Slack message with a screenshot, link, or 30-second demo
- "Tried this, saved us ~10 minutes on deploys, here's how to use it"

**For something bigger** (e.g., "I tested three database indexing strategies"):
- Short write-up or code comments explaining the trade-offs
- Example: "Index on (user_id, created_at) was fastest for our queries but cost 2x storage. Index on just user_id is 80% as fast and saves space. Recommend the second."

**For tech debt work** (e.g., "Refactored the auth module"):
- Open a small PR with a clear description
- "This module had five responsibilities; I split it into two. No behavior changed, but it's easier to test and modify now."

**Share in async formats.** Async > sync meetings. A document someone reads when they want is better than a "quick demo" everyone has to sit through.

## When to Experiment vs. When to Deliver

If you have 20% time but your team is under crunch, use that time to unblock shipping, not to learn Rust.

**Experiment:**
- When your team's work is on track
- When you're not the only person who can ship something
- When you've finished your committed work
- When you're stuck on a problem and need a mental break

**Deliver (pause 20% time):**
- Crunch week before a big launch
- Critical bug in production
- Your team is waiting on you
- Your 1-on-1 showed your manager has concerns about your current output

It's not selfish to pause 20% time during crunch — it's being a team player. But when things calm down, ask for it back. Managers who never let you have 20% time are not managing well; it's okay to push back gently ("I'd like to protect Thursday afternoons for learning again").

## A Practical Workflow for Your 20% Time

1. **Pick something on Monday or earlier.**
   - Skill? Debt? Exploration?
   - One sentence of what you'll try.
   - Jot it in your log or a doc.

2. **Spend your 20% time on it.**
   - No meetings. Headphones. Turn off Slack if you can.
   - If you get stuck, spend 30 min, then ask for help or pivot (don't waste the whole block).
   - Take notes of what surprised you or what you learned.

3. **Before Friday, reflect.**
   - What worked? What didn't? Why?
   - Is this worth sharing?
   - What's the next step?

4. **Share if it helps others.**
   - Slack message, PR, doc, or quick demo.
   - Explain what you learned, not what you built.

5. **Let it inform next week.**
   - Did you find something you want to go deeper on? Plan it.
   - Did you solve a problem? Great — now you know how to solve it next time.

## Try It Yourself

### Exercise 1: Pick Your First 20% Time Project (5 minutes)
Pick one thing from your codebase or tech stack you've wondered about but never had time to learn. Examples: "How does our database migration system work?" "What's inside our webpack config and why?" "Can I write a Slack bot in Python?" Write it down in one sentence. Tomorrow or this week, spend 90 minutes on it. Just one session — see if you enjoy it. If yes, you've found a good 20% time direction.

### Exercise 2: Reverse-Engineer a Tool You Use (10 minutes)
Pick a tool your team uses daily (your testing library, your CSS framework, your CI system). Spend 10 minutes reading its README and source code on GitHub. Write three things down: (1) What does it actually do? (2) What surprised you about how it works? (3) One feature you didn't know about. This is what exploration 20% time looks like.

### Exercise 3: Fix One Small Thing (15 minutes)
Find one thing in your codebase that's been mildly annoying you. Not a huge refactor — something small: a confusing variable name, a missing error message, a comment that's out of date, a test that's slow. Spend 15 minutes fixing it. Write a short PR or Slack message explaining why. This is debt 20% time. You'll be shocked how good it feels.

### Exercise 4: Document Something You Recently Learned (10 minutes)
Think of something you learned recently in a sprint (a bug you fixed, a feature you shipped, a problem you solved). Write a three-paragraph explanation of how it works, as if you're teaching a junior developer who's about to hit the same problem. Save it somewhere your team can find it (a docs folder, a Slack post, a comment in the code). This is teaching 20% time. Future you (and future teammates) will thank you.
