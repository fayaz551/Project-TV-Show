const episodesElem = document.getElementById("episodes-section");
const episodeCardTemplate = document.getElementById("episode-card-template");
const searchInput = document.getElementById("search-input");
const numberOfMovies = document.getElementById("number-of-movies");
const showDropDown = document.getElementById("show-dropdown");
const episodeDropDown = document.getElementById("episode-dropdown");

let numberOfEpisodes = 0;
async function setup() {
  try {
    const allShows = await getShow();
    makeDropDownForShows(allShows);
  } catch (error) {
    // Notify user of error (Requirement 5)
    episodesElem.innerHTML = `
      <div class="error-container">
        <p>Something went wrong while loading the show data.</p>
        <p><strong>Error:</strong> ${error.message}</p>
        <button onclick="location.reload()">Try Again</button>
      </div>
    `;
  }
}

window.onload = setup;

function makeDropDownForShows(showList) {
  console.log(showList.sort((a, b) => a.name.localeCompare(b.name)));
  const options = showList.sort().map(({ name, id }) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = name;
    return option;
  });

  showDropDown.innerHTML = ""; // Ensure showDropDown is clear
  showDropDown.append(...options);
  showEpisodes(1);
  showDropDown.addEventListener("change", async (e) => {
    const id = e.target.value;
    searchInput.value = "";
    episodeDropDown.value = "";

    showEpisodes(id);
  });
}

async function showEpisodes(id) {
  episodesElem.innerHTML = `<p class="info-text">Loading episodes...</p>`;

  const allEpisodes = await getEpisode(id);

  numberOfEpisodes = allEpisodes.length;
  makeDropDownForEpisodes(allEpisodes);
  makePageForEpisodes(allEpisodes);
  episodeDropDown.addEventListener("change", (e) => {
    searchInput.value = "";

    populateEpisodeDropDown(e, allEpisodes);
  });
  searchInput.addEventListener("input", (e) => searchEpisodes(e, allEpisodes));
}

function makeDropDownForEpisodes(episodeList) {
  const options = episodeList.map(({ name, season, number }) => {
    const option = document.createElement("option");
    option.value = name.toLowerCase();
    option.textContent = makeTitle(name, season, number, true);
    return option;
  });

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All episodes";
  options.unshift(defaultOption);

  episodeDropDown.innerHTML = ""; // Ensure episodeDropDown is clear
  episodeDropDown.append(...options);
}

function makePageForEpisodes(episodeList) {
  numberOfMovies.textContent = `Displaying ${episodeList.length} / ${numberOfEpisodes} episodes`;
  episodesElem.textContent = "";
  const movieCards = episodeList.map(
    ({ name, season, number, image, summary, url }) => {
      const movieCard = episodeCardTemplate.content.cloneNode(true);
      movieCard.querySelector("h3").textContent = makeTitle(
        name,
        season,
        number,
      );
      movieCard.querySelector("img").src = image.medium;
      movieCard.querySelector("img").alt = name;
      movieCard.querySelector("p").innerHTML = summary;
      movieCard.querySelector("a").href = url;
      movieCard.querySelector("a").textContent = "View on TVMaze";

      return movieCard;
    },
  );

  episodesElem.append(...movieCards);
}
function searchEpisodes(e, allEpisodes) {
  episodeDropDown.value = "";
  const term = e.target.value.toLowerCase();
  const filteredEpisodeList = allEpisodes.filter(
    ({ name, summary }) =>
      name.toLowerCase().includes(term) || summary.toLowerCase().includes(term),
  );
  makePageForEpisodes(filteredEpisodeList);
}

function populateEpisodeDropDown(e, allEpisodes) {
  const selectedEpisode = e.target.value;
  // if no episode selected, show all
  const episode = !selectedEpisode
    ? allEpisodes
    : allEpisodes.filter(({ name }) => name.toLowerCase() === selectedEpisode);
  makePageForEpisodes(episode);
}

function makeTitle(name, season, number, dropDown = false) {
  if (dropDown)
    // Creates title for dropdown menu
    return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")} - ${name}`;

  // creates title for each movie card
  return `${name} - S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}
