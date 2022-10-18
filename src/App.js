import React from "react";
import RenderMassContainer from "./components/RenderMassContainer";
import RenderLengthContainer from "./components/RenderLengthContainer";
import RenderHRDiagramContainer from "./components/RenderHRDiagramContainer";

export default function App() {
  let syncId = 'null';
  return (<div>
    <RenderMassContainer syncId={syncId} />
    <br />
    <RenderLengthContainer syncId={syncId} />
    <br /><br />
    <RenderHRDiagramContainer syncId={syncId} />
  </div>);
}
