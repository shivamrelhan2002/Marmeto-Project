// script.js

const productContainer = document.getElementById("product-container");

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

function showProducts(category) {
  // Fetch data from the API based on the category
  fetch(
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
  ) // Replace with your actual API endpoint
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
  // Clear existing products
  productContainer.innerHTML = "";

  // Render each product
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    // Calculate discount percentage
    const discount = calculateDiscount(product.price, product.compare_at_price);

    // Render product details
    card.innerHTML = `
            <div class="badge">${product.badge_text || ""}</div>
            <img src="${product.image}" alt="${product.title}">
            <div class="product-details">
                <h2>${product.title}</h2>
                <p>Brand: ${product.vendor}</p>
                <h3>Rs ${product.price}</h3>
                <h5> Rs ${product.compare_at_price}</h5>
                <h4>${discount}% Off</h4>
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
