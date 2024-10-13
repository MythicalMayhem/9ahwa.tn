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
export const generateCard = (id: string, i: number, onclick?: () => void, style?: {}) => {
  const shapes: ReactNode[] = []
  for (let i = 0; i < Number(id[1]) + 1; i++)
    shapes.push(<img key={i} className="svg" src={shapeMap[id[0]]} alt={id[0]} />)
  return <div
    key={i}
    onClick={() => (onclick || (() => null))()}
    style={style}
    className={"table-card hand-card " + id[1]}>{shapes}</div>
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
      {/* <h1>Roomid : {gameRoom?.id}</h1> */}
      <p>{nickname}(you)</p> playing against <p>{gameRoom?.players?.find((el) => nickname !== el) || nickname}</p>
      <div className="ground">
        {gameRoom?.ground?.map((id, i) => generateCard(id, i, () => handleSelect(i), {
          opacity: selected[i] ? "50%" : "100%", rotate: 10 * Math.random() * (Math.random() < 0.5 ? -1 : 1
          ) + 'deg'
        }))}
      </div>
      <button className="submit-play line-break" onClick={handSumbit}>{"submit"}</button>
      
      <div className="hand">

        {gameRoom?.hand?.map((id, i) =>
          generateCard(id, i, () => handleHandSelect(i), { opacity: handSelected === i ? "50%" : "100%", rotate: 20 * i - 20 + 'deg' })
        )}
      </div>

    </div >
  );
}

export default ChkobaGame;
