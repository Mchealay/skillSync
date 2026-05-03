import React from 'react';

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`text-muted-foreground/80 bg-clip-text inline-block ${!disabled ? 'animate-shine' : ''} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, hsla(var(--foreground), 0) 40%, hsla(var(--foreground), 0.5) 50%, hsla(var(--foreground), 0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: animationDuration,
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
