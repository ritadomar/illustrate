/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { exchangeRates as exchangeRatesApi } from '../api/currency.api';

const CurrencyContext = createContext();

const CurrencyProviderWrapper = props => {
  const [currency, setCurrency] = useState({ name: 'EUR', exchangeRate: 1 });
  const [exchangeRates, setExchangeRates] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('€');

  const getExchangeRates = async () => {
    const response = await exchangeRatesApi(currency.name);
    const currencyArray = [];
    for (const [key, value] of Object.entries(response.data.data)) {
      currencyArray.push({ name: key, exchangeRate: value });
    }
    setExchangeRates(currencyArray);
  };

  const changeCurrency = () => {
    switch (currency.name) {
      case 'EUR':
        setCurrencySymbol('€');
        break;
      case 'CAD':
        setCurrencySymbol('CA$');
        break;
      case 'GBP':
        setCurrencySymbol('£');
        break;
      case 'USD':
        setCurrencySymbol('US$');
        break;
    }
  };

  useEffect(() => {
    getExchangeRates();
  }, []);

  useEffect(() => {
    changeCurrency();
  }, [currency]);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRates,
        setExchangeRates,
        currencySymbol,
      }}
    >
      {props.children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext, CurrencyProviderWrapper };
