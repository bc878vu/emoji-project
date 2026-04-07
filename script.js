const container = document.getElementById("container");
const search = document.getElementById("search");
const toast = document.getElementById("toast");
const dropBtn = document.getElementById("dropBtn");
const dropMenu = document.getElementById("dropMenu");
const themeToggle = document.getElementById("themeToggle");

let currentCategory = "all";
let currentTab = "all";

// Sync State from LocalStorage
let favorites = JSON.parse(localStorage.getItem("fav")) || [];
let recent = JSON.parse(localStorage.getItem("recent")) || [];

/* DISPLAY WITH NULL FIX */
function display(list) {
  if (!container) return; // Prevent errors on static pages
  container.innerHTML = "";

  // Strict filtering for null or empty emoji objects
  const filteredList = list.filter(e => e && e.emoji && e.emoji.trim() !== "");

  if (filteredList.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; opacity: 0.5;">No emojis found...</div>`;
    return;
  }

  filteredList.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<span>${e.emoji}</span><p>${e.description}</p>`;

    card.onclick = () => {
      navigator.clipboard.writeText(e.emoji);
      showToast(`Copied ${e.emoji}`);
      
      recent = [e, ...recent.filter(item => item.emoji !== e.emoji)].slice(0, 30);
      localStorage.setItem("recent", JSON.stringify(recent));
    };

    card.oncontextmenu = (ev) => {
      ev.preventDefault();
      if (!favorites.find(f => f.emoji === e.emoji)) {
        favorites.push(e);
        localStorage.setItem("fav", JSON.stringify(favorites));
        showToast("Added to Favorites! ⭐");
      }
    };
    container.appendChild(card);
  });
}

/* FILTER LOGIC */
function filterEmoji() {
  let list = (typeof emojiList !== 'undefined') ? emojiList : [];
  if (currentTab === "favorites") list = favorites;
  if (currentTab === "recent") list = recent;

  const query = search.value.toLowerCase();
  const result = list.filter(e => 
    (e.description.toLowerCase().includes(query) || (e.tags && e.tags.includes(query))) &&
    (currentCategory === "all" || e.category === currentCategory)
  );
  display(result);
}

/* THEME MANAGEMENT (Global Sync) */
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.innerText = "☀️";
  } else {
    document.body.classList.remove("dark");
    themeToggle.innerText = "🌙";
  }
}

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.innerText = isDark ? "☀️" : "🌙";
};

/* TABS & UI EVENTS */
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

// Initial Calls
window.onclick = () => { if(dropMenu) dropMenu.style.display = "none"; };
if (search) search.addEventListener("input", filterEmoji);
initTheme();
if (container) display(emojiList);