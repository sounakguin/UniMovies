import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import GenreFilter from "../Movie/FilterMovie";
import SearchMovies from "../Movie/Searchbar";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const TMDB_API_KEY = "d00cb3e60d55a92130bdafb5ff634708";

export default function AllmoviesTMDB() {
  const [category, setCategory] = useState("popular");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const today = new Date().toISOString().split("T")[0];

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
      const filteredMovies = data.results.filter(
        (movie) => category !== "upcoming" || movie.release_date >= today
      );

      // Remove duplicates based on poster_path
      const removeDuplicatesByPath = (array) => {
        const seen = new Set();
        return array.filter((item) => {
          const path = item.poster_path;
          if (seen.has(path)) {
            return false;
          }
          seen.add(path);
          return true;
        });
      };

      const uniqueMovies = removeDuplicatesByPath(
        page === 1 ? filteredMovies : [...movies, ...filteredMovies]
      );

      setMovies(uniqueMovies);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setIsLoading(false);
    }
  };

  // Handle search results from SearchMovies component
  const handleSearchResults = (data) => {
    setMovies(data);
  };

  // Handle genre button click
  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    setMovies([]);
    setPage(1);
    fetchMovies(category, 1, genreId);
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setMovies([]);
    setPage(1);
    fetchMovies(newCategory, 1, selectedGenre);
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
      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        handleGenreClick={handleGenreClick}
      />
      <div className="hidden md:block mt-0 md:mt-8">
        <p className=" text-orange-300 text-center text-3xl">Special Filter</p>
        <div className="flex justify-center mt-5 w-3/4 mx-auto gap-4">
          <button
            onClick={() => handleCategoryChange("popular")}
            className={`relative py-3 px-6 text-lg rounded-md cursor-pointer transition-colors duration-300
            ${
              category === "popular"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }
            ${category === "popular" ? "border-none" : "border border-gray-300"}
          `}
            style={{
              borderRadius: "8px",
            }}
          >
            Popular
          </button>
          <button
            onClick={() => handleCategoryChange("top_rated")}
            className={`relative py-3 px-6 text-lg rounded-md cursor-pointer transition-colors duration-300
            ${
              category === "top_rated"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }
            ${
              category === "top_rated"
                ? "border-none"
                : "border border-gray-300"
            }
          `}
            style={{
              borderRadius: "8px",
            }}
          >
            Top Rated
          </button>
          <button
            onClick={() => handleCategoryChange("upcoming")}
            className={`relative py-3 px-6 text-lg rounded-md cursor-pointer transition-colors duration-300
            ${
              category === "upcoming"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }
            ${
              category === "upcoming" ? "border-none" : "border border-gray-300"
            }
          `}
            style={{
              borderRadius: "8px",
            }}
          >
            Upcoming
          </button>
          <button
            onClick={() => handleCategoryChange("now_playing")}
            className={`relative py-3 px-6 text-lg rounded-md cursor-pointer transition-colors duration-300
            ${
              category === "now_playing"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }
            ${
              category === "now_playing"
                ? "border-none"
                : "border border-gray-300"
            }
          `}
            style={{
              borderRadius: "8px",
            }}
          >
            Now Playing
          </button>
        </div>
      </div>

      <br />
      <div class="mx-auto md:w-3/4 mt-5">
  <div class="grid-container">
    {movies.map((movie, index) => (
      <Link
        to={`/movie/${movie.id}`}
        style={{ textDecoration: "none", color: "white" }}
        key={movie.id}
        ref={index === movies.length - 1 ? lastMovieElementRef : null}
      >
        <div class="card-container">
          {movie.poster_path ? (
            <LazyLoadImage
              class="card-image"
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.original_title}
              effect="blur"
            />
          ) : (
            <div class="fallback-image">
              No image available
            </div>
          )}
          <div class="card-overlay">
            <div class="card-title">{movie.original_title}</div>
            <div class="card-runtime">
              {movie.release_date}
              <span class="card-rating">
                <FontAwesomeIcon class="pr-1" icon={faStar} />
                {movie.vote_average}
              </span>
            </div>
            <div class="card-description">
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
