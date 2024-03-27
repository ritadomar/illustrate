/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { exchangeRates as exchangeRatesApi } from '../api/currency.api';

const CurrencyContext = createContext();

const CurrencyProviderWrapper = props => {
  const [currency, setCurrency] = useState({
    name: 'EUR',
    displayName: '€EUR',
    exchangeRate: 1,
    symbolNative: '€',
  });
  const [exchangeRates, setExchangeRates] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('€');

  const getExchangeRates = async () => {
    const response = await exchangeRatesApi(currency.name);
    const currencyArray = [];
    for (const [key, value] of Object.entries(response.data.data)) {
      let addCurrencySymbol = '';
      switch (key) {
        case 'EUR':
          addCurrencySymbol = '€';
          break;
        case 'CAD':
        case 'USD':
          addCurrencySymbol = '$';
          break;
        case 'GBP':
          addCurrencySymbol = '£';
          break;
      }
      currencyArray.push({
        name: key,
        displayName: addCurrencySymbol + key,
        exchangeRate: value,
        symbolNative: addCurrencySymbol,
      });
    }
    setExchangeRates(currencyArray);
  };

  const changeCurrency = currency => {
    if (currency.name === 'USD') {
      setCurrencySymbol('US' + currency.symbolNative);
    } else if (currency.name === 'CAD') {
      setCurrencySymbol('CA' + currency.symbolNative);
    } else {
      setCurrencySymbol(currency.symbolNative);
    }
  };

  useEffect(() => {
    getExchangeRates();
  }, []);

  useEffect(() => {
    changeCurrency(currency);
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
