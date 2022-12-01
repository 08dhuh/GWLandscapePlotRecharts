import React from "react";
import RenderMassContainer from "./components/RenderMassContainer";
import RenderLengthContainer from "./components/RenderLengthContainer";
import RenderHRDiagramContainer from "./components/RenderHRDiagramContainer";
import VanDenHeuvel from "./components/VanDenHeuvel";
export default function App() {
  let syncId = null;
  return (
    <>
      <VanDenHeuvel /> <br />
      <div className="plotContainer">
        <RenderMassContainer className="container" syncId={syncId} />
        <br />
        <RenderLengthContainer className="container" syncId={syncId} />
        <br /><br />
        <RenderHRDiagramContainer className="container" syncId={syncId} />
      </div>
    </>);
}
