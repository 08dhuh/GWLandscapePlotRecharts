import React, { createContext, useContext, useState } from "react";

const ChartContext = createContext();

export const ChartProvider = ({ children }) => {

    const xDomain = ['auto', dataMax => (dataMax * 1.1)];
    const yDomain = ['auto', 'dataMax'];
    const initialDomain = { x1: xDomain[0], x2: xDomain[1], y1: yDomain[0], y2: yDomain[1] };
    
    const [domain, setDomain] = useState(initialDomain);

    const adjustDomain = (area) => {
        setDomain((prev) => ({
            ...prev,
            x1: area.x1,
            x2: area.x2,
            y1: area.y1,
            y2: area.y2,
        }));
    };



    const value = { domain, adjustDomain };

    return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>;
};

export const useChartContext = () => {
    const context = useContext(ChartContext);
    if (!context) {
        throw new Error("useChartContext must be used within a ChartProvider");
    }
    return context;
};
