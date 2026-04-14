const listingSection = document.getElementById("listing-section");
const episodeCardTemplate = document.getElementById("episode-card-template");
const showCardTemplate = document.getElementById("show-card-template");
const showDropDown = document.getElementById("show-dropdown");
const episodeDropDown = document.getElementById("episode-dropdown");
const episodeSelectWrapper = document.getElementById("episode-select-wrapper");
const backToShowsBtn = document.getElementById("back-to-shows-btn");
const numberOfMovies = document.getElementById("number-of-movies");
let searchInput = document.getElementById("search-input");

let appState = {
  allShows: [],
  currentEpisodes: [],
  activeView: "shows", 
};

async function setup() {
  try {
    const shows = await getShow();
    appState.allShows = shows.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    populateShowDropDown(appState.allShows);
    displayShowsView(); 

    searchInput.addEventListener("input", handleSearch);
    backToShowsBtn.addEventListener("click", displayShowsView);
  } catch (error) {
    console.error(error);
    listingSection.innerHTML = `<p class="error-text">Error loading app. Please refresh.</p>`;
  }
}

function displayShowsView() {
  window.scrollTo(0, 0);
  appState.activeView = "shows";
  episodeSelectWrapper.classList.add("hidden"); 
  backToShowsBtn.classList.add("hidden");
  showDropDown.value = "";
  searchInput.value = "";

  renderShows(appState.allShows);
}

function renderShows(showList) {
  listingSection.innerHTML = "";
  numberOfMovies.textContent = `Found ${showList.length} shows`;

  showList.forEach((show) => {
    const card = showCardTemplate.content.cloneNode(true);

    const title = card.querySelector(".show-title");
    title.textContent = show.name;
    title.addEventListener("click", () => loadShowEpisodes(show.id));

    const img = card.querySelector(".show-image");
    img.src = show.image ? show.image.medium : "https://via.placeholder.com/210x295?text=No+Image";
    img.addEventListener("click", () => loadShowEpisodes(show.id));

    card.querySelector(".show-summary").innerHTML = show.summary || "No summary available.";
    card.querySelector(".show-rating").textContent = `⭐ Rating: ${show.rating.average || "N/A"}`;
    card.querySelector(".show-genres").textContent = `🎭 Genres: ${show.genres.join(", ")}`;
    card.querySelector(".show-status").textContent = `📡 Status: ${show.status}`;
    card.querySelector(".show-runtime").textContent = `🕒 Runtime: ${show.runtime} mins`;

    listingSection.appendChild(card);
  });
}

async function loadShowEpisodes(showId) {
  window.scrollTo(0, 0);
  appState.activeView = "episodes";
  listingSection.innerHTML = `<p class="info-text">Loading episodes...</p>`;

  appState.currentEpisodes = await getEpisode(showId);

  episodeSelectWrapper.classList.remove("hidden");
  backToShowsBtn.classList.remove("hidden");
  showDropDown.value = showId;
  searchInput.value = "";

  makeDropDownForEpisodes(appState.currentEpisodes);
  makePageForEpisodes(appState.currentEpisodes);
}

function handleSearch(e) {
  const term = e.target.value.toLowerCase();

  if (appState.activeView === "shows") {
    const filtered = appState.allShows.filter((s) =>
        s.name.toLowerCase().includes(term) ||
        (s.summary && s.summary.toLowerCase().includes(term)) ||
        s.genres.some((g) => g.toLowerCase().includes(term))
    );
    renderShows(filtered);
  } else {
    const filtered = appState.currentEpisodes.filter((ep) =>
        ep.name.toLowerCase().includes(term) ||
        (ep.summary && ep.summary.toLowerCase().includes(term))
    );
    makePageForEpisodes(filtered);
  }
}

function populateShowDropDown(showList) {
  showDropDown.innerHTML = '<option value="">Select a show...</option>';
  showList.forEach(({ name, id }) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;
    showDropDown.appendChild(option);
  });

  showDropDown.addEventListener("change", (e) => {
    if (e.target.value === "") displayShowsView();
    else loadShowEpisodes(e.target.value);
  });
}

function makePageForEpisodes(episodeList) {
  numberOfMovies.textContent = `Displaying ${episodeList.length} / ${appState.currentEpisodes.length} episodes`;
  listingSection.innerHTML = "";

  episodeList.forEach((ep) => {
    const movieCard = episodeCardTemplate.content.cloneNode(true);
    movieCard.querySelector("h3").textContent = makeTitle(ep.name, ep.season, ep.number);
    movieCard.querySelector("img").src = ep.image ? ep.image.medium : "https://via.placeholder.com/210x295?text=No+Image";
    movieCard.querySelector("p").innerHTML = ep.summary || "No summary available.";
    movieCard.querySelector("a").href = ep.url;
    listingSection.appendChild(movieCard);
  });
}

function makeDropDownForEpisodes(episodeList) {
  episodeDropDown.innerHTML = '<option value="">All episodes</option>';
  episodeList.forEach((ep) => {
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = makeTitle(ep.name, ep.season, ep.number, true);
    episodeDropDown.appendChild(option);
  });

  episodeDropDown.onchange = (e) => {
    const selectedId = e.target.value;
    const filtered = !selectedId
      ? appState.currentEpisodes
      : appState.currentEpisodes.filter((ep) => ep.id == selectedId);
    makePageForEpisodes(filtered);
  };
}

function makeTitle(name, season, number, dropDown = false) {
  const s = String(season).padStart(2, "0");
  const e = String(number).padStart(2, "0");
  return dropDown ? `S${s}E${e} - ${name}` : `${name} - S${s}E${e}`;
}

window.onload = setup;