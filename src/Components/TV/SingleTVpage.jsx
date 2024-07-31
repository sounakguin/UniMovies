
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link, useParams } from "react-router-dom";

import "react-multi-carousel/lib/styles.css";

// Lazy load the Carousel component
const Carousel = lazy(() => import('react-multi-carousel'));

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const responsive2 = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 7 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 6 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
};

const responsive3 = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

export default function SingleTVpage() {
  const API_KEY = "d00cb3e60d55a92130bdafb5ff634708";
  const { id } = useParams();

  const [videos, setVideos] = useState([]);
  const [posters, setPosters] = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [credits, setCredits] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTVData = async () => {
      try {
        // Fetch data in parallel
        const [videosResponse, imagesResponse, creditsResponse, similarResponse, recommendationsResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/tv/${id}/images?api_key=${API_KEY}&language=en-US&include_image_language=en,null`),
          fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${API_KEY}&language=en-US`)
        ]);

        if (!videosResponse.ok || !imagesResponse.ok || !creditsResponse.ok || !similarResponse.ok || !recommendationsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [videosData, imagesData, creditsData, similarData, recommendationsData] = await Promise.all([
          videosResponse.json(),
          imagesResponse.json(),
          creditsResponse.json(),
          similarResponse.json(),
          recommendationsResponse.json()
        ]);

        setVideos(videosData.results);
        setPosters(imagesData.posters);
        setBackdrops(imagesData.backdrops);
        setCredits(creditsData.cast);
        setSimilar(similarData.results);
        setRecommendations(recommendationsData.results);
      } catch (error) {
        console.error("Error fetching TV data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVData();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>; // Add a proper loading state
  }

  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Loading Carousel...</div>}>
        {credits && credits.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white pl-0 md:pl-2 text-center md:text-left">Credits</h2>
            <Carousel
              responsive={responsive}
              infinite={true}
              autoPlay={false}
              keyBoardControl={true}
              transitionDuration={1000}
              arrows={true}
              showDots={false}
              containerClass="carousel-container"
              itemClass="carousel-item"
            >
              {credits.map((credit) => (
                <Link key={credit.id} to={`/person/${credit.id}`}>
                  <div className="px-5 flex justify-center items-center mt-5 flex-col">
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
                    <p className="text-white text-center pt-4 pb-5">{credit.name}</p>
                  </div>
                </Link>
              ))}
            </Carousel>
          </div>
        )}

        {videos && videos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 mt-5 text-white pl-0 md:pl-2 text-center md:text-left">
              Watch Videos and Trailers
            </h2>
            <Carousel
              responsive={responsive3}
              infinite={true}
              autoPlay={false}
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
            <h2 className="text-xl font-semibold mb-4 text-white pl-0 md:pl-2 text-center md:text-left">Backdrops</h2>
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

        {posters && posters.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white pl-0 md:pl-2 text-center md:text-left">Posters</h2>
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
                  {poster.file_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                      alt="Poster"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="h-52 w-full flex items-center justify-center rounded-lg bg-gray-200">
                      <span className="text-gray-500">No Poster Available</span>
                    </div>
                  )}
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {similar && similar.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white pl-0 md:pl-2 text-center md:text-left">Similar Shows</h2>
            <Carousel
              responsive={responsive2}
              infinite={true}
              autoPlay={false}
              keyBoardControl={true}
              transitionDuration={1000}
              arrows={true}
              showDots={false}
              containerClass="carousel-container"
              itemClass="carousel-item"
            >
              {similar.map((show) => (
                <Link key={show.id} to={`/tv/${show.id}`}>
                  <div className="px-5 flex justify-center items-center mt-5 flex-col">
                    {show.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                        alt={show.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-lg bg-gray-200">
                        <span className="text-gray-500">{show.name}</span>
                      </div>
                    )}
                    <p className="text-white text-center pt-4 pb-5">{show.name}</p>
                  </div>
                </Link>
              ))}
            </Carousel>
          </div>
        )}

        {recommendations && recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white pl-0 md:pl-2 text-center md:text-left">Recommendations</h2>
            <Carousel
              responsive={responsive2}
              infinite={true}
              autoPlay={false}
              keyBoardControl={true}
              transitionDuration={1000}
              arrows={true}
              showDots={false}
              containerClass="carousel-container"
              itemClass="carousel-item"
            >
              {recommendations.map((show) => (
                <Link key={show.id} to={`/tv/${show.id}`}>
                  <div className="px-5 flex justify-center items-center mt-5 flex-col">
                    {show.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                        alt={show.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-lg bg-gray-200">
                        <span className="text-gray-500">{show.name}</span>
                      </div>
                    )}
                    <p className="text-white text-center pt-4 pb-5">{show.name}</p>
                  </div>
                </Link>
              ))}
            </Carousel>
          </div>
        )}
      </Suspense>
    </div>
  );
}
