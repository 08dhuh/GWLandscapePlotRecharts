import React from "react";
import { hrattr } from "../data/dataset";
import propTypes from "prop-types";
import RenderHRDiagram from "../components/RenderHRDiagram";

const aliases = {
    teff_1 : 'Temperature',
    teff_2 : 'Temperature',
    luminosity_1: 'Luminosity',
    luminosity_2: 'Luminosity',
    //time: 'time'
}

const mapRechartData = (dataset, aliases) => {
    let data1=[];
    let data2=[];
    let objkeys = Object.keys(aliases);
    dataset.time.forEach((t,i) => {
        let obj1 = {time: t};
        let obj2 = {time: t}
        objkeys.forEach(key=> {
            let datakey = aliases[key];
            key.includes('1') ? obj1[datakey] = dataset[key][i] : obj2[datakey] = dataset[key][i];
        });
        data1.push(obj1);
        data2.push(obj2);
    });
    return [data1, data2];
}

const [data1, data2] = mapRechartData(hrattr, aliases);

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