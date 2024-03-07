import axios from 'axios';
const baseURL = `${import.meta.env.VITE_PROJECTS_API}/auth`;

export const signUp = user => {
  return axios.post(`${baseURL}/signup`, user);
};

export const logIn = user => {
  return axios.post(`${baseURL}/login`, user);
};

// send the jtw token in the authorization headers
export const verify = storedToken => {
  return axios.get(`${baseURL}/verify`, {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  });
};
