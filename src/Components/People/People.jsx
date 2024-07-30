import React, { useState, useEffect } from "react";
import  { Link  } from "react-router-dom"
import SearchbarPeople from "./SearchbarPeople";

export default function People() {
  const [people, setPeople] = useState([]);

  const [page, setPage] = useState(1);

  const fetchPeople = async () => {
    try {
      const endpoint = `https://api.themoviedb.org/3/person/popular?api_key=d00cb3e60d55a92130bdafb5ff634708&language=en-US&page=${page}`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch people: ${response.statusText}`);
      }
      const data = await response.json();

      if (page === 1) {
        setPeople(data.results);
      } else {

        setPeople((prevPeople) => [...prevPeople, ...data.results]);
      }
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handeldata = (data) => {
    setPeople(data);
  };
  
  return (
    <div className="md:w-3/4 mx-auto">
    <SearchbarPeople onSearch={handeldata} />
    
      <div className="flex flex-wrap justify-center mt-5">
        {people.map((actor) => (
          <div key={actor.id} className="m-2">
            <Link  to={`/person/${actor.id}`}>
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                  : "path_to_your_placeholder_image"
              }
              alt={actor.name}
              className="w-48"
            /></Link>

            <p className="text-white text-center">
              {actor.original_name.length > 20
                ? `${actor.original_name.slice(0, 20)}...`
                : actor.original_name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
