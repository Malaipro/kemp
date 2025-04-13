
import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './header/Logo';
import { DesktopNavigation } from './header/DesktopNavigation';
import { MobileMenu } from './header/MobileMenu';
import { MobileMenuButton } from './header/MobileMenuButton';
import { RegisterButton } from './header/RegisterButton';
import { MenuItem } from './header/types';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const isMobile = useIsMobile();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Desktop: only check if scrolled past threshold for styling
      if (!isMobile) {
        setIsScrolled(currentScrollY > 10);
        return;
      }
      
      // Mobile: handle header visibility based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        // Scrolling down & past initial threshold - hide header
        setIsHeaderVisible(false);
      } else {
        // Scrolling up or near top - show header
        setIsHeaderVisible(true);
      }
      
      // Update scroll position ref
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

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

  // For mobile: transparent header with just logo and menu button
  if (isMobile) {
    return (
      <header 
        className={`fixed top-0 w-full z-50 bg-transparent transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="kamp-container">
          <div className="flex items-center justify-between py-2">
            <Logo onClick={handleLogoClick} />
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
          setIsOpen={setIsOpen}
        />
      </header>
    );
  }

  // Desktop header with full styling
  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-soft py-0.5 md:py-1'
          : 'bg-white/90 backdrop-blur-md py-0.5 md:py-2'
      }`}
    >
      <div className="kamp-container">
        <div className="flex items-center justify-between h-12 md:h-16">
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
