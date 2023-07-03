const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const favoritesList = document.getElementById('favorites-list');
let favorites = [];

// Fetch movie search results from the API
async function searchMovies(query) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=ab0f82b6&s=${query}`);
  const data = await response.json();
  return data.Search || [];
}

// Add movie to favorites list
function addToFavorites(movie) {
  favorites.push(movie);
  renderFavorites();
}

function renderFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = '';

  favorites.forEach(movie => {
    if (movie && movie.Title && movie.Poster && movie.imdbID) {
      const li = document.createElement('li');
      li.className = 'favorite-item';
      li.innerHTML = `
        <div>
          <img src="${movie.Poster}" alt="${movie.Title}">
          <h3>${movie.Title}</h3>
          <button class="remove-btn" data-id="${movie.imdbID}">Remove from Favorites</button>
        </div>
      `;

      favoritesList.appendChild(li);
    }
  });
}

// Event listener for search input
searchInput.addEventListener('keyup', async (event) => {
  const query = event.target.value.trim();

  if (query.length >= 3) {
    const results = await searchMovies(query);
    renderSearchResults(results);
  } else {
    searchResults.innerHTML = '';
  }
});

// Event listener for remove button click
favoritesList.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-btn')) {
    const imdbID = event.target.getAttribute('data-id');
    removeFromFavorites(imdbID);
  }
});

// Function to display the movie details page
function showMovieDetails(movie) {
  // Open a new window or redirect to a new page to show the movie details
  window.open(`movie.html?imdbID=${movie.imdbID}`, '_blank');
}

// Function to get the movie details from the API
async function getMovieDetails(imdbID) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=ab0f82b6&i=${imdbID}`);
  const data = await response.json();
  return data;
}

// Function to render the movie details page
function renderMovieDetails(movie) {
  const movieDetails = document.getElementById('movie-details');
  movieDetails.innerHTML = `
    <div>
      <h2>${movie.Title}</h2>
      <img src="${movie.Poster}" alt="${movie.Title}">
      <p>${movie.Plot}</p>
      <p>Director: ${movie.Director}</p>
      <p>Actors: ${movie.Actors}</p>
      <p>Year: ${movie.Year}</p>
      <p>IMDB Rating: ${movie.imdbRating}</p>
      <button class="favorite-btn" data-id="${movie.imdbID}">Add to Favorites</button>
    </div>
  `;
}

// Event listener for movie details page load
window.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const imdbID = urlParams.get('imdbID');

  if (imdbID) {
    const movie = await getMovieDetails(imdbID);
    renderMovieDetails(movie);
  }
});

// Function to remove a movie from favorites
function removeFromFavorites(imdbID) {
  favorites = favorites.filter(movie => movie.imdbID !== imdbID);
  saveFavoritesToLocalStorage();
  renderFavorites();
}

// Function to save favorites to local storage
function saveFavoritesToLocalStorage() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to load favorites from local storage
function loadFavoritesFromLocalStorage() {
  const favoritesData = localStorage.getItem('favorites');
  if (favoritesData) {
    favorites = JSON.parse(favoritesData);
  }
}
// Function to add a movie to favorites
function addToFavorites(movie) {
  const favoriteMovie = {
    imdbID: movie.imdbID,
    Title: movie.Title,
    Poster: movie.Poster
  };

  favorites.push(favoriteMovie);
  saveFavoritesToLocalStorage();
  renderFavorites();
}

renderFavorites();
loadFavoritesFromLocalStorage();

// Function to render search results
function renderSearchResults(results) {
  searchResults.innerHTML = '';
  results.forEach((movie) => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');
    movieItem.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button class="favorite-btn" data-id="${movie.imdbID}">Add to Favorites</button>
    `;
    searchResults.appendChild(movieItem);
  });
}

// Function to handle favorite button click
function handleFavoriteButtonClick(event) {
  const favoriteButton = event.target;
  const imdbID = favoriteButton.getAttribute('data-id');
  const movie = searchResultsData.find((movie) => movie.imdbID === imdbID);
  if (movie) {
    favorites.push(movie);
    saveFavorites();
    renderFavorites();
  }
}
searchResults.addEventListener('click', async (event) => {
  if (event.target.classList.contains('favorite-btn')) {
    const imdbID = event.target.getAttribute('data-id');
    const movie = await getMovieDetails(imdbID);
    addToFavorites(movie);
  } else if (event.target.closest('.movie-item')) {
    const imdbID = event.target.closest('.movie-item').querySelector('.favorite-btn').getAttribute('data-id');
    const movie = await getMovieDetails(imdbID);
    showMovieDetails(movie);
  }
});

// Function to open movie details page
function openMovieDetailsPage(imdbID) {
  window.open(`movie.html?imdbID=${imdbID}`, '_blank');
}

// Get the IMDB ID from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get('imdbID');
console.log(imdbID); // Check the value in the browser console

// Fetch the movie details from the OMDB API
async function fetchMovieDetails(imdbID) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=ab0f82b6&i=${imdbID}`);
  const data = await response.json();
  return data;
}
// Function to render the movie details on the page
function renderMovieDetails(movie) {
  const movieTitle = document.getElementById('movieTitle');
  const moviePoster = document.getElementById('moviePoster');
  const moviePlot = document.getElementById('moviePlot');
  // Assign the retrieved movie information to the corresponding elements
  movieTitle.textContent = movie.Title;
  moviePoster.src = movie.Poster;
  moviePlot.textContent = movie.Plot;
  // Add code to populate additional elements with movie information as needed
}

// Call the fetchMovieDetails function and render the movie details
fetchMovieDetails(imdbID)
  .then((movie) => {
    renderMovieDetails(movie);
  })
  .catch((error) => {
    console.error('Error fetching movie details:', error);
  });

loadFavoritesFromLocalStorage();
renderFavorites();