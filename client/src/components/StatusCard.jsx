import React, { useState, useEffect } from 'react';
import { fetchPingResults } from '../services/api';

const StatusCard = ({ website }) => {
    const [latestPing, setLatestPing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getLatestPing = async () => {
            try {
                setLoading(true);
                const results = await fetchPingResults(website._id);
                if (results && results.length > 0) {
                    setLatestPing(results[0]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching ping results:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        getLatestPing();
        // Set up polling every 30 seconds
        const interval = setInterval(getLatestPing, 30000);
        return () => clearInterval(interval);
    }, [website._id]);

    if (loading) return <div className="status-card loading">Loading status...</div>;
    
    return (
        <div className={`status-card ${latestPing?.isUp ? 'online' : 'offline'}`}>
            <h3>{website.name || website.url}</h3>
            <p>URL: {website.url}</p>
            <p>Status: {latestPing ? (latestPing.isUp ? 'Online' : 'Offline') : 'Unknown'}</p>
            <p>Last Checked: {latestPing?.timestamp ? new Date(latestPing.timestamp).toLocaleString() : 'Not checked yet'}</p>
            <p>Response Time: {latestPing?.responseTime !== undefined ? `${latestPing.responseTime} ms` : 'N/A'}</p>
            {latestPing?.error && <p className="error">Error: {latestPing.error}</p>}
        </div>
    );
};

export default StatusCard;