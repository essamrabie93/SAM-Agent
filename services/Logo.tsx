
import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = {
    sm: { w: 'w-10', h: 'h-8', bar: 'h-1.5' },
    md: { w: 'w-14', h: 'h-11', bar: 'h-2' },
    lg: { w: 'w-20', h: 'h-16', bar: 'h-3' },
  }[size];

  return (
    <div className={`${dimensions.w} ${dimensions.h} flex flex-col justify-between`}>
      {/* Top Bar (Yellow) */}
      <div className="flex justify-end">
        <div className={`${dimensions.bar} w-3/5 bg-[#ffb71b] rounded-tr-xl rounded-bl-xl`} />
      </div>
      {/* Middle Bar (Cyan) */}
      <div className={`${dimensions.bar} w-full bg-[#00a2bd] rounded-xl`} />
      {/* Bottom Bar (Dark) */}
      <div className="flex justify-start">
        <div className={`${dimensions.bar} w-3/5 bg-[#1f1f1f] rounded-tl-xl rounded-br-xl`} />
      </div>
    </div>
  );
};
