
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
    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className="text-black font-medium hover:text-kamp-accent transition-colors text-sm lg:text-base"
        >
          {item.label}
        </button>
      ))}
      <button
        onClick={() => scrollToSection('contact')}
        className="flex items-center text-black font-medium hover:text-kamp-accent transition-colors text-sm lg:text-base"
      >
        <MessageSquare size={16} className="mr-2" />
        Задать вопрос
      </button>
    </nav>
  );
};
