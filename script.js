//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; 

  const episodesContainer = document.createElement("section");
  episodesContainer.classList.add("episodes-container");

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");

    const seasonPadded = episode.season.toString().padStart(2, "0");
    const episodePadded = episode.number.toString().padStart(2, "0");
    const episodeCode = `S${seasonPadded}E${episodePadded}`;

    const title = document.createElement("h3");
    title.textContent = `${episode.name} - ${episodeCode}`;

    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = `Screenshot of ${episode.name}`;

    const summary = document.createElement("div");
    summary.innerHTML = episode.summary;

    episodeCard.appendChild(title);
    episodeCard.appendChild(image);
    episodeCard.appendChild(summary);

    episodesContainer.appendChild(episodeCard);
  });

  rootElem.appendChild(episodesContainer);

  const footer = document.createElement("footer");
  footer.innerHTML = 'Data provided by <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
  rootElem.appendChild(footer);
}

window.onload = setup;
