import React, { useEffect, useRef, useState } from 'react';
import { GalleryHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const PhotoGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const isMobile = useIsMobile();

  // Загружаем изображения из базы данных
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data.map(img => ({
        id: img.id,
        src: img.image_url,
        alt: img.title || img.description || 'Момент КЭМП'
      }));
    },
  });
  
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
        {isLoading ? (
          <div className="text-center text-gray-600">Загрузка галереи...</div>
        ) : photos.length > 0 ? (
          <div className="relative overflow-hidden" ref={galleryRef}>
            <div 
              ref={scrollContainerRef}
              className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide py-2 md:py-4 whitespace-nowrap touch-scroll mobile-snap-scroll"
              style={{ scrollBehavior: 'auto', cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              {/* Display photos from database */}
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className={`flex-none ${isMobile ? 'w-[80vw] h-60' : 'w-72 h-80'} relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 snap-item`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    draggable="false"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
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
        ) : (
          <div className="text-center text-gray-600">Галерея пуста</div>
        )}
      </div>
    </section>
  );
};
