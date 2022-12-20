import React from "react";
import DataUtil from "./DataUtil";
import propTypes from "prop-types";
import RenderHRDiagram from "./RenderHRDiagram";

const aliases = {
    'Teff(1)' : 'Temperature',
    'Teff(2)' : 'Temperature',
    'Luminosity(1)': 'Luminosity',
    'Luminosity(2)': 'Luminosity',
    //time: 'time'
}

//const [data1, data2] = DataUtil(hrattr, aliases);


export default function RenderHRDiagramContainer(props) {

    const data = DataUtil(props.rawdata,'HR', aliases);
    //console.log(data);
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         data1: data1,
    //         data2: data2,
    //         datakeys: Object.values(aliases).filter(k=>k!=='time'),
    //     };
    // }
    
    return <RenderHRDiagram data1={data[0]} data2={data[1]} syncId={props.syncId}/>;

}

RenderHRDiagramContainer.propTypes = {
    syncId: propTypes.string,
};