import '../styles/endgame.css'
import { userStore } from "../stores/user";
import { Navigate } from "react-router-dom";
import { generateCard } from "./chkoba";

function EndGame() {
    const user = userStore()

    if (!user.endGameData) return <Navigate to="/" />
    const data: {
        [a: string]: {
            sbou3: string[],
            khmous: string[],
            sdous: string[],
            dineri: string[],
            rest: string[],
            chkoba: number,
            l7aya: boolean,
        }
    } = {}
    for (const player of Object.keys(user.endGameData)) {
        data[player] = {
            sbou3: [],
            khmous: [],
            rest: [],
            sdous: [],
            dineri: [],
            chkoba: 0,
            l7aya: false,
        }


        for (const card of user.endGameData[player]) {

            if ((card[0] === 'd') && (card[1] === '6')) {
                data[player].l7aya = true 
            }
            if (card[0] === 'd') data[player].dineri.push(card)
            if (card[1] === '6') data[player].sbou3.push(card)
            else if (card[1] === '5') data[player].sdous.push(card)
            else if (card[1] === '4') data[player].khmous.push(card)
            else data[player].rest.push(card)
        }
    }

    return (
        <div className="end-game-page">
            <>{Object.keys(data).map((key, i) =>
                <fieldset className="end-user-stats" key={i}>
                    <legend  className='username'>{key }</legend>
                    <span className='section'>Dineri</span>
                    <div className="pool">{data[key].dineri.map((card, j) => generateCard(card, j))}</div>
                    <span className='section'>khmous</span>
                    <div className="pool">{data[key].khmous.map((card, j) => generateCard(card, j))}</div>
                    <span className='section'>sdous</span>
                    <div className="pool">{data[key].sdous.map((card, j) => generateCard(card, j))}</div>
                    <span className='section'>sbou3</span>
                    <div className="pool">{data[key].sbou3.map((card, j) => generateCard(card, j))}</div>
                    <span className='section'>lbe9i</span>
                    <div className="pool">{data[key].rest.map((card, j) => generateCard(card, j))}</div>
                </fieldset>
            )}</>
        </div>);
}

export default EndGame;