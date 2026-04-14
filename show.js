async function getShow() {
  const SHOWS_URL = `https://api.tvmaze.com/shows`;

  try {
    const response = await fetch(SHOWS_URL);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function getEpisode(id = 82) {
  const EPISODES_URL = `https://api.tvmaze.com/shows/${id}/episodes`;
  try {
    const response = await fetch(EPISODES_URL);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
