import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center sticky top-0 bg-gray-950 shadow-md z-10 p-4">
      <div className="text-white font-mono ml-8 flex justify-between items-center">
        <Link to="/" className="">
          <p className="text-2xl">UNIMOVIES</p>
        </Link>
        <Link to="/Allmovies">AllMovies</Link>
        <Link to="/People">People</Link>
        <Link to="/TV">TV</Link>
      </div>
      <div className="flex items-center ">
        <Link to="/Login">
          <button className="p-2 border ml-8 h-10 w-20 font-bold border-sky-500 bg-sky-500 hover:bg-sky-700 text-white">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
}
