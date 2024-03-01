// Function to update rules according to selected color
function updateDynamicRulesForColor(selectedColor) {
  const rules = [{
    "id": 1,
    "priority": 1,
    "action": {
      "type": "modifyHeaders",
      "requestHeaders": [
        {
          "header": "X-PwnFox-Color",
          "operation": "set",
          "value": selectedColor
        }
      ]
    },
    "condition": {
      "urlFilter": "|http",
      "resourceTypes": ["main_frame"]
    }
  }];

  // If no color is selected, remove the rule
  if (!selectedColor) {
    chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: [1]});
  } else {
    chrome.declarativeNetRequest.updateDynamicRules({addRules: rules, removeRuleIds: [1]});
  }
}

// Listener for color changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.selectedColor) {
    updateDynamicRulesForColor(changes.selectedColor.newValue);
  }
});
