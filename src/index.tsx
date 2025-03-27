// Sentry initialization should be imported first!
import "./instrument";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import PantherDrop from "./PantherDrop";

ReactDOM.render(
  <React.StrictMode>
    <>
      <PantherDrop />
    </>
  </React.StrictMode>,
  document.getElementById("root")
);
