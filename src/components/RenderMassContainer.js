import React, { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  //Tooltip,
  Legend,
  Label,
} from "recharts";
//import { mapLineData } from "../utils/dataUtils";
//import { mass } from "../data/dataset";


import PlotLineZoom from "./PlotLineZoom";
import { useDataContext } from "../context/DataContext";
import { useChart } from "../hooks/useChart";

import { units } from "../config/dataConfig";
//import { aliases, strokeStyles } from "../config/lineChartConfig";
import propTypes from 'prop-types';

// const xDomain = ['auto', dataMax => (dataMax * 1.1)];
// const yDomain = ['auto', 'dataMax'];
// const initialDomain = { x1: xDomain[0], x2: xDomain[1], y1: yDomain[0], y2: yDomain[1] };
// const aliases = {
//   totalMass1: 'Mass1',
//   totalMass2: 'Mass2',
//   systemMass: 'System Mass',
//   mass_CO_core1: 'CO core1',
//   mass_CO_core2: 'CO core2',
//   mass_HE_core1: 'HE core1',
//   mass_HE_core2: 'HE core2',
//   time: 'time',
// };


// const strokeStyle = {
//   totalMass1: { stroke: 'red', strokeWidth: '2' },
//   totalMass2: { stroke: 'blue', strokeWidth: '2' },
//   systemMass: { stroke: 'black', strokeWidth: '2' },
//   mass_CO_core1: { stroke: 'red', strokeDasharray: "5 5", strokeWidth: '2' },
//   mass_CO_core2: { stroke: 'blue', strokeDasharray: "5 5", strokeWidth: '2' },
//   mass_HE_core1: { stroke: 'red', strokeDasharray: "1 1 3", strokeWidth: '2' },
//   mass_HE_core2: { stroke: 'blue', strokeDasharray: "1 1 3", strokeWidth: '2' },
// };


export default function RenderMassContainer(props) {
  const {data} = useDataContext();
  const alias = aliases.mass;
  const strokeStyle = strokeStyles.mass;
  const xDomain = ['auto', dataMax => (dataMax * 1.1)];
  const yDomain = ['auto', 'dataMax'];
  const xkey = 'time';
  const ykeys = Object.keys(alias).filter(key => key !== 'time');
  const { divStyle, syncId } = props;
  //const [domain, setDomain] = useState(initialDomain);
  //const data = mapLineData(mass);
  const {initialDomain, domain, adjustDomain} = useChart(xDomain, yDomain);
  // const adjustDomain = (area) => {
  //   setDomain(() => ({ x1: area.x1, x2: area.x2, y1: area.y1, y2: area.y2 }));
  // }


  return (<PlotLineZoom
    divStyle={divStyle}
    syncId={syncId}
    data={data}
    xkey={xkey}
    ykeys={ykeys}
    initialState={initialDomain}
    adjustDomain={adjustDomain}
    strokeStyle={strokeStyle}
    alias={alias}
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
