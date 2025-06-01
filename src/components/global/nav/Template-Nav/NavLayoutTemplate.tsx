/*
|-----------------------------------------
| setting up NavLayoutTemplate for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: tecmart-template, May, 2025
|-----------------------------------------
*/

import { ModeToggle } from '@/lib/mode-toggle';
import CustomNav1 from '../Nav1/CustomNav1';
import CustomNav2 from '../Nav2/CustomNav2';

const NavLayoutTemplate = () => {
  const isFixedToTop = true;
  return (
    <>
      <CustomNav1 />
      {isFixedToTop ? (
        <div className="sticky top-0 z-50 w-full bg-opacity-60 md:bg-opacity-40 backdrop-blur border-b-1 border-b-slate-600">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row px-4 centralized-center gap-4">
            <CustomNav2 />
            <ModeToggle />
          </div>
        </div>
      ) : (
        <CustomNav2 />
      )}
    </>
  );
};
export default NavLayoutTemplate;
