"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Person,
  PersonAdd,
} from "@mui/icons-material";
import { ERROR_MESSAGES } from "../Constants/messages";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = ERROR_MESSAGES.NAME_REQUIRED;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = ERROR_MESSAGES.NAME_TOO_SHORT;
    }

    if (!formData.email) {
      newErrors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ERROR_MESSAGES.EMAIL_INVALID;
    }

    if (!formData.password) {
      newErrors.password = ERROR_MESSAGES.PASSWORD_REQUIRED;
    } else if (formData.password.length < 6) {
      newErrors.password = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.PASSWORD_MISMATCH;
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
    if (!validateForm()) {
      return;
    }
    try {
      await register(formData.name.trim(), formData.email, formData.password);
    } catch (err: any) {
      if (err?.response?.data?.message) {
        const errorMessage = err.response.data.message;
        if (errorMessage === "Email address already exists") {
          setErrors((prev) => ({
            ...prev,
            email: ERROR_MESSAGES.EMAIL_EXISTS,
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            general: errorMessage || ERROR_MESSAGES.GENERAL_ERROR,
          }));
        }
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
      }}
    >
      {/* Decorative Elements */}
      <div 
        style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: '180px',
          height: '180px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '220px',
          height: '220px',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          animation: 'float 4s ease-in-out infinite reverse',
        }}
      />

      <Box
        sx={{
          maxWidth: 500,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              mb: 3,
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            }}
          >
            <PersonAdd sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Create Account
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join us and start your journey today
          </Typography>
        </Box>

        {/* Auth Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              '& .MuiAlert-message': {
                fontWeight: 500,
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* General Error Alert */}
        {errors.general && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              '& .MuiAlert-message': {
                fontWeight: 500,
              }
            }}
          >
            {errors.general}
          </Alert>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit}>
          {/* Account Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                color: '#667eea',
                fontWeight: 600,
              }}
            >
              Account Information
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={Boolean(errors.name)}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
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
                      <Email sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Password Section */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                color: '#667eea',
                fontWeight: 600,
              }}
            >
              Password Setup
            </Typography>
            
            <Box sx={{ mb: 3 }}>
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
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  },
                }}
              />
            </Box>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              mb: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                Creating Account...
              </Box>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  );
};

export default Register;