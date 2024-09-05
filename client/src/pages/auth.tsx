import { Navigate } from "react-router-dom";
import { userStore } from "../stores/user";
import { useEffect } from "react";
function Authenticate() {
  const user = userStore();
  useEffect(() => {
    if (!user.socket) {
      user.init();
    }
  }, [user]);
  return <>{user && <Navigate to="/queue" />}</>;
}

export default Authenticate;
