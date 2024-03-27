import { Dropdown } from 'primereact/dropdown';
import { useContext, useState, useEffect } from 'react';
import { CurrencyContext } from '../context/currency.context';

function CurrencyDropdown() {
  const { currency, setCurrency, exchangeRates, setExchangeRates } =
    useContext(CurrencyContext);

  return (
    <>
      {console.log(currency, exchangeRates)}
      {currency && exchangeRates && (
        <Dropdown
          value={currency}
          onChange={e => setCurrency(e.value)}
          options={exchangeRates}
          optionLabel="name"
          className="w-full md:w-14rem"
        />
      )}
    </>
  );
}

export default CurrencyDropdown;
