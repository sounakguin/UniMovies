import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const SingleMovieDetails = () => {
  const API_KEY = "d00cb3e60d55a92130bdafb5ff634708";
  const { id } = useParams();

  const [videos, setVideos] = useState([]);
  const [posters, setPosters] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [credits, setCredits] = useState([]);
  const [similar, setsimilar] = useState([]);
  const [recomendation, setrecomendation] = useState([]);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const responsive3 = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const responsive2 = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 7 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  const responsive4 = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // Fetch videos
        const videosResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
        );
        if (!videosResponse.ok) {
          throw new Error("Failed to fetch videos");
        }
        const videosData = await videosResponse.json();
        setVideos(videosData.results);

        // Fetch posters
        const postersResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}&language=en-US&include_image_language=en,null`
        );
        if (!postersResponse.ok) {
          throw new Error("Failed to fetch posters");
        }
        const postersData = await postersResponse.json();
        setPosters(postersData.posters);

        // Fetch backdrops
        const backdropsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}&language=en-US&include_image_language=null,en`
        );
        if (!backdropsResponse.ok) {
          throw new Error("Failed to fetch backdrops");
        }
        const backdropsData = await backdropsResponse.json();
        setBackdrops(backdropsData.backdrops);

        // Fetch credits
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
        );
        if (!creditsResponse.ok) {
          throw new Error("Failed to fetch credits");
        }
        const creditsData = await creditsResponse.json();
        setCredits(creditsData.cast);

        // Fetch Similar movies
        const SimilarResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=en-US`
        );
        if (!SimilarResponse.ok) {
          throw new Error("Failed to fetch credits");
        }
        const similarData = await SimilarResponse.json();
        setsimilar(similarData.results);

        // Fetch recomended movies
        const RecomendedResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US`
        );
        if (!RecomendedResponse.ok) {
          throw new Error("Failed to fetch credits");
        }
        const RecomendedData = await RecomendedResponse.json();
        setrecomendation(RecomendedData.results);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      {credits && credits.length > 0 && (
        <div className="">
          <h2 className="text-xl font-semibold text-white pl-0 md:pl-2">
            Credits for this movie
          </h2>
          <Carousel
            responsive={responsive2}
            infinite={true}
            autoPlay={false}
            autoPlaySpeed={0}
            keyBoardControl={true}
            transitionDuration={1000}
            arrows={true}
            showDots={false}
            containerClass="carousel-container"
            itemClass="carousel-item"
          >
            {credits.map((credit) => (
              <Link to={`/person/${credit.id}`} key={credit.id}>
                <div className="px-5 flex justify-center mt-5 flex-col">
                  {credit.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${credit.profile_path}`}
                      alt={credit.name}
                      className="h-52 w-52 object-cover rounded-full mt-2"
                    />
                  ) : (
                    <div className="h-52 w-52 flex items-center justify-center rounded-full bg-gray-200 mt-2">
                      <span className="text-gray-500">{credit.name}</span>
                    </div>
                  )}
                  <p className="text-white text-center pt-4 pb-5 ">
                    {credit.name}
                  </p>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      )}

      {videos && videos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 mt-5 text-white pl-0 md:pl-2">
            Watch Videos and Trailers
          </h2>
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={false}
            autoPlaySpeed={0}
            keyBoardControl={true}
            transitionDuration={1000}
            arrows={true}
            showDots={false}
            containerClass="carousel-container"
            itemClass="carousel-item"
          >
            {videos.map((video) => (
              <div key={video.key} className="px-2 flex justify-center">
                <div className="rounded-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    className="w-auto h-52 border-none"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {backdrops && backdrops.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white pl-0 md:pl-2">
            Backdrops
          </h2>
          <Carousel
            responsive={responsive4}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={5000}
            keyBoardControl={true}
            transitionDuration={1000}
            arrows={true}
            showDots={false}
            containerClass="carousel-container"
            itemClass="carousel-item"
          >
            {backdrops.map((backdrop) => (
              <div key={backdrop.file_path} className="p-2">
                <img
                  src={`https://image.tmdb.org/t/p/original${backdrop.file_path}`}
                  alt="Backdrop"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {posters && posters.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 mt-5 text-white pl-0 md:pl-2">
            Posters
          </h2>
          <Carousel
            responsive={responsive3}
            infinite={true}
            autoPlay={false}
            autoPlaySpeed={0}
            keyBoardControl={true}
            transitionDuration={1000}
            arrows={true}
            showDots={false}
            containerClass="carousel-container"
            itemClass="carousel-item"
          >
            {posters.map((poster) => (
              <div key={poster.file_path} className="p-2">
                <img
                  src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                  alt="Posters"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {similar && similar.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 mt-5 text-white pl-0 md:pl-2">
            Similar Movies
          </h2>
          <Carousel
            responsive={responsive3}
            infinite={true}
            autoPlay={false}
            autoPlaySpeed={0}
            keyBoardControl={true}
            transitionDuration={1000}
            arrows={true}
            showDots={false}
            containerClass="carousel-container"
            itemClass="carousel-item"
          >
            {similar.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <div className="p-2">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt="Similar movies"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      )}

      {recomendation && recomendation.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 mt-5 text-white pl-0 md:pl-2">
            Recommended Movies
          </h2>
          <Carousel
            responsive={responsive3}
            infinite={true}
            autoPlay={false}
            autoPlaySpeed={0}
            keyBoardControl={true}
            transitionDuration={1000}
            arrows={true}
            showDots={false}
            containerClass="carousel-container"
            itemClass="carousel-item"
          >
            {recomendation.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <div className="p-2">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt="Recommended movies"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default SingleMovieDetails;
