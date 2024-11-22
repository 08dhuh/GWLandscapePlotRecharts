import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Label,
} from "recharts";

import ZoomLineChart from "./ZoomLineChart";
import { useDataContext } from "../../context/DataContext";
import { useChart } from "../../hooks/useChart";
import { getLineChartConfig } from "../../config/lineChartConfig";
import { units } from "../../config/dataConfig";
import propTypes from "prop-types";

export default function RenderLineChartContainer({ chartType, divStyle, syncId }) {
  const {dataBank} = useDataContext();
  const data = dataBank[chartType]; 

  const {
    alias,
    strokeStyle,
    domains,
    keys,
    yunit,
    scaleType,
    tickFormatter,
    ylabel,
  } = getLineChartConfig(chartType);

  const { initialDomain, domain, adjustDomain } = useChart(domains.x, domains.y);

  return (
    <ZoomLineChart
      divStyle={divStyle}
      syncId={syncId}
      data={data} 
      xkey={keys.x}
      ykeys={keys.y}
      initialState={initialDomain}
      adjustDomain={adjustDomain}
      strokeStyle={strokeStyle}
      alias={alias}
      scaleType={scaleType}
      yunit={yunit}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        allowDataOverflow
        type="number"
        scale='time'
        domain={[domain.x1, domain.x2]}
        dataKey={keys.x}        
        tickFormatter={tickFormatter.x}
        padding={{ left: 20 }}
        unit=""
      >
        <Label value={`Time (${units.time})`} position="bottom" offset={0} />
      </XAxis>
      <YAxis
        allowDataOverflow
        scale={chartType === "length" ? "log" : undefined}
        domain={[domain.y1, domain.y2]}
        tickFormatter={tickFormatter.y}
        padding={{ bottom: 5, left: 10 }}

      >
        <Label
          value={ylabel}
          angle="-90"
          position="insideLeft"
          textAnchor="middle"
          offset='-5'
        />
      </YAxis>
      <Legend layout="vertical" align="right" verticalAlign="top" />
    </ZoomLineChart>
  );
}

RenderLineChartContainer.propTypes = {
  chartType: propTypes.oneOf(["mass", "length"]).isRequired,
  //divStyle: propTypes.object,
  syncId: propTypes.string,
};
