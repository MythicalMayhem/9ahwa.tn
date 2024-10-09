import { Navigate } from "react-router-dom";
import { userStore } from "../stores/user";

export default function Navigator() {
  const user = userStore();
  console.log(user);
  if (!user.socket) {
    user.init();
    return <></>;
  }
  
  if (!user.socket.connected) user.socket.connect();
  if (user.endGameData) return <Navigate to="/endgame" />;
  if (user.gameRoom) return <Navigate to="/game" />;

  return <></>;
}
