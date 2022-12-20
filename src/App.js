import React from "react";
import RenderMassContainer from "./components/RenderMassContainer";
import RenderLengthContainer from "./components/RenderLengthContainer";
import RenderHRDiagramContainer from "./components/RenderHRDiagramContainer";
import VanDenHeuvel from "./components/VanDenHeuvel";
import rawdata from './data/341BSE_Detailed_Output_0.json';
//import { totalData } from "./components/DataUtil";

export default function App(props) {
  let syncId = null;

  return (
    <>
      
      <div className="plotContainer">
        <RenderMassContainer className="container" syncId={syncId} rawdata={rawdata}/>
        <br />
        <RenderLengthContainer className="container" syncId={syncId} rawdata={rawdata}/>
        <br /><br />
        <RenderHRDiagramContainer className="container" syncId={syncId} rawdata={rawdata}/>
      </div>

      <VanDenHeuvel rawdata={rawdata}/> <br />
    </>);
}
//<VanDenHeuvel /> <br />