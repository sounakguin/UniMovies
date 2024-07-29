import React from 'react';

const FilterMovie = ({ genres, selectedGenre, handleGenreClick }) => {
  if (!genres || genres.length === 0) {
    return null; // Return null or a loading indicator if genres are not yet available
  }

  return (
    <div className='hidden md:block'>
      <div className="flex justify-center item-center">
        {genres.slice(0, 9).map(genre => (
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
      <div className="flex justify-center item-center">
        {genres.slice(9, 15).map(genre => (
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
      <div className="flex justify-center item-center">
        {genres.slice(15, 19).map(genre => (
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
  );
};

export default FilterMovie;
