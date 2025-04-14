
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { servicePackages, ServicePackage } from './services/servicePackagesData';
import { PackageCards } from './services/PackageCards';
import { PackageTable } from './services/PackageTable';
import { BookingDialog } from './services/BookingDialog';

export const ServicesPackages: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectPackage = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  return (
    <section id="services" className="kamp-section bg-kamp-dark text-black">
      <div className="kamp-container">
        <div className="section-heading reveal-on-scroll">
          <span className="inline-block text-black font-semibold mb-2">Пакеты услуг</span>
          <h2 className="relative inline-block bg-gradient-to-r from-kamp-accent via-purple-600 to-blue-600 bg-clip-text text-transparent font-bold after:content-[''] after:absolute after:w-full after:h-[8px] after:left-0 after:bottom-1 after:bg-kamp-accent/20 after:-z-10">
            Выберите подходящий вариант
          </h2>
          <p className="text-black/70">
            Мы предлагаем различные варианты участия в программе КЭМП,
            от пробной тренировки до полного премиум-курса с индивидуальным сопровождением.
          </p>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="cards" className="w-full">
            <TabsList className="grid w-full md:w-[400px] mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="cards" className="text-black font-medium">Карточки</TabsTrigger>
              <TabsTrigger value="table" className="text-black font-medium">Сравнение</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cards">
              <PackageCards packages={servicePackages} onSelectPackage={handleSelectPackage} />
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
