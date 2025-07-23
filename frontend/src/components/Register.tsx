"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
            email: "Email address already exists",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            general: errorMessage,
          }));
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Create your account
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary">
            Or{" "}
            <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
              sign in to your existing account
            </Link>
          </Typography>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <Box sx={{ bgcolor: "error.main", color: "white", padding: 2, borderRadius: 1 }}>
              <Typography variant="body2">{errors.general}</Typography>
            </Box>
          )}

          <Box sx={{ borderBottom: 1, borderColor: "divider", pb: 4 }}>
            <Typography variant="h6" color="textPrimary">
              Account Information
            </Typography>
            <div>
              <TextField
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={Boolean(errors.name)}
                helperText={errors.name}
                margin="normal"
              />
              <TextField
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={Boolean(errors.email)}
                helperText={errors.email}
                margin="normal"
              />
            </div>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider", pb: 4 }}>
            <Typography variant="h6" color="textPrimary">
              Password Setup
            </Typography>
            <div>
              <TextField
                label="Password"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={Boolean(errors.password)}
                helperText={errors.password}
                margin="normal"
              />
              <TextField
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                margin="normal"
              />
            </div>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? (
              <div className="flex items-center">
                <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                Creating account...
              </div>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
