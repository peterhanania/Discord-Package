import React, { useState, useMemo } from "react";
import Utils from "./index";

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
  const [dataExtracted, setDataExtracted] = useState(
    Utils.generateRandomData()
  );

  const value = useMemo(
    () => ({
      dataExtracted,
      setDataExtracted,
    }),
    [dataExtracted]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
