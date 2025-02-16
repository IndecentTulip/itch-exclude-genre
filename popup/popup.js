const genreListDiv = document.getElementById("genre-list");
const patternsListDiv = document.getElementById("patterns-list");
let patterns = []; // This holds the selected patterns

function refreshGenreList(genres) {
  genreListDiv.innerHTML = ''; // Clear existing buttons
  genres.forEach(genre => {
    const genreButton = document.createElement("button");
    genreButton.textContent = genre;
    genreButton.classList.add("pattern-button");
    genreListDiv.appendChild(genreButton);
  });
}

function fetchAndDisplayGenre() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getGenre' }, (response) => {
      if (response?.tags) {
        refreshGenreList(response.tags);
      }
    });
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'genresUpdated') {
    refreshGenreList(message.tags);
  }
})
// Function to display the selected patterns
function updatePatternsDisplay() {
  patternsListDiv.textContent = `${patterns.join(", ")}`;
}

// Fetch and display genre tags from the active tab
function fetchAndDisplayGenre() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getGenre' }, function(response) {
      const tags = response.tags;
      
      // Clear any previous tags
      genreListDiv.innerHTML = '';

      // Create and append new buttons for each tag
      tags.forEach(function(tag) {
        const genreDiv = document.createElement("button");
        genreDiv.textContent = tag;
        genreDiv.classList.add("pattern-button");
        genreListDiv.appendChild(genreDiv);
      });
    });
  });
}

fetchAndDisplayGenre();

// Event listener for pattern selection
genreListDiv.addEventListener('click', (e) => {
  if (e.target.classList.contains('pattern-button')) {
    const newPattern = e.target.textContent; // Get button text content
    if (!patterns.includes(newPattern)) {  // Avoid duplicates
      patterns.push(newPattern); // Append the new pattern
      updatePatternsDisplay(); // Update the displayed list
    }
  }
});

const button = document.getElementById('test');
button.addEventListener('click', () => {
  if (patterns.length > 0) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.executeScript(tabs[0].id, {
        code: `
          (function() {
            const patterns = ${JSON.stringify(patterns)};
            let observer; // Store the observer reference

            function removeGameCells() {
              document.querySelectorAll('.game_cell').forEach(function(cell) {
                const genre = cell.querySelector('.game_genre');
                if (genre && patterns.includes(genre.textContent.trim())) {
                  cell.remove();
                }
              });
            }

            // Disconnect any existing observer
            if (observer) {
              observer.disconnect();
            }

            removeGameCells();
            observer = new MutationObserver(removeGameCells);
            observer.observe(document.body, { childList: true, subtree: true });
          })();
        `
      });
    });
  } else {
    alert("Please select at least one pattern before testing.");
  }
});

