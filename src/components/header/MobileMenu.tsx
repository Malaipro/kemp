
import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { MenuItem } from './types';
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  scrollToSection: (sectionId: string) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  menuItems, 
  scrollToSection,
  setIsOpen
}) => {
  const handleClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="md:hidden w-full max-w-[85vw] pt-10 px-4 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-lg text-black">Меню</span>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex flex-col space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="text-base text-black font-medium hover:text-kamp-accent transition-colors py-3 px-2 border-b border-gray-100 text-left"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleClick('contact')}
            className="flex items-center text-base text-black font-medium hover:text-kamp-accent transition-colors py-3 px-2 border-b border-gray-100"
          >
            <MessageSquare size={16} className="mr-2" />
            Задать вопрос
          </button>
          <button 
            className="kamp-button-accent mt-6 w-full py-3"
            onClick={() => handleClick('contact')}
          >
            Записаться
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
