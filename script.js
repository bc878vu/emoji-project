// THEME
const applyTheme = () => {
  const saved = localStorage.getItem("theme") || "light";
  const dark = saved === "dark";
  document.body.classList.toggle("dark", dark);

  const btn = document.getElementById("themeToggle");
  if(btn) btn.innerText = dark ? "☀️" : "🌙";
};
applyTheme();

// DEBOUNCE
function debounce(fn, delay=250){
  let t;
  return (...args)=>{
    clearTimeout(t);
    t = setTimeout(()=>fn(...args), delay);
  };
}

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("container");
  const search = document.getElementById("search");
  const dropBtn = document.getElementById("dropBtn");
  const dropMenu = document.getElementById("dropMenu");
  const themeToggle = document.getElementById("themeToggle");
  const toast = document.getElementById("toast");

  let currentCategory = "all";
  let currentTab = "all";

  let favorites = JSON.parse(localStorage.getItem("fav")) || [];
  let recent = JSON.parse(localStorage.getItem("recent")) || [];

  function display(list){
    container.innerHTML = "";

    const clean = list.filter(e =>
      e && e.emoji && e.emoji.trim() !== "" && e.emoji !== "null"
    );

    if(!clean.length){
      container.innerHTML = `<h2>No Emojis 😕</h2>`;
      return;
    }

    clean.forEach(e=>{
      const card = document.createElement("div");
      card.className="card";
      card.innerHTML=`<span>${e.emoji}</span><p>${e.description}</p>`;

      card.onclick=()=>{
        navigator.clipboard.writeText(e.emoji);
        showToast("Copied!");
        recent=[e,...recent.filter(r=>r.emoji!==e.emoji)].slice(0,30);
        localStorage.setItem("recent",JSON.stringify(recent));
      };

      card.oncontextmenu=(ev)=>{
        ev.preventDefault();
        if(!favorites.some(f=>f.emoji===e.emoji)){
          favorites.unshift(e);
          localStorage.setItem("fav",JSON.stringify(favorites));
          showToast("Added ⭐");
        }
      };

      container.appendChild(card);
    });
  }

  function filterEmoji(){
    let list = emojiList;

    if(currentTab==="favorites") list=favorites;
    if(currentTab==="recent") list=recent;

    const q = search.value.toLowerCase();

    const filtered = list.filter(e=>{
      const text = (
        e.description + " " +
        (e.tags||[]).join(" ") + " " +
        (e.aliases||[]).join(" ")
      ).toLowerCase();

      return text.includes(q) &&
        (currentCategory==="all" || e.category===currentCategory);
    });

    display(filtered);
  }

  // SEARCH
  search.addEventListener("input", debounce(filterEmoji));

  // DROPDOWN FIX
  dropBtn.onclick=(e)=>{
    e.stopPropagation();
    dropMenu.classList.toggle("show");
  };

  document.addEventListener("click",()=>{
    dropMenu.classList.remove("show");
  });

  document.querySelectorAll(".menu div").forEach(i=>{
    i.onclick=()=>{
      currentCategory=i.dataset.cat;
      dropBtn.innerText=i.innerText+" ⌄";
      filterEmoji();
    };
  });

  // TABS
  document.querySelectorAll(".tab").forEach(t=>{
    t.onclick=()=>{
      document.querySelector(".tab.active")?.classList.remove("active");
      t.classList.add("active");
      currentTab=t.dataset.tab;
      filterEmoji();
    };
  });

  // THEME
  themeToggle.onclick=()=>{
    const dark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", dark ? "dark":"light");
    themeToggle.innerText = dark ? "☀️":"🌙";
  };

  function showToast(msg){
    toast.innerText=msg;
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),1500);
  }

  filterEmoji();
});