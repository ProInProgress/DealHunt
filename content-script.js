// content-script.js

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "get_product_info") {
    var productInfo = getProductInfo();
    sendResponse(productInfo);
  }
});

// Function to get product info from Flipkart page
function getProductInfo() {
  try {
    // Get product title - USING THE CONFIRMED SELECTOR: .B_NuCI
    var titleElement = document.querySelector('.VU-ZEz');
    var title = titleElement ? titleElement.textContent.trim() : 'Title not found';
    
    // Get product price (selector might need verification)
    var priceElement = document.querySelector('._30jeq3._16Jk6d');
    var price = priceElement ? priceElement.textContent.trim() : 'Price not found';
    
    return { title: title, price: price, url: window.location.href };
  } catch (error) {
    console.error('Error getting product info:', error);
    return { title: 'Error', price: 'Error', url: window.location.href };
  }
}