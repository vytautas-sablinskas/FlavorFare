import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, CircularProgress, Paper, Select, MenuItem, FormControl, TextField, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { getTables } from '../../services/TableService';
import { addReservation, getReservations } from '../../services/ReservationService';
import { getRestaurantById } from '../../services/RestaurantService';
import { decodeJWT } from '../../utils/jwtUtils';
import { refreshAccessToken } from '../../services/AuthenticationService';
import SnackbarContext from '../Contexts/SnackbarContext';
import { useUser } from '../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

function Tables(props) {   
    const [loading, setLoading] = useState(true);
    const [charCount, setCharCount] = useState(0);

    const formatDate = (date) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
    }
    
    const navigation = useNavigate();
    const { isAuthenticated, changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();
    const openSnackbar = useContext(SnackbarContext);
    const restaurantId = props.restaurantId;

    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    const minDate = formatDate(today);
    const maxDate = formatDate(threeDaysFromNow);

    const [state, setState] = useState({
        tables: [],
        reservations: [],
        reservationDate: minDate,
        checkTime: 10,
        availableSlots: {},
        availableTimes: [],
        startTime: 1,
        endTime: 10,
        interval: 1,
        selectedTime: 10,
        isAuthenticated: false,
        restaurantName: '',
        extraInformation: ''
    });

    const tryFetchingRestaurantTables = async (restaurantId) => {
        const data = await getTables(restaurantId);
        setState(prevState => ({ ...prevState, tables: data }));
    }

    const tryFetchingRestaurant = async (restaurantId) => {
        const data = await getRestaurantById(restaurantId);
        
        const isoTimeToDecimal = (isoTime) => {
            const timeParts = isoTime.split('T')[1].split(':');
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
            const decimalTime = hours + (minutes / 60);
            return parseFloat(decimalTime.toFixed(1));
        };        
        
        const startTime = isoTimeToDecimal(data.openingTime);
        const endTime = isoTimeToDecimal(data.closingTime);
        const interval = isoTimeToDecimal(data.intervalBetweenBookings);

        setState(prevState => ( {
            ...prevState,
            startTime,
            endTime,
            interval,
            restaurantName: data.name
        }));
    }

    const tryFetchingRestaurantReservations = async () => {
        const data = await getReservations(state.reservationDate, restaurantId);
        setState(prevState => ({ ...prevState, reservations: data }));
    }

    const decimalTimeToMinutes = (decimal_time) => {
        const hours = Math.floor(decimal_time);
        const minutes = Math.round((decimal_time - hours) * 60);
        return hours * 60 + minutes;
    };

    const formatTimeInMinutes = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remaining_minutes = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(remaining_minutes).padStart(2, '0')}`;
    }; 

    const formatTimeInDecimalHours = (decimalHours) => {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    const handleExtraInfoChange = (e) => {
        setState(prevState => ({
            ...prevState,
            extraInformation: e.target.value
        }));
    };

    const calculateAvailableSlots = () => {
        const startTime = state.startTime;
        const endTime = state.endTime;
        const interval = state.interval;

        const startTimeMinutes = decimalTimeToMinutes(startTime);
        const endTimeMinutes = decimalTimeToMinutes(endTime);
        const intervalMinutes = interval * 60;
        
        const availableSlots = {};
        
        for (let timeMinutes = startTimeMinutes; (timeMinutes + (interval * 60)) <= endTimeMinutes; timeMinutes += intervalMinutes) {
            const startDateTimeISO = formatToISODateTime(state.reservationDate, timeMinutes / 60);
            const endDateTimeISO = formatToISODateTime(state.reservationDate, (timeMinutes + intervalMinutes) / 60);
            const timeSlot = `${startDateTimeISO} - ${endDateTimeISO}`;
            availableSlots[timeSlot] = checkAvailabilityForTime(startDateTimeISO);
        }

        const convertISOToSimpleTimeRange = (isoTimeRange) => {
            const [startISO, endISO] = isoTimeRange.split(' - ');
            const startSimpleTime = startISO.slice(11, 16);
            const endSimpleTime = endISO.slice(11, 16);
            return `${startSimpleTime} - ${endSimpleTime}`;
        }        

        setState(prevState => ({ ...prevState, availableSlots }));
        const formattedAvailableTimes = Object.keys(availableSlots).map(timeRange => convertISOToSimpleTimeRange(timeRange));
        if (formattedAvailableTimes.length > 0) {
            setState(prevState => ({ 
                ...prevState,
                availableSlots,
                availableTimes: formattedAvailableTimes, 
                selectedTime: formattedAvailableTimes[0]
            }));
        } 
    }

    const checkAvailabilityForTime = (startTime, endTime) => {
        const { tables, reservations } = state;
        
        const uniqueSizes = [...new Set(tables.map(table => table.size))].sort((a, b) => a - b);
        
        const availableTables = {};
        
        uniqueSizes.forEach(size => {
            availableTables[size] = tables.filter(table => 
                table.size === size && 
                !reservations.some(reservation => 
                    !(reservation.endTime <= startTime || reservation.startTime >= endTime) &&
                    reservation.tableId === table.id
                )
            ).length;
        });
        
        return availableTables;
    }
    


    const formatToISODateTime = (date, decimalHours) => {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        return `${date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    }
     

    const handleTimeChange = (event) => {
        setState(prevState => ({ ...prevState, selectedTime: event.target.value }));
    }

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setState(prevState => ({
            ...prevState,
            reservationDate: selectedDate
        }));
    };    

    function checkTokenValidity(token) {
        const payload = decodeJWT(token);
        if (!payload) return false;
    
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return payload.exp > currentTimestamp;
    }    

    const handleCharCount = (e) => {
        const value = e.target.value;
        setCharCount(value.length);

        handleExtraInfoChange(e);
    };

    const handleBooking = async (size) => {
        const tableSize = Number(size);
        const [desiredStartTimeSimple, desiredEndTimeSimple] = state.selectedTime.split(' - ');
        const desiredDate = state.reservationDate;

        const desiredStartTime = `${desiredDate}T${desiredStartTimeSimple}:00`;
        const desiredEndTime = `${desiredDate}T${desiredEndTimeSimple}:00`;

        const tableToBook = state.tables.filter(table => 
            !state.reservations.some(reservation => 
                reservation.tableId === table.id &&
                !(reservation.endTime <= desiredStartTime || reservation.startTime >= desiredEndTime)
            )
        ).find(table => table.size === tableSize);      

        if (tableToBook) {
            const currentDate = state.reservationDate ? new Date(state.reservationDate) : new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
        
            const [startTimeStr, endTimeStr] = state.selectedTime.split(' - ');

            const [startHoursStr, startMinutesStr] = startTimeStr.split(':');
            const startHours = parseInt(startHoursStr, 10);
            const startMinutes = parseInt(startMinutesStr, 10);
        
            const [endHoursStr, endMinutesStr] = endTimeStr.split(':');
            const endHours = parseInt(endHoursStr, 10);
            const endMinutes = parseInt(endMinutesStr, 10);
        
            const startTimeISO = `${year}-${month}-${day}T${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}:00Z`;
            const endTimeISO = `${year}-${month}-${day}T${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00Z`;

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

            const response = await addReservation(restaurantId, tableToBook.id, startTimeISO, endTimeISO, state.extraInformation);
            navigation('/reservations');

            openSnackbar(response.message, response.success);
        }
    }

    useEffect(() => {
        setLoading(true);
        
        const fetchData = async () => {
            await tryFetchingRestaurant(restaurantId);
            await tryFetchingRestaurantTables(restaurantId);
            await tryFetchingRestaurantReservations();
        };

        fetchData();

        setLoading(false);
    }, [restaurantId, state.reservationDate]);

    useEffect(() => {
        setState(prevState => ({ ...prevState, isAuthenticated }));
    }, [isAuthenticated]);
    
    useEffect(() => {
        calculateAvailableSlots();
    }, [state.tables, state.reservations]);    

    const formatDateTimeFromSimpleTime = (date, simpleTime) => {
        const [hours, minutes] = simpleTime.split(':');
        return `${date}T${hours}:${minutes}:00`;
    }

    const convertSimpleToISOTimeRange = (simpleTimeRange) => {
        const [startSimpleTime, endSimpleTime] = simpleTimeRange.split(' - ');
        const startDateTimeISO = formatDateTimeFromSimpleTime(state.reservationDate, startSimpleTime);
        const endDateTimeISO = formatDateTimeFromSimpleTime(state.reservationDate, endSimpleTime);
        return `${startDateTimeISO} - ${endDateTimeISO}`;
    }    
    
    const isTimePassed = (selectedDate, selectedTime) => {
        const [hours, minutes] = selectedTime.split('-')[0].trim().split(':');
        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(hours, minutes);

        const currentDateTime = new Date();
        return selectedDateTime < currentDateTime;
    };


    const availableTimes = state.availableTimes;
    const noAvailableTimes = availableTimes.length === 0;
    
    return (
        <Container maxWidth="sm" style={{ marginTop: '40px' }}>
            <Paper elevation={3} style={{ padding: '20px' }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Typography variant="h3" align="center" gutterBottom>{state.restaurantName}</Typography>
                        <Typography variant="h4" align="center" gutterBottom>Select a Time Slot</Typography>
    
                        {!noAvailableTimes ? (
                            <>
                                <Box display="flex" flexDirection="column" alignItems="center" marginBottom={3}>
                                    <FormControl fullWidth margin="normal">
                                        <TextField
                                            type="date"
                                            value={state.reservationDate}
                                            onChange={(e) => handleDateChange(e)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                min: minDate,
                                                max: maxDate
                                            }}
                                            label="Reservation Date"
                                        />
                                    </FormControl>
                                    <FormControl variant="outlined" style={{ width: '100%', marginBottom: '20px' }}>
                                        <InputLabel>Available Times</InputLabel>
                                        <Select value={state.selectedTime} onChange={handleTimeChange} label="Available Times">
                                            {availableTimes.sort((a, b) => parseFloat(a) - parseFloat(b)).map(time => (
                                                <MenuItem key={time} value={time}>
                                                    { time }
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
    
                                <Box marginTop={3} marginBottom={3}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        label="Extra Information to Staff"
                                        value={state.extraInfo}
                                        onChange={handleCharCount}
                                        placeholder="Write any additional notes for the staff here..."
                                        inputProps={{ maxLength: 100 }}
                                        helperText={`${charCount}/100`}
                                    />
                                </Box>
                                    
                                <Typography variant="h6" align="center" gutterBottom>Table Availability</Typography>
    
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Table Size</TableCell>
                                                <TableCell align="left">Available</TableCell>
                                                {isAuthenticated && <TableCell align="right">Action</TableCell>}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {state.availableSlots[convertSimpleToISOTimeRange(state.selectedTime)] && Object.entries(state.availableSlots[convertSimpleToISOTimeRange(state.selectedTime)]).map(([size, count]) => (
                                                <TableRow key={size}>
                                                    <TableCell component="th" scope="row">{size}</TableCell>
                                                    <TableCell align="left">{count > 0 ? `${count} tables` : 'None'}</TableCell>
                                                    {isAuthenticated && (
                                                        count > 0 ? 
                                                        <TableCell align="right">
                                                            {isTimePassed(state.reservationDate, state.selectedTime) ? 
                                                                <Typography color="textSecondary">Unavailable</Typography> :
                                                                <Button variant="contained" color="primary" onClick={() => handleBooking(size)}>Book it</Button>
                                                            }
                                                        </TableCell> :
                                                        <TableCell align="right"></TableCell>  // Render an empty cell
                                                    )}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        ) : (
                            <Typography variant="h6" align="center" gutterBottom>Not available for booking</Typography>
                        )}
                    </>
                )}
            </Paper>
        </Container>
    );    
}

export default Tables;