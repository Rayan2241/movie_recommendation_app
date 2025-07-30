import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  CircularProgress, 
  Divider, 
  IconButton,
  Container,
  Avatar,
  Card,
  CardContent,
  InputBase,
  Pagination,
  Stack
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { tmdbAPI } from '../services/api';
import MovieCard from './MovieCard';
import MovieDetailsModal from './MovieDetailsModal';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import MovieIcon from '@mui/icons-material/Movie';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { EnhancedMovieData, PaginatedMovieResponse } from "../types";
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
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      if (!favoritesLoaded) return;
      
      try {
        setLoading(currentPage === 1);
        setIsLoadingPage(currentPage > 1);
        
        const data: PaginatedMovieResponse = await tmdbAPI.fetchPopularMovies(currentPage);
        
        const moviesWithFavorites = data.results.map((movie: MovieData): EnhancedMovieData => ({
          ...movie as MovieData,
          isFavorite: isFavorite(movie.id)
        }));
        
        setMovies(moviesWithFavorites);
        setTotalPages(data.total_pages);
        setTotalResults(data.total_results);
        setCurrentPage(data.page);
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
        setIsLoadingPage(false);
      }
    };

    loadMovies();
  }, [favoritesLoaded, favorites, currentPage]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Add your search logic here
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 30%, #2d1b69 60%, #11998e 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 107, 107, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)
          `,
          animation: 'backgroundFlow 15s ease-in-out infinite alternate'
        }}
      />

      {/* Floating Particles */}
      <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`,
              transform: `scale(${0.5 + Math.random() * 1})`
            }}
          />
        ))}
      </Box>

      {/* Glassmorphism Sidebar */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 280,
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderLeft: 'none',
          borderTop: 'none',
          borderBottom: 'none',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,107,107,0.05), rgba(78,205,196,0.05), rgba(102,126,234,0.05))',
          }
        }}
      >
        {/* Logo Section */}
        <Box sx={{ textAlign: 'center', mb: 6, position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              borderRadius: '20px',
              mb: 3,
              boxShadow: '0 15px 35px rgba(255, 107, 107, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shimmer 2s infinite'
              }
            }}
          >
            <MovieIcon sx={{ fontSize: 35, color: 'white' }} />
          </Box>
          
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 900,
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite',
              letterSpacing: '-1px'
            }}
          >
            MOVIEVERSE
          </Typography>
        </Box>

        {/* User Profile Section */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            p: 3,
            mb: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                background: 'linear-gradient(45deg, #4ecdc4, #45b7d1)',
                mr: 2,
                fontSize: '1.2rem',
                fontWeight: 700
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
              >
                {user?.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.9rem'
                }}
              >
                Movie Enthusiast
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Favorites
            </Typography>
            <Box
              sx={{
                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                borderRadius: '12px',
                px: 2,
                py: 0.5,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FavoriteIcon sx={{ fontSize: 16, color: '#4ecdc4', mr: 1 }} />
              <Typography 
                variant="body2" 
                sx={{ color: '#4ecdc4', fontWeight: 600 }}
              >
                {user?.favorites?.length || 0}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <Button
            startIcon={<DashboardIcon />}
            fullWidth
            sx={{
              color: 'white',
              mb: 2,
              justifyContent: 'flex-start',
              py: 1.5,
              px: 3,
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: 'rgba(78, 205, 196, 0.1)',
              border: '1px solid rgba(78, 205, 196, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(78, 205, 196, 0.2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Dashboard
          </Button>
          
          <Button
            startIcon={<FavoriteIcon />}
            onClick={handleFavoritesClick}
            fullWidth
            sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 2,
              justifyContent: 'flex-start',
              py: 1.5,
              px: 3,
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                color: '#ff6b6b',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255, 107, 107, 0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            My Favorites
          </Button>
        </Box>

        {/* Logout Button */}
        <Button
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          fullWidth
          sx={{
            color: 'rgba(255,255,255,0.8)',
            justifyContent: 'flex-start',
            py: 1.5,
            px: 3,
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: 600,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              color: '#ff6b6b',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(255, 107, 107, 0.2)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        ml: '280px', 
        p: 4, 
        position: 'relative', 
        zIndex: 1,
        minHeight: '100vh'
      }}>
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '25px',
              p: 4,
              mb: 4,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,107,107,0.05), rgba(78,205,196,0.05), rgba(102,126,234,0.05))',
                borderRadius: '25px'
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <Box>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 900,
                    fontSize: { xs: '2rem', md: '3rem' },
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 3s ease infinite',
                    letterSpacing: '-1px',
                    mb: 1
                  }}
                >
                  Welcome back!
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    fontWeight: 300,
                    fontSize: '1.3rem'
                  }}
                >
                  Ready to discover amazing movies, {user?.name}?
                </Typography>
              </Box>
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(78, 205, 196, 0.1)',
                  borderRadius: '20px',
                  px: 3,
                  py: 2,
                  border: '1px solid rgba(78, 205, 196, 0.3)'
                }}
              >
                <TrendingUpIcon sx={{ color: '#4ecdc4', mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Your Favorites
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: '#4ecdc4', 
                      fontWeight: 700,
                      fontSize: '1.8rem'
                    }}
                  >
                    {user?.favorites?.length || 0}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Search Section */}
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '25px',
              p: 3,
              mb: 4,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,107,107,0.03), rgba(78,205,196,0.03), rgba(102,126,234,0.03))',
                borderRadius: '25px'
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                justifyContent: 'center'
              }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    backgroundColor: 'rgba(78, 205, 196, 0.2)',
                    borderRadius: '8px',
                    mr: 2,
                    border: '1px solid rgba(78, 205, 196, 0.3)'
                  }}
                >
                  <MovieIcon sx={{ color: '#4ecdc4', fontSize: 20 }} />
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 600,
                    fontSize: '1.3rem'
                  }}
                >
                  Discover Movies
                </Typography>
              </Box>

              {/* Search Input */}
              <Box 
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(78, 205, 196, 0.3)',
                    boxShadow: '0 8px 25px rgba(78, 205, 196, 0.15)'
                  },
                  '&:focus-within': {
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(78, 205, 196, 0.5)',
                    boxShadow: '0 8px 25px rgba(78, 205, 196, 0.25)'
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pl: 3,
                    pr: 2
                  }}
                >
                  <SearchIcon sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontSize: 22 
                  }} />
                </Box>

                <InputBase
                  placeholder="Search for your favorite movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    flex: 1,
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 400,
                    py: 2,
                    pr: 3,
                    '& .MuiInputBase-input': {
                      padding: 0,
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)',
                        opacity: 1,
                        fontSize: '1rem',
                        fontWeight: 400
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Movies Section */}
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '25px',
              p: 4,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,107,107,0.03), rgba(78,205,196,0.03), rgba(102,126,234,0.03))',
                borderRadius: '25px'
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Header with pagination info */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 4
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      width: '6px',
                      height: '32px',
                      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                      borderRadius: '3px',
                      marginRight: '16px'
                    }
                  }}
                >
                  Popular Movies
                </Typography>

                {/* Pagination Info */}
                <Box
                  sx={{
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    borderRadius: '16px',
                    px: 3,
                    py: 1.5,
                    border: '1px solid rgba(78, 205, 196, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ color: 'rgba(255,255,255,0.8)' }}
                  >
                    Page {currentPage} of {totalPages}
                  </Typography>
                  <Divider 
                    orientation="vertical" 
                    flexItem 
                    sx={{ borderColor: 'rgba(78, 205, 196, 0.3)' }} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ color: '#4ecdc4', fontWeight: 600 }}
                  >
                    {totalResults.toLocaleString()} movies
                  </Typography>
                </Box>
              </Box>

              {/* Quick Navigation Buttons */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 4
              }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || isLoadingPage}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    px: 3,
                    py: 1.5,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(78, 205, 196, 0.1)',
                      border: '1px solid rgba(78, 205, 196, 0.3)',
                      color: '#4ecdc4'
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      color: 'rgba(255, 255, 255, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  Previous
                </Button>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  px: 2,
                  py: 1
                }}>
                  {isLoadingPage && (
                    <CircularProgress 
                      size={20} 
                      sx={{ color: '#4ecdc4', mr: 1 }} 
                    />
                  )}
                  <Typography 
                    variant="body2" 
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    {isLoadingPage ? 'Loading...' : `Showing page ${currentPage}`}
                  </Typography>
                </Box>

                <Button
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || isLoadingPage}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    px: 3,
                    py: 1.5,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(78, 205, 196, 0.1)',
                      border: '1px solid rgba(78, 205, 196, 0.3)',
                      color: '#4ecdc4'
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      color: 'rgba(255, 255, 255, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }
                  }}
                >
                  Next
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: '300px'
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress 
                      size={80} 
                      sx={{ 
                        color: '#4ecdc4',
                        mb: 3,
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round',
                        }
                      }} 
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 500
                      }}
                    >
                      Loading amazing movies...
                    </Typography>
                  </Box>
                </Box>
              ) : error ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 107, 107, 0.3)'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#ff6b6b',
                      fontWeight: 600
                    }}
                  >
                    {error}
                  </Typography>
                </Box>
              ) : (
                <>
                  {/* Movies Grid */}
                  <Grid container spacing={4} sx={{ mb: 6 }}>
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

                  {/* Advanced Pagination Component */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '20px',
                      p: 3,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Stack spacing={2} alignItems="center">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          mb: 1
                        }}
                      >
                        Navigate through {totalPages.toLocaleString()} pages of movies
                      </Typography>
                      
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        disabled={isLoadingPage}
                        sx={{
                          '& .MuiPaginationItem-root': {
                            color: 'rgba(255, 255, 255, 0.8)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            fontWeight: 600,
                            fontSize: '1rem',
                            minWidth: '44px',
                            height: '44px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(78, 205, 196, 0.1)',
                              border: '1px solid rgba(78, 205, 196, 0.3)',
                              color: '#4ecdc4',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 20px rgba(78, 205, 196, 0.2)'
                            },
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(78, 205, 196, 0.2)',
                              border: '1px solid rgba(78, 205, 196, 0.5)',
                              color: '#4ecdc4',
                              boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)',
                              '&:hover': {
                                backgroundColor: 'rgba(78, 205, 196, 0.25)',
                                transform: 'translateY(-2px)'
                              }
                            },
                            '&.Mui-disabled': {
                              backgroundColor: 'rgba(255, 255, 255, 0.02)',
                              color: 'rgba(255, 255, 255, 0.3)',
                              border: '1px solid rgba(255, 255, 255, 0.05)'
                            }
                          },
                          '& .MuiPaginationItem-ellipsis': {
                            color: 'rgba(255, 255, 255, 0.5)'
                          }
                        }}
                      />
                    </Stack>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          {/* Movie Details Modal */}
          <MovieDetailsModal
            movieId={selectedMovieId}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Container>
      </Box>

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes backgroundFlow {
            0% { 
              transform: translateX(0) translateY(0) scale(1);
              opacity: 0.8;
            }
            50% { 
              transform: translateX(-20px) translateY(-10px) scale(1.1);
              opacity: 1;
            }
            100% { 
              transform: translateX(10px) translateY(5px) scale(0.95);
              opacity: 0.8;
            }
          }

          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) translateX(0px);
              opacity: 0.3;
            }
            50% { 
              transform: translateY(-20px) translateX(10px);
              opacity: 1;
            }
          }

          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}
      </style>
    </Box>
  );
};

export default Dashboard;