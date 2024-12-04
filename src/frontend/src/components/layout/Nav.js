// src/components/layout/Nav.js

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';

import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  createTheme,
  ThemeProvider,
  IconButton,
} from '@mui/material';
import { Home, Book, PenTool, LogIn, LogOut } from 'lucide-react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E86A33',
      light: '#FF8F5C',
      dark: '#D35400',
    },
    background: {
      paper: '#2C1810', // Dark background for AppBar
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFE4D6',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        },
      },
    },
  },
});

export const Nav = () => {
  const location = useLocation();
  const { token, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              padding: '0.5rem 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Left side navigation buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button
                  color="inherit"
                  startIcon={<Home size={20} />}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      color: 'primary.light',
                    },
                    borderBottom:
                      location.pathname === '/' ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                  }}
                >
                  Home
                </Button>
              </Link>

              {token && (
                <>
                  <Link to="/cookbook" style={{ textDecoration: 'none' }}>
                    <Button
                      color="inherit"
                      startIcon={<Book size={20} />}
                      sx={{
                        color: 'text.primary',
                        '&:hover': {
                          color: 'primary.light',
                        },
                        borderBottom:
                          location.pathname === '/cookbook'
                            ? '2px solid'
                            : 'none',
                        borderColor: 'primary.main',
                      }}
                    >
                      My Cookbook
                    </Button>
                  </Link>

                  {/* Uncomment if you implement Create Recipe feature */}
                  {/* 
                  <Link to="/create" style={{ textDecoration: 'none' }}>
                    <Button
                      color="inherit"
                      startIcon={<PenTool size={20} />}
                      sx={{
                        color: 'text.primary',
                        '&:hover': {
                          color: 'primary.light',
                        },
                        borderBottom:
                          location.pathname === '/create'
                            ? '2px solid'
                            : 'none',
                        borderColor: 'primary.main',
                      }}
                    >
                      Create Recipe
                    </Button>
                  </Link>
                  */}
                </>
              )}
            </Box>

            {/* Right side auth buttons */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {token ? (
                <Button
                  color="inherit"
                  startIcon={<LogOut size={20} />}
                  onClick={handleLogout}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button
                      color="inherit"
                      startIcon={<LogIn size={20} />}
                      sx={{
                        color: 'text.primary',
                        '&:hover': {
                          color: 'primary.light',
                        },
                        borderBottom:
                          location.pathname === '/login'
                            ? '2px solid'
                            : 'none',
                        borderColor: 'primary.main',
                      }}
                    >
                      Login
                    </Button>
                  </Link>

                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Button
                      color="inherit"
                      startIcon={<PenTool size={20} />}
                      sx={{
                        color: 'text.primary',
                        '&:hover': {
                          color: 'primary.light',
                        },
                        borderBottom:
                          location.pathname === '/register'
                            ? '2px solid'
                            : 'none',
                        borderColor: 'primary.main',
                      }}
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Nav;
