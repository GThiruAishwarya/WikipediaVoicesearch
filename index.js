let searchInputEl = document.getElementById("searchInput");
let searchResultsEl = document.getElementById("searchResults");
let spinnerEl = document.getElementById("spinner");
let clearButtonEl = document.getElementById("clearButton");
let voiceButtonEl = document.getElementById("voiceButton");

// Function to create search result cards
function createAndAppendSearchResult(result) {
    let {
        link,
        title,
        description
    } = result;

    let resultItemEl = document.createElement("div");
    resultItemEl.classList.add("result-item");

    let titleEl = document.createElement("a");
    titleEl.href = link;
    titleEl.target = "_blank";
    titleEl.textContent = title;
    titleEl.classList.add("result-title");
    resultItemEl.appendChild(titleEl);

    resultItemEl.appendChild(document.createElement("br"));

    let urlEl = document.createElement("a");
    urlEl.classList.add("result-url");
    urlEl.href = link;
    urlEl.target = "_blank";
    urlEl.textContent = link;
    resultItemEl.appendChild(urlEl);

    resultItemEl.appendChild(document.createElement("br"));

    let descriptionEl = document.createElement("p");
    descriptionEl.classList.add("link-description");
    descriptionEl.textContent = description;
    resultItemEl.appendChild(descriptionEl);

    searchResultsEl.appendChild(resultItemEl);
}

// Display search results
function displayResults(searchResults) {
    spinnerEl.classList.add("d-none");
    for (let result of searchResults) {
        createAndAppendSearchResult(result);
    }
}

// Search Wikipedia using API
function searchWikipedia(searchTerm) {
    if (!searchTerm) {
        alert("Please enter a search term.");
        return;
    }

    spinnerEl.classList.remove("d-none");
    searchResultsEl.textContent = "";

    let url = "https://apis.ccbp.in/wiki-search?search=" + searchTerm;

    fetch(url)
        .then(response => response.json())
        .then(jsonData => {
            let {
                search_results
            } = jsonData;
            if (search_results.length === 0) {
                alert("No results found. Try another search term.");
            }
            displayResults(search_results);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Failed to fetch results. Please try again.");
        });
}

// Enter key triggers search
searchInputEl.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchWikipedia(searchInputEl.value.trim());
    }
});

// Clear search results and input
clearButtonEl.addEventListener("click", function() {
    searchInputEl.value = "";
    searchResultsEl.textContent = "";
    spinnerEl.classList.add("d-none");
});

// Voice search functionality
voiceButtonEl.addEventListener("click", function() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert("Your browser does not support voice search.");
        return;
    }

    let recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        voiceButtonEl.textContent = "🎙️ Listening...";
    };

    recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript;
        searchInputEl.value = transcript;
        searchWikipedia(transcript);
    };

    recognition.onerror = () => {
        alert("Failed to capture voice. Please try again.");
    };

    recognition.onend = () => {
        voiceButtonEl.textContent = "🎙️ Voice Search";
    };

    recognition.start();
});
