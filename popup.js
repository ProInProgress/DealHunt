

// // popup.js
// document.addEventListener('DOMContentLoaded', function() {
//   var button = document.getElementById("mybutton");
//   var textinfo = document.getElementById("textinfo");

//   button.addEventListener("click", function() {
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//       var currentTab = tabs[0];

//       textinfo.innerHTML = "Getting product info...";

//       // Send message to content script to get product info
//       chrome.tabs.sendMessage(
//         currentTab.id,
//         { message: "get_product_info" },
//         function(response) {
//           if (response && response.title && response.title !== "Title not found") {
//             displayResults(response);
//           } else {
//             textinfo.innerHTML = "Error: Could not get product info. Please make sure you're on a product page (Amazon or Flipkart).";
//           }
//         }
//       );
//     });
//   });
// });

// function displayResults(productInfo) {
//   var textinfo = document.getElementById("textinfo");

//   // Figure out target site (opposite of current)
//   var targetSite = productInfo.site === "amazon" ? "Flipkart" : "Amazon";

//   // Create HTML to display the results
//   var resultsHTML = `
//     <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">
//       <h3 style="margin: 0 0 10px 0; color: #2874F0;">Product Found:</h3>
//       <p style="margin: 5px 0;"><strong>Title:</strong> ${productInfo.title}</p>
//       <p style="margin: 5px 0;"><strong>Price:</strong> ${productInfo.price}</p>
//       <button id="searchOtherSite" style="margin-top: 10px; padding: 8px 15px; background: #FF9900; color: white; border: none; border-radius: 4px; cursor: pointer;">Search on ${targetSite}</button>
//     </div>
//   `;

//   textinfo.innerHTML = resultsHTML;

//   // Add event listener to the new button
//   document.getElementById("searchOtherSite").addEventListener("click", function() {
//     if (productInfo.site === "amazon") {
//       findOnFlipkart(productInfo.title);
//     } else {
//       findOnAmazon(productInfo.title);
//     }
//   });
// }

// function findOnAmazon(title) {
//   var amazonSearchUrl = "https://www.amazon.in/s?k=" + encodeURIComponent(title);
//   chrome.tabs.create({ url: amazonSearchUrl });
// }

// function findOnFlipkart(title) {
//   var flipkartSearchUrl = "https://www.flipkart.com/search?q=" + encodeURIComponent(title);
//   chrome.tabs.create({ url: flipkartSearchUrl });
// }



document.addEventListener("DOMContentLoaded", function () {
  var button = document.getElementById("mybutton");
  var textinfo = document.getElementById("textinfo");

  button.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentTab = tabs[0];

      textinfo.innerHTML = "Getting product info...";

      chrome.tabs.sendMessage(currentTab.id, { message: "get_product_info" }, function (response) {
        if (response && response.title && response.title !== "Title not found") {
          displayResults(response);
        } else {
          textinfo.innerHTML =
            "Error: Could not get product info. Please make sure you're on a product page (Amazon or Flipkart).";
        }
      });
    });
  });
});

function displayResults(productInfo) {
  var textinfo = document.getElementById("textinfo");

  var targetSite = productInfo.site === "amazon" ? "Flipkart" : "Amazon";

  var resultsHTML = `
    <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">
      <h3 style="margin: 0 0 10px 0; color: #2874F0;">Product Found:</h3>
      <p style="margin: 5px 0;"><strong>Title:</strong> ${productInfo.title}</p>
      <p style="margin: 5px 0;"><strong>Price:</strong> ${productInfo.price}</p>
      <button id="searchOtherSite" style="margin-top: 10px; padding: 8px 15px; background: #FF9900; color: white; border: none; border-radius: 4px; cursor: pointer;">Search on ${targetSite}</button>
    </div>
  `;

  textinfo.innerHTML = resultsHTML;

  document.getElementById("searchOtherSite").addEventListener("click", function() {
    if (productInfo.site === "amazon") {
      findOnFlipkart(productInfo.title);
    } else {
      findOnAmazon(productInfo.title);
    }
  });
}

function findOnAmazon(title) {
  let amazonSearchUrl = "https://www.amazon.in/s?k=" + encodeURIComponent(title);
  chrome.tabs.create({ url: amazonSearchUrl });
}

function findOnFlipkart(title) {
  let flipkartSearchUrl = "https://www.flipkart.com/search?q=" + encodeURIComponent(title);
  chrome.tabs.create({ url: flipkartSearchUrl });
}



