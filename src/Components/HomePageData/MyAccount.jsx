import React, { useEffect, useState } from "react";
import { auth, db } from "../LoginFunc/Firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css'; // Import carousel styles

const TMDB_API_KEY = "d00cb3e60d55a92130bdafb5ff634708"; // Your TMDB API key

const MyAccount = () => {
  const [movieList, setMovieList] = useState([]);
  const [tvList, setTVList] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});
  const [tvDetails, setTvDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 7 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 7 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const data = docSnap.data();
              setMovieList(data.myMovieList || []);
              setTVList(data.myTVList || []);

              // Fetch details for the user's lists
              const detailsPromises = [
                ...data.myMovieList.map((id) => fetchDetails(id, 'movie')),
                ...data.myTVList.map((id) => fetchDetails(id, 'tv'))
              ];
              const detailsArray = await Promise.all(detailsPromises);

              const movieDetailsMap = {};
              const tvDetailsMap = {};

              detailsArray.forEach((detail) => {
                if (detail) {
                  if (detail.media_type === 'movie') {
                    movieDetailsMap[detail.id] = detail;
                  } else if (detail.media_type === 'tv') {
                    tvDetailsMap[detail.id] = detail;
                  }
                }
              });

              setMovieDetails(movieDetailsMap);
              setTvDetails(tvDetailsMap);
            } else {
              console.log("No such document!");
            }
          } else {
            console.log("No user logged in.");
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchDetails = async (id, media_type) => {
    try {
      const url = media_type === 'movie'
        ? `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`
        : `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return { ...data, media_type };
      }

      throw new Error("Failed to fetch details");
    } catch (error) {
      console.error("Error fetching details:", error.message);
      return null; // Return null in case of an error
    }
  };

  const handleRemoveFromList = async (id, media_type) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        if (media_type === 'movie') {
          await updateDoc(docRef, {
            myMovieList: arrayRemove(id),
          });

          const updatedList = movieList.filter((item) => item !== id);
          setMovieList(updatedList);
          setMovieDetails((prev) => {
            const newDetails = { ...prev };
            delete newDetails[id];
            return newDetails;
          });
        } else if (media_type === 'tv') {
          await updateDoc(docRef, {
            myTVList: arrayRemove(id),
          });

          const updatedTVList = tvList.filter((item) => item !== id);
          setTVList(updatedTVList);
          setTvDetails((prev) => {
            const newDetails = { ...prev };
            delete newDetails[id];
            return newDetails;
          });
        }

        // Update localStorage
        localStorage.setItem("movieList", JSON.stringify(updatedList));
        localStorage.setItem("tvList", JSON.stringify(updatedTVList));
      }
    } catch (error) {
      console.error("Error removing from list:", error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // Determine if there's data to display
  const hasContent = Object.keys(movieDetails).length > 0 || Object.keys(tvDetails).length > 0;

  return (
    <div
      className={`relative flex flex-col justify-center items-center ${hasContent ? 'h-full' : 'h-screen'} bg-cover bg-center`}
      style={{
        backgroundImage: "url('/Images/solo.jpg')", // Fixed path
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative container bg-transparent mx-auto p-4">
        <p className="text-3xl text-center font-semibold mb-4 text-white pl-4">My List</p>
        
        <p className="text-xl font-semibold mb-2 text-white pl-4">Movies</p>
        <div className="relative">
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={false}
            keyBoardControl={true}
            transitionDuration={1000}
            arrows={true}
            showDots={false}
          >
            {Object.keys(movieDetails).length > 0 ? (
              Object.keys(movieDetails).map((movieId) => {
                const movie = movieDetails[movieId];
                return (
                  <div key={movieId} className="p-2 bg-gray-800 rounded-lg ml-4">
                    <Link to={`/movie/${movieId}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full rounded"
                      />
                    </Link>
                    <button
                      className="text-red-500 mt-2 text-center"
                      onClick={() => handleRemoveFromList(movieId, 'movie')}
                    >
                      Remove
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-white">No movies in your list.</p>
            )}
          </Carousel>
        </div>

        <p className="text-xl font-semibold mb-2 text-white pl-4 pt-8 pb-2">TV Shows</p>
        <div className="relative">
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={false}
            keyBoardControl={true}
            transitionDuration={1000}
            arrows={true}
            showDots={false}
          >
            {Object.keys(tvDetails).length > 0 ? (
              Object.keys(tvDetails).map((tvId) => {
                const tvShow = tvDetails[tvId];
                return (
                  <div key={tvId} className="p-2 bg-gray-800 rounded-lg ml-4">
                    <Link to={`/tv/${tvId}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                        alt={tvShow.name}
                        className="w-full rounded"
                      />
                    </Link>
                    <button
                      className="text-red-500 mt-2 text-center"
                      onClick={() => handleRemoveFromList(tvId, 'tv')}
                    >
                      Remove
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-white">No TV shows in your list.</p>
            )}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
