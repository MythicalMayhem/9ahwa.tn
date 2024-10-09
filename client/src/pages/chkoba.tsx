import { ReactNode, useState } from "react";
import { userStore } from "../stores/user";
import { Navigate } from "react-router-dom";

import '../styles/chkoba.css'
const shapeMap: { [type: string]: string } = {
  "c": 'svgs/club.png',
  "s": 'svgs/spade.png',
  "h": 'svgs/heart.png',
  "d": 'svgs/diamond.png',
}

function ChkobaGame() {
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
    <div className="chkoba">

      {(gameRoom?.players?.findIndex((el) => nickname === el) === gameRoom.turn) && 'Your Turn'}
      <h1>Roomid : {gameRoom?.id}</h1>
      {/* e<h3>{nickname}(you)</h3> */}
      playing against
      <h2>{gameRoom?.players?.find((el) => nickname === el) || nickname}</h2>
      <em className="line-break">ground:</em>
      <div className="ground">
        {gameRoom?.ground?.map((id, i) => {
          const shapes: ReactNode[] = []
          for (let i = 0; i < Number(id[1]) + 1; i++)
            shapes.push(<img key={i} className="svg" src={shapeMap[id[0]]} alt={id[0]} />)
          return <div
            key={i}
            onClick={() => handleSelect(i)}
            style={{
              opacity: selected[i] ? "50%" : "100%", rotate: 10 * Math.random() * (Math.random() < 0.5 ? -1 : 1
              ) + 'deg'
            }}
            className={"table-card hand-card " + id[1]}>{shapes}</div>
        })}
      </div>
      <button className="submit-play line-break" onClick={handSumbit}>submit</button>
      <strong className="line-break">your hand</strong>
      <div className="hand">

        {gameRoom?.hand?.map((id, i) => {
          const shapes: ReactNode[] = []
          for (let i = 0; i < Number(id[1]) + 1; i++)
            shapes.push(<img key={i} className="svg" src={shapeMap[id[0]]} alt={id[0]} />)
          return <div key={i}
            onClick={() => handleHandSelect(i)}
            style={{ opacity: handSelected === i ? "50%" : "100%", rotate: 20 * i - 20 + 'deg' }}
            className={"hand-card " + id[1]} >{shapes}</div>
        })}
      </div>

    </div >
  );
}

export default ChkobaGame;
