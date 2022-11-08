const filterData = (data, xlabel, ylabel, x1, x2, y1, y2) => {
    return data.filter( d => d[xlabel]>=x1 && d[xlabel]<=x2 && d[ylabel]>=y1 && d[ylabel]<=y2);
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

export {filterData, tickExpFormatter};
