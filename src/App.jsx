import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./Components/Index";
import Navbar from "./Components/Navbar";
import Moviedetail from "./Components/Movie/Moviedetail";
import Allmovies from "./Components/Movie/AllmoviesTMDB";
import Login from "./Components/LoginFunc/Login";
import Register from "./Components/LoginFunc/Register";
import ForgotPassword from "./Components/LoginFunc/ForgotPassword";
import MyAccount from "./Components/HomePageData/MyAccount";
import SingleMoviepage from "./Components/Movie/SingleMovieDetails";
import People from "./Components/People/People";
import TV from "./Components/TV/TV";
import TVDetails from "./Components/TV/TVDetails";
import SinglepagePeople from "./Components/People/SinglepagePeople";


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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/myaccount" element={<MyAccount />} />
          <Route path="/single-movie/:id" element={<SingleMoviepage />} />
          <Route path="/People" element={<People />} />
          <Route path="/TV" element={<TV />} />
          <Route path="/tv/:id" element={<TVDetails />} />
          <Route path="/person/:id" element={<SinglepagePeople />} />
        </Routes>
     
      </div>
    </Router>
  );
}

export default App;
