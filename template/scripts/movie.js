import { fetchMovieDetails } from '../modules/api.js';

const missingPoster = "../res/icons/missing-poster.svg"; 

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function toggleFavorite(movie) {
    let favoriteMovies = getFavorites();
    const index = favoriteMovies.findIndex(fav => fav.imdbID === movie.imdbID);
    const favoriteButton = document.getElementById("favoriteButton");

    if (index === -1) {
        favoriteMovies.push(movie);
        favoriteButton.textContent = "❤️";
    } else {
        favoriteMovies.splice(index, 1);
        favoriteButton.textContent = "🤍";
    }

    localStorage.setItem("favorites", JSON.stringify(favoriteMovies));
}

async function displayMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get("id");

    if (!imdbID) {
        document.getElementById('movieInformation').innerHTML = "<p>No movie found.</p>";
        return;
    }

    const movie = await fetchMovieDetails(imdbID);

    const isFavorite = getFavorites().some(fav => fav.imdbID === movie.imdbID);
    const heartIcon = isFavorite ? "❤️" : "🤍"; 

    const posterSrc = movie.Poster !== "N/A" ? movie.Poster : missingPoster;

    document.getElementById('movieInformation').innerHTML = `
    <div class="movie-detail-container">
        <img src="${posterSrc}" alt="${movie.Title || 'No image available'}" class="movie-detail-poster">
        <div class="movie-detail-info">
            <h2>${movie.Title}</h2>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Rating:</strong> ${movie.imdbRating}</p>
            <p><strong>Time:</strong> ${movie.Runtime}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
        </div>
        <span class="favorite-btn" id="favoriteButton">${heartIcon}</span>
    </div>
    `;

    document.getElementById('favoriteButton').addEventListener('click', function () {
        toggleFavorite(movie);
    });
}

displayMovieDetails();
