
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { servicePackages, ServicePackage, formatPrice } from './servicePackagesData';
import { useIsMobile } from '@/hooks/use-mobile';

interface PackageTableProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
}

export const PackageTable = ({ packages, onSelectPackage }: PackageTableProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <div className={`overflow-x-auto ${isMobile ? 'text-sm' : ''}`}>
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-left p-2 md:p-4 border-b text-black font-semibold">Услуга</TableHead>
              <TableHead className="text-center p-2 md:p-4 border-b text-black font-semibold">
                <span>Демо</span>
              </TableHead>
              <TableHead className="text-center p-2 md:p-4 border-b text-black font-semibold">
                <span>Базовый</span>
              </TableHead>
              <TableHead className="text-center p-2 md:p-4 border-b text-black font-semibold">
                <span>Премиум</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-white">
              <TableCell className="p-2 md:p-4 border-b text-black font-medium">Стоимость</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">{formatPrice(600)} ₽</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">{formatPrice(20400)} ₽</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">{formatPrice(34900)} ₽</TableCell>
            </TableRow>
            <TableRow className="bg-gray-50">
              <TableCell className="p-2 md:p-4 border-b text-black font-medium">Тренировки по кикбоксингу</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">1</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">10</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">10</TableCell>
            </TableRow>
            <TableRow className="bg-white">
              <TableCell className="p-2 md:p-4 border-b text-black font-medium">Функциональные тренировки</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">-</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">8</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">8</TableCell>
            </TableRow>
            <TableRow className="bg-gray-50">
              <TableCell className="p-2 md:p-4 border-b text-black font-medium">Выездные мероприятия</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">-</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">2</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">4</TableCell>
            </TableRow>
            <TableRow className="bg-white">
              <TableCell className="p-2 md:p-4 border-b text-black font-medium">Индивидуальное сопровождение</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">-</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">-</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-kamp-primary mx-auto" />
              </TableCell>
            </TableRow>
            <TableRow className="bg-gray-50">
              <TableCell className="p-2 md:p-4 border-b text-black font-medium">План питания</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">-</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">-</TableCell>
              <TableCell className="text-center p-2 md:p-4 border-b text-black">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-kamp-primary mx-auto" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={4} className="p-2 md:p-4">
                {isMobile ? (
                  <div className="flex flex-col gap-2 mt-2">
                    {packages.map((pkg) => (
                      <Button 
                        key={pkg.id}
                        className="w-full bg-kamp-primary hover:bg-kamp-accent text-white text-sm py-1.5" 
                        onClick={() => onSelectPackage(pkg)}
                      >
                        Выбрать {pkg.title}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {packages.map((pkg) => (
                      <div key={pkg.id} className="text-center">
                        <Button 
                          className="w-full bg-kamp-primary hover:bg-kamp-accent text-white" 
                          onClick={() => onSelectPackage(pkg)}
                        >
                          Выбрать {pkg.title}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
