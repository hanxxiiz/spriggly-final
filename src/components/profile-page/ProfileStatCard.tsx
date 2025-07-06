import React from 'react';

interface ProfileStatCardProps {
  title: string;
  value: string | number;
  highlight?: boolean;
}

const ProfileStatCard: React.FC<ProfileStatCardProps> = ({ title, value, highlight }) => (
  <div
    className="bg-[#E6F46C] rounded-xl shadow-3xl p-4 w-[185px] h-[200px] flex flex-col items-center justify-center relative"
    style={{ boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), 18px 18px 0 #EFE842'}}  >
    <div className="absolute inset-0 pointer-events-none">
      {/* Decorative circles */}
      <div
        className="absolute rounded-full opacity-85"
        style={{
          width: 40,
          height: 40,
          right: 8,
          top: 24,
          background: 'linear-gradient(30deg, #DFD718 20%, #EFE842 70%)'
        }}
      />
      <div
        className="absolute rounded-full opacity-85"
        style={{
          width: 60,
          height: 60,
          left: 8,
          top: 24,
          background: 'linear-gradient(30deg, #DFD718 20%, #EFE842 70%)'
        }}
      />
      <div
        className="absolute rounded-full opacity-85"
        style={{
          width: 25,
          height: 25,
          left: 30,
          top: 100,
          background: 'linear-gradient(30deg, #DFD718 20%, #EFE842 70%)'
        }}
      />
      <div
        className="absolute rounded-full opacity-85"
        style={{
          width: 45,
          height: 45,
          right: 45,
          top: 110,
          background: 'linear-gradient(30deg, #DFD718 20%, #EFE842 70%)'
        }}
      />
      <div
        className="absolute rounded-full opacity-85"
        style={{
          width: 50,
          height: 50,
          left: 8,
          top: 140,
          background: 'linear-gradient(30deg, #DFD718 20%, #EFE842 70%)'
        }}
      />
      <div
        className="absolute rounded-full opacity-85"
        style={{
          width: 30,
          height: 30,
          left: 150,
          top: 160,
          background: 'linear-gradient(30deg, #DFD718 20%, #EFE842 70%)'
        }}
      />
    </div>

    <span className="-mt-5 font-black text-[#567E1F] text-2xl z-10 text-center break-words max-w-[160px] leading-tight">
      {title}
    </span>
    <span className="font-black text-[#669524] text-3xl z-10 mt-2">
      {value}
    </span>
  </div>
);

export default ProfileStatCard;
