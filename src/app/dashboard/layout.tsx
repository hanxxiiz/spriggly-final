import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
        <header>
            <div className="flex items-center space-x-2">
                <img src="/globe.svg" alt="Spriggly Logo" className="h-8 w-8" />
                <span className="text-2xl font-bold text-green-800">Spriggly</span>
              </div>
            {/* Static Navigation Bar */}
            <nav className="flex-1 flex justify-center">
                <ul className="flex space-x-8 text-green-800 font-medium">
                <li><Link href="/dashboard" className="hover:underline bg-transparent">Home</Link></li>
                <li><Link href="/dashboard?tab=grow" className="hover:underline bg-transparent">Grow</Link></li>
                <li><Link href="/dashboard?tab=focus" className="hover:underline bg-transparent">Focus</Link></li>
                <li><Link href="/dashboard?tab=plants" className="hover:underline bg-transparent">My Plants</Link></li>
                <li><Link href="/dashboard/shop" className="hover:underline bg-transparent">Shop</Link></li>
                <li><button className="hover:underline bg-transparent">Notifications</button></li>
                <li><button className="hover:underline bg-transparent">Profile</button></li>
                <li><Link href="/dashboard/settings" className="hover:underline bg-transparent">Settings</Link></li>
                </ul>
            </nav>
        </header>
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
