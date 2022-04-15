import React, { useCallback, useMemo, useContext, useEffect } from "react";
import styled from "styled-components";
import {
  MineContext,
  START_GAME,
  CLICK_MINE,
  OPEN_CELL,
  FLAG_CELL,
  NORMAL_CELL,
  TIMER,
} from "src/core/providers/MineProvider";
import { CODE } from "src/core/helpers/mineHelper";
import { Info } from "src/components/UI/organisms";
import { Table } from "src/components/UI/atoms";

const MinePage = () => {
  const { tableData, timer, result, stop, flag, mine, dispatch } =
    useContext(MineContext);
  const remainMine = useMemo(() => mine - flag, [mine, flag]);
  const ROW = 8;
  const CELL = 8;
  const MINE = 15;

  const handleStartGame = useCallback(
    (stop) =>
      dispatch({
        type: START_GAME,
        row: ROW,
        cell: CELL,
        mine: MINE,
        stop: stop,
      }),
    [ROW, CELL, MINE, dispatch]
  );

  const handleClickTd = useCallback(
    (row, cell) => {
      if (stop) return;

      switch (tableData[row][cell]) {
        case CODE.OPENED:
        case CODE.FLAG:
        case CODE.FLAG_MINE:
        case CODE.NORMAL:
          return dispatch({
            type: OPEN_CELL,
            row,
            cell,
          });

        case CODE.MINE:
          return dispatch({
            type: CLICK_MINE,
            row,
            cell,
          });
        default:
          return;
      }
    },
    [tableData, stop, dispatch]
  );

  const handleRightClickTd = useCallback(
    (e, row, cell) => {
      e.preventDefault();

      if (stop) return;

      switch (tableData[row][cell]) {
        case CODE.NORMAL:
        case CODE.MINE:
          return dispatch({
            type: FLAG_CELL,
            row,
            cell,
          });

        case CODE.FLAG_MINE:
        case CODE.FLAG:
          return dispatch({
            type: NORMAL_CELL,
            row,
            cell,
          });

        default:
          return;
      }
    },
    [tableData, stop, dispatch]
  );

  useEffect(() => handleStartGame(true), [handleStartGame]);

  useEffect(() => {
    let timer = 0;

    if (stop === false) {
      timer = setInterval(() => {
        dispatch({ type: TIMER });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [stop, dispatch]);

  return (
    <div>
      <Info
        remainMine={remainMine}
        timer={timer}
        result={result}
        onStartGame={handleStartGame}
      />

      {tableData.length && (
        <TableLayout>
          <Table
            data={tableData}
            onClickTd={handleClickTd}
            onRightClickTd={handleRightClickTd}
          />
        </TableLayout>
      )}
    </div>
  );
};

const TableLayout = styled.div`
  display: flex;
  justify-content: center;
`;

export default React.memo(MinePage);
