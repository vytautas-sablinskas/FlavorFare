import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import { useState, useContext } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../../services/AuthenticationService';
import SnackbarContext from '../Contexts/SnackbarContext';
import { useUser } from '../Contexts/UserContext';

const defaultTheme = createTheme();

function Login({ setOpen }) {
  const { changeUserInformationToLoggedIn } = useUser();
  const openSnackbar = useContext(SnackbarContext);
  const [errorMessage, setErrorMessage] = useState(null);

  const tryLogin = async (username, email, password) => {
    try {
        const response = await login(username, email, password);
        if (response.status == 200) {
            const data = await response.json();

            changeUserInformationToLoggedIn(data.accessToken, data.refreshToken);
            setOpen(false);
            openSnackbar('Logged in', 'success');
        } else {
            const responseError = await response.text();
            setErrorMessage(responseError);
            console.error('Login failed', responseError);
        }
    } catch (error) {
        console.error('An error occurred while signing in:', error);
    }
  };

  const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const username = data.get('userName');
      const email = data.get('email');
      const password = data.get('password');

      const isValidUsername = (username) => {
        return username && username.length >= 3;
      }
    
      const isValidEmail = (email) => {
          const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          return re.test(String(email).toLowerCase());
      }
    
      const isValidPassword = (password) => {
          const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
          return re.test(password);
      }

      let errors = {};
      if (!isValidUsername(username)) errors.username = "Username must be at least 3 characters long.";
      if (!isValidEmail(email)) errors.email = "Invalid email format.";
      if (!isValidPassword(password)) errors.password = "Password must have at least one lowercase, one uppercase letter, one number, one symbol and at least 6 characters.";

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      setValidationErrors({
          username: null,
          email: null,
          password: null
      });

      tryLogin(username, email, password);
  };

  const [validationErrors, setValidationErrors] = useState({
    username: null,
    email: null,
    password: null
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login to your account
          </Typography>
          {errorMessage &&
            <Typography color="error">
              {errorMessage}
              </Typography>
          }
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              error={Boolean(validationErrors.username)}
              helperText={validationErrors.username}
              margin="normal"
              required
              fullWidth
              name="userName"
              label="Username"
              type="userName"
              id="userName"
              autoComplete="userName"
              autoFocus
            />
            <TextField
              error={Boolean(validationErrors.email)}
              helperText={validationErrors.email}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <TextField
              error={Boolean(validationErrors.password)}
              helperText={validationErrors.password}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Login
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default function LoginModal() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        startIcon={<LoginIcon />}
        sx={{ color: 'white', marginRight: 1 }}
        onClick={handleOpen}
      >
        Login
      </Button>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogContent>
          <Login setOpen={ setOpen }/>
        </DialogContent>
      </Dialog>
    </div>
  );
}