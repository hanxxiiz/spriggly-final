import React, { useState } from 'react';
import ShopItemInfoCard from './ShopItemInfoCard';

interface ShopSeedPackCardProps {
  title: string;
  rarity: string;
  price: string;
  imageSrc: string;
  description: string;
  onBuy: () => void;
  userLevel: number; // Add user level prop
}

const ShopSeedPackCard: React.FC<ShopSeedPackCardProps> = ({ 
  title, 
  rarity, 
  price, 
  imageSrc, 
  description, 
  onBuy, 
  userLevel 
}) => {
  const [confirmPurchase, setConfirmPurchase] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Define rarity levels and their unlock requirements
  const rarityLevels = {
    'Common': 1,
    'Rare': 5,
    'Legendary': 15,
    'Mythical': 30
  };
  
  // Check if this rarity is unlocked based on user level
  const isUnlocked = userLevel >= (rarityLevels[rarity as keyof typeof rarityLevels] || 1);
  const requiredLevel = rarityLevels[rarity as keyof typeof rarityLevels] || 1;
  
  const handleCardClick = () => {
    if (isUnlocked) {
      setIsFlipped(!isFlipped);
    }
  };
  
  return (
    <>
      <div className="w-80 h-100 overflow-visible lg:w-150 lg:h-100">
        <div 
          className={`w-full h-full preserve-3d transition-transform duration-300 shadow-[0px_0px_10px_0px_#000000ee] rounded-lg ${isUnlocked ? 'hover:rotate-y-180 cursor-pointer' : 'cursor-not-allowed'} group ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleCardClick}
        >
          
          {/* Front Face - Image Side */}
          <div className="absolute w-full h-full bg-[#0c342c] backface-hidden rounded-lg overflow-hidden flex justify-center items-center">
            <div className="absolute w-40 h-[160%] bg-gradient-to-r from-transparent via-[#E4FE62] to-transparent animate-spin-slow"></div>
            <div className="absolute w-[99%] h-[99%] bg-[#63d471] rounded-lg text-white p-6 lg:p-12 flex flex-col lg:flex-row items-center gap-4 lg:gap-6"
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

                <div className="w-full h-full rounded-xl shadow-lg backdrop-blur-md bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center relative">
                    {imageSrc ? (
                        <img 
                        src={imageSrc} 
                        className={`w-full h-full object-cover ${!isUnlocked ? 'blur-sm' : ''}`}
                        />
                    ) : (
                        <div className="w-full h-full bg-white/10"></div>
                    )}
                    
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="text-center">
                          <div className="text-white text-6xl mb-2">🔒</div>
                          <div className="text-white text-sm font-semibold bg-black/50 px-2 py-1 rounded">
                            Level {requiredLevel} Required
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                <div className="relative z-10 w-full flex justify-start">
                    <div className="text-left">
                    <div className={`font-bold text-3xl drop-shadow-md ${!isUnlocked ? 'text-gray-400' : ''}`}>
                      {title}
                    </div>
                    <div className={`text-base font-normal drop-shadow-md ${!isUnlocked ? 'text-gray-500' : 'text-[#E4FE62]'}`}>
                      {rarity}
                    </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="absolute w-full h-full bg-[#0c342c] backface-hidden rotate-y-180 rounded-lg overflow-hidden text-white">
            <div className="absolute w-full h-full p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-[#E4FE62] font-bold text-3xl">
                  {title}
                </h2>
                <h3 className="mb-2 text-[#EB4335] font-semibold text-lg">
                  {rarity}
                </h3>
                <p className="font-base text-sm">
                  {description}
                </p>
              </div>
              
              <div className="flex justify-between items-center text-xs w-full">
                <p className="truncate pr-2 text-lg text-white font-semibold">
                  {price}
                </p>
                {isUnlocked ? (
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
                ) : (
                  <div className="text-gray-400 bg-gray-600 w-30 p-2 rounded-full text-xl font-bold cursor-not-allowed text-center">
                    🔒
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {confirmPurchase && isUnlocked && (
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

export default ShopSeedPackCard;