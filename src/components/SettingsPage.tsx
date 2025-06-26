import React, { useState } from 'react';

export default function SettingsPage() {
  const [gameAudio, setGameAudio] = useState(true);
  const [musicAudio, setMusicAudio] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
      <form className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Game Audio</span>
          <button
            type="button"
            onClick={() => setGameAudio((v) => !v)}
            className={`w-12 h-6 flex items-center bg-gray-200 rounded-full p-1 duration-300 focus:outline-none ${gameAudio ? 'bg-green-400' : 'bg-gray-400'}`}
            aria-pressed={gameAudio}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${gameAudio ? 'translate-x-6' : ''}`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Music Audio</span>
          <button
            type="button"
            onClick={() => setMusicAudio((v) => !v)}
            className={`w-12 h-6 flex items-center bg-gray-200 rounded-full p-1 duration-300 focus:outline-none ${musicAudio ? 'bg-green-400' : 'bg-gray-400'}`}
            aria-pressed={musicAudio}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${musicAudio ? 'translate-x-6' : ''}`}
            />
          </button>
        </div>
      </form>
    </div>
  );
} 