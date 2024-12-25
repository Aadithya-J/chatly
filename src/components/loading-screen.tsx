'use client';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-500 z-50">
      <div className="relative w-24 h-24">
        {/* Outer Circle */}
        <div className="absolute w-full h-full rounded-full border-4 border-white"></div>

        {/* Filling animation */}
        <div className="absolute w-full h-full rounded-full border-[12px] border-transparent border-t-white animate-spin"></div>

        {/* Letter C */}
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-5xl">
          C
        </div>
      </div>
    </div>
  );
};


