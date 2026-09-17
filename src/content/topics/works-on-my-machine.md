---
title: Works on My Machine
description: A new dev lost two days to a Windows setup, and the reason everyone gave was a number nobody published. Here is what actually breaks, and the file that fixes most of it.
emoji: 💻
order: 34
status: learned
session: 20
date: 2026-09-17
tags: [dev-environment, tooling, onboarding, windows]
resources:
  - title: Advanced settings configuration in WSL — Microsoft
    url: https://learn.microsoft.com/en-us/windows/wsl/wsl-config
    note: The `.wslconfig` reference. The `memory` and `processors` defaults are the single most useful fact in this lesson.
  - title: Best practices for setting up a WSL development environment
    url: https://learn.microsoft.com/en-us/windows/wsl/setup/environment
    note: 'Read the File storage section twice. Clone into the Linux home directory, never `/mnt/c` — it is the difference between fast and unusable.'
  - title: Install WSL — Microsoft
    url: https://learn.microsoft.com/en-us/windows/wsl/install
    note: One command, then a restart. Compare that with repartitioning a disk.
  - title: Comparing WSL 1 and WSL 2
    url: https://learn.microsoft.com/en-us/windows/wsl/compare-versions
    note: Where the "2 to 20 times faster" file IO figures come from, and the one row where WSL 2 loses.
  - title: Install Docker Desktop on Windows
    url: https://docs.docker.com/desktop/setup/install/windows-install/
    note: The actual published system requirements. Worth reading before repeating a RAM figure you heard.
  - title: Docker Subscription Service Agreement
    url: https://www.docker.com/legal/docker-subscription-service-agreement/
    note: Section 3.2 has the real free-use threshold — fewer than 250 employees and under $10M revenue.
  - title: concurrently
    url: https://github.com/open-cli-tools/concurrently
    note: Runs several dev processes from one cross-platform command. Check the Node requirement and the Windows quoting rule before adopting.
  - title: npm scripts — npm docs
    url: https://docs.npmjs.com/cli/v11/using-npm/scripts
    note: '"Scripts are run by passing the line as a script argument to /bin/sh on POSIX systems or cmd.exe on Windows." That sentence explains most cross-platform script bugs.'
  - title: Configuring Git to handle line endings — GitHub
    url: https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings
    note: 'One committed `.gitattributes` beats asking every teammate to configure their machine — it overrides `core.autocrlf` for everyone.'
  - title: Case sensitivity in WSL — Microsoft
    url: https://learn.microsoft.com/en-us/windows/wsl/case-sensitivity
    note: The authoritative statement of why an import that works on Windows and macOS fails on Linux CI.
  - title: fnm — Fast Node Manager
    url: https://github.com/Schniz/fnm
    note: The one Node version manager that is genuinely cross-platform, maintained, and reads the `.nvmrc` everyone already has.
  - title: Scripts to Rule Them All — GitHub
    url: https://github.com/github/scripts-to-rule-them-all
    note: The naming convention that makes every repo start the same way. The repo is archived; the pattern is not.
  - title: Development Containers
    url: https://containers.dev/
    note: When you want the environment itself in version control instead of a document describing it.
---

## The one rule to remember

> **Every instruction in your setup doc that a person can get wrong is a bug you
> have chosen to ship to every new teammate.**

Put another way: the goal is not a better README. It is fewer steps that *can* be
done wrong.

## Two days, and a number nobody published

A new developer joined on a Windows laptop and spent his first two days fighting
the setup:

> "If I can get this solidly working on Windows, you'll have me. But we're still
> working on that."

The advice he got was warm and mostly right. A teammate suggested dual-booting
Zorin OS, and then gave the reason the team had already moved off Docker:

> "You're lucky we just moved off of Docker, because if you're going to do Docker
> with Windows, you better have **32 gigs of RAM**… We had like four or five
> containers. On Windows you would have been living in hell."

Everyone in that call had felt that. It is worth checking anyway, because the team
made a real architectural decision partly on the strength of it.

**Docker publishes no such number.** Their official Windows install requirements
say **8 GB system RAM**, a 64-bit CPU with SLAT, and virtualisation enabled. No
per-container memory figure, no container-count limit. (The Mac page asks for 4
GB.) The pain was real; the explanation was not.

## What was actually eating the machine

The real mechanism is one level down, and once you see it the whole thing makes
sense. Docker Desktop on Windows runs on the WSL 2 backend, and **the WSL 2 virtual
machine sizes itself from your host by default**:

| `.wslconfig` setting | Default, per Microsoft's docs |
| --- | --- |
| `memory` | **50% of total memory on Windows** |
| `processors` | **The same number of logical processors on Windows** |
| `swap` | 25% of memory, rounded up to the nearest GB |

On an 8 GB laptop, WSL claims 4 GB before you start a single container. That is
what "Docker is eating my machine" feels like, and it has almost nothing to do with
how many containers you run.

There is a second trap layered on top. Docker Desktop's **Settings → Resources**
sliders — the obvious place to look — *do not appear in WSL 2 mode*. Docker's own
docs say so and point you at Microsoft: *"In WSL 2 mode, configure memory, CPU, and
swap limits on the WSL 2 utility VM."* So a Windows dev goes looking for the knob,
finds no knob, and reasonably concludes the thing is uncontrollable.

The knob is a file you have to create yourself, at `%UserProfile%\.wslconfig`:

```ini
[wsl2]
memory=4GB
processors=2
swap=8GB
```

Then `wsl --shutdown` and start again. That is the fix, and it is three lines.

Two footnotes so nobody wastes time on the wrong lever. `autoMemoryReclaim` lives
under `[experimental]`, not `[wsl2]`, and it already defaults to `dropCache` — you
almost certainly have it. And Microsoft now recommends editing these through **WSL
Settings** in the Start menu rather than the file by hand.

One more thing worth knowing, since "we moved off Docker" tends to get justified
several ways: cost is not one of them for us. Docker's Subscription Service
Agreement (§3.2) restricts free Docker Desktop use to *"a commercial undertaking
with fewer than 250 employees and less than US $10,000,000 … in annual revenue."*
We are comfortably inside that.

None of which means the decision to drop Docker was wrong. Four or five containers
for a theme build was probably always more machinery than the job needed, and fewer
moving parts is a good reason on its own. **It just was not a 32 GB reason**, and
the difference matters the next time somebody asks whether to bring containers
back.

## Why two terminals, and why `&` does not fix it

The other half of that week was a two-terminal workflow, which the new dev was
assigned to document. The lead offered the tool:

> "There is a CLI tool I forgot to mention called **concurrently** that does spawn
> processes, so that we can still have one command, but it's cross-platform too."

That is the right tool, and the "cross-platform too" is the whole point. Here is
the underlying fact, from npm's own documentation:

> "Scripts are run by passing the line as a script argument to **`/bin/sh` on POSIX
> systems or `cmd.exe` on Windows**."

So the obvious one-liner:

```json
"dev": "vite & node server.js"
```

works on macOS and Linux, where `&` backgrounds the first command. On Windows it is
handed to `cmd.exe`, where `&` is a **sequential** separator. It does not fail
loudly. It runs Vite, waits for it to exit, and then starts the server — which is
why nobody notices until a new person on Windows says "it doesn't work" and cannot
explain how.

`concurrently` replaces it:

```json
"dev": "concurrently --names vite,api --kill-others-on-fail \"npm:dev:vite\" \"npm:dev:api\""
```

Three things to check before adopting it. **Version 10 requires Node 22 or later
and is ESM-only** — on Node 20 you get v9. **Windows only supports double quotes**,
so the escaping above is not optional. And `--kill-others-on-fail` stops the other
processes when one exits non-zero, which is what you want in a dev script and
emphatically not what you want in CI.

The honest alternative is `npm-run-all2` (`run-p`, `run-s`), also maintained, also
Windows-safe. Turborepo comes up in these conversations too, but it is a monorepo
task runner with remote caching — a large answer to a small question.

And the counter-argument, because it is real: **two terminals are sometimes better
than one.** Interleaved output from two watchers is genuinely harder to read than
two panes, and killing one process without the other is easier when they are
separate. If your terminal does splits, "run these two commands in two panes" is a
legitimate answer. The reason to prefer one command is not elegance, it is that a
new person can run it without knowing which two things to start.

## Dual-boot is the big hammer

The suggestion was Zorin OS on a dual boot. Worth being fair to it: Zorin OS 18
is built on Ubuntu 24.04 LTS, supported until at least June 2029, with a free Core
edition and a paid Pro edition that mostly adds desktop layouts. It is a good
distribution, and the read that you can stay on Core is right.

But it is a large answer. Dual-booting means partitioning a disk, maintaining two
systems, rebooting to switch context, and living with Windows updates occasionally
breaking the bootloader.

The small answer, for a developer who needs a Linux environment on a Windows
laptop, is one command:

```powershell
wsl --install
```

Run as administrator, restart, and you have a real Linux kernel with Ubuntu on top.
Microsoft's figures for WSL 2 against WSL 1 are worth knowing: *"up to 20x faster
… when unpacking a zipped tarball, and around 2-5x faster when using `git clone`,
`npm install` and `cmake`."*

**And then the single most important sentence in this entire lesson**, because
getting it wrong is what makes people conclude WSL is slow:

> "Store your project files on the same operating system as the tools you plan to
> use… Files can be accessed across the operating systems, but it may
> **significantly slow down performance**."

| Do | Do not |
| --- | --- |
| `/home/<user>/Project` (i.e. `\\wsl$\<Distro>\home\<user>\Project`) | `/mnt/c/Users/<user>/Project` |

Cloning into `/mnt/c` is the mistake, and it is the natural one to make because
that is where your Windows files are. Every file operation then crosses the OS
boundary, `npm install` crawls, and the conclusion is "WSL is slow" rather than
"I put the repo in the wrong place". Pair it with the VS Code WSL extension, which
runs the server inside WSL so there are no path or binary-compatibility problems,
and the experience is a normal Linux one.

## The traps, in one table

These are the ones that produce "works on my machine" and nothing else, all with an
official fix:

| Trap | Why it bites | The fix |
| --- | --- | --- |
| `NODE_ENV=x node app.js` in a script | POSIX-only syntax; `cmd.exe` does not understand it | `cross-env`, or Node's own `--env-file` (stable since Node 24.10 / 22.21) |
| `rm -rf dist` | Not a Windows command | `rimraf`, or `node --eval "fs.rmSync('dist',{recursive:true,force:true})"` |
| `&` for parallel commands | Sequential in `cmd.exe` | `concurrently` or `npm-run-all2` |
| **Case-sensitive imports** | *"Windows file system treats file and directory names as case-insensitive… Linux file system treats file and directory names as case-sensitive."* So `import './Button'` against `button.tsx` builds locally and fails in CI | Linux CI is the check. Do not disable it. |
| CRLF vs LF | Whole-file diffs, and shell scripts that fail with a confusing error | Commit `.gitattributes` with `* text=auto` |
| Different Node versions | Native modules and lockfiles diverge quietly | `engines` **plus** `engine-strict=true`, and a `.nvmrc` |

The line-endings one deserves its own note, because most teams fix it the wrong
way. Asking everybody to set `core.autocrlf` is asking every person to remember
something. GitHub's documentation gives the reason to prefer the file:

> "When you commit this file to a repository, it **overrides the `core.autocrlf`
> setting for all repository contributors**."

One file, committed once, and nobody has to be told anything.

## Pin it so it stops happening

The setup doc is the symptom. Four things move a step out of the doc and into the
repo, roughly in order of cost:

**1. `.nvmrc` and a cross-platform version manager.** One file naming the Node
version. For the manager itself, `fnm` is the one to standardise on: Rust, fast,
runs on Windows, macOS and Linux, and reads both `.node-version` and the `.nvmrc`
everyone already has. Two notes on the alternatives — the original `nvm` is POSIX
only (it works in WSL, not native Windows), and **Volta is no longer maintained**;
its README now points people at `mise`.

**2. Make `engines` actually bite.** By default it is advisory: npm's docs say the
field *"is advisory only and will only produce warnings"* unless the user has set
`engine-strict`. So commit both:

```json
{ "engines": { "node": ">=22" } }
```
```ini
# .npmrc
engine-strict=true
```

Related, and worth knowing before you repeat older advice: **Corepack is no longer
bundled with Node as of Node 25**, and the `nodejs.org` doc page for it now
redirects to GitHub. If you want the package manager pinned, the current field is
`devEngines`, whose `onFail` defaults to `error`.

**3. `npm ci` everywhere that is not a human typing.** It requires a lockfile,
**errors** if the lockfile and `package.json` disagree instead of silently updating
it, removes `node_modules` first, and never writes to either file. That is exactly
the behaviour you want in CI and exactly what you want on a fresh clone.

**4. One script name, in every repo.** GitHub's *Scripts to Rule Them All*
convention — `script/bootstrap`, `script/setup`, `script/server`, `script/test` —
exists for the reason they state plainly: *"if your scripts are normalized by name
across all of your projects, your contributors only need to know the pattern, not a
deep knowledge of the application."* The repo itself was archived in 2024; the
pattern is still the cheapest fix on this page. Every half-finished checklist item
becomes a line in `script/setup` that either succeeds or fails loudly.

If that still is not enough, [dev containers](https://containers.dev/) put the
environment itself in version control. That is the nuclear option, and it brings
back the containers we just removed — worth it when the environment is genuinely
complex, not worth it for a Vite app and a platform CLI.

## Five things worth copying

- **Notice how many of you share an OS.** A team where most people run the same
  system stops noticing the paths that break on the other one. The person on the
  odd OS is not a problem to be solved; they are the CI signal you did not have.
- **Stop the folklore number circulating.** Not because the Docker decision was
  wrong, but because a figure like that eventually gets repeated to a client. The
  defensible answers are "four or five containers is more machinery than a theme
  build needs" and "the WSL VM defaults make it painful on a small Windows laptop".
  Both survive scrutiny.
- **Decoration in the startup path is a real finding.** One repo prints ASCII art
  when `npm run dev` starts, and the new dev's line was *"I got to see that a few
  times right before it failed for me."* The lesson is not "no fun" — it is that the
  last thing a struggling newcomer sees should never be between them and the error
  message.
- **The person who just suffered the setup is the right author for the docs.** A
  workflow that changed needs writing down, and they are the only one who can still
  see why it was confusing. The general case is in
  [Onboarding Yourself](onboarding-yourself); the case for writing before building
  is in [Docs Before the App](docs-before-the-app).
- **Do not let them blame the laptop.** *"It was a cheap computer, so I bought it,
  and I understand that was a mistake"* is generous and wrong, and it puts the cost
  in the wrong place. Nothing in this lesson needs more hardware. It needs a
  three-line `.wslconfig`, a repo cloned into the Linux home directory, and a `dev`
  script that does not use `&`. The mistake belongs to whoever shipped a setup that
  only worked on the OS most of the team happened to use.

## Try it yourself

1. **Check what WSL is holding.** On any Windows machine with WSL, open Task Manager
   and look at `Vmmem`. Then create `%UserProfile%\.wslconfig` with a `memory` cap,
   run `wsl --shutdown`, and look again.
2. **Break a script on purpose.** Add `"probe": "echo one & echo two"` to a
   `package.json` and run it on Windows and on Linux. Same script, two different
   behaviours, no error either time. That silence is the whole problem.
3. **Find your case-sensitivity bug before CI does.** Search your imports for a path
   whose capitalisation does not match the file on disk. On macOS and Windows it
   works. On the Linux box that builds your site, it does not.
4. **Move one checklist step into a script.** Pick the setup instruction people most
   often miss and make it a line in `script/setup`. Then delete it from the doc, so
   there is only one place it can be wrong.
