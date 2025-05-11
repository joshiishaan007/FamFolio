"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { axiosInstance } from "../App"

// Mock data
const mockStatistics = {
  totalFamilies: 128,
  totalMembers: 512,
  totalWalletValue: 1250000,
  totalSpending: 450000,
  flaggedUsers: 7,
  growthRate: 12.8,
}

const mockSpendingData = [
  { name: "Smith Family", spending: 12500, budget: 15000 },
  { name: "Johnson Family", spending: 18700, budget: 15000 },
  { name: "Williams Family", spending: 9800, budget: 12000 },
  { name: "Brown Family", spending: 14500, budget: 14000 },
  { name: "Jones Family", spending: 22000, budget: 20000 },
  { name: "Miller Family", spending: 8500, budget: 10000 },
  { name: "Davis Family", spending: 17800, budget: 18000 },
  { name: "Garcia Family", spending: 11200, budget: 12000 },
  { name: "Rodriguez Family", spending: 19500, budget: 16000 },
  { name: "Wilson Family", spending: 13700, budget: 15000 },
]

const mockFlaggedMembers = [
  {
    id: 1,
    name: "John Smith",
    username: "johnsmith",
    family: "Smith Family",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    reason: "Multiple large transactions in short period",
    riskLevel: "high",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Emma Johnson",
    username: "emmaj",
    family: "Johnson Family",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    reason: "Exceeded family budget by 25%",
    riskLevel: "medium",
    lastActive: "1 day ago",
  },
  {
    id: 3,
    name: "Michael Brown",
    username: "mikebrown",
    family: "Brown Family",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    reason: "Unusual transaction pattern detected",
    riskLevel: "high",
    lastActive: "3 hours ago",
  },
  {
    id: 4,
    name: "Sophia Garcia",
    username: "sophiag",
    family: "Garcia Family",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    reason: "Multiple failed authentication attempts",
    riskLevel: "medium",
    lastActive: "5 hours ago",
  },
  {
    id: 5,
    name: "James Wilson",
    username: "jwilson",
    family: "Wilson Family",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    reason: "Suspicious login location",
    riskLevel: "low",
    lastActive: "2 days ago",
  },
]

const mockTrendData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
]

const AdminDashboard = () => {
  // State for all data
  const [statistics, setStatistics] = useState(mockStatistics)
  const [spendingData, setSpendingData] = useState(mockSpendingData)
  const [flaggedMembers, setFlaggedMembers] = useState(mockFlaggedMembers)
  const [trendData, setTrendData] = useState(mockTrendData)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [disableReason, setDisableReason] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Handle disable member
  const handleDisableMember = (member) => {
    setSelectedMember(member)
    setShowModal(true)
  }

  // Confirm disable
  const confirmDisable = async () => {
    // Update local state
    setFlaggedMembers(
      flaggedMembers.map((member) => (member.id === selectedMember.id ? { ...member, disabled: true } : member)),
    )

    setShowModal(false)
    setToastMessage(`${selectedMember.name} has been successfully disabled`)
    setShowToast(true)

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const overBudget = data.spending > data.budget

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-blue-100">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-blue-600 font-medium">Total Spent: {formatCurrency(data.spending)}</p>
          <p className="text-gray-600">Budget: {formatCurrency(data.budget)}</p>
          {overBudget && (
            <p className="text-red-500 font-medium">
              Exceeded budget by {(((data.spending - data.budget) / data.budget) * 100).toFixed(1)}%
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Filter members based on active tab
  const filteredMembers = flaggedMembers.filter((member) => {
    if (activeTab === "all") return true
    return member.riskLevel === activeTab
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute top-0 w-full h-full rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute top-2 left-2 w-20 h-20 rounded-full border-4 border-t-transparent border-r-blue-300 border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
            <div className="absolute top-4 left-4 w-16 h-16 rounded-full border-4 border-t-transparent border-r-transparent border-b-blue-200 border-l-transparent animate-spin animation-delay-300"></div>
          </div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Loading Dashboard</h2>
          <p className="text-blue-600">Preparing your FamFolio admin experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md mr-3">
              F
            </div>
            <h1 className="text-xl font-bold text-gray-800">FamFolio Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm w-64 transition-all duration-300"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  ></path>
                </svg>
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
            <div className="flex items-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Admin"
                className="w-10 h-10 rounded-full border-2 border-blue-200"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">General Admin Dashboard</h1>
          <p className="text-gray-600">
            Overview of platform activity, family spending, and flagged members requiring attention.
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-50"
          >
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Families</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{statistics.totalFamilies}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 flex items-center font-medium">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    ></path>
                  </svg>
                  8.2%
                </span>
                <span className="text-gray-500 ml-2">Since last month</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-blue-300 to-blue-500"></div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-50"
          >
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Members</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{statistics.totalMembers}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 flex items-center font-medium">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    ></path>
                  </svg>
                  12.5%
                </span>
                <span className="text-gray-500 ml-2">Since last month</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-indigo-300 to-indigo-500"></div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-50"
          >
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Wallet Value</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {formatCurrency(statistics.totalWalletValue)}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 flex items-center font-medium">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    ></path>
                  </svg>
                  {statistics.growthRate}%
                </span>
                <span className="text-gray-500 ml-2">Since last month</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-green-300 to-green-500"></div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.1)" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-50"
          >
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Flagged Users</p>
                  <h3 className="text-2xl font-bold text-red-500 mt-1">{statistics.flaggedUsers}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-red-500 flex items-center font-medium">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    ></path>
                  </svg>
                  2 new
                </span>
                <span className="text-gray-500 ml-2">Since yesterday</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-red-300 to-red-500"></div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Spending Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 border border-blue-50 lg:col-span-2"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Spending Distribution by Family</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                  Monthly
                </button>
                <button className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  Quarterly
                </button>
                <button className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  Yearly
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <defs>
                    <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#93C5FD" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2FF" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value / 1000}k`}
                    width={80}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={{ stroke: "#E5E7EB" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="spending"
                    fill="url(#colorSpending)"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 border border-blue-50"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-6">Monthly Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2FF" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={{ stroke: "#E5E7EB" }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorTrend)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Flagged Members Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 border border-blue-50 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Flagged Members</h2>
              <p className="text-sm text-gray-500">Members with unusual financial behavior or policy violations</p>
            </div>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("high")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "high" ? "bg-white text-red-600 shadow-sm" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                High Risk
              </button>
              <button
                onClick={() => setActiveTab("medium")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "medium" ? "bg-white text-orange-600 shadow-sm" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Medium Risk
              </button>
              <button
                onClick={() => setActiveTab("low")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "low" ? "bg-white text-yellow-600 shadow-sm" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Low Risk
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
                className={`bg-white rounded-xl overflow-hidden border ${
                  member.disabled
                    ? "border-gray-200 opacity-70"
                    : member.riskLevel === "high"
                      ? "border-red-100"
                      : member.riskLevel === "medium"
                        ? "border-orange-100"
                        : "border-yellow-100"
                }`}
              >
                <div
                  className={`h-2 w-full ${
                    member.riskLevel === "high"
                      ? "bg-gradient-to-r from-red-300 to-red-500"
                      : member.riskLevel === "medium"
                        ? "bg-gradient-to-r from-orange-300 to-orange-500"
                        : "bg-gradient-to-r from-yellow-300 to-yellow-500"
                  }`}
                ></div>
                <div className="p-5">
                  <div className="flex items-start">
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      className="w-14 h-14 rounded-full border-2 border-blue-100 mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{member.name}</h3>
                          <p className="text-sm text-gray-500">@{member.username}</p>
                        </div>
                        <div
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            member.riskLevel === "high"
                              ? "bg-red-100 text-red-600"
                              : member.riskLevel === "medium"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {member.riskLevel.charAt(0).toUpperCase() + member.riskLevel.slice(1)} Risk
                        </div>
                      </div>
                      <p className="text-sm font-medium text-blue-600 mt-1">{member.family}</p>
                      <p className="text-xs text-gray-500 mt-2">Last active: {member.lastActive}</p>
                      <div className="mt-3 bg-gray-50 p-2 rounded-lg">
                        <p className="text-xs text-gray-700">{member.reason}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    {!member.disabled ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDisableMember(member)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          ></path>
                        </svg>
                        Disable Account
                      </motion.button>
                    ) : (
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-sm font-medium">Account Disabled</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disable Confirmation Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
              >
                <div className="bg-red-50 p-4 border-b border-red-100">
                  <h3 className="text-lg font-bold text-red-600">Disable Member Account</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-2">
                    Are you sure you want to disable <span className="font-semibold">{selectedMember?.name}</span>'s
                    account?
                  </p>
                  <p className="text-sm text-gray-500 mb-4">This will temporarily restrict all account actions.</p>

                  <div className="mb-4">
                    <label htmlFor="disable-reason" className="block text-sm font-medium text-gray-700 mb-1">
                      Reason (optional):
                    </label>
                    <textarea
                      id="disable-reason"
                      value={disableReason}
                      onChange={(e) => setDisableReason(e.target.value)}
                      placeholder="Enter reason for disabling this account..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={confirmDisable}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        ></path>
                      </svg>
                      Confirm Disable
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-green-100 p-4 flex items-center z-50"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p className="text-gray-700 font-medium">{toastMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default AdminDashboard
