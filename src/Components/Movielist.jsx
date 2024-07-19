import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularTvShows, fetchTopRatedMovies } from '../Allmovies/AllmovieSlice';
import "react-multi-carousel/lib/styles.css";
import Carousel from 'react-multi-carousel';
import LatestMovieTrailers from './LatestMovieTrailers';

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const MovieList = () => {
    const dispatch = useDispatch();
    const { popularTvShows, topRatedMovies, status, error } = useSelector((state) => state.tmdb); // <-- Corrected state key name

    useEffect(() => {
        // Fetch popular and top rated movies on component mount
        dispatch(fetchTopRatedMovies());
        dispatch(fetchPopularTvShows());
    }, [dispatch]);

    // Handle loading state
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    // Handle error state
    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <section className="movie-section">
                <h2 className='text-white text-3xl '>Popular Tv Shows</h2>
                <Carousel
                    responsive={responsive}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={5000}
                    keyBoardControl={true}
                    transitionDuration={1000}
                    arrows={true}
                    showDots={false}
                >
                    {popularTvShows.map((movie) => (
                        <div key={movie.id} className="movie-item">
                            <img
                                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                                alt={movie.title}
                                className='carousel-img'
                            />
                        </div>
                    ))}
                </Carousel>
            </section>

            
            <LatestMovieTrailers />

            <section className="movie-section">
                <h2 className='text-white text-3xl'>Popular Movies</h2>
                <Carousel
                    responsive={responsive}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={5000}
                    keyBoardControl={true}
                    transitionDuration={1000}
                    arrows={true}
                    showDots={false}
                >
                    {topRatedMovies.map((movie) => (
                        <div key={movie.id} className="movie-item">
                            <img
                                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                                alt={movie.title}
                                className='carousel-img'
                            />
                        </div>
                    ))}
                </Carousel>
            </section>
        </div>
    );
};

export default MovieList;
