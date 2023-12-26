import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Paper, Typography, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid, Box, Hidden
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getRestaurants, addRestaurant, updateRestaurant, removeRestaurant } from '../../services/RestaurantService';
import { checkTokenValidity } from '../../utils/jwtUtils';
import { refreshAccessToken } from '../../services/AuthenticationService';
import { useUser } from '../Contexts/UserContext';
import SnackbarContext from '../Contexts/SnackbarContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../Shared/LoadingSpinner';

const timeToHHMM = (isoTime) => {
    if (!isoTime) return "00:00";
    return isoTime.substr(0, 5);
};

const timeDifference = (start, end) => {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  return ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
};

const AddRestaurantDialog = ({ open, onClose, onAdd }) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [openingTime, setOpeningTime] = useState("");
    const [closingTime, setClosingTime] = useState("");
    const [intervalBetweenBookings, setIntervalBetweenBookings] = useState("");
    const [errors, setErrors] = useState({});
    const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();
    const openSnackbar = useContext(SnackbarContext);

    const validate = () => {
        const newErrors = {};
        if (closingTime <= openingTime) {
            newErrors.time = "Closing time must be greater than opening time";
        }
        
        const diff = timeDifference(openingTime, closingTime);
        const interval = parseFloat(intervalBetweenBookings.split(":")[0]) + parseFloat(intervalBetweenBookings.split(":")[1]) / 60;
        
        if (interval > diff) {
            newErrors.interval = `Interval should not be greater than difference between end and start time`;
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
          const accessToken = localStorage.getItem('accessToken');
          if (!checkTokenValidity(accessToken)) {
            const result = await refreshAccessToken();
            if (!result.success) {
                openSnackbar('Login to page!', 'error');
                changeUserInformationToLoggedOut();
                navigation('/login');
                return;
            }

            changeUserInformationToLoggedIn(result.data.accessToken, result.data.refreshToken);
        }

        const restaurantToAdd = {
          name,
          address,
          openingTime: openingTime + ":00",
          closingTime: closingTime + ":00",
          intervalBetweenBookings: intervalBetweenBookings + ":00",
        };

        const response = await addRestaurant(restaurantToAdd);

        if (response.status === 201) {
          openSnackbar("Restaurant was created", "success");
          onAdd(restaurantToAdd);
        } else {
          openSnackbar("Restaurant was not created. Try again later!", "error");
        }

        onClose();
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add New Restaurant</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Address" fullWidth margin="normal" value={address} onChange={e => setAddress(e.target.value)} />
          <TextField 
            error={errors.time}
            helperText={errors.time}
            label="Opening Time" 
            type="time" 
            fullWidth 
            margin="normal"
            value={openingTime} 
            onChange={e => setOpeningTime(e.target.value)} 
            InputLabelProps={{ shrink: true }} 
          />
          <TextField 
            error={errors.time}
            helperText={errors.time}
            label="Closing Time" 
            type="time" 
            fullWidth 
            margin="normal"
            value={closingTime} 
            onChange={e => setClosingTime(e.target.value)} 
            InputLabelProps={{ shrink: true }} 
          />
          <TextField 
            error={errors.interval}
            helperText={errors.interval}
            label="Interval Between Bookings" 
            type="time" 
            fullWidth 
            margin="normal"
            value={intervalBetweenBookings} 
            onChange={e => setIntervalBetweenBookings(e.target.value)} 
            InputLabelProps={{ shrink: true }} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const RemoveRestaurantDialog = ({ open, onClose, onRemove }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Do you really want to remove this restaurant?</DialogTitle>
            <DialogActions style={{ justifyContent: 'center' }}>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={onRemove} color="primary">Remove Restaurant</Button>
            </DialogActions>
        </Dialog>
    );
  };
  
  const UpdateRestaurantDialog = ({ open, onClose, onUpdate, restaurant }) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [openingTime, setOpeningTime] = useState("");
    const [closingTime, setClosingTime] = useState("");
    const [intervalBetweenBookings, setIntervalBetweenBookings] = useState("");
    const [errors, setErrors] = useState({});
    const navigation = useNavigate();
    const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();
    const openSnackbar = useContext(SnackbarContext);
  
    useEffect(() => {
      if (restaurant) {
        setName(restaurant.name);
        setAddress(restaurant.address);
        setOpeningTime(timeToHHMM(restaurant.openingTime));
        setClosingTime(timeToHHMM(restaurant.closingTime));
        setIntervalBetweenBookings(restaurant.intervalBetweenBookings);
      }
    }, [restaurant]);
  
    const validate = () => {
      const newErrors = {};
      if (closingTime <= openingTime) {
          newErrors.time = "Closing time must be greater than opening time";
      }
      
      const diff = timeDifference(openingTime, closingTime);
      const interval = parseFloat(intervalBetweenBookings.split(":")[0]) + parseFloat(intervalBetweenBookings.split(":")[1]) / 60;
      
      if (interval > diff) {
          newErrors.interval = `Interval should not be greater than difference between end and start time`;
      }

      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async () => {
      if (validate()) {
        const accessToken = localStorage.getItem('accessToken');
        if (!checkTokenValidity(accessToken)) {
          const result = await refreshAccessToken();
          if (!result.success) {
              openSnackbar('Login to page!', 'error');
              changeUserInformationToLoggedOut();
              navigation('/login');
              return;
          }

          changeUserInformationToLoggedIn(result.data.accessToken, result.data.refreshToken);
        };

        const restaurantToUpdate = {
          name,
          address,
          openingTime: openingTime + ":00",
          closingTime: closingTime + ":00",
          intervalBetweenBookings: intervalBetweenBookings + ":00",
        };

        const response = await updateRestaurant(restaurant.id, restaurantToUpdate);
          
        if (response.status === 200) {
          openSnackbar("Restaurant was updated", "success");
  
          onUpdate({
            ...restaurant,
            name,
            address,
            openingTime,
            closingTime,
            intervalBetweenBookings,
          });
        } else {
          openSnackbar("Restaurant was not updated. Try again later!", "error");
        }

        onClose();
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
          <DialogTitle>Update Restaurant</DialogTitle>
          <DialogContent>
            <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
            <TextField label="Address" fullWidth margin="normal" value={address} onChange={e => setAddress(e.target.value)} />
            <TextField 
              error={errors.time}
              helperText={errors.time}
              label="Opening Time" 
              type="time" 
              fullWidth 
              margin="normal"
              value={openingTime} 
              onChange={e => setOpeningTime(e.target.value)} 
              InputLabelProps={{ shrink: true }} 
            />
            <TextField 
              error={errors.time}
              helperText={errors.time}
              label="Closing Time" 
              type="time" 
              fullWidth 
              margin="normal"
              value={closingTime} 
              onChange={e => setClosingTime(e.target.value)} 
              InputLabelProps={{ shrink: true }} 
            />
            <TextField 
              error={errors.interval}
              helperText={errors.interval}
              label="Interval Between Bookings" 
              type="time" 
              fullWidth 
              margin="normal"
              value={intervalBetweenBookings} 
              onChange={e => setIntervalBetweenBookings(e.target.value)} 
              InputLabelProps={{ shrink: true }} 
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleUpdate} color="primary">Update</Button>
          </DialogActions>
        </Dialog>
    );
  };

function AdminRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [currentRestaurant, setCurrentRestaurant] = useState(null);
    const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
    const [restaurantToRemove, setRestaurantToRemove] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const navigation = useNavigate();

    useEffect(() => {
    }, [openUpdateDialog]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleOpenRemoveDialog = (restaurantId) => {
        setRestaurantToRemove(restaurantId);
        setOpenRemoveDialog(true);
    };

    const handleRemoveConfirmed = () => {
        handleRemoveRestaurant(restaurantToRemove);
        setOpenRemoveDialog(false);
        setRestaurantToRemove(null);
    };

    const handleAddRestaurant = async (restaurant) => {
        setRestaurants(prevRestaurants => [...prevRestaurants, restaurant]);

        setOpenAddDialog(false);
    };

    const handleUpdateRestaurant = async (updatedRestaurant) => {
        setRestaurants(prevRestaurants => 
          prevRestaurants.map(rest => 
            rest.id === updatedRestaurant.id ? updatedRestaurant : rest
          )
        );

        setOpenUpdateDialog(false);
    };

    const handleRemoveRestaurant = async (restaurantId) => {
        setRestaurants(prevRestaurants => prevRestaurants.filter(restaurant => restaurant.id !== restaurantId));
        await removeRestaurant(restaurantId);
    };    
    
    const filteredRestaurants = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    useEffect(() => {
      async function fetchData() {
        setLoading(true);

        const actualRestaurants = await getRestaurants();
        setRestaurants(actualRestaurants);
    
        setLoading(false);
      }
    
      fetchData();
    }, []);

    return (
      isLoading ? 
      <LoadingSpinner /> : 
      <Grid container spacing={3} style={{maxWidth: '85%', margin: '0 auto', padding: '0', display: "flex", justifyContent: "center" }}>
        <Grid>
        <Typography variant="h5" style={{ marginBottom: '1rem', textAlign: 'center', marginTop: '2rem' }}>Manage Restaurants</Typography>
          <Box display="flex" justifyContent="flex-end" alignItems="center" marginBottom={2}>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setOpenAddDialog(true)}
                startIcon={<AddIcon />}
            >
                Add Restaurant
            </Button>
          </Box>
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: '1rem' }}
          />
          <TableContainer component={Paper} style={{padding: "0"}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Opening Time</TableCell>
                  <TableCell>Closing Time</TableCell>
                  <TableCell>Interval Between Bookings</TableCell>
                  <TableCell align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRestaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell>{restaurant.name}</TableCell>
                    <TableCell>{restaurant.address}</TableCell>
                    <Hidden xsDown>
                      <TableCell>{timeToHHMM(restaurant.openingTime)}</TableCell>
                      <TableCell>{timeToHHMM(restaurant.closingTime)}</TableCell>
                    </Hidden>

                    <Hidden smDown>
                      <TableCell>{timeToHHMM(restaurant.intervalBetweenBookings)}</TableCell>
                    </Hidden>
                    <TableCell align='center'>
                      <Button startIcon={<EditIcon />} onClick={() => { setCurrentRestaurant(restaurant); setOpenUpdateDialog(true); }}>Edit</Button>
                      <Button startIcon={<DeleteIcon />} onClick={() => handleOpenRemoveDialog(restaurant.id)}>Delete</Button>
                      <Button startIcon={<EditIcon />} onClick={() => { navigation(`/admin/restaurants/${restaurant.id}/tables`) }}>Manage Tables</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
  
        <AddRestaurantDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onAdd={handleAddRestaurant}
        />
  
        <UpdateRestaurantDialog
          open={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          onUpdate={handleUpdateRestaurant}
          restaurant={currentRestaurant}
        />

        <RemoveRestaurantDialog 
            open={openRemoveDialog} 
            onClose={() => setOpenRemoveDialog(false)} 
            onRemove={handleRemoveConfirmed}
        />
      </Grid>
    );
  }

  export default AdminRestaurants;