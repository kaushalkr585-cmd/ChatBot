import React from 'react';

const Background = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-background">
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute left-0 top-0 h-4 w-full border-b-[3px] border-black bg-yellow" />
    </div>
  );
};

export default Background;
