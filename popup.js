async function fetchPrices(productName) {
  const resultsDiv = document.getElementById("results");
  const productNameDiv = document.getElementById("productName");

  productNameDiv.innerText = productName ? productName : "Unknown Product";

  // Example: Dummy prices for now
  const prices = [
    { site: "Amazon", price: "₹7,145" },
    { site: "Flipkart", price: "₹7,099" },
    { site: "Snapdeal", price: "₹7,250" }
  ];

  resultsDiv.innerHTML = ""; // Clear "Fetching..." text

  prices.forEach(item => {
    const div = document.createElement("div");
    div.className = "result";
    div.innerHTML = `<span class="site">${item.site}</span> <span class="price">${item.price}</span>`;
    resultsDiv.appendChild(div);
  });
}

// Listen for message from content.js
chrome.runtime.onMessage.addListener((message) => {
  let productName = message.productName || "Sample Product";
  fetchPrices(productName);
});
