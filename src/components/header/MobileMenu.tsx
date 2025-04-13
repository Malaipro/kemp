
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { MenuItem } from './types';

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  scrollToSection: (sectionId: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  menuItems, 
  scrollToSection 
}) => {
  return (
    <div 
      className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ top: '0', paddingTop: '4rem' }}
    >
      <nav className="flex flex-col space-y-3 p-5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="text-base text-black font-medium hover:text-kamp-accent transition-colors py-2 border-b border-gray-200"
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => scrollToSection('contact')}
          className="flex items-center text-base text-black font-medium hover:text-kamp-accent transition-colors py-2 border-b border-gray-200"
        >
          <MessageSquare size={16} className="mr-2" />
          Задать вопрос
        </button>
        <button 
          className="kamp-button-accent mt-4 w-full py-2"
          onClick={() => scrollToSection('contact')}
        >
          Записаться
        </button>
      </nav>
    </div>
  );
};
