const CODE = {
  OPENED: 0,
  NORMAL: -1,
  FLAG: -2,
  FLAG_MINE: -3,
  CLICKED_MINE: -4,
  MINE: -99,
};

const createMine = (row, cell, mine) => {
  const data = [];
  const shuffle = [];

  let i = 0;
  while (i < mine) {
    const chosen = Math.floor(Math.random() * (row * cell));
    if (shuffle.includes(chosen) === false) {
      shuffle.push(chosen);
      i++;
    }
  }

  for (let i = 0; i < row; i++) {
    const rowData = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }

  for (let k = 0; k < shuffle.length; k++) {
    const _row = Math.floor(shuffle[k] / cell);
    const _hor = shuffle[k] % cell;
    data[_row][_hor] = CODE.MINE;
  }

  return data;
};

export { createMine, CODE };
