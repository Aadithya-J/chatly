'use client';

const RotatingLoader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default RotatingLoader;
