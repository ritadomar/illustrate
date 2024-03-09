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

export const getAllArtworks = () => {
  return axios.get(`${baseURL}/artworks`);
};

export const getArtwork = id => {
  return axios.get(`${baseURL}/artworks/${id}`);
};

export const addArtwork = artwork => {
  return axios.post(`${baseURL}/artworks`, artwork);
};

export const updateArtwork = updatedArtwork => {
  return axios.put(`${baseURL}/artworks/${updatedArtwork._id}`, updatedArtwork);
};

export const deleteArtwork = id => {
  return axios.delete(`${baseURL}/artworks/${id}`);
};
