import * as React from 'react';
import { useState, useContext } from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { register } from '../../services/AuthenticationService';
import SnackbarContext from '../Contexts/SnackbarContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext';
import { login } from '../../services/AuthenticationService';

const defaultTheme = createTheme();

function Register() {
  const { changeUserInformationToLoggedIn } = useUser();
  const navigation = useNavigate();
  const openSnackbar = useContext(SnackbarContext);
  const [errorMessage, setErrorMessage] = useState(null);

  const tryRegistration = async (username, email, password) => {
    try {
        const response = await register(username, email, password);
        if (response.status == 201) {
            const loginResponse = await login(username, password);
            if (loginResponse.status == 200) {
              const data = await loginResponse.json();
              changeUserInformationToLoggedIn(data.accessToken, data.refreshToken);
            }

            navigation('/');
            openSnackbar('Registered successfully!', 'success');
        } else {
            const responseError = await response.text();
            setErrorMessage(responseError);
        }
    } catch (error) {
        console.error('An error occurred while registering:', error);
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

      tryRegistration(username, email, password);
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
                    Register
                </Typography>
                {errorMessage &&
                    <Typography color="error">
                        {errorMessage}
                    </Typography>
                }
                <Box component="form" noValidate onSubmit={(event) => handleSubmit(event)} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                error={Boolean(validationErrors.username)}
                                helperText={validationErrors.username}
                                required
                                fullWidth
                                id="userName"
                                label="Username"
                                name="userName"
                                autoComplete="userName"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={Boolean(validationErrors.email)}
                                helperText={validationErrors.email}
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={Boolean(validationErrors.password)}
                                helperText={validationErrors.password}
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
    </ThemeProvider>
  );
}

function RegistrationPage() {
  return <Register />;
}

export default RegistrationPage;