const container = document.getElementById("container");
const search = document.getElementById("search");
const toast = document.getElementById("toast");
const dropBtn = document.getElementById("dropBtn");
const dropMenu = document.getElementById("dropMenu");
const themeBtn = document.getElementById("themeToggle");

let currentCategory = "all";
let currentTab = "all";

// Local Storage Load (SAFE PARSE)
let favorites = JSON.parse(localStorage.getItem("fav") || "[]");
let recent = JSON.parse(localStorage.getItem("recent") || "[]");

/* ================= DISPLAY ================= */
function display(list) {
  container.innerHTML = "";

  const cleanList = list.filter(e => e.emoji && e.emoji.trim() !== "");

  if (cleanList.length === 0) {
    container.innerHTML = `<p style="text-align:center; grid-column: 1/-1; padding: 50px; opacity: 0.5;">No emojis found...</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  cleanList.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";
    card.title = "Click to Copy | Right Click to Favorite";

    // ✅ UPDATED UI (NO REMOVE — ONLY ADD)
    card.innerHTML = `
      <span>${e.emoji}</span>
      <p>${e.description}</p>
      ${currentTab !== "all" ? `<div class="remove-btn">❌</div>` : ""}
    `;

    /* COPY */
    card.onclick = () => {
      navigator.clipboard.writeText(e.emoji);
      showToast(`Copied ${e.emoji}`);

      recent = [e, ...recent.filter(item => item.emoji !== e.emoji)].slice(0, 30);
      localStorage.setItem("recent", JSON.stringify(recent));

      if (currentTab === "recent") filterEmoji();
    };

    /* FAVORITE */
    card.oncontextmenu = (ev) => {
      ev.preventDefault();

      const exists = favorites.some(item => item.emoji === e.emoji);

      if (!exists) {
        favorites.push(e);
        localStorage.setItem("fav", JSON.stringify(favorites));
        showToast("Added to Favorites ⭐");
      } else {
        showToast("Already in Favorites!");
      }
    };

    /* ✅ REMOVE BUTTON */
    if (currentTab !== "all") {
      card.querySelector(".remove-btn").onclick = (ev) => {
        ev.stopPropagation();

        if (currentTab === "favorites") {
          favorites = favorites.filter(item => item.emoji !== e.emoji);
          localStorage.setItem("fav", JSON.stringify(favorites));
        }

        if (currentTab === "recent") {
          recent = recent.filter(item => item.emoji !== e.emoji);
          localStorage.setItem("recent", JSON.stringify(recent));
        }

        showToast("Removed ❌");
        filterEmoji();
      };
    }

    /* ✅ LONG PRESS DELETE */
    let pressTimer;

    card.onmousedown = () => {
      pressTimer = setTimeout(() => {
        showDeletePopup(e);
      }, 800);
    };

    card.onmouseup = () => clearTimeout(pressTimer);
    card.onmouseleave = () => clearTimeout(pressTimer);

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

/* ================= FILTER ================= */
function filterEmoji() {
  let list = emojiList;

  if (currentTab === "favorites") list = favorites;
  if (currentTab === "recent") list = recent;

  const searchTerm = search.value.toLowerCase();

  const filtered = list.filter(e =>
    (e.description.toLowerCase().includes(searchTerm) ||
     (e.tags && e.tags.some(t => t.toLowerCase().includes(searchTerm))))
    &&
    (currentCategory === "all" || e.category === currentCategory)
  );

  display(filtered);
}

/* ================= SECTIONS ================= */
function showSection(sectionId) {
  document.querySelectorAll(".page-section").forEach(s =>
    s.classList.remove("active")
  );

  const target = document.getElementById(sectionId);
  if (target) target.classList.add("active");

  scrollToTop();
}

/* ================= SCROLL ================= */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ================= TABS ================= */
document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab").forEach(b =>
      b.classList.remove("active")
    );

    btn.classList.add("active");
    currentTab = btn.dataset.tab;

    // ✅ SHOW CLEAR BUTTON
    const clearBtn = document.getElementById("clearRecent");
    if (clearBtn) {
      clearBtn.style.display = currentTab === "recent" ? "block" : "none";
    }

    showSection("main-app");
    filterEmoji();
  };
});

/* ================= CLEAR RECENT ================= */
function clearRecent() {
  recent = [];
  localStorage.setItem("recent", JSON.stringify(recent));
  showToast("History Cleared 🗑️");
  filterEmoji();
}

/* ================= DELETE POPUP ================= */
function showDeletePopup(emoji) {
  const confirmDelete = confirm(`Remove ${emoji.emoji}?`);

  if (!confirmDelete) return;

  favorites = favorites.filter(e => e.emoji !== emoji.emoji);
  recent = recent.filter(e => e.emoji !== emoji.emoji);

  localStorage.setItem("fav", JSON.stringify(favorites));
  localStorage.setItem("recent", JSON.stringify(recent));

  showToast("Deleted 🗑️");
  filterEmoji();
}

/* ================= DROPDOWN ================= */
dropBtn.onclick = (e) => {
  e.stopPropagation();

  dropMenu.style.display =
    dropMenu.style.display === "block" ? "none" : "block";
};

document.querySelectorAll(".menu div").forEach(item => {
  item.onclick = () => {
    currentCategory = item.dataset.cat;
    dropBtn.innerHTML = `${item.innerText} ⌄`;
    dropMenu.style.display = "none";

    showSection("main-app");
    filterEmoji();
  };
});

window.onclick = () => {
  if (dropMenu.style.display === "block") {
    dropMenu.style.display = "none";
  }
};

/* ================= TOAST ================= */
let toastTimer;

function showToast(msg) {
  toast.innerText = msg;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

/* ================= THEME ================= */
(function initTheme() {
  try {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      themeBtn.innerText = "🌞";
    } else {
      themeBtn.innerText = "🌙";
    }
  } catch (e) {}
})();

themeBtn.onclick = () => {
  const isDark = document.body.classList.toggle("dark");

  themeBtn.innerText = isDark ? "🌞" : "🌙";

  localStorage.setItem("theme", isDark ? "dark" : "light");
};

/* ================= SEARCH ================= */
let debounceTimer;
search.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(filterEmoji, 120);
});

/* ================= INIT ================= */
window.addEventListener("DOMContentLoaded", () => {
  display(emojiList);
});

/* ================= AUTO INSTALL PROMPT ================= */

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // 🔥 AUTO TOAST STYLE PROMPT
  showInstallPrompt();
});

function showInstallPrompt() {
  const installBar = document.createElement("div");

  installBar.innerHTML = `
    <div style="
      position:fixed;
      bottom:20px;
      left:50%;
      transform:translateX(-50%);
      background:#6366f1;
      color:#fff;
      padding:12px 20px;
      border-radius:30px;
      z-index:9999;
      font-size:14px;
      cursor:pointer;
    ">
      Install Emoji App 🚀
    </div>
  `;

  document.body.appendChild(installBar);

  installBar.onclick = async () => {
    installBar.remove();

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      showToast("App Installed 🚀");
    }

    deferredPrompt = null;
  };

  // auto hide after 5 sec
  setTimeout(() => {
    installBar.remove();
  }, 5000);
}