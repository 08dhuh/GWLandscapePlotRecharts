import React from "react";
import RenderMassContainer from "./containers/RenderMassContainer";
import RenderLengthContainer from "./containers/RenderLengthContainer";
import RenderHRDiagramContainer from "./containers/RenderHRDiagramContainer";

export default function App() {
  let syncId = 'id';
  return (<div>
    <RenderMassContainer syncId={syncId} />
    <RenderLengthContainer syncId={syncId} />
    <br />
    <RenderHRDiagramContainer syncId={syncId} />
  </div>);
}
