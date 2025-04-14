
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { servicePackages, ServicePackage } from './services/servicePackagesData';
import { PackageCards } from './services/PackageCards';
import { PackageTable } from './services/PackageTable';
import { BookingDialog } from './services/BookingDialog';
import { useIsMobile } from '@/hooks/use-mobile';

export const ServicesPackages: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSelectPackage = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  return (
    <section id="services" className="kamp-section bg-kamp-dark text-black py-4 md:py-16">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-kamp-primary font-semibold mb-1 text-sm md:text-base">Пакеты услуг</span>
          <h2 className="text-black font-bold text-xl md:text-3xl">
            Выберите подходящий вариант
          </h2>
          {isMobile ? (
            <p className="text-black/70 text-xs px-6 mt-1">
              Мы предлагаем различные варианты участия в программе КЭМП,
              от пробной тренировки до полного курса.
            </p>
          ) : (
            <p className="text-black/70 text-sm md:text-base">
              Мы предлагаем различные варианты участия в программе КЭМП,
              от пробной тренировки до полного премиум-курса с индивидуальным сопровождением.
            </p>
          )}
        </div>

        <div className="mt-4 md:mt-16">
          <Tabs defaultValue="cards" className="w-full">
            <TabsList className={`grid w-full ${isMobile ? 'max-w-[220px]' : 'md:w-[400px]'} mx-auto grid-cols-2 mb-6`}>
              <TabsTrigger value="cards" className={`text-black font-medium ${isMobile ? 'text-xs py-2' : ''}`}>
                Карточки
              </TabsTrigger>
              <TabsTrigger value="table" className={`text-black font-medium ${isMobile ? 'text-xs py-2' : ''}`}>
                Сравнение
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cards" className="reveal-on-scroll px-1 md:px-0">
              {isMobile ? (
                <div className="overflow-x-auto pb-4 scrollbar-hide touch-scroll">
                  <div className="inline-flex space-x-4 px-4">
                    <PackageCards packages={servicePackages} onSelectPackage={handleSelectPackage} />
                  </div>
                </div>
              ) : (
                <PackageCards packages={servicePackages} onSelectPackage={handleSelectPackage} />
              )}
            </TabsContent>
            
            <TabsContent value="table" className="reveal-on-scroll">
              <PackageTable packages={servicePackages} onSelectPackage={handleSelectPackage} />
            </TabsContent>
          </Tabs>
        </div>

        <BookingDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          selectedPackage={selectedPackage} 
        />
      </div>
    </section>
  );
};
