import { searchMovies } from './api.js';
import { toggleFavorite, getFavorites } from './favorites.js'; // 🔹 Nu fungerar det!

const missingPoster = "../res/icons/missing-poster.svg";

export async function displaySearchResults() {
    const container = document.getElementById('searchResults');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");

    if (!query) {
        container.innerHTML = "<p>No search query entered.</p>";
        return;
    }

    const movies = await searchMovies(query);
    const favoriteMovies = getFavorites();

    container.innerHTML = movies.length > 0
        ? movies.map(movie => {
            const isFavorite = favoriteMovies.some(fav => fav.imdbID === movie.imdbID);
            return `
                <div class="movie-card">
                    <div class="movie-header">
                        <span class="favorite-btn" data-id="${movie.imdbID}">${isFavorite ? "❤️" : "🤍"}</span>
                    </div>
                    <img src="${movie.Poster !== "N/A" ? movie.Poster : missingPoster}" 
                         alt="${movie.Title}" class="movie-poster">
                    <h3 class="movie-title">${movie.Title}</h3>
                    <button class="movie-btn">Read More</button>
                </div>
            `;
        }).join("")
        : "<p>No results found.</p>";

    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const imdbID = this.getAttribute("data-id");
            const movie = movies.find(m => m.imdbID === imdbID);
            toggleFavorite(movie);
            displaySearchResults();
        });
    });

    document.querySelectorAll('.movie-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            window.location.href = `movie.html?id=${movies[index].imdbID}`;
        });
    });
}

if (document.getElementById('searchResults')) {
    displaySearchResults();
}
