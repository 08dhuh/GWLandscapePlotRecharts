import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from "recharts";
import propTypes from 'prop-types';


const strokeStyle = {
  totalMass1: {stroke:'red', strokeWidth:'2' },
  totalMass2: {stroke:'blue', strokeWidth:'2' },
  systemMass: {stroke:'black', strokeWidth:'2' },
  mass_CO_core1: {stroke:'red', strokeDasharray:"5 5", strokeWidth:'2' },
  mass_CO_core2: {stroke:'blue', strokeDasharray:"5 5", strokeWidth:'2' },
  mass_HE_core1: {stroke:'red', strokeDasharray:"1 1 3", strokeWidth:'2' },
  mass_HE_core2: {stroke:'blue', strokeDasharray:"1 1 3", strokeWidth:'2' },
};

export default class RenderMass extends React.Component {

  drawLine(dataKey, alias=null, style, type = null, dot = false) {
    if (dataKey==='time') return;
    return (<Line type={type || "monotone"}
                  dataKey={dataKey}
                  name={alias}
                  {...style} 
                  dot={dot}
    />);
    //{...(stroke?{stroke:stroke}:{})}
  }

  render() {
    const {data, datakeys, type, stroke, dot, divStyle, syncId} = this.props;
    return (<div style={ divStyle || {
      width: "800px",
      height: "400px",
      backgroundColor: "white"
    }}>
      <ResponsiveContainer width="100%"
        height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          syncId={syncId}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" scale='time' domain={['auto', dataMax=>(dataMax*1.1)]} dataKey="time" padding={{ bottom: 10 }} unit="Myr" tickFormatter={f=>f.toFixed(2)}>
            <Label value="Time" position="bottom" offset={0} />
          </XAxis>
          <YAxis label={{ value: `Mass/M_\u{2299}`, angle: -90, position: 'insideLeft', textAnchor: 'middle' }}/>
          <Tooltip allowEscapeViewBox={{ x:false, y: false }} />
          <Legend layout="vertical" align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }}/>
          {Object.keys(datakeys).map((key) => {return this.drawLine(key, datakeys[key], strokeStyle[key])} )}
          
        </LineChart>
      </ResponsiveContainer>

    </div>);
  }
}

RenderMass.propTypes = {
  data: propTypes.array.isRequired,
  datakeys: propTypes.object.isRequired,
  syncId: propTypes.string,
  type: propTypes.string,
  stroke: propTypes.string,
  dot: propTypes.object,
  divStyle: propTypes.object,
}
//legend: wrapperStyle={{ paddingLeft: "40px" }}
//<Line dataKey="time" strokeWidth={0} dot={false} legendType='none' />