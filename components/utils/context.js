import React, { useState, useMemo } from "react";

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
  const [dataExtracted, setDataExtracted] = useState(null);

  const value = useMemo(
    () => ({
      dataExtracted,
      setDataExtracted,
    }),
    [dataExtracted]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
