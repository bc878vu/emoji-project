const container = document.getElementById("container");
const search = document.getElementById("search");

// show all emojis initially
display(emojiList);

// function to display emojis
function display(list) {
  container.innerHTML = "";

  list.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span>${e.emoji}</span>
      <p>${e.description}</p>
    `;

    // 🔥 Copy emoji on click
    card.addEventListener("click", () => {
      navigator.clipboard.writeText(e.emoji);
      alert("Copied: " + e.emoji);
    });

    container.appendChild(card);
  });
}

// search functionality
search.addEventListener("input", () => {
  const value = search.value.toLowerCase();

  const filtered = emojiList.filter(e =>
    e.description.toLowerCase().includes(value) ||
    e.category.toLowerCase().includes(value) ||
    e.aliases.join(" ").toLowerCase().includes(value)
  );

  // show no result
  if (filtered.length === 0) {
    container.innerHTML = "<h2>No emoji found 😢</h2>";
  } else {
    display(filtered);
  }
});