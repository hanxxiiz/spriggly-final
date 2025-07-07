'use client'

import React from 'react';
import ShopItemCard from '../../../components/ShopItemCard';
import Link from 'next/link';

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
      <header className="bg-white shadow-sm rounded-t-xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-lime-200 flex items-center justify-center font-bold text-green-800 text-xl">S</div>
          <span className="text-2xl font-bold text-green-800">Spriggly</span>
        </div>
        <nav className="flex-1 flex justify-center">
          <ul className="flex space-x-8 text-green-800 font-medium">
            <li><Link href="/dashboard" className="hover:font-bold">Home</Link></li>
            <li><Link href="/dashboard" className="hover:font-bold">Grow</Link></li>
            <li><Link href="/dashboard/my_plants">My Plants</Link></li>
            <li><Link href="/dashboard/shop" className="font-bold underline underline-offset-4">Shop</Link></li>
            <li><Link href="/dashboard/notifications">Notifications</Link></li>
            <li><Link href="/dashboard/profile">Profile</Link></li>
            <li><Link href="/dashboard/settings">Settings</Link></li>
          </ul>
        </nav>
      </header>
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
