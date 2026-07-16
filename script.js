const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

let products = [];

// Betöltés
async function loadProducts() {

    const response = await fetch("data/keszlet.json");

    products = await response.json();

    // Kereshető szöveg előre elkészítése
    products.forEach(product => {
        product.searchText = (
            product.nev + " " + product.cikkszam
        ).toLowerCase();
    });

    results.innerHTML = `
        <div class="no-results">
            🔍 Kezdd el beírni a termék nevét vagy cikkszámát.
        </div>
    `;

    searchInput.focus();
}

// Megjelenítés
function displayProducts(productList) {

    results.innerHTML = "";

    if (productList.length === 0) {

        results.innerHTML = `
            <div class="no-results">
                Nincs találat.
            </div>
        `;

        return;
    }

    let html = "";

    for (const product of productList) {

        const stock = Number(product.keszlet);

        let stockClass = "stock";

        if (stock <= 0) {
            stockClass += " stock-empty";
        }
        else if (stock <= 5) {
            stockClass += " stock-low";
        }

        html += `
            <div class="product">

                <div class="product-left">

                    <div class="product-name">
                        ${product.nev}
                    </div>

                    <div class="product-code">
                        ${product.cikkszam}
                    </div>

                </div>

                <div class="${stockClass}">
                    ${stock} db
                </div>

            </div>
        `;
    }

    results.innerHTML = html;

}

// Keresés
function searchProducts(searchText) {

    console.time("Keresés");

    const words = searchText
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(word => word !== "");

    // Ha üres a keresőmező
    if (words.length === 0) {

        results.innerHTML = `
            <div class="no-results">
                🔍 Kezdd el beírni a termék nevét vagy cikkszámát.
            </div>
        `;

        console.timeEnd("Keresés");
        return;
    }

    const filteredProducts = products.filter(product =>
        words.every(word => product.searchText.includes(word))
    );

    // Maximum 50 találat megjelenítése
    displayProducts(filteredProducts.slice(0, 50));

    console.timeEnd("Keresés");

}

searchInput.addEventListener("input", function () {

    searchProducts(searchInput.value);

});

loadProducts();