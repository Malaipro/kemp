
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

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
    document.body.style.overflow = 'auto';
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
          ? 'bg-white shadow-soft py-0.5'
          : 'bg-white backdrop-blur-md py-0 shadow-md'
      }`}
    >
      <div className="kamp-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Logo onClick={handleLogoClick} />
          </div>

          <DesktopNavigation 
            menuItems={menuItems} 
            scrollToSection={scrollToSection} 
          />

          <RegisterButton onClick={() => scrollToSection('contact')} />

          <MobileMenuButton 
            isOpen={isOpen} 
            toggleMenu={toggleMenu} 
          />
        </div>
      </div>

      <MobileMenu 
        isOpen={isOpen} 
        menuItems={menuItems} 
        scrollToSection={scrollToSection} 
      />
    </header>
  );
};
