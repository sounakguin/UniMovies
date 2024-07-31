import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = 'd00cb3e60d55a92130bdafb5ff634708';
const BASE_URL = 'https://api.themoviedb.org/3';

// Function to fetch all pages of results concurrently
const fetchAllPages = async (url, maxPages = 5) => {
    let allResults = [];
    const requests = [];

    for (let page = 1; page <= maxPages; page++) {
        requests.push(fetch(`${url}&page=${page}`).then(response => response.json()));
    }

    const results = await Promise.all(requests);

    results.forEach(data => {
        allResults = allResults.concat(data.results);
    });

    return allResults;
};

// Thunks to fetch data
export const fetchTopRatedMovies = createAsyncThunk('tmdb/fetchTopRatedMovies', async () => {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
});

export const fetchPopularMovies = createAsyncThunk('tmdb/fetchPopularMovies', async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
});

export const fetchUpcomingMovies = createAsyncThunk('tmdb/fetchUpcomingMovies', async (_, { getState }) => {
    const state = getState();
    if (state.tmdb.upcomingMovies.length > 0) {
        return state.tmdb.upcomingMovies; // Return cached data if available
    }

    const url = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`;
    const allResults = await fetchAllPages(url);
    const today = new Date().toISOString().split('T')[0];
    const futureMovies = allResults.filter(movie => movie.release_date >= today);
    return futureMovies;
});

export const fetchPopularTvShows = createAsyncThunk('tmdb/fetchPopularTvShows', async () => {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
});

export const fetchPopularAnimationTvShows = createAsyncThunk('tmdb/fetchPopularAnimationTvShows', async () => {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&with_genres=16`);
    const data = await response.json();
    return data.results;
});

// Slice to manage TMDB data
const tmdbSlice = createSlice({
    name: 'tmdb',
    initialState: {
        topRatedMovies: [],
        popularMovies: [],
        upcomingMovies: [],
        popularTvShows: [],
        popularAnimationTvShows: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            .addCase(fetchPopularAnimationTvShows.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPopularAnimationTvShows.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.popularAnimationTvShows = action.payload;
            })
            .addCase(fetchPopularAnimationTvShows.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchPopularMovies.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPopularMovies.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.popularMovies = action.payload;
            })
            .addCase(fetchPopularMovies.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchUpcomingMovies.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.upcomingMovies = action.payload;
            })
            .addCase(fetchUpcomingMovies.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
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
