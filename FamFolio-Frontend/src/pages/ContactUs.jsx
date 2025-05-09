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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Using FormSubmit.co free service
      const response = await fetch("https://formsubmit.co/ajax/your-famfolio2004@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // Reset form after successful submission
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          message: "",
        })
        
        setSubmitStatus({
          success: true,
          message: "Thank you for your message! We'll get back to you soon."
        })
      } else {
        throw new Error(result.message || "Failed to send message")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      setSubmitStatus({
        success: false,
        message: error.message || "Failed to send message. Please try again later."
      })
    } finally {
      setIsSubmitting(false)
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({
          success: false,
          message: ""
        })
      }, 5000)
    }
  }

  // Animation variants (same as before)
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

  return (
    <div className="w-full min-h-screen font-sans text-gray-800 bg-gray-50">
      {/* Hero Header Section */}
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
      <div className="max-w-7xl mx-auto -mt-16 mb-20 bg-white/95 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md border border-white/20 p-5">
        <div className="flex flex-wrap p-6 md:p-8 gap-10">
          {/* Contact Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 min-w-[300px] md:min-w-[500px] p-4"
          >
            {submitStatus.message && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {submitStatus.message}
              </motion.div>
            )}

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
                disabled={isSubmitting}
                className={`inline-block px-8 py-3.5 text-white border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg mt-2 ${
                  isSubmitting ? 'bg-gray-400' : 'bg-sky-500 hover:bg-sky-600 shadow-sky-200'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Make Contact'}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info (same as before) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 min-w-[300px] flex flex-col gap-5 p-4"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
              className="p-6 bg-white rounded-xl shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="text-3xl mb-4">✉️</div>
              <h3 className="text-xl font-semibold mb-2 text-sky-600">Email Us</h3>
              <p className="text-gray-600 leading-relaxed">your-email@example.com</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
              className="p-6 bg-white rounded-xl shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-2 text-sky-600">Our Location</h3>
              <p className="text-gray-600 leading-relaxed">Remote-first, globally connected</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
              className="p-6 bg-white rounded-xl shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="text-3xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold mb-2 text-sky-600">Response Time</h3>
              <p className="text-gray-600 leading-relaxed">We typically respond within 24 hours</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs