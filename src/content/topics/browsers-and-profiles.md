---
title: Browsers, Profiles & Why Chrome Eats RAM
description: Why the browser you develop in costs gigabytes, and how to hold ten client accounts open without them leaking into each other.
emoji: 🪟
order: 36
status: up-next
tags: [tooling, browsers, dev-environment]
resources:
  - title: "Process Model and Site Isolation — Chromium docs"
    url: https://chromium.googlesource.com/chromium/src/+/main/docs/process_model_and_site_isolation.md
    note: The primary source on why Chrome uses many processes. Explains the RAM cost as a deliberate purchase, not a bug.
  - title: "Site Isolation — Chromium Security"
    url: https://www.chromium.org/Home/chromium-security/site-isolation/
    note: The security half — what a compromised tab can and cannot reach, and why Spectre made this necessary.
  - title: Firefox Multi-Account Containers
    url: https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/
    note: Mozilla's official extension — the cleanest answer to "two accounts on the same site, same window".
  - title: "Fix memory problems — Chrome DevTools"
    url: https://developer.chrome.com/docs/devtools/memory-problems/
    note: For when it is our site eating the RAM rather than the browser. Heap snapshots and finding leaks.
  - title: Zen Browser
    url: https://zen-browser.app/
    note: The Firefox-based one from the thread. Gecko engine, so it inherits containers.
  - title: Helium
    url: https://helium.computer/
    note: The Chromium-based one from the thread. Same engine as Chrome, so the same process model and the same RAM floor.
---

## Why this topic is coming up

> **Chrome's memory use is mostly a security bill, and you cannot get the
> discount without giving up the protection.**

Zachary raised this in Slack while John was fighting a screen-share permission
prompt: he has been trying Zen and Helium, none of them handle the many separate
client accounts we all juggle, and Chrome is expensive on RAM. Two real questions
in one, and both have proper technical answers rather than opinions.

## What we would cover

**Why Chrome costs so much.** Chrome runs web content in **separate operating
system processes**, and [site isolation](https://chromium.googlesource.com/chromium/src/+/main/docs/process_model_and_site_isolation.md)
locks each renderer process to a single site. Each process carries its own copy of
runtime structures, which is where the gigabytes go. What it buys is that a
compromised or malicious tab cannot read another site's data — including via
side-channel attacks like **Spectre** and **Meltdown**, which broke the previous
assumption that one process could safely hold two sites.

The strongest evidence that this is a real trade-off rather than sloppiness:
Chrome itself **turns site isolation off** on Android devices with less than 2 GB
of RAM, and only partially enables it between 2 GB and full desktop. The team
priced the protection and decided some devices cannot afford it.

**What that means for the alternatives in the thread.** The engine decides the
floor:

| Browser | Engine | What that implies |
| --- | --- | --- |
| Chrome, Edge, Brave, **Helium** | Chromium | Same process model, same site isolation, roughly the same memory floor per site |
| Firefox, **Zen** | Gecko | Different process model, and Firefox's container feature is available |

So Helium can be leaner than Chrome on chrome-the-application — fewer background
services, no Google integrations — but it cannot be dramatically leaner *per open
site* without giving up the same protection. Zen is a different engine, which is
where the profile answer changes.

**The account problem, which is the actually solvable one.** Chrome **profiles**
work, but they are heavyweight: a separate window, a separate process tree, and a
separate everything per client. For ten clients that is ten windows.
[Firefox Multi-Account Containers](https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/)
solves the same problem per **tab** — each container has its own cookie jar, so you
can be signed into ten Shopify admins in one window, colour-coded, with no
cross-contamination. It is an official Mozilla extension, and it is the single best
answer to Zachary's question.

**The part that is our own fault.** Sometimes the memory is not the browser, it is
the page — and on a Shopify theme with a stack of apps installed, that is worth
checking before blaming Chrome. [DevTools memory
tooling](https://developer.chrome.com/docs/devtools/memory-problems/) is the same
skill as the rest of [Web Performance](web-performance), pointed at ourselves.

## Until the session

1. Open `chrome://process-internals` (or Firefox's `about:processes`) with your
   normal tabs open. Count the processes and see which sites got their own. That is
   the RAM bill, itemised.
2. Install [Multi-Account Containers](https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/)
   in Firefox and put two client accounts in two containers in the same window. Ten
   minutes, and it either solves your problem or it does not.
3. Come with your actual setup — how many accounts, how you keep them apart today,
   and what breaks. This one is worth solving as a team because we all have it.
