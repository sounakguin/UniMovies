import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMediaQuery } from 'react-responsive';

// Memoized Carousel component to prevent unnecessary re-renders
const MemoizedCarousel = React.memo(
  ({ items, responsive, renderItem, autoPlay, showArrows }) => (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={autoPlay}
      autoPlaySpeed={5000}
      keyBoardControl={true}
      transitionDuration={1000}
      arrows={showArrows}
      showDots={false}
      containerClass="carousel-container"
      itemClass="carousel-item"
      draggable={true} // Enable dragging
      swipeable={true} // Enable swiping
      touchDrag={true} // Enable touch drag
    >
      {items.map(renderItem)}
    </Carousel>
  )
);

const SingleMovieDetails = () => {
  const API_KEY = "d00cb3e60d55a92130bdafb5ff634708";
  const { id } = useParams();

  const [videos, setVideos] = useState([]);
  const [posters, setPosters] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [credits, setCredits] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [recommendation, setRecommendation] = useState([]);

  const fetchMovieData = useCallback(async () => {
    try {
      const [
        videosResponse,
        postersResponse,
        backdropsResponse,
        creditsResponse,
        similarResponse,
        recommendationResponse,
      ] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}&language=en-US&include_image_language=en,null`
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}&language=en-US&include_image_language=null,en`
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=en-US`
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US`
        ),
      ]);

      if (
        !videosResponse.ok ||
        !postersResponse.ok ||
        !backdropsResponse.ok ||
        !creditsResponse.ok ||
        !similarResponse.ok ||
        !recommendationResponse.ok
      ) {
        throw new Error("Failed to fetch some movie data");
      }

      const [
        videosData,
        postersData,
        backdropsData,
        creditsData,
        similarData,
        recommendationData,
      ] = await Promise.all([
        videosResponse.json(),
        postersResponse.json(),
        backdropsResponse.json(),
        creditsResponse.json(),
        similarResponse.json(),
        recommendationResponse.json(),
      ]);

      setVideos(videosData.results);
      setPosters(postersData.posters);
      setBackdrops(backdropsData.backdrops);
      setCredits(creditsData.cast);
      setSimilar(similarData.results);
      setRecommendation(recommendationData.results);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);

  const isDesktopOrLarger = useMediaQuery({ minWidth: 1024 });

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
    desktop: { breakpoint: { max: 3000, min: 2000 }, items: 5 },
    laptop: { breakpoint: { max: 2000, min: 1024 }, items: 6 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const responsive5 = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const responsive3 = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  };

  const responsive2 = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 7 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  };

  const responsive4 = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const renderCredits = (credit) => (
    <Link to={`/person/${credit.id}`} key={credit.id}>
      <div className="px-5 flex justify-center items-center mt-5 flex-col">
        {credit.profile_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${credit.profile_path}`}
            alt={credit.name}
            className="h-52 w-52 object-cover rounded-full mt-2"
            loading="lazy"
          />
        ) : (
          <div className="h-52 w-52 flex items-center justify-center rounded-full bg-gray-200 mt-2">
            <span className="text-gray-500 pl-4 md:pl-0">{credit.name}</span>
          </div>
        )}
        <p className="text-white text-center pt-4 pb-5">{credit.name}</p>
      </div>
    </Link>
  );

  const renderVideos = (video) => (
    <div key={video.key} className="px-2 flex justify-center">
      <div className="rounded-lg">
        <iframe
          src={`https://www.youtube.com/embed/${video.key}`}
          title={video.name}
          className="w-auto h-60 border-none"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );

  const renderImages = (image, baseUrl, altText) => (
    <div key={image.file_path} className="p-2">
      <img
        src={`${baseUrl}${image.file_path}`}
        alt={altText}
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
      />
    </div>
  );

  const renderMovies = (movie, baseUrl, altText) => (
    <Link to={`/movie/${movie.id}`} key={movie.id}>
      <div className="p-2">
        {movie.poster_path ? (
          <img
            src={`${baseUrl}${movie.poster_path}`}
            alt={altText}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        ) : (
          <div>
            <img
              src="/Images/klkl.jpg"
              alt={movie.name}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        )}
        <p className="text-white text-center pt-4 pb-5">{movie.title}</p>
      </div>
    </Link>
  );

  return (
    <div className="container mx-auto p-4">
      {credits.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white pl-0 md:pl-2 text-center md:text-left">
            Credits for this movie
          </h2>
          <MemoizedCarousel
            items={credits}
            responsive={responsive}
            renderItem={renderCredits}
            autoPlay={false}
        
          />
        </div>
      )}

      {videos.length > 0 && (
        <div className="mb-0 md:mb-5 hidden md:block">
          <h2 className="text-xl font-semibold text-white pl-0 md:pl-2 text-center md:text-left mt-10">
            Related Videos
          </h2>
          <MemoizedCarousel
            items={videos}
            responsive={responsive5}
            renderItem={renderVideos}
            autoPlay={false}
            showArrows={isDesktopOrLarger}
          />
        </div>
      )}

      {backdrops.length > 0 && (
        <div className="mb-0 md:mb-5">
          <h2 className="text-xl font-semibold text-white pl-0 md:pl-2 pb-5 text-center md:text-left mt-10">
            Related Images
          </h2>
          <MemoizedCarousel
            items={backdrops}
            responsive={responsive4}
            renderItem={(image) =>
              renderImages(image, "https://image.tmdb.org/t/p/original", "backdrop")
            }
            autoPlay={true}
            showArrows={isDesktopOrLarger}
          />
        </div>
      )}

{posters.length > 0 && (
        <div className="mb-0 md:mb-5">
          <h2 className="text-xl font-semibold text-white pl-0 md:pl-2 pb-5 text-center md:text-left mt-10">
            Poster Images
          </h2>
          <MemoizedCarousel
            items={posters}
            responsive={responsive2}
            renderItem={(image) =>
              renderImages(image, "https://image.tmdb.org/t/p/original", "poster")
            }
            autoPlay={true}
            showArrows={isDesktopOrLarger}
          />
        </div>
      )}

      {similar.length > 0 && (
        <div className="mb-0 md:mb-5">
          <h2 className="text-xl pb-5 font-semibold text-white pl-0 md:pl-2 text-center md:text-left mt-10">
            Related Similar Movies
          </h2>
          <MemoizedCarousel
            items={similar}
            responsive={responsive2}
            renderItem={(movie) =>
              renderMovies(movie, "https://image.tmdb.org/t/p/original", "similar movie")
            }
            autoPlay={true}
            showArrows={isDesktopOrLarger}
          />
        </div>
      )}

      {recommendation.length > 0 && (
        <div className="mb-0 md:mb-5">
          <h2 className="text-xl font-semibold pb-5 text-white pl-0 md:pl-2 text-center md:text-left ">
            Recommendation Movies
          </h2>
          <MemoizedCarousel
            items={recommendation}
            responsive={responsive2}
            renderItem={(movie) =>
              renderMovies(movie, "https://image.tmdb.org/t/p/original", "recommendation movie")
            }
            autoPlay={true}
            showArrows={isDesktopOrLarger}
          />
        </div>
      )}
    </div>
  );
};

export default SingleMovieDetails;
