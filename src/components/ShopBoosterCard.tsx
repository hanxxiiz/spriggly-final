import React, { useState } from 'react';
import ShopItemInfoCard from './ShopItemInfoCard';

interface ShopBoosterCardProps {
  title: string;
  price: string;
  imageSrc: string;
  description: string;
  onBuy: () => void;
}

const ShopBoosterCard: React.FC<ShopBoosterCardProps> = ({ title, price, imageSrc, description, onBuy }) => {
  const [confirmPurchase, setConfirmPurchase] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };
  
  return (
    <>
      <div className="w-80 h-65 overflow-visible">
        <div 
          className={`w-full h-full preserve-3d transition-transform duration-300 shadow-[0px_0px_10px_0px_#000000ee] rounded-lg hover:rotate-y-180 group ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleCardClick}
        >
          
          {/* Front Face - Image Side */}
          <div className="absolute w-full h-full bg-[#0c342c] backface-hidden rounded-lg overflow-hidden flex justify-center items-center">
            <div className="absolute w-40 h-[160%] bg-gradient-to-r from-transparent via-[#E4FE62] to-transparent animate-spin-slow"></div>
            <div className="p-5 absolute w-[99%] h-[99%] bg-[#63d471] rounded-lg text-white flex flex-col items-center gap-8"
              style={{
              background: 'linear-gradient(to top, #0c342c, #076653)',
            }}>

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
                className="absolute top-5 left-1/2 transform -translate-x-1/2 w-[220px] h-[220px] object-contain z-0 opacity-85"
              />

              <div className="h-[240px]" />
              <div className="relative z-10 w-full flex justify-start">
                <div className="text-left">
                  <div className="font-bold text-xl drop-shadow-md">{title}</div>
                  <div className="text-[#E4FE62] text-xs font-normal drop-shadow-md">{price}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Face - Text and Buy Button Side */}
          <div className="absolute w-full h-full bg-[#0c342c] backface-hidden rotate-y-180 rounded-lg overflow-hidden text-white">
            <div className="absolute w-full h-full p-8 flex flex-col justify-between">
              <div>
                <h3 className="mb-2 text-[#E4FE62] font-bold text-2xl">
                  {title}
                </h3>
                <p className="font-semibold text-sm">
                  {description}
                </p>
              </div>
              
              <div className="flex justify-between items-center text-xs w-full">
                <p className="truncate pr-2 text-lg text-white font-semibold">
                  {price}
                </p>
                <button 
                  className="text-[#0c342c] bg-[#e3ef26] w-30 p-2 rounded-full text-xl font-bold hover:bg-[#E4FE62] hover:shadow-[0_0_20px_#E4FE62] hover:scale-110 transition-all duration-300 transform hover:animate-pulse cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmPurchase(true);
                    setIsFlipped(false);
                  }}
                >
                  Buy
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* PURCHASE CONFIRMATION MODAL */}
      {confirmPurchase && (
        <ShopItemInfoCard
          title={title}
          price={price}
          imageSrc={imageSrc}
          description={description}
          onBuy={onBuy}
          onClose={() => setConfirmPurchase(false)}
        />
      )}
      
      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .hover\\:rotate-y-180:hover {
          transform: rotateY(180deg);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }
        
        .animate-float {
          animation: float 2600ms infinite linear;
        }
        
        .animate-float-delayed-1 {
          animation: float 2600ms infinite linear;
          animation-delay: -1800ms;
        }
        
        .animate-float-delayed-2 {
          animation: float 2600ms infinite linear;
          animation-delay: -800ms;
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s infinite linear;
        }
      `}</style>
    </>
  );
};

export default ShopBoosterCard;