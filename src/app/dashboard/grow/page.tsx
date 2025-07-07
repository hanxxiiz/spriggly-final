'use client';

import React, { useState } from 'react';
import GrowInventoryPanel from '@/components/grow/GrowInventoryPanel';
import LevelBar from '@/components/grow/LevelBar';
import NotificationCard from '@/components/NotificationCard';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';
import Spline from '@splinetool/react-spline';
import { IoIosNotifications } from "react-icons/io";
import { IoReturnUpBackSharp } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { MdInventory } from "react-icons/md";

const CARDS_PER_PAGE = 4;

const splinePlants = [
  {
    plantName: 'Bamboo',
    description: 'Leche flan leche flan leche flan leche flan leche flan.',
    locked: false,
    level: 5,
    sceneUrl: 'https://prod.spline.design/IpCgeeJ6P90fLahm/scene.splinecode',
  },
  {
    plantName: 'Bulak',
    description: 'Sampaguita is blahblahblahblah jasoisdjasdojasdojasdojasdojasdjasdjasjd.',
    locked: false,
    level: 5,
    sceneUrl: 'https://prod.spline.design/7400UXKffZI7SomF/scene.splinecode'
  },
  {
    plantName: 'Wild Cactus',
    description: 'HELL YEAHHHHHH',
    locked: false,
    level: 5,
    sceneUrl: 'https://prod.spline.design/5M0Y5knIgZ4jDtlJ/scene.splinecode',
  },
  {
    plantName: 'Spooky Pumpkin',
    description: 'HELL YEAHHH BABYYYYY',
    locked: false,
    level: 5,
    sceneUrl: 'https://prod.spline.design/14E85RrSyiU8AVlp/scene.splinecode',
  },
];

const inventoryBoosters = [
  {
    id: 'b1',
    name: 'Misting Bottle',
    effect: 'add10Xp',
    quantity: 2,
    image: '/booster-icons/misting-bottle.png', // ✅
  },
  {
    id: 'b2',
    name: 'Fertilizer',
    effect: 'add50Xp',
    quantity: 1,
    image: '/booster-icons/fertilizer.png', // ✅
  },
];

const inventorySeedPack = [
  { id: 1, name: 'Seed A', quantity: 2 },
  { id: 2, name: 'Seed B', quantity: 1 },
  { id: 3, name: 'Seed C', quantity: 3 },
  { id: 4, name: 'Seed D', quantity: 1 },
  { id: 5, name: 'Seed E', quantity: 2 },
  { id: 6, name: 'Seed F', quantity: 1 },
  { id: 7, name: 'Seed G', quantity: 1 },
  { id: 8, name: 'Seed H', quantity: 2 },
  { id: 9, name: 'Seed I', quantity: 3 },
  { id: 10, name: 'Seed J', quantity: 1 },
  { id: 11, name: 'Seed K', quantity: 2 },
  { id: 12, name: 'Seed L', quantity: 1 },
  { id: 13, name: 'Seed M', quantity: 1 },
  { id: 14, name: 'Seed N', quantity: 3 },
  { id: 15, name: 'Seed O', quantity: 2 },
];

function GrowSplineViewer({
  plant,
  onUsePlant,
  onUseBooster,
  onSeedPackDrop, // ✅ Add this properly
}: {
  plant: typeof splinePlants[0],
  onUsePlant: (plantId: string | number) => void,
  onUseBooster: (boosterId: string | number) => void,
  onSeedPackDrop: (item: { id: string | number; name: string }) => void // ✅ Add this line
}) {


  const splineRef = React.useRef<any>(null);
  const [currentStage, setCurrentStage] = React.useState(plant.level);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['plant', 'booster'],

  drop: (item: { id: string | number; name: string; type?: string }) => {
  if (item.type === 'booster') {
    onUseBooster(item.id); // ✅ boosters only trigger logic
  } else {
    onUsePlant(item.id);    
    onSeedPackDrop(item);   // ✅ this only runs for seed packs
  }
},



    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [onUsePlant]);

  React.useEffect(() => {
    setCurrentStage(plant.level);
  }, [plant.level, plant.sceneUrl]);

  const handleSplineLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    updateStageVisibility(plant.level);
  };

  React.useEffect(() => {
    if (!splineRef.current) return;
    updateStageVisibility(currentStage);
  }, [currentStage]);

  const updateStageVisibility = (activeStage: number) => {
    for (let i = 1; i <= 5; i++) {
      const obj = splineRef.current.findObjectByName(`stage_${i}`);
      if (obj) {
        const shouldBeVisible = i === activeStage;
        obj.visible = shouldBeVisible;
        obj.children?.forEach((child: any) => (child.visible = shouldBeVisible));
        obj.parent?.updateMatrixWorld(true);
      }
    }
    if (splineRef.current.scene) {
      splineRef.current.scene.updateMatrixWorld(true);
    }
  };

  return (
  <div
    ref={drop as unknown as React.Ref<HTMLDivElement>}
    className={`
      mt-4 w-full max-w-[650px] h-[380px] sm:h-[400px] md:h-[420px] lg:w-[650px] lg:h-[540px]
      bg-[#6B6464] rounded-xl flex items-center justify-center 
      relative overflow-hidden transition-colors duration-200 
      border-[#5a5353] // 🔁 Always keep the base border
    `}
  >
    <div className="w-full h-full">
      <Spline scene={plant.sceneUrl} onLoad={handleSplineLoad} className="w-full h-full" />

      {/* 💥 Force canvas to fill height */}
      <style jsx global>{`
        canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: relative !important;
        }
      `}</style>
    </div>
  </div>
);
}

export default function GrowPage() {
  const [selectedPlantIdx, setSelectedPlantIdx] = useState(0);
const [plantsState, setPlantsState] = useState([...inventorySeedPack, ...inventoryBoosters]);
  const [showInventory, setShowInventory] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifExitAnim, setNotifExitAnim] = useState(false);
  const [selectedSeedPack, setSelectedSeedPack] = useState<{ id: string | number; name: string } | null>(null);
const [usedBooster, setUsedBooster] = useState<{ id: string | number; name: string } | null>(null);

  const [notifications, setNotifications] = useState([
    {
      type: 'Reward',
      message: 'You earned 10 XP from focus time!',
      time: '2 minutes ago',
      icon: '🌱',
      color: 'bg-green-500',
      read: false,
    },
    {
      type: 'Reminder',
      message: "Don't forget to check your plant today!",
      time: '1 hour ago',
      icon: '⏰',
      color: 'bg-yellow-500',
      read: false,
    },
    {
      type: 'System',
      message: 'New plant species added to the shop!',
      time: 'Yesterday',
      icon: '🛒',
      color: 'bg-blue-500',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const plant = splinePlants[selectedPlantIdx];

  const handlePrevPlant = () => setSelectedPlantIdx((idx) => Math.max(0, idx - 1));
  const handleNextPlant = () => setSelectedPlantIdx((idx) => Math.min(splinePlants.length - 1, idx + 1));

  const handleUsePlant = (plantId: string | number) => {
    setPlantsState((prev) => {
      const idx = prev.findIndex((p) => String(p.id) === String(plantId));
      if (idx === -1) return prev;
      const updated = [...prev];
      if (updated[idx].quantity && updated[idx].quantity > 1) {
        updated[idx] = { ...updated[idx], quantity: (updated[idx].quantity || 1) - 1 };
      } else {
        updated.splice(idx, 1);
      }
      return updated;
    });
  };
const handleUseBooster = (boosterId: string | number) => {
  setPlantsState((prev) => {
    const idx = prev.findIndex((p) => String(p.id) === String(boosterId));
    if (idx === -1) return prev;

    const updated = [...prev];
    if (updated[idx].quantity && updated[idx].quantity > 1) {
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity! - 1 };
    } else {
      updated.splice(idx, 1);
    }

    // TODO: Trigger XP gain or animation here
    console.log(`Booster ${boosterId} used!`);

    return updated;
  });
};
const handleBoosterClick = (item: { id: string | number; name: string }) => {
  handleUseBooster(item.id);
  setUsedBooster(item); // ✅ Trigger modal
};

  const handleSeedPackClick = (item: { id: string | number; name: string }) => {
  setSelectedSeedPack(item);

  setPlantsState((prev) => {
    const idx = prev.findIndex((p) => String(p.id) === String(item.id));
    if (idx === -1) return prev;

    const updated = [...prev];
    if (updated[idx].quantity && updated[idx].quantity > 1) {
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity! - 1 };
    } else {
      updated.splice(idx, 1);
    }
    return updated;
  });
};

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen w-screen bg-[#6B6464] overflow-hidden">
        <div className="flex flex-col lg:flex-row flex-1">
          {/* Sidebar */}
          {/* Mobile Bottom Bar */}
<div className="fixed bottom-0 left-0 w-full z-30 bg-[#5a5353] px-4 py-2 flex justify-center gap-4 shadow-md lg:hidden">
  <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
    <IoReturnUpBackSharp className="text-[#222] text-xl" />
  </button>

  <button
    onClick={() => setShowNotifications(true)}
    className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center shadow"
  >
    <IoIosNotifications className="text-[#222] text-xl" />
    {unreadCount > 0 && (
      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
        {unreadCount}
      </span>
    )}
  </button>

  <button
    onClick={() => setShowInventory((prev) => !prev)}
    className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow"
  >
    <MdInventory className="text-[#222] text-xl" />
  </button>
</div>

{/* Desktop Sidebar */}
<div className="hidden lg:flex flex-col items-center pt-8 px-4">
  <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 shadow">
    <IoReturnUpBackSharp className="text-[#222] text-2xl" />
  </button>

  <button
    onClick={() => setShowNotifications(true)}
    className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 shadow"
  >
    <IoIosNotifications className="text-[#222] text-2xl" />
    {unreadCount > 0 && (
      <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
        {unreadCount}
      </span>
    )}
  </button>

  <button
    onClick={() => setShowInventory((prev) => !prev)}
    className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow"
  >
    <MdInventory className="text-[#222] text-2xl" />
  </button>
</div>


  {/* Main Section */}
<div className="flex-1 flex flex-col items-center justify-center gap-3 relative">
  <div className={`transition-all duration-500 ${showInventory ? '' : 'lg:ml-[300px]'}`}>
    <div className="flex items-center justify-center">
      <button
        onClick={handlePrevPlant}
        disabled={selectedPlantIdx === 0}
        className="cursor-pointer z-10 mr-4 hover:scale-125 transition-transform duration-200"
      >
        <FaPlay className="text-yellow-300 text-2xl rotate-180" />
      </button>

<GrowSplineViewer
  plant={plant}
  onUsePlant={handleUsePlant}
  onUseBooster={handleUseBooster}
  onSeedPackDrop={(item) => setSelectedSeedPack({ id: item.id, name: item.name })}
/>

      <button
        onClick={handleNextPlant}
        disabled={selectedPlantIdx === splinePlants.length - 1}
        className="cursor-pointer z-10 ml-4 hover:scale-125 transition-transform duration-200"
      >
        <FaPlay className="text-yellow-300 text-2xl" />
      </button>
    </div>

    <div className="mt-3 flex justify-center">
      <LevelBar
        level={plant.level}
        currentXp={50}
        requiredXp={1000}
        plantName={plant.plantName}
      />
    </div>
  </div>
</div>

{/* Inventory */}
<div
  className={`hidden lg:flex transition-all duration-500 ease-in-out transform ${
    showInventory
      ? 'translate-x-0 opacity-100'
      : 'translate-x-full opacity-0 pointer-events-none'
  } items-center justify-end pr-12 h-full`}
>
 <GrowInventoryPanel
  page={0}
  cardsPerPage={CARDS_PER_PAGE}
  items={plantsState.filter(item => !('effect' in item))}
  boosters={plantsState.filter(item => 'effect' in item)}
  onUsePlant={handleUsePlant}
  onSeedPackClick={handleSeedPackClick}
  onBoosterClick={(item) => handleUseBooster(item.id)}
/>



</div>

{showInventory && (
  <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
    <GrowInventoryPanel
      page={0}
      cardsPerPage={CARDS_PER_PAGE}
      items={plantsState.filter(item => !('effect' in item))} // Seed packs
      boosters={plantsState.filter(item => 'effect' in item)} // Boosters (have "effect")
      onUsePlant={handleUsePlant}
      onSeedPackClick={handleSeedPackClick}
      onBoosterClick={handleBoosterClick}

      className="relative max-w-[90vw] max-h-[85vh] overflow-y-auto"
    />

    <button
      onClick={() => setShowInventory(false)}
      className="absolute top-4 right-5 text-2xl text-white hover:text-gray-300"
    >
      &times;
    </button>
  </div>
)}



        </div>
      </div>

      {/* Notification Modal */}
      {showNotifications && (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-opacity duration-300 ${
      notifExitAnim ? 'opacity-0' : 'opacity-100'
    }`}
  >
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg w-[90vw] sm:w-[500px] max-h-[85vh] text-black relative overflow-y-auto">
      <h2 className="text-xl sm:text-2xl font-extrabold text-[#245329] mb-2 text-center sm:text-left">
        Notifications
      </h2>

<div className="-mt-1 max-h-[500px] overflow-y-auto pr-2 space-y-2">
  {notifications.map((notif, index) => (
    <div
      key={index}
      className={`transition-transform duration-300 ease-in-out bg-white rounded-xl p-3 shadow-sm ${
        notif.read ? 'scale-[0.98] opacity-80' : 'scale-100'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-white text-xs sm:text-sm ${notif.color}`}>
          {notif.icon}
        </div>
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-semibold leading-snug">{notif.message}</p>
          <p className="text-[11px] sm:text-xs text-gray-500">{notif.time}</p>
        </div>
      </div>
    </div>
  ))}





      </div>

      {unreadCount > 0 && (
        <button
          onClick={() =>
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, read: true }))
            )
          }
          className="mt-4 w-full px-4 py-2 bg-[#245329] text-white font-semibold rounded-lg hover:bg-[#1c3f22] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Mark All as Read
        </button>
      )}

      <button
        onClick={() => {
          setNotifExitAnim(true);
          setTimeout(() => {
            setShowNotifications(false);
            setNotifExitAnim(false);
          }, 300);
        }}
        className="cursor-pointer absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl transition-transform duration-300 transform hover:scale-125"
      >
        &times;
      </button>
    </div>
  </div>
)}


      {/* Seed Pack Modal */}
 {selectedSeedPack && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
    <div className="bg-white text-[#245329] px-8 py-10 rounded-2xl shadow-xl w-[90vw] max-w-[400px] text-center relative animate-fade-in-up">
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100 shadow-inner">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-extrabold mb-1">Seed Planted!</h2>
      <p className="text-md text-[#3e694a] font-medium">
        You have successfully planted <span className="font-semibold text-green-700">{selectedSeedPack.name}</span> 🌱
      </p>

      <button
        onClick={() => setSelectedSeedPack(null)}
        className="mt-6 px-5 py-2 bg-[#245329] hover:bg-[#1e4424] text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
      >
        Go back
      </button>
    </div>

    <style jsx global>{`
      @keyframes fade-in-up {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in-up {
        animation: fade-in-up 0.4s ease-out;
      }
    `}</style>
  </div>
)}

{usedBooster && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
    <div className="bg-white text-[#245329] px-8 py-10 rounded-2xl shadow-xl w-[90vw] max-w-[400px] text-center relative animate-fade-in-up">
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-yellow-100 shadow-inner">
        <svg
          className="w-8 h-8 text-yellow-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m0-4h.01M12 19c4.418 0 8-1.79 8-4V7c0-2.21-3.582-4-8-4s-8 1.79-8 4v8c0 2.21 3.582 4 8 4z" />
        </svg>
      </div>

      <h2 className="text-2xl font-extrabold mb-1">Booster Used!</h2>
      <p className="text-md text-[#3e694a] font-medium">
        <span className="font-semibold text-yellow-700">{usedBooster.name}</span> was successfully applied to your plant! 🌟
      </p>

      <button
        onClick={() => setUsedBooster(null)}
        className="mt-6 px-5 py-2 bg-[#245329] hover:bg-[#1e4424] text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
      >
        Got it!
      </button>
    </div>

    <style jsx global>{`
      @keyframes fade-in-up {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in-up {
        animation: fade-in-up 0.4s ease-out;
      }
    `}</style>
  </div>
)}

    </DndProvider>
  );
}
