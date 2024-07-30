import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SingleMovieDetails from "./SingleMovieDetails";
import { auth, db } from "../LoginFunc/Firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faImdb,
} from "@fortawesome/free-brands-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

const TMDB_API_KEY = "d00cb3e60d55a92130bdafb5ff634708"; 

const Moviedetail = () => {
  const [currentMovieDetail, setMovieDetail] = useState(null);
  const [isInList, setIsInList] = useState(false);
  const [externallinks, setexternallinks] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movie data");
        }
        const data = await response.json();
        setMovieDetail(data);

        const externallinks = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${TMDB_API_KEY}`
        );
        if (!externallinks.ok) {
          throw new Error("Failed to fetch movie data");
        }
        const extrenaldata = await externallinks.json();
        setexternallinks(extrenaldata);

        // Check if the movie is in the user's Firestore list
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().myMovieList.includes(id)) {
            setIsInList(true);
          } else {
            setIsInList(false);
          }
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieDetail();
  }, [id]);

  const handleMyListClick = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "Users", user.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const newList = isInList ? arrayRemove(id) : arrayUnion(id);
          await updateDoc(docRef, { myMovieList: newList });

          // Update local storage
          const myMovieList = JSON.parse(localStorage.getItem("myMovieList")) || [];
          if (isInList) {
            localStorage.setItem(
              "myMovieList",
              JSON.stringify(myMovieList.filter((item) => item !== id))
            );
          } else {
            localStorage.setItem("myMovieList", JSON.stringify([...myMovieList, id]));
          }

          setIsInList(!isInList); // Update the state after modifying the list
        }
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    } else {
      alert("Please log in to add to your list.");
    }
  };

  return (
    <div className="movie">
      {currentMovieDetail && (
        <>
          <div className="movie__intro hidden md:block">
            <img
              className="movie__backdrop"
              src={`https://image.tmdb.org/t/p/original${
                currentMovieDetail.backdrop_path || ""
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
                    currentMovieDetail.poster_path || ""
                  }`}
                  alt="Poster"
                />
                <div
                  className={`absolute top-5 left-60 transform text-3xl h-10 w-10 cursor-pointer transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
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
                  {externallinks.facebook_id && (
                    <a
                      href={`https://facebook.com/${externallinks.facebook_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl text-blue-600 transition-transform transform hover:-translate-y-2"
                    >
                      <FontAwesomeIcon icon={faFacebook} />
                    </a>
                  )}

                  {externallinks.twitter_id && (
                    <a
                      href={`https://twitter.com/${externallinks.twitter_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl text-blue-400 transition-transform transform hover:-translate-y-2"
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                  )}
                  {externallinks.instagram_id && (
                    <a
                      href={`https://www.instagram.com/${externallinks.instagram_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl text-pink-600 transition-transform transform hover:-translate-y-2"
                    >
                      <FontAwesomeIcon icon={faInstagram} />
                    </a>
                  )}
                  {externallinks.imdb_id && (
                    <a
                      href={`https://www.imdb.com/name/${externallinks.imdb_id}`}
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
                <div className="movie__name mt-2 md:mt-0 text-3xl md:text-5xl">
                  {currentMovieDetail.original_title}
                </div>
                <div className="movie__tagline">
                  {currentMovieDetail.tagline ? (
                    currentMovieDetail.tagline
                  ) : (
                    <br />
                  )}
                </div>
                <div className="movie__rating">
                  {currentMovieDetail.vote_average}{" "}
                  <i className="fas fa-star" />
                  <span className="movie__voteCount">
                    ({currentMovieDetail.vote_count} votes)
                  </span>
                </div>
                <div className="movie__runtime">
                  {currentMovieDetail.runtime} mins
                </div>
                <div className="movie__releaseDate">
                  Release date: {currentMovieDetail.release_date}
                </div>
                <div className="movie__genres pt-7 pb-0">
                  {currentMovieDetail.genres &&
                    currentMovieDetail.genres.map((genre) => (
                      <span className="movie__genre" key={genre.id}>
                        {genre.name}
                      </span>
                    ))}
                </div>
                <div className="mt-10">
                  <div className="synopsisText">Synopsis</div>
                  <div>{currentMovieDetail.overview}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <SingleMovieDetails className="mt-0 pt-0" />
    </div>
  );
};

export default Moviedetail;
