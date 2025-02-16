//chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//  if (request.tags) {
//    // Update the popup's tags list with the received tags
//    const tagsListDiv = document.getElementById("tags-list");
//    
//    // Clear any previous content
//    tagsListDiv.innerHTML = '';
//
//    // Create and append divs for each tag
//    request.tags.forEach(function(tag) {
//      const tagDiv = document.createElement("div");
//      tagDiv.textContent = tag;
//      tagsListDiv.appendChild(tagDiv);
//    });
//  }
//});
//
