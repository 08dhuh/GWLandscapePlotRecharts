const filterScatterData = (data, xlabel, ylabel, x1, x2, y1, y2) => {
    return data.filter(d => d[xlabel] >= x1 && d[xlabel] <= x2 && d[ylabel] >= y1 && d[ylabel] <= y2);
};


const tickExpFormatter = num => {
    const superscript = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    const minus = '⁻';
    const toSuper = n => `${n}`.split('').map(m =>
        m === '-' ? minus : superscript[m]
    ).join('');
    const [base, exponent] = num.toExponential().split('e').map(n => parseFloat(n));
    return base === 0 ? 0 : `${base === 1 ? '' : base + '×'}${10 + toSuper(exponent)}`;
    //return (<>{{base}}<sup>{{exponent}}</sup></>);
}


const LineChartTooltip = (props) => {
    const { active, payload, label, xunit, yunit } = props;
    if (active && payload && payload.length) {
        return (
            <div>
                <p>{`${label} ${xunit}`}</p>
                {payload.map(p => <p>{`${p.value.toFixed(4)}`} {yunit}</p>)}
            </div>
        );
        //
    }
}

const getLuminosity = (radius, temperature, Tsol=NaN) => {
    Tsol = Tsol || 6e3;
    temperature = temperature / Tsol;
    return radius**2 * temperature**4;
}

const getTemperature = (radius, luminosity, Tsol=NaN) => {
    Tsol = Tsol || 6e3;
    return (luminosity / radius**2)**(1/4) * Tsol;
}

const getReferenceRangeType = (R, xDomain, yDomain) => { // returns 0 if out of bounds, 1 if left edge, 2 if right edge, 3 if both
    let Lmin = getLuminosity(R, xDomain[0]);
    let Lmax = getLuminosity(R, xDomain[1]);
    let left = yDomain[0] < Lmin && yDomain[1] > Lmin;
    let right = yDomain[0] < Lmax && yDomain[1] > Lmax;
    if (left && right) return 3;
    if (left) return 1;
    if (right) return 2;
    return 0;
}
const getReferenceLineSegment = (R, xDomain, yDomain) => {
    let rangeType = getReferenceRangeType(R, xDomain, yDomain);
    let segment;
    switch (rangeType) {
        case 1: //left edge
            segment = [{ x: xDomain[0], y: getLuminosity(R, xDomain[0]) }, { x: getTemperature(R, yDomain[1]), y: yDomain[1] }];
            break;
        case 2: // right edge
            segment = [{ x: getTemperature(R, yDomain[0]), y: yDomain[0] }, { x: xDomain[1], y: getLuminosity(R, xDomain[1]) }];
            break;
        case 3: // both edges
            segment = [{ x: xDomain[0], y: getLuminosity(R, xDomain[0]) }, { x: xDomain[1], y: getLuminosity(R, xDomain[1]) }];
            break;
        default:
            return;
    }
    return segment;
}

export {
    filterScatterData as filterData,
    tickExpFormatter,
    LineChartTooltip as CustomTooltip,
    getLuminosity,
    getTemperature,
    getReferenceLineSegment,
    getReferenceRangeType
};
