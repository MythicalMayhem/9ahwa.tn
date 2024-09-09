import { Navigate } from "react-router-dom";
import { userStore } from "../stores/user";

function Navigator() {
  const user = userStore();
  if (!user.socket) {
    user.init();
    return <></>;
  }
  if (!user.socket.connected) user.socket.connect();
  if (user.gameRoom) return <Navigate to="/game" />;

  return <></>;
}
export default Navigator;
