import { useState } from "react";
import { translateChartYtoCoordY, hasYDataInXRange } from "../utils/chartUtils";

const DEFAULT_ZOOM = { x1: null, y1: null, x2: null, y2: null };

export const useZoomHandler = ({ data, xkey, adjustDomain, initialDomain, yconst, scaleType }) => {
    
    const [zoomArea, setZoomArea] = useState(DEFAULT_ZOOM);
    const [isZooming, setIsZooming] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const handleMouseDown = (e) => {
        const { activeLabel, chartY } = e || {};
        if (!activeLabel || !chartY) return;

        setIsZooming(true);
        const xValue = activeLabel;
        const yValue = translateChartYtoCoordY(chartY, yconst, scaleType);
        setZoomArea({ x1: xValue, y1: yValue, x2: xValue, y2: yValue });
    };

    const handleMouseMove = (e) => {
        const { activeLabel, chartY } = e || {};
        if (isZooming) {
            const xValue = activeLabel;
            const yValue = translateChartYtoCoordY(chartY, yconst, scaleType);
            setZoomArea((prev) => ({ ...prev, x2: xValue, y2: yValue }));
        }
    };

    const handleMouseUp = (e) => {
        if (!isZooming) return;

        let { x1, y1, x2, y2 } = zoomArea;
        if (x1 > x2) [x1, x2] = [x2, x1];
        if (y1 > y2) [y1, y2] = [y2, y1];

        const xDataInRange = data.filter((d) => d[xkey] >= x1 && d[xkey] <= x2);
        if (hasYDataInXRange(xDataInRange, y1, y2)) {
            adjustDomain({ x1, y1, x2, y2 });
            setIsZoomed(true);
        } else {
            console.log("No Y-data in the specified range. Zoom cancelled.");
        }

        setZoomArea(DEFAULT_ZOOM);
        setIsZooming(false);
    };

    const handleZoomOut = () => {
        setZoomArea(DEFAULT_ZOOM);
        adjustDomain(initialDomain);
        setIsZoomed(false);
    };

    return {
        zoomArea,
        isZooming,
        isZoomed,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleZoomOut,
    };
};
