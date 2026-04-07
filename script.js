// ===== THEME APPLY (NO FLASH) =====
(function () {
    const saved = localStorage.getItem("theme") || "light";
    if (saved === "dark") document.body.classList.add("dark");
})();

// ===== DOM READY =====
document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("container");
    const search = document.getElementById("search");
    const toast = document.getElementById("toast");
    const themeToggle = document.getElementById("themeToggle");

    let currentTab = "all";
    let currentCategory = "all";

    let favorites = JSON.parse(localStorage.getItem("fav")) || [];
    let recent = JSON.parse(localStorage.getItem("recent")) || [];

    // ===== THEME BUTTON =====
    const updateThemeIcon = () => {
        const isDark = document.body.classList.contains("dark");
        themeToggle.innerText = isDark ? "☀️" : "🌙";
    };

    updateThemeIcon();

    themeToggle.onclick = () => {
        document.body.classList.toggle("dark");
        localStorage.setItem("theme",
            document.body.classList.contains("dark") ? "dark" : "light"
        );
        updateThemeIcon();
    };

    // ===== DISPLAY (OPTIMIZED) =====
    function display(list) {

        const clean = list.filter(e => e && e.emoji && e.emoji.trim() !== "");

        if (!clean.length) {
            container.innerHTML = "<p style='text-align:center'>No emojis found</p>";
            return;
        }

        const fragment = document.createDocumentFragment();

        clean.forEach(e => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <span>${e.emoji}</span>
                <p>${e.description}</p>
            `;

            card.onclick = () => {
                navigator.clipboard.writeText(e.emoji);
                showToast("Copied " + e.emoji);

                recent = [e, ...recent.filter(r => r.emoji !== e.emoji)].slice(0, 24);
                localStorage.setItem("recent", JSON.stringify(recent));
            };

            card.oncontextmenu = (ev) => {
                ev.preventDefault();
                if (!favorites.find(f => f.emoji === e.emoji)) {
                    favorites.push(e);
                    localStorage.setItem("fav", JSON.stringify(favorites));
                    showToast("Added ⭐");
                }
            };

            fragment.appendChild(card);
        });

        container.innerHTML = "";
        container.appendChild(fragment);
    }

    // ===== FILTER =====
    function filterEmoji() {
        let list = emojiList;

        if (currentTab === "favorites") list = favorites;
        if (currentTab === "recent") list = recent;

        const q = search.value.toLowerCase();

        const filtered = list.filter(e =>
            e.description.toLowerCase().includes(q) &&
            (currentCategory === "all" || e.category === currentCategory)
        );

        display(filtered);
    }

    // ===== SEARCH (DEBOUNCE) =====
    let timeout;
    search.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(filterEmoji, 200);
    });

    // ===== TABS =====
    document.querySelectorAll(".tab").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            btn.classList.add("active");

            currentTab = btn.dataset.tab;
            filterEmoji();
        };
    });

    // ===== TOAST =====
    function showToast(msg) {
        toast.innerText = msg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1500);
    }

    // INIT
    filterEmoji();
});