const filterData = (data, xlabel, ylabel, x1, x2, y1, y2) => {
    return data.filter( d => d[xlabel]>=x1 && d[xlabel]<=x2 && d[ylabel]>=y1 && d[ylabel]<=y2);
};

export {filterData};