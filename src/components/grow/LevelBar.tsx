import React from 'react';
import { Star } from '../MyPlants/Stars'; // Adjust path if needed

interface LevelBarProps {
  level: number;
  currentXp: number;
  requiredXp: number;
  plantName?: string; 
}


export default function LevelBar({ level, currentXp, requiredXp, plantName }: LevelBarProps) {
  const progress = Math.max(0, Math.min(1, currentXp / requiredXp));
  const percent = Math.round(progress * 100);

  return (
<div className="w-full [@media(min-width:360px)]:w-[320px] sm:w-[350px]">
      {plantName && (
        <span className="text-lg font-extrabold text-white  ml-8">
          {plantName}
        </span>
      )}

      <div className="relative flex items-center w-full">
        {/* Star on top-left */}
        <div className="absolute left-0 z-10 w-10 h-13">
          <Star className="w-12 h-12 -rotate-14" />
          <span className="absolute inset-0 flex items-center justify-center font-black text-black text-sm translate-x-[5px] -translate-y-[1px]">
            {level}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative flex-1 h-8 bg-black rounded-full overflow-hidden ml-4">
          <div
            className="h-full bg-gradient-to-r from-[#669524] to-[#245329] transition-all duration-300 rounded-l-full"
            style={{ width: `${percent}%` }}
          />
          <span className="text-xs absolute right-3 top-1/2 -translate-y-1/2 font-bold text-white z-10">
            {percent}%
          </span>
        </div>
      </div>

      {/* XP label below */}
      <div className="ml-12 mt-1 text-xs font-bold text-black">
        {currentXp}/{requiredXp} XP
      </div>
    </div>
  );
}
