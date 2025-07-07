import React from 'react';

interface ShopItemInfoCardProps {
  title: string;
  price: string;
  imageSrc: string;
  description: string;
  onBuy: () => void;
  onClose: () => void;
}

const ShopItemInfoCard: React.FC<ShopItemInfoCardProps> = ({ title, price, imageSrc, description, onBuy, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dimmed background */}
      <div className="absolute inset-0 bg-black opacity-80" />
      {/* Info Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 flex flex-row items-center min-w-[750px] min-h-[496px] z-10">
      {/* Exit button */}
      <button
        className="absolute top-2 right-4 text-green-900 text-2xl font-bold hover:text-green-600 focus:outline-none cursor-pointer"
        onClick={onClose}
        aria-label="Close"
      >×</button>
      {/* Image and circles */}
      <div className="absolute w-[500px] h-[200px]">
      {/* Background Circles */}
      <div className="absolute top-40 left-3 w-35 h-35 rounded-full z-0 shadow-xl" 
        style={{ background: 'linear-gradient(50deg, #6DA33A , #8ABB4A, #BBE573 90%)' }}
      />
      <div className="absolute -top-30 left-3 w-22 h-22 rounded-full z-0 shadow-xl" 
        style={{ background: 'linear-gradient(50deg, #6DA33A , #8ABB4A, #BBE573 90%)' }}
      />
      <div className="absolute -top-30 left-75 w-12 h-12 rounded-full z-0 shadow-xl" 
        style={{ background: 'linear-gradient(50deg, #6DA33A , #8ABB4A, #BBE573 90%)' }}
      />
     <div className="absolute -top-15 left-10 w-75 h-75 rounded-full z-0 shadow-2xl" 
          style={{ background: 'linear-gradient(50deg, #6DA33A , #8ABB4A, #BBE573 90%)' }}
      />
      <img
        src={imageSrc}
        alt={title}
        className="absolute top-23 left-48 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 object-contain z-10 pointer-events-none"
      />
    </div>
    {/* Info text */}
      <div className="flex flex-col justify-start items-start ml-95 mt-1">
      <div className="text-green-900 font-black text-3xl leading-none">{title}</div>
      <div className="text-green-900 font-bold text-xl mt-[2px] mb-1">{price}</div>
      <div className="text-gray-700 text-base mb-5 max-w-xs text-justify">{description}</div>
      <button
        className="w-28 bg-gradient-to-r from-yellow-300 text-green-900 font-extrabold py-1 rounded-full shadow-md transition-all duration-300 ease-in-out mx-auto cursor-pointer 
                hover:from-yellow-400 hover:to-green-400 hover:shadow-[0_0_15px_3px_#EFE842aa] hover:scale-105 hover:-translate-y-1"
      style={{ background: 'linear-gradient(40deg, #898526 , #EFE842 60%)' }}
        onClick={() => {
          onClose();
          onBuy();
        }}
      >Buy</button>
      </div>
      </div>
      </div>
    );
};

export default ShopItemInfoCard;
