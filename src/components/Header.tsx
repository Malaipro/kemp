
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
          ? 'bg-white shadow-soft py-0.5' // Further reduced from py-1 to py-0.5
          : 'bg-white backdrop-blur-md py-1 shadow-md' // Further reduced from py-1.5 to py-1
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
                className="h-16 md:h-24 lg:h-32 object-contain"  // Keeping the larger logo size
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
              className="kamp-button-accent text-sm py-1.5 px-3 lg:py-2 lg:px-5" // Reduced button size
              onClick={() => scrollToSection('contact')}
            >
              Записаться
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-black focus:outline-none p-1" // Reduced padding from p-2 to p-1
            onClick={toggleMenu}
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />} {/* Reduced icon size from 24 to 22 */}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '0', paddingTop: '4rem' }} // Reduced paddingTop from 5rem to 4rem
      >
        <nav className="flex flex-col space-y-3 p-5"> {/* Reduced space-y from 4 to 3 and p from 6 to 5 */}
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-base text-black font-medium hover:text-kamp-accent transition-colors py-2 border-b border-gray-200" // Reduced text-lg to text-base and py from 3 to 2
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('contact')}
            className="flex items-center text-base text-black font-medium hover:text-kamp-accent transition-colors py-2 border-b border-gray-200" // Reduced text-lg to text-base and py from 3 to 2
          >
            <MessageSquare size={16} className="mr-2" /> {/* Reduced icon size from 18 to 16 */}
            Задать вопрос
          </button>
          <button 
            className="kamp-button-accent mt-4 w-full py-2" // Reduced mt from 6 to 4 and added py-2 for smaller height
            onClick={() => scrollToSection('contact')}
          >
            Записаться
          </button>
        </nav>
      </div>
    </header>
  );
};
