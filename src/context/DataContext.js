import React, { createContext, useState, useEffect, useContext } from "react";
import { serverDataPath } from "../config/dataConfig";
import { processData } from "../utils/dataUtils";
import { fetchData } from "../services/dataFetchService";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [dataBank, setDataBank] = useState({
    mass: null,
    length: null,
    vdh: null,
    hr: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        //console.log("Starting data fetch...");
        const serverData = await fetchData(serverDataPath);
        //console.log("Server data fetched successfully:", serverData);

        const processedData = {
          mass: processData(serverData, "mass"),
          length: processData(serverData, "length"),
          vdh: processData(serverData, "vdh"),
          hr: processData(serverData, "hr"),
        };
        console.log('Processed data:', processedData);

        setDataBank(processedData);
      } catch (e) {
        console.error("Fetching data failed", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ dataBank, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};


export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
