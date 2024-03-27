import { Dropdown } from 'primereact/dropdown';
import { useContext } from 'react';
import { CurrencyContext } from '../context/currency.context';

function CurrencyDropdown() {
  const { currency, setCurrency, exchangeRates } = useContext(CurrencyContext);

  return (
    <>
      {console.log(currency, exchangeRates)}
      {currency && exchangeRates && (
        <Dropdown
          value={currency}
          onChange={e => setCurrency(e.value)}
          options={exchangeRates}
          optionLabel="displayName"
        />
      )}
    </>
  );
}

export default CurrencyDropdown;
