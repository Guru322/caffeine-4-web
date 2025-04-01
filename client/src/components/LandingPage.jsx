import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Paper, 
  Stack,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import MonitorIcon from '@mui/icons-material/Monitor';
import SpeedIcon from '@mui/icons-material/Speed';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';

const LandingPage = () => {
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentUser, signInWithGoogle, signInWithGitHub } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openAlert, setOpenAlert] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      history.push('/dashboard');
    }
  }, [currentUser, history]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      history.push('/dashboard');
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google. Please try again.');
      setOpenAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGitHub(); 
      history.push('/dashboard');
    } catch (error) {
      console.error('GitHub sign in error:', error);
      setError('Failed to sign in with GitHub. Please try again.');
      setOpenAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(circle at 10% 20%, rgb(21, 21, 21) 0%, rgb(25, 25, 25) 90.2%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Abstract Background Shapes */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '40%',
        height: '40%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(3, 218, 198, 0.05) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0,
      }} />
      
      <Box sx={{
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: '30%',
        height: '30%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(187, 134, 252, 0.05) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0,
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '5%',
        left: '20%',
        width: '60%',
        height: '40%',
        borderRadius: '30%',
        background: 'radial-gradient(ellipse, rgba(3, 218, 198, 0.03) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0,
        transform: 'rotate(-15deg)',
      }} />
      
      <Container maxWidth="lg" sx={{ mt: 8, flexGrow: 1, position: 'relative', zIndex: 1 }}>
        {/* Hero Section - Centered */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            textAlign: 'center',
            mb: 12,
            mt: isMobile ? 4 : 8,
            px: 2
          }}
        >
          <Typography 
            variant={isMobile ? 'h2' : 'h1'} 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(45deg, #03dac6, #bb86fc)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 4,
              letterSpacing: '-0.02em',
            }}
          >
            caffeine 4 web
          </Typography>
          
          
          <Typography 
            variant={isMobile ? 'h4' : 'h3'} 
            sx={{ 
              maxWidth: 800, 
              mb: 3, 
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Keep Your Websites Awake 24/7
          </Typography>
          
          {/* Smaller Explanation */}
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: 700, mb: 6, fontWeight: 400 }}
          >
            Monitor uptime, track response times, and get instant alerts
            when your websites go down.
          </Typography>
          
          {!currentUser && (
            <Stack 
              direction={isMobile ? "column" : "row"} 
              spacing={2} 
              sx={{ maxWidth: isMobile ? 400 : 500 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                disabled={loading}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  background: 'linear-gradient(45deg, #03dac6 30%, #4affee 90%)',
                }}
              >
                Sign in with Google
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<GitHubIcon />}
                onClick={handleGitHubSignIn}
                disabled={loading}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                Sign in with GitHub
              </Button>
            </Stack>
          )}
          
          {currentUser && (
            <Button
              variant="contained"
              size="large"
              onClick={() => history.push('/dashboard')}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Go to Dashboard
            </Button>
          )}
        </Box>

        {/* Features Section */}
        <Typography variant="h4" sx={{ mb: 5, textAlign: 'center', fontWeight: 600 }}>
          Key Features
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 4,
                height: '100%',
                backgroundColor: 'background.card',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.3)',
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <MonitorIcon sx={{ fontSize: 50, color: 'primary.main' }} />
              </Box>
              <Typography variant="h6" align="center" gutterBottom>
                Real-time Monitoring
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                Monitor your website's uptime with automatic checks every 30 seconds. Get instant alerts when a site goes down.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 4,
                height: '100%',
                backgroundColor: 'background.card',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.3)',
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <SpeedIcon sx={{ fontSize: 50, color: 'secondary.main' }} />
              </Box>
              <Typography variant="h6" align="center" gutterBottom>
                Performance Metrics
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                Track response times and analyze performance with intuitive visualizations. Identify bottlenecks before they impact users.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 4,
                height: '100%',
                backgroundColor: 'background.card',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.3)',
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <NotificationsActiveIcon sx={{ fontSize: 50, color: 'warning.main' }} />
              </Box>
              <Typography variant="h6" align="center" gutterBottom>
                Smart Alerts
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary">
                Set up customized alerts based on downtime or performance thresholds. Stay informed without the noise.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            px: 3,
            mb: 8,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(3, 218, 198, 0.1) 0%, rgba(187, 134, 252, 0.1) 100%)',
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Ready to keep your websites alive?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Join thousands of developers who trust caffeine 4 web for reliable website monitoring.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={currentUser ? () => history.push('/dashboard') : handleGoogleSignIn}
            disabled={loading}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              background: 'linear-gradient(45deg, #03dac6 30%, #4affee 90%)',
            }}
          >
            {currentUser ? 'Go to Dashboard' : 'Get Started Free'}
          </Button>
        </Box>
      </Container>

      {/* Footer here */}
      <Footer />

      {/* Error Snackbar */}
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LandingPage;