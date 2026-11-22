/* Workout A & B — offline shell.
   HTML is network-first (so a deploy shows up immediately), everything else
   is cache-first with a background refresh. Bump VERSION to force a re-precache. */
const VERSION = '4';
const CACHE = 'workout-ab-' + VERSION;
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon-180.png',
  '/art/decline-push-up.webp',
  '/art/dumbbell-bench-press.webp',
  '/art/dumbbell-bicep-curl.webp',
  '/art/dumbbell-floor-press.webp',
  '/art/dumbbell-lateral-raise.webp',
  '/art/dumbbell-lunges.webp',
  '/art/dumbbell-pullover.webp',
  '/art/dumbbell-romanian-deadlift.webp',
  '/art/dumbbell-row.webp',
  '/art/dumbbell-shoulder-press.webp',
  '/art/front-squat.webp',
  '/art/hammer-curl.webp',
  '/art/incline-dumbbell-press.webp',
  '/art/overhead-triceps-extension-dumbbell.webp',
  '/art/reverse-dumbbell-fly.webp',
  '/art/skull-crusher.webp',
  '/art/standing-calf-raise.webp',
  '/art/tricep-kickback.webp'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(PRECACHE);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('/index.html', fresh.clone());
        return fresh;
      } catch {
        return (await caches.match('/index.html')) || Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => {
    /* ignoreVary + URL fallback: servers that send `Vary: Accept-Encoding`
       would otherwise make a cached asset look like a miss */
    const cached = (await caches.match(req, {ignoreVary:true})) ||
                   (await caches.match(url.pathname, {ignoreVary:true}));
    const network = fetch(req).then(res => {
      if (res && res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});
