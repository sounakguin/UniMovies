import React, { lazy, Suspense, useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import Movielist from "../Components/HomePageData/Movielist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Footer from "../Components/Footer";
import Streamingpartner from "./HomePageData/Streamingdata";

const Contactus = lazy(() => import("./HomePageData/Contractus"));

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
  }, [fetchData]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="index-container">
      <div className="poster">
        <Carousel
          showThumbs={false}
          autoPlay={true}
          transitionTime={600}
          interval={8000}
          infiniteLoop={true}
          showStatus={false}
          showIndicators={false}
          showArrows={!isMobile}
        >
          {fetchData.map((movie) => (
            <div key={movie.id} className="posterImage relative">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.original_title}
                className="w-full h-auto"
              />
              <div className="posterImage__overlay absolute bottom-0 left-0 right-0 text-white p-4">
                <div className="posterImage__title">
                  <div className="text-xl md:text-7xl ml-0">
                    {movie.original_title}
                  </div>
                </div>
                <div className="posterImage__runtime flex mt-2 justify-between items-center">
                  <div className="text-sm md:text-3xl text-center md:text-left">
                    {movie.release_date}
                  </div>
                  <span className="posterImage__rating text-lg md:text-3xl text-center md:text-left">
                    <FontAwesomeIcon
                      className="text-yellow-400"
                      icon={faStar}
                    />{" "}
                    {movie.vote_average}
                  </span>
                </div>
                <div className="pb-2">
                  <Link
                    className="text-white no-underline"
                    to={`/movie/${movie.id}`}
                  >
                    <button
                      className="relative px-4 py-1 md:px-6 md:py-2 rounded-lg font-semibold text-white bg-neutral-300 border-2 border-transparent overflow-hidden group"
                    >
                      <span className="relative z-10 text-black">Details</span>
                      <span
                        className="absolute inset-0 border-2 border-transparent bg-white text-black transition-transform transform scale-x-0 group-hover:scale-x-100 origin-left"
                      ></span>
                    </button>
                  </Link>
                </div>
                {!isMobile && (
                  <div className="posterImage__description mt-2">
                    <div className="hidden md:block">{movie.overview}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Carousel>
        <div className="mx-auto">
          <Movielist />
        </div>
        <div className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-8 pt-8">
          Streaming Partners
        </div>
        <Streamingpartner />
        <div className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5 pt-8">
          Connect With Us
        </div>
        <Suspense fallback={<div>Loading Contact Us...</div>}>
          <Contactus />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}
