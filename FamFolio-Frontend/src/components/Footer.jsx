"use client"
import { motion } from "framer-motion"

const Footer = () => {
  const footerLinks = [
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
    { name: "Contact Us", url: "/contact" },
  ]

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
          {/* Logo and Description - Left side */}
          <div className="md:w-1/2">
            <motion.div
              className="flex items-center mb-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mr-3">
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
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-100 text-transparent bg-clip-text">
                FamFolio
              </span>
            </motion.div>
            <p className="text-blue-100 text-lg opacity-90">
              Empowering families to manage finances together.
            </p>
          </div>

          {/* Quick Links - Right side */}
          <div className="md:w-1/2 md:pl-8">
            <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <a 
                    href={link.url} 
                    className="text-blue-200 hover:text-white text-lg transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-700 my-4"></div>

        {/* Copyright */}
        <div className="text-center text-blue-200 text-lg">
          <p>© 2025 FamFolio — Your family's financial companion</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer