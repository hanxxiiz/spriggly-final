import React, { Ref, useState } from 'react';
import { useDrag } from 'react-dnd';

interface GrowInventoryItemCardProps {
  item: {
    id: string | number;
    name: string;
    image?: string;
    quantity?: number;
  };
  draggable?: boolean;
  onUsePlant?: (plantId: string | number) => void;
}

export default function GrowInventoryItemCard({ item, draggable, onUsePlant }: GrowInventoryItemCardProps) {
  const [hideBadge, setHideBadge] = useState(false);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'plant',
    item: { id: item.id },
    canDrag: draggable,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [item, draggable]);

  const handleMouseDown = () => setHideBadge(true);
  const handleMouseUp = () => setHideBadge(false);
  const handleMouseLeave = () => setHideBadge(false);

return (
  <div
    ref={drag as unknown as Ref<HTMLDivElement>}
    className={`relative w-42 h-50 border-6 border-white shadow-lg flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
      isDragging ? 'opacity-100 scale-95' : ''
    }`}
    style={{
      background: 'radial-gradient(circle, #E4FE62 42%, #EFE842 100%)',
      cursor: draggable ? 'grab' : 'pointer',
    }}
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
    onMouseLeave={handleMouseLeave}
  >
    {/* Quantity badge */}
    {!(isDragging || hideBadge) && item.quantity && item.quantity > 1 && (
      <span className="absolute top-2 right-2 bg-white text-black rounded-full px-2 py-1 text-xs font-bold shadow">
        {item.quantity}x
      </span>
    )}

    {/* Image (optional) */}
    {item.image && (
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-20 h-20 object-contain mb-2 drop-shadow"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    )}

    {/* Single consistent label */}
    <span className="text-l mt-35 text-[#245329] font-extrabold text-base text-center w-full">
      {item.name}
    </span>
  </div>
);


}
