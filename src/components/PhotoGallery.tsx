
import React, { useEffect, useRef } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Image, GalleryHorizontal } from 'lucide-react';

// Photos from the course
const photos = [
  {
    id: 1,
    src: "/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png",
    alt: "Участники в процессе тренировки",
    caption: "Интенсивная тренировка на выносливость"
  },
  {
    id: 2,
    src: "/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png",
    alt: "Групповое занятие на природе",
    caption: "Утренняя пробежка в горах"
  },
  {
    id: 3,
    src: "/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png",
    alt: "Силовая тренировка",
    caption: "Развитие силы и выносливости"
  },
  {
    id: 4,
    src: "/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png",
    alt: "Выпускники КЭМП",
    caption: "Выпускники специального потока"
  },
  {
    id: 5,
    src: "/lovable-uploads/897a2b54-4b4a-4946-a08b-5c76b0474438.png",
    alt: "Командное упражнение",
    caption: "Формирование командного духа"
  }
];

export const PhotoGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);

  // Animation for gallery items when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const photos = entry.target.querySelectorAll('.photo-item');
            photos.forEach((photo, index) => {
              setTimeout(() => {
                photo.classList.add('photo-visible');
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => {
      if (galleryRef.current) {
        observer.unobserve(galleryRef.current);
      }
    };
  }, []);

  return (
    <section id="gallery" className="kamp-section bg-kamp-light">
      <div className="kamp-container">
        <div className="section-heading mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GalleryHorizontal className="text-kamp-primary h-6 w-6" />
            <span className="text-kamp-primary font-semibold">Галерея</span>
          </div>
          <h2 className="text-kamp-dark">Моменты КЭМП</h2>
          <p>
            Путешествие преображения: реальные моменты из жизни участников нашего курса
          </p>
        </div>

        {/* Featured photos section */}
        <div ref={galleryRef} className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.slice(0, 3).map((photo, index) => (
              <div
                key={photo.id}
                className={`photo-item relative overflow-hidden rounded-xl shadow-lg opacity-0 transform translate-y-10 transition-all duration-700 ease-out delay-${index * 150}`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-64 object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <p className="font-medium">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel for additional photos */}
        <div className="reveal-on-scroll">
          <h3 className="text-xl font-bold text-center mb-6">Еще фото с курса</h3>
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {photos.slice(1).map((photo) => (
                <CarouselItem key={photo.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2 h-full">
                    <div className="relative h-56 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <img 
                        src={photo.src} 
                        alt={photo.alt}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <p className="text-white p-4 text-sm">{photo.caption}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
