import React from "react";
//import { length } from "../data/dataset";
import RenderLength from "./RenderLength";
import { length, mapLineData } from "./DataUtil";
// import { mapRechartData } from "./RenderMassContainer";
import propTypes from 'prop-types';

const aliases = {
    semimajor: 'semi-major axis',
    //eccentricity: 'eccentricity'
    periapsis: 'periapsis',
    radius_1: 'radius 1',
    radius_2: 'radius 2',
    roche_radius_1: 'roche radius 1',
    roche_radius_2: 'roche radius 2',
    time: 'time',
};

export default class RenderLengthContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: mapLineData(length),// aliases),
            datakeys: aliases
        };
    }
    
    render() {
        return <RenderLength 
        data={this.state.data} 
        datakeys={this.state.datakeys} 
        syncId={this.props.syncId}
        />;
    }
}

RenderLengthContainer.propTypes = {
    syncId: propTypes.string,
}