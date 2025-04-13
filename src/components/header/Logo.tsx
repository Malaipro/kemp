
import React from 'react';

interface LogoProps {
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Logo: React.FC<LogoProps> = ({ onClick }) => {
  return (
    <a 
      href="#" 
      className="text-xl font-display font-bold text-black py-1"
      onClick={onClick}
    >
      <img 
        src="/lovable-uploads/99ae4c5c-0227-4240-b061-0dc8c860a5a2.png" 
        alt="КЭМП Логотип" 
        className="h-10 md:h-12 lg:h-16 object-contain bg-white/80 backdrop-blur-sm rounded-md p-1" 
      />
    </a>
  );
};
