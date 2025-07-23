import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, CircularProgress } from "@mui/material";
import { fetchMovieDetails } from "../services/api"; // Import the fetchMovieDetails API function

const MovieDetailsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  movieId: number | null;
}> = ({ open, onClose, movieId }) => {
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch movie details when movieId changes
  useEffect(() => {
    if (movieId) {
      setLoading(true);
      fetchMovieDetails(movieId)
        .then((data) => setMovieDetails(data))
        .catch((error) => console.error("Error fetching movie details:", error))
        .finally(() => setLoading(false));
    }
  }, [movieId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 4, backgroundColor: "white", maxWidth: 600, margin: "auto" }}>
        {loading ? (
          <CircularProgress />
        ) : movieDetails ? (
          <>
            <Typography variant="h4">{movieDetails.title}</Typography>
            <Typography variant="body1">{movieDetails.overview}</Typography>
            <Typography variant="body2">Runtime: {movieDetails.runtime} minutes</Typography>
            <Typography variant="body2">
              Genres: {movieDetails.genres.map((genre: any) => genre.name).join(", ")}
            </Typography>
            <Button onClick={onClose} sx={{ mt: 2 }}>
              Close
            </Button>
          </>
        ) : (
          <Typography variant="body2">No details available</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default MovieDetailsModal;
