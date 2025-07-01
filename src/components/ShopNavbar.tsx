import React from 'react';
/*CURSOR NI NA NAVV DI NI FINAL PLACEHOLDER RAA KAY KIWAW WAY NAV*/ 
const navLinks = [
  'Home',
  'Grow',
  'My Plants',
  'Shop',
  'Notifications',
  'Profile',
  'Settings',
];

const ShopNavbar: React.FC = () => {
  return (
    <nav className="w-full bg-white rounded-t-2xl shadow-sm flex items-center px-6 py-2" style={{ minHeight: '60px' }}>
      {/* Logo and Brand */}
      <div className="flex items-center mr-8">
        {/* Placeholder logo */}
        <div className="w-12 h-12 bg-lime-200 rounded-full flex items-center justify-center mr-2">
          <span className="text-2xl font-bold text-green-700">S</span>
        </div>
        <span className="text-2xl font-extrabold text-green-700 font-sans">Spriggly</span>
      </div>
      {/* Navigation Links */}
      <ul className="flex space-x-8 ml-2">
        {navLinks.map((link, idx) => (
          <li
            key={link}
            className={`text-green-900 font-semibold text-base hover:underline cursor-pointer${link === 'Grow' ? ' font-bold' : ''}`}
            style={link === 'Grow' ? { fontWeight: 700 } : {}}
          >
            {link}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ShopNavbar; 