import React from "react";
import propTypes from "prop-types";
import RenderHRDiagram from "./RenderHRDiagram";
import { useDataContext } from "../../context/DataContext";


export default function RenderHRDiagramContainer({ syncId }) {


    const { dataBank } = useDataContext();
    console.log(dataBank);
    const [data1, data2] = dataBank['hr'];

    return <RenderHRDiagram data1={data1} data2={data2} syncId={syncId} />;
};

RenderHRDiagramContainer.propTypes = {
    syncId: propTypes.string,
};