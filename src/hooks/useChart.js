import { useState } from "react";

export const useChart = (xDomain, yDomain) => {

  const initialDomain = { x1: xDomain[0], x2: xDomain[1], y1: yDomain[0], y2: yDomain[1] };
  const [domain, setDomain] = useState(initialDomain);

  const adjustDomain = (area) => {
    setDomain(() => ({ x1: area.x1, x2: area.x2, y1: area.y1, y2: area.y2 }));
  };

  return { initialDomain, domain, adjustDomain };
};



