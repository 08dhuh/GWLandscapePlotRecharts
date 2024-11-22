import data from "../data/data.json";

const mass = {
    totalMass1: data.totalMass1,
    totalMass2: data.totalMass2,
    mass_ZAMS1: data.mass_ZAMS1,
    mass_ZAMS2: data.mass_ZAMS2,
    mass_0_1: data.mass_0_1,
    mass_0_2: data.mass_0_2,
    mass_CO_core1: data.mass_CO_core1,
    mass_CO_core2: data.mass_CO_core2,
    mass_core_1: data.mass_core1,
    mass_core_2: data.mass_core2,
    mass_HE_core1: data.mass_HE_core1,
    mass_HE_core2: data.mass_HE_core2,
    mass_env1: data.mass_env1,
    mass_env2: data.mass_env2,
    time: data.time,
    systemMass: data.totalMass1.map((m, i) => m + data.totalMass2[i]),
};

const length = {
    semimajor: data.semimajor,
    eccentricity: data.eccentricity,
    radius_1: data.radius_1,
    radius_2: data.radius_2,
    roche_radius_1: data.roche_radius_1,
    roche_radius_2: data.roche_radius_2,
    time: data.time,
    periapsis: data.semimajor.map((sma, i) => sma * (1 - data.eccentricity[i]))
};

const hrattr = {
    teff_1 : data.teff_1,
    teff_2 : data.teff_2,
    luminosity_1: data.luminosity_1,
    luminosity_2: data.luminosity_2,
    time: data.time
}

const vdhattr = {
    time: data.time,
    semimajor: data.semimajor,
    mass1: data.totalMass1,
    mass2: data.totalMass2,
    eccentricity: data.eccentricity,
    MT_history: data.MT_history,
    Stellar_Type1: data.Stellar_Type1,
    Stellar_Type2: data.Stellar_Type2,
    Z1: data.Z1
}

// export { 

//     mass, 
//     length, 
//     hrattr, 
//     vdhattr, 

// };