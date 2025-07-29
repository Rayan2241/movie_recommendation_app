import React from "react";
import { Box, Typography, Button, Container, Grid, Card, CardContent, CardMedia, Chip } from "@mui/material";
import { TrendingUp, MovieFilter, Whatshot, Star, PlayArrow, LocalFireDepartment } from "@mui/icons-material";
import Slider from "react-slick";
import HomeMovieCard from "./HomeMovieCard";

const HomePage: React.FC = () => {
const heroMovies = [
{
id: 1,
title: "Inception",
release_date: "2010-07-16",
poster_path: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
backdrop_path: "https://image.tmdb.org/t/p/original/s3TBrRBwCHANdNTQiRtgPKek5RN.jpg",
overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
vote_average: 8.8,
genre: "Sci-Fi • Thriller",
runtime: "2h 28m"
},
{
id: 2,
title: "The Dark Knight",
release_date: "2008-07-18",
poster_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
backdrop_path: "https://image.tmdb.org/t/p/original/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
vote_average: 9.0,
genre: "Action • Crime • Drama",
runtime: "2h 32m"
},
{
id: 3,
title: "Interstellar",
release_date: "2014-11-07",
poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
backdrop_path: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
vote_average: 8.6,
genre: "Sci-Fi • Adventure • Drama",
runtime: "2h 49m"
}
];

const featuredMovies = [
{
id: 4,
title: "Dune",
release_date: "2021-10-22",
poster_path: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
vote_average: 8.0,
genre: "Sci-Fi"
},
{
id: 5,
title: "Spider-Man: No Way Home",
release_date: "2021-12-17",
poster_path: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
vote_average: 8.4,
genre: "Action"
},
{
id: 6,
title: "Top Gun: Maverick",
release_date: "2022-05-27",
poster_path: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
vote_average: 8.3,
genre: "Action"
},
{
id: 7,
title: "Avatar: The Way of Water",
release_date: "2022-12-16",
poster_path: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
vote_average: 7.6,
genre: "Sci-Fi"
},
{
id: 8,
title: "Black Panther: Wakanda Forever",
release_date: "2022-11-11",
poster_path: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
vote_average: 7.3,
genre: "Action"
},
{
id: 9,
title: "The Batman",
release_date: "2022-03-04",
poster_path: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
vote_average: 7.8,
genre: "Action"
}
];

const settings = {
dots: true,
infinite: true,
speed: 500,
slidesToShow: 3,
slidesToScroll: 3,
autoplay: true,
autoplaySpeed: 2000,
responsive: [
{
breakpoint: 1024,
settings: {
slidesToShow: 2,
slidesToScroll: 2,
}
},
{
breakpoint: 768,
settings: {
slidesToShow: 1,
slidesToScroll: 1,
}
}
]
};

const sliderSettings = {
dots: true,
infinite: true,
speed: 500,
slidesToShow: 4,
slidesToScroll: 2,
autoplay: true,
autoplaySpeed: 3000,
responsive: [
{
breakpoint: 1024,
settings: {
slidesToShow: 3,
slidesToScroll: 1,
}
},
{
breakpoint: 768,
settings: {
slidesToShow: 2,
slidesToScroll: 1,
}
}
]
};

return (
<Box sx={{ 
minHeight: '100vh',
background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 30%, #2d1b69 60%, #11998e 100%)',
position: 'relative',
overflow: 'hidden'
}}>
{/* Global styles for slick carousel */}
<Box
  component="style"
  dangerouslySetInnerHTML={{
    __html: `
      .slick-dots li button:before {
        color: white !important;
        font-size: 12px !important;
      }
      .slick-dots li.slick-active button:before {
        color: #ff6b6b !important;
      }
    `
  }}
/>

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

{/* Hero Section */}
<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: 8, pb: 6 }}>
<Box sx={{ textAlign: 'center', mb: 8 }}>
<Typography 
  variant="h1" 
  sx={{ 
    fontSize: { xs: '3rem', md: '5rem', lg: '7rem' },
    fontWeight: 900,
    mb: 3,
    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundSize: '300% 300%',
    animation: 'gradientShift 4s ease infinite',
    textShadow: '0 0 30px rgba(255, 107, 107, 0.5)',
    lineHeight: 1.1,
    letterSpacing: '-2px'
  }}
>
  MOVIEVERSE
</Typography>

<Typography 
  variant="h4" 
  sx={{ 
    color: 'rgba(255,255,255,0.9)',
    mb: 2,
    fontWeight: 300,
    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
  }}
>
  Welcome to the Ultimate Movie Experience
</Typography>

<Typography 
  variant="h6" 
  sx={{ 
    color: 'rgba(255,255,255,0.7)',
    mb: 6,
    maxWidth: '600px',
    mx: 'auto',
    lineHeight: 1.6
  }}
>
  Explore the best movies, trailers, and upcoming releases. Dive into a world of cinematic excellence.
</Typography>

{/* Stats */}
<Grid container spacing={4} sx={{ mb: 8 }}>
  <Grid item xs={12} md={4}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography 
        variant="h2" 
        sx={{ 
          fontWeight: 900,
          background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}
      >
        10M+
      </Typography>
      <Typography color="rgba(255,255,255,0.8)" variant="h6">
        Movies Available
      </Typography>
    </Box>
  </Grid>
  <Grid item xs={12} md={4}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography 
        variant="h2" 
        sx={{ 
          fontWeight: 900,
          background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}
      >
        5M+
      </Typography>
      <Typography color="rgba(255,255,255,0.8)" variant="h6">
        Active Users
      </Typography>
    </Box>
  </Grid>
  <Grid item xs={12} md={4}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography 
        variant="h2" 
        sx={{ 
          fontWeight: 900,
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}
      >
        99%
      </Typography>
      <Typography color="rgba(255,255,255,0.8)" variant="h6">
        Satisfaction Rate
      </Typography>
    </Box>
  </Grid>
</Grid>
</Box>
</Container>

{/* Features Section */}
<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 8 }}>
<Typography 
variant="h2" 
sx={{ 
  textAlign: 'center',
  fontWeight: 700,
  mb: 6,
  fontSize: { xs: '2.5rem', md: '4rem' },
  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundSize: '200% 200%',
  animation: 'gradientShift 3s ease infinite'
}}
>
Everything You Need
</Typography>

<Grid container spacing={4} sx={{ mb: 8 }}>
<Grid item xs={12} md={4}>
  <Card sx={{ 
    backgroundColor: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '25px',
    p: 4,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-15px) rotateX(5deg)',
      backgroundColor: 'rgba(255,107,107,0.1)',
      boxShadow: '0 25px 50px rgba(255,107,107,0.3)',
      '& .feature-icon': {
        transform: 'scale(1.2) rotate(10deg)',
        color: '#ff6b6b'
      }
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(255,107,107,0.1), transparent)',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    '&:hover::before': {
      opacity: 1
    }
  }}>
    <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <TrendingUp 
        className="feature-icon"
        sx={{ 
          fontSize: 80, 
          color: '#4fc3f7', 
          mb: 3,
          transition: 'all 0.3s ease',
          filter: 'drop-shadow(0 4px 8px rgba(79,195,247,0.3))'
        }} 
      />
      <Typography variant="h5" color="white" gutterBottom fontWeight="bold">
        Discover Trending
      </Typography>
      <Typography color="rgba(255,255,255,0.7)" lineHeight={1.6}>
        Stay updated with the latest movies, trending shows, and what's popular worldwide
      </Typography>
    </CardContent>
  </Card>
</Grid>

<Grid item xs={12} md={4}>
  <Card sx={{ 
    backgroundColor: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '25px',
    p: 4,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-15px) rotateX(5deg)',
      backgroundColor: 'rgba(78,205,196,0.1)',
      boxShadow: '0 25px 50px rgba(78,205,196,0.3)',
      '& .feature-icon': {
        transform: 'scale(1.2) rotate(10deg)',
        color: '#4ecdc4'
      }
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(78,205,196,0.1), transparent)',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    '&:hover::before': {
      opacity: 1
    }
  }}>
    <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <MovieFilter 
        className="feature-icon"
        sx={{ 
          fontSize: 80, 
          color: '#81c784', 
          mb: 3,
          transition: 'all 0.3s ease',
          filter: 'drop-shadow(0 4px 8px rgba(129,199,132,0.3))'
        }} 
      />
      <Typography variant="h5" color="white" gutterBottom fontWeight="bold">
        Smart Search
      </Typography>
      <Typography color="rgba(255,255,255,0.7)" lineHeight={1.6}>
        Advanced filters by genre, year, rating, cast, and more to find exactly what you want
      </Typography>
    </CardContent>
  </Card>
</Grid>

<Grid item xs={12} md={4}>
  <Card sx={{ 
    backgroundColor: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '25px',
    p: 4,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-15px) rotateX(5deg)',
      backgroundColor: 'rgba(255,112,67,0.1)',
      boxShadow: '0 25px 50px rgba(255,112,67,0.3)',
      '& .feature-icon': {
        transform: 'scale(1.2) rotate(10deg)',
        color: '#ff7043'
      }
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(255,112,67,0.1), transparent)',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    '&:hover::before': {
      opacity: 1
    }
  }}>
    <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <Whatshot 
        className="feature-icon"
        sx={{ 
          fontSize: 80, 
          color: '#ff7043', 
          mb: 3,
          transition: 'all 0.3s ease',
          filter: 'drop-shadow(0 4px 8px rgba(255,112,67,0.3))'
        }} 
      />
      <Typography variant="h5" color="white" gutterBottom fontWeight="bold">
        Personal Recommendations
      </Typography>
      <Typography color="rgba(255,255,255,0.7)" lineHeight={1.6}>
        Get personalized suggestions based on your viewing history and preferences
      </Typography>
    </CardContent>
  </Card>
</Grid>
</Grid>
</Container>

{/* Featured Movies Carousel */}
<Box sx={{ py: 8, position: 'relative', zIndex: 2 }}>
<Container maxWidth="lg">
<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6 }}>
  <LocalFireDepartment sx={{ fontSize: 50, color: '#ff6b6b', mr: 2, animation: 'pulse 2s infinite' }} />
  <Typography 
    variant="h3" 
    sx={{ 
      fontWeight: 700,
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 3s ease infinite'
    }}
  >
    Hot Right Now
  </Typography>
</Box>

<Box sx={{ '& .slick-dots': { bottom: '-50px' } }}>
  <Slider {...sliderSettings}>
    {featuredMovies.map((movie) => (
      <Box key={movie.id} sx={{ px: 1 }}>
        <Card sx={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-10px) scale(1.02)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            backgroundColor: 'rgba(255,255,255,0.08)'
          }
        }}>
          <CardMedia
            component="img"
            height="350"
            image={movie.poster_path}
            alt={movie.title}
            sx={{ 
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          <CardContent>
            <Typography 
              variant="h6" 
              color="white" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {movie.title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip 
                label={movie.genre} 
                size="small" 
                sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
              />
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                ⭐ {movie.vote_average}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    ))}
  </Slider>
</Box>
</Container>
</Box>

{/* CTA Section */}
<Box sx={{ 
py: 10, 
textAlign: 'center',
position: 'relative',
zIndex: 2,
background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(78, 205, 196, 0.15) 100%)',
backdropFilter: 'blur(10px)'
}}>
<Container maxWidth="md">
<Typography 
  variant="h2" 
  sx={{ 
    fontWeight: 900,
    mb: 4,
    fontSize: { xs: '2.5rem', md: '4rem' },
    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #667eea)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundSize: '300% 300%',
    animation: 'gradientShift 4s ease infinite'
  }}
>
  Ready to Dive In?
</Typography>
<Typography 
  variant="h5" 
  sx={{ 
    color: 'rgba(255,255,255,0.8)',
    mb: 6,
    lineHeight: 1.6
  }}
>
  Join millions of movie lovers and discover your next favorite film
</Typography>

<Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
  <Button
    variant="contained"
    size="large"
    href="/login"
    startIcon={<PlayArrow />}
    sx={{
      px: 8,
      py: 3,
      fontSize: '1.3rem',
      fontWeight: 700,
      background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
      borderRadius: '50px',
      textTransform: 'none',
      boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
      border: '2px solid transparent',
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
        background: 'linear-gradient(45deg, #ee5a52, #ff6b6b)',
        transform: 'translateY(-5px) scale(1.05)',
        boxShadow: '0 15px 40px rgba(255, 107, 107, 0.5)',
        '&::before': {
          left: '100%'
        }
      },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}
  >
    Login
  </Button>
  
  <Button
    variant="outlined"
    size="large"
    href="/register"
    sx={{
      px: 8,
      py: 3,
      fontSize: '1.3rem',
      fontWeight: 700,
      borderColor: 'rgba(255,255,255,0.5)',
      color: 'white',
      borderRadius: '50px',
      textTransform: 'none',
      borderWidth: '2px',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(78,205,196,0.1), rgba(102,126,234,0.1))',
        opacity: 0,
        transition: 'opacity 0.3s ease'
      },
      '&:hover': {
        borderColor: 'white',
        transform: 'translateY(-5px) scale(1.05)',
        boxShadow: '0 15px 40px rgba(255,255,255,0.2)',
        '&::before': {
          opacity: 1
        }
      },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}
  >
    Sign Up
  </Button>
</Box>
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

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
`}
</style>
</Box>
);
};

export default HomePage;