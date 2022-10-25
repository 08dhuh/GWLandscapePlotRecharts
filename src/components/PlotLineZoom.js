import React, { useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    ReferenceArea
} from "recharts";
import { filterData } from "./Utils";

const scale = num => {
    return num.toExponential();
}

// const xDomain = [1000, 10e6];
// const yDomain = [10e-11, 10e6];

// const initialState = {
//     left: xDomain[0],
//     right: xDomain[1],
//     refAreaLeft: '',
//     refAreaRight: '',
//     bottom: yDomain[0],
//     top: yDomain[1],
//     animation: false,
// };
const DEFAULT_ZOOM = { x1: null, y1: null, x2: null, y2: null };

export default function PlotLineZoom(props) { //should be passed x & y domain properties
    //adjustDomain: since x and y axes are called from the parent components
    const { divStyle, 
        syncId, 
        data, 
        xkey, 
        ykeys, 
        initialState, 
        adjustDomain, 
        strokeStyle, 
        aliases, 
        children } = props;
    // const [filteredData1, setFilteredData1] = useState([...data1]);
    // const [filteredData2, setFilteredData2] = useState([...data2]);
    const [zoomArea, setZoomArea] = useState(DEFAULT_ZOOM);
    const [isZooming, setIsZooming] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    //const isZoomed = filteredData1?.length !== data1?.length || filteredData2?.length !== data2?.length;
    //const {left, right, top, bottom} = initialState;
    // const [left, setLeft] = useState(initialState.left);
    // const [right, setRight] = useState(initialState.right);
    // const [top, setTop] = useState(initialState.top);
    // const [bottom, setBottom] = useState(initialState.bottom);
    //const MIN_ZOOM = 50; // adjust based on your data


    const drawLine = (dataKey, alias = null, style, type = null, dot = false) => {
        if (dataKey === 'time') return;
        return (<Line
            id={dataKey}
            type={type || "monotone"}
            dataKey={dataKey}
            name={alias}
            {...style}
            dot={dot}
        />);
        //{...(stroke?{stroke:stroke}:{})}
    }

    const handleZoomOUt = () => {
        setZoomArea(DEFAULT_ZOOM);
        adjustDomain(initialState); //implement this
        setIsZoomed(false);
    };

    const handleMouseDown = e => {
        console.log("handleMouseDown called");
        console.log(Object.keys(e));        
        console.log("activeLabel:", e.activeLabel);
        console.log("activeCoordinate:", e.activeCoordinate);
        console.log("chartX:", e.chartX);
        console.log("chartY:", e.chartY);
        console.log("activePayload ",e.activePayload);
        console.log("activeTooltipIndex ",e.activeTooltipIndex);
        const { xValue, yValue } = e || {};
        //console.log(xValue, yValue);
        if (!xValue || !yValue) return;
        setIsZooming(true);
        setZoomArea({ x1: xValue, y1: yValue, x2: xValue, y2: yValue });
        //comment out after testing
    };

    const handleMouseMove = e => {
        if (isZooming) {
            setZoomArea((prev) => ({ ...prev, x2: e?.xValue, y2: e?.yValue }));
        }
    };

    
    const handleMouseUp = e => {
        if (isZooming) {
            console.log("handleMouseUp called");
            let { x1, y1, x2, y2 } = zoomArea;
            // ensure x1 <= x2 and y1 <= y2
            if (x1 > x2) [x1, x2] = [x2, x1];
            if (y1 > y2) [y1, y2] = [y2, y1];

            let hasDatainRange = ykeys.map(ykey => { return filterData(data, xkey, ykey, x1, x2, y1, y2).length; }).every(x => x);
            if (hasDatainRange) {
                adjustDomain(zoomArea);
                setIsZoomed(true);
            } else {
                console.log("zoom cancel");
            }
            //setZoomArea(DEFAULT_ZOOM);
            // }
            setIsZooming(false);
            setZoomArea(DEFAULT_ZOOM);
        }
    }

    return (<div style={divStyle || {
        width: "973px",
        height: "400px",
        backgroundColor: "white"
    }}>
        {isZoomed && <button onClick={handleZoomOUt}>Zoom Out</button>}

        <ResponsiveContainer width="80%"
            height="100%">
            <LineChart
                width={700}
                height={300}
                data={data}
                syncId={syncId}
                margin={{
                    top: 5,
                    right: 20,
                    left: 20,
                    bottom: 25,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {children}
                {ykeys.map(key => { return drawLine(key, aliases[key], strokeStyle[key]); })}
            </LineChart>
        </ResponsiveContainer>
    </div>);
}