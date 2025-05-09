import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    const jwt = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!jwt);
    setUserRole(role);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate("/login");
  };

  const getNavItems = () => {
    if (!isLoggedIn) {
      return []; // Return empty array when logged out
    }

    const allNavItems = [
      { name: "Home", path: "/" },
      { name: "Top Up Wallet", path: "/link-wallet", roles: ["OWNER"] },
      { name: "Add Member", path: "/add-member", roles: ["OWNER"] },
      { name: "Make Payment", path: "/merchant-transaction", roles: ["OWNER", "MEMBER"] },
      { name: "Create Rules", path: "/rules", roles: ["OWNER"] },
      { name: "Family Dashboard", path: "/parent-dashboard", roles: ["OWNER"] },
      { name: "Member Dashboard", path: "/member-dashboard", roles: ["MEMBER","OWNER"] },
      { name: "Admin Dashboard", path: "/admin-dashboard", roles: ["ADMIN"] },
      { name: "About Us", path: "/about" },
      { name: "Contact Us", path: "/contact" }
    ];

    return allNavItems.filter(item => 
      (!item.roles || (userRole && item.roles.includes(userRole))) &&
      (isLoggedIn || item.path !== "/")
    );
  };

  const navItems = getNavItems();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-blue-900 to-blue-800 bg-opacity-90 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-r from-blue-900 to-blue-800 bg-opacity-90"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo - Always visible */}
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-indian-rupee-icon lucide-indian-rupee"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-100 text-transparent bg-clip-text">
              FamFolio
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation - Only shown when logged in */}
        {isLoggedIn && (
          <nav className="hidden lg:flex items-center space-x-3 mx-2">
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="text-blue-100 hover:text-white font-medium transition-colors text-[14px] whitespace-nowrap px-1.5 py-0.5"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        )}

        {/* Auth Button - Shows Logout if logged in, Get Started if not */}
        {isLoggedIn ? (
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 5px 15px rgba(162, 218, 255, 0.4)" 
            }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold py-1.5 px-4 rounded-full shadow-md transition-all text-sm"
            onClick={handleLogout}
          >
            Logout
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 5px 15px rgba(162, 218, 255, 0.4)" 
            }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold py-1.5 px-4 rounded-full shadow-md transition-all text-sm"
            onClick={handleGetStarted}
          >
            Get Started
          </motion.button>
        )}

        {/* Mobile Menu Button - Only shown when logged in */}
        {isLoggedIn && (
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-blue-100 hover:text-white focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu - Only shown when logged in */}
      {isLoggedIn && mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-blue-800 bg-opacity-95 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="text-blue-100 hover:text-white font-medium py-1.5 transition-colors text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button 
              className="bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold py-2 px-4 rounded-full shadow-md w-full text-base mt-1"
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;