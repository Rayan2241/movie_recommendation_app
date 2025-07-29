import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { tmdbAPI } from '../services/api'; // Updated import

interface MovieDetailsModalProps {
  movieId: number | null;
  open: boolean;
  onClose: () => void;
}

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movieId,
  open,
  onClose
}) => {
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (movieId) {
      setLoading(true);
      setError(null);
      tmdbAPI.fetchMovieDetails(movieId)
        .then((data) => setMovieDetails(data))
        .catch((error) => {
          console.error("Error fetching movie details:", error);
          setError("Failed to load movie details");
        })
        .finally(() => setLoading(false));
    }
  }, [movieId]);

  const handleClose = () => {
    setMovieDetails(null);
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', md: '70%' },
        maxWidth: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        {loading && (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {movieDetails && !loading && (
          <>
            <Typography variant="h4" component="h2" gutterBottom>
              {movieDetails.title}
            </Typography>
            
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
              <Box flexShrink={0}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                  alt={movieDetails.title}
                  style={{ width: '100%', maxWidth: 300, borderRadius: 8 }}
                />
              </Box>
              
              <Box>
                <Typography variant="body1" paragraph>
                  <strong>Release Date:</strong> {movieDetails.release_date}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Rating:</strong> {movieDetails.vote_average?.toFixed(1)}/10
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Runtime:</strong> {movieDetails.runtime} minutes
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Overview:</strong> {movieDetails.overview}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default MovieDetailsModal;