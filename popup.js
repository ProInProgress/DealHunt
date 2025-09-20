// popup.js
document.addEventListener('DOMContentLoaded', function() {
  var button = document.getElementById("mybutton");
  var textinfo = document.getElementById("textinfo");
  
  button.addEventListener("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var currentTab = tabs[0];
      
      // Check if we are on a Flipkart page
      if (currentTab.url.includes('flipkart.com')) {
        textinfo.innerHTML = "Getting product info...";
        
        // Send message to content script to get product info
        chrome.tabs.sendMessage(currentTab.id, { message: "get_product_info" }, function(response) {
          if (response && response.title && response.title !== 'Title not found') {
            // Show the results in the popup instead of opening new tab
            displayResults(response);
          } else {
            textinfo.innerHTML = "Error: Could not get product info. Please make sure you're on a Flipkart product page.";
          }
        });
      } else {
        textinfo.innerHTML = "Please navigate to a Flipkart product page to use this extension.";
      }
    });
  });
});

function displayResults(productInfo) {
  var textinfo = document.getElementById("textinfo");
  
  // Create HTML to display the results
  var resultsHTML = `
    <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">
      <h3 style="margin: 0 0 10px 0; color: #2874F0;">Product Found:</h3>
      <p style="margin: 5px 0;"><strong>Title:</strong> ${productInfo.title}</p>
      <p style="margin: 5px 0;"><strong>Price:</strong> ${productInfo.price}</p>
      <button id="searchAmazon" style="margin-top: 10px; padding: 8px 15px; background: #FF9900; color: white; border: none; border-radius: 4px; cursor: pointer;">Search on Amazon</button>
    </div>
  `;
  
  textinfo.innerHTML = resultsHTML;
  
  // Add event listener to the new button
  document.getElementById("searchAmazon").addEventListener("click", function() {
    findOnAmazon(productInfo.title);
  });
}

function findOnAmazon(title) {
  // Create Amazon search URL (but don't open it automatically)
  var amazonSearchUrl = 'https://www.amazon.in/s?k=' + encodeURIComponent(title) + '&linkCode=ll2&tag=534ade-21';
  
  // Only open in new tab when user clicks the button
  chrome.tabs.create({ url: amazonSearchUrl });
}