const container = document.getElementById("container");
const search = document.getElementById("search");
const toast = document.getElementById("toast");
const dropBtn = document.getElementById("dropBtn");
const dropMenu = document.getElementById("dropMenu");

let currentCategory = "all";
let currentTab = "all";

// Local Storage Load
let favorites = JSON.parse(localStorage.getItem("fav")) || [];
let recent = JSON.parse(localStorage.getItem("recent")) || [];

/* DISPLAY FUNCTION */
function display(list) {
  container.innerHTML = "";
  
  // Filtering out null/empty emojis if any
  const cleanList = list.filter(e => e.emoji && e.emoji.trim() !== "");

  if (cleanList.length === 0) {
    container.innerHTML = `<p style="text-align:center; grid-column: 1/-1; padding: 50px; opacity: 0.5;">No emojis found...</p>`;
    return;
  }

  cleanList.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";
    card.title = "Click to Copy | Right Click to Favorite";

    card.innerHTML = `
      <span>${e.emoji}</span>
      <p>${e.description}</p>
    `;

    /* COPY TO CLIPBOARD */
    card.onclick = () => {
      navigator.clipboard.writeText(e.emoji);
      showToast(`Copied ${e.emoji}`);

      // Add to Recent (Avoid duplicates)
      recent = [e, ...recent.filter(item => item.emoji !== e.emoji)].slice(0, 30);
      localStorage.setItem("recent", JSON.stringify(recent));
      if (currentTab === "recent") filterEmoji();
    };

    /* RIGHT CLICK FAVORITE */
    card.oncontextmenu = (ev) => {
      ev.preventDefault();
      if (!favorites.find(item => item.emoji === e.emoji)) {
        favorites.push(e);
        localStorage.setItem("fav", JSON.stringify(favorites));
        showToast("Added to Favorites ⭐");
      } else {
        showToast("Already in Favorites!");
      }
    };

    container.appendChild(card);
  });
}

/* FILTERING LOGIC */
function filterEmoji() {
  let list = emojiList;

  if (currentTab === "favorites") list = favorites;
  if (currentTab === "recent") list = recent;

  const searchTerm = search.value.toLowerCase();

  const filtered = list.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(searchTerm) || 
                          (e.tags && e.tags.some(t => t.toLowerCase().includes(searchTerm)));
    const matchesCat = (currentCategory === "all" || e.category === currentCategory);
    return matchesSearch && matchesCat;
  });

  display(filtered);
}

/* SECTION SWITCHER (Home, Terms, Privacy) */
function showSection(sectionId) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  window.scrollTo(0, 0);
}

/* ✅ NEW: SCROLL TO TOP FUNCTION */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* TAB SWITCHING */
document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTab = btn.dataset.tab;
    showSection('main-app'); // Ensure we are on home
    filterEmoji();
  };
});

/* CATEGORY DROPDOWN */
dropBtn.onclick = (e) => {
  e.stopPropagation();
  dropMenu.style.display = dropMenu.style.display === "block" ? "none" : "block";
};

document.querySelectorAll(".menu div").forEach(item => {
  item.onclick = () => {
    currentCategory = item.dataset.cat;
    dropBtn.innerHTML = `${item.innerText} ⌄`;
    dropMenu.style.display = "none";
    showSection('main-app');
    filterEmoji();
  };
});

// Close dropdown on click outside
window.onclick = () => dropMenu.style.display = "none";

/* TOAST NOTIFICATION */
function showToast(msg) {
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ✅ UPDATED DARK MODE (SAME LOGIC, CLEAN) */
const themeBtn = document.getElementById("themeToggle");

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");

  themeBtn.innerText = isDark ? "🌞" : "🌙";
};

/* INITIALIZE */
search.addEventListener("input", filterEmoji);
window.onload = () => display(emojiList);