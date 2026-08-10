---
title: Handling Browser Cache During Deployments
description: Infrastructure solutions for preventing 500 errors when browsers serve stale code after deploys
emoji: ⚡
order: 13
status: learned
session: 9
date: 2026-08-04
tags: [infrastructure, deployment, caching]
---

## The Big Idea

> **After you deploy, old browsers still run old code.** When your new code calls APIs that don't exist yet, you get 500 errors. This happens because browsers cache JavaScript, CSS, and HTML aggressively. You need a strategy to tell browsers when to throw away the old version and fetch the new one.

Why this matters: deployments should be boring. The moment browsers have stale code, you have a silent outage — users see broken features, your logs fill with errors, and you have no idea why until you clear your cache. Every production team needs one of these techniques.

## How browser caching works

Browsers cache static files (`.js`, `.css`, `.woff`) to make sites faster. A server tells the browser "keep this file for one year" via the `Cache-Control` header. After that, the browser never asks the server again — it uses the stored copy.

The problem: after deploy, the browser still has the old cached file. If your new code expects a new API endpoint that doesn't exist in old code, or if old code calls an endpoint you just removed, you get errors.

There are four main strategies to solve this:

1. **Cache busting** — change the file name so browsers fetch the new one
2. **Service workers** — a script that intercepts requests and decides what to cache
3. **CDN cache headers** — tell Cloudflare or edge servers to drop stale files faster
4. **Cloudflare Workers** — check the server state and bypass cache if needed

## Strategy 1: Cache busting (the most reliable)

Change the file name on every deploy. If `app.js` becomes `app.a1b2c3d4.js`, the browser treats it as a new file.

How it works:

```
Deploy v1:
  index.html references app.js
  Browser caches app.js for 1 year

Deploy v2:
  Build tool generates app.a1b2c3d4.js (hash changes)
  index.html now references app.a1b2c3d4.js
  Browser fetches the new file (different name)
  Old app.js stays cached but unused
```

The build tool (Webpack, Vite, Esbuild) adds a hash to the file name automatically. Only `index.html` itself needs short or no cache — the hashed files can cache forever.

**Vite example:**
```javascript
// vite.config.js — enabled by default
export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]'
      }
    }
  }
}
```

**Trade-offs:**
- Pro: guaranteed to work; no stale code ever runs
- Pro: scales to any number of files
- Con: requires a build step; doesn't work for hand-edited files
- Con: old files accumulate (minor; storage is cheap)

## Strategy 2: Service workers (the most flexible)

A service worker is a JavaScript file that runs in the browser and intercepts network requests. You can program it to check for updates, expire caches, or bypass cache entirely for critical files.

How it works:

```javascript
// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js — the service worker
const CACHE_VERSION = 'v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(['/index.html', '/app.js', '/style.css']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Bypass cache for API calls; use cache for static files
  if (event.request.url.includes('/api/')) {
    return fetch(event.request);
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_VERSION) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});
```

**Trade-offs:**
- Pro: fine-grained control; can cache some files and bypass others
- Pro: works offline
- Con: adds complexity; bugs in the service worker can break your entire site
- Con: users must have the old service worker installed to get the new one (chicken-and-egg problem)

## Strategy 3: CDN cache headers (the simplest tune-up)

Set short `Cache-Control` headers on static assets and let your CDN (Cloudflare, AWS CloudFront, etc.) respect them.

```
Cache-Control: public, max-age=31536000  # 1 year — safe if file name has hash
Cache-Control: public, max-age=3600      # 1 hour — riskier; browsers may show stale code
Cache-Control: public, max-age=0, must-revalidate  # Revalidate every request
```

For `index.html`, use a short cache or revalidation; for hashed `.js` and `.css`, use a long cache.

**In Cloudflare Workers:**
```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    let response = await fetch(request);
    
    if (url.pathname.match(/\.[a-f0-9]{8}\.(js|css|woff)$/)) {
      // Hashed file: cache for 1 year
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (url.pathname === '/' || url.pathname.endsWith('.html')) {
      // HTML: cache for 5 minutes, always check origin
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', 'public, max-age=300, must-revalidate');
    }
    
    return response;
  }
}
```

**Trade-offs:**
- Pro: simple; one-line header change
- Con: if you forget the hash on a file, users see stale code for `max-age` seconds
- Con: doesn't help browsers that already have the file cached

## Strategy 4: Cloudflare Workers (the nuclear option)

Deploy code that checks the origin server on every request, bypassing cache if the origin has changed. This guarantees fresh code but adds latency (one extra network hop to Cloudflare).

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Get the file from origin (ignore browser cache)
    const originResponse = await fetch(new Request(url, {
      cf: { cacheTtl: 0 } // Bypass Cloudflare cache
    }));
    
    // Add long cache headers for CDN only
    if (url.pathname.match(/\.[a-f0-9]{8}\.(js|css|woff)$/)) {
      originResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      originResponse.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }
    
    return originResponse;
  }
}
```

**Trade-offs:**
- Pro: 100% guaranteed fresh code; no stale assets
- Pro: Cloudflare edge still caches hashed files (fast)
- Con: adds latency on first request per region
- Con: increases load on origin server

## When to use each

| Situation | Best choice | Why |
|-----------|------------|-----|
| Normal SPA (Vite/webpack build) | Cache busting | Reliable, zero risk, no extra infra |
| Offline-first PWA | Service worker | You need offline support anyway |
| Very fast iteration (devs testing) | Short cache headers | Simple; accept 5–10 min stale window |
| Mission-critical (e-commerce, banking) | Cache busting + CDN headers | Belt and suspenders |
| Already on Cloudflare | Cloudflare Workers | Leverage the infra you have |
| No build tool (hand-edited files) | CDN headers + service worker | Can't hash what doesn't go through build |

## Practical workflow: a checklist for your deploy

1. **Build step:** enable file hashing (Vite does this by default)
2. **HTML:** set `Cache-Control: public, max-age=300, must-revalidate`
3. **JS/CSS/fonts:** set `Cache-Control: public, max-age=31536000, immutable`
4. **API responses:** set `Cache-Control: private, max-age=0` (no cache)
5. **Before deploy:** check your `Cache-Control` headers with `curl -I`
6. **After deploy:** hard refresh in your own browser (`Ctrl+Shift+R` / `Cmd+Shift+R`) to verify
7. **Monitor:** watch your error logs for 5 minutes; spike in 404s or type errors means stale code is running

## Before you deploy: Test in production-like conditions

The most important rule: **always run tests before deploying to production.** This includes:

- **Lint and type-check:** `npm run lint && npm run build` (catches obvious errors)
- **Automated tests:** Unit, integration, and E2E tests should pass
- **Manual smoke test:** If your app is critical, test the golden path manually in a staging environment
- **Check for stale code:** After deploy, clear your browser cache (`Ctrl+Shift+R`) and verify the new code loaded

This is especially important after shipping cache changes—a misconfigured `Cache-Control` header or forgotten hash can silently serve broken code to users.

When something does go wrong, [Debugging Slow Server Responses](debugging-slow-responses) teaches the systematic approach to finding whether the issue is cache-related, infrastructure, or code.

## Try it yourself

**Exercise 1: Check your current cache headers**

Open your site in a browser and run:
```bash
curl -I https://yoursite.com
curl -I https://yoursite.com/app.js
```

Look for `Cache-Control` headers. Is `index.html` cached? Is `app.js` hashed? What would happen if you deploy new code right now?

**Exercise 2: Simulate a stale-code error**

Deploy a version where:
- `app.js` is cached for 1 year (no hash)
- You add a new API endpoint `/api/v2/data`
- Old `app.js` still calls `/api/v1/data` (remove that endpoint)

Open the site in a private window (no cache), confirm it works. Then open in a normal window after the cache fills, and watch the 404 error. This is the problem cache busting solves.

**Exercise 3: Add hashing to your build**

If you use Vite, verify `vite.config.js` includes:
```javascript
build: {
  rollupOptions: {
    output: {
      entryFileNames: '[name].[hash].js',
      chunkFileNames: '[name].[hash].js',
      assetFileNames: '[name].[hash][extname]'
    }
  }
}
```

Run `npm run build` and check that `.js` files in `dist/` have hashes. Update your HTML template to reference the hashed names (most build tools do this automatically).

**Exercise 4: Write a service worker (10 min)**

Create `public/sw.js` with:
```javascript
const CACHE_VERSION = 'v1';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION));
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    return; // Skip caching API calls
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((res) => {
        caches.open(CACHE_VERSION).then((cache) => {
          cache.put(event.request, res.clone());
        });
        return res;
      });
    })
  );
});
```

In your app, register it: `navigator.serviceWorker.register('/sw.js')`. Open DevTools > Application > Service Workers and confirm it installs. (This won't prevent stale code on its own, but it shows how to intercept requests.)
