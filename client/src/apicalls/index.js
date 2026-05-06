import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: "https://quizbackend.enego.co.in",
    headers: {
         Authorization : `Bearer ${localStorage.getItem('token')}`
    }
});

export default axiosInstance;