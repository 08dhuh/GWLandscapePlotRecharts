import React from "react";
import { hrattr, mapScatterData } from "./DataUtil";
import propTypes from "prop-types";
import RenderHRDiagram from "./RenderHRDiagram";

const aliases = {
    teff_1 : 'Temperature',
    teff_2 : 'Temperature',
    luminosity_1: 'Luminosity',
    luminosity_2: 'Luminosity',

}


const [data1, data2] = mapScatterData(hrattr, aliases);


export default class RenderHRDiagramContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data1: data1,
            data2: data2,
            datakeys: Object.values(aliases).filter(k=>k!=='time'),
        };
    }
    render() {
        return <RenderHRDiagram data1={this.state.data1} data2={this.state.data2} syncId={this.props.syncId}/>;
    }
}

RenderHRDiagramContainer.propTypes = {
    syncId: propTypes.string,
};