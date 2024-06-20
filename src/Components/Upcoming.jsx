import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Upcoming() {
  const [fetchData, setFetchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const ApiData = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=d00cb3e60d55a92130bdafb5ff634708`
      );
      const data = await res.json();
      setFetchData(data.results);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      ApiData();
    }, 5000);
  }, []);

  const skeletonCards = Array(5).fill();

  return (
    <div className="mx-auto w-3/4">
    {isLoading ? (
      <div className="Animatedcards">
        <SkeletonTheme color="#202020" highlightColor="#444">
          {skeletonCards.map((_, index) => (
            <div key={index} className="Animatedcards">
              <Skeleton height={300} duration={2} />
              <Skeleton width={`60%`} height={20} style={{ marginTop: 10 }} />
              <Skeleton width={`80%`} height={20} style={{ marginTop: 10 }} />
              <Skeleton width={`40%`} height={20} style={{ marginTop: 10 }} />
            </div>
          ))}
        </SkeletonTheme>
      </div>
    ) : (
        fetchData.map((movie, index) => (
          <Link
            to={`/movie/${movie.id}`}
            style={{ textDecoration: "none", color: "white" }}
            key={index}
          >
            <div className="cards ">
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
                  {movie.overview.slice(0, 118) + "..."}
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
