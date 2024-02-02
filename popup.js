function displayGroupedTabs() {
  // Clear the displayedTitles set
  chrome.storage.local.set({ displayedTitles: [] }, function () {
    if (chrome.runtime.lastError) {
      console.error('Error clearing displayedTitles:', chrome.runtime.lastError);
    }
  });
  chrome.runtime.sendMessage({ message: 'groupTabs' }, function (response) {
    if (chrome.runtime.lastError) {
      console.error('Error fetching tabs:', chrome.runtime.lastError);
      return;
    }

    const tabList = document.getElementById('tabList');

    // Retrieve displayedTitles from storage or initialize an empty array
    chrome.storage.local.get({ displayedTitles: [] }, function (result) {
      const displayedTitles = new Set(result.displayedTitles);

      console.log('Stored displayedTitles:', displayedTitles);

      for (const domain in response.groupedTabs) {
        const domainGroup = response.groupedTabs[domain];

        domainGroup.forEach(tabTitle => {
          if (!displayedTitles.has(tabTitle)) {
            const li = document.createElement('li');
            li.textContent = `${domain}: ${tabTitle}`;
            tabList.appendChild(li);

            // Add a click event listener to the list item
            li.addEventListener('click', function() {
              // Send a message to the background script to activate the tab
              chrome.runtime.sendMessage({ message: 'activateTab', domain: domain, title: tabTitle });
            });

            displayedTitles.add(tabTitle);
          } else {
            console.log(`Skipped duplicate: ${domain}: ${tabTitle}`);
          }
        });
      }

      console.log('Updated displayedTitles:', displayedTitles);

      // Store the updated displayedTitles set in chrome.storage.local
      chrome.storage.local.set({ displayedTitles: Array.from(displayedTitles) }, function () {
        if (chrome.runtime.lastError) {
          console.error('Error storing displayedTitles:', chrome.runtime.lastError);
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', displayGroupedTabs);
