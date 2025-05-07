"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DollarSign, AtSign, Lock, Check, AlertCircle } from "lucide-react"
import Confetti from "react-confetti"

const MerchantTransaction = () => {
  const [amount, setAmount] = useState("")
  const [upiId, setUpiId] = useState("")
  const [upiPin, setUpiPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [errors, setErrors] = useState({
    amount: "",
    upiId: "",
    upiPin: "",
  })
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const validateForm = () => {
    let valid = true
    const newErrors = {
      amount: "",
      upiId: "",
      upiPin: "",
    }

    // Validate amount
    if (!amount) {
      newErrors.amount = "Amount is required"
      valid = false
    } else if (isNaN(amount) || Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
      valid = false
    }

    // Validate UPI ID
    if (!upiId) {
      newErrors.upiId = "UPI ID is required"
      valid = false
    } else if (!upiId.includes("@")) {
      newErrors.upiId = "Please enter a valid UPI ID"
      valid = false
    }

    // Validate UPI PIN
    if (!upiPin) {
      newErrors.upiPin = "UPI PIN is required"
      valid = false
    } else if (upiPin.length !== 4 || isNaN(upiPin)) {
      newErrors.upiPin = "UPI PIN must be a 4-digit number"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      setShowConfetti(true)

      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
    }, 2000)
  }

  const handleReset = () => {
    setAmount("")
    setUpiId("")
    setUpiPin("")
    setIsSuccess(false)
    setIsLoading(false)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    tap: { scale: 0.98 },
  }

  const successIconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.2, 1],
      opacity: 1,
      transition: {
        duration: 0.5,
        times: [0, 0.6, 1],
      },
    },
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} />}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-xl"
      >
        <motion.h1 variants={itemVariants} className="mb-6 text-center text-2xl font-bold text-blue-800">
          Pay a Merchant
        </motion.h1>

        <form onSubmit={handleSubmit}>
          {/* Amount Field */}
          <motion.div variants={itemVariants} className="mb-5">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-700">
              Amount (₹)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount e.g. 250"
                className={`block w-full rounded-lg border ${
                  errors.amount ? "border-red-300" : "border-gray-300"
                } bg-gray-50 p-3 pl-10 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                disabled={isLoading || isSuccess}
              />
            </div>
            {errors.amount && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.amount}
              </motion.p>
            )}
          </motion.div>

          {/* UPI ID Field */}
          <motion.div variants={itemVariants} className="mb-5">
            <label htmlFor="upiId" className="mb-2 block text-sm font-medium text-gray-700">
              Merchant UPI ID
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <AtSign size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="upiId"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="merchant@upi"
                className={`block w-full rounded-lg border ${
                  errors.upiId ? "border-red-300" : "border-gray-300"
                } bg-gray-50 p-3 pl-10 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                disabled={isLoading || isSuccess}
              />
            </div>
            {errors.upiId && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.upiId}
              </motion.p>
            )}
          </motion.div>

          {/* UPI PIN Field */}
          <motion.div variants={itemVariants} className="mb-6">
            <label htmlFor="upiPin" className="mb-2 block text-sm font-medium text-gray-700">
              UPI PIN
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                id="upiPin"
                value={upiPin}
                onChange={(e) => setUpiPin(e.target.value)}
                placeholder="••••"
                maxLength={4}
                className={`block w-full rounded-lg border ${
                  errors.upiPin ? "border-red-300" : "border-gray-300"
                } bg-gray-50 p-3 pl-10 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                disabled={isLoading || isSuccess}
              />
            </div>
            {errors.upiPin && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.upiPin}
              </motion.p>
            )}
            <p className="mt-1 text-xs text-gray-500">Entered securely via PSP</p>
          </motion.div>

          {/* Info Note */}
          <motion.div
            variants={itemVariants}
            className="mb-6 flex items-start rounded-lg bg-blue-50 p-3 text-sm text-blue-800"
          >
            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>Your payment information is securely processed. Never share your UPI PIN with anyone.</p>
          </motion.div>

          {/* Payment Button */}
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.button
                  key="payment-button"
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={isLoading}
                  className="relative flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-center font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>Make Payment</span>
                  )}
                </motion.button>
              ) : (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <motion.div variants={successIconVariants} initial="hidden" animate="visible">
                      <Check size={32} className="text-green-600" />
                    </motion.div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-green-600">Payment Successful</h3>
                  <p className="mb-6 text-center text-sm text-gray-600">
                    ₹{amount} paid to {upiId}
                  </p>
                  <motion.button
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleReset}
                    className="rounded-lg bg-blue-100 px-6 py-2 text-blue-700 transition-colors hover:bg-blue-200"
                  >
                    Make Another Payment
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}

export default MerchantTransaction
