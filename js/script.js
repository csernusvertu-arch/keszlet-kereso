// Készlet kereső: termékenként egy sor, a méretek egymás mellett (vízszintes nézet).
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const resultCount = document.getElementById("resultCount");
const lastUpdated = document.getElementById("lastUpdated");

const MAX_FAMILIES = 30;
let families = [];

const escapeHtml = (text) => String(text).replace(/[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Közös cikkszám minta, a méret helyén ···  (pl. JP132700Ö0P···KSZ)
function codePattern(codes) {
    const full = codes.filter((c) => c && c.length === 17);
    if (!full.length) return "";
    const heads = new Set(full.map((c) => c.slice(0, 11)));
    const tails = new Set(full.map((c) => c.slice(14)));
    return heads.size === 1 && tails.size === 1 ? `${[...heads][0]}···${[...tails][0]}` : "";
}

// A termékek csoportosítása: a név utolsó szava a méret, az előtte lévő rész a termék
function groupProducts(products) {
    const byName = new Map();
    for (const p of products) {
        const parts = p.nev.trim().split(/\s+/);
        const size = parts.pop();
        const name = parts.join(" ");
        if (!byName.has(name)) byName.set(name, { name, sizes: [] });
        byName.get(name).sizes.push({ size, code: p.cikkszam, stock: Number(p.keszlet) });
    }
    const list = [...byName.values()];
    for (const f of list) {
        f.sizes.sort((a, b) => (parseFloat(a.size) || 9999) - (parseFloat(b.size) || 9999));
        f.total = f.sizes.reduce((sum, s) => sum + Math.max(s.stock, 0), 0);
        f.pattern = codePattern(f.sizes.map((s) => s.code));
        f.searchText = (f.name + " " + f.sizes.map((s) => s.code).join(" ")).toLowerCase();
    }
    return list;
}

async function loadProducts() {
    const response = await fetch("data/keszlet.json");
    const data = await response.json();
    families = groupProducts(data.products);
    lastUpdated.textContent = `Frissítve: ${data.lastUpdated}`;
    showHint();
    searchInput.focus();
}

function showHint() {
    resultCount.textContent = "";
    results.innerHTML = `
        <div class="no-results">
            🔍 Kezdd el beírni a termék nevét vagy cikkszámát.
        </div>
    `;
}

function stockClass(stock) {
    if (stock <= 0) return "qty stock-empty";
    if (stock <= 5) return "qty stock-low";
    return "qty";
}

function displayFamilies(list) {
    if (list.length === 0) {
        results.innerHTML = `<div class="no-results">Nincs találat.</div>`;
        return;
    }
    results.innerHTML = list.map((f) => `
        <div class="family">
            <div class="family-head">
                <div class="product-left">
                    <div class="product-name">${escapeHtml(f.name)}</div>
                    ${f.pattern ? `<div class="product-code">${escapeHtml(f.pattern)}</div>` : ""}
                </div>
                <div class="family-total">Összesen: <b>${f.total} db</b></div>
            </div>
            <div class="sizes">
                ${f.sizes.map((s) => `
                    <div class="size-cell ${s.stock <= 0 ? "empty" : ""}" title="${escapeHtml(s.code)}">
                        <div class="size">${escapeHtml(s.size)}</div>
                        <div class="${stockClass(s.stock)}">${s.stock}</div>
                    </div>`).join("")}
            </div>
        </div>
    `).join("");
}

function searchFamilies(searchText) {
    const words = searchText.toLowerCase().trim().split(/\s+/).filter((w) => w !== "");
    if (words.length === 0) {
        showHint();
        return;
    }
    const found = families
        .filter((f) => words.every((w) => f.searchText.includes(w)))
        .sort((a, b) => a.name.localeCompare(b.name, "hu", { sensitivity: "base", numeric: true }));
    displayFamilies(found.slice(0, MAX_FAMILIES));
    resultCount.textContent = found.length > MAX_FAMILIES
        ? `${found.length} termék (az első ${MAX_FAMILIES} látható)`
        : `${found.length} termék`;
}

searchInput.addEventListener("input", () => searchFamilies(searchInput.value));

loadProducts();
