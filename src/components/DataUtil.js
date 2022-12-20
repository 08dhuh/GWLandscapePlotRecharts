import React, { useState } from 'react';
//import data from "../data/data.json";


const mapLineData = (dataset, keys = null, xkey = 'Time') => {
    let data = [];
    dataset[xkey].forEach((_, i) => {
        let obj = {};
        let objkeys = keys ? Object.keys(keys) : Object.keys(dataset);
        objkeys.forEach(key => { keys ? obj[keys[key]] = dataset[key][i] : obj[key] = dataset[key][i] });
        data.push(obj);
        //console.log(obj);
    });
    //console.log('Linedata'+data);
    return data;
}

const mapScatterData = (dataset, aliases, xkey = 'Time') => { //has two separate datasets
    let data1 = [];
    let data2 = [];
    let objkeys = Object.keys(aliases);

    dataset[xkey].forEach((t, i) => {
        let obj1 = { Time: t };
        let obj2 = { Time: t }
        objkeys.forEach(key => {
            let datakey = aliases[key];
            key.includes('1') ? obj1[datakey] = dataset[key][i] : obj2[datakey] = dataset[key][i];
        });
        data1.push(obj1);
        data2.push(obj2);
    });
    //console.log(data1, data2);
    return [data1, data2];
}


export default function DataUtil(rawfile, type, aliases = null) {
    //const [state,]    
    const masskeys = [
        'Mass(1)',
        'Mass(2)',
        'Mass_CO_Core(1)',
        'Mass_CO_Core(2)',
        'Mass_He_Core(1)',
        'Mass_He_Core(2)',
        'Time'
    ];
    const lengthkeys = [
        'Time',
        'Radius(1)',
        'Radius(2)',
        'Radius(1)|RL',
        'Radius(2)|RL',
        'Eccentricity',
        //'Periapsis': 'periapsis',
        'SemiMajorAxis'
    ];
    const hrkeys = [
        'Luminosity(1)',
        'Luminosity(2)',
        'Teff(1)',
        'Teff(2)',
        'Time',
    ];
    const vdhkeys = [
        'Time',
        'Eccentricity',
        'SemiMajorAxis',
        'Mass(1)',
        'Mass(2)',
        'MT_History',
        'Stellar_Type(1)',
        'Stellar_Type(2)',
        'Metallicity@ZAMS(1)'
    ];

    const selectData = (obj, keys) => Object.keys(obj).filter(k => keys.includes(k)).reduce((res, k) => Object.assign(res, { [k]: obj[k] }), {});

    const mass = () => {
        const data = selectData(rawfile, masskeys);
        data['SystemMass'] = data['Mass(1)'].map((m, i) => m + data['Mass(2)'][i]);
        return mapLineData(data);
    };
    const length = () => {
        const data = selectData(rawfile, lengthkeys);
        data['Periapsis'] = data['SemiMajorAxis'].map((sma, i) => sma * (1 - data['Eccentricity'][i]));
        return mapLineData(data);
    };
    const hrattr = aliases => {
        return mapScatterData(selectData(rawfile, hrkeys), aliases);
    };

    const vdhattr = () => {return selectData(rawfile, vdhkeys)};

    switch (type) {
        case 'Mass':
            return mass();
        case 'Length':
            return length();
        case 'HR':
            return hrattr(aliases);
        case 'VanDenHeuvel':
            return vdhattr();
        default:
            throw new Error("Invalid type " + type);
    }
}

const time = 'Time';

export const units = {
    time: 'Myr',
    Temperature: 'K',
    Luminosity: <>L<sub>&#8857;</sub></>,
    mass: <>M<sub>&#8857;</sub></>,
    length: <>R<sub>&#8857;</sub></>
}

const datakeys = ['Age(1)',
    'Age(2)',
    'Ang_Momentum(1)',
    'Ang_Momentum(2)',
    'Ang_Momentum_Total',
    'Dominant_Mass_Loss_Rate(1)',
    'Dominant_Mass_Loss_Rate(2)',
    'Eccentricity',
    'Energy_Total',
    'Luminosity(1)',
    'Luminosity(2)',
    'MT_History',
    'Mass(1)',
    'Mass(2)',
    'Mass@ZAMS(1)',
    'Mass@ZAMS(2)',
    'Mass_0(1)',
    'Mass_0(2)',
    'Mass_CO_Core(1)',
    'Mass_CO_Core(2)',
    'Mass_Core(1)',
    'Mass_Core(2)',
    'Mass_Env(1)',
    'Mass_Env(2)',
    'Mass_He_Core(1)',
    'Mass_He_Core(2)',
    'Metallicity@ZAMS(1)',
    'Metallicity@ZAMS(2)',
    'Omega(1)',
    'Omega(2)',
    'Omega_Break(1)',
    'Omega_Break(2)',
    'Pulsar_Mag_Field(1)',
    'Pulsar_Mag_Field(2)',
    'Pulsar_Spin_Down(1)',
    'Pulsar_Spin_Down(2)',
    'Pulsar_Spin_Freq(1)',
    'Pulsar_Spin_Freq(2)',
    'Radius(1)',
    'Radius(1)|RL',
    'Radius(2)',
    'Radius(2)|RL',
    'RocheLobe(1)|a',
    'RocheLobe(2)|a',
    'SEED',
    'SemiMajorAxis',
    'Stellar_Type(1)',
    'Stellar_Type(2)',
    'Stellar_Type@ZAMS(1)',
    'Stellar_Type@ZAMS(2)',
    'Tau_Dynamical(1)',
    'Tau_Dynamical(2)',
    'Tau_Nuclear(1)',
    'Tau_Nuclear(2)',
    'Tau_Radial(1)',
    'Tau_Radial(2)',
    'Tau_Thermal(1)',
    'Tau_Thermal(2)',
    'Teff(1)',
    'Teff(2)',
    'Time',
    'Zeta_Hurley(1)',
    'Zeta_Hurley(2)',
    'Zeta_Hurley_He(1)',
    'Zeta_Hurley_He(2)',
    'Zeta_Soberman(1)',
    'Zeta_Soberman(2)',
    'Zeta_Soberman_He(1)',
    'Zeta_Soberman_He(2)',
    'dT',
    'dmMT(1)',
    'dmMT(2)',
    'dmWinds(1)',
    'dmWinds(2)'];

// const mapLineDataforScatterChart = (dataset, ykey, aliases = null) => {
//     let data_total = {};
//     let objkeys = aliases ? Object.keys(aliases) : Object.keys(dataset);
//     objkeys.forEach(key => {
//         if (key === 'time') return;
//         let data = []; //data to be pushed into data_total
//         //let datakey = aliases? aliases[key] : key; //if aliases is provided it will be entry
//         let datakey = key;
//         dataset.time.forEach((t, i) => {
//             let obj = { time: t };
//             obj[ykey] = dataset[key][i];
//             data.push(obj);
//         });
//         data_total[datakey] = data;
//     });
//     return data_total;
// }


// export const totalData = datafilepath => {
//     const total = {};
//     datakeys.forEach(key => {
//         total[key] = data[key];
//     });
//     total['System_Mass'] = data['Mass(1)'].map((m, i) => m + data['Mass(2)']);
//     total['Periapsis'] = data['SemiMajorAxis'].map((sma, i) => sma * (1 - data['Eccentricity'][i]));
// const total = {
//     totalMass1: data.totalMass1,
//     totalMass2: data.totalMass2,
//     mass_ZAMS1: data.mass_ZAMS1,
//     mass_ZAMS2: data.mass_ZAMS2,
//     mass_0_1: data.mass_0_1,
//     mass_0_2: data.mass_0_2,
//     mass_CO_core1: data.mass_CO_core1,
//     mass_CO_core2: data.mass_CO_core2,
//     mass_core_1: data.mass_core1,
//     mass_core_2: data.mass_core2,
//     mass_HE_core1: data.mass_HE_core1,
//     mass_HE_core2: data.mass_HE_core2,
//     mass_env1: data.mass_env1,
//     mass_env2: data.mass_env2,
//     time: data.time,
//     systemMass: data.totalMass1.map((m, i) => m + data.totalMass2[i]),
//     semimajor: data.semimajor,
//     eccentricity: data.eccentricity,
//     radius_1: data.radius_1,
//     radius_2: data.radius_2,
//     roche_radius_1: data.roche_radius_1,
//     roche_radius_2: data.roche_radius_2,
//     periapsis: data.semimajor.map((sma, i) => sma * (1 - data.eccentricity[i])),
//     teff_1: data.teff_1,
//     teff_2: data.teff_2,
//     luminosity_1: data.luminosity_1,
//     luminosity_2: data.luminosity_2,
//     MT_history: data.MT_history,
//     Stellar_Type1: data.Stellar_Type1,
//     Stellar_Type2: data.Stellar_Type2,
//     Z1: data.Z1
// };
//     return total;
// }


// const mass = {
//     totalMass1: data.totalMass1,
//     totalMass2: data.totalMass2,
//     mass_ZAMS1: data.mass_ZAMS1,
//     mass_ZAMS2: data.mass_ZAMS2,
//     mass_0_1: data.mass_0_1,
//     mass_0_2: data.mass_0_2,
//     mass_CO_core1: data.mass_CO_core1,
//     mass_CO_core2: data.mass_CO_core2,
//     mass_core_1: data.mass_core1,
//     mass_core_2: data.mass_core2,
//     mass_HE_core1: data.mass_HE_core1,
//     mass_HE_core2: data.mass_HE_core2,
//     mass_env1: data.mass_env1,
//     mass_env2: data.mass_env2,
//     time: data.time,
//     systemMass: data.totalMass1.map((m, i) => m + data.totalMass2[i]),
// };

// const length = {
//     semimajor: data.semimajor,
//     eccentricity: data.eccentricity,
//     radius_1: data.radius_1,
//     radius_2: data.radius_2,
//     roche_radius_1: data.roche_radius_1,
//     roche_radius_2: data.roche_radius_2,
//     time: data.time,
//     periapsis: data.semimajor.map((sma, i) => sma * (1 - data.eccentricity[i]))
// };

// const hrattr = {
//     teff_1: data.teff_1,
//     teff_2: data.teff_2,
//     luminosity_1: data.luminosity_1,
//     luminosity_2: data.luminosity_2,
//     time: data.time
// }

// const vdhattr = {
//     time: data.time,
//     semimajor: data.semimajor,
//     totalMass1: data.totalMass1,
//     totalMass2: data.totalMass2,
//     eccentricity: data.eccentricity,
//     MT_history: data.MT_history,
//     Stellar_Type1: data.Stellar_Type1,
//     Stellar_Type2: data.Stellar_Type2,
//     Z1: data.Z1
// }

// const mapLineData = (dataset, keys = null) => {
//     let data = [];
//     dataset[time].forEach((_, i) => {
//         let obj = {};
//         let objkeys = keys ? Object.keys(keys) : Object.keys(dataset);
//         objkeys.forEach(key => { keys ? obj[keys[key]] = dataset[key][i] : obj[key] = dataset[key][i] });
//         data.push(obj);
//     });
//     return data;
// }

// const mapScatterData = (dataset, aliases) => { //has two separate datasets
//     let data1 = [];
//     let data2 = [];
//     let objkeys = Object.keys(aliases);
//     dataset['time'].forEach((t, i) => {
//         let obj1 = { time: t };
//         let obj2 = { time: t }
//         objkeys.forEach(key => {
//             let datakey = aliases[key];
//             key.includes('1') ? obj1[datakey] = dataset[key][i] : obj2[datakey] = dataset[key][i];
//         });
//         data1.push(obj1);
//         data2.push(obj2);
//     });
//     return [data1, data2];
// }

// const mapLineDataforScatterChart = (dataset, ykey, aliases = null) => {
//     let data_total = {};
//     let objkeys = aliases ? Object.keys(aliases) : Object.keys(dataset);
//     objkeys.forEach(key => {
//         if (key === 'time') return;
//         let data = []; //data to be pushed into data_total
//         //let datakey = aliases? aliases[key] : key; //if aliases is provided it will be entry
//         let datakey = key;
//         dataset.time.forEach((t, i) => {
//             let obj = { time: t };
//             obj[ykey] = dataset[key][i];
//             data.push(obj);
//         });
//         data_total[datakey] = data;
//     });
//     return data_total;
// }

//export { units, mass, length, hrattr, vdhattr, mapLineData, mapScatterData, mapLineDataforScatterChart };