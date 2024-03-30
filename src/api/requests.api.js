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

export const getAllRequests = id => {
  return axios.get(`${baseURL}/requests/user/${id}`);
};

export const getRequest = id => {
  return axios.get(`${baseURL}/requests/${id}`);
};

export const newRequest = request => {
  return axios.post(`${baseURL}/requests`, request);
};

export const updateRequest = updatedRequest => {
  return axios.put(`${baseURL}/requests/${updatedRequest._id}`, updatedRequest);
};

export const deleteRequest = id => {
  return axios.delete(`${baseURL}/requests/${id}`);
};
