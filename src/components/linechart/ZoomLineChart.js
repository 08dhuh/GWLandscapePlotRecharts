import React, { useState, useRef, useCallback, useEffect } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    ReferenceArea,
    Tooltip
} from "recharts";

import { useZoomHandler } from "../../hooks/useZoomHandler";
import { getTwoPoints, getYconstsLinear, getYconstsLog } from "../../utils/lineChartUtils";


export default function ZoomLineChart(props) { //should be passed x & y domain properties
    //adjustDomain: since x and y axes are called from the parent components
    const { divStyle,
        syncId,
        data,
        xkey,
        ykeys,
        initialState,
        adjustDomain,
        strokeStyle,
        alias,
        scaleType,
        children,
        yunit } = props;


    const [yconst, setYconst] = useState(null);
    const { 
        zoomArea,
        isZoomed,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleZoomOut,
    } = useZoomHandler({
        data,
        xkey,
        adjustDomain,
        initialDomain: initialState,
        scaleType,
        yconst,
    });    


    
    const Linechartload = useCallback(() => {
        if (!Line1?.current) return;
        const points = Line1.current.props?.points;
        if (!points) return;
    
        const twopoints = getTwoPoints(points);
        if (twopoints) {
            const [p1, p2] = twopoints;
            const yConstants =
                scaleType === "Linear" ? getYconstsLinear(p1, p2) : getYconstsLog(p1, p2);
            setYconst(yConstants);
        }
    }, [scaleType]); 

    useEffect(() => {
        if (ToolTip.current) {
        }
    });

    const Line1 = useRef();
    const ToolTip = useRef();


    const drawLine = (dataKey, alias = null, style, type = null, dot = false) => {
        if (dataKey === 'time') return;
        return (<Line
            id={dataKey}
            type={type || "monotone"}
            dataKey={dataKey}
            name={alias}
            {...style}
            dot={dot}
            ref={Line1 ? Line1 : null} //There should be new logic to get two datapoints from the plot
        />);

    }

    return (<div style={divStyle || {
        width: "973px",
        height: "400px",
        backgroundColor: "white"
    }}>
        {isZoomed && <button onClick={handleZoomOut}>Zoom Out</button>}

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
                ref={Linechartload}
            >
                {children}
                {ykeys.map(key => { return drawLine(key, alias[key], strokeStyle[key]); })}
                <ReferenceArea
                    x1={zoomArea?.x1}
                    x2={zoomArea?.x2}
                    y1={zoomArea?.y1}
                    y2={zoomArea?.y2}
                />
                <Tooltip
                    allowEscapeViewBox={{ x: false, y: false }}

                    ref={ToolTip}
                    formatter={value => <>{value.toFixed(4)} {yunit}</>}

                    labelFormatter={label => `Time : ${label} Myr`}

                    filterNull={false}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>);
}
