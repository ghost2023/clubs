'use client';
import { FC, useEffect, useState } from 'react';
import Sidebar from './Sidebar';

const MainLayout: FC<{ children: React.ReactNode; storeId?: string }> = ({
  children,
  storeId,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => {
    return typeof window != 'undefined' ? window.innerWidth : 820;
  });

  useEffect(() => {
    if (typeof window == 'undefined') return;
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the resize event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex">
      {windowWidth > 768 && (
        <div className="max-w-[200px] w-full shrink-0"></div>
      )}
      <Sidebar windowWidth={windowWidth} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 md:pr-2">

        {children}
      </div>
    </div>
  );
};

export default MainLayout;
