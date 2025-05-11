"use client"

import { useState } from "react"
import { CreditCard, Wallet } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "../App"

const LinkWallet = () => {
  const navigate = useNavigate()
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")

  // Card form state
  const [cardNumber, setCardNumber] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  // UPI form state
  const [upiId, setUpiId] = useState("")
  const [upiPin, setUpiPin] = useState("")

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAmountChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "")
    setAmount(value)
  }

  const handleCardNumberChange = (e) => {
    // Format card number with spaces after every 4 digits
    const value = e.target.value.replace(/\s/g, "").replace(/[^0-9]/g, "")
    const formattedValue = value.replace(/(.{4})/g, "$1 ").trim()
    setCardNumber(formattedValue.substring(0, 19)) // Limit to 16 digits + 3 spaces
  }

  const handleExpiryDateChange = (e) => {
    // Format expiry date as MM/YY
    const value = e.target.value.replace(/[^0-9]/g, "")
    if (value.length <= 2) {
      setExpiryDate(value)
    } else {
      setExpiryDate(`${value.substring(0, 2)}/${value.substring(2, 4)}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Get username and JWT token from localStorage
      const username = localStorage.getItem("username")
      const jwtToken = localStorage.getItem("jwt")

      if (!username || !jwtToken) {
        throw new Error("Authentication information not found. Please log in again.")
      }

      // Validate amount
      if (!amount || isNaN(amount) ){
        throw new Error("Please enter a valid amount")
      }

      // Prepare request body based on payment method
      const requestBody = {
        amount: parseFloat(amount),
        updatetype: "increment"
      }

      if (paymentMethod === "card") {
        // Validate card details
        // if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
        //   throw new Error("Please enter a valid 16-digit card number")
        // }
        if (!expiryDate || expiryDate.length !== 5) {
          throw new Error("Please enter a valid expiry date (MM/YY)")
        }
        if (!cvv || cvv.length !== 3) {
          throw new Error("Please enter a valid 3-digit CVV")
        }

        requestBody.type = "CARD"
        requestBody.verificationid = cardNumber.replace(/\s+/g, '');// Remove spaces from card number
        requestBody.pin = cvv
      } else if (paymentMethod === "upi") {
        // Validate UPI details
        if (!upiId || !upiId.includes("@")) {
          throw new Error("Please enter a valid UPI ID")
        }
        if (!upiPin || upiPin.length !== 4) {
          throw new Error("Please enter a valid 4-digit UPI PIN")
        }

        requestBody.type = "UPI"
        requestBody.verificationid = upiId
        requestBody.pin = upiPin
      }

      console.log(requestBody)
      // Make the API call
      // await axios.put(
      //   `http://localhost:8080/api/wallets/update-balance/${username}`,
      //   requestBody,
      //   {
      //     headers: {
      //       "Authorization": `Bearer ${jwtToken}`,
      //       "Content-Type": "application/json"
      //     }
      //   }
      // )

       await axiosInstance.put(
        `/api/wallets/update-balance/${username}`,
        requestBody,
        {
          headers: {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": "application/json"
          }
        }
      )
      // If successful, redirect to home page
      navigate("/")
    } catch (error) {
      console.error("Payment failed:", error)
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Payment failed. Please try again."
      setError(errorMessage)
      window.alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
      {/* Abstract blobs for decoration */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-blue-200 opacity-40 blur-3xl"></div>

      <div className="w-full max-w-lg bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Wallet className="mr-2 text-blue-500" size={24} />
            Add Funds to Your Wallet
          </h1>
          <p className="text-gray-500 text-sm md:text-base">Choose how you want to transfer money</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                  paymentMethod === "card"
                    ? "bg-blue-50 border-blue-400 text-blue-600 shadow-inner"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <CreditCard className="mb-2" size={20} />
                <span className="text-sm font-medium">Credit/Debit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                  paymentMethod === "upi"
                    ? "bg-blue-50 border-blue-400 text-blue-600 shadow-inner"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg
                  className="mb-2"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm font-medium">UPI Transfer</span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Transfer (₹)
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Payment Details Section */}
          <div className="space-y-4">
            {/* Credit/Debit Card Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder's Name
                  </label>
                  <input
                    type="text"
                    id="cardholderName"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      maxLength="5"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="password"
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, "").substring(0, 3))}
                      placeholder="123"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI Form */}
            {paymentMethod === "upi" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="john@okhdfcbank"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="upiPin" className="block text-sm font-medium text-gray-700 mb-2">
                    UPI PIN
                  </label>
                  <input
                    type="password"
                    id="upiPin"
                    value={upiPin}
                    onChange={(e) => setUpiPin(e.target.value.replace(/[^0-9]/g, "").substring(0, 6))}
                    placeholder="Enter UPI PIN"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    maxLength="6"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Make Payment Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium shadow-md ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600 hover:to-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all transform hover:-translate-y-0.5`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Make Payment"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LinkWallet