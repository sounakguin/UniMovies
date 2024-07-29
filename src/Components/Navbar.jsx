import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faUserCircle,
  faCaretDown,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { auth, db } from "./LoginFunc/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "Users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched user data:", data); // Add this line
          setFullName(data.FullName || ""); // Ensure default value if fullName is undefined
        } else {
          console.log("No such document!");
        }
      } else {
        setUser(null);
        setFullName("");
      }
    });
    return () => unsubscribe();
  }, []);
  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setFullName("");
  };

  

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setDropdownOpen(false);
    }, 1000); 
    setTimeoutId(id);
  };

  return (
    <nav className="sticky top-0 bg-gray-950 shadow-md z-10 p-4">
      <div className="flex justify-between items-center">
        <div className="text-white font-mono flex items-center">
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
        <div className="hidden md:flex items-center relative">
          {user ? (
            <div
              className="relative flex items-center cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={dropdownRef}
            >
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-white text-2xl mr-2"
              />
              <span className="text-white font-bold mr-2">{fullName}</span>
              <FontAwesomeIcon
                icon={faCaretDown}
                className="text-white text-xl"
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 md:mt-32 w-36 bg-white border rounded shadow-lg z-20">
                  <Link
                    to="/myaccount"
                    className="block text-right px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-right block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/Login">
              <button className="p-2 border ml-8 h-10 w-20 font-bold border-sky-500 bg-sky-500 hover:bg-sky-700 text-white">
                Login
              </button>
            </Link>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
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
        {user ? (
          <div className="block text-white py-2">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-white text-2xl mr-2"
              />
              <span className="text-white font-bold">{fullName}</span>

              <FontAwesomeIcon
                icon={faArrowCircleDown}
                className="text-white text-xl ml-2"
              />
            </div>
            <div className="w-full bg-gray-800 text-white mt-2">
              <Link to="/Profile" className="block px-4 py-2 hover:bg-gray-600">
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Link to="/Login" className="block text-white py-2">
            <button className="w-full p-2 font-bold border-sky-500 bg-sky-500 hover:bg-sky-700 text-white">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
