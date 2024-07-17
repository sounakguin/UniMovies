import { configureStore } from '@reduxjs/toolkit';
import tmdbReducer from '../Allmovies/AllmovieSlice';

export const store = configureStore({
    reducer: {
        tmdb: tmdbReducer,
    }
});
