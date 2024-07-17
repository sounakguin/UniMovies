import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = 'd00cb3e60d55a92130bdafb5ff634708';
const BASE_URL = 'https://api.themoviedb.org/3';

// Async thunks for fetching data from TMDB API
export const fetchTopRatedMovies = createAsyncThunk('tmdb/fetchTopRatedMovies', async () => {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
});

export const fetchPopularTvShows = createAsyncThunk('tmdb/fetchPopularTvShows', async () => {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
});

// Slice for TMDB data
const tmdbSlice = createSlice({
    name: 'tmdb',
    initialState: {
        topRatedMovies: [],  // <-- Corrected state key name
        popularTvShows: [],  // <-- Corrected state key name
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetching popular TV shows
            .addCase(fetchPopularTvShows.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPopularTvShows.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.popularTvShows = action.payload;
            })
            .addCase(fetchPopularTvShows.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Fetching top-rated movies
            .addCase(fetchTopRatedMovies.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.topRatedMovies = action.payload;
            })
            .addCase(fetchTopRatedMovies.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default tmdbSlice.reducer;
