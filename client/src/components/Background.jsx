import React from "react";

const BackgroundEffect = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <svg
        viewBox="0 0 623 591"
        className="w-full h-full"
        preserveAspectRatio="xMaxYMid slice"
      >
        <defs>
          <linearGradient id="grad1">
            <stop offset="0%" stopColor="#ff7586" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff7586" />
            <stop offset="100%" stopColor="#00d9ff" />
          </linearGradient>

          <radialGradient id="dotGlow">
            <stop offset="0%" stopColor="#ad44ff" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Path */}
        <path
          id="motionPath"
          d="M 0 0 C 311.5 0 415 237 623 237"
          stroke="url(#grad1)"
          strokeWidth="2"
          fill="none"
        />

        {/* Animated dot */}
        <circle r="6" fill="url(#dotGlow)">
          <animateMotion dur="6s" repeatCount="indefinite">
            <mpath href="#motionPath" />
          </animateMotion>
        </circle>
      </svg>
    </div>
  );
};

export default BackgroundEffect;