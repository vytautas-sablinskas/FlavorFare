
import React, { useState, useEffect } from 'react';
import { getRestaurants } from '../../services/RestaurantService';
import { InputBase, Paper, Card, CardContent, Rating, CardMedia, Typography, Button, Box, Grid, Container, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import LoadingSpinner from '../Shared/LoadingSpinner';

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
    setTimeout(() => {
      setLoading(false);
    }, 250);
  };

  const renderRestaurantsCards = (restaurants) => {
    const formatTime = (timeString) => {
      const [hh, mm, ss] = timeString.split(":");
      return `${hh}:${mm}`;
    };

    const justifyContentValue = (restaurants.length <= 2) ? 'center' : 'flex-start';

    return (
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent={justifyContentValue} alignItems={isSmallScreen ? "center" : "flex-start"}>
              {restaurants.map(restaurant => (
                  <Grid item xs={12} sm={4} key={restaurant.id}>
                      <Card sx={{ margin: '0 auto', height: '100%', width: '100%', border: `1px solid ${grey[300]}`  }}>
                          <CardMedia
                              component="img"
                              height="140"
                              image={restaurant.randomImage}
                              alt="Restaurant Image"
                          />
                          <CardContent style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              <Box display="flex" alignItems="center" mb={1}>
                                  <Typography variant="subtitle2" color="primary" component="div" noWrap>
                                      {restaurant.name}
                                  </Typography>
                              </Box>
                              <Box mb={1}>
                                  <Typography variant="h6" component="div" noWrap>
                                      {restaurant.address}
                                  </Typography>
                              </Box>
                              <Box mb={1}>
                                  <Typography variant="body2" noWrap>
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
            loading ? 
            <LoadingSpinner />
             : 
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
            }}>
                <Typography 
                    variant="h2" 
                    id="tableLabel" 
                    gutterBottom 
                    textAlign="center"
                    sx={{ marginTop: '4rem' }}
                >
                <p style={{margin: 0, fontFamily: 'Alegreya, sans-serif'}}>Book Restaurants</p>
                </Typography>
                <Grid container justifyContent="center" alignItems="center" spacing={2}>
                    <Grid item xs={12} md={4} style={{ display: 'flex' }}>
                        <Paper 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '8px 8px', 
                                margin: '16px',
                                flex: 1,
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
                {renderRestaurantsCards(filteredRestaurants(), isSmallScreen)}
            </div>
        );        
}

export default Restaurants;