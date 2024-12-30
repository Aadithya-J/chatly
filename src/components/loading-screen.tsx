"use client";

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500">
      <div className="relative h-24 w-24">
        {/* Outer Circle */}
        <div className="absolute h-full w-full rounded-full border-4 border-white"></div>

        {/* Filling animation */}
        <div className="absolute h-full w-full animate-spin rounded-full border-[12px] border-transparent border-t-white"></div>

        {/* Letter C */}
        <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-white">
          C
        </div>
      </div>
    </div>
  );
};
