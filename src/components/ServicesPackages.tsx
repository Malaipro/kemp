
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

        <div className="mt-4 md:mt-12">
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
                  <div className="inline-flex space-x-4 px-4 w-max">
                    {servicePackages.map((pkg) => (
                      <div key={pkg.id} className="snap-item">
                        <Card 
                          className={`w-[280px] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1 border border-gray-200 
                            ${pkg.highlight ? 'ring-2 ring-kamp-primary' : ''}
                          `}
                        >
                          <CardHeader className={`${pkg.color} py-4 px-4 relative overflow-hidden`}>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className={`${pkg.titleColor} text-lg font-bold`}>
                                {pkg.title}
                              </h3>
                              {pkg.highlight && (
                                <span className="bg-kamp-primary text-white text-[10px] font-medium py-0.5 px-1.5 rounded-full uppercase tracking-wide">
                                  Лучший выбор
                                </span>
                              )}
                            </div>
                            
                            <p className="text-gray-700 text-sm mb-3">{pkg.description}</p>
                            
                            <div className="flex items-end">
                              <span className="text-kamp-dark text-2xl font-bold">{formatPrice(pkg.price)} ₽</span>
                            </div>
                            
                            {pkg.date && (
                              <div className="text-gray-600 text-xs mt-1">
                                Ближайшая тренировка: {pkg.date.toLocaleDateString('ru-RU')}
                              </div>
                            )}
                          </CardHeader>
                          
                          <CardContent className="py-4 px-4">
                            <ul className="space-y-2">
                              {pkg.features.map((feature, index) => (
                                <li key={index} className="flex items-start text-xs text-gray-700">
                                  <svg className="h-4 w-4 text-kamp-primary mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          
                          <CardFooter className="p-3">
                            <Button 
                              onClick={() => handleSelectPackage(pkg)}
                              className="w-full bg-kamp-primary hover:bg-kamp-accent text-white font-medium text-sm"
                            >
                              {pkg.id === 'demo' ? 'Записаться' : 'Выбрать пакет'}
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    ))}
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

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { formatPrice } from './services/servicePackagesData';
