
import React, { useState, useEffect } from 'react';
import { getRestaurants } from '../../services/RestaurantService';
import { InputBase, Paper, Card, CardContent, Rating, CardMedia, Typography, Button, Box, Grid, Container, useTheme, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    populateRestaurantData();
  }, []);

  const populateRestaurantData = async () => {
    function getRandomImage () {
        const randomNum = Math.floor(Math.random() * 5) + 1;
        return `assets/Restaurants/${randomNum}.jpg`;
    };

    function getBiasedRandomRating() {
        if (Math.random() < 0.8) {
            return parseFloat((Math.random() + 4).toFixed(2));
        } else {
            return parseFloat((Math.random() * 2 + 1).toFixed(2));
        }
    }

    const data = await getRestaurants();
    const enhancedData = data.map(restaurant => ({
        ...restaurant,
        randomImage: getRandomImage(),
        randomRating: getBiasedRandomRating(),
    }));
    
    setRestaurants(enhancedData);
    setLoading(false);
  };

  const renderRestaurantsCards = (restaurants) => {
    const formatTime = (isoTime) => {
        const date = new Date(isoTime);
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    };

    const justifyContentValue = (restaurants.length <= 2) ? 'center' : 'flex-start';

    return (
        <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent={justifyContentValue} alignItems={isSmallScreen ? "center" : "flex-start"}>
                {restaurants.map(restaurant => (
                    <Grid item xs={12} sm={4} key={restaurant.id}>
                        <Card sx={{ maxWidth: 345, margin: '0 auto' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={restaurant.randomImage}
                                alt="Restaurant Image"
                            />
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" color="primary" component="div">
                                        {restaurant.name}
                                    </Typography>
                                </Box>
                                <Box mb={1}>
                                    <Typography variant="h6" component="div">
                                        {restaurant.address}
                                    </Typography>
                                </Box>
                                <Box mb={1}>
                                    <Typography variant="body2">
                                        Open from {formatTime(restaurant.openingTime)} to {formatTime(restaurant.closingTime)}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <Typography variant="body2">
                                        <Rating name="read-only" precision={0.1} value={restaurant.randomRating} readOnly />
                                    </Typography>
                                </Box>
                                <Box>
                                <Link to={`restaurant/${restaurant.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                                    <Button variant="contained" color="primary" style={{ width: '100%', height: '100%' }}>
                                        Check out
                                    </Button>
                                </Link>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )};
  

  const onSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredRestaurants = () => {
        if (!search) return restaurants;
        return restaurants.filter(restaurant => 
            restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
            restaurant.address.toLowerCase().includes(search.toLowerCase())
        );
    };

  return (
    <div>
      <Typography 
        variant="h2" 
        id="tableLabel" 
        gutterBottom 
        textAlign="center"
        sx={{ marginTop: '4rem' }}
      >
        Discover & Book the Best Restaurants in Town
      </Typography>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '8px 8px', 
              margin: '16px',
              maxWidth: '95%'
            }}
          >
            <SearchIcon />
            <InputBase
              placeholder="Search by name or address..."
              onChange={onSearchChange}
              fullWidth
            />
          </Paper>
        </Grid>
      </Grid>
      {loading 
        ? <Typography variant="h2" textAlign="center"><em>Loading...</em></Typography> 
        : renderRestaurantsCards(filteredRestaurants(), isSmallScreen)}
    </div>
  );
}

export default Restaurants;