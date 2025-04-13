
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { MenuItem } from './types';

interface DesktopNavigationProps {
  menuItems: MenuItem[];
  scrollToSection: (sectionId: string) => void;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ 
  menuItems, 
  scrollToSection 
}) => {
  return (
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className="text-black font-medium hover:text-kamp-accent transition-colors text-xs lg:text-sm"
        >
          {item.label}
        </button>
      ))}
      <button
        onClick={() => scrollToSection('contact')}
        className="flex items-center text-black font-medium hover:text-kamp-accent transition-colors text-xs lg:text-sm"
      >
        <MessageSquare size={14} className="mr-1" />
        Задать вопрос
      </button>
    </nav>
  );
};
