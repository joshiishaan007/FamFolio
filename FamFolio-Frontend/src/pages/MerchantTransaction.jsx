import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import axios from 'axios';
import { axiosInstance } from '../App';

const MerchantPayment = () => {
  const [formData, setFormData] = useState({
    amount: '',
    merchant: '',
    category: '',
    method: 'UPI',
    remarks: '',
    destinationUpi: ''
  });
  const [childUsername, setChildUsername] = useState('');
  const [userRole, setUserRole] = useState('MEMBER');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'success', 'failure'
  const [errorMessage, setErrorMessage] = useState([]);
  const [errors, setErrors] = useState({});
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [city,setCity] = useState(null)

  // Fetch user role and child username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role') || 'MEMBER';
    setChildUsername(storedUsername);
    setUserRole(storedRole);
  }, []);

  // Fetch categories from API
  useEffect(() => {
    axiosInstance.get(`/api/categories`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });

      navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Latitude:', latitude, 'Longitude:', longitude);

        try {
          const apiKey = '8e77c61ddcb54f8d8c7b0b4b2574fc56'; // Replace with your OpenCage key
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
          );

          const results = response.data.results;
          if (results && results.length > 0) {
            const cityName = results[0].components.city || 
                             results[0].components.town || 
                             results[0].components.village || 
                             results[0].components.state_district;
            setCity(cityName);
          } else {
            setCity('Unknown location');
          }
        } catch (error) {
          console.error('Error fetching city name:', error);
          setCity('Error retrieving location');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setCity('Permission denied or unavailable');
      }
    );

  }, []);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.merchant) {
      newErrors.merchant = 'Merchant name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.destinationUpi) {
      newErrors.destinationUpi = 'UPI ID is required';
    } else if (!/^[\w.-]+@[\w-]+$/.test(formData.destinationUpi)) {
      newErrors.destinationUpi = 'Enter a valid UPI ID (example: name@upi)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 // Check if button should be enabled
  const isFormValid = () => {
    return (
      formData.amount &&
      !isNaN(formData.amount) &&
      Number(formData.amount) > 0 &&
      formData.merchant &&
      formData.category &&
      formData.destinationUpi &&
      /^[\w.-]+@[\w-]+$/.test(formData.destinationUpi)
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const payload = {
      username: childUsername,
      amount: Number(formData.amount),
      merchantName: formData.merchant,
      categoryName: formData.category,
      paymentMethod: formData.method,
      destinationIdentifier: formData.destinationUpi,
      paymentPurpose: formData.remarks || null,
      location: city
    };

    try {
      // Get token from localStorage
      const token = localStorage.getItem('jwt');
      
      // Create headers with authorization token
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Make API call with credentials and token
      const response = await axiosInstance.post(
        `/api/payments/external`, 
        payload,
        { 
          headers,
          withCredentials: true
        }
      );

      if(response.data.paymentStatus == "COMPLETED"){
        setPaymentStatus('success');
        // setTimeout(() => setPaymentStatus(null), 5000);
      } else {
        setPaymentStatus('failure');
        axiosInstance.get(`/api/ruleViolations/${response.data.transactionId}`)
          .then(response => {
            setErrorMessage(response.data);
          })
          .catch(error => {
            console.error('Error fetching rule violation notes:', error);
          });
      }

      
      } catch (error) {
        console.error('Payment error:', error);
        setPaymentStatus('failure');
        setErrorMessage(Array.from(error.response?.data?.failureReason || 'Payment failed. Please try again.'));
        setTimeout(() => setPaymentStatus(null), 5000);
      } finally {
        setIsLoading(false);
      }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      amount: '',
      merchant: '',
      category: '',
      method: 'UPI',
      remarks: '',
      destinationUpi: '',
    });
    setPaymentStatus(null);
    setErrors({});
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center p-4">
      {paymentStatus === 'success' && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} />
      )}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <motion.h1 variants={itemVariants} className="text-2xl font-bold text-blue-800 text-center mb-6">
          Merchant Payment
        </motion.h1>

        <AnimatePresence>
          {paymentStatus ? (
            <motion.div
              key="status"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              {paymentStatus === 'success' ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h2>
                  <p className="text-gray-600 mb-4">
                    ₹{formData.amount} paid to {formData.merchant}
                  </p>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleReset}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Make Another Payment
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="bg-red-100 rounded-full p-3">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-red-600 mb-2">Payment Failed</h2>
                  {errorMessage && errorMessage.map((msg, index) => (
                    <p key={index} className="text-red-600 mb-2">{msg}</p>
                  ))}
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleReset}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Try Again
                  </motion.button>
                </>
              )}
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Amount Field */}
              <motion.div variants={itemVariants} className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount (e.g., 250)"
                    className={`w-full pl-10 pr-3 py-2 border ${errors.amount ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    disabled={isLoading}
                  />
                  <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 mt-1">
                    Enter the payment amount in rupees
                  </div>
                </div>
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </motion.div>

              {/* Merchant Field */}
              <motion.div variants={itemVariants} className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Merchant Name</label>
                <div className="relative group">
                  <input
                    type="text"
                    name="merchant"
                    value={formData.merchant}
                    onChange={handleInputChange}
                    placeholder="e.g., McDonald's"
                    className={`w-full px-3 py-2 border ${errors.merchant ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    disabled={isLoading}
                  />
                  <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 mt-1">
                    Enter the name of the merchant
                  </div>
                </div>
                {errors.merchant && <p className="text-red-500 text-xs mt-1">{errors.merchant}</p>}
              </motion.div>

              {/* Category Field */}
              <motion.div variants={itemVariants} className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="relative group">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    disabled={isLoading}
                  >
                    <option value="">Select a category</option>
                    {categories && categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 mt-1">
                    Select the category of the transaction
                  </div>
                </div>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </motion.div>

              {/* Method Field */}
              <motion.div variants={itemVariants} className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <div className="relative group">
                  <select
                    name="method"
                    value={formData.method}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading || userRole === 'MEMBER'}
                  >
                    <option value="UPI">UPI</option>
                    {userRole === 'OWNER' && <option value="Card">Bank Transfer (Card)</option>}
                  </select>
                  <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 mt-1">
                    {userRole === 'MEMBER' ? 'Only UPI is available for members' : 'Select payment method'}
                  </div>
                </div>
              </motion.div>

              {/* UPI field */}
              <motion.div variants={itemVariants} className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <div className="relative group">
                  <input
                    type="text"
                    name="destinationUpi"
                    value={formData.destinationUpi}
                    onChange={handleInputChange}
                    placeholder="e.g., name@upi"
                    className={`w-full px-3 py-2 border ${errors.destinationUpi ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    disabled={isLoading}
                  />
                  <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 mt-1">
                    Enter the UPI ID to send payment to
                  </div>
                </div>
                {errors.destinationUpi && <p className="text-red-500 text-xs mt-1">{errors.destinationUpi}</p>}
              </motion.div>

              {/* Remarks Field */}
              <motion.div variants={itemVariants} className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
                <div className="relative group">
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    placeholder="Add any notes about the transaction"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    disabled={isLoading}
                  />
                  <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 mt-1">
                    Optional notes about the transaction
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  disabled={isLoading || !isFormValid()}
                  className={`w-full py-3 rounded-lg text-white font-medium ${
                    isFormValid() && !isLoading
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-400 cursor-not-allowed'
                  } flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Make Payment'
                  )}
                </motion.button>
              </motion.div>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MerchantPayment;