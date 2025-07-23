import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Slider from "react-slick";
import HomeMovieCard from "./HomeMovieCard";

const HomePage: React.FC = () => {
  const featuredMovies = [
    {
      id: 1,
      title: "Inception",
      release_date: "2010-07-16",
      poster_path:
        "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
    },
    {
      id: 2,
      title: "The Dark Knight",
      release_date: "2008-07-18",
      poster_path:
        "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQkUywIUXDjHSQJIaNHYVs08osgBpF5Ot-xmB_omyEZeeRP9Xug",
    },
    {
      id: 3,
      title: "The Matrix",
      release_date: "1999-03-31",
      poster_path:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5DoFtShSmClflZ0RzBj9JBMweU5IUVBCeEbbLeV2XPlCnTKNi",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #000000, #434343)",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" color="white" gutterBottom>
        Welcome to the Movie Hub
      </Typography>
      <Typography variant="h6" color="white" paragraph>
        Explore the best movies, trailers, and upcoming releases.
      </Typography>

      <Typography variant="h5" color="white" gutterBottom>
        Featured Movies
      </Typography>

      <Slider {...settings}>
        {featuredMovies.map((movie) => (
          <div key={movie.id}>
            <HomeMovieCard movie={movie} onClick={() => {}} />
          </div>
        ))}
      </Slider>

      <Box sx={{ marginTop: "30px" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ margin: "10px" }}
          href="/login"
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ margin: "10px" }}
          href="/register"
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
