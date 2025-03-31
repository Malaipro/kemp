
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
        // Reduce the elementVisible value even more to trigger animations earlier
        const elementVisible = 20; // Changed from 40 to 20 for earlier animations

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('is-visible');
        } else {
          element.classList.remove('is-visible');
        }
      });
    };

    window.addEventListener('scroll', revealElements);
    revealElements(); // Run once on mount

    return () => {
      window.removeEventListener('scroll', revealElements);
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
