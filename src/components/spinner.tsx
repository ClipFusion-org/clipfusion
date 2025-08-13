import React from 'react';

type SpinnerProps = {
  /** Diameter of the spinner in pixels */
  size?: number;
  /** Color of the spinner segments */
  color?: string;
};

const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = '#8E8E93',
}) => {
  const segmentCount = 12;
  const segments = Array.from({ length: segmentCount }, (_, i) => i);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: size,
    height: size,
  };

  const commonSegmentStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: size * 0.1,
    height: size * 0.3,
    backgroundColor: color,
    borderRadius: size * 0.05,
    transformOrigin: `-${size * 0.05}px ${size / 2}px`,
    animation: 'spinner-fade 1s infinite linear',
  };

  return (
    <div style={containerStyle}>
      {segments.map((idx) => {
        const rotation = (360 / segmentCount) * idx;
        const delay = `${-(1 - idx / segmentCount)}s`;

        return (
          <div
            key={idx}
            style={{
              ...commonSegmentStyle,
              transform: `rotate(${rotation}deg) translate(-50%)`,
              animationDelay: delay,
            }}
          />
        );
      })}
      <style>
        {`
          @keyframes spinner-fade {
            0% { opacity: 1; }
            100% { opacity: 0.15; }
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;
