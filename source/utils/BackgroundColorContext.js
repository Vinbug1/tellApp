import React, { createContext, useState, useContext } from 'react';

// Create a Context for the background color
const BackgroundColorContext = createContext();

export const useBackgroundColor = () => useContext(BackgroundColorContext);

// Create a provider component
export const BackgroundColorProvider = ({ children }) => {
  const [backgroundColor, setBackgroundColor] = useState('#fff');

  return (
    <BackgroundColorContext.Provider value={{ backgroundColor, setBackgroundColor }}>
      {children}
    </BackgroundColorContext.Provider>
  );
};
