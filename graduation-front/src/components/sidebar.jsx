import { forwardRef } from "react";
import MOH from "../assets/logos/MOH Logo.png";
import { cn } from "../utils/cn";
import PropTypes from "prop-types";
import { navbarLinks } from "../constants";
import { NavLink } from "react-router-dom";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside
            ref={ref}
            dir="rtl" // Enable RTL direction
            className={cn(
                "fixed right-0 z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-l border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_right_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:right-[-240px]" : "max-md:right-0" // Sidebar positioned on the right
            )}
        >
            <div className="flex justify-center items-center p-3"> {/* Center the image */}
                <img
                    src={MOH}
                    alt="MOH"
                    className="dark:hidden w-16 h-16" // Adjust width and height
                />
            
                {!collapsed && (
                    <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50 text-right">
                        {/* Placeholder text */}
                    </p>
                )}
            </div>

            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin] text-right">
                {navbarLinks.map((navbarLink) => (
                    <nav
                        key={navbarLink.title}
                        className={cn("sidebar-group", collapsed && "md:items-center")}
                    >
                        <p className={cn("sidebar-group-title text-right", collapsed && "md:w-[45px]")}>
                            {navbarLink.title}
                        </p>
                        {navbarLink.links.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                className={cn(
                                    "sidebar-item flex flex-row-reverse items-center justify-end gap-x-2",
                                    collapsed && "md:w-[45px]"
                                )}
                            >
                                {/* Move the label to the left of the icon in RTL */}
                                {!collapsed && (
                                    <p className="whitespace-nowrap text-right">{link.label}</p>
                                )}
                                <link.icon size={22} className="flex-shrink-0" />
                            </NavLink>
                        ))}
                    </nav>
                ))}
            </div>
        </aside>
    );
});

export default Sidebar;
Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};