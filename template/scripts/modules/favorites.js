const missingPoster = "../res/icons/missing-poster.svg";

export function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

export function toggleFavorite(movie) {
    let favoriteMovies = getFavorites();
    const index = favoriteMovies.findIndex(fav => fav.imdbID === movie.imdbID);
    
    if (index === -1) {
        favoriteMovies.push(movie);
    } else {
        favoriteMovies.splice(index, 1);
    }

    localStorage.setItem("favorites", JSON.stringify(favoriteMovies));
}

export function removeFavorite(imdbID) {
    let favoriteMovies = getFavorites();
    favoriteMovies = favoriteMovies.filter(movie => movie.imdbID !== imdbID);
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
