'use client'

import React, { useState } from 'react';
import ShopBoosterCard from '@/components/ShopBoosterCard';
import ShopSeedPackCard from '@/components/ShopSeedPackCard';
import { Poppins } from 'next/font/google';
import Navbar from '@/components/NavigationBar';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const boosters = [
  {
    title: 'Watering can',
    price: '₵500.00',
    imageSrc: '/shop-items/watering-can.png',
    description: 'Essential tool for keeping your plants hydrated and healthy',
    onBuy: () => alert('Bought Watering can!'),
  },
  {
    title: 'Fertilizer',
    price: '₵500.00',
    imageSrc: '/shop-items/fertilizer.png',
    description: 'Nutrient-rich fertilizer to boost plant growth',
    onBuy: () => alert('Bought Fertilizer!'),
  },
  {
    title: 'Garden Gloves',
    price: '₵500.00',
    imageSrc: '/shop-items/gardening-gloves.png',
    description: 'Protective gloves for safe and comfortable gardening',
    onBuy: () => alert('Bought Garden Gloves!'),
  },
  {
    title: 'Growth Tonic',
    price: '₵500.00',
    imageSrc: '/shop-items/growth-tonic.png',
    description: 'Special tonic to accelerate plant development',
    onBuy: () => alert('Bought Growth Tonic!'),
  },
  {
    title: 'Misting Bottle',
    price: '₵500.00',
    imageSrc: '/shop-items/misting-bottle.png',
    description: 'Fine mist spray bottle for delicate plant care',
    onBuy: () => alert('Bought Misting Bottle!'),
  },
  {
    title: 'Magic Dust',
    price: '₵500.00',
    imageSrc: '/shop-items/magic-dust.png',
    description: 'Magical enhancement dust for extraordinary plant growth',
    onBuy: () => alert('Bought Magic Dust!'),
  },
];

const seedPacks = [
  {
    title: 'Tomato Seeds',
    rarity: 'Common',
    price: '₵150.00',
    imageSrc: '/seed-packs/bamboo.png',
    description: 'Premium tomato seeds for a bountiful harvest',
    onBuy: () => alert('Bought Tomato Seeds!'),
  },
  {
    title: 'Herb Mix',
    rarity: 'Rare',
    price: '₵200.00',
    imageSrc: '/seed-packs/primrose.png',
    description: 'Assorted herb seeds for your kitchen garden',
    onBuy: () => alert('Bought Herb Mix!'),
  },
  {
    title: 'Flower Seeds',
    rarity: 'Legendary',
    price: '₵100.00',
    imageSrc: '/seed-packs/spooky-pumpkin.png',
    description: 'Beautiful flower seeds to brighten your garden',
    onBuy: () => alert('Bought Flower Seeds!'),
  },
  {
    title: 'Vegetable Mix',
    rarity: 'Mythical',
    price: '₵250.00',
    imageSrc: '/seed-packs/wild-cactus.png',
    description: 'Variety pack of vegetable seeds for fresh produce',
    onBuy: () => alert('Bought Vegetable Mix!'),
  },
];

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState('boosters');
  
  // TO BE REPLACED WITH THE ACTUAL USER LEVEL AND COINS
  const [userLevel, setUserLevel] = useState(20); // Example: user is level 20
  const [userCoins, setUserCoins] = useState(2500); // Example: user has 2500 coins
  
  const currentItems = activeCategory === 'boosters' ? boosters : seedPacks;

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
                <ShopBoosterCard key={`booster-${idx}`} {...item} />
              ))
            : seedPacks.map((item, idx) => (
                <ShopSeedPackCard 
                  key={`seedpack-${idx}`} 
                  {...item} 
                  userLevel={userLevel}
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