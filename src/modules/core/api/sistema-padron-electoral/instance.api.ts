import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_PADRON_URL,
    headers: {
    },
    withCredentials: true,
});

export default instance; 