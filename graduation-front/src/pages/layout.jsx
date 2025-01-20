import Sidebar from "../components/Sidebar";
import { cn } from "../utils/cn";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../hooks/use-click-outside";

const Layout = () => {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(isDesktopDevice);
  const sidebarRef = useRef(null);

  useEffect(() => {
    setCollapsed(!isDesktopDevice);
  }, [isDesktopDevice]);

  useClickOutside([sidebarRef], () => {
    if (!isDesktopDevice && !collapsed) {
      setCollapsed(true);
    }
  });

  return (
    <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
          !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30"
        )}
      />
      {/* Move the sidebar to the right */}
      <Sidebar ref={sidebarRef} collapsed={collapsed} className="md:right-0 md:left-auto" />
      <div className={cn("transition-[margin] duration-300", collapsed ? "md:mr-[70px]" : "md:mr-[240px]")}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
