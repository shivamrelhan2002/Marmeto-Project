const productContainer = document.getElementById("product-container");

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Set the default tab to "Men" with a black background
  const defaultTab = document.querySelector(".tab[data-category='Men']");
  if (defaultTab) {
    defaultTab.classList.add("active");
  }

  // Initial
  showProducts("Men");
});

function showProducts(category) {
  fetch(
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const categories = data.categories || [];
      const selectedCategory = categories.find(
        (cat) => cat.category_name === category
      );

      if (selectedCategory) {
        const products = selectedCategory.category_products || [];
        renderProducts(products);
      } else {
        console.error(`Category "${category}" not found in the data.`);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function renderProducts(products) {
  productContainer.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    const discount = calculateDiscount(product.price, product.compare_at_price);

    card.innerHTML = `
            <div class="badge">${product.badge_text || ""}</div>
            <img src="${product.image}" alt="${product.title}">
            <div class="product-details">
                <h2>${
                  product.title
                }  <span style="font-weight: lighter;"> <li>${
      product.vendor
    }</li></span></h2>
               
                <h3>Rs ${
                  product.price
                } <span style="text-decoration: line-through;"> Rs ${
      product.compare_at_price
    }</span>
    <span style="color: #fc0808;">${discount}% Off</span></h3>
            </div>
            <button class="button">Add to Cart</button>
        `;

    productContainer.appendChild(card);
  });
}

function calculateDiscount(price, compare_at_price) {
  const discount = ((compare_at_price - price) / compare_at_price) * 100;
  return discount.toFixed(2);
}

// Initial
showProducts("Men");
