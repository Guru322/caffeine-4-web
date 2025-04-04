import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Switch, 
  FormControlLabel, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  CircularProgress,
  Alert
} from '@mui/material';
import { fetchWebsites, updateNotificationSettings, fetchUserSettings } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const NotificationSettings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [websites, setWebsites] = useState([]);
  const [settings, setSettings] = useState({
    emailNotificationsEnabled: false,
    notificationDelay: 60, 
    websites: {}
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const websitesData = await fetchWebsites();
        setWebsites(websitesData);
        
        const userSettings = await fetchUserSettings(currentUser.uid);
        if (userSettings) {
          setSettings(userSettings);
        } else {
          const websiteDefaults = {};
          websitesData.forEach(site => {
            websiteDefaults[site.id] = true;
          });
          setSettings(prev => ({
            ...prev,
            websites: websiteDefaults
          }));
        }
      } catch (err) {
        console.error("Error loading notification settings:", err);
        setError("Failed to load notification settings");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentUser.uid]);
  
  const handleToggleNotifications = (event) => {
    setSettings(prev => ({
      ...prev,
      emailNotificationsEnabled: event.target.checked
    }));
  };
  
  const handleWebsiteToggle = (websiteId) => {
    setSettings(prev => ({
      ...prev,
      websites: {
        ...prev.websites,
        [websiteId]: !prev.websites[websiteId]
      }
    }));
  };
  
  const handleDelayChange = (event, value) => {
    setSettings(prev => ({
      ...prev,
      notificationDelay: value
    }));
  };
  
  const saveSettings = async () => {
    try {
      setLoading(true);
      await updateNotificationSettings(settings);
      setSuccess("Notification settings saved successfully!");
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error("Error saving notification settings:", err);
      setError("Failed to save notification settings");
    } finally {
      setLoading(false);
    }
  };
  
  const formatDelayLabel = (value) => {
    if (value < 60) return `${value} seconds`;
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Notification Settings
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Box mb={3}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailNotificationsEnabled}
                onChange={handleToggleNotifications}
                color="primary"
              />
            }
            label="Enable Email Notifications"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Get email alerts when your websites go down and when they come back online.
          </Typography>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Notification Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Email notifications for downtime are sent once every 2 hours while a site remains down.
            Uptime notifications are sent immediately when a site recovers.
          </Typography>
          
          {/* Remove the delay slider section completely */}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Websites to Monitor
        </Typography>
        
        {websites.length === 0 ? (
          <Typography color="text.secondary">
            No websites added yet. Add websites to configure notifications.
          </Typography>
        ) : (
          <List>
            {websites.map(website => (
              <ListItem key={website.id} disablePadding sx={{ py: 1 }}>
                <ListItemText 
                  primary={website.name || website.url} 
                  secondary={website.url}
                  primaryTypographyProps={{
                    fontWeight: 500
                  }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.websites[website.id] || false}
                      onChange={() => handleWebsiteToggle(website.id)}
                      disabled={!settings.emailNotificationsEnabled}
                      color="primary"
                    />
                  }
                  label=""
                />
              </ListItem>
            ))}
          </List>
        )}
        
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={saveSettings}
            disabled={loading}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotificationSettings;