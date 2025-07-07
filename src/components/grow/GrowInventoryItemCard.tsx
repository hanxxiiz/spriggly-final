import React, { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';

interface GrowInventoryItemCardProps {
  item: {
    id: string | number;
    name: string;
    image?: string;
    quantity?: number;
    effect?: string;
  };
  draggable?: boolean;
  onUsePlant?: (plantId: string | number) => void;
  onClick?: () => void; // ✅ Single tap handler only
}

export default function GrowInventoryItemCard({
  item,
  draggable = true,
  onUsePlant,
  onClick,
}: GrowInventoryItemCardProps) {
  const [hideBadge, setHideBadge] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: item.effect ? 'booster' : 'plant',
item: {
  id: item.id,
  name: item.name,
  type: item.effect ? 'booster' : 'plant', // ✅ Include the type
},
    canDrag: draggable,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [item, draggable]);

  const cardRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (cardRef.current) {
      drag(cardRef.current);
    }
  }, [cardRef.current]);

  const handleMouseDown = () => setHideBadge(true);
  const handleMouseUp = () => {
    setHideBadge(false);
    setTimeout(() => onClick?.(), 50); // ✅ Trigger single tap after short delay
  };
  const handleMouseLeave = () => setHideBadge(false);

  return (
    <div
      ref={cardRef}
      className={`
        relative 
        w-[140px] h-[150px] 
        sm:w-[90px] sm:h-[110px] 
        md:w-[140px] md:h-[160px] 
        lg:w-[150px] lg:h-[180px] 
        border-4 border-white shadow-lg 
        flex flex-col items-center justify-center 
        transition-all duration-200 
        ${draggable ? 'cursor-grab' : 'cursor-default'}
        ${isDragging ? 'opacity-100 scale-95' : ''}
      `}
      style={{
        background: 'radial-gradient(circle, #E4FE62 42%, #EFE842 100%)',
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

      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2 drop-shadow"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}

      <span className="text-[#245329] font-extrabold text-sm sm:text-base text-center w-full mt-2 truncate">
        {item.name}
      </span>
    </div>
  );
}
