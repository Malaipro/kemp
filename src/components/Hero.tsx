
import React, { useEffect } from 'react';
import { VideoBackground } from './ui/VideoBackground';
import { useIsMobile } from '@/hooks/use-mobile';

export const Hero: React.FC = () => {
  const isMobile = useIsMobile();

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProgram = () => {
    const programSection = document.getElementById('program');
    if (programSection) {
      programSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden" style={{ height: isMobile ? 'calc(var(--vh, 1vh) * 85)' : '100vh' }}>
      <VideoBackground />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-4 md:mb-6">
          <span className={`inline-block bg-kamp-primary text-white ${isMobile ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'} rounded-full font-medium uppercase tracking-wider`}>
            Клуб Эффективного Мужского Прогресса
          </span>
        </div>
        
        <h1 className={`font-bold text-white mb-4 md:mb-6 leading-tight ${isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'}`}>
          Стань <span className="text-kamp-primary">сильнее</span> 
          <br />физически и ментально
        </h1>
        
        <p className={`text-white/90 mb-6 md:mb-8 mx-auto leading-relaxed ${isMobile ? 'text-sm max-w-sm' : 'text-lg md:text-xl max-w-2xl'}`}>
          {isMobile ? 
            "КЭМП — интенсив для тех, кто готов пройти испытания и стать сильнее." :
            "КЭМП — интенсив для тех, кто готов пройти испытания и стать сильнее. Физически. Ментально. Духовно."
          }
        </p>
        
        <div className={`flex flex-col sm:flex-row ${isMobile ? 'space-y-3 sm:space-y-0 sm:space-x-3' : 'space-y-4 sm:space-y-0 sm:space-x-4'} justify-center`}>
          <button 
            onClick={scrollToContact}
            className={`kamp-button-primary ${isMobile ? 'py-2 px-6 text-sm' : 'py-3 px-8 text-base'} font-semibold`}
          >
            Записаться на курс
          </button>
          <button 
            onClick={scrollToProgram}
            className={`kamp-button ${isMobile ? 'py-2 px-6 text-sm' : 'py-3 px-8 text-base'} font-semibold`}
          >
            Узнать больше
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
