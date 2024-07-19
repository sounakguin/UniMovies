import React, { useState } from 'react';

const FilterTV = ({ genres, selectedGenre, handleGenreClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleGenreSelect = (genreId) => {
    handleGenreClick(genreId);
    setShowDropdown(false); // Close dropdown after selection
  };

  if (!genres || genres.length === 0) {
    return null; // Return null or a loading indicator if genres are not yet available
  }

  return (
    <div>
      {/* Desktop view with genre buttons */}
      <div className="hidden md:block">
        <div className="flex justify-center items-center">
          {genres.slice(0, 6).map((genre) => (
            <button
              key={genre.id}
              className={`p-1 bg-blue-600 text-white ml-4 ${selectedGenre === genre.id ? 'bg-red-500' : ''}`}
              onClick={() => handleGenreClick(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
        <br />
        <div className="flex justify-center items-center">
          {genres.slice(7, 12).map((genre) => (
            <button
              key={genre.id}
              className={`p-1 bg-blue-600 text-white ml-4 ${selectedGenre === genre.id ? 'bg-red-500' : ''}`}
              onClick={() => handleGenreClick(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
        <br />
        <div className="flex justify-center items-center">
          {genres.slice(13, 19).map((genre) => (
            <button
              key={genre.id}
              className={`p-1 bg-blue-600 text-white ml-4 ${selectedGenre === genre.id ? 'bg-red-500' : ''}`}
              onClick={() => handleGenreClick(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FilterTV;
