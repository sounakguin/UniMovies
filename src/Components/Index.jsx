import React, { Component, lazy, Suspense, useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import Movielist from "../Components/HomePageData/Movielist";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Footer from "../Components/Footer";
import Streamingpartner from "./HomePageData/Streamingdata";

const Contactus = lazy(() => import("./HomePageData/Contractus")); 

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in lazy-loaded component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong while loading the component.</h1>;
    }

    return this.props.children;
  }
}

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
          transitionTime={2000}
          interval={5000} 
          infiniteLoop={true}
          showStatus={false}
          showIndicators={false}
          showArrows={!isMobile}
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
                    <div className=" text-4xl w-auto  md:text-left md:text-7xl  ml-0">
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
                  {!isMobile && 
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
        <div className="mx-auto">
          <Movielist />
        </div>
        <p className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-8 pt-8">Streaming Partners</p>
        <Streamingpartner />
        <p className="text-white text-xl text-center md:text-left md:text-3xl pl-0 md:pl-4 pb-5 pt-8">Connect With Us</p>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading Contact Us...</div>}>
            <Contactus />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    </div>
  );
}
