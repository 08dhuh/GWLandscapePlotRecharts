const attributeMappings = {
    mass: {
      totalMass1: "totalMass1",
      totalMass2: "totalMass2",
      mass_ZAMS1: "mass_ZAMS1",
      mass_ZAMS2: "mass_ZAMS2",
      mass_0_1: "mass_0_1",
      mass_0_2: "mass_0_2",
      mass_CO_core1: "mass_CO_core1",
      mass_CO_core2: "mass_CO_core2",
      mass_core_1: "mass_core_1",
      mass_core_2: "mass_core_2",
      mass_HE_core1: "mass_HE_core1",
      mass_HE_core2: "mass_HE_core2",
      mass_env1: "mass_env1",
      mass_env2: "mass_env2",
      time: "time",
      systemMass: (data) => data.totalMass1.map((m, i) => m + data.totalMass2[i]),
    },
    length: {
      semimajor: "semimajor",
      eccentricity: "eccentricity",
      radius_1: "radius_1",
      radius_2: "radius_2",
      roche_radius_1: "roche_radius_1",
      roche_radius_2: "roche_radius_2",
      time: "time",
      periapsis: (data) =>
        data.semimajor.map((sma, i) => sma * (1 - data.eccentricity[i])),
    },
    hr: {
      teff_1: "teff_1",
      teff_2: "teff_2",
      luminosity_1: "luminosity_1",
      luminosity_2: "luminosity_2",
      time: "time",
    },
    vdh: {
      time: "time",
      semimajor: "semimajor",
      mass1: "totalMass1",
      mass2: "totalMass2",
      eccentricity: "eccentricity",
      MT_history: "MT_history",
      Stellar_Type1: "Stellar_Type1",
      Stellar_Type2: "Stellar_Type2",
      Z1: "Z1",
    },
  };
  
const aliases = {
    mass: {
        totalMass1: 'Mass1',
        totalMass2: 'Mass2',
        systemMass: 'System Mass',
        mass_CO_core1: 'CO core1',
        mass_CO_core2: 'CO core2',
        mass_HE_core1: 'HE core1',
        mass_HE_core2: 'HE core2',
        time: 'time',
    },
    length: {
        semimajor: 'semi-major axis',
        periapsis: 'periapsis',
        radius_1: 'radius 1',
        radius_2: 'radius 2',
        roche_radius_1: 'roche radius 1',
        roche_radius_2: 'roche radius 2',
        time: 'time',
    },
    hr: {
        teff_1: 'Temperature',
        teff_2: 'Temperature',
        luminosity_1: 'Luminosity',
        luminosity_2: 'Luminosity',
    },
  };

const units = {
    time: 'Myr',
    Temperature: 'K',
    Luminosity: <>L<sub>&#8857;</sub></>,
    mass: <>M<sub>&#8857;</sub></>,
    length: <>R<sub>&#8857;</sub></>,
};

//const fallbackDataPath = process.env.REACT_APP_FALLBACK_DATA_PATH || "/data.json";
const serverDataPath = "/data.json";

export { attributeMappings, 
  aliases,
    units, 
    //fallbackDataPath, 
    serverDataPath  };
