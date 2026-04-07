const container = document.getElementById("container");
const search = document.getElementById("search");
const toast = document.getElementById("toast");
const preview = document.getElementById("preview");

const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

let currentCategory = "all";

/* DROPDOWN */
dropdownBtn.onclick = () => {
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
};

dropdownMenu.querySelectorAll("div").forEach(item => {
  item.onclick = () => {
    currentCategory = item.dataset.cat;
    dropdownBtn.innerText = item.innerText;
    dropdownMenu.style.display = "none";
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

    /* PREVIEW */
    card.onmouseenter = () => {
      preview.style.display = "block";
      preview.innerText = e.emoji;
    };

    card.onmouseleave = () => {
      preview.style.display = "none";
    };

    /* COPY */
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
    const matchText =
      e.description.toLowerCase().includes(text) ||
      e.aliases.join(" ").includes(text);

    const matchCat =
      currentCategory === "all" || e.category === currentCategory;

    return matchText && matchCat;
  });

  display(filtered);
}

/* TOAST */
function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1200);
}

/* DARK MODE */
document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("light");
};

/* EVENTS */
search.addEventListener("input", filterEmoji);

/* INIT */
display(emojiList);