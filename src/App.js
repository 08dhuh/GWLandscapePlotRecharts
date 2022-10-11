import React from "react";
import RenderMassContainer from "./containers/RenderMassContainer";
import RenderLengthContainer from "./containers/RenderLengthContainer";
import RenderHRDiagramContainer from "./containers/RenderHRDiagramContainer";

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
