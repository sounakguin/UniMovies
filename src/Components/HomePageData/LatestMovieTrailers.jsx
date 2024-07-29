import React, { useEffect, useState } from "react";

const API_KEY = "d00cb3e60d55a92130bdafb5ff634708";
const BASE_URL = "https://api.themoviedb.org/3";

const LatestMovieTrailers = () => {
  const [trailers, setTrailers] = useState([]);
  const [currentTrailer, setCurrentTrailer] = useState(null);

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`
        );
        const data = await response.json();
        return data.results;
      } catch (error) {
        console.error("Error fetching now playing movies:", error);
        return [];
      }
    };

    const fetchMovieTrailers = async (movieId) => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
        );
        const data = await response.json();
        return data.results;
      } catch (error) {
        console.error(`Error fetching trailers for movie ${movieId}:`, error);
        return [];
      }
    };

    const getMostRecentTrailer = (trailers) => {
      return trailers
        .filter((video) => video.type === "Trailer" && video.site === "YouTube")
        .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))[0];
    };

    const fetchAndSetTrailers = async () => {
      const movies = await fetchNowPlayingMovies();
      const trailersPromises = movies.map(async (movie) => {
        const trailers = await fetchMovieTrailers(movie.id);
        return getMostRecentTrailer(trailers);
      });

      const trailers = await Promise.all(trailersPromises);
      const validTrailers = trailers.filter((trailer) => trailer);
      setTrailers(validTrailers);
      if (validTrailers.length > 0) {
        setCurrentTrailer(validTrailers[0]);
      }
    };

    fetchAndSetTrailers();
  }, []);

  return (
    <div className="bg-gray-950">
      <div className="flex flex-col lg:flex-row justify-center">
        <div className="w-full lg:w-3/3 p-4">
          {currentTrailer && (
            <div className="w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${currentTrailer.key}?autoplay=1`}
                title={currentTrailer.name}
                allowFullScreen
                className="w-full h-60 md:h-full lg:h-full object"
              />
            </div>
          )}
        </div>
        <div className="pt-4 pl-4 overflow-y-auto lg:max-h-screen lg:w-1/3">
          {trailers.map((trailer) => (
            <div
              key={trailer.id}
              className="mb-4 cursor-pointer"
              onClick={() => setCurrentTrailer(trailer)}
            >
              <div className="w-80 h-44 bg-gray-800 flex items-center justify-center">
                <img
                  src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
                  alt={trailer.name}
                  className="w-full h-44 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestMovieTrailers;
