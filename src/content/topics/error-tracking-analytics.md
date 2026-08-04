---
title: Error Tracking & Analytics Tools
description: Choosing error tracking solutions—PostHog, Google Analytics, Sentry for web applications
emoji: 🔍
order: 17
status: learned
session: 9
date: 2026-08-04
tags: [tools, monitoring, production]
---

## The Big Idea

> **You can't fix what you don't see.** Error tracking lets you catch broken code in production *before* users report it—and analytics tools tell you *how* users are hitting those errors (and everything else). Together, they're your visibility into what's actually happening on your site.

Why it matters: bugs feel random when you're flying blind. With proper error tracking and analytics, you see the pattern—which pages crash most, which users are affected, whether a deploy just broke something. That turns firefighting into debugging.

## What Error Tracking and Analytics Do

**Error tracking** catches exceptions, crashes, and broken network requests in production and groups them so you don't drown in noise. When a user hits an error, the tool logs it with context: the browser, page URL, user ID (if you capture it), the exact line of code that failed, even recent user actions before the crash.

**Analytics** is broader—it measures how people use your app: page views, button clicks, form submissions, how long they stay, whether they finish a flow. It answers "what happened?" Error tracking answers "what broke?"

Often they overlap. Sentry can track analytics events alongside errors. PostHog does both natively. Google Analytics mostly focuses on behavior. Better Stack focuses on uptime and error logs.

The key insight: **error tracking is urgent** (you need to know *now* if your checkout is broken), while **analytics is strategic** (you're spotting trends to ship better features). Use both.

## Core Concepts

### Error Grouping and Deduplication

Raw error logs are useless—if the same bug affects 10,000 users, you'll get 10,000 log lines. Good error trackers *group* identical errors by stacktrace and fingerprint so you see one issue with a count: "This error happened 8,246 times in the last 24 hours."

### Breadcrumbs

Before a crash, what did the user do? Click a button? Submit a form? Load an image? Breadcrumbs record the last 50 or so user actions and network requests, so when you look at an error, you see the trail leading up to it.

```
1. User clicked "Buy now" button
2. POST /api/cart → 200 OK
3. User navigated to /checkout
4. Network stalled for 2s
5. Error: Cannot read property 'items' of undefined
```

That tells you more than just the error message.

### Sourcemaps

JavaScript ships minified and bundled—`function a(e){…}` instead of `function checkout(cart){…}`. Without sourcemaps, a stacktrace is unreadable. Good error trackers let you upload sourcemaps so crashes point to your original code, not the gibberish.

### Real User Monitoring (RUM)

Analytics that focus on *real* user data (not synthetic tests). It measures Core Web Vitals: how fast pages load (LCP—Largest Contentful Paint), how quickly they're interactive (INP—Interaction to Next Paint), and layout shifts (CLS—Cumulative Layout Shift). Google Analytics and PostHog do RUM; Sentry and Better Stack don't focus on it.

### Session Replay

Some tools (PostHog, Sentry's paid tier) record a video-like replay of what the user did right before they hit an error. You literally *watch* them click, scroll, and then see the crash. Creepy but incredibly useful for debugging.

## The Tools: When to Use Each

### Sentry

**What it does:** The gold standard for error tracking. It catches JavaScript errors, crashes, API failures, and performance issues. Groups them intelligently. Shows sourcemaps, breadcrumbs, and user context.

**When to use it:** You have a live app and want to stop users from finding bugs before you do. Essential if you care about uptime.

**Integration:** Add two lines—`npm install @sentry/react` and initialize in your app:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-key@sentry.io/project-id",
  environment: "production",
});
```

Then wrap your app in `<Sentry.ErrorBoundary>`. Errors automatically surface.

**Free vs paid:**
- Free tier: 5,000 errors/month, 7-day retention. Good for small apps.
- Paid: Starts ~$29/month; you get longer retention, release tracking, custom metrics.

**Learning curve:** Moderate. Basic setup is straightforward; tuning what to ignore and setting up alerts takes time.

### PostHog

**What it does:** All-in-one analytics + error tracking + session replay. You get user behavior funnels (did users finish checkout?), cohorts (segment users), feature flags (A/B test without deploying), *and* error tracking all in one tool.

**When to use it:** You want to tie errors to user behavior—"these users who hit this error almost always abandon their cart." Or you're building a feature and want to instrument it with events and analytics in one place.

**Integration:**
```javascript
import PostHog from 'posthog-js'

PostHog.init('your-api-key', { api_host: 'https://us.posthog.com' })
PostHog.capture('user_signed_up', { email: user.email })
```

Events and errors flow into the same dashboard.

**Free vs paid:**
- Free: 1 million events/month. More than enough for small/medium apps.
- Paid: Starts ~$45/month; adds session replay, advanced queries, higher volume.

**Learning curve:** Moderate. Docs are good. The dashboard is feature-heavy (might overwhelm at first).

### Google Analytics (GA4)

**What it does:** User behavior analytics. Page views, events, funnels, cohorts, real user performance data. Does *not* track errors (unless you manually send them).

**When to use it:** You're tracking user funnels—"how many users reach checkout?" or "which pages have high bounce rates?" Not for error tracking; use it *alongside* Sentry or PostHog.

**Integration:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Or use a library like `react-ga4`.

**Free vs paid:**
- Free: Unlimited events. GA4 is free.
- Paid: GA4 + BigQuery integration (direct SQL access to raw data) is $2 per GB queried.

**Learning curve:** Moderate. GA4 is more complex than old Google Analytics; takes time to set up events correctly.

### Better Stack

**What it does:** Log aggregation and uptime monitoring focused on backend logs and infrastructure. Good if your app is failing silently (API crashes that don't trigger JS errors). Also includes uptime monitoring (is your site reachable right now?).

**When to use it:** Your backend needs monitoring, or you have multiple services and want centralized logs. Less common for frontend-only teams; more for full-stack or DevOps-heavy teams.

**Integration:** Ship logs from your backend:
```bash
curl -X POST https://in.logtail.com \
  -H "Content-Type: application/json" \
  -d '{
    "dt": "'$(date -u +'%Y-%m-%dT%H:%M:%S.000Z')'",
    "message": "User checkout failed",
    "level": "error"
  }'
```

**Free vs paid:**
- Free: 7-day retention, 1 team member.
- Paid: Starts ~$12/month; adds retention, more volume, more team members.

**Learning curve:** Moderate to high if you're new to log aggregation.

## Integration Patterns

### Pattern 1: Sentry + Google Analytics

Use Sentry for errors, GA4 for user behavior. They don't talk to each other, but that's okay—you manually cross-reference.

```javascript
// Sentry
Sentry.init({ dsn: '...' });

// GA4
gtag('event', 'exception', {
  description: error.message,
  fatal: false,
});
```

Best for: Teams that already use Google Analytics and need error tracking bolted on.

### Pattern 2: PostHog Everything

One tool for analytics, errors, and feature flags. Less tool-switching.

```javascript
PostHog.init('key', { api_host: '...' });

// User behavior
PostHog.capture('checkout_started', { cart_value: 150 });

// Errors automatically tracked
PostHog.captureException(new Error('Payment failed'));
```

Best for: New apps where you control the stack and want simplicity.

### Pattern 3: Sentry + PostHog

Sentry for detailed error investigation (sourcemaps, breadcrumbs, deep alerts). PostHog for product analytics and feature flags.

```javascript
Sentry.init({ dsn: '...' });
PostHog.init('key', { api_host: '...' });

PostHog.capture('user_signed_up', { method: 'email' });
// Errors go to Sentry automatically
```

Best for: Serious production apps where error tracking and product analytics need different focus.

## When to Use Each: Decision Table

| **You should use…** | **When your app…** | **Setup time** | **Cost** | **Key win** |
|---|---|---|---|---|
| **Sentry** | Has active users and you care about not losing them to bugs | 15 min | Free for small apps | Guaranteed visibility into errors before users notice |
| **PostHog** | You're building new features and want to track both behavior *and* errors in one place | 20 min | Free up to 1M events | One unified view of user journeys and crashes |
| **Google Analytics** | You have users and need to understand funnels (signup → checkout → purchase) | 10 min | Free | Standard tool everyone uses; integrates with other Google tools |
| **Better Stack** | You have multiple backend services or need infrastructure-level logs | 30 min | Free for small volume | Centralized logs across your entire system |
| **Sentry + GA4** | You have existing GA4 setup and need error tracking bolted on | 20 min | Free for small apps | Minimal change; errors and user behavior tracked separately |
| **PostHog + Sentry** | You want both product analytics *and* dedicated error investigation | 30 min | Free (PostHog) + Free (Sentry) | Best of both worlds; more tool overhead |

## Practical Workflow: From Error to Fix

Let's say a user hits an error on your checkout page.

1. **Error lands in Sentry** (automatic).
2. **You get an alert** (Slack notification: "New error: Cannot read property 'items' of undefined · 12 occurrences").
3. **You click the alert** → Sentry shows:
   - The exact line of code that crashed
   - Breadcrumbs: User clicked "Buy now" → navigated to /checkout → stalled for 2s
   - The user's browser, device, location
   - 11 other identical errors in the last hour
4. **You check sourcemaps** to confirm the original code is what you think.
5. **You look at a session replay** (if you use PostHog or Sentry premium) to watch it happen.
6. **You fix the bug** locally and deploy.
7. **You release a tag in Sentry** so it knows the fix deployed and can say "resolved in v1.2.3."
8. **Future errors** show 0 occurrences after your deploy—you know it worked.

## Setting Up Alerts Without Drowning

Error trackers can spam you—if your site gets 1,000 errors a day, you'll go insane. Set up smart alerts:

```
// In Sentry: Alert for new errors (not repeats)
Rule: "A new issue is created"
Action: "Send to Slack"

Rule: "100+ occurrences in the last hour"
Action: "Send to Slack AND page on-call engineer"

// Ignore spam
Ignore: All errors from /admin (internal tool, less critical)
Ignore: All 404 errors (noise; users browsing bad URLs)
```

PostHog and GA4 have similar alert rules.

## Free vs Paid: Honest Assessment

| **Tool** | **Free tier** | **When to upgrade** |
|---|---|---|
| **Sentry** | 5,000 errors/month | Your app averages >150 errors/day OR you need longer retention than 7 days |
| **PostHog** | 1 million events/month | You need session replay or your app tracks >30k events/day |
| **Google Analytics** | Unlimited events | You need BigQuery direct SQL access (most teams don't) |
| **Better Stack** | 7-day retention | You need logs older than 7 days or you're running serious infrastructure |

Most junior developers' first apps never need paid tiers. Start free, upgrade when you have real data.

## Try It Yourself

### Exercise 1: Set Up Error Tracking on a Small React App

1. Create a new React app or use an existing one: `npm create vite@latest my-app -- --template react`
2. Install Sentry: `npm install @sentry/react @sentry/tracing`
3. Sign up for a **free Sentry account** at https://sentry.io (takes 2 minutes).
4. Copy your DSN from Sentry and initialize in your `main.jsx`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  environment: "development",
  tracesSampleRate: 1.0,
});
```
5. Wrap your App component:
```javascript
const SentryApp = Sentry.withProfiler(App);
ReactDOM.createRoot(document.getElementById('root')).render(<SentryApp />);
```
6. **Trigger an intentional error** to test it. Add a button to your app:
```javascript
<button onClick={() => {
  throw new Error("Test error—this should show up in Sentry!");
}}>Break the app</button>
```
7. Click the button in your browser, then check your Sentry dashboard—you should see the error logged with breadcrumbs and environment info.

**What you learned:** How easy it is to get visibility into production errors.

### Exercise 2: Instrument a Funnel with Google Analytics

1. Set up GA4 on a website (any website you control, even a hobby project).
2. Add the GA4 script tag to your `index.html` or use a library like `react-ga4`.
3. Instrument a user flow with events. Example: signup → email confirmation → login.
```javascript
gtag('event', 'sign_up', { method: 'email' });
gtag('event', 'email_verified');
gtag('event', 'login', { method: 'email' });
```
4. Trigger these events manually (sign up, verify, log in) at least 5 times.
5. Wait 24 hours (GA4 has a reporting delay), then check **Explore > Funnel** in GA4.
6. Build a funnel: sign_up → email_verified → login.

**What you learned:** How to track multi-step user journeys and spot drop-off.

### Exercise 3: Build a Decision Matrix for Your Own App

Think of an app you're building or maintaining.

1. List what you need to know:
   - Do you want to catch errors before users notice? (Yes/no)
   - Do you need to understand user funnels? (Yes/no)
   - Do you have backend logs to centralize? (Yes/no)
   - Do you need feature flags for A/B testing? (Yes/no)

2. Use the decision table above to pick 1–2 tools.

3. On a scrap of paper, sketch a 5-minute integration plan:
   - Which library to install?
   - Which environment variables to set?
   - Which parts of your code need instrumentation?

4. Pick the simpler tool and spend 30 minutes actually integrating it into your app. Verify it works by triggering a test event or error.

**What you learned:** How to pick the right tool for your constraints, not hype.

### Exercise 4: Read a Real Error Report

1. Go to https://sentry.io and explore their **demo project** (they provide one for free without signing up).
2. Click on an error from the list.
3. Spend 5 minutes reading:
   - The stacktrace: Can you tell which line failed?
   - The breadcrumbs: What did the user do before the error?
   - The context: What browser, OS, location?
   - The release info: Is this fixed in a newer version?

4. Write a 3-sentence summary: "This error happened when [user action], the code failed at [file:line], and it affects [users/browsers]."

**What you learned:** How real error reports guide debugging, not just raw error messages.
