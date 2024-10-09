//import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/default.css"
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navigator from "./pages/navigator";
import QueuePage from "./pages/queue";
import ChkobaGame from "./pages/chkoba";
import HomePage from "./pages/homePage";
import EndGame from "./pages/endgame";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render( 
    <Router>
      <Navigator /> {/*HOC : higher order component*/}
      <Routes>
        <Route element={<HomePage />}   path="/" />
        <Route element={<ChkobaGame />} path="/game" />
        <Route element={<QueuePage />}  path="/queue" />
        <Route element={<EndGame />}    path="/endgame" />
      </Routes>
    </Router> 
);
