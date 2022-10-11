import React from "react";
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
    animation: true,
};


export default class RenderHRDiagram extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.state.data1 = this.props.data1;
        this.state.data2 = this.props.data2;
        this.state.filteredData1 = [...this.state.data1];
        this.state.filteredData2 = [...this.state.data2];
        this.state.zoomArea = DEFAULT_ZOOM;
        this.state.isZooming = false;
    }

    handleZoomOUt() {
        this.setState(() => ({
            filteredData1: [...this.state.data1],
            filteredData2: [...this.state.data2],
            zoomArea: DEFAULT_ZOOM,
        }));
    }

    handleMouseDown(e) {
        const { xValue, yValue } = e || {};
        this.setState(() => ({
            isZooming: true,
            zoomArea: { x1: xValue, y1: yValue, x2: xValue, y2: yValue }
        }));
    }

    handleMouseMove(e) {
        if (this.state.isZooming) {
            this.setState((prev) => (
                { zoomArea: {...prev, x1: e?.xValue, y2: e?.yValue }})); //the x axis is reversed
        }
    }

    handleMouseUp(e) {
        if (this.state.isZooming) {
            let { x1, y1, x2, y2 } = this.state.zoomArea;
            if (x1 > x2) [x1, x2] = [x2, x1]; 
            if (y1 > y2) [y1, y2] = [y2, y1];

            if (x2 - x1 < MIN_ZOOM || y2 - y1 < MIN_ZOOM) {
                console.log("zoom cancel");
                console.log(x1, x2, y1, y2);
            } else {
                const dataPointsInRange1 = this.state.filteredData1.filter(
                    (d) => d['Temperature'] >= x1 && d['Temperature'] <= x2 && d['Luminosity'] >= y1 && d['Luminosity'] <= y2
                );
                const dataPointsInRange2 = this.state.filteredData2.filter(
                    (d) => d['Temperature'] >= x1 && d['Temperature'] <= x2 && d['Luminosity'] >= y1 && d['Luminosity'] <= y2
                );
                this.setState(() => ({
                    isZooming: false,
                    zoomArea: DEFAULT_ZOOM,
                    filteredData1: dataPointsInRange1,
                    filteredData2: dataPointsInRange2
                }));
            }
        }
    }

    render() {
        const { divStyle, syncId } = this.props;
        const { data1, data2, left, right, refAreaLeft, refAreaRight, top, bottom } = this.state;
        const { filteredData1, filteredData2, zoomArea, isZooming } = this.state;
        const isZoomed = filteredData1?.length !== data1?.length || filteredData2?.length !== data2?.length;
        const showZoomBox =
            isZooming &&
            !(Math.abs(zoomArea.x1 - zoomArea.x2) < MIN_ZOOM) &&
            !(Math.abs(zoomArea.y1 - zoomArea.y2) < MIN_ZOOM);

        return (<div style={divStyle || {
            width: "973px",
            height: "400px",
            backgroundColor: "white"
        }}>
            {isZoomed && <button onClick={this.handleZoomOUt.bind(this)}>Zoom Out</button>}

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
                    onMouseDown={this.handleMouseDown.bind(this)}
                    onMouseMove={this.handleMouseMove.bind(this)}
                    onMouseUp={this.handleMouseUp.bind(this)}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        allowDataOverflow
                        dataKey='Temperature'
                        name="Temperature"
                        type="number"
                        scale='log'
                        unit="K"
                        reversed={true}
                        domain={[left, right]}

                        tickFormatter={scale}
                        ticks={[10e3,10e4,10e5]}
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
                    {showZoomBox && (
                        <ReferenceArea
                            x1={zoomArea?.x1}
                            x2={zoomArea?.x2}
                            y1={zoomArea?.y1}
                            y2={zoomArea?.y2}
                        />
                    )}
                    <Scatter
                        name='Star1'
                        data={filteredData1}
                        line={{ strokeWidth: 2}} 
                        fill="red"
                    />
                    <Scatter
                        name='Star2'
                        data={filteredData2}
                        line={{ strokeWidth: 2}} 
                        fill="blue"
                    />
                    {/* {refAreaLeft && refAreaRight ? (
                        <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
                    ) : null} */}

                </ScatterChart>
            </ResponsiveContainer>
        </div>);
    }

}



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