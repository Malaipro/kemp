
import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ 
  isOpen, 
  toggleMenu 
}) => {
  return (
    <button 
      className="text-black bg-white/80 backdrop-blur-sm focus:outline-none p-1.5 rounded-md hover:bg-white"
      onClick={toggleMenu}
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};
