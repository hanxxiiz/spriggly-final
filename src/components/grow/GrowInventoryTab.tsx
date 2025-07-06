import React from 'react';

interface GrowInventoryTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function GrowInventoryTab({ label, active, onClick }: GrowInventoryTabProps) {
  return (
    <button
      className={`flex cursor-pointer items-center justify-center transition-all duration-150 rounded-sm
        ${active ? 'bg-[#669524] text-[#F9FFD2] font-extrabold shadow' : 'bg-transparent text-[#5B6B2B] font-extrabold'}
      `}
      onClick={onClick}
      type="button"
      style={{ minWidth: 140, minHeight: 30 }}
    >
      <span
        className={`mr-2 text-2xl ${
          active ? 'text-yellow-500 visible' : 'invisible'
        }`}
      >
        ★
      </span>
      {label}
    </button>
  );
}
