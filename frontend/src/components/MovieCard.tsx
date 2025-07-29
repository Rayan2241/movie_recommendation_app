import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Box
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '../context/AuthContext';
import type { MovieData } from '../types';

interface MovieCardProps {
  movie: MovieData;
  onClick: (movieId: number) => void;
  isFavorite: boolean;
  onFavoriteClick: (movieId: number) => Promise<void>;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onClick,
  isFavorite: propIsFavorite,
  onFavoriteClick 
}) => {
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(propIsFavorite);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Sync with prop changes
  useEffect(() => {
    setLocalIsFavorite(propIsFavorite);
  }, [propIsFavorite]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Please login to manage favorites',
        severity: 'error'
      });
      return;
    }

    setIsProcessing(true);
    setSnackbar({ open: false, message: '', severity: 'success' });

    try {
      // Optimistic UI update
      const newFavoriteState = !localIsFavorite;
      setLocalIsFavorite(newFavoriteState);
      
      await onFavoriteClick(movie.id);
      
      setSnackbar({
        open: true,
        message: newFavoriteState ? 'Added to favorites' : 'Removed from favorites',
        severity: 'success'
      });
    } catch (error: any) {
      console.error('Favorite error:', error);
      // Revert optimistic update
      setLocalIsFavorite(prev => !prev);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update favorites',
        severity: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: 3
          },
          position: 'relative'
        }}
        onClick={() => onClick(movie.id)}
      >
        <CardMedia
          component="img"
          height="240"
          image={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/placeholder-movie.jpg'
          }
          alt={movie.title}
          sx={{ 
            objectFit: 'cover',
            aspectRatio: '2/3'
          }}
        />
        
        <IconButton
          aria-label={localIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleFavoriteClick}
          disabled={isProcessing}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            },
            zIndex: 1
          }}
        >
          {isProcessing ? (
            <CircularProgress size={24} />
          ) : (
            <FavoriteIcon 
              color={localIsFavorite ? 'error' : 'inherit'} 
              sx={{
                fontSize: '1.8rem',
                color: localIsFavorite ? '#ff0000' : 'rgba(0, 0, 0, 0.54)'
              }}
            />
          )}
        </IconButton>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" noWrap>
            {movie.title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {movie.release_date?.split('-')[0] || 'Unknown year'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ★ {movie.vote_average?.toFixed(1) || 'N/A'}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MovieCard;