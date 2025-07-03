import React from 'react';
import { Star, StarShadow } from './Stars';
import { FaLock } from 'react-icons/fa';


interface PlantCardProps {
  locked: boolean;
  plantName?: string;
  description?: string;
}

const PlantCard: React.FC<PlantCardProps> = ({ locked, plantName, description }) => {
  return (
    <div className="relative bg-[#B1E064] rounded-3xl p-4 flex flex-col shadow-md h-43 justify-between">
      {/* 🔳 Inner Rectangle */}
      <div
        className="relative rounded-2xl p-4 h-full w-full"
        style={{
          backgroundImage: 'linear-gradient(to right, #7DCB45 0%, #A4DB5C 56%, #C2E76E 100%)',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Parallelogram Shadow (left) */}
        <div
          className="absolute top-0 left-62 w-[20px] h-[140px] bg-black/10 z-20"
          style={{ transform: 'skew(-20deg)' }}
        />

        {/* Parallelogram */}
        <div
          className="absolute top-0 left-63 w-[100px] h-[140px] bg-[#ECF779] z-30"
          style={{ transform: 'skew(-20deg)' }}
        />

        {/*Background Fill */}
        <div className="absolute top-0 left-70 w-[365px] h-[140px] bg-[#ECF779] z-10 rounded-2xl" />

        {/* Stars */}
        <div className="relative">
          <StarShadow className="absolute -rotate-10 w-25 h-25 top-2 left-8 z-20" />
          <Star className="absolute -rotate-10 w-25 h-25 top-1 left-9 z-20" />
          <StarShadow className="absolute -rotate-8 w-10 h-10 -top-2 -left-2 z-20" />
          <Star className="absolute -rotate-8 w-10 h-10 -top-3 -left-1 z-20" />
          <StarShadow className="absolute rotate-8 w-11 h-11 left-38 z-20" />
          <Star className="absolute rotate-8 w-11 h-11 -top-1 left-39 z-20" />
          <StarShadow className="absolute -rotate-10 w-7 h-7 top-14 left-47 z-20" />
          <Star className="absolute -rotate-10 w-7 h-7 top-13 left-48 z-20" />
          <StarShadow className="absolute rotate-6 w-7 h-7 top-23 -left-2 z-20" />
          <Star className="absolute rotate-6 w-7 h-7 top-22 -left-1 z-20" />
          <StarShadow className="absolute rotate-6 w-8 h-8 top-22 left-34 z-20" />
          <Star className="absolute rotate-6 w-8 h-8 top-21 left-35 z-20" />
          <StarShadow className="absolute -rotate-5 w-10 h-10 -top-2 left-57 z-20" />
          <Star className="absolute -rotate-5 w-10 h-10 -top-3 left-58 z-20" />
        </div>

         {/* Plant Info */}
        <div className="relative z-40 mt-3 ml-70">
          <span className="font-black text-[#4B8B31] text-2xl">{plantName}</span>
          <p className="text-sm font-medium text-[#80A740] mt-1 italic">{description}</p>
        </div>
      </div> 

      {locked && (
  <div className="absolute inset-0 bg-[#245329] opacity-80 rounded-3xl z-50 flex flex-col items-center justify-center text-white">
    <FaLock className="text-3xl mb-2" />
    <span className="text-s font-extrabold">Locked</span>
  </div>
)}

    </div>
  );
};

export default PlantCard; 