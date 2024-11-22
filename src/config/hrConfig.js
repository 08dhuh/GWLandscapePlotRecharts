import { units } from "./dataConfig"
export const hrConfig = {

    domains : {
        x: [1000, 10e6],
        y: [10e-11, 10e6]
    },

    radii : [ 1e-9,  1e-6,  0.001, 1,  1000, ],

    xticks:[1000, 10000, 100000, 1000000],
    initialState: {
        left: 1000,
        right: 10e6,
        bottom: 10e-11,
        top: 10e6,
        animation: false,
    },
    tooltipFormatter: (value, name) => {
        return <>{value} {units[name]}</>;
    },
    
    
}

