import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import RegisterIcon from '@mui/icons-material/PersonAdd';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LoginModal from '../Authentication/LoginPage.jsx'
import RegistrationModal from '../Authentication/RegisterPage.jsx'
import { Link } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext.jsx';
import { isDragActive } from 'framer-motion';
import SettingsIcon from '@mui/icons-material/Settings';
import { logout } from '../../services/AuthenticationService.jsx';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigation = useNavigate();
  const { isAuthenticated, role, refreshToken, changeUserInformationToLoggedOut } = useUser();

  console.log(role);
  const handleNavigation = (url) => {
    console.log(`going to ${url}`);
    navigation(url);
  };

  const pages = [
    { name: 'Restaurants', route: '/' },
  ];

  let settings = [];

  if (isAuthenticated) {
    settings.push({ name: 'Your reservations', route: 'user/reservations' });
  
    if (role.includes('Admin')) {
      settings.push(
        { name: 'Manage restaurants', route: 'admin/restaurants' },
      );
    }
  
    settings.push({ name: 'Logout', route: '/', method: 'handleLogout' });
  }

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function handleMenuItemClick(setting) {
        handleCloseUserMenu();
        if (setting.method) {
            if (setting.method === 'handleLogout') {
                handleLogout();
            }
        }
    }

  async function handleLogout() {
    try {
      await logout(refreshToken);
      changeUserInformationToLoggedOut();
    } catch {

    }
  }


  return (
    <AppBar position="static">
      <Container maxWidth="x1">
        <Toolbar disableGutters>
          <div onClick={() => handleNavigation(pages[0].route)} style={{ textDecoration: 'none', color: 'white', cursor: 'pointer', pointerEvents: 'auto' }}>
            <Link>
              <img src="/assets/logo.svg" alt="FlavorFare icon" width="80px" height="80px" />
            </Link>
          </div>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => handleNavigation(page.route)}
                  style={{ cursor: 'pointer', backgroundColor: 'transparent', border: 'none' }}
                >
                  <Link to={page.route} style={{ textDecoration: 'none', color: 'black' }}>
                    {page.name}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <button
                key={page.name}
                onClick={() => handleNavigation(page.route)}
                style={{ cursor: 'pointer', backgroundColor: 'transparent', border: 'none' }}
              >
                <MenuItem onClick={handleCloseNavMenu} style={{ pointerEvents: 'none' }}>
                  <Link to={page.route} style={{ textDecoration: 'none', color: 'white' }}>
                    {page.name}
                  </Link>
                </MenuItem>
              </button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? 
                <> 
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar>
                            <SettingsIcon />
                        </Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                    {settings.map((setting) => (
                      <MenuItem
                        key={setting.name}
                        onClick={() => {
                          handleMenuItemClick(setting);
                          handleNavigation(setting.route);
                        }}
                        style={{
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                        }}
                      >
                        <span style={{ textDecoration: 'none', color: 'black' }}>
                          {setting.name}
                        </span>
                      </MenuItem>
                    ))}
                    </Menu>
                </> : 
                <>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Link to="/login">
                          <Button startIcon={<LoginIcon />} sx={{ marginRight: 1, color: 'white' }}>
                              Login
                          </Button>
                      </Link>
                      <Link to="/register">
                          <Button startIcon={<RegisterIcon />} sx={{ marginRight: 1, color: 'white' }}>
                              Register
                          </Button>
                      </Link>
                  </Box>
                </>}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;