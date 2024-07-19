import React, { useEffect, useState } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const API_KEY = 'd00cb3e60d55a92130bdafb5ff634708';
const BASE_URL = 'https://api.themoviedb.org/3';

const LatestMovieTrailers = () => {
  const [trailers, setTrailers] = useState([]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
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
    const fetchNowPlayingMovies = async () => {
      const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
      const data = await response.json();
      return data.results;
    };

    const fetchMovieTrailers = async (movieId) => {
      const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
      const data = await response.json();
      return data.results;
    };

    const getMostRecentTrailer = (trailers) => {
      const initialTrailer = {
        published_at: '1900-01-01T00:00:00.000Z'
      };
      return trailers
        .filter(video => video.type === 'Trailer' && video.site === 'YouTube')
        .reduce((latest, current) => {
          return new Date(current.published_at) > new Date(latest.published_at) ? current : latest;
        }, initialTrailer);
    };

    const fetchAndSetTrailers = async () => {
      const movies = await fetchNowPlayingMovies();
      const trailersPromises = movies.map(async (movie) => {
        const trailers = await fetchMovieTrailers(movie.id);
        return getMostRecentTrailer(trailers);
      });

      const trailers = await Promise.all(trailersPromises);
      setTrailers(trailers.filter(trailer => trailer.id)); // Filter out the initial trailer if no valid trailer is found
    };

    fetchAndSetTrailers();
  }, []);

  return (
    <div id=" ">
      <div >
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
      {trailers.map((trailer) => (
        trailer && trailer.id && (
          <div className='flex justify-center items-center'>
            <iframe
            key={trailer.id}
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={trailer.name}
            className=" min-w-80 h-52 border-none"
            allowFullScreen
          />
          </div>
        )
      ))}
      </Carousel>
      </div>
    </div>
  );
};

export default LatestMovieTrailers;
