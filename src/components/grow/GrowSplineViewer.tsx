'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import Spline from '@splinetool/react-spline';

interface SplinePlant {
  plantName: string;
  description: string;
  locked: boolean;
  level: number;
  sceneUrl: string;
}

interface GrowSplineViewerProps {
  plant: SplinePlant;
  onUsePlant: (plantId: string | number) => void;
  onUseBooster: (boosterId: string | number) => void; // ✅ New
}

export default function GrowSplineViewer({
  plant,
  onUsePlant,
  onUseBooster, // ✅ Add this
}: GrowSplineViewerProps) {

  const splineRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStage, setCurrentStage] = useState(plant.level);

const [{ isOver, canDrop }, drop] = useDrop(() => ({
  accept: ['plant', 'booster'], // ✅ Accept both types

  drop: (item: { id: string | number; type?: string }) => {
    if (item.type === 'booster') {
      onUseBooster(item.id); // ✅ Handle booster drop
    } else {
      onUsePlant(item.id); // Default to plant
    }
  },

  collect: (monitor) => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
}), [onUsePlant, onUseBooster]);


  useEffect(() => {
    setCurrentStage(plant.level);
  }, [plant.level, plant.sceneUrl]);

  const handleSplineLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    updateStageVisibility(plant.level);
  };

  useEffect(() => {
    if (!splineRef.current) return;
    updateStageVisibility(currentStage);
  }, [currentStage]);

  const updateStageVisibility = (activeStage: number) => {
    for (let i = 1; i <= 5; i++) {
      const obj = splineRef.current.findObjectByName(`stage_${i}`);
      if (obj) {
        const visible = i === activeStage;
        obj.visible = visible;
        obj.children?.forEach((child: any) => (child.visible = visible));
        obj.parent?.updateMatrixWorld(true);
      }
    }
    if (splineRef.current.scene) {
      splineRef.current.scene.updateMatrixWorld(true);
    }
  };

  return (
    <div
      ref={(el) => {
        drop(el as HTMLDivElement);
        containerRef.current = el;
      }}
      className={`w-full max-w-[600px] min-h-[280px] sm:min-h-[360px] md:min-h-[420px] lg:max-h-[620px]
        relative bg-[#6B6464] rounded-xl overflow-hidden
        border-2 transition-colors duration-200
        ${isOver && canDrop ? 'border-yellow-300 bg-[#7a726a]' : 'border-[#5a5353]'}`}
    >
      <div className="absolute inset-0 w-full h-full">
        <Spline scene={plant.sceneUrl} onLoad={handleSplineLoad} className="w-full h-full" />
      </div>

      {isOver && canDrop && (
        <div className="absolute inset-0 bg-yellow-300 bg-opacity-20 flex items-center justify-center">
          <span className="text-yellow-800 font-bold text-xl">Drop to plant!</span>
        </div>
      )}
    </div>
  );
}
