import React, { useState } from 'react';
import ShopItemInfoCard from './ShopItemInfoCard';

interface ShopItemCardProps {
  title: string;
  price: string;
  imageSrc: string;
  description: string;
  onBuy: () => void;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({ title, price, imageSrc, description, onBuy }) => {
const [showInfo, setShowInfo] = useState(false);
  return (
    <>
        {/* Main Card */}
        <div className="relative w-64 h-72 rounded-2xl shadow-lg flex flex-col justify-end p-6 m-4 overflow-hidden transform transition-transform duration-200 hover:scale-105"
        style={{ background: 'linear-gradient(40deg, #40581E , #8ABE40 70%)' }}
        >
    {/* Gradient Circles */}
        <div
          className="absolute w-36 h-36 rounded-full top-0 left-2 z-0"
          style={{ background: 'linear-gradient(110deg, #EFE842 20%,  #669524)', filter: 'blur(8px)' }}
        />
        <div
          className="absolute w-24 h-24 rounded-full top-32 right-2 z-0"
          style={{ background: 'linear-gradient(110deg, #EFE842 20%,  #669524)', filter: 'blur(8px)' }}
        />
    {/* Info icon */}
        <div
          className="absolute cursor-pointer top-4 right-4 border-2 border-white rounded-full w-7 h-7 flex items-center justify-center bg-transparent z-10"
          onClick={() => setShowInfo(true)}
        >
        <span className="text-lg font-bold text-white leading-none">?</span>
        </div>
      {/* Background Image Behind Text */}
      <img
        src={imageSrc}
        alt={title}
        className="absolute top-5 left-1/2 transform -translate-x-1/2 w-[220px] h-[220px] object-contain z-0 opacity-85"
      />
      <div className="relative z-10 mt-auto">
        <div className="text-white font-black text-xl drop-shadow-md">{title}</div>
        <div className="text-white text-md font-semibold drop-shadow-md">{price}</div>
        <button
          className="flex flex-col items-center space-y-1 mt-2 px-14 py-2 text-green-900 font-extrabold rounded-full shadow-md hover:from-yellow-400 hover:to-green-400 transition mx-auto cursor-pointer"
          style={{ background: 'linear-gradient(40deg, #898526 , #EFE842 70%)' }}
          onClick={onBuy}
        >
          Buy
        </button>
    </div>
  </div>
  {/* Modal for Info Card */}
        {showInfo && (
          <ShopItemInfoCard
            title={title}
            price={price}
            imageSrc={imageSrc}
            description={description}
            onBuy={onBuy}
            onClose={() => setShowInfo(false)}
          />
        )}
    </>
  );
};

export default ShopItemCard; 