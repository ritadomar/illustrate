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

export const getProfile = username => {
  return axios.get(`${baseURL}/profiles/${username}`);
};

export const updateProfile = updatedProfile => {
  return axios.put(
    `${baseURL}/profiles/${updatedProfile.username}`,
    updatedProfile
  );
};

export const deleteProfile = username => {
  return axios.delete(`${baseURL}/profiles/${username}`);
};
