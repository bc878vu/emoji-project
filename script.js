const container = document.getElementById("container");
const search = document.getElementById("search");
const toast = document.getElementById("toast");

let currentCategory = "all";
let currentTab = "all";

let favorites = JSON.parse(localStorage.getItem("fav")) || [];
let recent = JSON.parse(localStorage.getItem("recent")) || [];

/* DISPLAY */
function display(list) {

  container.innerHTML = "";

  list.forEach(e => {

    // 🔥 BUG FIX (NO EMPTY EMOJI)
    if(!e.emoji || e.emoji === "") return;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span>${e.emoji}</span>
      <p>${e.description}</p>
    `;

    /* COPY */
    card.onclick = () => {
      navigator.clipboard.writeText(e.emoji);
      showToast();

      recent.unshift(e);
      localStorage.setItem("recent", JSON.stringify(recent.slice(0,20)));
    };

    /* FAVORITE */
    card.oncontextmenu = (ev) => {
      ev.preventDefault();

      if(!favorites.find(x=>x.description===e.description)){
        favorites.push(e);
        localStorage.setItem("fav", JSON.stringify(favorites));
      }

      showToast("Saved ⭐");
    };

    container.appendChild(card);
  });

}

/* FILTER */
function filterEmoji() {

  let list = emojiList;

  if (currentTab === "favorites") list = favorites;
  if (currentTab === "recent") list = recent;

  const text = search.value.toLowerCase();

  list = list.filter(e =>
    e.emoji &&
    e.description.toLowerCase().includes(text) &&
    (currentCategory === "all" || e.category === currentCategory)
  );

  display(list);
}

/* TABS */
document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => {

    document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    currentTab = btn.dataset.tab;
    filterEmoji();
  };
});

/* DROPDOWN */
dropBtn.onclick = () => {
  dropMenu.style.display =
    dropMenu.style.display === "block" ? "none" : "block";
};

dropMenu.querySelectorAll("div").forEach(item => {
  item.onclick = () => {
    currentCategory = item.dataset.cat;
    dropBtn.innerText = item.innerText;
    dropMenu.style.display = "none";
    filterEmoji();
  };
});

/* TOAST */
function showToast(msg="Copied ✔") {
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1200);
}

/* THEME */
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

/* EVENTS */
search.addEventListener("input", filterEmoji);

/* INIT */
display(emojiList);