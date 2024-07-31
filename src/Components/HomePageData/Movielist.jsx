import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPopularTvShows,
  fetchTopRatedMovies,
  fetchPopularMovies,
  fetchUpcomingMovies,
  fetchPopularAnimationTvShows,
} from "../../Allmovies/AllmovieSlice";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import LatestMovieTrailers from "../HomePageData/LatestMovieTrailers";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Define removeDuplicatesByPath function outside of the component
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
    items: 2,
  },
};

const MovieItem = React.memo(({ movie, type }) => (
  <div className="movie-item">
    <Link
      to={`/${type}/${movie.id}`}
      style={{ textDecoration: "none", color: "white" }}
    >
      <LazyLoadImage
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt={type === "movie" ? movie.original_title : movie.original_name}
        className="cards__img"
        effect="blur"
        placeholderSrc="path/to/placeholder-image.jpg"
      />
      <div className="cards__overlay">
        <div className="card__title">
          {type === "movie" ? movie.original_title : movie.original_name}
        </div>
        <div className="card__runtime">
          {type === "movie" ? movie.release_date : movie.first_air_date}
        </div>
        <div className="card__description">
          {movie.overview.slice(0, 115) + "..."}
        </div>
      </div>
    </Link>
  </div>
));

const MovieList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const {
    popularTvShows,
    topRatedMovies,
    upcomingMovies,
    popularMovies,
    popularAnimationTvShows,
    status,
    error,
  } = useSelector((state) => state.tmdb);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        dispatch(fetchTopRatedMovies()),
        dispatch(fetchPopularTvShows()),
        dispatch(fetchPopularMovies()),
        dispatch(fetchUpcomingMovies()),
        dispatch(fetchPopularAnimationTvShows()),
      ]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      fetchAllData();
    }
  }, [status, fetchAllData]);

  useEffect(() => {
    if (status === "succeeded") {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return (
      <div>
        <Skeleton count={1} height={30} />
        <Skeleton count={1} height={30} />
        <Skeleton count={1} height={30} />
      </div>
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const uniqueUpcomingMovies = removeDuplicatesByPath(upcomingMovies);

  return (
    <div>
      <section className="movie-section">
        <h2 className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Popular TV Shows
        </h2>
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={5000}
          keyBoardControl
          transitionDuration={1000}
          arrows
          showDots={false}
        >
          {popularTvShows.map((movie) => (
            <MovieItem key={movie.id} movie={movie} type="tv" />
          ))}
        </Carousel>
      </section>

      <section className="movie-section">
        <h2 className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Top-Rated Movies
        </h2>
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={5000}
          keyBoardControl
          transitionDuration={1000}
          arrows
          showDots={false}
        >
          {topRatedMovies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} type="movie" />
          ))}
        </Carousel>
      </section>

      <div className="hidden md:block">
        <h2 className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Latest Movie Trailers
        </h2>
        <LatestMovieTrailers />
      </div>

      <section className="movie-section">
        <h2 className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Popular Movies
        </h2>
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={5000}
          keyBoardControl
          transitionDuration={1000}
          arrows
          showDots={false}
        >
          {popularMovies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} type="movie" />
          ))}
        </Carousel>
      </section>

      <div className="pt-0">
        <p className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Exclusively on Hotstar
        </p>
        <a
          href="https://www.hotstar.com/in/home?ref=%2Fin"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="Images/banner.webp"
            className="opacity-90"
            alt="Hotstar Banner"
          />
        </a>
      </div>

      <section className="movie-section">
        <h2 className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Popular Anime
        </h2>
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={5000}
          keyBoardControl
          transitionDuration={1000}
          arrows
          showDots={false}
        >
          {popularAnimationTvShows.map((movie) => (
            <MovieItem key={movie.id} movie={movie} type="tv" />
          ))}
        </Carousel>
      </section>

      <section className="movie-section">
        <h2 className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5">
          Upcoming Movies
        </h2>
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={5000}
          keyBoardControl
          transitionDuration={1000}
          arrows
          showDots={false}
        >
          {uniqueUpcomingMovies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} type="movie" />
          ))}
        </Carousel>
      </section>
    </div>
  );
};

export default MovieList;
