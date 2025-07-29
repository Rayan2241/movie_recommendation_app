import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LoginOutlined,
  MovieFilter,
} from "@mui/icons-material";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Clear any previous errors
    clearError();
    
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // Error will be handled by the error state from useAuth
      console.log('Login failed:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 30%, #2d1b69 60%, #11998e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
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
        {[...Array(15)].map((_, i) => (
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

      {/* Login Form Container */}
      <Box
        sx={{
          maxWidth: 500,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '50px 40px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,107,107,0.05), rgba(78,205,196,0.05), rgba(102,126,234,0.05))',
            borderRadius: '30px'
          }
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6, position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 100,
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              borderRadius: '25px',
              mb: 4,
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
            <MovieFilter sx={{ fontSize: 50, color: 'white' }} />
          </Box>
          
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite',
              mb: 2,
              letterSpacing: '-1px'
            }}
          >
            Welcome Back
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontWeight: 300,
              fontSize: '1.2rem'
            }}
          >
            Sign in to continue your cinematic journey
          </Typography>
        </Box>

        {/* Auth Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              color: '#ff6b6b',
              '& .MuiAlert-icon': {
                color: '#ff6b6b'
              },
              '& .MuiAlert-message': {
                fontWeight: 500,
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ mb: 4 }}>
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              error={Boolean(errors.email)}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.7)' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '1.1rem',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: '2px'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(78, 205, 196, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4ecdc4',
                    borderWidth: '2px',
                    boxShadow: '0 0 20px rgba(78, 205, 196, 0.3)'
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#4ecdc4',
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff6b6b',
                  fontSize: '0.9rem'
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 5 }}>
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              error={Boolean(errors.password)}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ 
                        color: 'rgba(255,255,255,0.7)',
                        '&:hover': {
                          color: '#4ecdc4'
                        }
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.7)' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '1.1rem',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: '2px'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(78, 205, 196, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4ecdc4',
                    borderWidth: '2px',
                    boxShadow: '0 0 20px rgba(78, 205, 196, 0.3)'
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#4ecdc4',
                },
                '& .MuiFormHelperText-root': {
                  color: '#ff6b6b',
                  fontSize: '0.9rem'
                }
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{
              height: 70,
              borderRadius: '20px',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              fontSize: '1.3rem',
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 15px 35px rgba(255, 107, 107, 0.4)',
              mb: 4,
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
                transition: 'left 0.5s ease'
              },
              '&:hover': {
                background: 'linear-gradient(45deg, #ee5a52, #44a08d)',
                boxShadow: '0 20px 45px rgba(255, 107, 107, 0.5)',
                transform: 'translateY(-3px) scale(1.02)',
                '&::before': {
                  left: '100%'
                }
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                color: 'rgba(255,255,255,0.5)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={28} color="inherit" sx={{ mr: 2 }} />
                Signing In...
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoginOutlined sx={{ mr: 2, fontSize: 28 }} />
                Sign In
              </Box>
            )}
          </Button>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          textAlign: 'center', 
          pt: 4, 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 1
        }}>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: '#4ecdc4',
                textDecoration: 'none',
                fontWeight: 700,
                background: 'linear-gradient(45deg, #4ecdc4, #45b7d1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              Create Account
            </Link>
          </Typography>
        </Box>
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

export default Login;