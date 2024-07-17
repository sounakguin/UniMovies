import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SingleMovieDetails from "../Components/SingleMovieDetails";

const Moviedetail = () => {
  const [currentMovieDetail, setMovieDetail] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=d00cb3e60d55a92130bdafb5ff634708&language=en-US`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movie data");
        }
        const data = await response.json();
        setMovieDetail(data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieDetail();
  }, [id]);

  return (
    <div className="movie">
      {currentMovieDetail && (
        <>
          <div className="movie__intro hidden md:block">
            <img
              className="movie__backdrop"
              src={`https://image.tmdb.org/t/p/original${
                currentMovieDetail.backdrop_path || ""
              }`}
              alt="Backdrop"
            />
          </div>
          <div className="movie__detail mb-0 pb-0 flex flex-col md:flex-row ">
            <div className="movie__detailLeft">
              <div className="movie__posterBox mt-60 md:mt-0 ">
                <img
                  className="movie__poster"
                  src={`https://image.tmdb.org/t/p/original${
                    currentMovieDetail.poster_path || ""
                  }`}
                  alt="Poster"
                />
              </div>
            </div>
            <div className="movie__detailRight">
              <div className="movie__detailRightTop ">
                <br></br>
                <div className="movie__name mt-2 md:mt-0 text-3xl md:text-5xl">
                  {currentMovieDetail.original_title}
                </div>
                <div className="movie__tagline">
                  {currentMovieDetail.tagline ? currentMovieDetail.tagline : <br></br>}
                </div>
                <div className="movie__rating">
                  {currentMovieDetail.vote_average}{" "}
                  <i className="fas fa-star" />
                  <span className="movie__voteCount">
                    ({currentMovieDetail.vote_count} votes)
                  </span>
                </div>
                <div className="movie__runtime">
                  {currentMovieDetail.runtime} mins
                </div>
                <div className="movie__releaseDate">
                  Release date: {currentMovieDetail.release_date}
                </div>
                <div className="movie__genres pt-7 pb-0">
                  {currentMovieDetail.genres &&
                    currentMovieDetail.genres.map((genre) => (
                      <span className="movie__genre" key={genre.id}>
                        {genre.name}
                      </span>
                    ))}
                </div>
                <div className="mt-10">
                  <div className="synopsisText">Synopsis</div>
                  <div>{currentMovieDetail.overview}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <SingleMovieDetails className="mt-0 pt-0" />
    </div>
  );
};

export default Moviedetail;
