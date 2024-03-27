import axios from 'axios';
const baseURL = `https://api.freecurrencyapi.com/v1/latest?apikey=${
  import.meta.env.VITE_CURRENCY_API
}`;

export const exchangeRates = currency => {
  return axios.get(
    `${baseURL}&currencies=EUR%2CUSD%2CCAD%2CGBP&base_currency=${currency}`
  );
};
