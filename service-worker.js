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
});

/* ================= FETCH ================= */
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});