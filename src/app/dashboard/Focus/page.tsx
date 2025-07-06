'use client';
import { useState, useEffect, useRef } from 'react';
import { Poppins } from "next/font/google";
import SpotlightCard from '@/components/Reactbits/spotlightcard';
import Aurora from '@/components/Reactbits/aurora';
import { MdOutlineAddTask } from "react-icons/md";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

type Priority = 'High' | 'Medium' | 'Low';

interface Task {
  id: number;
  name: string;
  description: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
}

export default function FocusPage() {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showFocusTimerModal, setShowFocusTimerModal] = useState(false);
  const [showFocusSession, setShowFocusSession] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Timer states
  const [sessionDuration, setSessionDuration] = useState('25:00');
  const [customTime, setCustomTime] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Task states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [finishedTasks, setFinishedTasks] = useState<Task[]>([]);
  const [taskFilter, setTaskFilter] = useState('High');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  
  // Game states
  const [totalXP, setTotalXP] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  
  // Task form states
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('Low');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Audio ref for background music
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = 0.9;
    
    // Generate a simple ambient tone using Web Audio API
    const createAmbientTone = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      return { oscillator, audioContext, gainNode };
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0 && !isPaused) {
    interval = setInterval(() => {
      setTimeLeft(prev => Math.max(prev - 1, 0));
    }, 1000);

    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setShowFocusSession(false);
      setShowCompletionModal(true);
      // Stop music
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Award XP and coins for completing focus session
      const earnedXP = Math.floor(sessionDuration === '25:00' ? 25 : sessionDuration === '50:00' ? 50 : parseInt(customTime) || 25);
      const earnedCoins = Math.floor(earnedXP / 5);
      setSessionXP(earnedXP);
      setSessionCoins(earnedCoins);
      setTotalXP(prev => prev + earnedXP);
      setTotalCoins(prev => prev + earnedCoins);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, sessionDuration, customTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startFocusSession = () => {
    let duration;
    if (isCustom) {
      const customMinutes = customTime ? parseInt(customTime) : 25;
      duration = (customMinutes > 0 ? customMinutes : 25) * 60;
    } else {
      const [mins] = sessionDuration.split(':');
      duration = parseInt(mins) * 60;
    }
    
    setTimeLeft(duration);
    setIsRunning(true);
    setIsPaused(false); 
    setShowFocusTimerModal(false);
    setShowFocusSession(true);
    
    if (musicEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const timerEffect = () => {
    let interval = null;
    if (isRunning && timeLeft > 0 && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = Math.max(prev - 1, 0);
          console.log('Time left:', newTime); 
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setShowFocusSession(false);
      setShowCompletionModal(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const earnedXP = Math.floor(sessionDuration === '25:00' ? 25 : sessionDuration === '50:00' ? 50 : parseInt(customTime) || 25);
      const earnedCoins = Math.floor(earnedXP / 5);
      setSessionXP(earnedXP);
      setSessionCoins(earnedCoins);
      setTotalXP(prev => prev + earnedXP);
      setTotalCoins(prev => prev + earnedCoins);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  };

  const surrenderSession = () => {
    setIsRunning(false);
    setShowFocusSession(false);
    setTimeLeft(0);
    // Stop music
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const addTask = () => {
    if (!taskName.trim() || !taskDueDate) return;
    
    const newTask: Task = {
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      priority: taskPriority,
      dueDate: taskDueDate,
      completed: false
    };
    
    setTasks(prev => [...prev, newTask].sort((a, b) => {
      const priorityOrder: Record<Priority, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }));
    
    // Reset form
    setTaskName('');
    setTaskDescription('');
    setTaskPriority('Low');
    setTaskDueDate('');
    setShowAddTaskModal(false);
  };

  const completeTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setFinishedTasks(prev => [...prev, { ...task, completed: true }]);
    
    // Award XP and coins
    const earnedXP = task.priority === 'High' ? 15 : task.priority === 'Medium' ? 10 : 5;
    const earnedCoins = Math.floor(earnedXP / 3);
    setSessionXP(earnedXP);
    setSessionCoins(earnedCoins);
    setTotalXP(prev => prev + earnedXP);
    setTotalCoins(prev => prev + earnedCoins);
    setShowCompletionModal(true);
  };

  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true)
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setIsDragging(false)
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedTask) {
      completeTask(draggedTask.id);
      setDraggedTask(null);
    }
    setIsDragging(false)
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'High': return 'bg-[#245329]';
      case 'Medium': return 'bg-[#669524]';
      case 'Low': return 'bg-[#B1E064]';
      default: return 'bg-green-400';
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => task.priority === taskFilter);
  };

  const [showConfirmExitModal, setShowConfirmExitModal] = useState(false);

  if (showFocusSession) {
  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#06231d]">
        <Aurora
          colorStops={["#076653", "#e3ef26", "#e2fbce"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className={`${poppins.className} fixed inset-0 flex flex-col items-center justify-center z-50`}>
        <div className="text-center">
          <div className="mb-8 lg:mb-10">
            <span className="text-8xl lg:text-[300px] font-bold text-white">
              {formatTime(timeLeft)}
            </span>
          </div>
          <button
            onClick={() => {
              setShowConfirmExitModal(true);
              setIsPaused(true); 
            }}
            className="bg-white/5 backdrop-blur-sm hover:bg-white/10 text-[#E4FE62] text-xs lg:text-base font-bold px-10 lg:px-15 py-2 lg:py-3 rounded-full border border-white transition-all duration-300 shadow-md"
          >
            Surrender →
          </button>
        </div>
      </div>

      {showConfirmExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70">
          <div className="bg-[#F4FFB7] rounded-3xl shadow-xl m-10 p-10 w-full max-w-xl flex flex-col items-center">
            <h2 className="text-xl lg:text-[35px] font-bold text-[#AFB846] mb-2 lg:mb-4">Surrender</h2>
            <p className="text-xs lg:text-xl text-[#245329] text-center mb-6">
              Are you sure you want end the session?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowConfirmExitModal(false);
                  surrenderSession(); 
                }}
                className="text-white font-bold px-5 py-1 text-xs lg:text-lg lg:px-10 lg:py-2 rounded-full drop-shadow-lg border-none cursor-pointer 
                      bg-[#9E1F1F] shadow-sm
                      hover:scale-105 hover:bg-red-600
                      transition-transform duration-300 ease-in-out" 
              >
                Yes, end it
              </button>
              <button
                onClick={() => {
                  setShowConfirmExitModal(false);
                  setIsPaused(false);
                }}
                className="flex-1 text-white font-bold px-5 py-1 text-[10px] lg:text-lg lg:px-10 lg:py-2 rounded-full drop-shadow-lg border-none cursor-pointer 
                      bg-[#AFB846] shadow-sm
                      hover:scale-105 
                      transition-transform duration-300 ease-in-out" 
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

  return (
    <main className={`${poppins.className} flex-1 flex flex-col bg-white min-h-screen py-8 px-8 relative`}>
      <h1 className="text-4xl font-bold text-green-800 mb-5">Focus</h1>
      <div className="flex flex-col lg:flex-row gap-5 justify-center items-start">

        {/* FOCUS CARD */}
        <div className="bg-[#63d471] rounded-[25px] lg:rounded-[50px] shadow-lg p-10 md:p-15 lg:p-15 flex-1 flex flex-col items-center 
          min-h-[530px] md:min-h-[630px] lg:min-h-[630px]
          min-w-[300px] lg:min-w-[1000px]"
          style={{
          background: 'linear-gradient(to top right, #63d471, #233329)',
          }}
        >
          <SpotlightCard className="w-full rounded-[15px] ] py-25 lg:py-10 lg:rounded-[40px] min-h-[400px] md:min-h-[450px] lg:min-h-[450px]"
            spotlightColor="rgba(227, 252, 0, 0.26)" 
          >
            <div className="flex flex-col items-center justify-center text-center text-xs font-semibold lg:text-base">
              <div className="text-[#e4fe62] ">
                The next leaf awaits
              </div>
              <img
                src="/focus-img-one.png"
                alt="Decorative leaf"
                className="w-52 lg:w-85 h-auto"
              />
              <div className="text-[#e4fe62] ">
                Begin your focus journey now
              </div>
            </div>
          </SpotlightCard>
          <button 
            className="mt-5 w-30 lg:w-40 h-10 lg:h-12 text-[#245329] font-bold text-[16px] rounded-full drop-shadow-lg border-none cursor-pointer 
                      bg-[#e4fe62] shadow-sm
                      hover:scale-105 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                      transition-transform duration-300 ease-in-out"
            onClick={() => setShowFocusTimerModal(true)}
          >
            Start
          </button>
        </div>

        {/* TASKS AND FINISHED TASKS */}
        <div className="flex flex-col gap-5 flex-1">
          {/* TASKS CARD */}
          <div className="bg-[#E4FE62] rounded-3xl shadow-lg p-5   flex flex-col h-[450px] min-w-[300px] lg:min-w-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl lg:text-2xl font-bold text-[#AFB846]">Tasks</h2>
              <button 
                className="text-white font-bold px-5 py-1 text-xs lg:text-lg lg:px-10 lg:py-2 rounded-full drop-shadow-lg border-none cursor-pointer 
                      bg-[#9E1F1F] shadow-sm
                      hover:scale-105 hover:bg-red-600
                      transition-transform duration-300 ease-in-out" 
                onClick={() => setShowAddTaskModal(true)}
              >
                +Add
              </button>
            </div>
            <div className="flex w-full gap-2 mb-3">
              {['High', 'Medium', 'Low'].map(filter => (
                <button 
                  key={filter}
                  className={`flex-1 py-1 text-xs lg:py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                    taskFilter === filter 
                      ? getPriorityColor(filter as Priority) + ' text-white' 
                      : 'bg-[#AFB846] text-gray-700 hover:scale-105 transition-transform duration-300 ease-in-out'
                  }`}
                  onClick={() => setTaskFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
              {getFilteredTasks().map(task => {
                const isExpanded = expandedTaskId === task.id;

                return (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onClick={() => setExpandedTaskId(prev => (prev === task.id ? null : task.id))}
                    className="bg-white rounded-lg px-4 py-2 border-2 border-gray-200 cursor-pointer hover:shadow-md transition-shadow max-w-[260] lg:max-w-[390px]"
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 text-green-600 bg-white border-2 border-gray-300 rounded focus:ring-green-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          completeTask(task.id);
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-xs lg:text-lg text-green-800">{task.name}</div>
                        <div className="text-[8px] lg:text-[10px] text-gray-500">Due: {task.dueDate}</div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-2 pl-8 pr-2 text-xs lg:text-sm text-gray-700 whitespace-normal break-words">
                        <p>{task.description || <span className="italic text-gray-400">No description provided.</span>}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {getFilteredTasks().length === 0 && (
                <div className="text-center text-[#AFB846] py-8 flex flex-col items-center justify-center gap-2">
                  <span>No {taskFilter.toLowerCase()} priority tasks</span>
                  <MdOutlineAddTask size={200} className="text-[#AFB846]" />
                </div>
              )}
            </div>
          </div>

          {/* FINISHED TASKS CARD*/}
          <div
            className={`rounded-3xl shadow-lg p-5 sm:p-6 md:p-7 flex flex-col max-h-[180px] min-w-[300px] lg:min-w-[400px] 
              ${isDragging ? 'transition-transform duration-300 ease-in-out scale-105 bg-yellow-300' : 'bg-[#E4FE62]'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h2 className="text-xl lg:text-2xl font-bold text-[#AFB846]">Finished Tasks</h2>
            <div className="text-7xl font-bold text-green-800">{finishedTasks.length}</div>
            <div className="text-xs lg:text-sm text-green-700">
              <div className="flex justify-between items-center">
                <span>XP:</span>
                <span className="font-bold">{totalXP}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Coins:</span>
                <span className="font-bold">{totalCoins}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*ADD TASK MODAL*/}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70">
          <div className="bg-[#F4FFB7] rounded-3xl shadow-xl m-10 p-10 w-full max-w-xl flex flex-col items-center">
            <h2 className="text-xl lg:text-3xl font-bold text-[#245329] mb-4 lg:mb-8">Add Task</h2>
            <div className="w-full flex flex-col gap-1 lg:gap-5">
              <div>
                <label className="block text-xs lg:text-lg font-semibold text-[#245329] mb-1">Task Name *</label>
                <input 
                  type="text" 
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full rounded-md border-2 border-[#AFB846] px-2 py-1 lg:px-4 lg:py-2 bg-white text-xs lg:text-lg text-green-800 font-normal focus:outline-none focus:ring-2 focus:ring-[#AFB846]" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs lg:text-lg font-semibold text-[#245329] mb-1">Description</label>
                <textarea 
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full rounded-md border-2 border-[#AFB846] px-2 py-1 lg:px-4 lg:py-2 bg-white text-xs lg:text-lg text-[#245329] font-normal focus:outline-none focus:ring-2 focus:ring-[#AFB846]" 
                  rows={3} 
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs lg:text-lg font-semibold text-[#245329] mb-1">Priority Level</label>
                  <select 
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full rounded-md border-2 border-[#AFB846] px-2 py-1 lg:px-4 lg:py-2 bg-white text-xs lg:text-lg text-[#245329] font-normal focus:outline-none focus:ring-2 focus:ring-[#AFB846]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs lg:text-lg font-semibold text-[#245329] mb-1">Due Date *</label>
                  <input 
                    type="date" 
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full rounded-md border-2 border-[#AFB846] px-2 py-1 lg:px-4 lg:py-2 bg-white text-xs lg:text-lg text-[#245329] font-normal focus:outline-none focus:ring-2 focus:ring-[#AFB846]" 
                    required
                  />
                </div>
              </div>
              <div className="flex gap-1 mt-3 lg:mt-1 lg:gap-4">
                <button 
                  type="button" 
                  className="flex-1 text-white font-bold px-5 py-1 text-[10px] lg:text-lg lg:px-10 lg:py-2 rounded-full drop-shadow-lg border-none cursor-pointer 
                      bg-[#9E1F1F] shadow-sm
                      hover:scale-105 hover:bg-red-600
                      transition-transform duration-300 ease-in-out"  
                  onClick={addTask}
                  disabled={!taskName.trim() || !taskDueDate}
                >
                  Add Task
                </button>
                <button 
                  type="button" 
                  className="flex-1 text-white font-bold px-5 py-1 text-[10px] lg:text-lg lg:px-10 lg:py-2 rounded-full drop-shadow-lg border-none cursor-pointer 
                      bg-[#AFB846] shadow-sm
                      hover:scale-105 
                      transition-transform duration-300 ease-in-out"  
                  onClick={() => setShowAddTaskModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Focus Timer Modal */}
      {showFocusTimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70">
          <div className="bg-[#F4FFB7] rounded-3xl lg:rounded-[50px] shadow-xl m-10 p-10 lg:p-20 w-full max-w-xl flex flex-col items-center">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-right pr-4 align-middle">
                    <label className="block text-xs lg:text-lg font-semibold text-[#245329] mb-3 lg:mb-5">Duration</label>
                  </td>
                  <td className="text-left">
                    <select
                      value={isCustom ? 'Custom' : sessionDuration}
                      onChange={(e) => {
                        if (e.target.value === 'Custom') {
                          setIsCustom(true);
                          setCustomTime(''); // Reset custom time when switching to custom
                        } else {
                          setIsCustom(false);
                          setSessionDuration(e.target.value);
                          setCustomTime(''); // Clear custom time when switching to preset
                        }
                      }}
                      className="mb-3 lg:mb-5 w-full rounded-md border-2 border-[#AFB846] px-2 py-1 lg:px-4 lg:py-2 bg-white text-xs lg:text-lg text-[#245329] font-normal focus:outline-none focus:ring-2 focus:ring-[#AFB846]"
                    >
                      <option value="25:00">25:00</option>
                      <option value="45:00">45:00</option>
                      <option value="60:00">60:00</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="text-right pr-4 align-middle">
                    <label className="block text-xs lg:text-lg font-semibold text-[#245329] mb-3 lg:mb-5">Custom</label>
                  </td>
                  <td className="text-left">
                    <input
                      type="number"
                      value={customTime}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (isNaN(val) || val < 1) {
                          setCustomTime(''); 
                        } else {
                          setCustomTime(e.target.value);
                        }
                      }}
                      onBlur={() => {
                        if (isCustom && (!customTime || parseInt(customTime) < 1)) {
                          setCustomTime('1');
                        }
                      }}
                      min={1}
                      disabled={!isCustom}
                      placeholder="Minutes"
                      className="mb-3 lg:mb-5 w-full rounded-md border-2 border-[#AFB846] px-2 py-1 lg:px-4 lg:py-2 bg-white text-xs lg:text-lg text-[#245329] font-normal focus:outline-none focus:ring-2 focus:ring-[#AFB846] disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="text-right pr-4 align-middle">
                    <label className="block text-xs lg:text-lg font-semibold text-[#245329] mb-1">Music</label>
                  </td>
                  <td className="text-left">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="mb-3 lg:mb-5 sr-only peer"
                        checked={musicEnabled}
                        onChange={() => setMusicEnabled(!musicEnabled)}
                      />
                      <div className="peer rounded-full outline-none duration-100 after:duration-500 h-7 w-28 lg:h-10 bg-[#245329]
                        peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#245329] after:text-xs lg:after:text-lg after:content-['ON'] after:absolute 
                        after:outline-none after:rounded-full after:h-5 after:w-12 lg:after:h-8 after:bg-white after:top-1 after:left-1 
                        after:flex after:justify-center after:items-center after:text-[#245329] after:font-bold peer-checked:after:translate-x-14 
                        peer-checked:after:content-['OFF'] peer-checked:after:border-white">
                      </div>
                    </label>
                  </td>
                </tr>

              </tbody>
            </table>
            <div className="flex gap-1 mt-3 lg:mt-7 lg:gap-4">
              <button
                type="button"
                className="flex-1 text-white font-bold px-5 py-1 text-[10px] lg:text-lg lg:px-10 lg:py-2 rounded-full drop-shadow-lg border-none cursor-pointer 
                      bg-[#9E1F1F] shadow-sm
                      hover:scale-105 hover:bg-red-600
                      transition-transform duration-300 ease-in-out" 
                onClick={startFocusSession}
              >
                Start
              </button>
              <button 
                  type="button" 
                  className="flex-1 text-white font-bold px-5 py-1 text-[10px] lg:text-lg lg:px-10 lg:py-2 rounded-full drop-shadow-lg border-none cursor-pointer 
                      bg-[#AFB846] shadow-sm
                      hover:scale-105 
                      transition-transform duration-300 ease-in-out"  
                  onClick={() => setShowFocusTimerModal(false)}
                >
                  Cancel
                </button>
            </div>
          </div>
        </div>
      )}


      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70">
          <SpotlightCard
            className="p-10 w-[250px] lg:w-[500px] h-[200px] lg:h-[400px] 
                      lg:rounded-[50px] bg-[#245329]/70 lg:rounded-[40px]
                      flex flex-col items-center justify-center text-center"
            spotlightColor="rgba(227, 252, 0, 0.26)"
          >
            <h1 className="text-base lg:text-[35px] mb-1  font-bold text-[#e4fe62]">
              Congratulations
            </h1>
            <div className="mb-6">
              <div className="text-xs lg:text-lg text-white mb-2">You earned:</div>
              <div className="text-sm lg:text-[30px] font-bold text-yellow-300">+{sessionXP} XP</div>
              <div className="text-sm lg:text-[30px] font-bold text-yellow-300">+{sessionCoins} Coins</div>
            </div>
            <button
              className="w-30 lg:w-60 lg:p-4 p-2 text-[#245329] font-bold text-xs lg:text-[16px] rounded-full drop-shadow-lg border-none cursor-pointer 
                      bg-[#e4fe62] shadow-sm
                      hover:scale-105 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                      transition-transform duration-300 ease-in-out"
              onClick={() => setShowCompletionModal(false)}
            >
              Continue
            </button>
          </SpotlightCard>
        </div>
      )}
    </main>
  );
}