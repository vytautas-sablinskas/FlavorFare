import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Paper, Typography, Table, Dialog, DialogTitle, DialogContent, FormControl,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Box, InputLabel,
  Select, MenuItem, DialogActions
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ContactlessOutlined } from '@mui/icons-material';
import { addTable, getTables, removeTable, updateTable } from '../../services/TableService';
import { useNavigate, useParams } from 'react-router-dom';
import { checkTokenValidity } from '../../utils/jwtUtils';
import { refreshAccessToken } from '../../services/AuthenticationService';
import { useUser } from '../Contexts/UserContext';
import SnackbarContext from '../Contexts/SnackbarContext';

const AddTableDialog = ({ open, onClose, onAdd, restaurantId }) => {
    const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();
    const openSnackbar = useContext(SnackbarContext);
    const [size, setSize] = useState('');
    const navigation = useNavigate();

    const handleSizeChange = (event) => {
        setSize(event.target.value);
    };

    const handleSubmit = async () => {
        if (size > 0) {
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

            const response = await addTable(restaurantId, size);
            if (response.status === 201) {
                openSnackbar("Table was created", "success");
                const data = await response.json();
                onAdd({ data });
            } else {
                openSnackbar("Restaurant was not created. Try again later!", "error");
            }
            
            onClose();
            setSize('');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Table</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="size-select-label">Size</InputLabel>
                    <Select
                        labelId="size-select-label"
                        id="size-select"
                        value={size}
                        label="Size"
                        onChange={handleSizeChange}
                    >
                        {[1, 2, 3, 4, 5].map((number) => (
                            <MenuItem key={number} value={number}>{number}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
};

const UpdateTableDialog = ({ open, onClose, onUpdate, table }) => {
    const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();
    const openSnackbar = useContext(SnackbarContext);
    const [size, setSize] = useState(table ? table.size : '');
    const navigation = useNavigate();
    

    const handleSizeChange = (event) => {
        setSize(event.target.value);
    };

    useEffect(() => {
        setSize(table ? table.size : '');
    }, [table]);

    const handleSubmit = async () => {
        if (size > 0) {
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

            const response = await updateTable(table.restaurantId, table.id, size);
            if (response.status === 200) {
                openSnackbar("Table was updated", "success");
                onUpdate({ id: table.id, size });
            } else {
                openSnackbar("Restaurant was not updated. Try again later!", "error");
            }
            
            onClose();
            setSize('');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update Table Information</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="size-select-label">Size</InputLabel>
                    <Select
                        labelId="size-select-label"
                        id="size-select"
                        value={size}
                        label="Size"
                        onChange={handleSizeChange}
                    >
                        {[1, 2, 3, 4, 5].map((number) => (
                            <MenuItem key={number} value={number}>{number}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Update</Button>
            </DialogActions>
        </Dialog>
    );
};

const RemoveTableDialog = ({ open, onClose, onRemove }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Do you really want to remove this table?</DialogTitle>
            <DialogActions style={{ justifyContent: 'center' }}>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={onRemove} color="primary">Remove Table</Button>
            </DialogActions>
        </Dialog>
    );
  };

function AdminTables() {
    const [tables, setTables] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [currentTable, setCurrentTable] = useState(null);
    const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
    const [tableToRemove, setTableToRemove] = useState(null);
    const { restaurantId } = useParams();
    const navigation = useNavigate();
    const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();
    const openSnackbar = useContext(SnackbarContext);

    const handleAddTable = (table) => {
        setTables(prevTables => [...prevTables, table.data]);
    }

    const handleUpdateTable = (updatedTable) => {
        setTables(prevTables => 
            prevTables.map(table => 
                table.id === updatedTable.id ? { ...table, ...updatedTable } : table
            )
        );
    
        setOpenUpdateDialog(false);
    };    

    const handleRemoveTable = async () => {
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

        const response = await removeTable(tableToRemove.restaurantId, tableToRemove.id);
        if (response.status === 204) {
            setTables(prevTables => prevTables.filter(table => table.id !== tableToRemove.id));
            setOpenRemoveDialog(false);
            openSnackbar("Table was removed!", "success");
        } else {
            openSnackbar("Table was not removed. Try again later!", "error");
        }
    };

    useEffect(() => {
        async function fetchData() {
          const actualTables = await getTables(restaurantId);
          setTables(actualTables);
        }

        fetchData();
    }, []);

    return (
      <Grid container spacing={3} style={{ maxWidth: '85%', margin: '0 auto' }}>
        <Grid item xs={12}>
          <Typography variant="h5" style={{ marginBottom: '1rem', textAlign: 'center' }}>Manage Tables</Typography>
          <Box display="flex" justifyContent="flex-end" alignItems="center" marginBottom={2}>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setOpenAddDialog(true)}
                startIcon={<AddIcon />}
            >
                Add Table
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Size</TableCell>
                  <TableCell align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell>{table.size}</TableCell>
                    <TableCell align='center'>
                      <Button startIcon={<EditIcon />} onClick={() => { setCurrentTable(table); setOpenUpdateDialog(true); }}>Edit</Button>
                      <Button startIcon={<DeleteIcon />} onClick={() => { setTableToRemove(table); setOpenRemoveDialog(true); }}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
  
        <AddTableDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onAdd={handleAddTable}
          restaurantId={restaurantId}
        />
  
        <UpdateTableDialog
          open={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          onUpdate={handleUpdateTable}
          table={currentTable}
        />

        <RemoveTableDialog 
            open={openRemoveDialog} 
            onClose={() => setOpenRemoveDialog(false)} 
            onRemove={handleRemoveTable}
        />
      </Grid>
    );
  }

export default AdminTables;