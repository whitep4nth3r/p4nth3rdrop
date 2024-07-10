// Sentry initialization should be imported first!
import "./instrument";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import PantherDrop from "./PantherDrop";

ReactDOM.render(
  <React.StrictMode>
    <>
      <button
        type="button"
        onClick={() => {
          throw new Error("Sentry Test Error");
        }}
      >
        Break the world
      </button>
      ;
      <PantherDrop />
    </>
  </React.StrictMode>,
  document.getElementById("root")
);
