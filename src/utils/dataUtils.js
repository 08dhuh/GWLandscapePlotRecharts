import { attributeMappings, aliases } from "../config/dataConfig";

const processData = (data, type) => {
    //console.log(type);
    const attr = attributeMappings[type];    
    //console.log(attr);

    const rawData = extractData(data, attr);

    switch (type) {
        case 'vdh':
            return rawData;
        case 'hr':
            const alias = aliases.hr;
            return mapScatterData(rawData, alias);
        case 'mass':
        case 'length':
            return mapLineData(rawData);
        
        default:

            throw new Error(`Unsupported type: ${type}`);
    }
};

const extractData = (data, mapping) => {
    const processed = {};
    for (const [key, value] of Object.entries(mapping)) {
      if (typeof value === "function") {
        processed[key] = value(data); 
      } else if (typeof value === "string") {
        processed[key] = data[value]; 
      }
    }
    return processed;
  };
  

const mapLineData = (dataset, keys = null) => {
    let data = [];
    dataset.time.forEach((_, i) => {
        let obj = {};
        let objkeys = keys ? Object.keys(keys) : Object.keys(dataset);
        objkeys.forEach(key => {
            keys ? (obj[keys[key]] = dataset[key][i]) : (obj[key] = dataset[key][i]);
        });
        data.push(obj);
    });
    return data;
};
const mapScatterData = (dataset, aliases) => {
    let data1 = [];
    let data2 = [];
    let objkeys = Object.keys(aliases);
    dataset.time.forEach((t, i) => {
        let obj1 = { time: t };
        let obj2 = { time: t };
        objkeys.forEach((key) => {
            let datakey = aliases[key];
            key.includes('1') ? (obj1[datakey] = dataset[key][i]) : (obj2[datakey] = dataset[key][i]);
        });
        data1.push(obj1);
        data2.push(obj2);
    });
    return [data1, data2];
};

export { processData };
