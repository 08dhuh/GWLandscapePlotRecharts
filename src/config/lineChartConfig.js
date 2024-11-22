import { aliases, units } from "./dataConfig";
import { tickDecimalFormatter, tickExpFormatter } from "../utils/lineChartUtils";

const massYKeys = Object.keys(aliases.mass).filter(key => key !== 'time');
const lengthYKeys = Object.keys(aliases.length).filter(key => key !== 'time');

export const getLineChartConfig = (chartType) => {
  const isMass = chartType === "mass";

  return {
    alias: aliases[chartType],
    strokeStyle: isMass
      ? {
          totalMass1: { stroke: "red", strokeWidth: "2" },
          totalMass2: { stroke: "blue", strokeWidth: "2" },
          systemMass: { stroke: "black", strokeWidth: "2" },
          mass_CO_core1: { stroke: "red", strokeDasharray: "5 5", strokeWidth: "2" },
          mass_CO_core2: { stroke: "blue", strokeDasharray: "5 5", strokeWidth: "2" },
          mass_HE_core1: { stroke: "red", strokeDasharray: "1 1 3", strokeWidth: "2" },
          mass_HE_core2: { stroke: "blue", strokeDasharray: "1 1 3", strokeWidth: "2" },
        }
      : {
          semimajor: { stroke: "black", strokeWidth: "2" },
          periapsis: { stroke: "black", strokeWidth: "2", strokeDasharray: "5 5" },
          radius_1: { stroke: "red", strokeWidth: "2" },
          radius_2: { stroke: "blue", strokeWidth: "2" },
          roche_radius_1: { stroke: "red", strokeDasharray: "5 5", strokeWidth: "2" },
          roche_radius_2: { stroke: "blue", strokeDasharray: "5 5", strokeWidth: "2" },
        },
    domains: {
      x: ["auto", (dataMax) => dataMax * 1.1],
      y: isMass ? ["auto", "dataMax"] : ["auto", "dataMax+1000"],
    },
    keys: {
      x: "time",
      y: isMass ? massYKeys : lengthYKeys,
    },
    yunit: isMass ? units.mass : units.length,
    scaleType: isMass ? "Linear" : "Log",
    tickFormatter: {
      x: tickDecimalFormatter,
      y: isMass ? tickDecimalFormatter : tickExpFormatter,
    },
    ylabel: isMass ? `Mass(M\u{2299})` : `Radius(R\u{2299})`,
  };
};
