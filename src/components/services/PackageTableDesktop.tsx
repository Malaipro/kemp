
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
import { ServicePackage, formatPrice } from './servicePackagesData';

interface PackageTableDesktopProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
}

export const PackageTableDesktop = ({ packages, onSelectPackage }: PackageTableDesktopProps) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-left p-2 md:p-4 border-b text-black font-semibold text-xs md:text-sm">Услуга</TableHead>
              <TableHead className="text-center p-2 md:p-4 border-b text-black font-semibold text-xs md:text-sm">
                <span>Демо</span>
              </TableHead>
              <TableHead className="text-center p-2 md:p-4 border-b text-black font-semibold text-xs md:text-sm">
                <span>Базовый</span>
              </TableHead>
              <TableHead className="text-center p-2 md:p-4 border-b text-black font-semibold text-xs md:text-sm">
                <span>Премиум</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <FeatureItemRow 
              title="Стоимость" 
              values={[`${formatPrice(600)} ₽`, `${formatPrice(20400)} ₽`, `${formatPrice(34900)} ₽`]} 
              bgWhite={true}
            />
            <FeatureItemRow 
              title="Тренировки по кикбоксингу" 
              values={["1", "10", "10"]} 
              bgWhite={false}
            />
            <FeatureItemRow 
              title="Функциональные тренировки" 
              values={["-", "8", "8"]} 
              bgWhite={true}
            />
            <FeatureItemRow 
              title="Выездные мероприятия" 
              values={["-", "2", "4"]} 
              bgWhite={false}
            />
            <SpecialFeatureRow 
              title="Индивидуальное сопровождение" 
              values={[false, false, true]} 
              bgWhite={true}
            />
            <SpecialFeatureRow 
              title="План питания" 
              values={[false, false, true]} 
              bgWhite={false}
            />
            <TableRow>
              <TableCell colSpan={4} className="p-2 md:p-4">
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="text-center">
                      <Button 
                        className={`w-full text-white text-xs md:text-sm ${pkg.highlight ? 'bg-kamp-primary hover:bg-kamp-primary/90' : 'bg-gray-700 hover:bg-gray-600'}`}
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

// Helper component for rendering standard feature rows
interface FeatureItemRowProps {
  title: string;
  values: string[];
  bgWhite?: boolean;
}

const FeatureItemRow = ({ title, values, bgWhite = false }: FeatureItemRowProps) => {
  return (
    <TableRow className={bgWhite ? "bg-white" : "bg-gray-50"}>
      <TableCell className="p-2 md:p-4 border-b text-black font-medium text-xs md:text-sm">{title}</TableCell>
      {values.map((value, index) => (
        <TableCell key={index} className="text-center p-2 md:p-4 border-b text-black text-xs md:text-sm">
          {value}
        </TableCell>
      ))}
    </TableRow>
  );
};

// Helper component for rendering feature rows with checkmarks
interface SpecialFeatureRowProps {
  title: string;
  values: boolean[];
  bgWhite?: boolean;
}

const SpecialFeatureRow = ({ title, values, bgWhite = false }: SpecialFeatureRowProps) => {
  return (
    <TableRow className={bgWhite ? "bg-white" : "bg-gray-50"}>
      <TableCell className="p-2 md:p-4 border-b text-black font-medium text-xs md:text-sm">{title}</TableCell>
      {values.map((value, index) => (
        <TableCell key={index} className="text-center p-2 md:p-4 border-b text-black text-xs md:text-sm">
          {value ? (
            <CheckCircle className="h-4 w-4 text-kamp-primary mx-auto" />
          ) : (
            "-"
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};
