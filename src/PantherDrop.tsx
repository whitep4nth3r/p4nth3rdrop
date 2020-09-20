import React from "react";
import P5 from "p5";
import { Sketch } from "./Sketch";

const uri = process.env.REACT_APP_MAINFRAME_WEBSOCKET

if (uri && uri.length > 0) {
  new P5(p5 => Sketch(p5, uri))
}

const PantherDrop = () => {
  return <main id="container"></main>;
};

export default PantherDrop;
