import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { Home, Book, PenTool, LogIn, LogOut } from 'lucide-react';
import AuthContext from '../auth/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E86A33',
      light: '#FF8F5C',
      dark: '#D35400',
    },
    background: {
      paper: '#2C1810', // Dark warm brown for AppBar
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

export const Nav = ({ currentPage, setCurrentPage }) => {
  const { token, logout } = React.useContext(AuthContext);

  const handleNavClick = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            padding: '0.5rem 0',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            {/* Left side navigation buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              alignItems: 'center'
            }}>
              <Button
                color="inherit"
                startIcon={<Home size={20} />}
                onClick={() => handleNavClick('home')}
                sx={{
                  '&:hover': {
                    color: 'primary.light',
                  },
                }}
              >
                Home
              </Button>

              {token && (
                <>
                  <Button
                    color="inherit"
                    startIcon={<Book size={20} />}
                    onClick={() => handleNavClick('cookbook')}
                    sx={{
                      '&:hover': {
                        color: 'primary.light',
                      },
                    }}
                  >
                    My Cookbook
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={<PenTool size={20} />}
                    onClick={() => handleNavClick('create')}
                    sx={{
                      '&:hover': {
                        color: 'primary.light',
                      },
                    }}
                  >
                    Create Recipe
                  </Button>
                </>
              )}
            </Box>

            {/* Right side auth button */}
            <Box>
              {token ? (
                <Button
                  color="inherit"
                  startIcon={<LogOut size={20} />}
                  onClick={handleLogout}
                  sx={{
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  color="inherit"
                  startIcon={<LogIn size={20} />}
                  onClick={() => handleNavClick('login')}
                  sx={{
                    '&:hover': {
                      color: 'primary.light',
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Nav;