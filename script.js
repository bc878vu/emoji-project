let data = emojiList;

window.onload = () => {
  displayEmojis(data);
};

function displayEmojis(list) {
  let container = document.getElementById("emoji-container");
  container.innerHTML = "";

  list.forEach(e => {
    let div = document.createElement("div");
    div.className = "emoji-card";

    div.innerHTML = `
      <h2>${e.emoji}</h2>
      <p>${e.description}</p>
    `;

    div.addEventListener("click", () => {
      navigator.clipboard.writeText(e.emoji);
      alert("Copied " + e.emoji);
    });

    container.appendChild(div);
  });
}

document.getElementById("search").addEventListener("input", function () {
  let value = this.value.toLowerCase();

  let filtered = data.filter(e =>
    e.description.includes(value) ||
    e.aliases.join(",").includes(value) ||
    e.tags.join(",").includes(value)
  );

  displayEmojis(filtered);
});