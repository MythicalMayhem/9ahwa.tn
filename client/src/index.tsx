import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navigator from "./pages/navigator";
import QueuePage from "./pages/queue";
import Game from "./pages/game";
import HomePage from "./pages/homePage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <Navigator />
      <Routes>
        <Route element={<HomePage />}  path="/" />
        <Route element={<Game />}      path="/game" />
        <Route element={<QueuePage />} path="/queue" />
      </Routes>
    </Router>
  </React.StrictMode>
);
