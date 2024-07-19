import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About Section */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold mb-2">MovieSite</h2>
            <p className="text-sm text-gray-400">
              Your one-stop destination for all movie information, reviews, and trailers. Stay updated with the latest in the movie world.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Movies</a></li>
              <li><a href="#" className="hover:underline">Genres</a></li>
              <li><a href="#" className="hover:underline">Top Rated</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>Email: info@moviesite.com</li>
              <li>Phone: +123 456 7890</li>
              <li>Address: 123 Movie Street, Film City, CA 12345</li>
            </ul>
          </div>

          {/* Subscription Form */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold mb-4">Subscribe to our Newsletter</h3>
            <form className="w-full">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full p-2 mb-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <button className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mt-10">
          <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faFacebook} size="2x" /></a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faTwitter} size="2x" /></a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faInstagram} size="2x" /></a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faYoutube} size="2x" /></a>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-gray-500 text-sm mt-10">
          &copy; 2024 MovieSite. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
