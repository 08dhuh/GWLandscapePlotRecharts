import React from "react";
import { mass } from "../data/dataset";
import RenderMass from "../components/RenderMass";
import propTypes from 'prop-types';

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

export const mapRechartData = (dataset, keys=null) => {
    let data = [];
    dataset.time.forEach((_, i) => {
        let obj = {};        
        let objkeys = keys ? Object.keys(keys) : Object.keys(dataset);
        objkeys.forEach(key => {keys ? obj[keys[key]] = dataset[key][i] : obj[key] = dataset[key][i]});
        data.push(obj);
    });
    return data;
}

export default class RenderMassContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: mapRechartData(mass),//, aliases),
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