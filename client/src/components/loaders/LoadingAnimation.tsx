import React from "react";
import "./LoadingAnimation.css";

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <span className="dot dot1"></span>
      <span className="dot dot2"></span>
      <span className="dot dot3"></span>
      <span className="loading-text">Loading</span>
    </div>
  );
};

export default LoadingAnimation;
