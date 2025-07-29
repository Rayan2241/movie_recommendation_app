import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  CircularProgress, 
  Alert,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import type { MovieData } from "../types";
import { tmdbAPI } from '../services/api'; // Assuming you have this API function

const Profile: React.FC = () => {
  const { 
    user, 
    favorites, 
    removeFavorite,
    isLoading: isAuthLoading 
  } = useAuth();
  const [movieDetails, setMovieDetails] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      if (!favorites || favorites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch details for each favorite movie
        const detailsPromises = favorites.map(movieId => 
          tmdbAPI.fetchMovieDetails(Number(movieId))
        );
        const movies = await Promise.all(detailsPromises);
        
        setMovieDetails(movies.filter((movie: null) => movie !== null) as MovieData[]);
      } catch (err) {
        console.error("Failed to fetch favorite movies:", err);
        setError("Failed to load favorite movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [favorites]);

  const handleRemoveFavorite = async (movieId: number) => {
    try {
      setLoading(true);
      await removeFavorite(movieId);
      // Optimistically update UI
      setMovieDetails(prev => prev.filter(movie => movie.id !== movieId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      setError("Failed to remove favorite. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Welcome, {user?.name}
        </Typography>
        <Typography variant="body1">
          Email: {user?.email}
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Your Favorites ({favorites?.length || 0})
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" sx={{ my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!loading && movieDetails.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          You haven't added any favorites yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {movieDetails.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  sx={{ height: 400, objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {movie.title}
                  </Typography>
                  <Chip 
                    label={movie.release_date.split('-')[0]} 
                    size="small" 
                    sx={{ mr: 1 }} 
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {movie.overview.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleRemoveFavorite(movie.id)}
                    disabled={loading}
                  >
                    Remove Favorite
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Profile;