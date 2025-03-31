import React, { useEffect, useState } from 'react';
import { fetchWebsites } from '../services/api';
import StatusCard from './StatusCard';

const Dashboard = () => {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getWebsites = async () => {
            try {
                const data = await fetchWebsites();
                setWebsites(data);
            } catch (error) {
                console.error("Error fetching websites:", error);
            } finally {
                setLoading(false);
            }
        };

        getWebsites();
        const interval = setInterval(getWebsites, 30000);
        return () => clearInterval(interval); 
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Website Monitoring Dashboard</h1>
            <div className="status-cards">
                {websites.map(website => (
                    <StatusCard key={website._id} website={website} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;