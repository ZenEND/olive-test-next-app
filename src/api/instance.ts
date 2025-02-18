import axios from 'axios'
import { message } from 'antd';

export const axiosInstance = axios.create({
  baseURL: 'api',
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
  }
})

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      message.error('Unauthorized access. Please log in again.');
      // Optionally, you can redirect to the login page or perform other actions
    }
    return Promise.reject(error);
  });