'use client';

import React, { useEffect, useRef, useState } from 'react';
import Spline from '@splinetool/react-spline';
import LevelStars from './LevelStars';

interface PlantDetailCardProps {
  locked: boolean;
  plantName?: string;
  description?: string;
  level: number; 
  sceneUrl: string; 
}

const PlantDetailCard: React.FC<PlantDetailCardProps> = ({
  locked,
  plantName,
  description,
  level,
  sceneUrl, 
}) => {
  const splineRef = useRef<any>(null);
  const splineContainerRef = useRef<HTMLDivElement>(null);
  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    const container = splineContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleSplineLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    updateStageVisibility(1);
  };

  useEffect(() => {
    if (!splineRef.current) return;
    updateStageVisibility(currentStage);
  }, [currentStage]);

  useEffect(() => {
    setCurrentStage(1);
  }, [level]);

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

  if (locked) {
    return (
      <div className="rounded-2xl h-full flex items-center justify-center">
        <span className="text-white text-lg font-semibold">Locked</span>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Level Stars */}
      <div className="absolute -top-4 left-4 z-50">
        <LevelStars
          level={level}
          currentStage={currentStage}
          onStageChange={setCurrentStage}
          locked={false}
        />
      </div>

      {/* Borders */}
      <div
        className="absolute top-0 left-0 w-full h-full rounded-3xl z-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(to right, #7DCB45 0%, #A4DB5C 100%)' }}
      />
      <div className="absolute top-5 left-4 w-[94%] h-[87%] bg-[#73B941] rounded-4xl z-0 pointer-events-none" />

      {/* Spline Viewer */}
      <div
        ref={splineContainerRef}
        className="absolute top-5 left-4 w-[94%] h-[85%] z-50 overflow-hidden rounded-3xl shadow-md"
        style={{ overscrollBehavior: 'contain' }}
      >
        <Spline
          scene={sceneUrl} 
          onLoad={handleSplineLoad}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default PlantDetailCard;
