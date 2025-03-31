import axios from 'axios';

const API_URL = 'http://localhost:5000/api/websites';

export const addWebsite = async (website) => {
    try {
        const response = await axios.post(API_URL, website);
        return response.data;
    } catch (error) {
        throw new Error('Error adding website: ' + error.message);
    }
};

export const getWebsites = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching websites: ' + error.message);
    }
};