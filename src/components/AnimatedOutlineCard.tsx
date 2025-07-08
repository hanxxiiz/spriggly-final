import React from 'react';

interface AnimatedOutlineProps {
  width?: string;
  height?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const AnimatedOutline: React.FC<AnimatedOutlineProps> = ({ 
  width = "w-80", 
  height = "h-65", 
  children, 
  className = "",
  onClick 
}) => {
  return (
    <>
      <div className={`${width} ${height} overflow-visible ${className}`}>
        <div 
          className="w-full h-full shadow-lg rounded-3xl cursor-pointer"
          onClick={onClick}
        >
          {/* Animated Outline Card */}
          <div className="relative w-full h-full bg-[#0c342c] rounded-3xl overflow-hidden flex justify-center items-center">
            {/* Spinning Gradient Border */}
            <div className="absolute w-40 h-[160%] bg-gradient-to-r from-transparent via-[#E4FE62] to-transparent animate-spin-slow"></div>
            
            {/* Inner Content Container */}
            <div className="p-5 absolute w-[99%] h-[99%] bg-[#63d471] rounded-3xl text-white relative"
              style={{
                background: 'linear-gradient(to top, #0c342c, #076653)',
              }}>

              {/* Radial Gradient Overlay */}
              <div
                className="absolute inset-0 rounded-lg z-0"
                style={{
                  background: 'radial-gradient(circle, #E4FE62 0%, transparent 70%)',
                  opacity: 0.4,
                }}
              ></div>

              {/* Content */}
              <div className="relative z-10 w-full h-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s infinite linear;
        }
      `}</style>
    </>
  );
};

export default AnimatedOutline;