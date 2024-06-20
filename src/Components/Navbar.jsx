import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center sticky top-0 bg-gray-950 shadow-md z-10 p-4">
      <div className="text-white font-mono ml-8">
        <Link to="/" className="flex flex-col">
          <p className="text-2xl">UNIMOVIES</p>
          <p className="text-xs">Watch & Download</p>
        </Link>
      </div>
      <div className="flex items-center ">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 rounded-l border border-white bg-white text-black focus:outline-none"
        />
        <button className="bg-gray-800 border border-white border-l-none p-2 rounded-r text-white">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <button className="p-2 border ml-8 h-10 w-20 font-bold border-sky-500 bg-sky-500 hover:bg-sky-700 text-white">
            Login
        </button>
      </div>

    </nav>
  );
}
