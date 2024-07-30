import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = 'd00cb3e60d55a92130bdafb5ff634708';
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchAllPages = async (url, maxPages = 10) => {
    let allResults = [];
    let page = 1;
    let totalPages = 1;

    do {
        const response = await fetch(`${url}&page=${page}`);
        const data = await response.json();
        allResults = allResults.concat(data.results);
        totalPages = data.total_pages;
        page++;
    } while (page <= totalPages && page <= maxPages);

    return allResults;
};

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

export const fetchUpcomingMovies = createAsyncThunk('tmdb/fetchUpcomingMovies', async () => {
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

const tmdbSlice = createSlice({
    name: 'tmdb',
    initialState: {
        topRatedMovies: [],
        popularMovies: [],
        upcomingMovies: [],
        popularTvShows: [],
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
            // Fetching popular movies
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
            // Fetching upcoming movies
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
