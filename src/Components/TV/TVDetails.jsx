import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SingleTVpage from "./SingleTVpage";

export default function TVDetails() {
  const { id } = useParams();
  const [tvdetails, setTVDetails] = useState([]);

  const fetchTVDetail = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=d00cb3e60d55a92130bdafb5ff634708&language=en-US`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movie data");
      }
      const data = await response.json();
      setTVDetails(data);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  };

  useEffect(() => {
    fetchTVDetail();
  }, []);

  return (
    <>
      <div className="movie">
        {tvdetails && (
          <>
            <div className="movie__intro">
              <img
                className="movie__backdrop"
                src={`https://image.tmdb.org/t/p/original${
                  tvdetails.backdrop_path || ""
                }`}
                alt="Backdrop"
              />
            </div>
            <div className="movie__detail">
              <div className="movie__detailLeft">
                <div className="movie__posterBox">
                  <img
                    className="movie__poster"
                    src={`https://image.tmdb.org/t/p/original${
                      tvdetails.poster_path || ""
                    }`}
                    alt="Poster"
                  />
                </div>
              </div>
              <div className="movie__detailRight">
                <div className="movie__detailRightTop">
                  <div className="movie__name">{tvdetails.original_title}</div>
                  <div className="movie__tagline">{tvdetails.tagline}</div>
                  <div className="movie__rating">
                    {tvdetails.vote_average} <i className="fas fa-star" />
                    <span className="movie__voteCount">
                      ({tvdetails.vote_count} votes)
                    </span>
                  </div>
                  {/* <div className="movie__runtime">
                  {tvdetailsruntime} mins
                </div> */}
                  <div className="movie__releaseDate">
                    Release date: {tvdetails.release_date}
                  </div>
                  <div className="movie__genres pt-14 pb-0">
                    {tvdetails.genres &&
                      tvdetails.genres.map((genre) => (
                        <span className="movie__genre" key={genre.id}>
                          {genre.name}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="movie__detailRightBottom pt-0">
                  <div className="synopsisText">Synopsis</div>
                  <div>{tvdetails.overview}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <SingleTVpage />
    </>
  );
}
