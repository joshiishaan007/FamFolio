import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
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

const MemberDashboard = () => {
  const [memberData, setMemberData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTipIndex, setActiveTipIndex] = useState(0)
  const [walletData, setWalletData] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [showAllTransactions, setShowAllTransactions] = useState(false)

  const itemsPerPage = 5

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get user data from localStorage
        const username = localStorage.getItem('username')
        const token = localStorage.getItem('jwt')
        
        if (!username || !token) {
          throw new Error('User not authenticated')
        }

        // Fetch wallet data
        const walletResponse = await axios.get(
          `http://localhost:8080/api/wallets/user/username/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        // Fetch transactions
        const transactionsResponse = await axios.get(
          `http://localhost:8080/api/transactions/user/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const wallet = walletResponse.data
        setWalletData(wallet)

        // Filter only DEBIT transactions and format them
        const debitTransactions = transactionsResponse.data
          .filter(tx => tx.transactionType === "DEBIT")
          .map(tx => ({
            id: tx.id,
            amount: Math.abs(tx.amount), // Convert to positive since we know it's DEBIT
            description: tx.description,
            date: new Date(tx.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
            }),
            merchantName: tx.merchantName,
            createdAt: tx.createdAt
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by date newest first

        setTransactions(debitTransactions)

        // Mock data for other parts of the dashboard
        // (You'll want to replace this with actual API calls)
        const mockData = {
          memberName: username,
          walletBalance: wallet.balance - wallet.spent,
          walletLimit: wallet.balance,
          notifications: 2,
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
        }

        setMemberData(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
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

  // Get the most recent transactions (already sorted by date)
  const recentTransactions = transactions.slice(0, itemsPerPage)
  const allTransactions = transactions

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

  // Get icon based on transaction description
  const getTransactionIcon = (description) => {
    if (description.toLowerCase().includes("food")) {
      return <Coffee size={16} />
    } else if (description.toLowerCase().includes("transfer")) {
      return <DollarSign size={16} />
    } else if (description.toLowerCase().includes("education") || description.toLowerCase().includes("book")) {
      return <Book size={16} />
    } else if (description.toLowerCase().includes("movie") || description.toLowerCase().includes("game")) {
      return <Gamepad size={16} />
    } else if (description.toLowerCase().includes("shopping")) {
      return <ShoppingBag size={16} />
    } else if (description.toLowerCase().includes("gift")) {
      return <Gift size={16} />
    } else if (description.toLowerCase().includes("transport")) {
      return <PlusCircle size={16} />
    }
    return <DollarSign size={16} />
  }

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
              <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
              {transactions.length > itemsPerPage && (
                <button 
                  onClick={() => setShowAllTransactions(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View All
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 246, 255, 0.6)" }}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      {getTransactionIcon(transaction.description)}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>

                    <p className="font-medium text-red-600">-₹{transaction.amount.toFixed(2)}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No transactions found</p>
              )}
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

      {/* All Transactions Modal */}
      {showAllTransactions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-h-[90vh] w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
          >
            <button 
              onClick={() => setShowAllTransactions(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <X size={24} />
            </button>

            <h2 className="mb-4 text-xl font-bold text-gray-800">All Transactions</h2>
            
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex flex-col gap-3">
                {allTransactions.length > 0 ? (
                  allTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-blue-50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        {getTransactionIcon(transaction.description)}
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                        {transaction.merchantName && (
                          <p className="text-xs text-gray-500">Merchant: {transaction.merchantName}</p>
                        )}
                      </div>

                      <p className="font-medium text-red-600">-₹{transaction.amount.toFixed(2)}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No transactions found</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default MemberDashboard