import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  CircularProgress, 
  Divider, 
  IconButton,
  Container
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { tmdbAPI } from '../services/api';
import MovieCard from './MovieCard';
import MovieDetailsModal from './MovieDetailsModal';
import MovieSearch from './MovieSearch';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import type { EnhancedMovieData } from "../types";
import type { MovieData } from "../types";

const Dashboard: React.FC = () => {
  const { 
    user, 
    logout, 
    isFavorite, 
    favorites,
    favoritesLoaded, 
    addFavorite, 
    removeFavorite 
  } = useAuth();
  
  const navigate = useNavigate();

  const [movies, setMovies] = useState<EnhancedMovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      if (!favoritesLoaded) return;
      
      try {
        setLoading(true);
        const data = await tmdbAPI.fetchPopularMovies();
        const moviesWithFavorites = data.map((movie: MovieData): EnhancedMovieData => ({
          ...movie as MovieData,
          isFavorite: isFavorite(movie.id)
        }));
        setMovies(moviesWithFavorites);
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [favoritesLoaded, favorites]);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFavoritesClick = () => {
    navigate('/profile');
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
      // Update local state to reflect changes
      setMovies(prevMovies => 
        prevMovies.map(movie => 
          movie.id === movieId 
            ? { ...movie, isFavorite: !movie.isFavorite } 
            : movie
        )
      );
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          bgcolor: 'primary.main',
          color: 'white',
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h6" sx={{ mb: 4, textAlign: 'center' }}>
          Movie App
        </Typography>
        
        <Button
          startIcon={<FavoriteIcon />}
          onClick={handleFavoritesClick}
          sx={{ color: 'white', mb: 2, justifyContent: 'flex-start' }}
        >
          My Favorites
        </Button>
        
        <Button
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ 
            color: 'white', 
            mt: 'auto', 
            justifyContent: 'flex-start'
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="h4" component="h1">
              Welcome back, {user?.name}!
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={handleFavoritesClick} 
                color="inherit"
                sx={{ mr: 1 }}
              >
                <FavoriteIcon />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {user?.favorites?.length || 0}
                </Typography>
              </IconButton>
            </Box>
          </Box>

          {/* Search Bar */}
          <MovieSearch />

          <Divider sx={{ my: 4 }} />

          {/* Movies Section */}
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Popular Movies
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Grid container spacing={4}>
              {movies.map((movie) => (
                <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                  <MovieCard
                    movie={movie}
                    onClick={handleMovieClick}
                    isFavorite={movie.isFavorite}
                    onFavoriteClick={handleFavoriteClick}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Movie Details Modal */}
          <MovieDetailsModal
            movieId={selectedMovieId}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;