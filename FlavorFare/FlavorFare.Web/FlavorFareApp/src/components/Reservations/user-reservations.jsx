    import React, { useState, useEffect, useContext } from 'react';
    import { Button, Paper, Typography, Table, Select, MenuItem, FormControl, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
    import { Edit as EditIcon, Block as BlockIcon, Delete as DeleteIcon } from '@mui/icons-material';
    import { useNavigate } from 'react-router-dom';
    import { getUserReservations, updateUserReservation, removeUserReservation } from '../../services/ReservationService';
    import { checkTokenValidity } from '../../utils/jwtUtils';
    import { refreshAccessToken } from '../../services/AuthenticationService';
    import { useUser } from '../Contexts/UserContext';
    import SnackbarContext from '../Contexts/SnackbarContext';

    function UserReservations() {
        const [sortOrder, setSortOrder] = useState('asc');
        const [filterStatus, setFilterStatus] = useState("active");
        const navigation = useNavigate();
        const openSnackbar = useContext(SnackbarContext);
        const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();
        const [charCount, setCharCount] = useState(0);
        const [reservations, setReservations] = useState([]);
        const [openUpdateModal, setOpenUpdateModal] = useState(false);
        const [openRemoveModal, setOpenRemoveModal] = useState(false);
        const [currentReservation, setCurrentReservation] = useState(null);

        const tryFetchingUserReservations = async () => {
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

            const data = await getUserReservations();
            setReservations(data);
        }

        useEffect(() => {
            tryFetchingUserReservations();
        }, []);

        const useForceUpdate = () => {
            const [value, setValue] = useState(0);
            return () => setValue(value + 1);
        }

        const forceUpdate = useForceUpdate();

        const formatDate = (isoDate) => {
            const date = new Date(isoDate);
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        };

        const handleCharCount = (event) => {
            const length = event.target.value.length;
            setCharCount(length);
            
            if (currentReservation) {
                setCurrentReservation(prevReservation => ({
                    ...prevReservation,
                    extraInformation: event.target.value
                }));
            }
        };  
        
        const isExpired = (startTime) => {
            return new Date(startTime) < new Date();
        };

        const filteredReservations = reservations.filter(reservation => {
            switch (filterStatus) {
                case "active":
                    return !isExpired(reservation.startTime);
                case "inactive":
                    return isExpired(reservation.startTime);
                case "all":
                default:
                    return true;
            }
        });        

        const sortedReservations = filteredReservations.sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a.startTime) - new Date(b.startTime);
            } else {
                return new Date(b.startTime) - new Date(a.startTime);
            }
        });
  

        const handleOpenUpdate = (reservation) => {
            setCharCount(reservation.extraInformation.length);
            setCurrentReservation(reservation);
            setOpenUpdateModal(true);
        };

        const handleOpenRemove = (reservation) => {
            setCurrentReservation(reservation);
            setOpenRemoveModal(true);
        };

        const handleCloseUpdate = () => {
            setOpenUpdateModal(false);
            setCurrentReservation(null);
        };

        const handleCloseRemove = () => {
            setOpenRemoveModal(false);
            setCurrentReservation(null);
        };

        const handleUpdateReservation = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!checkTokenValidity(accessToken)) {
                const result = await refreshAccessToken();
                if (!result.success) {
                    openSnackbar('Login is needed!', 'error');
                    changeUserInformationToLoggedOut();
                    navigation('/login');
                    return;
                }

                changeUserInformationToLoggedIn(result.data.accessToken, result.data.refreshToken);
            }

            const response = await updateUserReservation(currentReservation);
            if (response.status === 200) {
                const updatedReservations = reservations.map(reservation => {
                    if (reservation.id === currentReservation.id) {
                        return {
                            ...reservation,
                            extraInformation: currentReservation.extraInformation
                        };
                    }
                    return reservation;
                });

                setReservations(updatedReservations);
                openSnackbar('Reservation was updated successfully', 'success');
            } else {
                openSnackbar('Failed updating reservation, try again later!', 'error');
            }

            handleCloseUpdate();
        };

        const handleRemoveReservation = async () => {
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

            const response = await removeUserReservation(currentReservation.restaurantId, currentReservation.tableId, currentReservation.id);
            if (response.status === 204) {
                const updatedReservations = reservations.filter(reservation => reservation.id !== currentReservation.id);
                setReservations(updatedReservations);

                openSnackbar('Reservation was removed successfully', 'success');
                
            } else {
                openSnackbar('Failed removing reservation, try again later!', 'error');
            }

            handleCloseRemove();
        };

        return (
            <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <FormControl variant="outlined" style={{ margin: '0 20px' }}>
                        <InputLabel>Filter</InputLabel>
                        <Select
                            value={filterStatus}
                            onChange={event => setFilterStatus(event.target.value)}
                            label="Filter"
                        >
                            <MenuItem value="active">Active Reservations</MenuItem>
                            <MenuItem value="inactive">Inactive Reservations</MenuItem>
                            <MenuItem value="all">All Reservations</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" style={{ margin: '0 20px' }}>
                        <InputLabel>Sort</InputLabel>
                        <Select
                            value={sortOrder}
                            onChange={event => {
                                setSortOrder(event.target.value);
                            }}
                            label="Filter"
                        >
                            <MenuItem value="asc">Start Time Ascending</MenuItem>
                            <MenuItem value="desc">Start Time Descending</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <TableContainer component={Paper} style={{ maxWidth: '85%', minWidth: '300px', width: 'auto', margin: '50px auto 0 auto' }}>
                    <Table style={{ tableLayout: 'fixed' }} key={`${filterStatus}-${sortOrder}`}>
                        <TableHead>
                            <TableRow style={{ display: 'flex' }}>
                                <TableCell style={{ padding: '8px', flex: 1 }}>Restaurant Name</TableCell>
                                <TableCell style={{ padding: '8px', flex: 1 }}>Start Time</TableCell>
                                <TableCell style={{ padding: '8px', flex: 1 }}>End Time</TableCell>
                                <TableCell style={{ padding: '8px', flex: 3 }}>Extra Information</TableCell>
                                <TableCell align='center' style={{ padding: '8px', flex: 1 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedReservations.map(reservation => (
                                <TableRow key={reservation.id} style={{ display: 'flex' }}>
                                    <TableCell style={{ padding: '8px', flex: 1 }}>{reservation.restaurantName}</TableCell>
                                    <TableCell style={{ padding: '8px', flex: 1 }}>{formatDate(reservation.startTime)}</TableCell>
                                    <TableCell style={{ padding: '8px', flex: 1 }}>{formatDate(reservation.endTime)}</TableCell>
                                    <TableCell style={{ padding: '8px', flex: 3 }}>{reservation.extraInformation.trim()}</TableCell>
                                    <TableCell style={{ padding: '8px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {isExpired(reservation.startTime) ? 
                                        <BlockIcon color="disabled" /> : 
                                        (
                                            <>
                                                <Button startIcon={ <EditIcon /> } style={{ marginRight: '8px' }} onClick={() => handleOpenUpdate(reservation)}>Edit</Button>
                                                <Button startIcon={ <DeleteIcon /> } onClick={() => handleOpenRemove(reservation)}>Delete</Button>
                                            </>
                                        )
                                    }
                                </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog open={openUpdateModal} onClose={handleCloseUpdate}>
                    <DialogTitle>Update of reservation information</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="extraInformation"
                            label="Extra Information"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            inputProps={{ maxLength: 100 }}
                            defaultValue={currentReservation ? currentReservation.extraInformation : ''}
                            onChange={(event) => {
                                handleCharCount(event);
                            }}
                        />
                        <Typography variant="caption" display="block" gutterBottom>
                            {charCount}/100
                        </Typography>
                    </DialogContent>
                    <DialogActions style={{ justifyContent: 'center' }}>
                        <Button onClick={handleCloseUpdate} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateReservation} color="primary">
                            Update Reservation
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Remove Modal */}
                <Dialog open={openRemoveModal} onClose={handleCloseRemove}>
                    <DialogTitle>Do you really want to remove the reservation?</DialogTitle>
                    <DialogActions style={{ justifyContent: 'center' }}>
                        <Button onClick={handleCloseRemove} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleRemoveReservation} color="primary">
                            Remove Reservation
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    export default UserReservations;