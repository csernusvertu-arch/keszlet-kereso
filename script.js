const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

let products = [];

// Betöltés
async function loadProducts() {

    const response = await fetch("data/keszlet.json");

    products = await response.json();

    displayProducts(products);

    // Automatikusan a keresőbe kerül a kurzor
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

    for (const product of productList) {

        const stock = Number(product.keszlet);

        const stockClass = stock <= 0
            ? "stock stock-empty"
            : "stock";

        results.innerHTML += `
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

}

// Keresés
function searchProducts(searchText) {

    const words = searchText
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(word => word !== "");

    const filteredProducts = products.filter(product => {

        const searchableText = (
            product.nev + " " + product.cikkszam
        ).toLowerCase();

        return words.every(word => searchableText.includes(word));

    });

    displayProducts(filteredProducts);

}

searchInput.addEventListener("input", function () {

    searchProducts(searchInput.value);

});

loadProducts();