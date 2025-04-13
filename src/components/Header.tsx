
import React, { useState, useEffect } from 'react';
import { Menu, X, MessageSquare } from 'lucide-react';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent background scrolling when menu is open
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
      setIsOpen(false);
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
  };

  const menuItems = [
    { id: 'about', label: 'О нас' },
    { id: 'program', label: 'Программа' },
    { id: 'trainers', label: 'Тренеры' },
    { id: 'leaderboard', label: 'Рейтинг' },
    { id: 'contact', label: 'Контакты' }
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-soft py-2' 
          : 'bg-white backdrop-blur-md py-3 shadow-md'
      }`}
    >
      <div className="kamp-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a 
              href="#" 
              className="text-2xl font-display font-bold text-black"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsOpen(false);
                document.body.style.overflow = 'auto';
              }}
            >
              <img 
                src="/lovable-uploads/99ae4c5c-0227-4240-b061-0dc8c860a5a2.png" 
                alt="КЭМП Логотип" 
                className="h-16 md:h-24 lg:h-32 object-contain"  // Significantly larger logo with object-contain
              />
            </a>
          </div>

          {/* Desktop Navigation */}
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

          {/* Register Button - Desktop */}
          <div className="hidden md:block">
            <button 
              className="kamp-button-accent text-sm py-2 px-4 lg:py-3 lg:px-6"
              onClick={() => scrollToSection('contact')}
            >
              Записаться
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-black focus:outline-none p-2"
            onClick={toggleMenu}
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '0', paddingTop: '5rem' }}
      >
        <nav className="flex flex-col space-y-4 p-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-lg text-black font-medium hover:text-kamp-accent transition-colors py-3 border-b border-gray-200"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('contact')}
            className="flex items-center text-lg text-black font-medium hover:text-kamp-accent transition-colors py-3 border-b border-gray-200"
          >
            <MessageSquare size={18} className="mr-2" />
            Задать вопрос
          </button>
          <button 
            className="kamp-button-accent mt-6 w-full"
            onClick={() => scrollToSection('contact')}
          >
            Записаться
          </button>
        </nav>
      </div>
    </header>
  );
};
