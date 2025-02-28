const API_KEY = 'ce944605';
const MOVIE_LIST_URL = 'https://santosnr6.github.io/Data/favoritemovies.json';

export async function fetchAllMovies() {
    try {
        const response = await fetch(MOVIE_LIST_URL);
        if (!response.ok) throw new Error("Failed to fetch movies");

        const movies = await response.json();
        return movies.slice(0, 20); 
    } catch (error) {
        console.error("Error fetching movies:", error);
        return []; 
    }
}

export async function fetchMovieDetails(imdbID) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`);
        if (!response.ok) throw new Error("Failed to fetch movie details");

        const movie = await response.json();
        if (movie.Response === "False") throw new Error(movie.Error); 

        return movie;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null; 
    }
}

export async function searchMovies(query) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
        if (!response.ok) throw new Error("Failed to search movies");

        const data = await response.json();
        if (data.Response === "False") throw new Error(data.Error);

        return data.Search || []; 
    } catch (error) {
        console.error("Error searching movies:", error);
        return []; 
    }
}
