chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'groupTabs') {
    chrome.tabs.query({}, function(tabs) {
      const groupedTabs = {};

      tabs.forEach(tab => {
        const domain = new URL(tab.url).hostname;
        if (!groupedTabs[domain]) {
          groupedTabs[domain] = [];
        }

        groupedTabs[domain].push(tab.title);
      });

      sendResponse({ groupedTabs });
    });

    return true;
  } else if (request.message === 'activateTab') {
    // Find the tab with the matching domain and title
    chrome.tabs.query({}, function(tabs) {
      for (let i = 0; i < tabs.length; i++) {
        if (new URL(tabs[i].url).hostname === request.domain && tabs[i].title === request.title) {
          // Activate the tab
          chrome.tabs.update(tabs[i].id, { active: true });
          break;
        }
      }
    });
  }
});
