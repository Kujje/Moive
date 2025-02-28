const missingPoster = "../res/icons/missing-poster.svg";

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function removeFavorite(imdbID) {
    const favoriteMovies = getFavorites().filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem("favorites", JSON.stringify(favoriteMovies));
    displayFavorites();
}

function displayFavorites() {
    const container = document.getElementById("favoritesContainer");
    if (!container) return;

    const favoriteMovies = getFavorites();
    container.innerHTML = favoriteMovies.length === 0 ? "<p>No favorites saved yet.</p>" : "";

    favoriteMovies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        const posterSrc = movie.Poster !== "N/A" ? movie.Poster : missingPoster;

        movieCard.innerHTML = `
            <div class="movie-header">
                <span class="favorite-btn" data-id="${movie.imdbID}">❤️</span>
            </div>
            <img src="${posterSrc}" alt="${movie.Title}" class="movie-poster">
            <h3 class="movie-title">${movie.Title}</h3>
            <button class="movie-btn">Read More</button>
        `;

        movieCard.querySelector(".favorite-btn").addEventListener("click", () => removeFavorite(movie.imdbID));
        movieCard.querySelector(".movie-btn").addEventListener("click", () => openMovie(movie.imdbID));

        container.appendChild(movieCard);
    });
}

function openMovie(imdbID) {
    window.location.href = `movie.html?id=${imdbID}`;
}

document.addEventListener("DOMContentLoaded", displayFavorites);
