import axios from 'axios';

const API_URL = 'localhost:5000/api'; 

export const fetchWebsites = async () => {
    try {
        const response = await axios.get(`${API_URL}/websites`);
        return response.data;
    } catch (error) {
        console.error('Error fetching websites:', error);
        throw error;
    }
};

export const addWebsite = async (website) => {
    try {
        const response = await axios.post(`${API_URL}/websites`, website);
        return response.data;
    } catch (error) {
        console.error('Error adding website:', error);
        throw error;
    }
};

export const fetchPingResults = async (websiteId) => {
    try {
        const response = await axios.get(`${API_URL}/websites/${websiteId}/ping-results`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ping results:', error);
        throw error;
    }
};

/**
 * Delete a website from monitoring
 * @param {string} websiteId - The ID of the website to delete
 * @returns {Promise} - Promise representing the delete operation
 */
export const deleteWebsite = async (websiteId) => {
    try {
        const response = await axios.delete(`${API_URL}/websites/${websiteId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting website:', error);
        throw error;
    }
};