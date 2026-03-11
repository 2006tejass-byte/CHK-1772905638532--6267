import React from "react";
import "./CircularText.css";

interface CircularTextProps {
  text: string;
  radius?: number;
  fontSize?: string;
  color?: string;
  speed?: number;
}

export function CircularText({
  text,
  radius = 60,
  fontSize = "14px",
  color = "currentColor",
  speed = 10,
}: CircularTextProps) {
  const characters = text.split("");
  const degreeStep = 360 / characters.length;

  return (
    <div
      className="circular-text-container"
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        fontSize,
        color,
      }}
    >
      <div
        className="circular-text-rotate"
        style={{ animationDuration: `${speed}s` }}
      >
        {characters.map((char, i) => (
          <span
            key={i}
            className="circular-text-char"
            style={{
              transform: `rotate(${i * degreeStep}deg) translateY(-${radius}px)`,
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
