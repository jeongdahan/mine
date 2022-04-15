import React, { useMemo, useReducer, createContext } from "react";
import { createMine, CODE } from "src/core/helpers/mineHelper";

const initialState = {
  tableData: [],
  data: { row: 0, cell: 0, mine: 0 },
  timer: 0,
  result: "",
  stop: true,
  opened: 0,
  flag: 0,
  flagMine: 0,
};

export const START_GAME = "START_GAME";
export const CLICK_MINE = "CLICK_MINE";
export const OPEN_CELL = "OPEN_CELL";
export const FLAG_CELL = "FLAG_CELL";
export const NORMAL_CELL = "NORMAL_CELL";
export const TIMER = "TIMER";

const reducer = (state, action) => {
  switch (action.type) {
    case START_GAME: {
      const { row, cell, mine, stop } = action;
      const { timer, result, opened, flag, flagMine } = initialState;

      return {
        ...state,
        tableData: createMine(row, cell, mine),
        data: { row, cell, mine },
        timer,
        result,
        stop: stop,
        opened,
        flag,
        flagMine,
      };
    }

    case OPEN_CELL: {
      const { row, cell } = action;
      const { data, opened } = state;
      const tableData = [...state.tableData];
      tableData[row] = [...state.tableData[row]];
      let _opened = 0;
      let around = [];
      let stop = false;
      let result = "";

      if (tableData[row][cell] !== CODE.NORMAL) {
        return { ...state };
      }

      if (tableData[row - 1]) {
        around = around.concat(
          tableData[row - 1][cell - 1],
          tableData[row - 1][cell],
          tableData[row - 1][cell + 1]
        );
      }

      around = around.concat(
        tableData[row][cell - 1],
        tableData[row][cell + 1]
      );

      if (tableData[row + 1]) {
        around = around.concat(
          tableData[row + 1][cell - 1],
          tableData[row + 1][cell],
          tableData[row + 1][cell + 1]
        );
      }

      if (tableData[row][cell] === CODE.NORMAL) {
        _opened += 1;
      }

      const mineCount = around.filter((v) =>
        [CODE.MINE, CODE.FLAG_MINE].includes(v)
      ).length;

      tableData[row][cell] = mineCount;

      if (data.row * data.cell - data.mine === opened + _opened) {
        stop = true;
        result = "승리 하셨습니다.";
      }

      return {
        ...state,
        tableData,
        result,
        stop,
        opened: opened + _opened,
      };
    }

    case CLICK_MINE: {
      const { row } = action;
      const tableData = [...state.tableData];
      tableData[row] = [...state.tableData[row]];

      const tableDataMineToClickedMine = tableData[row].map((_, i) => {
        return tableData[i].map((_, j) => {
          return tableData[i][j] === CODE.MINE
            ? CODE.CLICKED_MINE
            : tableData[i][j];
        });
      });

      return {
        ...state,
        tableData: tableDataMineToClickedMine,
        result: "실패 하셨습니다.",
        stop: true,
      };
    }

    case FLAG_CELL: {
      const { row, cell } = action;
      const { data, flag, flagMine } = state;
      const tableData = [...state.tableData];
      tableData[row] = [...state.tableData[row]];

      let _flag = 0;
      let _flagMine = 0;
      let stop = false;
      let result = "";

      if (!(data.mine - flag)) {
        return {
          ...state,
        };
      }

      if (tableData[row][cell] === CODE.MINE) {
        tableData[row][cell] = CODE.FLAG_MINE;
        _flagMine += 1;
      } else {
        tableData[row][cell] = CODE.FLAG;
      }

      _flag += 1;

      if (data.mine === flagMine + _flagMine) {
        stop = true;
        result = "모든 지뢰를 찾아서 승리 하셨습니다.";
      }

      return {
        ...state,
        tableData,
        result,
        stop,
        flag: flag + _flag,
        flagMine: flagMine + _flagMine,
      };
    }

    case NORMAL_CELL: {
      const { row, cell } = action;
      const { flag, flagMine } = state;
      const tableData = [...state.tableData];
      tableData[row] = [...state.tableData[row]];

      let _flag = 0;
      let _flagMine = 0;

      if (tableData[row][cell] === CODE.FLAG_MINE) {
        tableData[row][cell] = CODE.MINE;
        _flagMine += 1;
      } else {
        tableData[row][cell] = CODE.NORMAL;
      }

      _flag += 1;

      return {
        ...state,
        tableData,
        flag: flag - _flag,
        flagMine: flagMine - _flagMine,
      };
    }

    case TIMER: {
      return {
        ...state,
        timer: state.timer + 1,
      };
    }
    default:
      return state;
  }
};

const MineContext = createContext(null);

const MineProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, data, timer, result, stop, flag } = state;

  const value = useMemo(
    () => ({
      tableData,
      timer,
      result,
      stop,
      flag: flag,
      mine: data.mine,
      dispatch,
    }),
    [tableData, timer, stop, result, flag, data.mine, dispatch]
  );

  return <MineContext.Provider value={value}>{children}</MineContext.Provider>;
};

export { MineProvider, MineContext };
