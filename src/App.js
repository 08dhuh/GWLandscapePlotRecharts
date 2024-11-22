import React from "react";
import RenderLineChartContainer from "./components/linechart/RenderLineChartContainer";
import RenderHRDiagramContainer from "./components/hr/RenderHRDiagramContainer";
import VanDenHeuvel from "./components/vdh/VanDenHeuvel";
import { DataProvider, useDataContext } from "./context/DataContext";

const AppContent = () => {
  //const { loading, error } = useDataContext();

  const { dataBank, loading, error } = useDataContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Ensure dataBank is fully populated before rendering components
  if (!dataBank.mass || !dataBank.length || !dataBank.vdh || !dataBank.hr) {
    return <div>Data is still loading...</div>;
  }


  let syncId = null;

  return (
    <>
      <VanDenHeuvel />
      <div className="plotContainer">
        <RenderLineChartContainer chartType="mass" syncId={syncId} />
        <RenderLineChartContainer chartType="length" syncId={syncId} />
        <RenderHRDiagramContainer syncId={syncId} />
      </div>
    </>
  );
};

const App = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;


// import React from "react";
// //import RenderMassContainer from "./components/RenderMassContainer";
// //import RenderLengthContainer from "./components/RenderLengthContainer";
// import RenderLineChartContainer from "./components/linechart/RenderLineChartContainer";
// import RenderHRDiagramContainer from "./components/hr/RenderHRDiagram";
// import VanDenHeuvel from "./components/vdh/VanDenHeuvel";
// import { DataProvider } from "./context/DataContext";

// // export default function App() {
// //   let syncId = null;
// //   return (
// //     <>
// //     <DataProvider>
// //       <VanDenHeuvel /> <br />
// //       <div className="plotContainer">
// //         <RenderMassContainer className="container" syncId={syncId} />
// //         <br />
// //         <RenderLengthContainer className="container" syncId={syncId} />
// //         <br /><br />
// //         <RenderHRDiagramContainer className="container" syncId={syncId} />
// //       </div>
// //       </DataProvider>
// //     </>);
// // }
// const App = () => {
//   let syncId = null;


//   return (
//       <DataProvider>
//           <VanDenHeuvel />
//           <div className="plotContainer">
//             <RenderLineChartContainer chartType='mass' syncId={syncId} />
//             <RenderLineChartContainer chartType="length" syncId={syncId} />

//               {/* <RenderMassContainer syncId={syncId} />
//               <RenderLengthContainer syncId={syncId} /> */}
//               <RenderHRDiagramContainer syncId={syncId} />
//           </div>
//       </DataProvider>
//   );
// };

// export default App;
