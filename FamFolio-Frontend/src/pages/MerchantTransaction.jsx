import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AtSign, Lock, Check, AlertCircle, ShoppingCart, Utensils, Home, Lightbulb, Wifi, Bus, Car, Dumbbell, HeartPulse, Shield, Film, ShoppingBag, Plane, GraduationCap, Gift, Scissors,  ChartLine } from "lucide-react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: 1, icon: ShoppingCart, name: "Groceries", description: "Food and household essentials" },
  { id: 2, icon: Utensils, name: "Dining Out", description: "Restaurants, cafes, and takeout" },
  { id: 3, icon: Home, name: "Rent/Mortgage", description: "Housing payments" },
  { id: 4, icon: Lightbulb, name: "Utilities", description: "Electricity, water, gas, etc." },
  { id: 5, icon: Wifi, name: "Internet & Phone", description: "Internet and mobile services" },
  { id: 6, icon: Bus, name: "Transportation", description: "Public transport, taxis, rideshares" },
  { id: 7, icon: Car, name: "Car Expenses", description: "Fuel, maintenance, insurance" },
  { id: 8, icon: Dumbbell, name: "Health & Fitness", description: "Gym memberships, supplements" },
  { id: 9, icon: HeartPulse, name: "Medical", description: "Doctor visits, prescriptions" },
  { id: 10, icon: Shield, name: "Insurance", description: "Health, life, property insurance" },
  { id: 11, icon: Film, name: "Entertainment", description: "Movies, concerts, streaming services" },
  { id: 12, icon: ShoppingBag, name: "Shopping", description: "Clothing, electronics, general purchases" },
  { id: 13, icon: Plane, name: "Travel", description: "Flights, hotels, vacations" },
  { id: 14, icon: GraduationCap, name: "Education", description: "Tuition, books, courses" },
  { id: 15, icon: Gift, name: "Gifts & Donations", description: "Presents and charitable giving" },
  { id: 16, icon: Scissors, name: "Personal Care", description: "Haircuts, cosmetics, spa" },
  { id: 17, icon: Gift, name: "Home Maintenance", description: "Repairs, cleaning supplies" },
  { id: 18, icon: ChartLine, name: "Investments", description: "Stocks, retirement contributions" },
  { id: 19, icon: Gift, name: "Childcare", description: "Babysitting, school fees" },
  { id: 20, icon: Gift, name: "Pet Care", description: "Food, vet visits, pet supplies" },
];

const MerchantTransaction = () => {
  const [formData, setFormData] = useState({
    amount: "",
    upiId: "",
    upiPin: "",
    merchantName: "",
    location: "",
    destinationIdentifier: "",
    categoryId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errors, setErrors] = useState({
    amount: "",
    upiId: "",
    upiPin: "",
    merchantName: "",
    location: "",
    destinationIdentifier: "",
    categoryId: "",
  });
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      amount: "",
      upiId: "",
      upiPin: "",
      merchantName: "",
      location: "",
      destinationIdentifier: "",
      categoryId: "",
    };

    // Validate amount
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
      valid = false;
    } else if (isNaN(formData.amount) || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
      valid = false;
    }

    // Validate UPI ID
    if (!formData.upiId) {
      newErrors.upiId = "UPI ID is required";
      valid = false;
    } else if (!formData.upiId.includes("@")) {
      newErrors.upiId = "Please enter a valid UPI ID";
      valid = false;
    }

    // Validate UPI PIN
    if (!formData.upiPin) {
      newErrors.upiPin = "UPI PIN is required";
      valid = false;
    } else if (formData.upiPin.length !== 4 || isNaN(formData.upiPin)) {
      newErrors.upiPin = "UPI PIN must be a 4-digit number";
      valid = false;
    }

    // Validate merchant name
    if (!formData.merchantName) {
      newErrors.merchantName = "Merchant name is required";
      valid = false;
    }

    // Validate location
    if (!formData.location) {
      newErrors.location = "Location is required";
      valid = false;
    }

    // Validate destination identifier
    if (!formData.destinationIdentifier) {
      newErrors.destinationIdentifier = "Merchant ID is required";
      valid = false;
    }

    // Validate category
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
  
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const username = localStorage.getItem("username");
      if (!username) {
        throw new Error("User not authenticated");
      }

      const selectedCategory = categories.find(cat => cat.id === parseInt(formData.categoryId));
      
      const requestBody = {
        paymentMethod: "UPI",
        paymentPurpose: selectedCategory.description,
        categoryId: parseInt(formData.categoryId),
        username: username,
        destinationType: "merchant",
        destinationIdentifier: formData.destinationIdentifier,
        amount: parseFloat(formData.amount),
        merchantName: formData.merchantName,
        location: formData.location
      };
      console.log(requestBody)
      const response = await fetch("http://localhost:8080/api/payments/external", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }

      setIsSuccess(true);
      setShowConfetti(true);

      // Hide confetti after 5 seconds and redirect to home
      setTimeout(() => {
        setShowConfetti(false);
        navigate("/");
      }, 5000);
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.message || "Payment failed. Please try again." }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      amount: "",
      upiId: "",
      upiPin: "",
      merchantName: "",
      location: "",
      destinationIdentifier: "",
      categoryId: "",
    });
    setIsSuccess(false);
    setIsLoading(false);
  };

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
  };

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
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    tap: { scale: 0.98 },
  };

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
  };

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

        {errors.form && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
          >
            {errors.form}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Amount Field */}
          <motion.div variants={itemVariants} className="mb-4">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="relative"> 
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-400">₹</span>
              </div>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
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

          {/* Merchant Name Field */}
          <motion.div variants={itemVariants} className="mb-4">
            <label htmlFor="merchantName" className="mb-2 block text-sm font-medium text-gray-700">
              Merchant Name
            </label>
            <input
              type="text"
              id="merchantName"
              name="merchantName"
              value={formData.merchantName}
              onChange={handleChange}
              placeholder="e.g. FreshMart Supermarket"
              className={`block w-full rounded-lg border ${
                errors.merchantName ? "border-red-300" : "border-gray-300"
              } bg-gray-50 p-3 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
              disabled={isLoading || isSuccess}
            />
            {errors.merchantName && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.merchantName}
              </motion.p>
            )}
          </motion.div>

          {/* Location Field */}
          <motion.div variants={itemVariants} className="mb-4">
            <label htmlFor="location" className="mb-2 block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. 123 Main St, Cityville"
              className={`block w-full rounded-lg border ${
                errors.location ? "border-red-300" : "border-gray-300"
              } bg-gray-50 p-3 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
              disabled={isLoading || isSuccess}
            />
            {errors.location && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.location}
              </motion.p>
            )}
          </motion.div>

          {/* Merchant ID Field */}
          <motion.div variants={itemVariants} className="mb-4">
            <label htmlFor="destinationIdentifier" className="mb-2 block text-sm font-medium text-gray-700">
              Merchant ID
            </label>
            <input
              type="text"
              id="destinationIdentifier"
              name="destinationIdentifier"
              value={formData.destinationIdentifier}
              onChange={handleChange}
              placeholder="e.g. SUPERMARKET-12345"
              className={`block w-full rounded-lg border ${
                errors.destinationIdentifier ? "border-red-300" : "border-gray-300"
              } bg-gray-50 p-3 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
              disabled={isLoading || isSuccess}
            />
            {errors.destinationIdentifier && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.destinationIdentifier}
              </motion.p>
            )}
          </motion.div>

          {/* Category Selection */}
          <motion.div variants={itemVariants} className="mb-4">
            <label htmlFor="categoryId" className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`block w-full rounded-lg border ${
                errors.categoryId ? "border-red-300" : "border-gray-300"
              } bg-gray-50 p-3 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200`}
              disabled={isLoading || isSuccess}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.categoryId}
              </motion.p>
            )}
          </motion.div>

          {/* UPI ID Field */}
          <motion.div variants={itemVariants} className="mb-4">
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
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
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
                name="upiPin"
                value={formData.upiPin}
                onChange={handleChange}
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
                    ₹{formData.amount} paid to {formData.merchantName}
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
  );
};

export default MerchantTransaction;