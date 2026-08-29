const CACHE_PREFIX = 'ig-triptych';
const CACHE_VERSION = 'v4';
const STATIC_CACHE = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const CORE_ASSETS = [
  './','./index.html','./assets/styles.css','./manifest.webmanifest','./icon-192.png','./icon-512.png',
  './js/app.js','./js/config.js','./js/layouts.js','./js/geometry.js','./js/canvas.js','./js/upscaler.js',
  './js/heic.js','./js/image-decoder.js','./js/exporter.js','./js/ui.js','./js/pwa.js',
];
self.addEventListener('install', event => { self.skipWaiting(); event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(CORE_ASSETS))); });
self.addEventListener('activate', event => { event.waitUntil((async () => { const keys = await caches.keys(); await Promise.all(keys.filter(key => key.startsWith(`${CACHE_PREFIX}-`) && key !== STATIC_CACHE).map(key => caches.delete(key))); await self.clients.claim(); })()); });
async function networkFirst(request) { try { const response = await fetch(request); if (response.ok) { const cache = await caches.open(STATIC_CACHE); cache.put(request, response.clone()); } return response; } catch { return (await caches.match(request)) || (await caches.match('./index.html')); } }
async function staleWhileRevalidate(request) { const cached = await caches.match(request); const refresh = fetch(request).then(async response => { if (response.ok) { const cache = await caches.open(STATIC_CACHE); await cache.put(request, response.clone()); } return response; }).catch(() => null); return cached || refresh || Response.error(); }
self.addEventListener('fetch', event => { const { request } = event; if (request.method !== 'GET') return; const url = new URL(request.url); if (request.mode === 'navigate') { event.respondWith(networkFirst(request)); return; } if (url.origin === self.location.origin) event.respondWith(staleWhileRevalidate(request)); });
