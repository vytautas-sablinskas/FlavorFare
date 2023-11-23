import React, { useState, useEffect } from 'react';
import {
  Button, Paper, Typography, Table, Select, MenuItem, FormControl, InputLabel,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid, Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getRestaurants, addRestaurant, updateRestaurant, removeRestaurant } from '../../services/RestaurantService';

const timeToHHMM = (isoTime) => {
    if (!isoTime) return "00:00";
    return isoTime.substr(11, 5);
};

const hhmmToISO = (time) => {
    return `1970-01-01T${time}:00`;
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

    const validate = () => {
        const newErrors = {};

        if (closingTime <= openingTime) {
            newErrors.time = "Closing time must be greater than opening time";
        }
        
        const diff = timeDifference(openingTime, closingTime);
        const interval = parseFloat(intervalBetweenBookings.split(":")[0]) + parseFloat(intervalBetweenBookings.split(":")[1]) / 60;
        
        if (interval > diff) {
            newErrors.interval = `Interval should be less than or equal to ${diff} hours`;
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
      if (validate()) {
        onAdd({
          id: Date.now(),
          name,
          address,
          openingTime: hhmmToISO(openingTime),
          closingTime: hhmmToISO(closingTime)
        });
        setName("");
        setAddress("");
        setOpeningTime("");
        setClosingTime("");
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
            error={!!errors.time}
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
            error={!!errors.time}
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
            error={!!errors.time}
            helperText={errors.time}
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
    const [name, setName] = useState(restaurant?.name || "");
    const [address, setAddress] = useState(restaurant?.address || "");
    const [openingTime, setOpeningTime] = useState(timeToHHMM(restaurant?.openingTime) || "");
    const [closingTime, setClosingTime] = useState(timeToHHMM(restaurant?.closingTime) || "");
    const [intervalBetweenBookings, setIntervalBetweenBookings] = useState("");
  
    useEffect(() => {
      if (restaurant) {
        setName(restaurant.name);
        setAddress(restaurant.address);
        setOpeningTime(timeToHHMM(restaurant.openingTime));
        setClosingTime(timeToHHMM(restaurant.closingTime));
        setIntervalBetweenBookings(timeToHHMM(restaurant.intervalBetweenBookings));
      }
    }, [restaurant]);
  
    const handleSubmit = () => {
      onUpdate({
        ...restaurant,
        name,
        address,
        openingTime: hhmmToISO(openingTime),
        closingTime: hhmmToISO(closingTime),
        intervalBetweenBookings: hhmmToISO(intervalBetweenBookings),
      });
      onClose();
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Update Restaurant</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Address" fullWidth margin="normal" value={address} onChange={e => setAddress(e.target.value)} />
          <TextField 
            label="Opening Time" 
            type="time" 
            fullWidth 
            margin="normal"
            value={openingTime} 
            onChange={e => setOpeningTime(e.target.value)} 
            InputLabelProps={{ shrink: true }} 
          />
          <TextField 
            label="Closing Time" 
            type="time" 
            fullWidth 
            margin="normal"
            value={closingTime} 
            onChange={e => setClosingTime(e.target.value)} 
            InputLabelProps={{ shrink: true }} 
          />
          <TextField 
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
          <Button onClick={handleSubmit} color="primary">Update</Button>
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
        const response = await addRestaurant(restaurant);
        const text = await response.text();
        console.log(text);
        setOpenAddDialog(false);
    };

    const handleUpdateRestaurant = async (updatedRestaurant) => {
        setRestaurants(prevRestaurants => 
          prevRestaurants.map(rest => 
            rest.id === updatedRestaurant.id ? updatedRestaurant : rest
          )
        );

        await updateRestaurant(updatedRestaurant.id, updatedRestaurant);
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
          const actualRestaurants = await getRestaurants();
          setRestaurants(actualRestaurants);
        }

        fetchData();
    }, []);

    return (
        <Grid container spacing={3} style={{ maxWidth: '85%', margin: '0 auto' }}>
        <Grid item xs={12}>
          <Typography variant="h5" style={{ marginBottom: '1rem', textAlign: 'center' }}>Manage Restaurants</Typography>
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
          
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
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
                    <TableCell>{timeToHHMM(restaurant.openingTime)}</TableCell>
                    <TableCell>{timeToHHMM(restaurant.closingTime)}</TableCell>
                    <TableCell>{timeToHHMM(restaurant.intervalBetweenBookings)}</TableCell>
                    <TableCell align='center'>
                      <Button startIcon={<EditIcon />} onClick={() => { setCurrentRestaurant(restaurant); setOpenUpdateDialog(true); }}>Edit</Button>
                      <Button startIcon={<DeleteIcon />} onClick={() => handleOpenRemoveDialog(restaurant.id)}>Delete</Button>
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