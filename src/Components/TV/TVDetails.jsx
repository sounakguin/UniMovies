import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SingleTVpage from "./SingleTVpage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faImdb,
} from "@fortawesome/free-brands-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "../LoginFunc/Firebase";

export default function TVDetails() {
  const { id } = useParams();
  const [tvDetails, setTVDetails] = useState(null);
  const [externalLinks, setExternalLinks] = useState({});
  const [isInList, setIsInList] = useState(false);

  // Fetch TV details
  const fetchTVDetail = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=d00cb3e60d55a92130bdafb5ff634708&language=en-US`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch TV data");
      }
      const data = await response.json();
      setTVDetails(data);

      const linksResponse = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/external_ids?api_key=d00cb3e60d55a92130bdafb5ff634708&language=en-US`
      );
      if (!linksResponse.ok) {
        throw new Error("Failed to fetch external links data");
      }
      const linksData = await linksResponse.json();
      setExternalLinks(linksData);

      // Check if the TV show is in the user's Firestore list
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().myTVList.includes(id)) {
          setIsInList(true);
        } else {
          setIsInList(false);
        }
      }
    } catch (error) {
      console.error("Error fetching TV data:", error);
    }
  };

  useEffect(() => {
    fetchTVDetail();
  }, [id]);

  // Handle adding/removing TV show from list
  const handleMyListClick = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "Users", user.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const currentTVList = docSnap.data().myTVList || [];
          const newTVList = isInList
            ? currentTVList.filter((tvId) => tvId !== id)
            : [...currentTVList, id];
          await updateDoc(docRef, { myTVList: newTVList });

          // Update the state after modifying the list
          setIsInList(!isInList);
        }
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    } else {
      alert("Please log in to add to your list.");
    }
  };

  return (
    <>
      <div className="movie">
        {tvDetails && (
          <>
            <div className="movie__intro">
              <img
                className="movie__backdrop"
                src={`https://image.tmdb.org/t/p/original${
                  tvDetails.backdrop_path ||
                  renderFallbackImage("Backdrop Not Available")
                }`}
                alt="Backdrop"
              />
            </div>
            <div className="movie__detail mb-0 pb-0 flex flex-col md:flex-row">
              <div className="flex flex-col movie__detailLeft relative">
                <div className="relative group">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <img
                    className="movie__poster object-cover w-full h-full transition-opacity duration-300"
                    src={`https://image.tmdb.org/t/p/original${
                      tvDetails.poster_path || ""
                    }`}
                    alt="Poster"
                  />
                  <div
                    className={`absolute top-5 left-52 md:top-5 md:left-60 transform text-3xl h-10 w-10 cursor-pointer transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                      isInList ? "text-red-500" : "text-gray-500"
                    }`}
                    onClick={handleMyListClick}
                  >
                    <div className="bg-white h-10 w-10 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={isInList ? faHeartSolid : faHeartRegular}
                      />
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex justify-center space-x-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {externalLinks.facebook_id && (
                      <a
                        href={`https://facebook.com/${externalLinks.facebook_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl text-blue-600 transition-transform transform hover:-translate-y-2"
                      >
                        <FontAwesomeIcon icon={faFacebook} />
                      </a>
                    )}

                    {externalLinks.twitter_id && (
                      <a
                        href={`https://twitter.com/${externalLinks.twitter_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl text-blue-400 transition-transform transform hover:-translate-y-2"
                      >
                        <FontAwesomeIcon icon={faTwitter} />
                      </a>
                    )}
                    {externalLinks.instagram_id && (
                      <a
                        href={`https://www.instagram.com/${externalLinks.instagram_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl text-pink-600 transition-transform transform hover:-translate-y-2"
                      >
                        <FontAwesomeIcon icon={faInstagram} />
                      </a>
                    )}
                    {externalLinks.imdb_id && (
                      <a
                        href={`https://www.imdb.com/name/${externalLinks.imdb_id}`}
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

              <div className="movie__detailRight">
                <div className="movie__detailRightTop">
                  <br />
                  <div className="movie__name mt-2 md:mt-0 text-2xl md:text-5xl">
                    {tvDetails.name}
                  </div>
                  {tvDetails.tagline && (
                    <div className="movie__tagline">
                      {tvDetails.tagline ? tvDetails.tagline : <br />}
                    </div>
                  )}

                  <div className="movie__rating">
                    <FontAwesomeIcon
                      className="text-yellow-400"
                      icon={faStar}
                    />
                    {tvDetails.vote_average}
                    <span className="movie__voteCount">
                      ({tvDetails.vote_count} votes)
                    </span>
                  </div>
                  <div className="movie__runtime">
                    {tvDetails.episode_run_time
                      ? `${tvDetails.episode_run_time[0]} mins`
                      : "N/A"}
                  </div>
                  <div className="movie__releaseDate">
                    First air date: {tvDetails.first_air_date}
                  </div>
                  <div className="movie__genres pt-0 md:pt-7 pb-0 hidden md:block">
                    {tvDetails.genres &&
                      tvDetails.genres.map((genre) => (
                        <span className="movie__genre" key={genre.id}>
                          {genre.name}
                        </span>
                      ))}
                  </div>
                  <div className="mt-10">
                    <div className="synopsisText">Synopsis</div>
                    <div>{tvDetails.overview}</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <SingleTVpage />
    </>
  );
}
