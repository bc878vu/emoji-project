const container = document.getElementById("container");
const search = document.getElementById("search");
const toast = document.getElementById("toast");
const dropBtn = document.getElementById("dropBtn");
const dropMenu = document.getElementById("dropMenu");
const themeToggle = document.getElementById("themeToggle");

let currentCategory = "all";
let currentTab = "all";

let favorites = JSON.parse(localStorage.getItem("fav")) || [];
let recent = JSON.parse(localStorage.getItem("recent")) || [];

// DISPLAY LOGIC WITH NULL FIX
function display(list) {
  if (!container) return;
  container.innerHTML = "";

  // Filter out any invalid or null emojis
  const cleanList = list.filter(e => e && e.emoji && e.emoji.trim() !== "" && e.emoji !== "null");

  if (cleanList.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; opacity: 0.5;">No Emojis Found</div>`;
    return;
  }

  cleanList.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<span>${e.emoji}</span><p>${e.description}</p>`;

    card.onclick = () => {
      navigator.clipboard.writeText(e.emoji);
      showToast(`Copied ${e.emoji}`);
      recent = [e, ...recent.filter(r => r.emoji !== e.emoji)].slice(0, 25);
      localStorage.setItem("recent", JSON.stringify(recent));
    };

    card.oncontextmenu = (ev) => {
      ev.preventDefault();
      if (!favorites.find(f => f.emoji === e.emoji)) {
        favorites.push(e);
        localStorage.setItem("fav", JSON.stringify(favorites));
        showToast("Added to Favorites ⭐");
      }
    };
    container.appendChild(card);
  });
}

function filterEmoji() {
  let list = (typeof emojiList !== 'undefined') ? emojiList : [];
  if (currentTab === "favorites") list = favorites;
  if (currentTab === "recent") list = recent;

  const query = search.value.toLowerCase();
  const filtered = list.filter(e => 
    (e.description.toLowerCase().includes(query)) &&
    (currentCategory === "all" || e.category === currentCategory)
  );
  display(filtered);
}

// GLOBAL THEME SYNC
function applyTheme() {
  const isDark = localStorage.getItem("theme") === "dark";
  document.body.classList.toggle("dark", isDark);
  themeToggle.innerText = isDark ? "☀️" : "🌙";
}

themeToggle.onclick = () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.innerText = isDark ? "☀️" : "🌙";
};

// TABS & EVENTS
document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    currentTab = btn.dataset.tab;
    filterEmoji();
  };
});

if (dropBtn) {
  dropBtn.onclick = (e) => {
    e.stopPropagation();
    dropMenu.style.display = dropMenu.style.display === "block" ? "none" : "block";
  };
}

document.querySelectorAll(".menu div").forEach(item => {
  item.onclick = () => {
    currentCategory = item.dataset.cat;
    dropBtn.innerText = item.innerText + " ⌄";
    dropMenu.style.display = "none";
    filterEmoji();
  };
});

function showToast(msg) {
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

window.onclick = () => { if(dropMenu) dropMenu.style.display = "none"; };
if (search) search.addEventListener("input", filterEmoji);

// INITIALIZE
applyTheme();
if (container) display(emojiList);