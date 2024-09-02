import { Navigate } from "react-router-dom";
import { userStore } from "../stores/user";
function Authenticate() {
  const user = userStore();
  if (!user.socket) {
    user.init();
    user.setSocket();
    //to block further rendering until initialization is complete aka the "bad set state"
    return <></>;
  } else {
    return <Navigate to="/queue" />;
  }
}

export default Authenticate;
