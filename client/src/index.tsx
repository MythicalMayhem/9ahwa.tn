import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navigator from "./pages/navigator";
import QueuePage from "./pages/queue";
import Chkoba from "./pages/chkoba";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <Navigator />
      <Routes>
        <Route element={<QueuePage />} path="/queue" />
        <Route element={<Chkoba />}    path="/chkoba" />
      </Routes>
    </Router>
  </React.StrictMode>
);
