import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  withCredentials: true,           // send cookies/session
  timeout: 15000
});

// Add postMultipart method for file uploads
api.postMultipart = (url, formData, config = {}) => {
  return api.post(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config.headers
    }
  });
};

export default api;
