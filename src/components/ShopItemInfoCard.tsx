import React from 'react';

interface ShopItemInfoCardProps {
  title: string;
  price: string;
  imageSrc: string;
  description: string;
  onBuy: () => void;
  onClose: () => void;
}

const ShopItemInfoCard: React.FC<ShopItemInfoCardProps> = ({
  title,
  price,
  imageSrc,
  description,
  onBuy,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Dimmed background */}
      <div className="absolute inset-0 bg-black opacity-80" />

      {/* Info Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center w-full max-w-[900px] min-h-[500px] z-10">
        {/* Exit button */}
        <button
          className="absolute top-2 right-4 text-green-900 text-2xl font-bold hover:text-green-600 focus:outline-none cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="relative w-full md:w-1/2 h-[250px] md:h-[400px] flex justify-center items-center">
          <div
                className="absolute inset-0 rounded-full z-0"
                style={{
                  background: 'radial-gradient(circle, #E4FE62 0%, transparent 70%)',
                  opacity: 0.4,
                }}
              ></div>
          <img
            src={imageSrc}
            alt={title}
            className="relative z-10 w-[200px] md:w-[300px] lg:w-[400px] h-auto object-contain pointer-events-none"
          />
        </div>

        {/* Info text */}
        <div className="mt-6 md:mt-0 md:ml-8 w-full md:w-1/2 flex flex-col justify-start items-start">
          <div className="text-green-900 font-black text-2xl md:text-3xl leading-tight">{title}</div>
          <div className="text-[#EFE842] font-bold text-lg md:text-xl mt-1 mb-2">{price}</div>
          <div className="text-gray-700 text-sm md:text-base mb-5 max-w-prose text-justify">{description}</div>

          {/* Buttons - centered on mobile, left-aligned on desktop */}
          <div className="w-full flex justify-center md:justify-start">
            <div className="flex flex-col md:flex-row items-center gap-2 lg:gap-4 mt-1 lg:mt-4">
              <button
                className="w-28 bg-gradient-to-r text-xs lg:text-base from-yellow-300 text-green-900 font-extrabold py-1 rounded-full shadow-md 
                          transition-all duration-300 ease-in-out cursor-pointer
                          hover:from-yellow-400 hover:to-green-400 hover:shadow-[0_0_15px_3px_#EFE842aa] hover:scale-105 hover:-translate-y-1"
                style={{ background: 'linear-gradient(40deg, #898526 , #EFE842 60%)' }}
                onClick={() => {
                  onClose();
                  onBuy();
                }}
              >
                Buy
              </button>

              <button
                className="w-28 bg-gradient-to-r text-xs lg:text-base from-yellow-300 text-green-900 font-extrabold py-1 rounded-full shadow-md 
                          transition-all duration-300 ease-in-out cursor-pointer
                          hover:scale-105 hover:-translate-y-1"
                style={{ background: 'linear-gradient(40deg,rgb(132, 132, 125) ,rgb(249, 249, 249) 60%)' }}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopItemInfoCard;
