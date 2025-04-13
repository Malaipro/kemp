
import React, { useState, useEffect } from 'react';
import { Logo } from './header/Logo';
import { DesktopNavigation } from './header/DesktopNavigation';
import { MobileMenu } from './header/MobileMenu';
import { MobileMenuButton } from './header/MobileMenuButton';
import { RegisterButton } from './header/RegisterButton';
import { MenuItem } from './header/types';

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
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const menuItems: MenuItem[] = [
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
          ? 'bg-white shadow-soft py-0.5 md:py-1'
          : 'bg-white/90 backdrop-blur-md py-1 md:py-2'
      }`}
    >
      <div className="kamp-container">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center">
            <Logo onClick={handleLogoClick} />
          </div>

          <DesktopNavigation 
            menuItems={menuItems} 
            scrollToSection={scrollToSection} 
          />

          <div className="flex items-center space-x-2">
            <RegisterButton onClick={() => scrollToSection('contact')} />
            <MobileMenuButton 
              isOpen={isOpen} 
              toggleMenu={toggleMenu} 
            />
          </div>
        </div>
      </div>

      <MobileMenu 
        isOpen={isOpen} 
        menuItems={menuItems} 
        scrollToSection={scrollToSection}
        setIsOpen={setIsOpen}
      />
    </header>
  );
};
