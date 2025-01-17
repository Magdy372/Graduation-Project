import { IoMdMenu } from "react-icons/io";
import logo from "../../assets/logos/MOH Logo.png";
import { motion } from "framer-motion";

const NavbarMenu = [
  {
    id: 1,
    title: "Home",
    path: "/",
  },
  {
    id: 2,
    title: "Courses",
    path: "/Courses",
  },
  {
    id: 3,
    title: "About Us",
    path: "/AboutUs",
  },
  {
    id: 4,
    title: "Contact Us",
    path: "ContactUs",
  },
];

const Navbar = () => {
 
  return (
    <nav className="bg-white relative z-20">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-10 flex justify-between items-center"
      >
        {/* Logo section */}
        <div>
          <img src={logo} alt="Logo" className="w-20 h-20" />
        </div>

        {/* Menu section */}
        <div className="hidden lg:block">
          <ul className="flex items-center gap-3">
            {NavbarMenu.map((menu) => (
              <li key={menu.id}>
                <a
                  href={menu.path}
                  className="inline-block py-2 px-3 hover:text-red relative group"
                >
                  <div className="w-2 h-2 bg-red absolute mt-2 rounded-full left-1/2 -translate-x-1/2 top-1/2 bottom-0 group-hover:block hidden"></div>
                  {menu.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Hamburger menu section */}
        <div className="lg:hidden">
          <IoMdMenu className="text-4xl" />
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
