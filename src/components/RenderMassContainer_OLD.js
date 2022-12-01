import React, { useState } from "react";
import { mapLineData } from "./DataUtil";
import {mass} from "../data/dataset";
//import RenderMass from "../obsolete-components/RenderMass";
import propTypes from 'prop-types';
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

// export const mapRechartData = (dataset, keys = null) => {
//     let data = [];
//     dataset.time.forEach((_, i) => {
//         let obj = {};
//         let objkeys = keys ? Object.keys(keys) : Object.keys(dataset);
//         objkeys.forEach(key => { keys ? obj[keys[key]] = dataset[key][i] : obj[key] = dataset[key][i] });
//         data.push(obj);
//     });
//     return data;
// }

export default class RenderMassContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: mapLineData(mass),//, aliases),
            datakeys: aliases
        };
    }
    //datakeys: Object.values(aliases).filter(k=>k!=='time'),
    render() {
        return <RenderMass data={this.state.data}
            datakeys={this.state.datakeys}
            syncId={this.props.syncId}
        />;
    }
}

RenderMassContainer.propTypes = {
    syncId: propTypes.string,
}

const strokeStyle = {
    totalMass1: { stroke: 'red', strokeWidth: '2' },
    totalMass2: { stroke: 'blue', strokeWidth: '2' },
    systemMass: { stroke: 'black', strokeWidth: '2' },
    mass_CO_core1: { stroke: 'red', strokeDasharray: "5 5", strokeWidth: '2' },
    mass_CO_core2: { stroke: 'blue', strokeDasharray: "5 5", strokeWidth: '2' },
    mass_HE_core1: { stroke: 'red', strokeDasharray: "1 1 3", strokeWidth: '2' },
    mass_HE_core2: { stroke: 'blue', strokeDasharray: "1 1 3", strokeWidth: '2' },
  };
  
  const xDomain = ['auto', dataMax => (dataMax * 1.1)];
  const yDomain = ['auto', 'dataMax' ];
  
  //const initialState = {x1: xDomain[0], x2: xDomain[1], y1: yDomain[0], y2: yDomain[1]};

  //zoom-in
  const getAxisYDomainOneDataset = (refData, ref, offset) => {
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });
    //return [(bottom | 0) - offset, (top | 0) + offset];
    return [bottom - offset, top+ offset];
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
  
  
  class RenderMass extends React.Component {
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
              allowDataOverflow
              type="number"
              scale='time'
              domain={[left, right]}
              dataKey="time"
              padding={{left:20}}
              unit=""
              tickFormatter={f => f.toFixed(2)}>
              <Label value="Time(Myr)" position="bottom" offset={0} />
            </XAxis>
            <YAxis
              allowDataOverflow
              label={{ value: `Mass/M_\u{2299}`, angle: -90, position: 'insideLeft', textAnchor: 'middle' }}
              domain={[bottom, top]} 
              padding={{ bottom: 5, left:10 }}/>
            <Tooltip 
            allowEscapeViewBox={{ x: false, y: false }} 
            //position={{ x: 760, y: 10 }}
            filterNull={false}/>
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
  //<Legend layout="vertical" align="right" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
  RenderMass.propTypes = {
    data: propTypes.array.isRequired,
    datakeys: propTypes.object.isRequired,
    syncId: propTypes.string,
    type: propTypes.string,
    stroke: propTypes.string,
    dot: propTypes.object,
    divStyle: propTypes.object,
  }