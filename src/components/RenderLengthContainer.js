import React, {useState} from "react";
import { length, mapLineData } from "./DataUtil";
import { tickExpFormatter } from "./Utils";
import PlotLineZoom from "./PlotLineZoom";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Label
  } from "recharts";

const aliases = {
    semimajor: 'semi-major axis',
    //eccentricity: 'eccentricity'
    periapsis: 'periapsis',
    radius_1: 'radius 1',
    radius_2: 'radius 2',
    roche_radius_1: 'roche radius 1',
    roche_radius_2: 'roche radius 2',
    time: 'time',
};
const xDomain = ['auto', dataMax => (dataMax * 1.1)];
const yDomain = ['auto', 'dataMax+1000'];

const strokeStyle = {
    semimajor: { stroke: 'black', strokeWidth: '2' },
    periapsis: { stroke: 'black', strokeWidth: '2', strokeDasharray: "5 5" },
    radius_1: { stroke: 'red', strokeWidth: '2' },
    radius_2: { stroke: 'blue', strokeWidth: '2' },
    roche_radius_1: { stroke: 'red', strokeDasharray: "5 5", strokeWidth: '2' },
    roche_radius_2: { stroke: 'blue', strokeDasharray: "5 5", strokeWidth: '2' },
};

const initialDomain = { x1: xDomain[0], x2: xDomain[1], y1: yDomain[0], y2: yDomain[1] };
const xkey = 'time';
const ykeys = Object.keys(aliases).filter(key => key !== 'time');

export default function RenderLengthContainer(props) {
    const { divStyle, syncId } = props;
    const [domain, setDomain] = useState(initialDomain);
    const data = mapLineData(length);
    const adjustDomain = (area) => {
        setDomain(() => ({ x1: area.x1, x2: area.x2, y1: area.y1, y2: area.y2 }));
      }
    return(<PlotLineZoom
        divStyle={divStyle}
        syncId={syncId}
        data={data}
        xkey={xkey}
        ykeys={ykeys}
        initialState={initialDomain}
        adjustDomain={adjustDomain}
        strokeStyle={strokeStyle}
        aliases={aliases}
        scaleType='Log'
        yunit={<>R<sub>&#8857;</sub></>} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
            allowDataOverflow
            type="number"
            scale='time'
            domain={[domain.x1, domain.x2]}
            dataKey={xkey}
            padding={{ left: 20 }}
            unit=""
            tickFormatter={f => f.toFixed(2)}>
            <Label value="Time(Myr)" position="bottom" offset={0} />
        </XAxis>
        <YAxis
            allowDataOverflow
            scale='log'
            tickFormatter={tickExpFormatter}
            domain={[domain.y1, domain.y2]}
            padding={{ bottom: 5 }}
            label={{ value: `Radius(R\u{2299})`, angle: -90, position: 'insideLeft', textAnchor: 'middle', offset: -5 }} />
        
        <Legend layout="vertical" align="right" verticalAlign="top" />

    </PlotLineZoom>);
}
// class RenderLengthContainer extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             data: mapLineData(length),// aliases),
//             datakeys: aliases
//         };
//     }

//     render() {
        
//         // return <RenderLength 
//         // data={this.state.data} 
//         // datakeys={this.state.datakeys} 
//         // syncId={this.props.syncId}
//         // />;
//     }
// }

// RenderLengthContainer.propTypes = {
//     syncId: propTypes.string,
// }