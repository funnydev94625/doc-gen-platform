import React from "react";
import "./typewriter-loader.css";

const TypewriterLoader = () => {
  return (
    <div className="typewriter">
      <div className="slide"><i></i></div>
      <div className="paper"></div>
      <div className="keyboard"></div>
    </div>
  );
}

export { TypewriterLoader }