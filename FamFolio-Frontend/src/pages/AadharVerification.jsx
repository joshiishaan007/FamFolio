"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const AadharVerification = () => {
  const [formData, setFormData] = useState({
    aadharNumber: "",
    dateOfBirth: "",
    name: "",
  })
  const [showOtp, setShowOtp] = useState(false)

  // Mask Aadhar number to show only last 4 digits
  const maskAadhar = (value) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 4) return digits
    
    const masked = "XXXX-XXXX-" + digits.slice(-4)
    return masked
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "aadharNumber") {
      // Only allow numbers and limit to 12 digits
      const digits = value.replace(/\D/g, "").slice(0, 12)
      setFormData({ ...formData, [name]: digits })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validate form
    if (formData.aadharNumber.length === 12 && formData.dateOfBirth && formData.name) {
      setShowOtp(true)
    } else {
      alert("Please fill all fields correctly. Aadhar number must be 12 digits.")
    }
  }

  if (showOtp) {
    return <Otp userData={formData} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <h1 className="text-2xl font-bold text-blue-800 text-center mb-2">Aadhar Verification</h1>
            <p className="text-blue-600 text-center mb-6">Please enter your Aadhar details to proceed</p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div>
  <label className="block text-blue-700 text-sm font-medium mb-2" htmlFor="aadharNumber">
    Aadhar Number
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-blue-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 2a3 3 0 100 6 3 3 0 000-6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <input
      type="text"
      id="aadharNumber"
      name="aadharNumber"
      value={formData.aadharNumber}
      onChange={(e) => {
        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 12)
        setFormData({ ...formData, aadharNumber: digitsOnly })
      }}
      className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-80 border border-blue-200 rounded-xl text-blue-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      placeholder="Enter 12-digit Aadhar number"
      required
    />
  </div>
  <p className="mt-1 text-xs text-blue-500">Only 12-digit numeric input allowed</p>
</div>

              <div>
                <label className="block text-blue-700 text-sm font-medium mb-2" htmlFor="dateOfBirth">
                  Date of Birth (as per Aadhar)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-80 border border-blue-200 rounded-xl text-blue-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-700 text-sm font-medium mb-2" htmlFor="name">
                  Full Name (as per Aadhar)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-80 border border-blue-200 rounded-xl text-blue-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <motion.button
                  type="submit"
                  className="px-8 py-2 mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-[1.02]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get OTP
                </motion.button>
              </div>
            </motion.div>
          </form>

          <motion.div
            className="mt-8 text-center text-sm text-blue-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p>Your information is secure and will only be used for verification purposes.</p>
          </motion.div>
        </div>

        <motion.div
          className="w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        ></motion.div>
      </motion.div>
    </div>
  )
}

export default AadharVerification

// Temporary Otp component placeholder
const Otp = ({ userData }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-blue-800 text-center mb-4">OTP Verification</h2>
        <p className="text-blue-600 text-center mb-6">
          OTP sent to your registered mobile number ending with ******{userData.aadharNumber.slice(-4)}
        </p>
        <div className="flex justify-center">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg">Verify OTP</button>
        </div>
      </div>
    </div>
  )
}