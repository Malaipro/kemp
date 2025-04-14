
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
import { CheckCircle, XCircle } from 'lucide-react';
import { servicePackages, ServicePackage, formatPrice } from './servicePackagesData';
import { useIsMobile } from '@/hooks/use-mobile';

interface PackageTableProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
}

export const PackageTable = ({ packages, onSelectPackage }: PackageTableProps) => {
  const isMobile = useIsMobile();

  // Simplified table for mobile view
  if (isMobile) {
    return (
      <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white">
        <div className="overflow-x-auto text-xs">
          <Table className="w-full">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="text-left p-1 border-b text-black font-semibold">Услуга</TableHead>
                <TableHead className="text-center p-1 border-b text-black font-semibold w-[55px]">Демо</TableHead>
                <TableHead className="text-center p-1 border-b text-black font-semibold w-[55px]">Баз.</TableHead>
                <TableHead className="text-center p-1 border-b text-black font-semibold w-[55px]">Прем.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-white">
                <TableCell className="p-1 border-b text-black font-medium text-xs">Стоимость</TableCell>
                <TableCell className="text-center p-1 border-b text-black text-xs">{formatPrice(600)}</TableCell>
                <TableCell className="text-center p-1 border-b text-black text-xs">{formatPrice(20400)}</TableCell>
                <TableCell className="text-center p-1 border-b text-black text-xs">{formatPrice(34900)}</TableCell>
              </TableRow>
              <TableRow className="bg-gray-50">
                <TableCell className="p-1 border-b text-black font-medium text-xs">Тренировки</TableCell>
                <TableCell className="text-center p-1 border-b">
                  <CheckCircle className="h-3 w-3 text-kamp-primary mx-auto" />
                </TableCell>
                <TableCell className="text-center p-1 border-b">
                  <CheckCircle className="h-3 w-3 text-kamp-primary mx-auto" />
                </TableCell>
                <TableCell className="text-center p-1 border-b">
                  <CheckCircle className="h-3 w-3 text-kamp-primary mx-auto" />
                </TableCell>
              </TableRow>
              <TableRow className="bg-white">
                <TableCell className="p-1 border-b text-black font-medium text-xs">Функциональные</TableCell>
                <TableCell className="text-center p-1 border-b">
                  <XCircle className="h-3 w-3 text-gray-300 mx-auto" />
                </TableCell>
                <TableCell className="text-center p-1 border-b">
                  <CheckCircle className="h-3 w-3 text-kamp-primary mx-auto" />
                </TableCell>
                <TableCell className="text-center p-1 border-b">
                  <CheckCircle className="h-3 w-3 text-kamp-primary mx-auto" />
                </TableCell>
              </TableRow>
              <TableRow className="bg-gray-50">
                <TableCell className="p-1 border-b text-black font-medium text-xs">Выездные</TableCell>
                <TableCell className="text-center p-1 border-b">
                  <XCircle className="h-3 w-3 text-gray-300 mx-auto" />
                </TableCell>
                <TableCell className="text-center p-1 border-b">
                  <CheckCircle className="h-3 w-3 text-kamp-primary mx-auto" />
                </TableCell>
                <TableCell className="text-center p-1 border-b">
                  <CheckCircle className="h-3 w-3 text-kamp-primary mx-auto" />
                </TableCell>
              </TableRow>
              <TableRow className="bg-white">
                <TableCell className="p-1 border-b text-black font-medium text-xs">Индивидуальное</TableCell>
                <TableCell className="text-center p-1 border-b">
                  <XCircle className="h-3 w-3 text-gray-300 mx-auto" />
                </TableCell>
                <TableCell className="text-center p-1 border-b">
                  <XCircle className="h-3 w-3 text-gray-300 mx-auto" />
                </TableCell>
                <TableCell className="text-center p-1 border-b">
                  <CheckCircle className="h-3 w-3 text-kamp-primary mx-auto" />
                </TableCell>
              </TableRow>
              <TableRow className="bg-gray-50">
                <TableCell className="p-1 border-b text-black font-medium text-xs">План питания</TableCell>
                <TableCell className="text-center p-1 border-b">
                  <XCircle className="h-3 w-3 text-gray-300 mx-auto" />
                </TableCell>
                <TableCell className="text-center p-1 border-b">
                  <XCircle className="h-3 w-3 text-gray-300 mx-auto" />
                </TableCell>
                <TableCell className="text-center p-1 border-b">
                  <CheckCircle className="h-3 w-3 text-kamp-primary mx-auto" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="p-1">
                  <div className="flex flex-row gap-1 mt-1 justify-between">
                    {packages.map((pkg) => (
                      <Button 
                        key={pkg.id}
                        className={`w-full text-white text-xs py-0.5 ${pkg.highlight ? 'bg-kamp-primary hover:bg-kamp-primary/90' : 'bg-gray-700 hover:bg-gray-600'}`}
                        onClick={() => onSelectPackage(pkg)}
                      >
                        {pkg.title === "Демо" ? "Демо" : pkg.title === "Базовый" ? "Баз." : "Прем."}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <div className="overflow-x-auto text-sm">
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
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="text-center">
                      <Button 
                        className={`w-full text-white ${pkg.highlight ? 'bg-kamp-primary hover:bg-kamp-primary/90' : 'bg-gray-700 hover:bg-gray-600'}`}
                        onClick={() => onSelectPackage(pkg)}
                      >
                        Выбрать {pkg.title}
                      </Button>
                    </div>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
