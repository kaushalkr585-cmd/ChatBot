import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-background overflow-hidden pointer-events-none">
      {/* Animated blob 1 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
      
      {/* Animated blob 2 */}
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>

      {/* Animated blob 3 */}
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[130px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>

      {/* Glass overlay for subtle noise/texture could go here if needed */}
    </div>
  );
};

export default Background;
