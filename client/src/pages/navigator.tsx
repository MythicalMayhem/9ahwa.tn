import { Navigate } from "react-router-dom";
import { userStore } from "../stores/user";

function Navigator() {
  const user = userStore();
  console.log(user.gameRoom);
  if (!user.socket) {
    user.init();
    return <></>;
  } else if (!user.socket.connected) {
    user.socket.connect();
    return <Navigate to="/queue" />;
  } else if (user.gameRoom) {

    return <Navigate to="/game" />;
  } else if (user.socket && user.socket.connected) {
    return <Navigate to="/queue" />;
  }
  return <></>;
}
export default Navigator;
