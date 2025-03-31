import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#03dac6', // Bright teal as primary accent
      light: '#4affee',
      dark: '#00a896',
    },
    secondary: {
      main: '#bb86fc', // Purple as secondary accent
      light: '#eeb8ff',
      dark: '#8858c8',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
      card: '#252525', // Slightly lighter for cards
      elevated: '#2c2c2c', // For hover states
    },
    error: {
      main: '#cf6679',
      light: '#ff97a6',
      dark: '#994050',
    },
    success: {
      main: '#03dac6', // Same as primary for consistency
      light: '#4affee',
      dark: '#00a896',
    },
    warning: {
      main: '#ffb74d',
      light: '#ffe9c9',
      dark: '#c88719',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.25px',
    },
    h4: {
      fontWeight: 500,
      letterSpacing: '0.25px',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '0.15px',
    },
    subtitle1: {
      fontWeight: 400,
      letterSpacing: '0.15px',
    },
    body1: {
      fontWeight: 400,
      letterSpacing: '0.5px',
      lineHeight: 1.7,
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.75px',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#252525',
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 20px 0 rgba(0,0,0,0.3)',
            backgroundColor: '#2a2a2a',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'background-color 0.3s, transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #03dac6 30%, #4affee 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #00c4b0 30%, #2de0d1 90%)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        colorSuccess: {
          background: 'linear-gradient(45deg, #03dac6 30%, #4affee 90%)',
        },
        colorError: {
          background: 'linear-gradient(45deg, #cf6679 30%, #ff97a6 90%)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #121212 0%, #1a1a1a 100%)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          transition: 'color 0.3s ease',
        },
      },
    },
  },
});

export default theme;