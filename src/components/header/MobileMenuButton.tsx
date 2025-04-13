
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
      className="md:hidden text-black focus:outline-none p-1.5 rounded-md hover:bg-gray-100"
      onClick={toggleMenu}
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};
