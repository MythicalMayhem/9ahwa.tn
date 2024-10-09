import { userStore } from "../stores/user" ;
import { Navigate } from "react-router-dom";

function EndGame() {
    const user = userStore()


    if (!user.endGameData) return <Navigate to="/" />
    return (
        <div className="end-game-page">
            <pre>
                {JSON.stringify(user.endGameData, null, 2)}
            </pre>
        </div>);
}

export default EndGame;