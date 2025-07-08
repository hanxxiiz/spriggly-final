'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

type CardProps = {
  percentage: string;
  plant: string;
};

const RecentCard: React.FC<CardProps> = ({ percentage, plant }) => {
  const router = useRouter();

  return (
    <div className="w-full h-[440px] duration-500 group overflow-hidden relative rounded-3xl shadow-lg bg-[radial-gradient(circle,_#076653,_#0c342c,_#06231d)] text-neutral-50 p-4 flex flex-col justify-evenly">
      {/* Glowing blobs */}
      <div className="absolute blur duration-800 group-hover:blur-none w-72 h-72 lg:w-[400px] lg:h-[400px] rounded-full group-hover:translate-x-12 group-hover:translate-y-20 bg-[#d6d126] right-1 -bottom-24" />
      <div className="absolute blur duration-800 group-hover:blur-none w-12 h-12 lg:w-24 lg:h-24 rounded-full group-hover:translate-x-12 group-hover:translate-y-2 bg-[#fcff4a] right-12 bottom-12" />
      <div className="absolute blur duration-800 group-hover:blur-none w-36 h-36 rounded-full group-hover:translate-x-12 group-hover:-translate-y-12 bg-[#728f2f] right-1 -top-12" />
      <div className="absolute blur duration-800 group-hover:blur-none w-24 h-24 lg:w-[440px] lg:h-[440px] bg-[#b8f75b] rounded-full group-hover:-translate-x-20 -left-5 lg:-left-20 -top-3 lg:-top-20" />

      {/* Content */}
      <div className="z-10 flex flex-col justify-center items-center w-full h-full text-center">
        <span className="text-8xl lg:text-[200px] font-bold mb-2">
          {percentage}
        </span>

        <p className="italic mb-4 text-base lg:text-lg">
          Your <span className="font-bold">{plant}</span> is almost complete. Continue growing now!
        </p>

        <button
          onClick={() => router.push('/dashboard/grow')}
          className="text-[#0c342c] bg-[#e3ef26] px-6 py-2 rounded-full text-base lg:text-lg font-bold hover:bg-[#E4FE62] hover:shadow-[0_0_20px_#E4FE62] hover:scale-110 transition-all duration-300 transform hover:animate-pulse cursor-pointer"
        >
          Grow
        </button>
      </div>
    </div>
  );
};

export default RecentCard;
