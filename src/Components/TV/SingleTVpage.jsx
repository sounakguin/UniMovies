import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function SingleTVpage() {
  const API_KEY = "d00cb3e60d55a92130bdafb5ff634708";
  const { id } = useParams();

  const [videos, setVideos] = useState([]);
  const [posters, setPosters] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [credits, setCredits] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
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

  const responsive2 = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 7,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
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

  const responsive3 = {
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

  useEffect(() => {
    const fetchTVData = async () => {
      try {
        // Fetch videos
        const videosResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`
        );
        if (!videosResponse.ok) {
          throw new Error("Failed to fetch videos");
        }
        const videosData = await videosResponse.json();
        setVideos(videosData.results);

        // Fetch posters and backdrops
        const imagesResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/images?api_key=${API_KEY}&language=en-US&include_image_language=en,null`
        );
        if (!imagesResponse.ok) {
          throw new Error("Failed to fetch images");
        }
        const imagesData = await imagesResponse.json();
        setPosters(imagesData.posters);
        setBackdrops(imagesData.backdrops);

        // Fetch credits
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}&language=en-US`
        );
        if (!creditsResponse.ok) {
          throw new Error("Failed to fetch credits");
        }
        const creditsData = await creditsResponse.json();
        setCredits(creditsData.cast);

        // Fetch similar TV shows
        const similarResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_KEY}&language=en-US`
        );
        if (!similarResponse.ok) {
          throw new Error("Failed to fetch similar TV shows");
        }
        const similarData = await similarResponse.json();
        setSimilar(similarData.results);

        // Fetch recommendations
        const recommendationsResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${API_KEY}&language=en-US`
        );
        if (!recommendationsResponse.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        const recommendationsData = await recommendationsResponse.json();
        setRecommendations(recommendationsData.results);
      } catch (error) {
        console.error("Error fetching TV data:", error);
      }
    };

    fetchTVData();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      {credits && credits.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold pl-0 md:pl-2 text-white">
            Credits
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
              <Link key={credit.id} to={`/person/${credit.id}`}>
                <div className="px-2 flex justify-center mt-5">
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
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      )}

      {videos && videos.length  > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 mt-5 pl-0 md:pl-4 text-white">
            Watch Videos and Trailers
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

      {backdrops && (backdrops.length  > 0) &&
      (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pl-0 md:pl-2 text-white">
            Backdrops
          </h2>
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
      )}

      {posters &&
        (posters.length  > 0) &&
        (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pl-0 md:pl-2 text-white">
              Posters
            </h2>
            <Carousel
              responsive={responsive2}
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
                <div key={poster.file_path} className="p-2">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                    alt="Poster"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}

      {
        similar && similar.length  > 0 && (
          <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 pl-0 md:pl-2 text-white">
          Similar TV Shows
        </h2>
        <Carousel
          responsive={responsive2}
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
          {similar.map((tvShow) => (
            <div key={tvShow.id} className="p-2">
              <img
                src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                alt={tvShow.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <p className="text-white  text-center pt-4">{tvShow.name}</p>
            </div>
          ))}
        </Carousel>
      </div>
        )
      }

      {recommendations && recommendations.length>0 && (
        <div className="">
        <h2 className="text-xl font-semibold mb-4 pl-0 md:pl-2 text-white">
          Recommended TV Shows
        </h2>
        <Carousel
          responsive={responsive2}
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
          {recommendations.map((tvShow) => (
            <div key={tvShow.id} className="p-2">
              <img
                src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                alt={tvShow.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <p className="text-white pt-4 text-center">{tvShow.name}</p>
            </div>
          ))}
        </Carousel>
      </div>
      )}
    </div>
  );
}
