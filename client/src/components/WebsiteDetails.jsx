import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Paper, 
  Grid, 
  Chip, 
  Button, 
  IconButton,
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import { fetchWebsiteDetails } from '../services/api';
import UptimeGraph from './charts/UptimeGraph';
import ResponseTimeChart from './charts/ResponseTimeChart';

const WebsiteDetails = () => {
  const { websiteId } = useParams();
  const history = useHistory();
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWebsiteDetails = async () => {
      try {
        const data = await fetchWebsiteDetails(websiteId);
        setWebsite(data);
      } catch (error) {
        console.error("Error fetching website details:", error);
        setError("Failed to fetch website details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getWebsiteDetails();
  }, [websiteId]);

  const handleBack = () => {
    history.push('/dashboard');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mt: 2, mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={handleBack} 
          sx={{ mr: 1 }}
          aria-label="back to dashboard"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Website Details
        </Typography>
      </Box>

      {/* Website Info Card */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          backgroundColor: 'background.card', 
          mb: 4,
          borderLeft: website?.status === 'up' ? '4px solid #03dac6' : '4px solid #cf6679'
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {website?.name || website?.url}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2, 
                color: 'text.secondary',
                wordBreak: 'break-all'
              }}
            >
              {website?.url}
            </Typography>
            
            <Box display="flex" alignItems="center" mb={1}>
              <Chip 
                icon={website?.status === 'up' ? <CheckCircleIcon /> : <ErrorIcon />}
                label={website?.status === 'up' ? 'Online' : 'Offline'}
                color={website?.status === 'up' ? 'success' : 'error'}
                sx={{ mr: 2 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Last Check:
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                <Typography variant="body2">
                  {website?.lastChecked ? new Date(website.lastChecked.toDate()).toLocaleString() : 'Not checked yet'}
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" color="text.secondary">
                Latest Response Time:
              </Typography>
              <Box display="flex" alignItems="center">
                <SpeedIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                <Typography variant="body2">
                  {website?.latestPing?.responseTime !== undefined ? `${website.latestPing.responseTime} ms` : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Charts */}
      <UptimeGraph websiteId={websiteId} />
      <ResponseTimeChart websiteId={websiteId} />
      
    </Container>
  );
};

export default WebsiteDetails;