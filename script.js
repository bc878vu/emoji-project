// Function to apply theme instantly
const applyTheme = () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const isDark = savedTheme === "dark";
    document.body.classList.toggle("dark", isDark);
    const btn = document.getElementById("themeToggle");
    if (btn) btn.innerText = isDark ? "☀️" : "🌙";
};

// Run instantly before full DOM load to prevent flash
applyTheme();

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    const search = document.getElementById("search");
    const toast = document.getElementById("toast");
    const dropBtn = document.getElementById("dropBtn");
    const dropMenu = document.getElementById("dropMenu");
    const themeToggle = document.getElementById("themeToggle");

    let currentCategory = "all";
    let currentTab = "all";

    let favorites = JSON.parse(localStorage.getItem("fav")) || [];
    let recent = JSON.parse(localStorage.getItem("recent")) || [];

    // DISPLAY WITH NULL CHECK
    function display(list) {
        if (!container) return;
        container.innerHTML = "";

        // Strictly filtering valid emojis
        const cleanList = list.filter(e => e && e.emoji && e.emoji !== "null" && e.emoji.trim() !== "");

        if (cleanList.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px; opacity: 0.5; font-weight: 600;">No emojis found...</div>`;
            return;
        }

        const fragment = document.createDocumentFragment();
        cleanList.forEach(e => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `<span>${e.emoji}</span><p>${e.description}</p>`;

            card.onclick = () => {
                navigator.clipboard.writeText(e.emoji);
                showToast(`Copied ${e.emoji}`);
                recent = [e, ...recent.filter(r => r.emoji !== e.emoji)].slice(0, 24);
                localStorage.setItem("recent", JSON.stringify(recent));
            };

            card.oncontextmenu = (ev) => {
                ev.preventDefault();
                if (!favorites.find(f => f.emoji === e.emoji)) {
                    favorites.push(e);
                    localStorage.setItem("fav", JSON.stringify(favorites));
                    showToast("Added to Favorites ⭐");
                }
            };
            fragment.appendChild(card);
        });
        container.appendChild(fragment);
    }

    function filterEmoji() {
        let list = (typeof emojiList !== 'undefined') ? emojiList : [];
        if (currentTab === "favorites") list = favorites;
        if (currentTab === "recent") list = recent;

        const query = search.value.toLowerCase();
        const filtered = list.filter(e => 
            (e.description.toLowerCase().includes(query)) &&
            (currentCategory === "all" || e.category === currentCategory)
        );
        display(filtered);
    }

    // Theme Toggle Listener
    if (themeToggle) {
        themeToggle.onclick = () => {
            const isDark = document.body.classList.toggle("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            themeToggle.innerText = isDark ? "☀️" : "🌙";
        };
    }

    // Tabs
    document.querySelectorAll(".tab").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            currentTab = btn.dataset.tab;
            filterEmoji();
        };
    });

    // Dropdown
    if (dropBtn) {
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
        setTimeout(() => toast.classList.remove("show"), 1800);
    }

    window.onclick = () => { if(dropMenu) dropMenu.style.display = "none"; };
    if (search) search.addEventListener("input", filterEmoji);

    // Initial load
    filterEmoji();
    applyTheme(); // Call again to ensure button icon is correct
});

