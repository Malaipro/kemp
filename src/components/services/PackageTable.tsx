
import React from 'react';
import { PackageTableMobile } from './PackageTableMobile';
import { PackageTableDesktop } from './PackageTableDesktop';
import { ServicePackage } from './servicePackagesData';
import { useIsMobile } from '@/hooks/use-mobile';

interface PackageTableProps {
  packages: ServicePackage[];
  onSelectPackage: (pkg: ServicePackage) => void;
}

export const PackageTable = ({ packages, onSelectPackage }: PackageTableProps) => {
  const isMobile = useIsMobile();

  // Render appropriate view based on device size
  if (isMobile) {
    return <PackageTableMobile 
      packages={packages} 
      onSelectPackage={onSelectPackage} 
    />;
  }

  return <PackageTableDesktop 
    packages={packages} 
    onSelectPackage={onSelectPackage} 
  />;
};
