'use client'

import React, { useState, useEffect } from 'react';
import ShopBoosterCard from '@/components/ShopBoosterCard';
import ShopSeedPackCard from '@/components/ShopSeedPackCard';
import { Poppins } from 'next/font/google';
import Navbar from '@/components/NavigationBar';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState('boosters');
  const [userLevel, setUserLevel] = useState(20); // Example: user is level 20
  const [userCoins, setUserCoins] = useState(2500); // Example: user has 2500 coins
  const [boosters, setBoosters] = useState<any[]>([]);
  const [seedPacks, setSeedPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/shop-items')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch shop items');
        return res.json();
      })
      .then((data) => {
        setBoosters(data.boosters || []);
        setSeedPacks(data.seedPacks || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const rarityLevels = {
    'Common': 1,
    'Rare': 5,
    'Legendary': 15,
    'Mythical': 30
  };

  const getUnlockedSeedPacks = () => {
    return seedPacks.filter(pack => {
      const requiredLevel = rarityLevels[pack.rarity as keyof typeof rarityLevels] || 1;
      return userLevel >= requiredLevel;
    });
  };

  const getLockedSeedPacks = () => {
    return seedPacks.filter(pack => {
      const requiredLevel = rarityLevels[pack.rarity as keyof typeof rarityLevels] || 1;
      return userLevel < requiredLevel;
    });
  };

  if (loading) return <div className="text-center py-12">Loading shop items...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <main className={`${poppins.className} flex-1 flex flex-col bg-white min-h-screen pt-18 py-4 px-4 sm:px-6 lg:px-8 relative`}>
        <div className="flex justify-between items-center mb-5 lg:mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800">Shop</h1>
        </div>
        
        <div className="flex justify-between items-center mb-5 lg:mb-6">
          {/* Coin Counter */}
          <div className="flex items-center gap-2 bg-yellow-50 border-2 border-yellow-400 rounded-full px-2 py-1 lg:px-4 lg:py-2">
            <span className="text-xl">🪙</span>
            <span className="text-sm lg:text-lg font-semibold text-yellow-600">
              {userCoins.toLocaleString()}
            </span>
          </div>
          
          {/* Category Toggle */}
          <div className="flex bg-white border-2 border-[#245329] rounded-full p-1 gap-1">
            <button
              onClick={() => setActiveCategory('boosters')}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === 'boosters'
                  ? 'bg-[#245329] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Boosters
            </button>
            <button
              onClick={() => setActiveCategory('seedPacks')}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === 'seedPacks'
                  ? 'bg-[#245329] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Seed Packs
            </button>
          </div>
        </div>
        
        <div
          className={`grid gap-x-20 gap-y-10 mx-auto mb-16 ${
            activeCategory === 'boosters'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2'
          }`}
        >
          {activeCategory === 'boosters'
            ? boosters.map((item, idx) => (
                <ShopBoosterCard
                  key={`booster-${item._id || idx}`}
                  title={item.name}
                  price={`₵${item.price?.toLocaleString() || '0.00'}`}
                  imageSrc={item.itemImageUrl}
                  description={item.description}
                  onBuy={() => alert(`Bought ${item.name}!`)}
                />
              ))
            : seedPacks.map((item, idx) => (
                <ShopSeedPackCard
                  key={`seedpack-${item._id || idx}`}
                  title={item.name}
                  rarity={item.rarity}
                  price={`₵${item.price?.toLocaleString() || '0.00'}`}
                  imageSrc={item.imageUrl}
                  description={item.description}
                  userLevel={userLevel}
                  onBuy={() => alert(`Bought ${item.name}!`)}
                />
              ))}
        </div>

        {activeCategory === 'seedPacks' && getUnlockedSeedPacks().length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Seed Packs Unlocked Yet</h3>
            <p className="text-gray-500">Keep leveling up to unlock amazing seed packs!</p>
          </div>
        )}
      </main>
    </>
  );
};

export default ShopPage;