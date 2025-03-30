
import React, { useEffect, useRef } from 'react';
import { GalleryHorizontal } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

// Updated photos array with unique images only
const photos = [
  {
    id: 1,
    src: "https://i.imgur.com/t3O09wf.jpeg",
    alt: "Участники в процессе тренировки"
  },
  {
    id: 2,
    src: "https://i.imgur.com/pDQtpCd.jpeg",
    alt: "Групповое занятие на природе"
  },
  {
    id: 3,
    src: "https://i.imgur.com/6avhXfD.jpeg",
    alt: "Силовая тренировка"
  },
  {
    id: 4,
    src: "https://i.imgur.com/nJQaK50.jpeg",
    alt: "Выпускники КЭМП"
  },
  {
    id: 5,
    src: "https://i.imgur.com/yuqrv6P.jpeg", // Replaced duplicate image with new one
    alt: "Командное упражнение"
  }
];

export const PhotoGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef<number>(0);
  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    
    if (!scrollContainer) return;
    
    // Calculate total width of all images + gap
    const calculateTotalWidth = () => {
      if (!scrollContainer.firstElementChild) return 0;
      const firstItem = scrollContainer.firstElementChild as HTMLElement;
      const itemWidth = firstItem.offsetWidth;
      const gap = 16; // 4 in tailwind's gap-4 equals 16px
      return photos.length * (itemWidth + gap) - gap; // Subtract final gap
    };
    
    // Create a seamless scrolling animation
    const scroll = () => {
      const speed = 0.5;
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
    
    // Pause animation on hover
    const handleMouseEnter = () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
    
    // Resume animation on mouse leave
    const handleMouseLeave = () => {
      if (animationRef.current === null) {
        animationRef.current = requestAnimationFrame(scroll);
      }
    };
    
    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section id="gallery" className="kamp-section bg-kamp-light">
      <div className="kamp-container">
        <div className="section-heading mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GalleryHorizontal className="text-kamp-primary h-6 w-6" />
            <span className="text-kamp-primary font-semibold">Галерея</span>
          </div>
          <h2 className="text-kamp-dark">Моменты КЭМП</h2>
          <p>
            Путешествие преображения: реальные моменты из жизни участников нашего курса
          </p>
        </div>

        {/* Horizontal scrolling gallery with improved animation */}
        <div className="relative overflow-hidden" ref={galleryRef}>
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide py-4 whitespace-nowrap"
            style={{ scrollBehavior: 'auto' }}
          >
            {/* We display each photo multiple times in sequence to create infinite scroll effect */}
            {[...Array(3)].map((_, repeatIndex) => (
              <React.Fragment key={`repeat-${repeatIndex}`}>
                {photos.map((photo) => (
                  <div
                    key={`${repeatIndex}-${photo.id}`}
                    className="flex-none w-72 h-80 relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
