/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';

const StyleContext = createContext();

const StyleProviderWrapper = props => {
  const [navTheme, setNavTheme] = useState('light');

  return (
    <StyleContext.Provider
      value={{
        navTheme,
        setNavTheme,
      }}
    >
      {props.children}
    </StyleContext.Provider>
  );
};

export { StyleContext, StyleProviderWrapper };
