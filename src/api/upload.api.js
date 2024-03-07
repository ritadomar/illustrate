import axios from 'axios';
const baseURL = `${import.meta.env.VITE_PROJECTS_API}/api`;

export const upload = image => {
  return axios.post(`${baseURL}/upload`, image);
};
