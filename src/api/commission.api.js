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

export const getAllCommissions = () => {
  return axios.get(`${baseURL}/commissions`);
};

export const getCommission = id => {
  return axios.get(`${baseURL}/commissions/${id}`);
};

export const addCommission = commission => {
  return axios.post(`${baseURL}/commissions`, commission);
};

export const updateCommission = updatedCommission => {
  return axios.put(
    `${baseURL}/commissions/${updatedCommission._id}`,
    updatedCommission
  );
};

export const deleteCommission = id => {
  return axios.delete(`${baseURL}/commissions/${id}`);
};
