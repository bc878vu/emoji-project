const container = document.getElementById("container");
const search = document.getElementById("search");
const category = document.getElementById("category");
const toast = document.getElementById("toast");
const toggleTheme = document.getElementById("toggleTheme");

// show emojis
function display(list) {
  container.innerHTML = "";

  list.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span>${e.emoji}</span>
      <p>${e.description}</p>
    `;

    // copy emoji
    card.onclick = () => {
      navigator.clipboard.writeText(e.emoji);
      showToast();
    };

    container.appendChild(card);
  });
}

// toast
function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

// filter
function filterEmoji() {
  const text = search.value.toLowerCase();
  const cat = category.value;

  const filtered = emojiList.filter(e => {
    const matchText =
      e.description.toLowerCase().includes(text) ||
      e.aliases.join(" ").includes(text);

    const matchCat = cat === "all" || e.category === cat;

    return matchText && matchCat;
  });

  if (filtered.length === 0) {
    container.innerHTML = "<h2>No emoji found 😢</h2>";
  } else {
    display(filtered);
  }
}

// events
search.addEventListener("input", filterEmoji);
category.addEventListener("change", filterEmoji);

// dark mode
toggleTheme.onclick = () => {
  document.body.classList.toggle("dark");
};

// init
display(emojiList);