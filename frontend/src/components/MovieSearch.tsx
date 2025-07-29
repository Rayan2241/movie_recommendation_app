import React, { useState } from "react";
import { 
  TextField, 
  Button, 
  Grid, 
  CircularProgress, 
  Box,
  Typography
} from "@mui/material";
import { tmdbAPI } from '../services/api';
import MovieCard from "./MovieCard";
import MovieDetailsModal from "./MovieDetailsModal";
import { ERROR_MESSAGES } from "../Constants/messages";
import { useAuth } from "../context/AuthContext";

const MovieSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      const results = await tmdbAPI.fetchMovies(query.trim());
      setMovies(results || []);
      if (!results?.length) {
        setError(ERROR_MESSAGES.NO_RESULTS_FOUND);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(ERROR_MESSAGES.FETCH_MOVIES);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
    setIsModalOpen(true);
  };

  const handleFavoriteClick = async (movieId: number) => {
    try {
      if (isFavorite(movieId)) {
        await removeFavorite(movieId);
      } else {
        const movie = movies.find(m => m.id === movieId);
        if (movie) {
          await addFavorite(movieId);
        }
      }
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box 
        component="form" 
        onSubmit={handleSearch}
        sx={{ 
          mb: 4,
          display: 'flex',
          gap: 2,
          alignItems: 'center'
        }}
      >
        <TextField
          label="Search Movies"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter movie title..."
          size="small"
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={!query.trim() || loading}
          sx={{ height: 40 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && movies.length > 0 && (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <MovieCard
                movie={movie}
                onClick={handleMovieClick}
                isFavorite={isFavorite(movie.id)}
                onFavoriteClick={handleFavoriteClick}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && movies.length === 0 && query && !error && (
        <Typography variant="body1" textAlign="center" sx={{ mt: 4 }}>
          No movies found for "{query}"
        </Typography>
      )}

      <MovieDetailsModal
        movieId={selectedMovieId}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};

export default MovieSearch;