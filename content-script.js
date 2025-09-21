


// // content-script.js

// // Listen for messages from the popup
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.message === "get_product_info") {
//     var productInfo = getProductInfo();
//     sendResponse(productInfo);
//   }
// });

// // Function to get product info from Flipkart page
// function getProductInfo() {
//   try {
//     // Get product title
//     var titleElement = document.querySelector('.VU-ZEz');
//     var title = titleElement ? titleElement.textContent.trim() : 'Title not found';
    
//     console.log('Starting price search...');
//     console.log('Page URL:', window.location.href);
    
//     var price = 'Price not found';
//     var priceElement = null;
    
//     // Method 1: Direct selector with multiple classes (the correct way)
//     priceElement = document.querySelector('.Nx9bqj.CxhGGd');
//     if (priceElement && priceElement.textContent.trim()) {
//       price = priceElement.textContent.trim();
//       console.log('Found price with .Nx9bqj.CxhGGd:', price);
//     }
    
//     // Method 2: Try just single class selectors
//     if (price === 'Price not found') {
//       priceElement = document.querySelector('.Nx9bqj');
//       if (priceElement && priceElement.textContent.includes('₹')) {
//         price = priceElement.textContent.trim();
//         console.log('Found price with .Nx9bqj:', price);
//       }
//     }
    
//     // Method 3: Search for the exact price pattern we can see
//     if (price === 'Price not found') {
//       // Look for elements containing the specific price patterns
//       var pricePatterns = ['1,29,999', '₹1,29,999', '44,999', '₹44,999'];
      
//       for (var i = 0; i < pricePatterns.length; i++) {
//         var xpath = "//div[contains(text(), '" + pricePatterns[i] + "')]";
//         var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        
//         if (result.singleNodeValue) {
//           price = result.singleNodeValue.textContent.trim();
//           console.log('Found price with XPath pattern ' + pricePatterns[i] + ':', price);
//           break;
//         }
//       }
//     }
    
//     // Method 4: Broad search through all elements
//     if (price === 'Price not found') {
//       console.log('Trying broad search...');
//       var allDivs = document.querySelectorAll('div');
      
//       for (var j = 0; j < allDivs.length; j++) {
//         var text = allDivs[j].textContent.trim();
        
//         // Check if this div contains only a price (₹ followed by numbers and commas)
//         if (text.match(/^₹[\d,]+$/)) {
//           price = text;
//           console.log('Found price with broad search:', price);
//           console.log('Element classes:', allDivs[j].className);
//           break;
//         }
//       }
//     }
    
//     // Method 5: Last resort - search all text nodes
//     if (price === 'Price not found') {
//       console.log('Trying text node search...');
//       var walker = document.createTreeWalker(
//         document.body,
//         NodeFilter.SHOW_TEXT,
//         null,
//         false
//       );
      
//       var node;
//       while (node = walker.nextNode()) {
//         var text = node.textContent.trim();
//         if (text.match(/^₹[\d,]+$/) && text.length > 3) {
//           price = text;
//           console.log('Found price with text node search:', price);
//           break;
//         }
//       }
//     }
    
//     console.log('=== FINAL RESULTS ===');
//     console.log('Title:', title);
//     console.log('Price:', price);
//     console.log('URL:', window.location.href);
    
//     return { 
//       title: title, 
//       price: price, 
//       url: window.location.href 
//     };
    
//   } catch (error) {
//     console.error('Error getting product info:', error);
//     return { 
//       title: 'Error: ' + error.message, 
//       price: 'Error', 
//       url: window.location.href 
//     };
//   }
// }



// content-script.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) { 
  if (request.message === "get_product_info") {
    var productInfo = getProductInfo();
    sendResponse(productInfo);
  }
  return true; // keep connection alive for async safety
});


function getProductInfo() {
  try {
    let hostname = window.location.hostname.toLowerCase();
    let title = "Title not found";
    let price = "Price not found";

    // ************************
    // Flipkart scraping
    // ************************
    if (hostname.includes("flipkart.com")) {
      // Product title (Flipkart uses different classes sometimes)
      let titleElement =
        document.querySelector(".VU-ZEz") ||
        document.querySelector(".B_NuCI") ||
        document.querySelector("span[data-testid='product-title']");

      if (titleElement) title = titleElement.textContent.trim();

      // Product price
      let priceElement =
        document.querySelector(".Nx9bqj.CxhGGd") || // new Flipkart price class
        document.querySelector("._30jeq3");         // older Flipkart price class

      if (priceElement) price = priceElement.textContent.trim();

      return {
        site: "flipkart",
        title: title,
        price: price,
        url: window.location.href
      };
    }

    // ************************
    // Amazon scraping
    // ************************
else if (hostname.includes("amazon.")) {
  // Product title
  let titleElement = document.querySelector("#productTitle");
  if (titleElement) {
    title = titleElement.textContent.trim();
  }

  // Product price
  let priceElement = document.querySelector(".reinventPricePriceToPayMargin");
  if (priceElement) {
    price = priceElement.textContent.trim();   // ✅ no 'let' here, just assign
  }

  return {
    site: "amazon",
    title: title,
    price: price,
    url: window.location.href
  };
}




    // ************************
    // Unknown site
    // ************************
    else {
      return {
        site: "unknown",
        title: "Title not found",
        price: "Price not found",
        url: window.location.href
      };
    }
  } catch (error) {
    console.error("Error getting product info:", error);
    return {
      site: "error",
      title: "Error: " + error.message,
      price: "Error",
      url: window.location.href
    };
  }
}
