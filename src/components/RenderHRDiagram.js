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

const scale = num => {
    return num.toExponential();
}

//zoom-in
const getAxisYDomain = (data1, data2, from, to, ref, offset) => {
    const refData1 = data1.slice(from - 1, to);
    const refData2 = data2.slice(from - 1, to);
    let [bottom, top] = [refData1[0][ref], refData1[0][ref]];
    refData1.forEach((d, i) => {
        if (d[ref] > top) top = d[ref];
        if (refData2[i][ref] > top) top = refData2[i][ref];
        if (d[ref] < bottom) bottom = d[ref];
        if (refData2[i][ref] < bottom) bottom = refData2[i][ref];
    });
    return [(bottom | 0) - offset, (top | 0) + offset];
};

const xDomain = [1000, 500000];
const yDomain = [10e-11, 10e7];

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
    }

    zoom() {
        let { refAreaLeft, refAreaRight } = this.state;
        const { data1, data2 } = this.state;

        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            this.setState(() => ({
                refAreaLeft: '',
                refAreaRight: '',
            }));
            return;
        }

        // xAxis domain
        if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

        // yAxis domain
        const [bottom, top] = getAxisYDomain(data1, data2, refAreaLeft, refAreaRight, 'Luminosity', 10);

        this.setState(() => ({
            refAreaLeft: '',
            refAreaRight: '',
            data1: data1.slice(),
            data2: data2.slice(),
            left: refAreaLeft,
            right: refAreaRight,
            bottom: bottom,
            top: top,
        }));
    }

    zoomOut() {
        const { data1, data2 } = this.props;
        this.setState(() => ({
            data1: [...data1],
            data2: [...data2],
        }));
        Object.keys(initialState).forEach(key => this.setState(() => ({
            key: initialState[key]
        })));
    }

    render() {
        const { divStyle, syncId } = this.props;
        const { data1, data2, left, right, refAreaLeft, refAreaRight, top, bottom } = this.state;

        return (<div style={divStyle || {
            width: "1200px",
            height: "500px",
            backgroundColor: "white"
        }}>

            <button type="button" className="btn update" onClick={this.zoomOut.bind(this)}>
                Zoom Out
            </button>

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
                    onMouseDown={(e) => this.setState({ refAreaLeft: e.activeLabel })}
                    onMouseMove={(e) => this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel })}
                    // eslint-disable-next-line react/jsx-no-bind
                    onMouseUp={this.zoom.bind(this)}
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
                        padding={{ bottom: 10 }}
                        tickFormatter={scale}
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