/* PHR service worker: tải bản mới nhất khi có mạng (network-first), dùng bản đã lưu khi mất mạng.
   Thư viện giao diện của Nhật ký CT (Tailwind, Font Awesome, SheetJS) lưu sẵn để dùng khi mất mạng. */
const C = 'phr-V22.173';
const CDN = ['cdn.tailwindcss.com', 'cdnjs.cloudflare.com'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(['./', './index.html', './manifest.webmanifest', './icon-192.png']).catch(() => {}))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (CDN.includes(u.hostname)) {   // thư viện cố định phiên bản: dùng bản đã lưu, không có thì tải và lưu
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(n => { const cp = n.clone(); caches.open(C).then(c => c.put(e.request, cp)); return n; })));
    return;
  }
  if (u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
