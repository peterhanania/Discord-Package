import React, { useState, useMemo } from "react";
import Utils from "./index";

export const DataContext = React.createContext<any | null>(null);

export const DataProvider = ({ children }: any) => {
	const [dataExtracted, setDataExtracted] = useState(
		Utils.generateRandomData(),
	);

	const value = useMemo(
		() => ({
			dataExtracted,
			setDataExtracted,
		}),
		[dataExtracted],
	);

	return (
		<DataContext.Provider value={value}>{children}</DataContext.Provider>
	);
};
