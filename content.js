// content.js
let productName = "";

// Amazon product title selector
const amazonTitle = document.querySelector("#productTitle");
if (amazonTitle) {
  productName = amazonTitle.innerText.trim();
} else {
  // Fallback: use page title
  productName = document.title;
}

// Send the product name to popup.js
chrome.runtime.sendMessage({ productName });
