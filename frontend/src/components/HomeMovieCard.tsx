import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    release_date: string;
    poster_path: string;
  };
  onClick: (movieId: number) => void;
}

const HomeMovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const posterUrl = movie.poster_path
    ? movie.poster_path
    : "https://via.placeholder.com/500x750?text=No+Image+Available";

  return (
    <Card
      sx={{
        maxWidth: 345,
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
      onClick={() => onClick(movie.id)}
    >
      <CardMedia
        component="img"
        height="240"
        image={posterUrl}
        alt={movie.title}
        sx={{ borderRadius: "8px" }}
      />
      <CardContent>
        <Typography variant="h6" noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {movie.release_date}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default HomeMovieCard;
