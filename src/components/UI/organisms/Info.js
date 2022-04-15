import React from "react";
import styled from "styled-components";

const Info = ({ remainMine, timer, result, onStartGame }) => {
  return (
    <section>
      <InfoBoxStyle>
        <div>남은 지뢰: {remainMine}</div>
        <button onClick={() => onStartGame(false)}>시작</button>
        <div>타이머: {timer}</div>
      </InfoBoxStyle>
      {result && <div>결과: {result}</div>}
    </section>
  );
};

const InfoBoxStyle = styled.section`
  display: flex;
  justify-content: space-around;

  padding: 2rem 0;
`;

export default React.memo(Info);
