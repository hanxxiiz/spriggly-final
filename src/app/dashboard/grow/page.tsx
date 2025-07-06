'use client'

import React, { useState } from 'react';
import GrowInventoryPanel from '@/components/grow/GrowInventoryPanel';
import LevelBar from '@/components/grow/LevelBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';
import Spline from '@splinetool/react-spline';
import { IoIosNotifications } from "react-icons/io";
import { IoReturnUpBackSharp } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";

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

function SplineDropViewport({ onDrop }: { onDrop: (plantId: string | number) => void }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'plant',
    drop: (item: { id: string | number }) => {
      onDrop(item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [onDrop]);

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`w-[1000px] h-[1000px] bg-[#6B6464]  border-2 flex items-center justify-center transition-colors duration-200 ${isOver && canDrop ? 'border-yellow-300 bg-[#7a726a]' : 'border-[#5a5353]'}`}
    >
      <span className="text-white text-xl opacity-50">Spline Model Here</span>
      {isOver && canDrop && (
        <span className="absolute text-yellow-300 text-2xl font-bold">Drop to plant!</span>
      )}
    </div>
  );
}

function GrowSplineViewer({ plant, onUsePlant }: { plant: typeof splinePlants[0], onUsePlant: (plantId: string | number) => void }) {
  const splineRef = React.useRef<any>(null);
  const [currentStage, setCurrentStage] = React.useState(plant.level);
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'plant',
    drop: (item: { id: string | number }) => {
      onUsePlant(item.id);
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
      className={`w-[500px] h-[500px] bg-[#6B6464] rounded-xl border-2 flex items-center justify-center relative overflow-hidden transition-colors duration-200 ${isOver && canDrop ? 'border-yellow-300 bg-[#7a726a]' : 'border-[#5a5353]'}`}
    >
      <Spline
        scene={plant.sceneUrl}
        onLoad={handleSplineLoad}
        className="w-full h-full"
      />
      {isOver && canDrop && (
        <span className="absolute text-yellow-300 text-2xl font-bold">Drop to plant!</span>
      )}
    </div>
  );
}

export default function GrowPage() {
  const [selectedPlantIdx, setSelectedPlantIdx] = useState(0);
  const [plantsState, setPlantsState] = useState(inventorySeedPack);
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen w-screen bg-[#6B6464]">
        {/* Left Sidebar */}
        <div className="flex flex-col items-center pt-8 px-4">
          <button className="cursor-pointer w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 shadow" aria-label="Back">
            <IoReturnUpBackSharp className="text-[#222] text-2xl" />
          </button>
          <button className="cursor-pointer w-14 h-14 rounded-full bg-white flex items-center justify-center shadow" aria-label="Notifications">
            <IoIosNotifications className="text-[#222] text-2xl" />
          </button>
        </div>

        {/* Spline Model and Level Bar */}
        <div className="flex-1 flex flex-col items-center justify-center gap-12 relative">
          <button
            onClick={handlePrevPlant}
            disabled={selectedPlantIdx === 0}
            className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 z-10 hover:scale-125 transition-transform duration-200"
            aria-label="Previous Plant"
          >
            <FaPlay className="text-yellow-300 text-2xl rotate-180" />
          </button>

          <GrowSplineViewer plant={plant} onUsePlant={handleUsePlant} />

          <button
            onClick={handleNextPlant}
            disabled={selectedPlantIdx === splinePlants.length - 1}
            className="cursor-pointer absolute right-10 top-1/2 -translate-y-1/2 z-10 hover:scale-125 transition-transform duration-200"
            aria-label="Next Plant"
          >
            <FaPlay className="text-yellow-300 text-2xl" />
          </button>

          <LevelBar
            level={plant.level}
            currentXp={50}
            requiredXp={1000}
            plantName={plant.plantName}
          />
        </div>

        {/* Inventory Panel */}
        <div className="flex items-center justify-end pr-12 h-full">
          <GrowInventoryPanel
            page={0}
            cardsPerPage={CARDS_PER_PAGE}
            items={plantsState}
            onUsePlant={handleUsePlant}
          />
        </div>
      </div>
    </DndProvider>
  );
}
