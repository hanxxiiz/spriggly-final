'use client';

import React, { useState, useEffect } from 'react';
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
import { useSession } from "next-auth/react";
import Link from 'next/link';

const CARDS_PER_PAGE = 4;

// Utility to number duplicate plant names
function addPlantNumbers(plants: any[]): any[] {
  const nameCount: Record<string, number> = {};
  return plants.map((plant: any) => {
    const baseName = plant.template?.name || plant.plantName || 'Unknown';
    nameCount[baseName] = (nameCount[baseName] || 0) + 1;
    return {
      ...plant,
      displayName: `${baseName} ${nameCount[baseName]}`,
    };
  });
}

function GrowSplineViewer({
  plant,
  onUsePlant,
  onUseBooster,
  onSeedPackDrop,
}: {
  plant: any,
  onUsePlant: (plantId: string | number) => void,
  onUseBooster: (boosterId: string | number) => void,
  onSeedPackDrop: (item: { id: string | number; name: string }) => void
}) {
  const splineRef = React.useRef<any>(null);
  const [currentStage, setCurrentStage] = React.useState<number>(plant.plantLevel || 1);
  const [loaded, setLoaded] = React.useState(false);

  // Always use the correct sceneUrl from template if available
  const sceneUrl = plant.template?.sceneUrl || plant.template?.modelUrl || plant.sceneUrl || '';

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['plant', 'booster'],
    drop: (item: any) => {
      if (item.type === 'booster') {
        onUseBooster(item.id);
      } else {
        onUsePlant(item.id);
        onSeedPackDrop(item as { id: string | number; name: string });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [onUsePlant]);

  React.useEffect(() => {
    setCurrentStage(plant.plantLevel || 1);
  }, [plant.plantLevel, sceneUrl]);

  const handleSplineLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    setLoaded(true);
  };

  React.useEffect(() => {
    if (!loaded || !splineRef.current) return;
    updateStageVisibility(plant.plantLevel || 1);
  }, [plant.plantLevel, loaded]);

  const updateStageVisibility = (activeStage: number) => {
    for (let i = 1; i <= 5; i++) {
      const obj = splineRef.current?.findObjectByName?.(`stage_${i}`);
      if (obj) {
        const shouldBeVisible = i === activeStage;
        obj.visible = shouldBeVisible;
        if (obj.children) obj.children.forEach((child: any) => (child.visible = shouldBeVisible));
        if (obj.parent) obj.parent.updateMatrixWorld(true);
      } else {
        // Warn if a stage object is missing in the Spline scene
        if (i === activeStage) {
          // Only warn for the current stage to avoid spam
          // eslint-disable-next-line no-console
          console.warn(`Spline: stage_${i} not found in scene for plant level ${activeStage}`);
        }
      }
    }
    if (splineRef.current?.scene) {
      splineRef.current.scene.updateMatrixWorld(true);
    }
  };

  // Log missing sceneUrl for debugging
  React.useEffect(() => {
    if (!sceneUrl) {
      if (plant && Object.keys(plant).length > 0) {
        // eslint-disable-next-line no-console
        console.warn('Missing sceneUrl for plant:', plant);
      }
    }
  }, [plant, sceneUrl]);

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`mt-4 w-full max-w-[650px] h-[380px] sm:h-[400px] md:h-[420px] lg:w-[650px] lg:h-[540px] bg-white rounded-xl flex items-center justify-center relative overflow-hidden transition-colors duration-200 border-[#5a5353]`}
    >
      <div className="w-full h-full">
        <div className="absolute inset-0 w-full h-full">
          {sceneUrl && sceneUrl.endsWith('.splinecode') ? (
            <Spline scene={sceneUrl} onLoad={handleSplineLoad} className="w-full h-full" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-300">
              No 3D preview available
            </div>
          )}
        </div>
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
  const { data: session, status } = useSession();
  const [selectedPlantIdx, setSelectedPlantIdx] = useState<number>(0);
  const [userPlants, setUserPlants] = useState<any[]>([]);
  const [seedInventory, setSeedInventory] = useState<any[]>([]);
  const [boosterInventory, setBoosterInventory] = useState<any[]>([]);
  const [showInventory, setShowInventory] = useState(true);
  const [selectedSeedPack, setSelectedSeedPack] = useState<any>(null);
  const [usedBooster, setUsedBooster] = useState<any>(null);
  const [pendingSeed, setPendingSeed] = useState<any>(null); // For confirmation modal
  const [planting, setPlanting] = useState(false);

  // Fetch grow data when session is ready and userId is available
  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    const userId = session?.user?.id;
    if (!userId) return;
    fetch(`/api/grow/user-data?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setUserPlants(data.userPlants || []);
        setSeedInventory(data.seedInventory || []);
        setBoosterInventory(data.boosterInventory || []);
      });
  }, [session, status]);

  // Numbered plant names for display
  const numberedPlants = addPlantNumbers(userPlants);
  const plant = numberedPlants[selectedPlantIdx] || {};

  // Inventory panel expects items (seeds) and boosters
  const inventorySeeds: any[] = seedInventory.map((seed: any) => ({
    ...seed,
    id: seed._id || seed.plantTemplateId,
    name: seed.template?.name || 'Unknown',
    image: seed.template?.imageUrl,
    quantity: seed.quantity,
  }));
  const inventoryBoosters: any[] = boosterInventory.map((booster: any) => ({
    id: booster.boosterTemplateId, // Use boosterTemplateId for backend
    name: booster.template?.name || 'Unknown',
    image: booster.template?.itemImageUrl,
    quantity: booster.quantity,
    effect: booster.template?.effectType,
  }));

  // Inventory actions
  const handleUseBooster = async (boosterId: any) => {
    const userId = session?.user?.id;
    const plantId = numberedPlants[selectedPlantIdx]?._id;
    if (!plantId) return;
    const res = await fetch('/api/grow/use-booster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plantId, boosterId }),
    });
    const data = await res.json();
    if (data.plant) {
      // Update plant in state with a new object reference
      setUserPlants((prev: any[]) => prev.map((p: any) => p._id === data.plant._id ? { ...data.plant } : p));
    }
    if (data.boosterInventory) {
      setBoosterInventory(data.boosterInventory);
    }
    setUsedBooster(inventoryBoosters.find(b => b.id === boosterId));
  };

  // Plant a seed by click or drag-drop
  const handlePlantSeed = async (seed: any) => {
    if (planting) return; // Prevent double-planting
    setPlanting(true);
    const userId = session?.user?.id;
    // Robustly extract plantTemplateId as a string
    const plantTemplateId =
      seed.plantTemplateId
        ? String(seed.plantTemplateId)
        : seed.template?._id
          ? String(seed.template._id)
          : undefined;
    if (!userId || !plantTemplateId) {
      setPlanting(false);
      return;
    }
    try {
      const res = await fetch('/api/grow/plant-seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plantTemplateId }),
      });
      const data = await res.json();
      if (data.userPlants) setUserPlants(data.userPlants);
      if (data.seedInventory) setSeedInventory(data.seedInventory);
      // Auto-select the new plant (last in array)
      if (data.userPlants && data.userPlants.length > 0) {
        setSelectedPlantIdx(data.userPlants.length - 1);
      }
      setSelectedSeedPack(seed); // Show modal
      setShowInventory(false); // On mobile, close inventory
    } finally {
      setPlanting(false);
    }
  };

  // Remove confirmation modal logic (pendingSeed, confirmPlantSeed, cancelPlantSeed)

  const handlePrevPlant = () => setSelectedPlantIdx(idx => Math.max(0, idx - 1));
  const handleNextPlant = () => setSelectedPlantIdx(idx => Math.min(numberedPlants.length - 1, idx + 1));

  // Auto-dismiss the success modal after 1.5s
  useEffect(() => {
    if (selectedSeedPack) {
      const timer = setTimeout(() => setSelectedSeedPack(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedSeedPack]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen w-screen bg-[#6B6464] overflow-hidden">
        <div className="flex flex-col lg:flex-row flex-1">
          {/* Sidebar */}
          {/* Mobile Bottom Bar */}
<div className="fixed bottom-0 left-0 w-full z-30 bg-[#5a5353] px-4 py-2 flex justify-center gap-4 shadow-md lg:hidden">
  <Link href="/" className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
    <IoReturnUpBackSharp className="text-[#222] text-xl" />
  </Link>

  <button
    onClick={() => setShowInventory((prev) => !prev)}
    className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow"
  >
    <MdInventory className="text-[#222] text-xl" />
  </button>
</div>

{/* Desktop Sidebar */}
<div className="hidden lg:flex flex-col items-center pt-8 px-4">
  <Link href="/dashboard" className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 shadow">
    <IoReturnUpBackSharp className="text-[#222] text-2xl" />
  </Link>

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
  onUsePlant={() => {}} // Placeholder, actual logic will be backend
  onUseBooster={handleUseBooster}
  onSeedPackDrop={handlePlantSeed}
/>

      <button
        onClick={handleNextPlant}
        disabled={selectedPlantIdx === numberedPlants.length - 1}
        className="cursor-pointer z-10 ml-4 hover:scale-125 transition-transform duration-200"
      >
        <FaPlay className="text-yellow-300 text-2xl" />
      </button>
    </div>

    <div className="mt-3 flex justify-center">
      <LevelBar
        level={plant.plantLevel || plant.level}
        currentXp={plant.plantCurrentXp ?? 0}
        requiredXp={(() => {
          const lvl = plant.plantLevel || plant.level || 1;
          const reqs = plant.template?.growthXpRequirements;
          if (!reqs) return 1000;
          const stageOrder = ['seed', 'sprout', 'sapling', 'mature', 'blooming'];
          const nextStage = stageOrder[Math.min(lvl, stageOrder.length - 1)];
          return reqs[nextStage] ?? 1000;
        })()}
        plantName={plant.displayName || plant.plantName || 'Unknown'}
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
  items={inventorySeeds}
  boosters={inventoryBoosters}
  onUsePlant={() => {}} // Placeholder, actual logic will be backend
  onSeedPackClick={handlePlantSeed}
  onBoosterClick={(item: any) => handleUseBooster(item.id)}
/>



</div>

{showInventory && (
  <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
    <GrowInventoryPanel
      page={0}
      cardsPerPage={CARDS_PER_PAGE}
      items={inventorySeeds} // Seed packs
      boosters={inventoryBoosters} // Boosters (have "effect")
      onUsePlant={() => {}} // Placeholder, actual logic will be backend
      onSeedPackClick={handlePlantSeed}
      onBoosterClick={(item: any) => handleUseBooster(item.id)}

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
        You have successfully planted <span className="font-semibold text-green-700">{(selectedSeedPack as any)?.name}</span> 🌱
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
        <span className="font-semibold text-yellow-700">{(usedBooster as any)?.name}</span> was successfully applied to your plant! 🌟
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

{pendingSeed && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
    <div className="bg-white text-[#245329] px-8 py-10 rounded-2xl shadow-xl w-[90vw] max-w-[400px] text-center relative animate-fade-in-up">
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100 shadow-inner">
        {pendingSeed.template?.imageUrl && (
          <img src={pendingSeed.template.imageUrl} alt={pendingSeed.template.name} className="w-12 h-12 object-contain" />
        )}
      </div>
      <h2 className="text-2xl font-extrabold mb-1">Plant Seed?</h2>
      <p className="text-md text-[#3e694a] font-medium mb-4">
        Are you sure you want to plant <span className="font-semibold text-green-700">{pendingSeed.template?.name || pendingSeed.name}</span>?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            const userId = session?.user?.id;
            const plantTemplateId = pendingSeed.plantTemplateId || pendingSeed.template?._id;
            if (!userId || !plantTemplateId) return;
            fetch('/api/grow/plant-seed', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, plantTemplateId }),
            })
              .then(res => res.json())
              .then(data => {
                if (data.userPlants) setUserPlants(data.userPlants);
                if (data.seedInventory) setSeedInventory(data.seedInventory);
                setSelectedSeedPack(null);
              });
          }}
          className="px-5 py-2 bg-[#245329] hover:bg-[#1e4424] text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
        >
          Yes, Plant
        </button>
        <button
          onClick={() => setPendingSeed(null)}
          className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-[#245329] font-semibold rounded-lg shadow-lg transition-all duration-300"
        >
          Cancel
        </button>
      </div>
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

{planting && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-full p-6 shadow-lg flex flex-col items-center">
      <svg className="animate-spin h-8 w-8 text-green-600 mb-2" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      <span className="text-green-700 font-semibold">Planting...</span>
    </div>
  </div>
)}

    </DndProvider>
  );
}
