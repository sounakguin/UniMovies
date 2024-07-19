import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 bg-gray-950 shadow-md z-10 p-4">
      <div className="flex justify-between items-center">
        <div className="text-white font-mono  flex items-center">
          <Link to="/" className="text-2xl">
            UNIMOVIES
          </Link>
        </div>
        <div className="hidden md:flex space-x-8">
          <Link to="/Allmovies" className="text-white">
            AllMovies
          </Link>
          <Link to="/People" className="text-white">
            People
          </Link>
          <Link to="/TV" className="text-white">
            TV
          </Link>
        </div>
        <div className="hidden md:flex items-center">
          <Link to="/Login">
            <button className="p-2 border ml-8 h-10 w-20 font-bold border-sky-500 bg-sky-500 hover:bg-sky-700 text-white">
              Login
            </button>
          </Link>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>
      <div className={`md:hidden ${isOpen ? "block" : "hidden"} mt-4`}>
        <Link to="/Allmovies" className="block text-white py-2">
          AllMovies
        </Link>
        <Link to="/People" className="block text-white py-2">
          People
        </Link>
        <Link to="/TV" className="block text-white py-2">
          TV
        </Link>
        <Link to="/Login" className="block text-white py-2">
          <button className="w-full p-2 font-bold border-sky-500 bg-sky-500 hover:bg-sky-700 text-white">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
}
