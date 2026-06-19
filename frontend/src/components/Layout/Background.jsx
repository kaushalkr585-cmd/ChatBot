import React from 'react';

const Background = () => {
  return (
    /*
     * Fixed behind everything, never participates in layout.
     * -z-10 keeps it below all content but above the page background colour.
     * pointer-events-none ensures it never intercepts clicks.
     */
    <div
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      aria-hidden="true"
    >
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:28px_28px]" />
      {/* Top accent stripe */}
      <div className="absolute left-0 top-0 h-[3px] w-full bg-yellow" />
    </div>
  );
};

export default Background;
