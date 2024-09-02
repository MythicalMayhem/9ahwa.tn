import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import QueuePage from "./pages/queue";
import Chkoba from "./pages/chkoba";
import Authenticate from "./pages/auth";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route element={<Authenticate />} path = "/auth" />
        <Route element={<QueuePage />} path = "/queue" />
        <Route element={<Chkoba />}    path = "/chkoba" />
      </Routes>
    </Router>
  </React.StrictMode>
);
