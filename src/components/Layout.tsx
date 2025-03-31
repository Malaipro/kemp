
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
        // Reduce the elementVisible value to trigger animations much earlier
        const elementVisible = 40; // Changed from 80 to 40

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
    <div className="flex flex-col min-h-screen bg-kamp-light text-kamp-dark">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
