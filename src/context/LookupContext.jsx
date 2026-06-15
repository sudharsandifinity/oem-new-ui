import { createContext, useContext, useState } from 'react';

const LookupContext = createContext(null);

export function LookupProvider({ children }) {
  const [lookupConfig, setLookupConfig] = useState(null);

  const openLookup = (config) => {
    setLookupConfig({
      ...config,
      open: true
    });
  };

  const closeLookup = () => {
    setLookupConfig(null);
  };

  return (
    <LookupContext.Provider
      value={{
        lookupConfig,
        openLookup,
        closeLookup
      }}
    >
      {children}
    </LookupContext.Provider>
  );
}

export const useLookup = () => {
  const context = useContext(LookupContext);

  if (!context) {
    throw new Error('useLookup must be used inside LookupProvider');
  }

  return context;
};
