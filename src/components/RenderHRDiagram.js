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
} from "recharts";
import propTypes from 'prop-types';
//import { scaleLog } from 'd3-scale';
//const scale = scaleLog().base(10);
const scale = num => {
    return num.toExponential();
}
export default class RenderHRDiagram extends React.Component {

    render() {
        const { data1, data2, divStyle, syncId } = this.props;
        return (<div style={divStyle || {
            width: "1200px",
            height: "500px",
            backgroundColor: "white"
        }}>
            <ResponsiveContainer width="80%"
                height="100%">
                <ScatterChart
                    width={500}
                    height={300}
                    syncId={syncId}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 20,
                        bottom: 25,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey='Temperature'
                        name="Temperature"
                        type="number"
                        scale='log'
                        unit="K"
                        reversed={true}
                        domain={[1000, 500000]}
                        padding={{ bottom: 10 }}
                        tickFormatter={scale}

                    >
                        <Label value="Temperature" position="bottom" offset={0} />
                    </XAxis>
                    <YAxis
                        dataKey='Luminosity'
                        name="Luminosity"
                        type="number"
                        scale='log'
                        tickFormatter={scale}
                        unit=' L_sun'
                        domain={[10e-11, 10e7]}
                        label={{
                            value: `Luminosity/L_\u{2299}`,
                            angle: -90,
                            position: 'insideLeft',
                            textAnchor: 'middle'
                        }} />
                    <ZAxis
                        dataKey='time'
                        name='time'
                        type='number'
                        unit='Myr'
                    />
                    <Tooltip />
                    <Legend wrapperStyle={{ paddingLeft: "40px" }} layout="vertical" align="right" verticalAlign="top" />
                    <Scatter
                        name='Star1'
                        data={data1}
                        line

                        fill="red"
                    />
                    <Scatter
                        name='Star2'
                        data={data2}
                        line
                        
                        fill="blue"

                    />

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