import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPopularTvShows,
  fetchTopRatedMovies,
  fetchPopularMovies,
  fetchUpcomingMovies,
} from "../../Allmovies/AllmovieSlice";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import LatestMovieTrailers from "../HomePageData/LatestMovieTrailers";
import { Link } from "react-router-dom";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 8,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 7,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

// Utility function to remove duplicates based on poster_path
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

const MovieList = () => {
  const dispatch = useDispatch();
  const {
    popularTvShows,
    topRatedMovies,
    upcomingMovies,
    popularMovies,
    status,
    error,
  } = useSelector((state) => state.tmdb);

  useEffect(() => {
    dispatch(fetchTopRatedMovies());
    dispatch(fetchPopularTvShows());
    dispatch(fetchPopularMovies());
    dispatch(fetchUpcomingMovies());
  }, [dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  // Remove duplicates from upcomingMovies based on poster_path
  const uniqueUpcomingMovies = removeDuplicatesByPath(upcomingMovies);

  return (
    <div>
      <section className="movie-section">
        <h2 className="text-white text-3xl pl-0 md:pl-4 pb-5">Popular TV Shows</h2>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          keyBoardControl={true}
          transitionDuration={1000}
          arrows={true}
          showDots={false}
        >
          {popularTvShows.map((movie) => (
            <div key={movie.id} className="movie-item">
              <Link to={`/tv/${movie.id}`} style={{ textDecoration: "none", color: "white" }}>
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.title}
                  className="cards__img"
                />
                <div className="cards__overlay">
                  <div className="card__title">{movie.original_name}</div>
                  <div className="card__runtime">{movie.first_air_date}</div>
                  <div className="card__description">
                    {movie.overview.slice(0, 115) + "..."}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Carousel>
      </section>

      <section className="movie-section">
        <h2 className="text-white text-3xl pl-0 md:pl-4 pb-5">Top-Rated Movies</h2>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          keyBoardControl={true}
          transitionDuration={1000}
          arrows={true}
          showDots={false}
        >
          {topRatedMovies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none", color: "white" }}>
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.title}
                  className="cards__img"
                />
                <div className="cards__overlay">
                  <div className="card__title">{movie.original_title}</div>
                  <div className="card__runtime">{movie.release_date}</div>
                  <div className="card__description">
                    {movie.overview.slice(0, 115) + "..."}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Carousel>
      </section>

      <h2 className="text-white text-3xl pl-0 md:pl-4 pb-5">Latest Movie Trailers</h2>
      <LatestMovieTrailers />

      <section className="movie-section">
        <h2 className="text-white text-3xl pl-0 md:pl-4 pb-5">Popular Movies</h2>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          keyBoardControl={true}
          transitionDuration={1000}
          arrows={true}
          showDots={false}
        >
          {popularMovies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none", color: "white" }}>
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.title}
                  className="cards__img"
                />
                <div className="cards__overlay">
                  <div className="card__title">{movie.original_title}</div>
                  <div className="card__runtime">{movie.release_date}</div>
                  <div className="card__description">
                    {movie.overview.slice(0, 115) + "..."}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Carousel>
      </section>

      <div className="pt-0">
        <p className="text-white text-3xl pl-0 md:pl-4 pb-5">Exclusively on Hotstar</p>
        <a href="https://www.hotstar.com/in/home?ref=%2Fin" target="_blank" rel="noopener noreferrer">
          <img src="Images/banner.webp" className="opacity-90" alt="Hotstar Banner" />
        </a>
      </div>

      <section className="movie-section">
        <h2 className="text-white text-3xl pl-0 md:pl-4 pb-5">Upcoming Movies</h2>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          keyBoardControl={true}
          transitionDuration={1000}
          arrows={true}
          showDots={false}
        >
          {uniqueUpcomingMovies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none", color: "white" }}>
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt={movie.title}
                  className="cards__img"
                />
                <div className="cards__overlay">
                  <div className="card__title">{movie.original_title}</div>
                  <div className="card__runtime">{movie.release_date}</div>
                  <div className="card__description">
                    {movie.overview.slice(0, 115) + "..."}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Carousel>
      </section>
    </div>
  );
};

export default MovieList;
