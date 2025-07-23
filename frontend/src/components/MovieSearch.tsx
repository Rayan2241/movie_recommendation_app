import React, { useState } from "react";
import { TextField, Button, Grid, CircularProgress, Box } from "@mui/material";
import { fetchMovies } from "../services/api"; // Fetching movies from API
import MovieCard from "./MovieCard"; // Display movie card
import MovieDetailsModal from "./MovieDetailsModal"; // Movie details modal
import { ERROR_MESSAGES } from "../Constants/messages"; // Import error messages

const MovieSearch: React.FC = () => {
  const [query, setQuery] = useState(""); // Search query
  const [movies, setMovies] = useState([]); // Movie data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null); // Movie id for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Handle the search and fetch movies
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error

    try {
      const results = await fetchMovies(query);
      setMovies(results);
    } catch (err) {
      setError(ERROR_MESSAGES.FETCH_POPULAR_MOVIES);
    } finally {
      setLoading(false);
    }
  };

  // Handle movie card click to open modal
  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
    setIsModalOpen(true);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <TextField
          label="Search Movies"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </form>

      {loading && <CircularProgress />}
      {error && <Box sx={{ color: "red", marginTop: "10px" }}>{error}</Box>}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {movies.map((movie: any) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <MovieCard movie={movie} onClick={handleMovieClick} />
          </Grid>
        ))}
      </Grid>

      <MovieDetailsModal
        movieId={selectedMovieId}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MovieSearch;
