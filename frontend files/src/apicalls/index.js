import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://quizbackend.enego.in",
    headers: {
         Authorization : `Bearer ${localStorage.getItem('token')}`
    }
});

export default axiosInstance;
