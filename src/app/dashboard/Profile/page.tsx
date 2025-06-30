import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();
  return (
    <main className="flex-1 flex flex-col items-center justify-start bg-[#F4F4F4] min-h-screen py-8">
      <div className="w-full max-w-5xl">
        <div className="rounded-2xl shadow-lg mb-10 p-12 bg-gradient-to-r from-green-400 via-yellow-300 to-yellow-200 flex items-end min-h-[140px]">
          <span className="text-2xl md:text-3xl font-extrabold text-white">@{session?.user?.name || 'username'}</span>
        </div>
        <div className="flex flex-wrap gap-8 justify-center">
          {['Focus Time', 'Tasks Completed', 'Plants', 'Highest Streak', 'Total Coins Earned'].map(label => (
            <div key={label} className="w-56 h-48 rounded-xl bg-yellow-200 shadow-md flex items-center justify-center">
              <span className="text-xl font-bold text-white drop-shadow-md text-center">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 