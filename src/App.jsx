import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./Components/Index";
import Navbar from "./Components/Navbar";
import "./App.css";
import Moviedetail from "./Components/Moviedetail";
import Allmovies from "./Components/AllmoviesTMDB";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { ToastContainer } from "react-toastify";
import SingleMoviepage from "./Components/SingleMovieDetails";
import People from "./Components/People/People";
import TV from "./Components/TV/TV";
import TVDetails from "./Components/TV/TVDetails";
import SinglepagePeople from "./Components/People/SinglepagePeople"
import Footer from "./Components/Footer";

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movie/:id" element={<Moviedetail />} />
          <Route path="/Allmovies" element={<Allmovies />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/single-movie/:id" element={<SingleMoviepage />} />
          <Route path="/People" element={<People />} />
          <Route path="/TV" element={<TV/>} />
          <Route path="/tv/:id" element={<TVDetails/>} />
          <Route path="/person/:id" element={<SinglepagePeople/>} />
        
        </Routes>
    
      </div>
    </Router>
  );
}

export default App;
