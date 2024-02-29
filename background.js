let selectedColor = ''; 

// Global variable to store the color
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.selectedColor) {
    selectedColor = changes.selectedColor.newValue;
  }
});

// Adding header in onBeforeSendHeaders
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if (selectedColor) {
      details.requestHeaders.push({name: "X-PwnFox-Color", value: selectedColor});
    }
    return {requestHeaders: details.requestHeaders};
  },
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]
);
