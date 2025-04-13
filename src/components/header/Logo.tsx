
import React from 'react';

interface LogoProps {
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Logo: React.FC<LogoProps> = ({ onClick }) => {
  return (
    <a 
      href="#" 
      className="text-2xl font-display font-bold text-black"
      onClick={onClick}
    >
      <img 
        src="/lovable-uploads/99ae4c5c-0227-4240-b061-0dc8c860a5a2.png" 
        alt="КЭМП Логотип" 
        className="h-16 md:h-24 lg:h-32 object-contain"
      />
    </a>
  );
};
