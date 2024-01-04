import React, { useState } from 'react';
import SnackbarContext from '../Contexts/SnackbarContext';
import Snackbar from '@mui/material/Snackbar';
import Alert from "@mui/material/Alert";

export const SnackbarProvider = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const openSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <SnackbarContext.Provider value={openSnackbar}>
      {children}
      <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled" sx={{ fontSize: '1.5rem', padding: '15px' }}>
              {snackbarMessage}
          </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
