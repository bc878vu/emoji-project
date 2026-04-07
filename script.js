const container = document.getElementById("container");
const search = document.getElementById("search");
const category = document.getElementById("category");
const tabs = document.querySelectorAll(".tabs button");

let favorites = JSON.parse(localStorage.getItem("fav")) || [];
let recent = JSON.parse(localStorage.getItem("recent")) || [];

function display(list){
  container.innerHTML = "";

  if(list.length === 0){
    container.innerHTML = "<h2>No Data 😔</h2>";
    return;
  }

  list.forEach(e=>{
    if(!e.emoji) return; // FIX EMPTY BUG

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span>${e.emoji}</span>
      <p>${e.description}</p>
    `;

    card.onclick = ()=>{
      navigator.clipboard.writeText(e.emoji);
      showToast();

      recent.unshift(e);
      localStorage.setItem("recent", JSON.stringify(recent.slice(0,20)));
    };

    container.appendChild(card);
  });
}

function filter(){
  let data = emojiList;

  if(category.value !== "all"){
    data = data.filter(e=>e.category === category.value);
  }

  if(search.value){
    data = data.filter(e=>e.description.includes(search.value));
  }

  display(data);
}

search.oninput = filter;
category.onchange = filter;

tabs.forEach(btn=>{
  btn.onclick = ()=>{
    if(btn.dataset.tab==="favorites") display(favorites);
    else if(btn.dataset.tab==="recent") display(recent);
    else display(emojiList);
  }
});

/* THEME */
document.getElementById("themeToggle").onclick=()=>{
  document.body.classList.toggle("light");
};

/* TOAST */
function showToast(){
  const t = document.getElementById("toast");
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),1000);
}

display(emojiList);