'use client';

import React, { useState } from 'react';
import PlantCard from '../../../components/MyPlants/PlantCard';
import PlantDetailCard from '../../../components/MyPlants/PlantDetailCard';

const plants = [
  {
    plantName: 'Bamboo',
    description: 'Leche flan leche flan leche flan leche flan leche flan.',
    locked: false,
    level: 2,
    sceneUrl: 'https://prod.spline.design/IpCgeeJ6P90fLahm/scene.splinecode', // 🎋 Bamboo
  },
  {
    plantName: 'Bulak',
    description: 'Sampaguita is blahblahblahblah jasoisdjasdojasdojasdojasdojasdjasdjasjd.',
    locked: false,
    level: 5,
    sceneUrl: 'https://prod.spline.design/7400UXKffZI7SomF/scene.splinecode', // 🌼 Another plant
  },
  {
    plantName: '',
    description: '',
    locked: true,
    level: 5,
    sceneUrl: '',
  },
  {
    plantName: '',
    description: '',
    locked: true,
    level: 5,
    sceneUrl: '',
  },
];

const MyPlantsPage = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0); // Start with the first plant open

  return (
    <div className="min-h-screen bg-white px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Left Side - Plant Detail */}
          <div className="flex flex-col" style={{ width: '550px' }}>
            <div className="flex-1 min-h-[500px]">
              {selectedIndex !== null && (
                <PlantDetailCard
                  locked={plants[selectedIndex].locked}
                  plantName={plants[selectedIndex].plantName}
                  description={plants[selectedIndex].description}
                  level={plants[selectedIndex].level}
                  sceneUrl={plants[selectedIndex].sceneUrl} // 🔥 Pass it here
                />
              )}
            </div>
          </div>

          {/* Right Side - Plant Cards */}
          <div className="flex-1">
            <h2 className="text-3xl font-black text-green-900 mb-4">Plant Collection</h2>
            <div className="flex flex-col gap-4 max-h-[550px] overflow-y-auto pr-2">
              {plants.map((plant, idx) => (
                <div key={idx} onClick={() => setSelectedIndex(idx)} className="cursor-pointer">
                  <PlantCard
                    locked={plant.locked}
                    plantName={plant.locked ? undefined : plant.plantName}
                    description={plant.locked ? undefined : plant.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPlantsPage;
