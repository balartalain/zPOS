import React, { createContext, useContext, useState } from 'react';

const HeaderContext = createContext();

export function HeaderProvider({ children }) {
  const [headerContent, setHeaderContent] = useState('');
  const [headerActions, setHeaderActions] = useState(null);

  return (
    <HeaderContext.Provider
      value={{
        headerContent,
        setHeaderContent,
        headerActions,
        setHeaderActions,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  return useContext(HeaderContext);
}
