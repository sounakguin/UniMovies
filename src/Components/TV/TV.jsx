import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import SearchTVdata from "./SearchTVdata";
import FilterTV from "./FilterTV";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const API_KEY = "d00cb3e60d55a92130bdafb5ff634708";

// Fetch TV genres from TMDB API
const fetchTVGenres = async (setTVGenres) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch TV genres: ${response.statusText}`);
    }
    const data = await response.json();
    setTVGenres(data.genres);
  } catch (error) {
    console.error("Error fetching TV genres:", error);
  }
};

// Fetch TV shows based on category, genre, and page
const fetchTVShows = async (setTV, setIsLoading, category, genreId, page) => {
  try {
    setIsLoading(true);
    const url = genreId
      ? `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&with_genres=${genreId}`
      : `https://api.themoviedb.org/3/tv/${category}?api_key=${API_KEY}&language=en-US&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch TV shows: ${response.statusText}`);
    }
    const data = await response.json();
    setTV((prevTV) =>
      page === 1 ? data.results : [...prevTV, ...data.results]
    );
    setIsLoading(false);
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    setIsLoading(false);
  }
};

export default function TV() {
  const [tv, setTV] = useState([]);
  const [page, setPage] = useState(1);
  const [tvGenres, setTVGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [isLoading, setIsLoading] = useState(false);
  const initialFetch = useRef(true);

  useEffect(() => {
    fetchTVGenres(setTVGenres);
  }, []);

  useEffect(() => {
    if (initialFetch.current) {
      fetchTVShows(setTV, setIsLoading, selectedCategory, selectedGenre, page);
      initialFetch.current = false;
    } else {
      fetchTVShows(setTV, setIsLoading, selectedCategory, selectedGenre, page);
    }
  }, [page, selectedGenre, selectedCategory]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (data) => {
    setTV(data);
  };

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    setTV([]);
    setPage(1);
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    setTV([]);
    setPage(1);
  };

  return (
    <div>
      <br />
      <SearchTVdata Searchdata={handleSearch} />
      <br/>
      <FilterTV
        genres={tvGenres}
        selectedGenre={selectedGenre}
        handleGenreClick={handleGenreClick}
      />
      <div className="hidden md:block">
      <p className="text-orange-300 text-center text-3xl pt-6">
        Special Filter
      </p>
      <div className="flex justify-center mt-5 w-3/4 mx-auto gap-4">
        <button
          onClick={() => handleCategoryChange("popular")}
          className={`relative py-3 px-6 text-lg rounded-md cursor-pointer transition-colors duration-300
            ${
              selectedCategory === "popular"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }
            ${
              selectedCategory === "popular"
                ? "border-none"
                : "border border-gray-300"
            }
          `}
          style={{
            borderRadius: "8px",
          }}
        >
          Popular
        </button>
        <button
          onClick={() => handleCategoryChange("airing_today")}
          className={`relative py-3 px-6 text-lg rounded-md cursor-pointer transition-colors duration-300
            ${
              selectedCategory === "airing_today"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }
            ${
              selectedCategory === "airing_today"
                ? "border-none"
                : "border border-gray-300"
            }
          `}
          style={{
            borderRadius: "8px",
          }}
        >
          Airing Today
        </button>
        <button
          onClick={() => handleCategoryChange("on_the_air")}
          className={`relative py-3 px-6 text-lg rounded-md cursor-pointer transition-colors duration-300
            ${
              selectedCategory === "on_the_air"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }
            ${
              selectedCategory === "on_the_air"
                ? "border-none"
                : "border border-gray-300"
            }
          `}
          style={{
            borderRadius: "8px",
          }}
        >
          On TV
        </button>
        <button
          onClick={() => handleCategoryChange("top_rated")}
          className={`relative py-3 px-6 text-lg rounded-md cursor-pointer transition-colors duration-300
            ${
              selectedCategory === "top_rated"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }
            ${
              selectedCategory === "top_rated"
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
      </div>
      </div>

      <br />
      <div className="container mx-auto md:w-3/4 mt-5">
        <div className="movie-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {tv.map((tvShow) => (
            <Link
              to={`/tv/${tvShow.id}`}
              style={{ textDecoration: "none", color: "white" }}
              key={tvShow.id}
              
            >
              <div className="movie-card m-2">
                {tvShow.poster_path ? (
                  <LazyLoadImage
                    className="movie-img"
                    src={`https://image.tmdb.org/t/p/original${tvShow.poster_path}`}
                    alt={tvShow.original_name}
                    effect="blur"
                  />
                ) : (
                  <div
                    className="fallback-img"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      backgroundColor: "white",
                      color: "black",
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                      borderRadius: "4px",
                    }}
                  >
                    No image available
                  </div>
                )}

                <div className="overlay">
                  <div className="title">{tvShow.original_name}</div>
                  <div className="runtime">
                    {tvShow.first_air_date}
                    <span className="rating">
                    <FontAwesomeIcon
                        className="text-yellow-400 pr-1"
                        icon={faStar}
                      />
                      {tvShow.vote_average}
              
                    </span>
                  </div>
                  <div className="description">
                    {tvShow.overview.slice(0, 115) + "..."}
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
