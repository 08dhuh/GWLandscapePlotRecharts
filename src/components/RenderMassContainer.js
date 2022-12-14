import React, { useState } from "react";
import { mapLineData, units } from "./DataUtil";
import { mass } from "../data/dataset";
import propTypes from 'prop-types';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import PlotLineZoom from "./PlotLineZoom";


const xDomain = ['auto', dataMax => (dataMax * 1.1)];
const yDomain = ['auto', 'dataMax'];
const initialDomain = { x1: xDomain[0], x2: xDomain[1], y1: yDomain[0], y2: yDomain[1] };
const aliases = {
  totalMass1: 'Mass1',
  totalMass2: 'Mass2',
  systemMass: 'System Mass',
  mass_CO_core1: 'CO core1',
  mass_CO_core2: 'CO core2',
  mass_HE_core1: 'HE core1',
  mass_HE_core2: 'HE core2',
  time: 'time',
};
const xkey = 'time';
const ykeys = Object.keys(aliases).filter(key => key !== 'time');

const strokeStyle = {
  totalMass1: { stroke: 'red', strokeWidth: '2' },
  totalMass2: { stroke: 'blue', strokeWidth: '2' },
  systemMass: { stroke: 'black', strokeWidth: '2' },
  mass_CO_core1: { stroke: 'red', strokeDasharray: "5 5", strokeWidth: '2' },
  mass_CO_core2: { stroke: 'blue', strokeDasharray: "5 5", strokeWidth: '2' },
  mass_HE_core1: { stroke: 'red', strokeDasharray: "1 1 3", strokeWidth: '2' },
  mass_HE_core2: { stroke: 'blue', strokeDasharray: "1 1 3", strokeWidth: '2' },
};
export default function RenderMassContainer(props) {
  const { divStyle, syncId } = props;
  const [domain, setDomain] = useState(initialDomain);
  const data = mapLineData(mass);
  //const data = mapLineDataforScatterChart(mass, 'mass', aliases);

  const adjustDomain = (area) => {
    setDomain(() => ({ x1: area.x1, x2: area.x2, y1: area.y1, y2: area.y2 }));
  }


  return (<PlotLineZoom
    divStyle={divStyle}
    syncId={syncId}
    data={data}
    xkey={xkey}
    ykeys={ykeys}
    initialState={initialDomain}
    adjustDomain={adjustDomain}
    strokeStyle={strokeStyle}
    aliases={aliases}
    scaleType='Linear'
    yunit={units.mass}
    >
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
      <Label value={`Time(${units.time})`} position="bottom" offset={0} />
    </XAxis>
    <YAxis
      allowDataOverflow
      domain={[domain.y1, domain.y2]}
      padding={{ bottom: 5, left: 10 }}
      tickFormatter={f => f.toFixed(2)}>
        <Label 
        value={`Mass(M\u{2299})`}
        angle='-90' position='insideLeft' textAnchor='middle' offset='-5'>
          
          </Label>          
        </YAxis> 
    
    <Legend layout="vertical" align="right" verticalAlign="top" />

  </PlotLineZoom>);
}


RenderMassContainer.propTypes = {
  syncId: propTypes.string,
}

  // const drawDot = (datakey, data, stroke) => {
  //   return (<Scatter
  //     name={datakey}
  //     data={data}
  //     line={stroke}
  //     lineType='joint'
  //     //fill="red"
  //     //radius={2}
  //     shape={<Dot r={1} />}
      
  //   ></Scatter>);
  // }

  // return (<div style={divStyle || {
  //   width: "800px",
  //   height: "400px",
  //   backgroundColor: "white"
  // }}>
  //   <ResponsiveContainer>
  //     <ScatterChart width={700}
  //       height={300}
  //       syncId={syncId}
  //       margin={{
  //         top: 5,
  //         right: 20,
  //         left: 20,
  //         bottom: 25,
  //       }} >
  //       <CartesianGrid strokeDasharray="3 3" />
  //       <XAxis
  //         allowDataOverflow
  //         dataKey='time'
  //         name="Time(Myr)"
  //         type="number"
  //         //scale='log'
  //         //unit="Myr"
  //         reversed={false} //uncomment later
  //         domain={['auto', 'auto']}
  //         padding={{ left: 20 }}
  //         tickFormatter={f => f.toFixed(2)}
          
  //       >
  //         <Label value="Time(Myr)" position="bottom" offset={0} />
  //       </XAxis>
  //       <YAxis
  //         allowDataOverflow
  //         dataKey='mass'
  //         //unit={`M_\u{2299}`}
  //         label={{ value: `Mass/M_\u{2299}`, angle: -90, position: 'insideLeft', textAnchor: 'middle' }}
  //         domain={[domain.y1, domain.y2]}
  //         padding={{ bottom: 5, left: 10 }} />
  //       <Tooltip
  //         allowEscapeViewBox={{ x: false, y: false }}
  //         //position={{ x: 760, y: 10 }}
  //         filterNull={false} />
  //       <Legend layout="vertical" align="right" verticalAlign="top" />
  //       {ykeys.map(key => { return drawDot(key, data[key],strokeStyle[key]); })}
  //     </ScatterChart>

  //   </ResponsiveContainer>
  // </div >
  // );