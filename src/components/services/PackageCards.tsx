
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ServicePackage, formatPrice } from './servicePackagesData';
import { useIsMobile } from '@/hooks/use-mobile';

interface PackageCardsProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
}

export const PackageCards = ({ packages, onSelectPackage }: PackageCardsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex ${isMobile ? 'gap-2 overflow-x-auto pb-4 px-1' : 'md:grid md:grid-cols-3 gap-4 md:gap-6'} reveal-on-scroll mobile-snap-scroll`}>
      {packages.map((pkg) => (
        <Card 
          key={pkg.id} 
          className={`border ${pkg.highlight ? 'border-kamp-primary shadow-lg' : 'border-gray-200'} 
            shadow-md overflow-hidden transition-all hover:shadow-xl flex flex-col 
            ${isMobile ? 'min-w-[260px] snap-item rounded-xl' : ''} relative`}
        >
          {pkg.highlight && (
            <div className="absolute -right-8 top-4 bg-kamp-primary text-white px-8 py-1 transform rotate-45 shadow-md text-xs">
              Популярный
            </div>
          )}
          <CardHeader className={`bg-white ${isMobile ? 'p-4' : 'p-6'}`}>
            <div className="flex justify-between items-center">
              <CardTitle className={`text-black font-bold ${isMobile ? 'text-base' : ''}`}>
                {pkg.title}
              </CardTitle>
              {pkg.highlight && !isMobile && (
                <span className="bg-kamp-primary/10 text-kamp-primary text-xs rounded-full px-2 py-1">
                  Рекомендуем
                </span>
              )}
            </div>
            <div className={`mt-2 mb-1 ${isMobile ? 'text-lg' : 'text-2xl md:text-3xl'} font-bold text-kamp-primary flex items-end`}>
              {formatPrice(pkg.price)} ₽
              {pkg.oldPrice && (
                <span className="text-gray-400 line-through text-sm ml-2">{formatPrice(pkg.oldPrice)} ₽</span>
              )}
            </div>
            {!isMobile && <CardDescription className="text-black/70">{pkg.description}</CardDescription>}
            {pkg.date && (
              <div className="text-xs md:text-sm font-medium text-black/70 mt-2 flex items-center">
                <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1 text-kamp-primary`} />
                {format(pkg.date, "d MMMM yyyy 'в' HH:mm", { locale: ru })}
              </div>
            )}
          </CardHeader>
          <CardContent className={`${isMobile ? 'pt-0 pb-2 px-4' : 'pt-6 pb-4 px-6'} flex-grow bg-white`}>
            {isMobile ? (
              <div className="text-sm text-black/70">
                {pkg.features && pkg.features[0]}
                {pkg.features.length > 1 && (
                  <div className="mt-1 text-kamp-primary text-xs">+еще {pkg.features.length - 1} преимуществ</div>
                )}
              </div>
            ) : (
              <ul className="space-y-1 md:space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-black text-sm md:text-base">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-kamp-primary shrink-0 mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter className="mt-auto bg-white p-4 md:p-6">
            <Button 
              className={`w-full bg-kamp-primary hover:bg-kamp-accent text-white font-medium shadow-md ${isMobile ? 'text-sm py-1.5 flex items-center justify-center gap-1' : 'py-1.5 md:py-2.5'}`}
              onClick={() => onSelectPackage(pkg)}
            >
              Выбрать
              {isMobile && <ArrowRight className="h-3 w-3" />}
            </Button>
          </CardFooter>

          {isMobile && (
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-kamp-primary to-transparent opacity-20"></div>
          )}
        </Card>
      ))}
    </div>
  );
};
