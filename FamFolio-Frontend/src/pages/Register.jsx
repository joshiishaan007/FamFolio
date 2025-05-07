import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom" //

const CreditCardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    age: "",
    gender: "male",
    email: "",
    confirmPassword: "",
  });
  const location = useLocation()
  const aadharNum = location.state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(aadharNum);

    
    console.log("Register with:", formData);
    // Add your registration logic here
  };

  const navigateToLogin = () => {
    // You'll need to implement your navigation logic here
    // For React Router: history.push('/login')
    console.log("Navigate to login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl"></div>

        <div className="relative p-6">
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2 text-blue-800">
              <CreditCardIcon />
              <h1 className="text-3xl font-bold">FamFolio</h1>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-blue-800 text-center mb-3">
            Create Your Account
          </h2>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white bg-opacity-80 border border-blue-200 rounded-xl text-blue-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white bg-opacity-80 border border-blue-200 rounded-xl text-blue-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white bg-opacity-80 border border-blue-200 rounded-xl text-blue-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Age"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white bg-opacity-80 border border-blue-200 rounded-xl text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  >
                    <option value="male" className="bg-white">Male</option>
                    <option value="female" className="bg-white">Female</option>
                    <option value="other" className="bg-white">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                      <UserIcon />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-80 border border-blue-200 rounded-xl text-blue-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                      <LockIcon />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-80 border border-blue-200 rounded-xl text-blue-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                      <LockIcon />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-80 border border-blue-200 rounded-xl text-blue-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-2 mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Register
                </button>
              </div>
            </form>
          </motion.div>

          <div className="mt-3 text-center">
            <button
              onClick={navigateToLogin}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;