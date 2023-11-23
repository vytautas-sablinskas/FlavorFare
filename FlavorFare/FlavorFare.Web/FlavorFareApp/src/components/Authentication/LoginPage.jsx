import React, { useState, useContext } from 'react';
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
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

function LoginPage() {
  const navigation = useNavigate();
  const { changeUserInformationToLoggedIn } = useUser();
  const openSnackbar = useContext(SnackbarContext);
  const [errorMessage, setErrorMessage] = useState(null);

  const tryLogin = async (username, password) => {
    try {
        const response = await login(username, password);
        if (response.status == 200) {
            const data = await response.json();

            changeUserInformationToLoggedIn(data.accessToken, data.refreshToken);
            navigation('/');
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
      const password = data.get('password');

      const isValidUsername = (username) => {
        return username && username.length >= 3;
      }
    
      const isValidPassword = (password) => {
          const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
          return re.test(password);
      }

      let errors = {};
      if (!isValidUsername(username)) errors.username = "Username must be at least 3 characters long.";
      if (!isValidPassword(password)) errors.password = "Password must have at least one lowercase, one uppercase letter, one number, one symbol and at least 6 characters.";

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

      setValidationErrors({
          username: null,
          password: null
      });

      tryLogin(username, password);
  };

  const [validationErrors, setValidationErrors] = useState({
    username: null,
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

export default LoginPage;