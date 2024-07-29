import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faImdb,
} from "@fortawesome/free-brands-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ok from "../../../public/Images/ok.jpeg"; 

export default function SinglepagePeople() {
  const [actorPersonalData, setActorPersonalData] = useState(null);
  const [actorExternalIds, setActorExternalIds] = useState(null);
  const [actorCredits, setActorCreditsIds] = useState(null);
  const [actorImages, setActorImages] = useState(null);

  const { id } = useParams();
  const API_KEY = "d00cb3e60d55a92130bdafb5ff634708";
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

  const fetchData = async () => {
    try {
      const personalResponse = await fetch(
        `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&language=en-US`
      );
      const personalData = await personalResponse.json();
      setActorPersonalData(personalData);

      const CreditsResponse = await fetch(
        `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}&language=en-US`
      );
      const CreditsData = await CreditsResponse.json();
      setActorCreditsIds(CreditsData.cast);

      const ImageResponse = await fetch(
        `https://api.themoviedb.org/3/person/${id}/images?api_key=${API_KEY}`
      );
      const ImageData = await ImageResponse.json();
      setActorImages(ImageData.profiles);

      const externalIdsResponse = await fetch(
        `https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${API_KEY}`
      );
      const externalIdsData = await externalIdsResponse.json();
      setActorExternalIds(externalIdsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (!actorPersonalData || !actorExternalIds) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        {actorPersonalData && (
          <div
            key={actorPersonalData.id}
            className="flex flex-col md:flex-row items-center"
          >
            <div className="md:w-1/3 flex justify-center">
              {actorPersonalData.profile_path && (
                <img
                  src={`https://image.tmdb.org/t/p/original${actorPersonalData.profile_path}`}
                  alt={`Profile of ${actorPersonalData.name}`}
                  className="h-96 w-auto rounded-lg shadow-lg border-2 border-white"
                />
              )}
            </div>
            <div className="text-white md:mt-0 md:ml-6 md:w-2/3">
              <h2 className="text-3xl text-center mt-2 md:mt-0 md:text-left md:text-5xl font-bold ">
                {actorPersonalData.name}
              </h2>
              <br></br>
              <p>Known for - {actorPersonalData.known_for_department}</p>
              <p>Birthday - {actorPersonalData.birthday}</p>
              <p>Place of Birth - {actorPersonalData.place_of_birth}</p>
              <p>Popularity - {actorPersonalData.popularity}</p>
              <p>
                Gender - {actorPersonalData.gender === 1 ? "Female" : "Male"}
              </p>
              <p className="mt-4">
                {actorPersonalData.biography.slice(0, 200)}...
              </p>
              <div className="flex space-x-4 mt-4">
                {actorExternalIds.facebook_id && (
                  <a
                    href={`https://facebook.com/${actorExternalIds.facebook_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-blue-600 transition-transform transform hover:-translate-y-2"
                  >
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                )}
                {actorExternalIds.twitter_id && (
                  <a
                    href={`https://twitter.com/${actorExternalIds.twitter_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-blue-400 transition-transform transform hover:-translate-y-2"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                )}
                {actorExternalIds.instagram_id && (
                  <a
                    href={`https://www.instagram.com/${actorExternalIds.instagram_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-pink-600 transition-transform transform hover:-translate-y-2"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                )}
                {actorExternalIds.imdb_id && (
                  <a
                    href={`https://www.imdb.com/name/${actorExternalIds.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-yellow-500 transition-transform transform hover:-translate-y-2"
                  >
                    <FontAwesomeIcon icon={faImdb} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8">
        <h3 className="text-white text-2xl mb-4">
          Combined Credits of {actorPersonalData.name}
        </h3>
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
          {actorCredits.map((data) => (
            <Link to={`/movie/${data.id}`} key={data.id}>
              <div className="px-2 flex justify-center">
                {data.poster_path ? (
                  <LazyLoadImage
                    src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
                    alt={data.title}
                    effect="blur"
                    className="h-96 w-auto rounded-lg shadow-lg border-2 border-white"
                  />
                ) : (
                  <img
                    src={ok}
                    alt={data.title}
                    className="h-96 w-auto rounded-lg shadow-lg border-2 border-white"
                  />
                )}
              </div>
            </Link>
          ))}
        </Carousel>
      </div>
      <div className="mt-8">
        <h3 className="text-white text-2xl mb-4">
          Other Images of {actorPersonalData.name}
        </h3>
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
          {actorImages.map((imagedata) => (
            <div key={imagedata.file_path} className="px-2 flex justify-center ">
              <LazyLoadImage
                src={`https://image.tmdb.org/t/p/original${imagedata.file_path}`}
                alt=""
                effect="blur"
                className="h-96 w-auto rounded-lg shadow-lg border-2 border-white"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
