import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Link Wallet", path: "/link-wallet" },
    { name: "Add Member", path: "/add-member" },
    { name: "Make Payment", path: "/merchant-transaction" },
    { name: "Create Rules", path: "/rules" },
    { name: "Parent Dashboard", path: "/parent-dashboard" },
    { name: "Member Dashboard", path: "/member-dashboard" },
    { name: "Admin Dashboard", path: "/admin-dashboard" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" }
  ];

  const handleGetStarted = () => {
    navigate("/login");
  };

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
        {/* Logo */}
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-100 text-transparent bg-clip-text">
              FamFolio
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation - Tightened spacing */}
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

        {/* Get Started Button - Compact version */}
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

        {/* Mobile Menu Button */}
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
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
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
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-blue-900 font-semibold py-2 px-4 rounded-full shadow-md w-full text-base mt-1"
              onClick={() => {
                handleGetStarted();
                setMobileMenuOpen(false);
              }}
            >
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;