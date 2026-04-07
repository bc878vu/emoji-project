const container = document.getElementById("container");
const search = document.getElementById("search");
const toast = document.getElementById("toast");

const dropBtn = document.getElementById("dropBtn");
const dropMenu = document.getElementById("dropMenu");

let currentCategory = "all";

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

/* DISPLAY */
function display(list) {
  container.innerHTML = "";

  list.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span>${e.emoji}</span>
      <p>${e.description}</p>
    `;

    card.onclick = () => {
      navigator.clipboard.writeText(e.emoji);
      showToast();
    };

    container.appendChild(card);
  });
}

/* FILTER */
function filterEmoji() {
  const text = search.value.toLowerCase();

  const filtered = emojiList.filter(e => {
    return (
      (e.description.toLowerCase().includes(text) ||
      e.aliases.join(" ").includes(text)) &&
      (currentCategory === "all" || e.category === currentCategory)
    );
  });

  display(filtered);
}

/* TOAST */
function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1200);
}

/* THEME */
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

/* EVENTS */
search.addEventListener("input", filterEmoji);

/* INIT */
display(emojiList);