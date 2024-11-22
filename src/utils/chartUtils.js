export const getTwoPoints = (data) => {
    if (!data || data.length < 2) return null;
    let point1 = { y: data[0].y, value: data[0].value };
    let p = data.find((point) =>
        point1.value === 0
            ? point.value !== point1.value
            : Math.abs((point.value - point1.value) / point1.value) > 1.1
    );
    let point2 = p ? { y: p.y, value: p.value } : null;
    return point2 ? [point1, point2] : null;
};

export const getYconstsLinear = (p1, p2) => [
    (p1.value - p2.value) / (p1.y - p2.y),
    p1.value - ((p1.value - p2.value) / (p1.y - p2.y)) * p1.y,
];

export const getYconstsLog = (p1, p2) => [
    (p1.y - p2.y) / Math.log10(p1.value / p2.value),
    p1.y - ((p1.y - p2.y) / Math.log10(p1.value / p2.value)) * Math.log10(p1.value),
];

export const translateChartYtoCoordY = (chartY, yconst, scaleType) => {
    if (scaleType === "Linear") {
        return yconst[0] * chartY + yconst[1];
    }
    return 10 ** ((chartY - yconst[1]) / yconst[0]);
};


export const hasYDataInXRange = (xrangeData, minY, maxY) => {
    return xrangeData.some((point) => {
        return Object.values(point).some((value) => value >= minY && value <= maxY);
    });
};

export const tickDecimalFormatter = f => f.toFixed(2);

export const tickExpFormatter = num => {
    const superscript = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    const minus = '⁻';
    const toSuper = n => `${n}`.split('').map(m =>
        m === '-' ? minus : superscript[m]
    ).join('');
    const [base, exponent] = num.toExponential().split('e').map(n => parseFloat(n));
    return base === 0 ? 0 : `${base === 1 ? '' : base + '×'}${10 + toSuper(exponent)}`;
    //return (<>{{base}}<sup>{{exponent}}</sup></>);
}
