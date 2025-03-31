import React, { useState, useEffect } from 'react';
import { fetchPingResults, deleteWebsite } from '../services/api';
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Chip, 
    Skeleton, 
    Divider,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Tooltip,
    Zoom
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import SpeedIcon from '@mui/icons-material/Speed';

const StatusCard = ({ website, onDelete }) => {
    const [latestPing, setLatestPing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [highlight, setHighlight] = useState(false);

    useEffect(() => {
        const getLatestPing = async () => {
            try {
                setLoading(true);
                const results = await fetchPingResults(website._id);
                if (results && results.length > 0) {
                    setLatestPing(prev => {
                        if (prev && prev.isUp !== results[0].isUp) {
                            // Status changed, trigger highlight animation
                            setHighlight(true);
                            setTimeout(() => setHighlight(false), 2000);
                        }
                        return results[0];
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching ping results:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        getLatestPing();
        const interval = setInterval(getLatestPing, 30000);
        return () => clearInterval(interval);
    }, [website._id]);

    useEffect(() => {
        if (highlight) {
            const timer = setTimeout(() => setHighlight(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [highlight]);

    const handleDeleteClick = () => {
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setDeleteLoading(true);
            await deleteWebsite(website._id);
            setOpenConfirmDialog(false);
            if (onDelete) {
                onDelete(website._id);
            }
        } catch (err) {
            setError('Failed to delete website');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setOpenConfirmDialog(false);
    };

    const getResponseTimeColor = (time) => {
        if (time === undefined) return 'text.secondary';
        if (time < 300) return 'success.main'; // Fast
        if (time < 1000) return 'warning.main'; // Medium
        return 'error.main'; // Slow
    };

    if (loading) return (
        <Card sx={{ height: '100%', backgroundColor: 'background.card' }}>
            <CardContent>
                <Skeleton variant="text" height={36} width="70%" sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} width="90%" />
                <Box mt={2}>
                    <Skeleton variant="rounded" height={32} width={100} />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" height={24} />
            </CardContent>
        </Card>
    );
    
    return (
        <>
            <Card 
                sx={{ 
                    height: '100%',
                    borderLeft: latestPing?.isUp ? '4px solid #03dac6' : '4px solid #cf6679',
                    position: 'relative',
                    transition: 'all 0.5s ease',
                    transform: highlight ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: highlight 
                        ? '0 10px 20px rgba(0,0,0,0.4)' 
                        : '0 8px 16px rgba(0,0,0,0.2)',
                }}
            >
                <CardContent>
                    {/* Website info section */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Tooltip title={website.url} placement="top" arrow>
                            <Typography variant="h6" component="h2" gutterBottom noWrap sx={{ maxWidth: '80%' }}>
                                {website.name || website.url}
                            </Typography>
                        </Tooltip>
                        <Tooltip title="Delete Website" arrow>
                            <IconButton
                                size="small"
                                aria-label="delete website"
                                onClick={handleDeleteClick}
                                sx={{ 
                                    color: 'text.secondary',
                                    '&:hover': { 
                                        color: 'error.main',
                                        backgroundColor: 'rgba(207, 102, 121, 0.1)' 
                                    }
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        gutterBottom 
                        sx={{ 
                            wordBreak: 'break-all',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {website.url}
                    </Typography>
                    
                    <Box mt={2}>
                        <Chip 
                            icon={latestPing?.isUp ? <CheckCircleIcon /> : <ErrorIcon />}
                            label={latestPing ? (latestPing.isUp ? 'Online' : 'Offline') : 'Unknown'}
                            color={latestPing?.isUp ? 'success' : 'error'}
                            size="small"
                            sx={{ 
                                fontWeight: 600,
                                animation: highlight ? 'pulse 1.5s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%': { boxShadow: '0 0 0 0 rgba(3, 218, 198, 0.4)' },
                                    '70%': { boxShadow: '0 0 0 10px rgba(3, 218, 198, 0)' },
                                    '100%': { boxShadow: '0 0 0 0 rgba(3, 218, 198, 0)' },
                                }
                            }}
                        />
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {/* Last check time */}
                    <Box display="flex" alignItems="center" mt={1}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                        <Typography variant="body2" color="text.secondary">
                            {latestPing?.timestamp ? new Date(latestPing.timestamp).toLocaleString() : 'Not checked yet'}
                        </Typography>
                    </Box>
                    
                    {/* Response time with color indicator */}
                    <Box display="flex" alignItems="center" mt={1}>
                        <SpeedIcon 
                            fontSize="small" 
                            sx={{ 
                                mr: 1, 
                                opacity: 0.7,
                                color: getResponseTimeColor(latestPing?.responseTime)
                            }} 
                        />
                        <Typography 
                            variant="body2" 
                            sx={{ color: getResponseTimeColor(latestPing?.responseTime) }}
                        >
                            {latestPing?.responseTime !== undefined ? `${latestPing.responseTime} ms` : 'N/A'}
                        </Typography>
                    </Box>
                    
                    {latestPing?.error && (
                        <Typography variant="body2" color="error.main" mt={1} sx={{ fontWeight: 500 }}>
                            Error: {latestPing.error}
                        </Typography>
                    )}

                    {error && (
                        <Typography variant="body2" color="error.main" mt={1}>
                            {error}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                TransitionComponent={Zoom}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Website?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to stop monitoring {website.name || website.url}?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button 
                        onClick={handleCancelDelete} 
                        color="primary"
                        disabled={deleteLoading}
                        sx={{ 
                            borderRadius: 2,
                            textTransform: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        color="error" 
                        variant="contained"
                        autoFocus
                        disabled={deleteLoading}
                        sx={{ 
                            borderRadius: 2,
                            textTransform: 'none'
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StatusCard;