import React from "react";
//import { hrattr } from "../DataUtil";
//import { mapScatterData } from "../../utils/dataUtils";
import propTypes from "prop-types";
import RenderHRDiagram from "./RenderHRDiagram";
import { useDataContext } from "../../context/DataContext";
//import { aliases } from "../../config/dataConfig";

// const aliases = {
//     teff_1 : 'Temperature',
//     teff_2 : 'Temperature',
//     luminosity_1: 'Luminosity',
//     luminosity_2: 'Luminosity',

// }

export default function RenderHRDiagramContainer({ syncId }) {
    //const [data1, data2] = mapScatterData(hrattr, aliases);

    const { dataBank } = useDataContext();
    console.log(dataBank);
    const [data1, data2] = dataBank['hr'];
    //console.log(data1);
    return <RenderHRDiagram data1={data1} data2={data2} syncId={syncId} />;
};

// export default class RenderHRDiagramContainer extends React.Component {


//     constructor(props) {
//         super(props);
//         this.state = {
//             data1: data1,
//             data2: data2,
//             datakeys: Object.values(aliases).filter(k=>k!=='time'),
//         };
//     }
//     render() {
//         return <RenderHRDiagram data1={this.state.data1} data2={this.state.data2} syncId={this.props.syncId}/>;
//     }
// }

RenderHRDiagramContainer.propTypes = {
    syncId: propTypes.string,
};