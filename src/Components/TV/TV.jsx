import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import SearchTVdata from "./SearchTVdata";
import FilterTV from "./FilterTV";
import { motion } from "framer-motion"

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

// Fetch TV shows based on genre and page
const fetchTVShows = async (setTV, setIsLoading, genreId, page) => {
  try {
    setIsLoading(true);
    const url = genreId
      ? `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&with_genres=${genreId}`
      : `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch TV shows: ${response.statusText}`);
    }
    const data = await response.json();
    setTV((prevTV) => (page === 1 ? data.results : [...prevTV, ...data.results]));
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
  const [isLoading, setIsLoading] = useState(false);
  const initialFetch = useRef(true);

  useEffect(() => {
    fetchTVGenres(setTVGenres);
  }, []);

  useEffect(() => {
    if (initialFetch.current) {
      fetchTVShows(setTV, setIsLoading, null, page);
      initialFetch.current = false;
    } else {
      fetchTVShows(setTV, setIsLoading, selectedGenre, page);
    }
  }, [page, selectedGenre]);

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

  return (
    <div>
         <br />
      <SearchTVdata Searchdata={handleSearch} />
      <br />
      <br />
      <FilterTV
        genres={tvGenres}
        selectedGenre={selectedGenre}
        handleGenreClick={handleGenreClick}
      />
      <div className="container mx-auto w-3/4 mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {tv.map((tvShow) => (
            <Link
              to={`/tv/${tvShow.id}`}
              style={{ textDecoration: "none", color: "white" }}
              key={tvShow.id}
              className="flex justify-center"
            >
              <div className="cards  mt-0 md:mt-4 lg:mt-5">
                <img
                  className="cards__img"
                  src={`https://image.tmdb.org/t/p/original${tvShow.poster_path}`}
                  alt={tvShow.original_name}
                />
                <div className="cards__overlay">
                  <div className="card__title">{tvShow.original_name}</div>
                  <div className="card__runtime">
                    {tvShow.first_air_date}
                    <span className="card__rating">
                      {tvShow.vote_average}
                      <i className="fas fa-star" />
                    </span>
                  </div>
                  <div className="card__description">
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
