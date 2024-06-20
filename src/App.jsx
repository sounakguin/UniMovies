import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./Components/Index";
import Navbar from "./Components/Navbar";
import './App.css';
import Moviedetail from "./Components/Moviedetail";

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="movie/:id" element={<Moviedetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
