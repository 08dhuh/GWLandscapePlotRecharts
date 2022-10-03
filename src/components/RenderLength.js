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
const scale = num => {
  return num.toExponential();
}
const strokeStyle = {
  semimajor: { stroke: 'black', strokeWidth: '2' },
  periapsis: { stroke: 'black', strokeWidth: '2', strokeDasharray: "5 5" },
  radius_1: { stroke: 'red', strokeWidth: '2' },
  radius_2: { stroke: 'blue', strokeWidth: '2' },
  roche_radius_1: { stroke: 'red', strokeDasharray: "5 5", strokeWidth: '2' },
  roche_radius_2: { stroke: 'blue', strokeDasharray: "5 5", strokeWidth: '2' },
};


export default class RenderLength extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }
  initialState = {
    data: this.props.data,
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: '',
    refAreaRight: '',
    top: 'dataMax+1',
    bottom: 'dataMin-1',
    top2: 'dataMax+20',
    bottom2: 'dataMin-20',
    animation: true,
  };
  getAxisYDomain = (from, to, ref, offset) => {
    const refData = this.props.data.slice(from - 1, to);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });

    return [(bottom | 0) - offset, (top | 0) + offset];
  };

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
    const [bottom, top] = this.getAxisYDomain(refAreaLeft, refAreaRight, 'cost', 1);
    const [bottom2, top2] = this.getAxisYDomain(refAreaLeft, refAreaRight, 'impression', 50);

    this.setState(() => ({
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
      bottom2,
      top2,
    }));
  }

  zoomOut() {
    const { data } = this.state;
    this.setState(() => ({
      data: data.slice(),
      refAreaLeft: '',
      refAreaRight: '',
      left: 'dataMin',
      right: 'dataMax',
      top: 'dataMax+1',
      bottom: 'dataMin',
      top2: 'dataMax+50',
      bottom2: 'dataMin+50',
    }));
  }

  render() {
    const { data, datakeys, type, stroke, dot, divStyle, yAxisProps, syncId } = this.props;
    return (<div style={divStyle || {
      width: "800px",
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
          onMouseDown={(e) => this.setState({ refAreaLeft: e.activeLabel })}
          onMouseMove={(e) => this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel })}
          // eslint-disable-next-line react/jsx-no-bind
          onMouseUp={this.zoom.bind(this)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            scale='time'
            domain={['auto', dataMax => (dataMax * 1.1)]}
            dataKey="time" padding={{ bottom: 10 }} unit="Myr" tickFormatter={f => f.toFixed(2)}>
            <Label value="Time" position="bottom" offset={0} />
          </XAxis>
          <YAxis scale='log'
            tickFormatter={scale}
            domain={['auto', 'dataMax+1000']}
            label={{ value: `Radius/R_\u{2299}`, angle: -90, position: 'insideLeft', textAnchor: 'middle' }} />
          <Tooltip />
          <Legend wrapperStyle={{ paddingBottom: "20px" }} layout="vertical" align="right" verticalAlign="top" />
          {Object.keys(datakeys).map((key) => { return this.drawLine(key, datakeys[key], strokeStyle[key]) })}
          {this.state.refAreaLeft && this.state.refAreaRight ? (
              <ReferenceArea yAxisId="1" x1={this.state.refAreaLeft} x2={this.state.refAreaRight} strokeOpacity={0.3} />
            ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>);
  }
}

RenderLength.propTypes = {
  data: propTypes.array.isRequired,
  datakeys: propTypes.object.isRequired,
  syncId: propTypes.string,
  type: propTypes.string,
  stroke: propTypes.string,
  dot: propTypes.object,
  divStyle: propTypes.object,

}
