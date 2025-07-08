import React from 'react';

type NotificationCardProps = {
  type: string;
  message: string;
  time: string;
  icon: string;
  color: string;
  read?: boolean;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  type,
  message,
  time,
  icon,
  color,
  read = false,
}) => (
  <div
    className={`flex items-start gap-3 border rounded-lg p-4 mt-4 first:mt-6 shadow-sm transition-all duration-200
      ${read
        ? 'border-gray-200 bg-white opacity-60'
        : 'border-lime-400 bg-lime-50 ring-2 ring-lime-200'}
    `}
  >
    <div className={`w-8 h-8 rounded ${color} flex items-center justify-center text-white text-xl`}>
      {icon}
    </div>
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="bg-lime-200 text-lime-700 text-xs font-bold px-2 py-0.5 rounded">
          {type}
        </span>
      </div>
      <div className="font-semibold text-green-800">{message}</div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  </div>
);

export default NotificationCard;
