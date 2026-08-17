---
title: Supply Chain Security & Keys You Can't Steal
description: A dependency is code that runs as you, with your keys. What the npm worms actually did, and the four settings that stop them.
emoji: 🔐
order: 21
status: learned
session: 14
date: 2026-08-12
tags: [security, supply-chain, dependencies, git]
resources:
  - title: "Shai-Hulud Worm Compromises npm Ecosystem — Unit 42"
    url: https://unit42.paloaltonetworks.com/npm-supply-chain-attack/
    note: The clearest technical write-up of both waves, kept updated. Start here if you read only one link.
  - title: "Widespread Supply Chain Compromise Impacting npm Ecosystem — CISA"
    url: https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem
    note: The US government advisory for the first wave. Worth having the official version to send to a client.
  - title: "Our plan for a more secure npm supply chain — GitHub"
    url: https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/
    note: "The registry's own answer: kill long-lived tokens, kill TOTP, push everyone to trusted publishing."
  - title: "npm classic tokens revoked, session-based auth — GitHub Changelog"
    url: https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/
    note: The day the old npm tokens stopped working. Check the changelog for what has shipped since.
  - title: "npm config — min-release-age"
    url: https://docs.npmjs.com/cli/v11/using-npm/config#min-release-age
    note: The official doc for the single highest-value line you can add to an .npmrc.
  - title: "Package Managers Need to Cool Down — Andrew Nesbitt"
    url: https://nesbitt.io/2026/03/04/package-managers-need-to-cool-down.html
    note: The argument for cooldowns, and honest about what they cost you.
  - title: "Secretive — protect your SSH keys with your Mac's Secure Enclave"
    url: https://github.com/maxgoedjen/secretive
    note: The app Sara uses. Free, open source, macOS only.
  - title: "Securing SSH with FIDO2 — Yubico"
    url: https://developers.yubico.com/SSH/Securing_SSH_with_FIDO2.html
    note: The cross-platform version of the same idea, for those of us not on a Mac.
  - title: "Creating a commit with multiple authors — GitHub Docs"
    url: https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors
    note: The rule that decides whether a Co-authored-by trailer counts as a contribution.
  - title: "Share items — 1Password"
    url: https://support.1password.com/share-items/
    note: How to send a credential as an expiring link limited to one person, instead of pasting it into chat.
  - title: One Time Secret
    url: https://onetimesecret.com/
    note: A link that dies on first read. The right way to hand over a key you are about to rotate.
  - title: "Token expiration and revocation — GitHub Docs"
    url: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation
    note: What actually happens to a revoked token, and why "rotated" means nothing until the old one stops working.
---

## The one rule to remember

> **A dependency is not a file you download. It is code that runs as you, on
> your machine, with your keys.**

`npm install` is not a download. It resolves a tree of hundreds of packages you
never chose, and — unless you stopped it — runs a script from each one, as your
user, with your SSH keys, your `.npmrc`, your cloud credentials and your GitHub
token sitting right there on disk.

That is not a hypothetical. It happened twice in three months, at a scale nobody
had seen before, and it is why Sara now needs her fingerprint to push a commit.

## What actually happened

Sara mentioned this in the session almost in passing — a previous client's repo
got hit by "that Shai-Hulud worm", her machine was infected, and she wiped
everything. That is worth slowing down on, because it is the most important
security story in our ecosystem right now.

**Shai-Hulud** (named after the sandworms in *Dune*) is, as far as anyone knows,
the first **self-replicating** supply chain attack on npm. It came in two waves:

| | First wave | Second wave |
| --- | --- | --- |
| When | September 2025 | November 2025 |
| Way in | Phishing email dressed as an npm security alert | Stolen maintainer credentials |
| Scale | Hundreds of packages, including `@ctrl/tinycolor` | ~25,000 malicious repos across ~350 accounts |
| Ran during | `postinstall` | **`preinstall`** — earlier, so harder to dodge |
| Stolen | GitHub tokens, AWS/GCP/Azure keys | Those, plus npm tokens and **SSH keys** |
| Where secrets went | Attacker-controlled repos | **Public GitHub repos**, described "Sha1-Hulud: The Second Coming" |
| If it could not exfiltrate | — | **Wiped the user's home directory** |

([CISA](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem),
[Unit 42](https://unit42.paloaltonetworks.com/npm-supply-chain-attack/))

Read the last two rows again. The second wave did not quietly sell your
credentials — it **published them**, so anyone could take them. And if the
exfiltration failed, it destroyed your home directory instead. "I wiped
everything" was not paranoia. It was the correct response.

### Why "worm" is the word that matters

A normal malicious package needs you to install it. A worm does not need anyone
to do anything twice:

1. It steals the maintainer's npm token from the machine it lands on.
2. It uses that token to publish poisoned versions of **every package that
   maintainer can publish**.
3. Every project that installs any of those packages becomes step 1 again.

The growth is multiplicative, and no human is driving it after the first
infection. That is how "one phished developer" becomes 25,000 repositories.
It also means the danger is not "do I trust this package?" It is "do I trust
every machine belonging to every maintainer in my tree?" — which nobody can
answer, and that is the real lesson.

## The blast radius on a developer laptop

The reason a dev machine is such a good target is that it is where all the keys
already are. Take stock honestly:

| On a typical laptop | What it unlocks |
| --- | --- |
| `~/.ssh/id_ed25519` | Push access to every repo you can push to |
| `~/.npmrc`, `~/.pypirc` | Publish rights to packages other people install |
| `~/.aws/credentials`, `~/.config/gcloud` | Client infrastructure |
| A GitHub token in a `.env` or your shell profile | The GitHub API as you, including Actions |
| Browser session cookies | Admin panels, including live stores |

Any process you run as yourself can read all of it. There is no permission
boundary between "a build script" and "your keys" — which is the whole problem,
and it points straight at the fix.

## Keys you cannot steal

You cannot make a laptop un-hackable. You *can* make a stolen key useless.

Sara's setup, mentioned in the session, is the strongest version of this: her SSH
key lives in her Mac's **Secure Enclave** via
[Secretive](https://github.com/maxgoedjen/secretive), and every use needs her
fingerprint. The private key is not a file. It cannot be copied, because it never
leaves the hardware — Secretive's own README is blunt that keys in the Secure
Enclave are not exportable *by design*, which is also why they cannot be backed
up. Malware can ask for a signature; it cannot get the key. And it cannot get a
signature either, because a signature needs a finger on the sensor.

Secretive is macOS only. On Linux and Windows the same guarantee comes from a
FIDO2 hardware key, supported natively by OpenSSH since 8.2:

```bash
# The private key lives on the hardware token, not on disk
ssh-keygen -t ed25519-sk -O resident -O verify-required
```

| Flag | What it buys you |
| --- | --- |
| `-t ed25519-sk` | `sk` = security key. The private key never exists as a file |
| `-O verify-required` | Needs a **PIN or fingerprint**, not just a touch — so a thief with the token still cannot sign |
| `-O resident` | The credential is stored on the token, so you can move to a new machine with just the token and the PIN |

([Yubico's guide](https://developers.yubico.com/SSH/Securing_SSH_with_FIDO2.html))

**The honest trade-off, in Sara's own words: "it's a blocker for sure, but I'd
rather do that."** She is right on both halves. Touch-to-sign genuinely breaks
things — any unattended push, any long CI-like script you run locally, any
automation that expects to `git push` while you are at lunch. Which is exactly
what makes it work. The failure John described in the same session, where an
agent left on auto "committed changes, did some git reset commands and messed
up", is *impossible* on a machine that requires a finger for every push.

So the middle ground is not "hardware key or nothing". It is:

- **Hardware-backed key for the origin you can hurt** — client repos, anything
  deployable, anything with `main` behind it.
- **A plain key is fine for throwaways** — your own scratch repos, a VPS you
  would rebuild anyway.
- **Never a key with no passphrase.** That is the one with no excuse. It is a
  file that grants push access to anything that can read it.

## The cheapest fix nobody has turned on

Every one of these attacks has the same shape: publish a poisoned version, and
harvest whatever installs it in the next few hours before anyone notices. Almost
all of them are found and pulled quickly. So the highest-value line of config in
this whole lesson is: **do not install anything that was published five minutes
ago.**

npm now ships this. One line in `.npmrc`:

```ini
min-release-age=3
```

Only versions published more than three days ago get installed. The
[official config doc](https://docs.npmjs.com/cli/v11/using-npm/config#min-release-age)
is short: *"npm will build the npm tree such that only versions that were
available more than the given number of days ago will be installed."* It needs
npm 11.10.0 or newer, so check `npm --version` first. Every major package
manager now has some version of it — pnpm calls it `minimumReleaseAge`, Yarn
calls it `npmMinimalAgeGate`, Bun calls it `minimumReleaseAge`.

Two more worth knowing:

```bash
npm ci --ignore-scripts     # install without running any package's install scripts
```

`--ignore-scripts` closes the exact door both worm waves came through. It is
safe far more often than people assume — most dependencies do not need a build
step — and the ones that do will fail loudly so you can allow them deliberately.
`npm ci` (not `npm install`) is the other half: it installs the lockfile exactly
and errors instead of quietly resolving something new.

**And the counter-argument, which is real.** A cooldown delays *security patches*
too. When a genuine CVE fix lands, `min-release-age=3` means you are knowingly
three days behind it. Andrew Nesbitt makes both sides of this case well in
[Package Managers Need to Cool Down](https://nesbitt.io/2026/03/04/package-managers-need-to-cool-down.html).
The resolution is not to skip the cooldown — it is to know you can override it
for one deliberate upgrade, which is a decision you make once with your eyes
open, instead of a race you lose automatically every time.

## The registry's half of the fix

Worth knowing because it changes your CI, not just your laptop. After the first
wave, GitHub (which owns npm) went after long-lived credentials on the theory
that a token that lives forever is a token that eventually leaks:

- **Classic tokens are gone.** Creation was disabled in November 2025 and the
  remaining ones were revoked in December 2025.
- **Granular tokens have short lifetimes** and scoped permissions.
- **TOTP 2FA is being deprecated** in favour of FIDO-based 2FA — the same
  hardware-key idea as above, applied to login.
- **Trusted publishing (OIDC)** is the recommended path: CI proves *which
  workflow in which repo* is publishing, and no long-lived secret exists to
  steal.

([GitHub's plan](https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/),
[the changelog](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/))

If you publish anything, the takeaway is short: stop using tokens, use trusted
publishing.

## Who signed this commit?

John raised a smaller thing in the same conversation, and it belongs here because
it is the same question — *whose identity is on this?* He does not like AI tools
co-authoring his commits, because the badge shows up on his GitHub profile.

The mechanics are worth knowing precisely.
[GitHub's rule](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors)
is that a `Co-authored-by:` trailer attributes the commit to more than one
person, and — the key sentence — *"for the commit to count as a contribution,
use an email address associated with their account on GitHub.com."* So the
trailer is a claim about authorship, and GitHub renders it as extra avatars on
the commit. It is not decoration; it is the commit's provenance.

Which is why our repos ban it, and the reason is stronger than aesthetics: the
trailer says a second author wrote part of this, and that should stay true. If
you used a tool, you are still the author — you read it, you understood it, you
are the one who can answer questions about it. That is the same standard as
[Code Review](code-review): the person whose name is on the work is the person
who can defend it.

Two related habits, while we are on identity:

- **Sign your commits.** `git config gpg.format ssh` plus
  `user.signingkey` lets you sign with the SSH key you already have — including
  a Secure Enclave or FIDO2 one, which means a signature nobody can forge
  without your finger.
- **Never push to the default branch.** Not a security control exactly, but it
  is the one that makes a compromised session obvious instead of invisible.

## Rotating a key is a job, not a button

Everything above is about a key nobody can steal. This section is about the day you
have to assume one *was* stolen — or a vendor rotates on you — because that day
arrived in session 17 and it went the way it usually goes.

The dev key had been rotated. Production had not, because the vendor has to do it
manually on their end. And the person who had built a spike against that API the week
before found out mid-standup:

> "Since we are using those, I have to check to confirm — but if you rotated it, I
> have to change it on the environment as well."

Rotating a secret is three separate jobs, and only the first one is a button:

1. **Issue the new one.** Fast, and the only part most people plan for.
2. **Find every consumer.** Local `.env` files, staging, production, CI secrets, a
   serverless function's environment, a teammate's machine, the one script somebody
   runs by hand. This is the part that takes the time, and it is the part nobody can
   do for you — which is why it is worth keeping a written list of where each
   credential is used *before* you need it.
3. **Retire the old one, deliberately.** If the old key still works, you have not
   rotated anything; you have issued a second key. Overlap on purpose, for a stated
   window, then revoke — and check the logs during the overlap to catch a consumer
   you missed.

A detail from the same exchange that is easy to skip past: before anyone could rotate
anything, there was a genuine "which key are we talking about?" moment — the platform
had a publisher API *and* a newer headless API with its own SDK, and the answer
changed depending on which one was meant. **Name the credential, not the vendor.**
"The API key" is not a name; `PUBLISH_API_KEY (staging)` is.

### Handing a secret to a teammate

The mechanics matter, and the fix is easy. Do not paste a credential into chat. Chat
is searchable, it is backed up, and it outlives the reason you sent it — so a key
pasted today is a key sitting in an archive next year. The move made here was the
right one: *"I'll just one-time secret it to you."*

| Method | Verdict |
| --- | --- |
| Shared password manager entry | **Best for anything long-lived.** One source of truth, and rotation updates one place. [1Password item sharing](https://support.1password.com/share-items/) gives a link that can expire and be limited to one recipient. |
| One-time secret link ([onetimesecret.com](https://onetimesecret.com/)) | **Good for a handoff.** The link dies on first read, so a leaked link is usually a *detected* leak — the recipient telling you it was already opened is the alarm. |
| Chat, email, a ticket comment | **No.** Permanent, searchable, and copied into every backup and export. |

The vault is where the secret *lives*; the one-time link is only how it *travels*. If
a credential exists solely in a chat message somebody starred, it is not stored, it
is remembered.

## Field notes from our repos

**What a real gate looks like.** Our dependency workflow runs on every pull
request and every push to the default branch, and it is deliberately layered —
four scanners, because each one sees something the others cannot. All four are
open source, so this is copyable:

| Tool | What it actually checks |
| --- | --- |
| [vet](https://github.com/safedep/vet) | Known CVEs and known-malicious packages, gated by a policy file you write |
| [guarddog](https://github.com/DataDog/guarddog) | The *metadata* smells — typosquatting, suspicious maintainer email domains, deceptive author |
| [Socket](https://socket.dev/) | Installs the resolved lockfile **through** a firewall, so every transitive package meets a behavioural feed |
| [zizmor](https://github.com/zizmorcore/zizmor) | Audits your own workflow files, because a CI workflow is also a supply chain |

Two details are worth copying more than the tool list. Every `uses:` is **pinned
to a full commit SHA**, not a tag — a tag can be moved, a SHA cannot. And the
workflow-audit job **fails closed**: if the scan errors and returns no valid
JSON, the job fails rather than waving the pull request through. A gate that
passes when it breaks is not a gate.

**What it does not do yet.** There is no `.npmrc`, so `min-release-age` is not
set — even though the installed npm supports it. That is the gap, and it is one
line. Worth checking whether your own repo has the same hole.

**Gate on blast radius, not on file count.** From session 12: Tom removed the
code-owner requirement on Markdown files in the docs folder so anyone can push
docs, while keeping hooks gated — because a hook is code that runs on a
teammate's machine automatically. Same instinct as everything above. Prose that
is wrong gets fixed in a follow-up; code that runs unattended does not.

**The same question applies to a skill you found online.** John's version of it in
session 15: *"a lot of times I've run into skills online and they promise heaven,
and when I use them they're just… it works, but it has some side effect that is
usually not good."* A skill is a Markdown file, so reading it before you trust it
costs two minutes — and the thing to look for is not bad advice, it is whether it
installs, fetches or runs anything. That is a dependency wearing a different hat.
More on the review side of it in
[Comments & Code Clutter](comments-and-code-clutter).

## Try it yourself

1. **Find out what a fresh install would run.** In any project, run
   `npm ci --ignore-scripts` and see whether the app still builds. If it does,
   you have just discovered you can leave it on.
2. **Add the cooldown.** Put `min-release-age=3` in this repo's `.npmrc`, run
   `npm install`, and confirm nothing breaks. Check `npm --version` is 11.10.0
   or newer first.
3. **Audit your own blast radius.** Run `ls -la ~/.ssh` and
   `cat ~/.npmrc 2>/dev/null`. For each key you find, answer one question: if a
   `preinstall` script had read this file an hour ago, what would it now own?
4. **Make one key unstealable.** On a Mac, install
   [Secretive](https://github.com/maxgoedjen/secretive), create a key that
   requires Touch ID, and add it to GitHub. Elsewhere, run
   `ssh-keygen -t ed25519-sk -O resident -O verify-required` with a hardware
   token. Then try to `cat` the private key, and notice that there isn't one.
