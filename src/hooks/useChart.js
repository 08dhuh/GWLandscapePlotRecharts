import { useState } from "react";

export const useChart = (initialDomain) => {
  const [domain, setDomain] = useState(initialDomain);

  const adjustDomain = (area) => {
    setDomain(() => ({ x1: area.x1, x2: area.x2, y1: area.y1, y2: area.y2 }));
  };

  return { domain, adjustDomain };
};


//import { useChart } from "../hooks/useChart";

// const initialDomain = { x1: "auto", x2: "auto", y1: "auto", y2: "auto" };
// const { domain, adjustDomain } = useChart(initialDomain);
