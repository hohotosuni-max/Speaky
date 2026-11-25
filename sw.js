/* ============================================================
   Speaky — 서비스 워커 (앱 셸 오프라인 캐시)
   ============================================================ */
const VERSION = 'speaky-v1.0.4';
const CORE = [
  './',
  './index.html',
  './css/styles.css',
  './js/data.js',
  './js/diff.js',
  './js/speech.js',
  './js/demo-ai.js',
  './js/ai.js',
  './js/app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(CORE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // API와 외부 요청은 캐시하지 않음
  if (url.origin !== self.location.origin || url.pathname.includes('/api/')) return;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // 페이지 이동: 네트워크 우선, 실패 시 캐시
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
    );
    return;
  }

  // 정적 파일: 캐시 우선 + 백그라운드 갱신
  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || network;
    })
  );
});
