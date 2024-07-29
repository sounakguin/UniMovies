import React, { useEffect, useState } from "react";
import { auth, db } from "../LoginFunc/Firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css'; // Import carousel styles

const TMDB_API_KEY = "d00cb3e60d55a92130bdafb5ff634708"; // Your TMDB API key

const MyAccount = () => {
  const [myList, setMyList] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});
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
              setMyList(data.myList || []);

              // Fetch movie details for the user's list
              const movieDetailsPromises = (data.myList || []).map((movieId) =>
                fetchMovieDetails(movieId)
              );
              const movieDetailsArray = await Promise.all(movieDetailsPromises);
              const movieDetailsMap = movieDetailsArray.reduce(
                (acc, movie) => ({
                  ...acc,
                  [movie.id]: movie,
                }),
                {}
              );
              setMovieDetails(movieDetailsMap);
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

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error.message);
    }
  };

  const handleRemoveFromList = async (movieId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        await updateDoc(docRef, {
          myList: arrayRemove(movieId),
        });

        const updatedList = myList.filter((id) => id !== movieId);
        setMyList(updatedList);

        // Update localStorage
        localStorage.setItem("myList", JSON.stringify(updatedList));

        const updatedDetails = { ...movieDetails };
        delete updatedDetails[movieId];
        setMovieDetails(updatedDetails);
      }
    } catch (error) {
      console.error("Error removing movie from list:", error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="relative flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/public/Images/solo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative container bg-transparent mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4 text-white pl-4">My List</h2>
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
            {myList.length > 0 ? (
              myList.map((movieId) => {
                const movie = movieDetails[movieId];
                return (
                  movie ? (
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
                        onClick={() => handleRemoveFromList(movieId)}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <p key={movieId} className="text-white">Loading movie details...</p>
                  )
                );
              })
            ) : (
              <p className="text-white">No movies in your list.</p>
            )}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
