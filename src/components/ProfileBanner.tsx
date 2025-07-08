'use client';
import React from 'react';

const ProfileBanner: React.FC = () => {
  return (
    <div className="w-full h-[300px] duration-500 group overflow-hidden relative rounded-3xl shadow-lg bg-[radial-gradient(circle,_#076653,_#0c342c,_#06231d)] text-neutral-50 p-4 flex flex-col justify-evenly">
      {/* Glowing blobs */}
      <div className="absolute blur duration-800 group-hover:blur-none w-72 h-72 lg:w-[400px] lg:h-[400px] rounded-full group-hover:translate-x-12 group-hover:translate-y-20 bg-[#d6d126] right-1 -bottom-24" />
      <div className="absolute blur duration-800 group-hover:blur-none w-12 h-12 lg:w-24 lg:h-24 rounded-full group-hover:translate-x-12 group-hover:translate-y-2 bg-[#fcff4a] right-12 bottom-12" />
      <div className="absolute blur duration-800 group-hover:blur-none w-36 h-36 rounded-full group-hover:translate-x-12 group-hover:-translate-y-12 bg-[#728f2f] right-1 -top-12" />
      <div className="absolute blur duration-800 group-hover:blur-none w-24 h-24 lg:w-[440px] lg:h-[440px] bg-[#b8f75b] rounded-full group-hover:-translate-x-20 -left-5 lg:-left-20 -top-3 lg:-top-20" />
    </div>
  );
};

export default ProfileBanner;
