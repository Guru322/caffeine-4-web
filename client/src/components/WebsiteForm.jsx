import React, { useState } from 'react';
import { addWebsite } from '../services/api';

const WebsiteForm = () => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!url) {
            setError('Website URL is required');
            return;
        }

        try {
            await addWebsite({ url });
            setUrl('');
        } catch (err) {
            setError('Failed to add website. Please try again.');
        }
    };

    return (
        <div>
            <h2>Add a Website to Monitor</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL"
                    required
                />
                <button type="submit">Add Website</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default WebsiteForm;