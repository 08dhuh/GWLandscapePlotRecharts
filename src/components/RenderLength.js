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
  Label,
  ReferenceArea
} from "recharts";
import propTypes from 'prop-types';
import { tickExpFormatter } from "./Utils";

// const scale = num => {
//   return num.toExponential();
// }

const strokeStyle = {
  semimajor: { stroke: 'black', strokeWidth: '2' },
  periapsis: { stroke: 'black', strokeWidth: '2', strokeDasharray: "5 5" },
  radius_1: { stroke: 'red', strokeWidth: '2' },
  radius_2: { stroke: 'blue', strokeWidth: '2' },
  roche_radius_1: { stroke: 'red', strokeDasharray: "5 5", strokeWidth: '2' },
  roche_radius_2: { stroke: 'blue', strokeDasharray: "5 5", strokeWidth: '2' },
};

const xDomain = ['auto', dataMax => (dataMax * 1.1)];
const yDomain = ['auto', 'dataMax+1000'];

//zoom-in
const getAxisYDomainOneDataset = (refData, ref, offset) => {
  let [bottom, top] = [refData[0][ref], refData[0][ref]];
  refData.forEach((d) => {
    if (d[ref] > top) top = d[ref];
    if (d[ref] < bottom) bottom = d[ref];
  });
  //return [(bottom | 0) - offset, (top | 0) + offset];
  return [bottom - offset, top + offset];
};

const getAxisYDomain = (data, from, to, datakeys, offset) => {
  let mins = [];
  let maxes = [];
  const refData = data.slice(from - 1, to);
  Object.values(datakeys).forEach(ref => {
    let [min, max] = getAxisYDomainOneDataset(refData, ref, offset);
    mins.push(min);
    maxes.push(max);
  })
  return [Math.min(...mins), Math.max(...maxes)];
};

const initialState = {
  left: xDomain[0],
  right: xDomain[1],
  refAreaLeft: '',
  refAreaRight: '',
  bottom: yDomain[0],
  top: yDomain[1],
  animation: true,
};



export default class RenderLength extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.state.data = this.props.data;
  }


  drawLine(dataKey, alias = null, style, type = null, dot = false) {
    if (dataKey === 'time') return;
    return (<Line type={type || "monotone"}
      dataKey={dataKey}
      name={alias}
      {...style}
      dot={dot}
    />);
    //{...(stroke?{stroke:stroke}:{})}
  }

  zoom() {
    let { refAreaLeft, refAreaRight } = this.state;
    const { data } = this.state;
    const { datakeys } = this.props;

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
    const [bottom, top] = getAxisYDomain(data, refAreaLeft, refAreaRight, datakeys, 10);

    this.setState(() => ({
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      bottom: bottom,
      top: top,
    }));
  }

  zoomOut() {
    const { data } = this.props;
    this.setState(() => ({
      data: [...data],
      left: xDomain[0],
      right: xDomain[1],
      refAreaLeft: '',
      refAreaRight: '',
      bottom: yDomain[0],
      top: yDomain[1],
    }));

  }


  render() {
    const { datakeys, type, stroke, dot, divStyle, syncId } = this.props;
    const { data, left, right, refAreaLeft, refAreaRight, top, bottom } = this.state;

    return (<div style={divStyle || {
      width: "823px",
      height: "400px",
      backgroundColor: "white"
    }}>
      <button type="button" className="btn update" onClick={this.zoomOut.bind(this)}>
        Zoom Out
      </button>

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
          onMouseDown={(e) => {
            this.setState({ refAreaLeft: e.activeLabel }); 
            console.log("chartX:", e.chartX);
            console.log("chartY:", e.chartY);
          }}
          onMouseMove={(e) => this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel })}
          // eslint-disable-next-line react/jsx-no-bind
          onMouseUp={this.zoom.bind(this)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            allowDataOverflow
            name="time"
            type="number"
            scale='time'
            domain={[left, right]}
            padding={{ left: 20 }}
            dataKey="time" unit="" tickFormatter={f => f.toFixed(2)}>
            <Label value="Time(Myr)" position="bottom" offset={0} />
          </XAxis>
          <YAxis
            allowDataOverflow
            scale='log'
            tickFormatter={tickExpFormatter}
            domain={[bottom, top]}
            padding={{ bottom: 5 }}
            label={{ value: `Radius/R_\u{2299}`, angle: -90, position: 'insideLeft', textAnchor: 'middle', offset: -5 }} />
          <Tooltip formatter={(value, name) => {
            //console.log(value,name);
            if (name === 'time') { return [`${value} Myr`, name]; }
            return [value, name];
          }}
            position={{}} />
          <Legend layout="vertical" align="right" verticalAlign="top" />
          {Object.keys(datakeys).map((key) => { return this.drawLine(key, datakeys[key], strokeStyle[key]) })}
          {refAreaLeft && refAreaRight ? (
            <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>);
  }
}
//<Legend wrapperStyle={{ paddingBottom: "20px" }} layout="vertical" align="right" verticalAlign="top" />
RenderLength.propTypes = {
  data: propTypes.array.isRequired,
  datakeys: propTypes.object.isRequired,
  syncId: propTypes.string,
  type: propTypes.string,
  stroke: propTypes.string,
  dot: propTypes.object,
  divStyle: propTypes.object,

}
