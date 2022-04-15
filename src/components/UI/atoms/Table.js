import React, { Fragment } from "react";
import { CODE } from "src/core/helpers/mineHelper";
import styled from "styled-components";

const getTdText = (code) => {
  switch (code) {
    case CODE.NORMAL:
      return "";
    case CODE.CLICKED_MINE:
      return "💣";
    case CODE.FLAG_MINE:
    case CODE.FLAG:
      return "🚩";
    case CODE.MINE:
      return "";
    default:
      return code || "";
  }
};

const handleColorType = (code) => {
  switch (code) {
    case CODE.NORMAL:
    case CODE.MINE:
      return "lightgray";

    case CODE.CLICKED_MINE:
      return "red";

    case CODE.FLAG_MINE:
    case CODE.FLAG:
      return "yellow";

    default:
      return "white";
  }
};

const Table = ({ data, onClickTd, onRightClickTd }) => {
  return (
    <table>
      <tbody>
        {data.map((tr, i) => (
          <Fragment key={i}>
            <Tr
              trKey={i}
              data={tr}
              rowIndex={i}
              onClickTd={onClickTd}
              onRightClickTd={onRightClickTd}
            />
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};

const Tr = React.memo(({ data, rowIndex, onClickTd, onRightClickTd }) => {
  return (
    <tr>
      {data.map((td, i) => (
        <Fragment key={rowIndex + i}>
          <Td
            data={td}
            rowIndex={rowIndex}
            cellIndex={i}
            onClickTd={onClickTd}
            onRightClickTd={onRightClickTd}
          />
        </Fragment>
      ))}
    </tr>
  );
});

const Td = React.memo(
  ({ data, rowIndex, cellIndex, onClickTd, onRightClickTd }) => {
    return (
      <TdStyle
        code={data}
        onClick={() => {
          return onClickTd(rowIndex, cellIndex);
        }}
        onContextMenu={(e) => onRightClickTd(e, rowIndex, cellIndex)}
      >
        {getTdText(data)}
      </TdStyle>
    );
  }
);

Table.Tr = Tr;
Table.Td = Td;

const TdStyle = styled.td`
  background-color: ${(props) => handleColorType(props.code)};
`;

export default React.memo(Table);
