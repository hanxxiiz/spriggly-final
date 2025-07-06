import React from 'react';
import { StarLevel } from './Stars';

interface LevelStarsProps {
  level: number;
  locked: boolean;
  currentStage: number;
  onStageChange?: (newStage: number) => void;
}

const LevelStars: React.FC<LevelStarsProps> = ({
  level,
  locked,
  currentStage,
  onStageChange
}) => {
  return (
    <div className="mt-137 h-20 rounded-b-2xl px-6 flex items-center justify-center gap-7">
      <span className="text-2xl font-black text-white">LEVEL</span>
      {[1, 2, 3, 4, 5].map((num) => {
        const isUnlocked = num <= level;

        return (
          <button
            key={num}
            onClick={() => {
              if (!locked && isUnlocked) {
                onStageChange?.(num);
              }
            }}
            className="relative w-10 h-10 flex items-center justify-center focus:outline-none cursor-pointer"
          >
            <StarLevel
              className={`w-full h-full absolute top-0 left-0 transition-all duration-200 ${
                isUnlocked && !locked ? '' : 'grayscale opacity-30'
              }`}
            />
            {isUnlocked && !locked && (
              <span className="text-sm font-black text-green-900 z-10">{num}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default LevelStars;
