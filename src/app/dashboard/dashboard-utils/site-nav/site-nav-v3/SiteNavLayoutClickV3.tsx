/*
|-----------------------------------------
| setting up SiteNavLayoutClickV3 for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/

'use client';

import { useState } from 'react';

import SidebarV3 from './sidebarV3';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IoSettingsOutline } from 'react-icons/io5';
import { X } from 'lucide-react';

const SiteNavLayoutClickV3 = ({ children = null as React.ReactNode }) => {
  const [toggle, setToggle] = useState(false);
  const [mobileToggle, setMobileToggle] = useState(false);
  const handleToggle = () => setToggle(pre => !pre);
  const handleMobileToggle = () => setMobileToggle(pre => !pre);
  return (
    <main className="w-full max-h-[90vh] overflow-hidden ">
      <div className={`grid grid-cols-1 ${toggle ? 'md:grid-cols-[253px_1fr]' : 'md:grid-cols-[63px_1fr]'}`}>
        <ScrollArea className={`w-full block md:hidden ${mobileToggle ? 'h-[60px]' : 'h-screen'}`}>
          {/* Mobile */}
          <div className="block md:hidden">
            <div className="p-4 absolute w-full right-0 border-b-1 ">
              {mobileToggle ? (
                <div onClick={handleMobileToggle} className="w-full flex items-end justify-between">
                  <p>Dashboard</p>
                  <IoSettingsOutline className="w-[20px] h-[20px]" />
                </div>
              ) : (
                <div className="w-full flex flex-col h-[20px]">
                  <div onClick={handleMobileToggle} className="w-full flex items-end justify-between">
                    <p>Dashboard</p>
                    <X />
                  </div>
                  <SidebarV3 toggle={true} handleToggle={handleToggle} toggleButton />
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <SidebarV3 toggle={toggle} handleToggle={handleToggle} />
          </div>
        </ScrollArea>
        {/* Tablet & desktop */}
        <ScrollArea className={`w-full h-screen hidden md:block`}>
          <div className="hidden md:block">
            <SidebarV3 toggle={toggle} handleToggle={handleToggle} />
          </div>
        </ScrollArea>
        {/* children or content */}
        <div className=" hidden md:block border-slate-600 border-l-1">
          <ScrollArea className="h-[calc(100vh_-_62px)]">
            {children ? children : <div className="w-full min-h-screen flex items-center justify-center">First Load Component V2</div>}
          </ScrollArea>
        </div>
        <div className=" md:hidden block border-slate-600 border-l-1">
          {mobileToggle && (
            <ScrollArea className="h-[calc(100vh_-_62px)]">
              {children ? children : <div className="w-full min-h-screen flex items-center justify-center">First Load Component V2</div>}
            </ScrollArea>
          )}
        </div>
      </div>
    </main>
  );
};
export default SiteNavLayoutClickV3;
