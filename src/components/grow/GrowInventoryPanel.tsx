import React, { useState } from 'react';
import GrowInventoryTab from './GrowInventoryTab';
import GrowInventoryEmpty from './GrowInventoryEmpty';
import GrowInventoryItemCard from './GrowInventoryItemCard';

interface GrowInventoryPanelProps {
  page: number;
  cardsPerPage: number;
  items: { id: string | number; name: string; image?: string; quantity?: number }[];
  boosters?: { id: string | number; name: string; image?: string; quantity?: number }[];
  onUsePlant?: (plantId: number | string) => void;
}

export default function GrowInventoryPanel({
  page,
  cardsPerPage,
  items,
  boosters = [],
  onUsePlant,
}: GrowInventoryPanelProps) {
  const [tab, setTab] = useState<'booster' | 'seedpack'>('seedpack');
  const [selectedItemId, setSelectedItemId] = useState<string | number | null>(null);

  const tabItems = tab === 'booster' ? boosters : items;
  const pagedItems = tabItems;

  const handleItemSelect = (itemId: string | number) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    } else {
      setSelectedItemId(itemId);
    }
  };

  const handleTabChange = (newTab: 'booster' | 'seedpack') => {
    setTab(newTab);
    setSelectedItemId(null);
  };

  return (
    <div
      className="bg-[#669524] rounded-2xl shadow-lg w-[450px] h-[600px] flex flex-col"
      style={{ minWidth: 340 }}
    >
      <div className="relative mb-6 w-full h-[70px] flex justify-center items-center flex-shrink-0">
        {/* Background Rectangle */}
        <div className="absolute inset-0 bg-[#669524] rounded-t-2xl shadow-lg" />
        <div className="absolute inset-0 bg-[#C2E76E] rounded-sm px-3 py-2 w-[295px] h-[40px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* Tab Buttons */}
        <div className="relative z-10 flex space-x-2 p-1">
          <GrowInventoryTab
            label="Booster"
            active={tab === 'booster'}
            onClick={() => handleTabChange('booster')}
          />
          <GrowInventoryTab
            label="Seed Pack"
            active={tab === 'seedpack'}
            onClick={() => handleTabChange('seedpack')}
          />
        </div>
      </div>

      <div className="ml-10 flex-1 -mt-6 overflow-hidden pr-2">
        <div
          className={`max-h-[520px] grid grid-cols-2 gap-y-5 content-start ${
            pagedItems.length > 0 ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'
          }`}
        >
          {pagedItems.length === 0 ? (
            <GrowInventoryEmpty />
          ) : (
            pagedItems.map((item, idx) => (
              <GrowInventoryItemCard
                key={item.id || idx}
                item={item}
                draggable
                onUsePlant={onUsePlant}
              />
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 16px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #F7E35B;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #F7E35B transparent;
        }
      `}</style>
    </div>
  );
}
