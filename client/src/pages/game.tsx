import { useState } from "react";
import { userStore } from "../stores/user";
import { Navigate } from "react-router-dom";

function Game() {
  const [selected, setSelected] = useState<{ [i: string]: boolean }>({})
  const [handSelected, setHandSelected] = useState(-1)
  const { gameRoom, nickname, sendPlay } = userStore()
  if (!gameRoom) return <Navigate to="/queue" />

  const handSumbit = () => {
    if (handSelected === -1) return;
    const sels = Object.keys(selected)
      .reduce(
        (prev, current) => (selected[current] ? prev + " " + current : " "),
        ""
      )
      .replace(/[ +]/, " ")
      .trim();
    if (!sels) sendPlay("d" + String(handSelected));
    else sendPlay(String(handSelected) + "!" + sels);
    setHandSelected(-1);
    setSelected({});
  };
  const handleSelect = (i: number) => {
    setSelected({ ...selected, [i]: !selected[i] });
  };
  const handleHandSelect = (i: number) => {
    if (handSelected === i) return setHandSelected(-1);
    setHandSelected(i);
  }

  return (
    <>

      {(gameRoom?.players?.findIndex((el) => nickname === el) === gameRoom.turn) && 'Your Turn'}
      <h1>Roomid : {gameRoom?.id}</h1>
      {/* e<h3>{nickname}(you)</h3> */}
      playing against
      <h2>{gameRoom?.players?.find((el) => nickname === el) || nickname}</h2>
      <div>
        on <em>ground</em>: <br />
        {gameRoom?.ground?.map((el, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            style={{ opacity: selected[i] ? "50%" : "100%" }}
          >
            {el}
          </button>
        ))}
        <br />
        <br />
        <strong>your hand</strong> <br />
        {gameRoom?.hand?.map((el, i) => (
          <button
            key={i}
            onClick={() => handleHandSelect(i)}
            style={{ opacity: handSelected === i ? "50%" : "100%" }}
          >
            {el}
          </button>
        ))}
        <button onClick={handSumbit}>submit</button>
      </div>

    </>
  );
}

export default Game;
