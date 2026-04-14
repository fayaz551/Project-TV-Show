const cache = {};

async function getShow() {
  const SHOWS_URL = `https://api.tvmaze.com/shows`;
  try {
    const response = await fetch(SHOWS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch shows: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getEpisode(id) {
  // Requirement 6: Check if we already have these episodes in our cache
  if (cache[id]) {
    return cache[id];
  }

  const EPISODES_URL = `https://api.tvmaze.com/shows/${id}/episodes`;
  try {
    const response = await fetch(EPISODES_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch episodes: ${response.status}`);
    }
    const data = await response.json();
    cache[id] = data; // Store in cache for next time
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}