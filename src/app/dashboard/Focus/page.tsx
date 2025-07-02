'use client';
import { useState, useRef, useEffect } from 'react';

// Task type
interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  finishing: boolean;
}

export default function FocusPage() {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showFocusTimerModal, setShowFocusTimerModal] = useState(false);
  const [sessionDuration, setSessionDuration] = useState('Custom');
  const [customDuration, setCustomDuration] = useState('');
  const [focusSessionActive, setFocusSessionActive] = useState(false);
  const [focusTimeLeft, setFocusTimeLeft] = useState(0); // in seconds
  const [xpCollected, setXpCollected] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [finishedCount, setFinishedCount] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsReward, setCongratsReward] = useState({ xp: 0, coins: 0 });

  // Add Task Modal state
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Low');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Helper to parse duration string (e.g., '25:00') to seconds
  function parseDuration(duration: string) {
    if (/^\d{1,2}:\d{2}$/.test(duration)) {
      const [min, sec] = duration.split(':').map(Number);
      return min * 60 + sec;
    }
    // fallback: try to parse as minutes
    const asNum = parseInt(duration, 10);
    if (!isNaN(asNum)) return asNum * 60;
    return 0;
  }

  // Start focus session
  function startFocusSession() {
    let seconds = 0;
    if (sessionDuration === 'Custom') {
      seconds = parseDuration(customDuration);
    } else {
      seconds = parseDuration(sessionDuration);
    }
    if (seconds > 0) {
      setFocusTimeLeft(seconds);
      setFocusSessionActive(true);
      setShowFocusTimerModal(false);
    }
  }

  // Timer effect
  useEffect(() => {
    if (!focusSessionActive) return;
    if (focusTimeLeft <= 0) {
      setFocusSessionActive(false);
      // Award XP/coins (placeholder logic)
      setXpCollected(xpCollected + 10);
      setCoinsCollected(coinsCollected + 5);
      return;
    }
    timerRef.current = setTimeout(() => {
      setFocusTimeLeft(focusTimeLeft - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [focusSessionActive, focusTimeLeft]);

  // Format seconds as mm:ss
  function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // Surrender handler
  function handleSurrender() {
    setFocusSessionActive(false);
    setFocusTimeLeft(0);
  }

  // Add Task handler
  function handleAddTask() {
    if (!taskName.trim() || !taskDueDate) return;
    setTasks([
      ...tasks,
      {
        id: Math.random().toString(36).slice(2),
        name: taskName,
        description: taskDescription,
        priority: taskPriority,
        dueDate: taskDueDate,
        finishing: false,
      },
    ]);
    setShowAddTaskModal(false);
    setTaskName('');
    setTaskDescription('');
    setTaskPriority('Low');
    setTaskDueDate('');
  }

  // Finish Task handler
  function handleFinishTask(id: string) {
    setTasks(tasks =>
      tasks.map(t =>
        t.id === id ? { ...t, finishing: true } : t
      )
    );
    // After animation, remove and show congrats
    setTimeout(() => {
      setTasks(tasks => tasks.filter(t => t.id !== id));
      setFinishedCount(c => c + 1);
      setXpCollected(xp => xp + 7); // Example reward
      setCoinsCollected(c => c + 3);
      setCongratsReward({ xp: 7, coins: 3 });
      setShowCongrats(true);
    }, 500); // Animation duration
  }

  return (
    <main className="flex-1 flex flex-col bg-[#F4F4F4] min-h-screen py-8 px-8 relative">
      {/* Full-screen Focus Session Overlay */}
      {focusSessionActive && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#E3E7A1]">
          {/* Placeholder Spriggly Icon */}
          <div className="mb-8">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="40" cy="60" rx="20" ry="10" fill="#B6C24B" />
              <rect x="35" y="30" width="10" height="30" rx="5" fill="#7A9B3A" />
              <path d="M40 30 Q30 20 40 10 Q50 20 40 30 Z" fill="#B6C24B" />
            </svg>
          </div>
          {/* Timer */}
          <div className="text-6xl font-extrabold text-[#7A9B3A] mb-8">{formatTime(focusTimeLeft)}</div>
          {/* Surrender Button */}
          <button
            className="mb-8 bg-red-400 hover:bg-red-500 text-white font-bold px-10 py-3 rounded-lg shadow"
            onClick={handleSurrender}
          >
            Surrender
          </button>
          {/* XP and Coins */}
          <div className="flex gap-8 text-2xl font-bold text-[#7A9B3A]">
            <div>XP: {xpCollected}</div>
            <div>Coins: {coinsCollected}</div>
          </div>
        </div>
      )}
      {/* Hide rest of UI if focus session is active */}
      {!focusSessionActive && (
        <>
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
                {tasks.length === 0 && (
                  <div className="text-[#B6C24B] text-center">No tasks yet.</div>
                )}
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`bg-[#F9FFCB] rounded-md h-auto shadow p-3 flex items-center justify-between transition-opacity duration-500 ${task.finishing ? 'opacity-0' : 'opacity-100'}`}
                  >
                    <div>
                      <div className="font-bold text-[#7A9B3A]">{task.name}</div>
                      <div className="text-xs text-[#B6C24B]">Due: {task.dueDate}</div>
                      <div className="text-xs text-[#B6C24B]">Priority: {task.priority}</div>
                      {task.description && <div className="text-xs text-[#B6C24B]">{task.description}</div>}
                    </div>
                    <button
                      className="ml-4 bg-green-400 hover:bg-green-500 text-white font-bold px-4 py-2 rounded"
                      onClick={() => handleFinishTask(task.id)}
                      disabled={task.finishing}
                    >
                      ✓
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-[#7A9B3A] font-bold">Finished: {finishedCount}</div>
            </div>
          </div>
        </>
      )}
      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[#F6FFB0] rounded-2xl shadow-xl p-10 w-full max-w-xl flex flex-col items-center border-2 border-[#E3E7A1]">
            <h2 className="text-3xl font-bold text-[#B6C24B] mb-8">Add Task</h2>
            <form className="w-full flex flex-col gap-6" onSubmit={e => { e.preventDefault(); handleAddTask(); }}>
              <div>
                <label className="block text-lg font-semibold text-[#B6C24B] mb-1">Task Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full rounded-md border border-[#B6C24B] px-4 py-2 bg-[#F9FFCB] text-[#B6C24B] font-semibold focus:outline-none"
                  value={taskName}
                  onChange={e => setTaskName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-[#B6C24B] mb-1">Description</label>
                <textarea
                  className="w-full rounded-md border border-[#B6C24B] px-4 py-2 bg-[#F9FFCB] text-[#B6C24B] font-semibold focus:outline-none"
                  rows={3}
                  value={taskDescription}
                  onChange={e => setTaskDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-[#B6C24B] mb-1">Priority Level</label>
                  <select
                    className="w-full rounded-md border border-[#B6C24B] px-4 py-2 bg-[#E3E7A1] text-[#B6C24B] font-semibold focus:outline-none"
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-[#B6C24B] mb-1">Due Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-[#B6C24B] px-4 py-2 bg-[#F9FFCB] text-[#B6C24B] font-semibold focus:outline-none"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 bg-[#B6C24B] text-white font-bold px-10 py-2 rounded-lg mx-auto"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Congratulatory Modal */}
      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col items-center border-2 border-[#E3E7A1]">
            <h2 className="text-3xl font-bold text-[#7A9B3A] mb-4">Congratulations! 🎉</h2>
            <div className="text-lg text-[#B6C24B] mb-4">You finished a task!</div>
            <div className="text-xl font-bold text-[#7A9B3A] mb-2">+{congratsReward.xp} XP</div>
            <div className="text-xl font-bold text-[#7A9B3A] mb-6">+{congratsReward.coins} Coins</div>
            <button
              className="bg-[#B6C24B] text-white font-bold px-8 py-2 rounded-lg"
              onClick={() => setShowCongrats(false)}
            >
              Close
            </button>
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
                <select
                  className="rounded-md border border-[#B6C24B] px-4 py-1 bg-[#E3E7A1] text-[#B6C24B] font-semibold focus:outline-none"
                  value={sessionDuration}
                  onChange={e => setSessionDuration(e.target.value)}
                >
                  <option>Custom</option>
                  <option>25:00</option>
                  <option>50:00</option>
                </select>
              </div>
              <div className="flex w-full items-center justify-between mb-2">
                <label className="text-lg font-semibold text-[#B6C24B]">Enter custom focus time</label>
                <input
                  type="text"
                  className={`rounded-md border border-[#B6C24B] px-4 py-1 bg-[#F9FFCB] text-[#B6C24B] font-semibold focus:outline-none w-32 ${sessionDuration !== 'Custom' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  value={customDuration}
                  onChange={e => setCustomDuration(e.target.value)}
                  disabled={sessionDuration !== 'Custom'}
                />
              </div>
              <button
                type="button"
                className="mt-4 bg-[#B6C24B] text-white font-bold px-10 py-2 rounded-lg mx-auto"
                onClick={startFocusSession}
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
} 