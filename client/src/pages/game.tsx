import { useState } from "react";
import { userStore } from "../stores/user";
import { Navigate } from "react-router-dom";

function Game() {
  const { gameRoom, nickname, sendPlay } = userStore();
  const [selected, setSelected] = useState<{ [i: string]: boolean }>({});
  const [handSelected, setHandSelected] = useState(-1);
  if (!gameRoom) return <Navigate to="/queue" />;

  const handSumbit = () =>
     {
    if (handSelected === -1) return;
    const sels = Object.keys(selected)
      .reduce(
        (prev, current) => (selected[current] ? prev + " " + current : " "),
        ""
      )
      .replace(/[ +]/, " ")
      .trim();
    if (!sels) return sendPlay("d" + String(handSelected));
    else sendPlay(String(handSelected) + "!" + sels);
    setSelected({});
    setHandSelected(-1);
  };
  const handleSelect = (i: number) => {
    setSelected({ ...selected, [i]: !selected[i] });
  };
  const handleHandSelect = (i: number) => {
    if (handSelected === i) return setHandSelected(-1);
    setHandSelected(i);
  };

  return (
    <>
      {gameRoom.turn && "Your turn"}
      <h1>Roomid : {gameRoom?.id}</h1>
      <h3>{nickname}(you)</h3>
      playing aginst
      <h2>{gameRoom?.players?.find((el) => nickname !== el) || nickname}</h2>
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
