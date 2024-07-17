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

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
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

  const responsive2 = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
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
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
  }, [id]);

  return (
    <div className="container mx-auto p-4 ">
      <div className="">
        <h2 className="text-xl font-semibold text-white">
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
          <Link to={`/person/${credit.id}`}>
            <div key={credit.id} className="px-2 flex justify-center mt-5">
              <img
                src={`https://image.tmdb.org/t/p/w500${credit.profile_path}`}
                alt={credit.name}
                className="h-52 w-52 object-cover rounded-full mt-2"
              />
            </div>
            </Link>
          ))}
        </Carousel>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 mt-5 text-white">
          Watch Videos and Tailers
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

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Backdrops</h2>
        <Carousel
          responsive={responsive}
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

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Posters</h2>
        <Carousel
          responsive={responsive}
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
          {posters.map((poster) => (
            <div key={poster.file_path} className="px-2 flex justify-center">
              <img
                src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                alt="Poster"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default SingleMovieDetails;
