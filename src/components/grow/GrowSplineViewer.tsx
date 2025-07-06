import React, { useRef, useState, useEffect } from 'react';
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
}

export default function GrowSplineViewer({ plant, onUsePlant }: GrowSplineViewerProps) {
  const splineRef = useRef<any>(null);
  const splineContainerRef = useRef<HTMLDivElement>(null);
  const [currentStage, setCurrentStage] = useState(plant.level);

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

  useEffect(() => {
    const container = splineContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

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
    className={`w-[1000px] h-[1000px] bg-[#6B6464] rounded-3xl border-2 flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
      isOver && canDrop ? 'border-yellow-300 bg-[#7a726a] shadow-2xl scale-105' : 'border-[#5a5353] shadow-lg'
    }`}
  >
    {/* Spline Viewer */}
    <div
      ref={splineContainerRef}
      className="w-full h-full overflow-hidden rounded-3xl"
      style={{ overscrollBehavior: 'contain' }}
    >
      <Spline
        scene={plant.sceneUrl}
        onLoad={handleSplineLoad}
        className="w-full h-full"
      />
    </div>

    {/* Drop indicator */}
    {isOver && canDrop && (
      <div className="absolute inset-0 bg-yellow-300 bg-opacity-20 flex items-center justify-center rounded-3xl"/>
    )}
  </div>
);

}