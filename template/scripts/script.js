import { fetchAllMovies } from './modules/api.js';
import { renderTrailers } from './modules/caroussel.js';
import { toggleFavorite } from './modules/favorites.js'; 
import { displaySearchResults } from './modules/search.js';

async function loadTrailers() {
    try {
        const movies = await fetchAllMovies();
        
        if (!movies || movies.length === 0) return;

        movies.sort(() => Math.random() - 0.5);

        const trailerContainer = document.querySelector(".trailers__container");
        trailerContainer.innerHTML = "";

        movies.slice(0, 5).forEach((movie, index) => {
            renderTrailers(movie, index + 1);
        });

    } catch (error) {
        console.error('Error loading trailers:', error);
    }
}

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function handleFavorite(movie) {
    let favoriteMovies = getFavorites();
    const index = favoriteMovies.findIndex(fav => fav.imdbID === movie.imdbID);

    index === -1 ? favoriteMovies.push(movie) : favoriteMovies.splice(index, 1);

    localStorage.setItem("favorites", JSON.stringify(favoriteMovies));
    showMovies();
}

async function showMovies() {
    try {
        const movies = await fetchAllMovies();
        const container = document.getElementById('moviesContainer');

        container.innerHTML = "";
        const missingPoster = "./res/icons/missing-poster.svg";

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            const favorites = getFavorites();
            const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
            const heartIcon = isFavorite ? "❤️" : "🤍";

            const posterSrc = movie.Poster !== "N/A" ? movie.Poster : missingPoster;

            movieCard.innerHTML = `
                <div class="movie-header">
                    <span class="favorite-btn" data-id="${movie.imdbID}">${heartIcon}</span>
                </div>
                <img src="${posterSrc}" alt="${movie.Title}" class="movie-poster">
                <h3 class="movie-title">${movie.Title}</h3>
                <button class="movie-btn">Read More</button>
            `;

            movieCard.querySelector('.favorite-btn').addEventListener('click', () => handleFavorite(movie));
            movieCard.querySelector('.movie-btn').addEventListener('click', () => openMovie(movie.imdbID));

            container.appendChild(movieCard);
        });
    } catch (error) {
        console.log("Error fetching movies:", error);
    }
}

function openMovie(imdbID) {
    window.location.href = `movie.html?id=${imdbID}`;
}

function setupSearch() {
    document.getElementById("searchForm").addEventListener("submit", event => {
        event.preventDefault();
        const searchQuery = document.getElementById("searchInput").value.trim();
        if (searchQuery) window.location.href = `search.html?query=${searchQuery}`;
    });
}

if (window.location.pathname.includes('index.html')) {
    loadTrailers();
    showMovies();
    setupSearch();
}
