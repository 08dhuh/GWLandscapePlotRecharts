export const chartConfig = {
    mass: {
      strokeStyle: {
        totalMass1: { stroke: 'red', strokeWidth: '2' },
        totalMass2: { stroke: 'blue', strokeWidth: '2' },
        systemMass: { stroke: 'black', strokeWidth: '2' },
        mass_CO_core1: { stroke: 'red', strokeDasharray: "5 5", strokeWidth: '2' },
        mass_CO_core2: { stroke: 'blue', strokeDasharray: "5 5", strokeWidth: '2' },
        mass_HE_core1: { stroke: 'red', strokeDasharray: "1 1 3", strokeWidth: '2' },
        mass_HE_core2: { stroke: 'blue', strokeDasharray: "1 1 3", strokeWidth: '2' },
      },
      aliases: {
        totalMass1: 'Mass1',
        totalMass2: 'Mass2',
        systemMass: 'System Mass',
        mass_CO_core1: 'CO core1',
        mass_CO_core2: 'CO core2',
        mass_HE_core1: 'HE core1',
        mass_HE_core2: 'HE core2',
        time: 'time',
      },
    },
    length: {
      strokeStyle: {
        semimajor: { stroke: 'black', strokeWidth: '2' },
        periapsis: { stroke: 'black', strokeWidth: '2', strokeDasharray: "5 5" },
        radius_1: { stroke: 'red', strokeWidth: '2' },
        radius_2: { stroke: 'blue', strokeWidth: '2' },
        roche_radius_1: { stroke: 'red', strokeDasharray: "5 5", strokeWidth: '2' },
        roche_radius_2: { stroke: 'blue', strokeDasharray: "5 5", strokeWidth: '2' },
      },
      aliases: {
        semimajor: 'semi-major axis',
        periapsis: 'periapsis',
        radius_1: 'radius 1',
        radius_2: 'radius 2',
        roche_radius_1: 'roche radius 1',
        roche_radius_2: 'roche radius 2',
        time: 'time',
      },
    },
    hr:{
        aliases: {
            teff_1 : 'Temperature',
            teff_2 : 'Temperature',
            luminosity_1: 'Luminosity',
            luminosity_2: 'Luminosity',
        
        }
    }
  };
  