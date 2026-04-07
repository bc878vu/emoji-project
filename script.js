const container = document.getElementById("container");
const search = document.getElementById("search");
const toast = document.getElementById("toast");
const dropBtn = document.getElementById("dropBtn");
const dropMenu = document.getElementById("dropMenu");

let currentCategory = "all";
let currentTab = "all";

let favorites = JSON.parse(localStorage.getItem("fav")) || [];
let recent = JSON.parse(localStorage.getItem("recent")) || [];

function display(list) {
  container.innerHTML = "";

  // Check for empty or null entries to prevent empty cards
  const validList = list.filter(e => e.emoji && e.emoji !== "" && e.emoji !== null);

  validList.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<span>${e.emoji}</span><p>${e.description}</p>`;

    card.onclick = () => {
      navigator.clipboard.writeText(e.emoji);
      showToast(`Copied ${e.emoji}`);
      
      // Update Recent
      recent = [e, ...recent.filter(r => r.emoji !== e.emoji)].slice(0, 20);
      localStorage.setItem("recent", JSON.stringify(recent));
    };

    card.oncontextmenu = (ev) => {
      ev.preventDefault();
      if(!favorites.find(f => f.emoji === e.emoji)) {
        favorites.push(e);
        localStorage.setItem("fav", JSON.stringify(favorites));
        showToast("Saved to Favorites ⭐");
      }
    };
    container.appendChild(card);
  });
}

function filterEmoji() {
  let list = emojiList;
  if (currentTab === "favorites") list = favorites;
  if (currentTab === "recent") list = recent;

  const text = search.value.toLowerCase();
  list = list.filter(e => 
    e.description.toLowerCase().includes(text) &&
    (currentCategory === "all" || e.category === currentCategory)
  );
  display(list);
}

document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTab = btn.dataset.tab;
    filterEmoji();
  };
});

if(dropBtn) {
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
  setTimeout(() => toast.classList.remove("show"), 1500);
}

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

window.onclick = () => { if(dropMenu) dropMenu.style.display = "none"; };

if(search) search.addEventListener("input", filterEmoji);

// Initialization
if(container) display(emojiList);