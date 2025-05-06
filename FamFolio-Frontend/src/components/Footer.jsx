"use client"
import { motion } from "framer-motion"

const Footer = () => {
  const footerLinks = [
    { name: "Home", url: "#" },
    { name: "Login", url: "#login" },
    { name: "GitHub", url: "https://github.com" },
    { name: "Contact", url: "#contact" },
  ]

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Wave SVG */}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <motion.div
              className="flex items-center mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
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
            </motion.div>
            <p className="text-blue-100 opacity-90 mb-4">
              Empowering families to manage finances together with smart tools and insights.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <a href={link.url} className="text-blue-200 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-blue-100 opacity-90 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-4 py-2 rounded-l-full border border-blue-700 bg-blue-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-r-full"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-700 my-6"></div>

        {/* Copyright */}
        <div className="text-center text-blue-200 opacity-90">
          <p>© 2025 FamFolio — Built with ❤️ at DU Hacks 4.0</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer