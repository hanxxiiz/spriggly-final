'use-client'

import { useState } from "react";
import { Poppins } from "next/font/google";
import { TiThMenu } from "react-icons/ti";
import { FiSettings } from 'react-icons/fi';
import { FiLogOut } from "react-icons/fi";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const Navbar = () => {
  const [isMenuShown, setIsMenuShown] = useState<boolean>(false)
  return (
    <nav className={`${poppins.className} bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50`}>
        <div className="flex flex-wrap justify-between items-center px-4 mx-auto">
            <a href="" className="flex items-center">
                <img src="/logo.png" className="h-13" />
                <span className="text-lime-700 text-xl font-bold ">Spriggly</span>
            </a>
            <button className="lg:hidden" onClick={() => setIsMenuShown(!isMenuShown)}>
                <TiThMenu className="w-6 h-6" />
            </button>
            <div
                className={`lg:flex items-center justify-between w-full lg:w-auto lg:order-1 ${
                    isMenuShown ? '' : 'hidden'
                }`}
            >
                <div className="hidden lg:flex flex-1 justify-center"></div>
                <ul className="flex flex-col lg:flex-row lg:space-x-8 font-medium">
                  <li>
                    <a 
                      href="/dashboard"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2"
                    >
                      Grow
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/dashboard/focus"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2"
                    >
                      Focus
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/dashboard/my_plants"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2"
                    >
                      My Plants
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/dashboard/shop"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2"
                    >
                      Shop
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2"
                    >
                      Leaderboard
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2"
                    >
                      Notifications
                    </a>
                  </li>
                  <li className="mr-35">
                    <a 
                      href="/dashboard/profile"
                      className="hover:text-lime-700 text-gray-700 rounded block px-3 py-2"
                    >
                      Profile
                    </a>
                    </li>
                    <li>
                        <a href="/dashboard/settings" className="hidden lg:block py-2 hover:text-red-600 transition-colors">
                            <FiSettings className="w-7 h-7" title="Settings" />
                        </a>
                    </li>
                    <li>
                        <a href="/" className="hidden lg:block py-2 hover:text-red-600 transition-colors">
                            <FiLogOut className="w-7 h-7" title="Sign Out" />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;