import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Movielist() {
  const [category, setCategory] = useState("popular");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const ApiData = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${category}?api_key=d00cb3e60d55a92130bdafb5ff634708`
      );
      const data = await res.json();
      setMovies(data.results);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      ApiData();
    }, 1500);
  }, [category]);

  const skeletonCards = Array(5).fill();

  return (
    <div>
      <div className="flex mt-10 justify-center items-center">
        <button
          type="button"
          className="p-2 bg-blue-600 text-white"
          onClick={() => setCategory("popular")}
        >
          Popular
        </button>
        <button
          type="button"
          className="p-2 bg-yellow-600 text-white ml-4"
          onClick={() => setCategory("upcoming")}
        >
          Upcoming
        </button>
        <button
          type="button"
          className="p-2 bg-red-600 text-white ml-4"
          onClick={() => setCategory("top_rated")}
        >
          Top Rated
        </button>
      </div>
      <div className="mx-auto w-3/4 mt-5">
        {isLoading ? (
          <div className="Animatedcards">
            <SkeletonTheme color="#202020" highlightColor="#444">
              {skeletonCards.map((_, index) => (
                <div key={index} className="Animatedcards">
                  <Skeleton height={300} duration={2} />
                  <Skeleton
                    width={`60%`}
                    height={20}
                    style={{ marginTop: 10 }}
                  />
                  <Skeleton
                    width={`80%`}
                    height={20}
                    style={{ marginTop: 10 }}
                  />
                  <Skeleton
                    width={`40%`}
                    height={20}
                    style={{ marginTop: 10 }}
                  />
                </div>
              ))}
            </SkeletonTheme>
          </div>
        ) : (
          movies.map((movie, index) => (
            <Link
              to={`/movie/${movie.id}`}
              style={{ textDecoration: "none", color: "white" }}
              key={index}
            >
              <div className="cards">
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
          ))
        )}
      </div>
    </div>
  );
}
