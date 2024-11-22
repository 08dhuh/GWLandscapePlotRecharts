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
    //ReferenceLineProps,
    ScatterChart,
    Scatter,
    ZAxis,
    ReferenceArea,
} from "recharts";
import propTypes from 'prop-types';
import { filterData, tickExpFormatter, getReferenceLineSegment, getReferenceRangeType } from '../../utils/utils';
import { units } from "../../config/dataConfig";


const DEFAULT_ZOOM = { x1: null, y1: null, x2: null, y2: null };
const xDomain = [1000, 10e6];
const yDomain = [10e-11, 10e6];
const radii = [ 1e-9,  1e-6,  0.001, 1,  1000, ];

const initialState = {
    left: xDomain[0],
    right: xDomain[1],
    refAreaLeft: '',
    refAreaRight: '',
    bottom: yDomain[0],
    top: yDomain[1],
    animation: false,
};

const Rformatter = props => {
    // const superscript = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    // const minus = '⁻';
    // const toSuper = n => `${n}`.split('').map(m =>
    //     m === '-' ? minus : superscript[m]
    // ).join('');
    const [base, exponent] = props.num.toExponential().split('e').map(n => parseFloat(n));
    //return <>R<sub>&#8857;</sub><sup>exponent</sup></>;
    return exponent;
}

export default function RenderHRDiagram(props) {
    const { divStyle, syncId, data1, data2 } = props;
    const [filteredData1, setFilteredData1] = useState([...data1]);
    const [filteredData2, setFilteredData2] = useState([...data2]);
    const [zoomArea, setZoomArea] = useState(DEFAULT_ZOOM);
    const [isZooming, setIsZooming] = useState(false);
    const isZoomed = filteredData1?.length !== data1?.length || filteredData2?.length !== data2?.length;
    //const {left, right, top, bottom} = initialState;
    const [left, setLeft] = useState(initialState.left);
    const [right, setRight] = useState(initialState.right);
    const [top, setTop] = useState(initialState.top);
    const [bottom, setBottom] = useState(initialState.bottom);

    const drawReferenceLine = (R, xDomain, yDomain, style = null) => {
        return <ReferenceLine
            label={`${R} R_sun`}
            stroke="gray"
            strokeDasharray="3 3"
            position="start"
            segment={getReferenceLineSegment(R, xDomain, yDomain)} 
            />;
    }

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

            const dataPointsInRange1 = filterData(filteredData1, 'Temperature', 'Luminosity', x1, x2, y1, y2);
            const dataPointsInRange2 = filterData(filteredData2, 'Temperature', 'Luminosity', x1, x2, y1, y2);

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
        }
    };

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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    allowDataOverflow
                    dataKey='Temperature'
                    name="Temperature"
                    type="number"
                    scale='log'
                    reversed={true} //uncomment later
                    domain={[left, right]}
                    tickCount={4}
                    tickFormatter={tickExpFormatter}
                    ticks={[1000, 10000, 100000, 1000000]}
                >
                    <Label value="Temperature(K)" position="bottom" offset={0} />
                </XAxis>
                <YAxis
                    allowDataOverflow
                    dataKey='Luminosity'
                    name="Luminosity"
                    type="number"
                    scale='log'
                    tickFormatter={tickExpFormatter}
                    domain={[bottom, top]}
                    label={{
                        value: `Luminosity/L\u{2299}`,
                        angle: -90,
                        position: 'insideLeft',
                        textAnchor: 'middle',
                        offset: -7
                    }}
                    padding={{ bottom: 10 }} />
                <ZAxis
                    dataKey='time'
                    name='time'
                    type='number'
                />
                <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={HRTooltipFormatter}
                />
                <Legend wrapperStyle={{ paddingLeft: "40px" }} layout="vertical" align="right" verticalAlign="top" />

                {radii.filter(r=> getReferenceRangeType(r, xDomain, yDomain)).map(r=> {return drawReferenceLine(r, xDomain, yDomain)})}
                <Scatter
                    name='Star1'
                    data={filteredData1}
                    line={{ strokeWidth: 2 }}
                    fill="red"
                    radius={2}
                />
                <Scatter
                    name='Star2'
                    data={filteredData2}
                    line={{ strokeWidth: 2 }}
                    fill="blue"
                />
                <ReferenceArea
                    x1={zoomArea?.x1}
                    x2={zoomArea?.x2}
                    y1={zoomArea?.y1}
                    y2={zoomArea?.y2}
                />


            </ScatterChart>
        </ResponsiveContainer>
    </div>);
}
const HRTooltipFormatter = (value, name) => {
    return <>{value} {units[name]}</>;
}


// RenderHRDiagram.propTypes = {
//     data1: propTypes.array.isRequired,
//     data2: propTypes.array.isRequired,
//     syncId: propTypes.string,
// }

