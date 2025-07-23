import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ERROR_MESSAGES } from "../Constants/messages";

import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import { fetchPopularMovies } from "../services/api";
import MovieCard from "./MovieCard";
import MovieDetailsModal from "./MovieDetailsModal";
import MovieSearch from "./MovieSearch"; 
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchPopularMovies();
        setMovies(data);
      } catch (error) {
        setError(ERROR_MESSAGES.FETCH_POPULAR_MOVIES);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Box className="w-64 bg-indigo-700 text-white flex-shrink-0 shadow-lg">
        <Box className="h-16 flex items-center justify-center border-b border-indigo-800 w-full">
          <Typography variant="h6" className="text-center px-2">
            MOVIE RECOMMENDATION APP
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box className="flex-1 p-8">
        {/* Header */}
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-semibold text-gray-900">
            Welcome, {user?.name}, Have a nice day!
          </Typography>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            size="large"
            sx={{ padding: "10px 20px", fontWeight: "bold", boxShadow: 2 }}
          >
            Logout
          </Button>
        </Box>

        {/* Movie Search Bar */}
        <Box sx={{ mb: 4 }}>
          <MovieSearch />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" gutterBottom>
          Popular Movies
        </Typography>

        {loading && <CircularProgress />}
        {error && <div>{error}</div>}

        <Grid container spacing={3}>
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
      </Box>
    </div>
  );
};

export default Dashboard;