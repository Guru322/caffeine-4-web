import React, { useState } from 'react';
import { addWebsite } from '../services/api';
import { Container, Typography, Box, TextField, Button, Alert, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const WebsiteForm = () => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!url) {
            setError('Website URL is required');
            return;
        }

        try {
            await addWebsite({ url });
            setSuccess('Website added successfully!');
            setUrl('');
        } catch (err) {
            setError('Failed to add website. Please try again.');
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                    Add a Website to Monitor
                </Typography>
                
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Website URL"
                            variant="outlined"
                            fullWidth
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            required
                            helperText="Enter the full URL including http:// or https://"
                            InputProps={{
                                sx: { borderRadius: 1.5 }
                            }}
                        />
                        
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            size="large"
                            startIcon={<AddIcon />}
                            sx={{ width: '200px', borderRadius: 1.5 }}
                        >
                            Add Website
                        </Button>
                    </Box>
                    
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {success}
                        </Alert>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default WebsiteForm;