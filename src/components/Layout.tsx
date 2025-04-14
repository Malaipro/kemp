
import React, { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    const revealElements = () => {
      const reveals = document.querySelectorAll('.reveal-on-scroll');

      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        // Reduce the elementVisible value for earlier animations
        const elementVisible = 20; // Trigger animations earlier

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('is-visible');
        } else {
          // Only remove the class if we're above the viewport
          // This prevents elements from disappearing when scrolling up quickly
          if (elementTop > windowHeight) {
            element.classList.remove('is-visible');
          }
        }
      });
    };

    // Add smooth scroll behavior for anchor links
    const smoothScrollToAnchor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        const href = target.getAttribute('href') as string;
        const elementId = href.substring(1);
        const element = document.getElementById(elementId);
        
        if (element) {
          e.preventDefault();
          const yOffset = -80; // Header height offset
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('scroll', revealElements);
    document.addEventListener('click', smoothScrollToAnchor);
    revealElements(); // Run once on mount

    return () => {
      window.removeEventListener('scroll', revealElements);
      document.removeEventListener('click', smoothScrollToAnchor);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
