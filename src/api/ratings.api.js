import axios from 'axios';
const baseURL = `${import.meta.env.VITE_PROJECTS_API}/api`;

// only doing it for the requests on this file
const setAuthorizationHeaders = () => {
  axios.interceptors.request.use(config => {
    // retrieve the token from localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  });
};

setAuthorizationHeaders();

export const newRating = rating => {
  return axios.post(`${baseURL}/ratings`, rating);
};

export const getRating = id => {
  return axios.get(`${baseURL}/ratings/${id}`);
};
