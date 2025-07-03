'use client';
import { useState } from 'react';

export default function FocusPage() {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showFocusTimerModal, setShowFocusTimerModal] = useState(false);

  return (
    <main className="flex-1 flex flex-col bg-[#F4F4F4] min-h-screen py-8 px-8 relative">
      <h1 className="text-3xl font-extrabold text-green-800 mb-8">Grow</h1>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
        {/* Focus Timer Card */}
        <div className="bg-[#F6FFB0] rounded-2xl shadow-lg p-8 flex-1 min-w-[320px] max-w-[420px] flex flex-col items-center" style={{ minHeight: '420px' }}>
          <h2 className="text-2xl font-bold text-[#B6C24B] mb-8">Focus Timer</h2>
          <div className="flex items-center justify-center w-full mb-8">
            <div className="rounded-full border-[12px] border-[#B6C24B] w-60 h-60 flex items-center justify-center bg-[#F6FFB0]">
              <span className="text-4xl font-bold text-[#B6C24B]">0:00</span>
            </div>
          </div>
          <button className="mt-4 bg-[#B6C24B] text-white font-bold px-12 py-2 rounded-lg shadow" style={{ width: '60%' }} onClick={() => setShowFocusTimerModal(true)}>Start</button>
        </div>
        {/* Tasks Card */}
        <div className="bg-[#F6FFB0] rounded-2xl shadow-lg p-8 flex-1 min-w-[320px] max-w-[420px] flex flex-col" style={{ minHeight: '420px' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#B6C24B]">Tasks</h2>
            <button className="bg-[#B6C24B] text-white font-bold px-4 py-1 rounded" onClick={() => setShowAddTaskModal(true)}>+ Add</button>
          </div>
          <div className="flex space-x-4 mb-6">
            <button className="bg-[#C7C97A] text-white font-bold px-4 py-1 rounded">Today</button>
            <button className="bg-[#C7C97A] text-white font-bold px-4 py-1 rounded">Upcoming</button>
            <button className="bg-[#C7C97A] text-white font-bold px-4 py-1 rounded">Overdue</button>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {[0,1,2,3].map(i => (
              <div key={i} className="bg-[#F9FFCB] rounded-md h-12 shadow" />
            ))}
          </div>
        </div>
      </div>
      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[#F6FFB0] rounded-2xl shadow-xl p-10 w-full max-w-xl flex flex-col items-center border-2 border-[#E3E7A1]">
            <h2 className="text-3xl font-bold text-[#B6C24B] mb-8">Add Task</h2>
            <form className="w-full flex flex-col gap-6">
              <div>
                <label className="block text-lg font-semibold text-[#B6C24B] mb-1">Task Name</label>
                <input type="text" className="w-full rounded-md border border-[#B6C24B] px-4 py-2 bg-[#F9FFCB] text-[#B6C24B] font-semibold focus:outline-none" />
              </div>
              <div>
                <label className="block text-lg font-semibold text-[#B6C24B] mb-1">Description</label>
                <textarea className="w-full rounded-md border border-[#B6C24B] px-4 py-2 bg-[#F9FFCB] text-[#B6C24B] font-semibold focus:outline-none" rows={3} />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-[#B6C24B] mb-1">Priority Level</label>
                  <select className="w-full rounded-md border border-[#B6C24B] px-4 py-2 bg-[#E3E7A1] text-[#B6C24B] font-semibold focus:outline-none">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-[#B6C24B] mb-1">Due Date</label>
                  <input type="date" className="w-full rounded-md border border-[#B6C24B] px-4 py-2 bg-[#F9FFCB] text-[#B6C24B] font-semibold focus:outline-none" />
                </div>
              </div>
              <button type="button" className="mt-4 bg-[#B6C24B] text-white font-bold px-10 py-2 rounded-lg mx-auto" onClick={() => setShowAddTaskModal(false)}>Add</button>
            </form>
          </div>
        </div>
      )}
      {/* Focus Timer Modal */}
      {showFocusTimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[#F6FFB0] rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center border-2 border-[#E3E7A1]">
            <h2 className="text-3xl font-bold text-[#B6C24B] mb-8">Focus Timer</h2>
            <form className="w-full flex flex-col gap-6 items-center">
              <div className="flex w-full items-center justify-between mb-2">
                <label className="text-lg font-semibold text-[#B6C24B]">Session Duration</label>
                <select className="rounded-md border border-[#B6C24B] px-4 py-1 bg-[#E3E7A1] text-[#B6C24B] font-semibold focus:outline-none">
                  <option>Custom</option>
                  <option>25:00</option>
                  <option>50:00</option>
                </select>
              </div>
              <div className="flex w-full items-center justify-between mb-2">
                <label className="text-lg font-semibold text-[#B6C24B]">Enter custom focus time</label>
                <input type="text" className="rounded-md border border-[#B6C24B] px-4 py-1 bg-[#F9FFCB] text-[#B6C24B] font-semibold focus:outline-none w-32" />
              </div>
              <button type="button" className="mt-4 bg-[#B6C24B] text-white font-bold px-10 py-2 rounded-lg mx-auto" onClick={() => setShowFocusTimerModal(false)}>Add</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
} 