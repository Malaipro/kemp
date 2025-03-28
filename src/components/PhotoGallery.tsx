
import React, { useEffect, useRef } from 'react';
import { GalleryHorizontal } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

// Photos from the course
const photos = [
  {
    id: 1,
    src: "/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png",
    alt: "Участники в процессе тренировки"
  },
  {
    id: 2,
    src: "/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png",
    alt: "Групповое занятие на природе"
  },
  {
    id: 3,
    src: "/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png",
    alt: "Силовая тренировка"
  },
  {
    id: 4,
    src: "/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png",
    alt: "Выпускники КЭМП"
  },
  {
    id: 5,
    src: "/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png",
    alt: "Командное упражнение"
  }
];

export const PhotoGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Function to create infinite scrolling animation
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    
    if (!scrollContainer) return;
    
    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
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

        {/* Horizontal scrolling gallery */}
        <div className="relative overflow-hidden" ref={galleryRef}>
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide py-4"
            style={{ scrollBehavior: 'smooth' }}
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
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
