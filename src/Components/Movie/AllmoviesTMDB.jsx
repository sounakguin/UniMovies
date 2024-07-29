import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import GenreFilter from "../Movie/FilterMovie";
import SearchMovies from "../Movie/Searchbar";

const TMDB_API_KEY = "d00cb3e60d55a92130bdafb5ff634708";

export default function AllmoviesTMDB() {
  const [category, setCategory] = useState("popular");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const initialLimit = 30;

  // Fetch genres from TMDB API
  const fetchGenres = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch genres: ${response.statusText}`);
      }
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  // Fetch movies based on category and genre
  const fetchMovies = async (category, page, genreId) => {
    try {
      setIsLoading(true);
      const url = genreId
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&page=${page}&with_genres=${genreId}`
        : `https://api.themoviedb.org/3/movie/${category}?api_key=${TMDB_API_KEY}&page=${page}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
      }
      const data = await response.json();
      if (page === 1) {
        setMovies(data.results); // Set initial movies or search results
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.results]); // Append more movies
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setIsLoading(false);
    }
  };

  // Handle search results from SearchMovies component
  const handleSearchResults = (data) => {
    setMovies(data); // Update movies with search results
  };

  // Handle genre button click
  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    setMovies([]);
    setPage(1);
    fetchMovies(category, 1, genreId);
  };

  // Load more movies when scrolled to the end
  const loadMoreMovies = useCallback(() => {
    if (!isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading]);

  // Observer for last movie element
  const lastMovieElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMovies();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, loadMoreMovies]
  );

  // Initial fetch of movies
  useEffect(() => {
    fetchMovies(category, page, selectedGenre);
  }, [category, page, selectedGenre]);

  return (
    <div className="">
         <br />
      <SearchMovies onSearch={handleSearchResults} />
      <br />
      <br />
      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        handleGenreClick={handleGenreClick}
      />
         <br />
      <div className="mx-auto w-3/4 mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie, index) => (
            <Link
              to={`/movie/${movie.id}`}
              style={{ textDecoration: "none", color: "white" }}
              key={movie.id}
              ref={index === movies.length - 1 ? lastMovieElementRef : null}
            >
              <div className="cards m-2">
                <img
                  className="cards__img"
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.original_title}
                />
                <div className="cards__overlay">
                  <div className="card__title">{movie.original_title}</div>
                  <div className="card__runtime">
                    {movie.release_date}
                    <span className="card__rating">
                      {movie.vote_average}
                      <i className="fas fa-star" />
                    </span>
                  </div>
                  <div className="card__description">
                    {movie.overview.slice(0, 115) + "..."}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {isLoading && <div>Loading...</div>}
      </div>
    </div>
  );
}
