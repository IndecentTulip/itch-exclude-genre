let tags = [];

function updateTags() {
  const tagsMap = {};
  // Re-query all genre elements to capture additions/removals
  document.querySelectorAll('.game_genre').forEach(tagElem => {
    const genre = tagElem.textContent.trim();
    tagsMap[genre] = true;
  });
  tags = Object.keys(tagsMap);
  // Notify the popup (if open) about the updated tags
  chrome.runtime.sendMessage({ action: 'genresUpdated', tags });
}

// Initial tags collection
updateTags();

// Watch for DOM changes to update tags dynamically
const observer = new MutationObserver(mutations => {
  let needsUpdate = false;
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      needsUpdate = true;
    }
  });
  if (needsUpdate) updateTags();
});

// Start observing the entire document for structural changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Listen for requests from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getGenre') {
    sendResponse({ tags });
  }
  return true; // Keep the message channel open for async responses
});
