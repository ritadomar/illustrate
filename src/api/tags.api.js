import axios from 'axios';
const baseURL = `${import.meta.env.VITE_PROJECTS_API}/api`;

export const getTags = () => {
  return axios.get(`${baseURL}/tags`);
};

export const getTag = id => {
  return axios.get(`${baseURL}/tags/${id}`);
};
