/* Điều hành sản xuất PHR – service worker riêng của trang: tải bản mới nhất khi có mạng, dùng bản đã lưu khi mất mạng.
   Dữ liệu luôn đi qua máy chủ PHR, không lưu trong bộ nhớ đệm. */
const C = 'sxa-V22.434';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(['./', './index.html', './manifest.webmanifest', './icon-192.png']).catch(() => {}))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('sxa-') === 0 && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || /version\.json$/.test(u.pathname)) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: /app\.html$/.test(u.pathname) }).then(r => r || caches.match('./index.html'))));
});
