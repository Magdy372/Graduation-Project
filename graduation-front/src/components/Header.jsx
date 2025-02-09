import { useTheme } from "@emotion/react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Bell, Moon, Search, Sun } from "lucide-react";

const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button 
                    className="btn-ghost size-10" 
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
                <button className="btn-ghost size-10">
                    <Bell size={20} />
                </button>
            </div>
            <div className="flex items-center gap-x-3">
             
                <button 
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronRight className={collapsed && "rotate-180"} />
                </button>
            </div>
        </header>
    );
}

export default Header;

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
