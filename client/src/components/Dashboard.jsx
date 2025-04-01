import React, { useEffect, useState } from 'react';
import { fetchWebsites } from '../services/api';
import StatusCard from './StatusCard';
import { Container, Typography, Box, Grid, CircularProgress, Alert, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Dashboard = () => {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getWebsites = async () => {
            try {
                const data = await fetchWebsites();
                setWebsites(data);
            } catch (error) {
                console.error("Error fetching websites:", error);
                setError("Failed to fetch websites. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        getWebsites();
        const interval = setInterval(getWebsites, 30000);
        return () => clearInterval(interval); 
    }, []);

    // Handle website deletion
    const handleWebsiteDelete = (deletedWebsiteId) => {
        setWebsites(prevWebsites => 
            prevWebsites.filter(website => website.id !== deletedWebsiteId) // Changed from _id to id
        );
    };

    return (
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ my: 4, flexGrow: 1 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'medium', mb: 4 }}>
                    Website Monitoring Dashboard
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
                
                {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : websites.length === 0 ? (
                    <Alert severity="info">
                        No websites are currently being monitored. Add your first website to get started!
                    </Alert>
                ) : (
                    <Grid container spacing={3}>
                        {websites.map(website => (
                            <Grid item xs={12} sm={6} md={4} key={website.id}> {/* Changed from _id to id */}
                                <StatusCard 
                                    website={website} 
                                    onDelete={handleWebsiteDelete} 
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
            
            {/* Footer */}
            <Box 
                component="footer" 
                sx={{ 
                    py: 3, 
                    mt: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255, 255, 255, 0.12)'
                }}
            >
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Made with ❤️ by 
                    <Link 
                        href="https://github.com/Guru322" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        sx={{ 
                            display: 'inline-flex', 
                            alignItems: 'center',
                            fontWeight: 600,
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        GURU
                        <GitHubIcon fontSize="small" sx={{ ml: 0.5 }} />
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Dashboard;