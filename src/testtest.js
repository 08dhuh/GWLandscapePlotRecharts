import * as hdf5 from 'jsfive';
import fs from 'fs';
let rawfile = fs.readFileSync('./data/BSE_Detailed_Output_0.h5');
let file = new hdf5.File(rawfile.buffer);
console.log(file.keys);
//console.log(file.get('Mass(1)')._dataobjects);

let mass = file.get('Mass(1)')._dataobjects.fh;
console.log(mass);

const view = new DataView(mass);
console.log(view.getFloat32(1, true));
//console.log(mass['Uint8Contents']);

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// const data = [
//   {
//     name: "Block A",
//     l1: 4000,
//     l2: 2400,
//     amt: 2400,
//   },
//   {
//     name: "Block B",
//     l1: 3000,
//     l2: 1398,
//     amt: 2210,
//   },
//   {
//     name: "Block C",
//     l1: 2000,
//     l2: 9800,
//     amt: 2290,
//   },
//   {
//     name: "Block D",
//     l1: 2780,
//     l2: 3908,
//     amt: 2000,
//   },
// ];
// return (
//   <div style={{
//     width: "800px",
//     height: "500px",
//     backgroundColor: "white"
//   }}>
//     <ResponsiveContainer width="100%"
//       height="100%">
//       <LineChart
//         width={500}
//         height={300}
//         data={data}
//         margin={{
//           top: 5,
//           right: 30,
//           left: 20,
//           bottom: 25,
//         }}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="time" padding={{ bottom: 10 }} unit="Myr">
//           <Label value="Time" position="bottom" offset={25} />            
//         </XAxis>
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Line
//           type="monotone"
//           dataKey="systemMass"
//           stroke="#8884d8" dot={false}
//           activeDot={false/*{ r: systemMass.length }*/}
//         />
//         <Line type="monotone"
//           dataKey="mass1"
//           stroke="#82ca9d" dot={false}/>

//         <Line type="monotone"
//           dataKey="mass2"
//           stroke="#b84f85" dot={false}/>

//         <Line type="monotone"
//           dataKey="CO_core1" dot={false}
//         />
//         <Line type="monotone"
//           dataKey="CO_core2" dot={false}
//         />
//         <Line type="monotone" dot={false}
//           dataKey="HE_core1"
//         />
//         <Line type="monotone"
//           dataKey="HE_core1" dot={false}
//         />
//       </LineChart>
//     </ResponsiveContainer>

//   </div>
// );// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Label
// } from "recharts";
//import { mass, length } from './data/dataset';