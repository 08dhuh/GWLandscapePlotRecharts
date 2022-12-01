//

import React, { useState } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
    ReferenceLine,
    ReferenceLineProps,
    ScatterChart,
    Scatter,
    ZAxis,
    ReferenceArea
} from "recharts";

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

export default function PlotScatterZoom(props) { //should pass set-domain properties

    const { divStyle, syncId, data1, data2, initialState, adjustDomain } = props;
    const [filteredData1, setFilteredData1] = useState([...data1]);
    const [filteredData2, setFilteredData2] = useState([...data2]);
    const [zoomArea, setZoomArea] = useState(DEFAULT_ZOOM);
    const [isZooming, setIsZooming] = useState(false);
    const isZoomed = filteredData1?.length !== data1?.length || filteredData2?.length !== data2?.length;
    //const {left, right, top, bottom} = initialState;
    // const [left, setLeft] = useState(initialState.left);
    // const [right, setRight] = useState(initialState.right);
    // const [top, setTop] = useState(initialState.top);
    // const [bottom, setBottom] = useState(initialState.bottom);
    //const MIN_ZOOM = 50; // adjust based on your data
    const DEFAULT_ZOOM = { x1: null, y1: null, x2: null, y2: null };

    const showZoomBox =
        isZooming &&
        !(Math.abs(zoomArea.x1 - zoomArea.x2) < MIN_ZOOM) &&
        !(Math.abs(zoomArea.y1 - zoomArea.y2) < MIN_ZOOM);

    const handleZoomOUt = () => {
        setFilteredData1([...data1]);
        setFilteredData2([...data2]);
        setZoomArea(DEFAULT_ZOOM);
        setLeft(initialState.left);
        setRight(initialState.right);
        setTop(initialState.top);
        setBottom(initialState.bottom);
    };

    const handleMouseDown = e => {
        const { xValue, yValue } = e || {};
        if (!xValue || !yValue) return;
        setIsZooming(true);
        setZoomArea({ x1: xValue, y1: yValue, x2: xValue, y2: yValue });
        //comment out after testing
        // console.log("handleMouseDown called");
        // console.log(xValue, yValue);
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
            setIsZooming(false);
            setZoomArea(DEFAULT_ZOOM);
            // ensure x1 <= x2 and y1 <= y2
            if (x1 > x2) [x1, x2] = [x2, x1];
            if (y1 > y2) [y1, y2] = [y2, y1];

            // if (x2 - x1 < MIN_ZOOM || y2 - y1 < MIN_ZOOM) {
            //     console.log("zoom cancel");
            // } else {
            // console.log("zoom stop");
            const dataPointsInRange1 = filteredData1.filter(
                (d) => d['Temperature'] >= x1 && d['Temperature'] <= x2 && d['Luminosity'] >= y1 && d['Luminosity'] <= y2
            );
            const dataPointsInRange2 = filteredData2.filter(
                (d) => d['Temperature'] >= x1 && d['Temperature'] <= x2 && d['Luminosity'] >= y1 && d['Luminosity'] <= y2
            );
            if (dataPointsInRange1.length || dataPointsInRange2.length) {
                console.log(dataPointsInRange1.length, dataPointsInRange2.length);
                setLeft(x1);
                setRight(x2);
                setTop(y2);
                setBottom(y1);
                setFilteredData1(dataPointsInRange1);
                setFilteredData2(dataPointsInRange2);
            } else {
                console.log("zoom cancel");
            }
            //setZoomArea(DEFAULT_ZOOM);
            // }
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
            <ScatterChart
                width={700}
                height={300}
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
                <Scatter
                    name='Star1'
                    data={filteredData1}
                    line={{ strokeWidth: 2 }}
                    fill="red"
                />
                <Scatter
                    name='Star2'
                    data={filteredData2}
                    line={{ strokeWidth: 2 }}
                    fill="blue"
                />


            </ScatterChart>
        </ResponsiveContainer>
    </div>);
}