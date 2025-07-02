'use client'

import React from 'react';
import ShopItemCard from '../../../components/ShopItemCard';
import ShopNavbar from '../../../components/ShopNavbar';

const items = [
  {
    title: 'Watering can',
    price: '₵50',
    imageSrc: '/shop-items/watering-can.png',
    description: 'Watering can bottle can help you blahblahblahblahblahblah kapoya na aning msad men',
    onBuy: () => alert('Bought Watering can!'),
  },
  {
    title: 'Fertilizer',
    price: '₵500',
    imageSrc: '/shop-items/fertilizer.png',
    description: 'Fertilizer can help you blahblahblahblahblahblah kapoya na aning msad men',
    onBuy: () => alert('Bought Fertilizer!'),
  },
  {
    title: 'Garden Gloves',
    price: '₵500',
    imageSrc: '/shop-items/gardening-gloves.png',
    description: 'Garden gloves can help you blahblahblahblahblahblah kapoya na aning msad men',
    onBuy: () => alert('Bought Gardening Gloves!'),
  },
  {
    title: 'Growth Tonic',
    price: '₵500',
    imageSrc: '/shop-items/growth-tonic.png',
    description: 'Growth tonic can help you blahblahblahblahblahblah kapoya na aning msad men',
    onBuy: () => alert('Bought Growth Tonic!'),
  },
  {
    title: 'Misting Bottle',
    price: '₵500',
    imageSrc: '/shop-items/misting-bottle.png',
    description: 'Misting bottle can help you blahblahblahblahblahblah kapoya na aning msad men',
    onBuy: () => alert('Bought Misting Bottle!'),
  },
  {
    title: 'Magic Dust',
    price: '₵500',
    imageSrc: '/shop-items/magic-dust.png',
    description: 'Misting bottle can help you blahblahblahblahblahblah kapoya na aning msad men',
    onBuy: () => alert('Bought Misting Bottle!'),
  },
];

const ShopPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <ShopNavbar />
      <div className="w-full min-h-screen bg-white rounded-b-2xl">
        <h1 className="text-4xl font-bold text-green-800 mb-8 mt-2 ml-5 pt-4">Shop</h1>
        <div className="flex flex-wrap gap-x-12 gap-y-10 ml-22">
          {items.map((item, idx) => (
            <ShopItemCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
