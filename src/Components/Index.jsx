import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import Movielist from "../Components/Movielist";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function Index() {
  const [fetchData, setFetchData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const ApiData = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=d00cb3e60d55a92130bdafb5ff634708`
      );
      const data = await res.json();
      setFetchData(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    ApiData();
  }, []);

  useEffect(() => {
    fetchData.forEach((movie) => {
      const img = new Image();
      img.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    });
  }, [fetchData, isMobile]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    // Initial check on mount
    handleResize();

    // Listen to window resize events
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="index-container">
      <div className="poster ">
        <Carousel
          showThumbs={false}
          autoPlay={true}
          transitionTime={2000}
          interval={5000} // Adjust interval as needed for smooth transition
          infiniteLoop={true}
          showStatus={false}
          showIndicators={false}
          showArrows={!isMobile} // Show arrows only on desktop
          showDots={false}
        >
          {fetchData.map((movie) => (
            <Link
              key={movie.id}
              className="text-white no-underline"
              to={`/movie/${movie.id}`}
            >
              <div className="posterImage relative">
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.original_title}
                  className="w-full h-auto"
                />
                <div className="posterImage__overlay absolute bottom-0 left-0 right-0 text-white p-4 ">
                  <div className="posterImage__title ">
                    <div className=" text-4xl w-auto  md:text-left md:text-7xl md:ml-12 ml-0">
                      {movie.original_title}
                    </div>
                  </div>
                  <div className="posterImage__runtime flex mt-2 justify-between items-center ">
                    <div className="text-lg md:text-3xl text-center md:text-left">
                      {movie.release_date}
                    </div>
                    <span className="posterImage__rating text-lg md:text-3xl text-center md:text-left">
                      <FontAwesomeIcon className="text-yellow-400" icon={faStar} />{" "}
                      {movie.vote_average}
                    </span>
                  </div>
                 {
                  !isMobile && 
                  <div className="posterImage__description mt-2">
                  <div className="hidden md:block">
                    {movie.overview}
                  </div>
                </div>
                 }
                </div>
              </div>
            </Link>
          ))}
        </Carousel>
        <div className="w-3/4 mx-auto">  <Movielist /></div>
      
      </div>
    </div>
  );
}
