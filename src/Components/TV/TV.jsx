import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import SearchTVdata from "./SearchTVdata";

export default function TV() {
  const [tv, setTV] = useState([]);
  const [page, setPage] = useState(1);
  const initialFetch = useRef(true); // Ref to track the initial fetch
  const API_KEY = "d00cb3e60d55a92130bdafb5ff634708";

  const fetchTV = async (page) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?include_adult=true&include_null_first_air_dates=false&api_key=${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch TV shows: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      setTV((prevTV) => [...prevTV, ...data.results]);
    } catch (error) {
      console.error("Error fetching TV shows:", error);
    }
  };

  useEffect(() => {
    if (initialFetch.current) {
      fetchTV(page);
      initialFetch.current = false; // Set ref to false after initial fetch
    } else if (page > 1) {
      fetchTV(page);
    }
  }, [page]);

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
    setTV(data); // Update TV state with search results
  };

  return (
    <div>
      <SearchTVdata Searchdata={handleSearch} />
      <div className="mx-auto w-3/4 mt-5">
        {tv.map((tvShow) => (
          <Link
            to={`/tv/${tvShow.id}`}
            style={{ textDecoration: "none", color: "white" }}
            key={tvShow.id}
          >
            <div className="cards">
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
    </div>
  );
}
