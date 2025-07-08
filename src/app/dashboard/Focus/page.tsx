'use client';
import { useState, useEffect, useRef } from 'react';
import { Poppins } from "next/font/google";
import Navbar from '@/components/NavigationBar';
import SpotlightCard from '@/components/Reactbits/spotlightcard';
import Aurora from '@/components/Reactbits/aurora';
import { MdOutlineAddTask } from "react-icons/md";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

type Priority = 'high' | 'medium' | 'low';

interface Task {
  _id: string;
  taskName: string;
  description: string;
  priority: Priority;
  dueDate: string;
  completedAt?: string | Date | null;
  earnedXp: number;
  earnedCoins: number;
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
  const [taskFilter, setTaskFilter] = useState<Priority>('high');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  
  // Game states
  const [totalXP, setTotalXP] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  
  // Task form states
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('low');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Audio ref for background music
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load tasks from database
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const tasksData = await response.json();
          console.log('Loaded tasks:', tasksData);
          console.log('Total tasks loaded:', tasksData.length);
          
          // Log a few sample tasks to see their structure
          if (tasksData.length > 0) {
            console.log('Sample task:', tasksData[0]);
            console.log('Sample task completedAt:', tasksData[0].completedAt);
            console.log('Sample task completedAt type:', typeof tasksData[0].completedAt);
          }
          
          const pendingTasks = tasksData.filter((task: Task) => !task.completedAt || task.completedAt === null);
          const completedTasks = tasksData.filter((task: Task) => task.completedAt && task.completedAt !== null);
          
          console.log('Pending tasks:', pendingTasks.length);
          console.log('Completed tasks:', completedTasks.length);
          
          // Log some completed tasks to verify
          if (completedTasks.length > 0) {
            console.log('Sample completed task:', completedTasks[0]);
          }
          
          setTasks(pendingTasks);
          setFinishedTasks(completedTasks);
          
          // Calculate total earned XP and coins from completed tasks
          const totalEarnedXp = completedTasks.reduce((sum: number, task: Task) => sum + task.earnedXp, 0);
          const totalEarnedCoins = completedTasks.reduce((sum: number, task: Task) => sum + task.earnedCoins, 0);
          
          console.log('Total earned XP:', totalEarnedXp);
          console.log('Total earned coins:', totalEarnedCoins);
          
          setTotalXP(totalEarnedXp);
          setTotalCoins(totalEarnedCoins);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadTasks();
  }, []);

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
      // Calculate duration in minutes
      const durationMinutes = Math.floor(timeLeft / 60) || (isCustom ? parseInt(customTime) || 25 : parseInt(sessionDuration.split(':')[0]));
      
      // Complete focus session in database
      completeFocusSession(durationMinutes, false);
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

  const completeFocusSession = async (durationMinutes: number, surrendered: boolean) => {
    try {
      const response = await fetch('/api/focus-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          durationMinutes,
          surrendered,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSessionXP(result.earnedXp);
        setSessionCoins(result.earnedCoins);
        setTotalXP(prev => prev + result.earnedXp);
        setTotalCoins(prev => prev + result.earnedCoins);
        
        // Trigger a refresh of the Profile page data
        refreshProfileData();
      } else {
        console.error('Failed to complete focus session');
      }
    } catch (error) {
      console.error('Error completing focus session:', error);
    }
  };

  const surrenderSession = () => {
    setIsRunning(false);
    setShowFocusSession(false);
    setTimeLeft(0);
    // Stop music
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Calculate duration and complete session as surrendered
    const durationMinutes = Math.floor(timeLeft / 60) || (isCustom ? parseInt(customTime) || 25 : parseInt(sessionDuration.split(':')[0]));
    completeFocusSession(durationMinutes, true);
  };

  const addTask = async () => {
    if (!taskName.trim() || !taskDueDate) return;
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskName,
          description: taskDescription,
          priority: taskPriority,
          dueDate: taskDueDate,
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [...prev, newTask].sort((a, b) => {
          const priorityOrder: Record<Priority, number> = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityOrder[b.priority as Priority] - priorityOrder[a.priority as Priority];
        }));
        
        // Reset form
        setTaskName('');
        setTaskDescription('');
        setTaskPriority('low');
        setTaskDueDate('');
        setShowAddTaskModal(false);
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const completeTask = async (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;
    
    try {
      const response = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });

      if (response.ok) {
        const result = await response.json();
        
        setTasks(prev => prev.filter(t => t._id !== taskId));
        setFinishedTasks(prev => [...prev, { 
          ...task, 
          completedAt: new Date().toISOString(),
          earnedXp: result.earnedXp,
          earnedCoins: result.earnedCoins
        }]);
        
        setSessionXP(result.earnedXp);
        setSessionCoins(result.earnedCoins);
        setTotalXP(prev => prev + result.earnedXp);
        setTotalCoins(prev => prev + result.earnedCoins);
        setShowCompletionModal(true);
        
        // Trigger a refresh of the Profile page data
        refreshProfileData();
      } else {
        console.error('Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  // Function to refresh Profile page data
  const refreshProfileData = () => {
    // Dispatch a custom event that the Profile page can listen to
    window.dispatchEvent(new CustomEvent('taskCompleted'));
  };

  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

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
      completeTask(draggedTask._id);
      setDraggedTask(null);
    }
    setIsDragging(false)
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'high': return 'bg-[#245329]';
      case 'medium': return 'bg-[#669524]';
      case 'low': return 'bg-[#B1E064]';
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
    <>
      <Navbar />
      <main className={`${poppins.className} flex-1 flex flex-col bg-white min-h-screen pt-18 py-4 px-2 sm:px-4 md:px-8 lg:px-12 xl:px-24 2xl:px-48 relative`}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-4 sm:mb-5">Focus</h1>
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 justify-center items-start w-full">
          {/* FOCUS CARD */}
          <div className="bg-[#63d471] rounded-2xl lg:rounded-[50px] shadow-lg p-5 sm:p-8 md:p-10 lg:p-12 flex-1 flex flex-col items-center min-h-[400px] md:min-h-[530px] lg:min-h-[630px] w-full max-w-full lg:max-w-[700px] xl:max-w-[900px] 2xl:max-w-[1100px] mx-auto"
            style={{ background: 'linear-gradient(to top right, #63d471, #233329)' }}
          >
            <SpotlightCard className="w-full rounded-[15px] py-10 lg:py-14 lg:rounded-[40px] min-h-[200px] md:min-h-[300px] lg:min-h-[350px]"
              spotlightColor="rgba(227, 252, 0, 0.26)" 
            >
              <div className="flex flex-col items-center justify-center text-center text-xs font-semibold lg:text-base">
                <div className="text-[#e4fe62] ">The next leaf awaits</div>
                <img src="/focus-img-one.png" alt="Decorative leaf" className="w-32 sm:w-44 md:w-52 lg:w-72 xl:w-96 h-auto" />
                <div className="text-[#e4fe62] ">Begin your focus journey now</div>
              </div>
            </SpotlightCard>
            <button 
              className="mt-4 sm:mt-6 w-24 sm:w-32 md:w-40 h-10 md:h-12 text-[#245329] font-bold text-base rounded-full drop-shadow-lg border-none cursor-pointer bg-[#e4fe62] shadow-sm hover:scale-105 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-transform duration-300 ease-in-out"
              onClick={() => setShowFocusTimerModal(true)}
            >
              Start
            </button>
          </div>

          {/* TASKS AND FINISHED TASKS */}
          <div className="flex flex-col gap-4 md:gap-6 flex-1 w-full max-w-full lg:max-w-[400px] xl:max-w-[500px] 2xl:max-w-[600px] mx-auto">
            {/* TASKS CARD */}
            <div className="bg-[#E4FE62] rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 flex flex-col h-[350px] sm:h-[400px] md:h-[450px] min-w-0 w-full">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#AFB846]">Tasks</h2>
                <button 
                  className="text-white font-bold px-3 sm:px-5 py-1 text-xs md:text-lg rounded-full drop-shadow-lg border-none cursor-pointer bg-[#9E1F1F] shadow-sm hover:scale-105 hover:bg-red-600 transition-transform duration-300 ease-in-out" 
                  onClick={() => setShowAddTaskModal(true)}
                >
                  +Add
                </button>
              </div>
              <div className="flex w-full gap-1 sm:gap-2 mb-2 sm:mb-3">
                {(['high', 'medium', 'low'] as Priority[]).map(filter => (
                  <button 
                    key={filter}
                    className={`flex-1 py-1 sm:py-2 text-xs md:text-sm rounded-lg font-semibold transition-colors cursor-pointer ${
                      taskFilter === filter 
                        ? getPriorityColor(filter) + ' text-white' 
                        : 'bg-[#AFB846] text-gray-700 hover:scale-105 transition-transform duration-300 ease-in-out'
                    }`}
                    onClick={() => setTaskFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 flex-1 overflow-y-auto">
                {getFilteredTasks().map(task => {
                  const isExpanded = expandedTaskId === task._id;

                  return (
                    <div 
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onClick={() => setExpandedTaskId(prev => (prev === task._id ? null : task._id))}
                      className="bg-white rounded-lg px-3 sm:px-4 py-2 border-2 border-gray-200 cursor-pointer hover:shadow-md transition-shadow max-w-full"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <input 
                          type="checkbox"
                          className="w-4 h-4 text-green-600 bg-white border-2 border-gray-300 rounded focus:ring-green-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            completeTask(task._id);
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-xs md:text-lg text-green-800">{task.taskName}</div>
                          <div className="text-[8px] md:text-[10px] text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-2 pl-6 sm:pl-8 pr-2 text-xs md:text-sm text-gray-700 whitespace-normal break-words">
                          <p>{task.description || <span className="italic text-gray-400">No description provided.</span>}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {getFilteredTasks().length === 0 && (
                  <div className="text-center text-[#AFB846] py-6 sm:py-8 flex flex-col items-center justify-center gap-2">
                    <span>No {taskFilter} priority tasks</span>
                    <MdOutlineAddTask size={100} className="text-[#AFB846]" />
                  </div>
                )}
              </div>
            </div>

            {/* FINISHED TASKS CARD*/}
            <div
              className={`rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 flex flex-col max-h-[120px] sm:max-h-[150px] md:max-h-[180px] min-w-0 w-full ${isDragging ? 'transition-transform duration-300 ease-in-out scale-105 bg-yellow-300' : 'bg-[#E4FE62]'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#AFB846]">Finished Tasks</h2>
              <div className="text-4xl sm:text-5xl md:text-7xl font-bold text-green-800">{finishedTasks.length}</div>
              <div className="text-xs md:text-sm text-green-700">
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
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
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
    </>
  );
}