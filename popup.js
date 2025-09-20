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
        
        // Send a message to the content script to get product info
        chrome.tabs.sendMessage(currentTab.id, { message: "get_product_info" }, function(response) {
          if (response && response.title) {
            textinfo.innerHTML = "Found: " + response.title;
            findOnAmazon(response.title);
          } else {
            textinfo.innerHTML = "Error: Could not get product info. Please refresh the page.";
          }
        });
      } else {
        textinfo.innerHTML = "Please navigate to a Flipkart product page.";
      }
    });
  });
});

function findOnAmazon(title) {
  // USING THE CONFIRMED AMAZON URL FORMAT
  var amazonSearchUrl = 'https://www.amazon.in/s?k=' + encodeURIComponent(title) + '&linkCode=ll2&tag=534ade-21';
  chrome.tabs.create({ url: amazonSearchUrl });
}