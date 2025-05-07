"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Coffee,
  ShoppingBag,
  Book,
  Gamepad,
  Gift,
  DollarSign,
  PlusCircle,
  Info,
  X,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"

// Mock API calls - replace with your actual API endpoints
const fetchMemberData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        memberName: "Aarav",
        walletBalance: 1800,
        walletLimit: 5000,
        notifications: 2,
        transactions: [
          {
            id: 1,
            category: "food",
            description: "Zomato Order",
            amount: 450,
            date: "2023-05-06",
            icon: <Coffee size={16} />,
          },
          {
            id: 2,
            category: "education",
            description: "Coursera Subscription",
            amount: 1200,
            date: "2023-05-05",
            icon: <Book size={16} />,
          },
          {
            id: 3,
            category: "games",
            description: "Steam Purchase",
            amount: 899,
            date: "2023-05-04",
            icon: <Gamepad size={16} />,
          },
          {
            id: 4,
            category: "food",
            description: "Swiggy Order",
            amount: 350,
            date: "2023-05-03",
            icon: <Coffee size={16} />,
          },
          {
            id: 5,
            category: "shopping",
            description: "Amazon Purchase",
            amount: 1500,
            date: "2023-05-02",
            icon: <ShoppingBag size={16} />,
          },
          {
            id: 6,
            category: "gift",
            description: "Birthday Gift",
            amount: 800,
            date: "2023-05-01",
            icon: <Gift size={16} />,
          },
          {
            id: 7,
            category: "food",
            description: "McDonald's",
            amount: 250,
            date: "2023-04-30",
            icon: <Coffee size={16} />,
          },
          {
            id: 8,
            category: "education",
            description: "Book Purchase",
            amount: 550,
            date: "2023-04-29",
            icon: <Book size={16} />,
          },
        ],
        categorySpending: [
          { name: "Food", value: 1050, color: "#38bdf8" },
          { name: "Education", value: 1750, color: "#818cf8" },
          { name: "Games", value: 899, color: "#c084fc" },
          { name: "Shopping", value: 1500, color: "#e879f9" },
          { name: "Gifts", value: 800, color: "#fb7185" },
        ],
        tips: [
          {
            id: 1,
            title: "Save on Food",
            description: "Try meal prepping on weekends to reduce food delivery expenses.",
            icon: <Coffee size={20} />,
          },
          {
            id: 2,
            title: "Education Deals",
            description: "Look for student discounts on courses and books.",
            icon: <Book size={20} />,
          },
          {
            id: 3,
            title: "Gaming on Budget",
            description: "Wait for seasonal sales to purchase games at discounted prices.",
            icon: <Gamepad size={20} />,
          },
        ],
      })
    }, 1000)
  })
}

const MemberDashboard = () => {
  const [memberData, setMemberData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTipIndex, setActiveTipIndex] = useState(0)

  const itemsPerPage = 4

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMemberData()
        setMemberData(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching member data:", error)
        setLoading(false)
      }
    }

    loadData()

    // Auto-rotate tips every 5 seconds
    const tipInterval = setInterval(() => {
      if (memberData?.tips) {
        setActiveTipIndex((prev) => (prev + 1) % memberData.tips.length)
      }
    }, 5000)

    return () => clearInterval(tipInterval)
  }, [memberData?.tips])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
          <p className="text-lg font-medium text-blue-700">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!memberData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <p className="text-lg font-medium text-red-500">Failed to load dashboard data</p>
      </div>
    )
  }

  // Calculate pagination
  const totalPages = Math.ceil(memberData.transactions.length / itemsPerPage)
  const paginatedTransactions = memberData.transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Calculate total spent
  const totalSpent = memberData.categorySpending.reduce((sum, category) => sum + category.value, 0)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  // Get current date
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mx-auto max-w-5xl">
        {/* Header / Top Bar */}
        <motion.header variants={itemVariants} className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Hi {memberData.memberName} 👋</h1>
            <p className="text-sm text-blue-600">{currentDate}</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-blue-700 hover:bg-blue-100">
              <Bell size={24} />
              {memberData.notifications > 0 && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {memberData.notifications}
                </span>
              )}
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
              {memberData.memberName.charAt(0)}
            </div>
          </div>
        </motion.header>

        {/* Wallet Summary Card */}
        <motion.div variants={itemVariants} className="mb-6 overflow-hidden rounded-2xl bg-white p-5 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="mb-1 flex items-center gap-2">
                <CreditCard className="text-blue-600" size={20} />
                <h2 className="text-lg font-bold text-gray-800">My Wallet</h2>
              </div>

              <div className="mt-3">
                <p className="text-sm text-gray-500">Available Balance</p>
                <motion.p
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold text-blue-700"
                >
                  ₹{memberData.walletBalance}
                  <span className="ml-2 text-sm font-normal text-gray-500">of ₹{memberData.walletLimit}</span>
                </motion.p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative h-24 w-24">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />

                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 40}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 40 * (1 - memberData.walletBalance / memberData.walletLimit),
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    transform="rotate(-90 50 50)"
                  />

                  {/* Percentage text */}
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-lg font-bold"
                    fill="#1e40af"
                  >
                    {Math.round((memberData.walletBalance / memberData.walletLimit) * 100)}%
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Transaction History Section */}
          <motion.div variants={itemVariants} className="flex flex-col rounded-2xl bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Transaction History</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-blue-700 transition-colors hover:bg-blue-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-blue-700 transition-colors hover:bg-blue-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {paginatedTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 246, 255, 0.6)" }}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {transaction.icon}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>

                  <p className="font-medium text-red-600">-₹{transaction.amount}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Spend Category Breakdown */}
          <div className="flex flex-col gap-6">
            <motion.div variants={itemVariants} className="flex flex-col rounded-2xl bg-white p-5 shadow-lg">
              <h2 className="mb-4 text-lg font-bold text-gray-800">Spending Breakdown</h2>

              <div className="flex flex-1 flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={memberData.categorySpending}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      animationBegin={200}
                      animationDuration={1000}
                    >
                      {memberData.categorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value) => [`₹${value} (${Math.round((value / totalSpent) * 100)}%)`, "Amount"]}
                      labelFormatter={(index) => memberData.categorySpending[index].name}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  {memberData.categorySpending.map((category) => (
                    <div key={category.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-sm">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Spending Tips */}
            <motion.div variants={itemVariants} className="flex flex-col rounded-2xl bg-white p-5 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Spending Tips</h2>
                <div className="flex gap-1">
                  {memberData.tips.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTipIndex(index)}
                      className={`h-2 w-2 rounded-full ${activeTipIndex === index ? "bg-blue-500" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>

              <motion.div
                key={activeTipIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 rounded-lg bg-blue-50 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {memberData.tips[activeTipIndex].icon}
                </div>

                <div>
                  <h3 className="font-medium text-blue-800">{memberData.tips[activeTipIndex].title}</h3>
                  <p className="text-sm text-blue-600">{memberData.tips[activeTipIndex].description}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default MemberDashboard