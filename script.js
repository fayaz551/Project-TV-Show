const episodesElem = document.getElementById("episodes-section");
const movieCardTemplate = document.getElementById("movie-card");
const searchInput = document.getElementById("search-input");
const numberOfMovies = document.getElementById("number-of-movies");
const sidebar = document.getElementById("sidebar");

const EPISODES_URL = "https://api.tvmaze.com/shows/82/episodes";

async function setup() {
  // Show loading message while fetching
  episodesElem.innerHTML = `<p class="info-text">Loading episodes...</p>`;

  try {
    const response = await fetch(EPISODES_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const allEpisodes = await response.json();

    // Now that we have data, initialize the UI
    makeDropDownForEpisodes(allEpisodes);
    makePageForEpisodes(allEpisodes);

    // Re-attach listeners using the fetched data
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filteredEpisodeList = allEpisodes.filter(
        ({ name, summary }) =>
          name.toLowerCase().includes(term) ||
          summary.toLowerCase().includes(term),
      );
      makePageForEpisodes(filteredEpisodeList);
    });

    sidebar.addEventListener("change", (e) => {
      const selectedEpisode = e.target.value;
      const episode = !selectedEpisode
        ? allEpisodes
        : allEpisodes.filter(
            ({ name }) => name.toLowerCase() === selectedEpisode,
          );
      makePageForEpisodes(episode);
    });

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

  sidebar.innerHTML = ""; // Ensure sidebar is clear
  sidebar.append(...options);
}

function makeTitle(name, season, number, dropDown = false) {
  if (dropDown)
    return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")} - ${name}`;
  return `${name} - S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

function makePageForEpisodes(episodeList) {
  numberOfMovies.textContent = `${episodeList.length}${episodeList.length === 1 ? " movie" : " movies"}`;
  episodesElem.textContent = "";
  const movieCards = episodeList.map(
    ({ name, season, number, image, summary, url }) => {
      const movieCard = movieCardTemplate.content.cloneNode(true);
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

window.onload = setup;