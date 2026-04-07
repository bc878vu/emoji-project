/* CACHE NAME */
const CACHE_NAME = "emoji-app-v1";

/* FILES TO CACHE */
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./emojiList.js",
  "https://cdn-icons-png.flaticon.com/512/742/742751.png"
];

/* ================= INSTALL ================= */
self.addEventListener("install", (e) => {
  self.skipWaiting();

  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

/* ================= ACTIVATE ================= */
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  // ✅ TAKE CONTROL FAST
  self.clients.claim();
});

/* ================= FETCH ================= */
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(res => {

      // ✅ CACHE HIT (FAST)
      if (res) {
        return res;
      }

      // ✅ NETWORK + CACHE SAVE
      return fetch(e.request)
        .then(response => {

          // clone for cache
          const responseClone = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, responseClone);
          });

          return response;
        })
        .catch(() => {

          // ✅ OFFLINE FALLBACK (OPTIONAL SAFE)
          if (e.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });

    })
  );
});