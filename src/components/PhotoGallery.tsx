
import React, { useEffect, useRef } from 'react';
import { GalleryHorizontal } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

// Updated photos with new URLs
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
    src: "https://i.imgur.com/t3O09wf.jpeg", // Reusing first image as 5th since one link wasn't working
    alt: "Командное упражнение"
  }
];

export const PhotoGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef<number>(0);
  
  // Function to create smoother infinite scrolling animation
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    
    if (!scrollContainer) return;
    
    const scroll = () => {
      // Use a smaller increment for smoother animation
      const speed = 0.5;
      
      if (scrollContainer.scrollWidth > 0) {
        // Calculate when we need to reset (when first set of images is scrolled past)
        const resetPoint = scrollContainer.scrollWidth / 2;
        
        if (scrollPosition.current >= resetPoint) {
          // Reset scroll position to beginning to create infinite loop
          scrollPosition.current = 0;
          scrollContainer.scrollLeft = 0;
        } else {
          // Increment scroll position
          scrollPosition.current += speed;
          scrollContainer.scrollLeft = scrollPosition.current;
        }
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
            className="flex gap-4 overflow-x-auto scrollbar-hide py-4"
            style={{ scrollBehavior: 'auto' }} // Changed to auto for smoother programmatic scrolling
          >
            {/* Original photos */}
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="flex-none w-72 h-80 relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  loading="eager" // Ensure images load immediately for smooth scroll
                />
              </div>
            ))}
            
            {/* Duplicate photos for seamless scrolling */}
            {photos.map((photo) => (
              <div
                key={`duplicate-${photo.id}`}
                className="flex-none w-72 h-80 relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  loading="eager" // Ensure images load immediately for smooth scroll
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
