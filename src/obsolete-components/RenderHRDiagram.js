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
import propTypes from 'prop-types';

const scale = num => {
    return num.toExponential();
}
const MIN_ZOOM = 50; // adjust based on your data
const DEFAULT_ZOOM = { x1: null, y1: null, x2: null, y2: null };
const xDomain = [1000, 10e6];
const yDomain = [10e-11, 10e6];

const initialState = {
    left: xDomain[0],
    right: xDomain[1],
    refAreaLeft: '',
    refAreaRight: '',
    bottom: yDomain[0],
    top: yDomain[1],
    animation: false,
};

export default function RenderHRDiagram(props) {
    const { divStyle, syncId } = props;
    const [data1, setData1] = useState([...props.data1]);
    const [data2, setData2] = useState([...props.data2]);
    const [filteredData1, setFilteredData1] = useState([...data1]);
    const [filteredData2, setFilteredData2] = useState([...data2]);
    const [zoomArea, setZoomArea] = useState(DEFAULT_ZOOM);
    const [isZooming, setIsZooming] = useState(false);
    const isZoomed =  filteredData1?.length !== data1?.length || filteredData2?.length !== data2?.length;
    //const {left, right, top, bottom} = initialState;
    const [left, setLeft] = useState(initialState.left);
    const [right, setRight] = useState(initialState.right);
    const [top, setTop] = useState(initialState.top);
    const [bottom, setBottom] = useState(initialState.bottom);
    //const [isDrag, setIsDrag] = useState(false);

    const showZoomBox =
        isZooming &&
        !(Math.abs(zoomArea.x1 - zoomArea.x2) < MIN_ZOOM) &&
        !(Math.abs(zoomArea.y1 - zoomArea.y2) < MIN_ZOOM);

    const handleZoomOUt = () => {
        setFilteredData1([...data1]);
        setFilteredData2([...data2]);
        setZoomArea(DEFAULT_ZOOM);
        const { x1, y1, x2, y2 } = zoomArea;
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
        console.log("handleMouseDown called");
        console.log(xValue, yValue);
    };

    const handleMouseMove = e => {
        if (!isZooming) return;
        //setIsDrag(true);
        setZoomArea((prev) => ({ ...prev, x2: e?.xValue, y2: e?.yValue }));
        //console.log("handleMouseMove called");
        //console.log(e.xValue, e.yValue);
    };

    const handleMouseUp = e => {
        if (!isZooming) return;
        setIsZooming(false);
        //setIsDrag(false);
        console.log("handleMouseUp called");
        let { x1, y1, x2, y2 } = zoomArea;
        setZoomArea(DEFAULT_ZOOM);
        // ensure x1 <= x2 and y1 <= y2
        if (x1 > x2) [x1, x2] = [x2, x1];
        if (y1 > y2) [y1, y2] = [y2, y1];

        if (x2 - x1 < MIN_ZOOM || y2 - y1 < MIN_ZOOM) {
            console.log("zoom cancel");
        } else {
            // console.log("zoom stop");
            const dataPointsInRange1 = filteredData1.filter(
                (d) => d['Temperature'] >= x1 && d['Temperature'] <= x2 && d['Luminosity'] >= y1 && d['Luminosity'] <= y2
            );
            const dataPointsInRange2 = filteredData2.filter(
                (d) => d['Temperature'] >= x1 && d['Temperature'] <= x2 && d['Luminosity'] >= y1 && d['Luminosity'] <= y2
            );
            console.log(dataPointsInRange1.length, dataPointsInRange2.length);
            setLeft(x1);
            setRight(x2);
            setTop(y2);
            setBottom(y1);
            setFilteredData1(dataPointsInRange1);
            setFilteredData2(dataPointsInRange2);
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
                    unit="K"
                    reversed={true} //uncomment later
                    domain={[left, right]}

                    tickFormatter={scale}
                    ticks={[10e3, 10e4, 10e5]}
                >
                    <Label value="Temperature" position="bottom" offset={0} />
                </XAxis>
                <YAxis
                    allowDataOverflow
                    dataKey='Luminosity'
                    name="Luminosity"
                    type="number"
                    scale='log'
                    tickFormatter={scale}
                    unit=' L_sun'
                    domain={[bottom, top]}
                    label={{
                        value: `Luminosity/L_\u{2299}`,
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
                    unit='Myr'
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend wrapperStyle={{ paddingLeft: "40px" }} layout="vertical" align="right" verticalAlign="top" />
                {/* {showZoomBox && (
                    <ReferenceArea
                        x1={zoomArea?.x1}
                        x2={zoomArea?.x2}
                        y1={zoomArea?.y1}
                        y2={zoomArea?.y2}
                    />
                )} */}
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

// export default class RenderHRDiagram extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = initialState;
//         this.state.data1 = [...this.props.data1];
//         this.state.data2 = [...this.props.data2];
//         this.state.filteredData1 = [...this.state.data1];
//         this.state.filteredData2 = [...this.state.data2];
//         this.state.zoomArea = DEFAULT_ZOOM;
//         this.state.isZooming = false;
//     }

//     handleZoomOUt() {
//         this.setState(() => ({
//             filteredData1: [...this.state.data1],
//             filteredData2: [...this.state.data2],
//             zoomArea: DEFAULT_ZOOM,
//         }));
//     }

//     handleMouseDown(e) {
//         const { xValue, yValue } = e || {};
//         if (!xValue || !yValue) return;
//         this.setState(() => ({
//             isZooming: true,
//             zoomArea: { x1: xValue, y1: yValue, x2: xValue, y2: yValue }
//         }));
//         console.log("handleMouseDown called");
//         console.log(xValue, yValue);
//     }

//     handleMouseMove(e) {
//         if (this.state.isZooming) {
//             this.setState((prev) => (
//                 { zoomArea: { ...prev.zoomArea, x2: e?.xValue, y2: e?.yValue } })
//             ); //use x1 if the x axis is reversed, and if not, use x2                
//             console.log("handleMouseMove called");
//             console.log(this.state.zoomArea.x1, this.state.zoomArea.y1);
//             console.log(this.state.zoomArea.x2, this.state.zoomArea.y2);
//         }
//         //
//     }

//     handleMouseUp(e) {
//         if (this.state.isZooming) {
//             this.setState((prev) => ({
//                 isZooming: false
//             }));
//             let { x1, y1, x2, y2 } = this.state.zoomArea;
//             if (x1 > x2) [x1, x2] = [x2, x1];
//             if (y1 > y2) [y1, y2] = [y2, y1];
//             console.log("HandleMouseUp event");
//             console.log(x1, x2, y1, y2);

//             if (x2 - x1 < MIN_ZOOM || y2 - y1 < MIN_ZOOM) {
//                 console.log("zoom cancel");
//                 //console.log(x1, x2, y1, y2);
//             } else {
//                 const dataPointsInRange1 = this.state.filteredData1.filter(
//                     (d) => d['Temperature'] >= x1 && d['Temperature'] <= x2 && d['Luminosity'] >= y1 && d['Luminosity'] <= y2
//                 );
//                 const dataPointsInRange2 = this.state.filteredData2.filter(
//                     (d) => d['Temperature'] >= x1 && d['Temperature'] <= x2 && d['Luminosity'] >= y1 && d['Luminosity'] <= y2
//                 );
//                 this.setState(() => ({
//                     //isZooming: false,
//                     zoomArea: DEFAULT_ZOOM,
//                     filteredData1: dataPointsInRange1,
//                     filteredData2: dataPointsInRange2
//                 }));
//             }
//         }
//     }

//     render() {
//         const { divStyle, syncId } = this.props;
//         const { data1, data2, left, right, refAreaLeft, refAreaRight, top, bottom } = this.state;
//         const { filteredData1, filteredData2, zoomArea, isZooming } = this.state;
//         const isZoomed = filteredData1?.length !== data1?.length || filteredData2?.length !== data2?.length;
//         const showZoomBox =
//             isZooming &&
//             !(Math.abs(zoomArea.x1 - zoomArea.x2) < MIN_ZOOM) &&
//             !(Math.abs(zoomArea.y1 - zoomArea.y2) < MIN_ZOOM);

//         return (<div style={divStyle || {
//             width: "973px",
//             height: "400px",
//             backgroundColor: "white"
//         }}>
//             {isZoomed && <button onClick={this.handleZoomOUt.bind(this)}>Zoom Out</button>}

//             <ResponsiveContainer width="80%"
//                 height="100%">
//                 <ScatterChart
//                     width={700}
//                     height={300}
//                     syncId={syncId}
//                     margin={{
//                         top: 5,
//                         right: 20,
//                         left: 20,
//                         bottom: 25,
//                     }}
//                     onMouseDown={this.handleMouseDown.bind(this)}
//                     onMouseMove={this.handleMouseMove.bind(this)}
//                     onMouseUp={this.handleMouseUp.bind(this)}
//                 >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis
//                         allowDataOverflow
//                         dataKey='Temperature'
//                         name="Temperature"
//                         type="number"
//                         scale='log'
//                         unit="K"
//                         //reversed={true}
//                         domain={[left, right]}

//                         tickFormatter={scale}
//                         ticks={[10e3, 10e4, 10e5]}
//                     >
//                         <Label value="Temperature" position="bottom" offset={0} />
//                     </XAxis>
//                     <YAxis
//                         allowDataOverflow
//                         dataKey='Luminosity'
//                         name="Luminosity"
//                         type="number"
//                         scale='log'
//                         tickFormatter={scale}
//                         unit=' L_sun'
//                         domain={[bottom, top]}
//                         label={{
//                             value: `Luminosity/L_\u{2299}`,
//                             angle: -90,
//                             position: 'insideLeft',
//                             textAnchor: 'middle',
//                             offset: -7
//                         }}
//                         padding={{ bottom: 10 }} />
//                     <ZAxis
//                         dataKey='time'
//                         name='time'
//                         type='number'
//                         unit='Myr'
//                     />
//                     <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//                     <Legend wrapperStyle={{ paddingLeft: "40px" }} layout="vertical" align="right" verticalAlign="top" />
//                     {/* {showZoomBox && (
//                         <ReferenceArea
//                             x1={zoomArea?.x1}
//                             x2={zoomArea?.x2}
//                             y1={zoomArea?.y1}
//                             y2={zoomArea?.y2}
//                         />
//                     )} */}
//                     <Scatter
//                         name='Star1'
//                         data={filteredData1}
//                         line={{ strokeWidth: 2 }}
//                         fill="red"
//                     />
//                     <Scatter
//                         name='Star2'
//                         data={filteredData2}
//                         line={{ strokeWidth: 2 }}
//                         fill="blue"
//                     />
//                     {/* {refAreaLeft && refAreaRight ? (
//                         <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
//                     ) : null} */}

//                 </ScatterChart>
//             </ResponsiveContainer>
//         </div>);
//     }

// }



RenderHRDiagram.propTypes = {
    data1: propTypes.array.isRequired,
    data2: propTypes.array.isRequired,
    syncId: propTypes.string,
}




/*
scale='log'
line
lineType='joint'
<ZAxis 
dataKey='time'
name='time'
type='number'
unit='Myr'
/>

tickFormatter={f => f.toFixed(2)}*/