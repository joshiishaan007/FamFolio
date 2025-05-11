"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { axiosInstance } from "../App"
 import { useLocation, useNavigate } from "react-router-dom" //
const Otp = ({ userData }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const inputRefs = useRef([])
  
  const location = useLocation()
  const navigate = useNavigate()
   const { aadharNumber, name, dateOfBirth } = location.state || {}
      
  // Focus on first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index, e) => {
    const value = e.target.value

    // Only allow numbers
    if (/[^0-9]/.test(value)) return

    // Update the OTP array
    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1) // Only take the first character
    setOtp(newOtp)

    // Auto-focus next input if current input is filled
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData
      .getData("text/plain")
      .slice(0, 6)
      .replace(/[^0-9]/g, "")

    if (pastedData) {
      const newOtp = [...otp]
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i]
      }
      setOtp(newOtp)

      // Focus on the next empty input or the last one
      const lastFilledIndex = Math.min(pastedData.length, 5)
      if (inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex].focus()
      }
    }
  }

  const handleSubmit = async (e) => {
    console.log(aadharNumber);
    e.preventDefault()
    const otpValue = otp.join("")
    setError("")
     console.log(otpValue);
     
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setIsVerifying(true)

    try {
     
      const response = await axiosInstance.post(
        "/api/aadhaar/validateOtp",
        {
          aadhaarNumber: aadharNumber,
          otp: otpValue
        },
        { withCredentials: true }
      )

      if (response.data && response.data === "OTP verified successfully") {
       navigate("/register", { state:aadharNumber })
      } else {
        throw new Error("Invalid OTP")
      }
    } catch (error) {
      console.error("OTP validation failed:", error)
      setError(error.response?.data || "Invalid OTP. Please try again.")
      
      // For invalid OTP, redirect back to Aadhar verification after 3 seconds
      setTimeout(() => {
        navigate("/aadhar-verification")
      }, 3000)
    } finally {
      setIsVerifying(false)
    }
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
            <h1 className="text-2xl font-bold text-blue-800 text-center mb-2">OTP Verification</h1>
            <p className="text-blue-600 text-center mb-6">
              Enter the 6-digit OTP sent to your registered email
            </p>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} onPaste={handlePaste}>
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div>
                <label className="block text-blue-700 text-sm font-medium mb-3" htmlFor="otp">
                  One-Time Password
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                      className="w-full"
                    >
                      <input
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="password"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-full aspect-square text-center text-xl font-bold bg-white bg-opacity-80 border border-blue-200 rounded-xl text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        required
                      />
                    </motion.div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-blue-500 text-center">
                  Didn't receive the OTP?{" "}
                  <button type="button" className="text-blue-700 font-medium hover:underline">
                    Resend
                  </button>
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <motion.button
                  type="submit"
                  disabled={isVerifying}
                  className={`px-8 py-2 mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-[1.02] ${
                    isVerifying ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600 hover:to-blue-700"
                  }`}
                  whileHover={{ scale: isVerifying ? 1 : 1.05 }}
                  whileTap={{ scale: isVerifying ? 1 : 0.95 }}
                >
                  {isVerifying ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </div>
                  ) : (
                    "Verify OTP"
                  )}
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

export default Otp