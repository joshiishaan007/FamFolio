"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted:", formData)
    // Reset form after submission
    setFormData({
      fullName: "",
      email: "",
      subject: "",
      message: "",
    })
    alert("Thank you for your message! We will get back to you soon.")
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  }

  const infoCardVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="w-full min-h-screen font-sans text-gray-800 bg-gray-50">
      {/* Hero Header Section - Updated with bg-gradient-to-br from-blue-50 */}
      <div className="w-full py-20 px-4 text-center bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center items-center relative overflow-hidden">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-sky-600 drop-shadow-sm"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg max-w-2xl leading-relaxed text-gray-600 mb-5"
        >
          Have questions, feedback, or just want to say hello? We'd love to hear from you.
        </motion.p>
      </div>

      {/* Main Content Card */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={cardVariants}
        className="max-w-7xl mx-auto -mt-16 mb-20 bg-white/95 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md border border-white/20 p-5"
      >
        <div className="flex flex-wrap p-6 md:p-8 gap-10">
          {/* Contact Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 min-w-[300px] md:min-w-[500px] p-4"
          >
            <form onSubmit={handleSubmit}>
              <motion.div variants={itemVariants} className="mb-6">
                <label htmlFor="fullName" className="block mb-2 font-medium text-gray-700 text-sm">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 bg-gray-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition duration-300 shadow-sm"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700 text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 bg-gray-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition duration-300 shadow-sm"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <label htmlFor="subject" className="block mb-2 font-medium text-gray-700 text-sm">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                  className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 bg-gray-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition duration-300 shadow-sm"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <label htmlFor="message" className="block mb-2 font-medium text-gray-700 text-sm">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us what you're thinking..."
                  rows="5"
                  className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 bg-gray-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition duration-300 shadow-sm resize-vertical min-h-[120px]"
                />
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05, backgroundColor: "#0056b3" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="inline-block px-8 py-3.5 bg-sky-500 text-white border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-sky-200 hover:bg-sky-600 mt-2"
              >
                Make Contact
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 min-w-[300px] flex flex-col gap-5 p-4"
          >
            <motion.div
              variants={infoCardVariants}
              whileHover="hover"
              className="p-6 bg-white rounded-xl shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="text-3xl mb-4">✉️</div>
              <h3 className="text-xl font-semibold mb-2 text-sky-600">Email Us</h3>
              <p className="text-gray-600 leading-relaxed">contact@famfolio.com</p>
            </motion.div>

            <motion.div
              variants={infoCardVariants}
              whileHover="hover"
              className="p-6 bg-white rounded-xl shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-2 text-sky-600">Our Location</h3>
              <p className="text-gray-600 leading-relaxed">Remote-first, globally connected</p>
            </motion.div>

            <motion.div
              variants={infoCardVariants}
              whileHover="hover"
              className="p-6 bg-white rounded-xl shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="text-3xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold mb-2 text-sky-600">Response Time</h3>
              <p className="text-gray-600 leading-relaxed">We typically respond within 24 hours</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default ContactUs
