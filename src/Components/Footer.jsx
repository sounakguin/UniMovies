import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
        <div>

        </div>
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold mb-2">UNIMOVIES</h2>
            <p className="text-sm pt-1 text-center md:text-left text-gray-400">
              Your one-stop destination for all movie information, reviews, and trailers. 
             <p> Stay updated with the latest in the movie world.</p>
            </p>
          </div>

      
          <div className='text-center md:text-left'>
            
            <ul className="space-y-2 ">
            <p className="text-xl font-bold mb-4">Quick Links</p>
              <li><a href="#" className=" hover:text-yellow-400 ">Home</a></li>
              <li><a href="#" className="hover:text-yellow-400  ">Movies</a></li>
              <li><a href="#" className="hover:text-yellow-400 ">Person</a></li>
              <li><a href="#" className="hover:text-yellow-400 ">TV</a></li>
            
            </ul>
          </div>

         
          <div className='text-center md:text-left'>
            
            <ul className="space-y-2">
            <p className="text-xl font-bold mb-4">Contact Us</p>
              <li>Email: sounak.guin@gmail.com</li>
              <li>Phone: +917596826398</li>
              <li>Address: India, Kolkata</li>
            </ul>
          </div>
         <div>
         <p className='text-xl font-bold mb-4 text-center md:text-left'>Social Links</p>
          <div className="space-y-2 space-x-5 text-center md:text-left">
           
          <a href="https://www.linkedin.com/in/sounak-guin-6a7a84209/" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faLinkedin} size="2x" /></a>
          <a href="https://github.com/sounakguin" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faGithub} size="2x" /></a>
          <a href="https://www.instagram.com/sounak__guin/" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faInstagram} size="2x" /></a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FontAwesomeIcon icon={faYoutube} size="2x" /></a>
        </div>
         </div>
        <div>

        </div>
        </div>

        
        

      
        <div className="text-center text-white text-sm mt-16">
          &copy; 2024 Unimovies. All rights reserved.

        </div>
        <div className="flex justify-center text-center text-white text-sm ">
          Design & Developed by 
          <p className='hover:text-orange-400 ml-1'>Sounak Guin</p>
        </div>
      </div>
    </footer>
  );
}
