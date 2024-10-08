import axios from "axios";

const token = localStorage.getItem('token')

const axiosInstance = axios.create({
    baseURL: 'https://example.com',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
})

export default axiosInstance;