
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ServicePackage, formatPrice } from './servicePackagesData';
import { useIsMobile } from '@/hooks/use-mobile';

interface PackageCardsProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
}

export const PackageCards = ({ packages, onSelectPackage }: PackageCardsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 pb-4 overflow-x-auto">
      {packages.map((pkg) => (
        <Card 
          key={pkg.id} 
          className={`w-[280px] md:w-full mx-auto rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1 border border-gray-200 
            ${pkg.highlight ? 'ring-2 ring-kamp-primary' : ''}
          `}
        >
          <CardHeader className={`${pkg.color} py-4 px-4 md:py-6 md:px-8 relative overflow-hidden`}>
            <div className="flex justify-between items-start mb-1">
              <h3 className={`${pkg.titleColor} text-lg md:text-xl font-bold flex items-center`}>
                <pkg.icon className="h-5 w-5 md:h-6 md:w-6 mr-2 text-kamp-primary" />
                {pkg.title}
              </h3>
              {pkg.highlight && (
                <span className="bg-kamp-primary text-white text-[10px] md:text-xs font-medium py-0.5 px-1.5 md:px-2 rounded-full uppercase tracking-wide">
                  Лучший выбор
                </span>
              )}
            </div>
            
            <p className="text-gray-700 text-sm mb-3">{pkg.description}</p>
            
            <div className="flex items-end">
              <span className="text-kamp-dark text-2xl md:text-3xl font-bold">{formatPrice(pkg.price)} ₽</span>
            </div>
            
            {pkg.date && (
              <div className="text-gray-600 text-xs mt-1">
                Ближайшая тренировка: {pkg.date.toLocaleDateString('ru-RU')}
              </div>
            )}
          </CardHeader>
          
          <CardContent className="py-4 px-4 md:p-6">
            <ul className="space-y-2 md:space-y-3">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start text-xs md:text-sm text-gray-700">
                  <svg className="h-4 w-4 md:h-5 md:w-5 text-kamp-primary mr-2 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          
          <CardFooter className="p-3 md:p-4">
            <Button 
              onClick={() => onSelectPackage(pkg)}
              className="w-full bg-kamp-primary hover:bg-kamp-accent text-white font-medium text-sm md:text-base"
            >
              {pkg.id === 'demo' ? 'Записаться' : 'Выбрать пакет'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
