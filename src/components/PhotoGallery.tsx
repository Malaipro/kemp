import React, { useEffect, useRef, useState } from 'react';
import { GalleryHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import kamp1 from '@/assets/gallery/kamp-1.jpg';
import kamp2 from '@/assets/gallery/kamp-2.jpg';
import kamp3 from '@/assets/gallery/kamp-3.jpg';
import kamp4 from '@/assets/gallery/kamp-4.jpg';
import kamp5 from '@/assets/gallery/kamp-5.jpg';
import kamp6 from '@/assets/gallery/kamp-6.jpg';
import kamp7 from '@/assets/gallery/kamp-7.jpg';
import kamp8 from '@/assets/gallery/kamp-8.jpg';
import kamp9 from '@/assets/gallery/kamp-9.jpg';
import kamp10 from '@/assets/gallery/kamp-10.jpg';
import kamp11 from '@/assets/gallery/kamp-11.jpg';
import kamp12 from '@/assets/gallery/kamp-12.jpg';

// Updated photos array with all 12 images
const photos = [
  {
    id: 1,
    src: kamp1,
    alt: "Участники КЭМП в тренировочном процессе"
  },
  {
    id: 2,
    src: kamp2,
    alt: "Моменты командной работы КЭМП"
  },
  {
    id: 3,
    src: kamp3,
    alt: "Интенсивные тренировки КЭМП"
  },
  {
    id: 4,
    src: kamp4,
    alt: "Тренировки на природе"
  },
  {
    id: 5,
    src: kamp5,
    alt: "Групповые занятия КЭМП"
  },
  {
    id: 6,
    src: kamp6,
    alt: "Физическая подготовка"
  },
  {
    id: 7,
    src: kamp7,
    alt: "Командные упражнения"
  },
  {
    id: 8,
    src: kamp8,
    alt: "Тактическая медицина"
  },
  {
    id: 9,
    src: kamp9,
    alt: "Специальная подготовка"
  },
  {
    id: 10,
    src: kamp10,
    alt: "Полевые занятия КЭМП"
  },
  {
    id: 11,
    src: kamp11,
    alt: "Практические навыки"
  },
  {
    id: 12,
    src: kamp12,
    alt: "Выездные испытания"
  }
];

export const PhotoGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    
    if (!scrollContainer) return;
    
    // Calculate total width of all images + gap
    const calculateTotalWidth = () => {
      if (!scrollContainer.firstElementChild) return 0;
      const firstItem = scrollContainer.firstElementChild as HTMLElement;
      const itemWidth = firstItem.offsetWidth;
      const gap = isMobile ? 12 : 16; // 3 in tailwind's gap-3 equals 12px, 4 equals 16px
      return photos.length * (itemWidth + gap) - gap; // Subtract final gap
    };
    
    // Create a smoother scrolling animation
    const scroll = () => {
      if (isDragging) return;
      
      const speed = isMobile ? 0.6 : 0.8; // Faster on mobile
      const totalWidth = calculateTotalWidth();
      
      if (totalWidth > 0) {
        scrollPosition.current += speed;
        
        // Create loop effect - if we've scrolled past the first image, reset
        if (scrollPosition.current >= totalWidth / photos.length) {
          // Move back to start minus the amount we overshot
          const overshoot = scrollPosition.current % (totalWidth / photos.length);
          scrollPosition.current = overshoot;
        }
        
        // Apply modulo to keep scrolling position within content width
        // This creates the infinite scrolling effect
        scrollContainer.scrollLeft = scrollPosition.current % totalWidth;
      }
      
      animationRef.current = requestAnimationFrame(scroll);
    };
    
    // Start scrolling animation
    animationRef.current = requestAnimationFrame(scroll);
    
    // Pause animation on hover or touch
    const handlePause = () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
    
    // Resume animation on mouse leave or touch end
    const handleResume = () => {
      if (animationRef.current === null && !isDragging) {
        animationRef.current = requestAnimationFrame(scroll);
      }
    };
    
    // Touch/drag handlers for mobile
    const handleTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
      handlePause();
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !scrollContainer) return;
      
      const x = e.touches[0].clientX;
      const walk = (startX - x) * 2; // Faster movement
      
      scrollContainer.scrollLeft += walk;
      setStartX(x);
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      setTimeout(handleResume, 1000); // Delay resume to allow for user interaction
    };
    
    // Mouse handlers for desktop
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartX(e.clientX);
      handlePause();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollContainer) return;
      
      const x = e.clientX;
      const walk = (startX - x) * 2;
      
      scrollContainer.scrollLeft += walk;
      setStartX(x);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setTimeout(handleResume, 1000);
    };
    
    scrollContainer.addEventListener('mouseenter', handlePause);
    scrollContainer.addEventListener('mouseleave', handleResume);
    scrollContainer.addEventListener('touchstart', handleTouchStart);
    scrollContainer.addEventListener('touchmove', handleTouchMove);
    scrollContainer.addEventListener('touchend', handleTouchEnd);
    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mousemove', handleMouseMove);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      
      scrollContainer.removeEventListener('mouseenter', handlePause);
      scrollContainer.removeEventListener('mouseleave', handleResume);
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
      scrollContainer.removeEventListener('touchend', handleTouchEnd);
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('mousemove', handleMouseMove);
      scrollContainer.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile, isDragging, startX]);

  return (
    <section id="gallery" className="kamp-section bg-kamp-light">
      <div className="kamp-container">
        <div className="section-heading mb-6 md:mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GalleryHorizontal className="text-kamp-primary h-5 w-5 md:h-6 md:w-6" />
            <span className="text-kamp-primary font-semibold">Галерея</span>
          </div>
          <h2 className="text-kamp-dark text-2xl md:text-3xl lg:text-4xl">Моменты КЭМП</h2>
          <p className="text-sm md:text-base">
            Путешествие преображения: реальные моменты из жизни участников нашего клуба
          </p>
        </div>

        {/* Horizontal scrolling gallery with improved animation */}
        <div className="relative overflow-hidden" ref={galleryRef}>
          <div 
            ref={scrollContainerRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide py-2 md:py-4 whitespace-nowrap touch-scroll mobile-snap-scroll"
            style={{ scrollBehavior: 'auto', cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {/* We display each photo multiple times in sequence to create infinite scroll effect */}
            {[...Array(3)].map((_, repeatIndex) => (
              <div key={`repeat-${repeatIndex}`}>
                {photos.map((photo) => (
                  <div
                    key={`${repeatIndex}-${photo.id}`}
                    className={`flex-none ${isMobile ? 'w-[80vw] h-60' : 'w-72 h-80'} relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 snap-item`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                      loading="eager"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Visual indicators for better UX */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {photos.map((_, index) => (
              <div key={index} className={`h-1 w-8 rounded-full ${index === 0 ? 'bg-kamp-primary' : 'bg-white/30'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
