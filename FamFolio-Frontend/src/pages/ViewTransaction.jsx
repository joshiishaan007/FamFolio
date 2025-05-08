"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const ViewTransaction = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "timestamp", direction: "desc" })

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const username = localStorage.getItem("username") || "defaultUser"
        const response = await fetch(`/api/transaction/${username}`)

        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }

        const data = await response.json()
        setTransactions(data)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching transactions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedTransactions = React.useMemo(() => {
    const sortableTransactions = [...transactions]
    if (sortConfig.key) {
      sortableTransactions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableTransactions
  }, [transactions, sortConfig])

  const filteredTransactions = sortedTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm)

    const matchesFilter =
      filterType === "all" ||
      (filterType === "credit" && transaction.type === "CREDIT") ||
      (filterType === "debit" && transaction.type === "DEBIT")

    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatAmount = (amount, type) => {
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount))

    return type === "CREDIT" ? formattedAmount : `-${formattedAmount}`
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕️"
    return sortConfig.direction === "asc" ? "↑" : "↓"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-xl shadow-lg bg-white w-full max-w-7xl"
        >
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-xl shadow-lg bg-white w-full max-w-7xl"
        >
          <div className="text-center text-red-500">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p>{error}</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-blue-600"
          >
            Transaction History
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-2.5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
            >
              <option value="all">All Transactions</option>
              <option value="credit">Credits Only</option>
              <option value="debit">Debits Only</option>
            </select>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50 text-left">
                <th
                  className="px-4 py-3 font-semibold text-blue-700 rounded-tl-lg cursor-pointer"
                  onClick={() => handleSort("timestamp")}
                >
                  <div className="flex items-center">Date {getSortIcon("timestamp")}</div>
                </th>
                <th
                  className="px-4 py-3 font-semibold text-blue-700 cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  <div className="flex items-center">Description {getSortIcon("description")}</div>
                </th>
                <th
                  className="px-4 py-3 font-semibold text-blue-700 cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">Category {getSortIcon("category")}</div>
                </th>
                <th
                  className="px-4 py-3 font-semibold text-blue-700 cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">Amount {getSortIcon("amount")}</div>
                </th>
                <th
                  className="px-4 py-3 font-semibold text-blue-700 rounded-tr-lg cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center">Type {getSortIcon("type")}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.transaction_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.01, backgroundColor: "rgba(239, 246, 255, 0.6)" }}
                      className={`border-b border-blue-100 ${index % 2 === 0 ? "bg-white" : "bg-blue-50/30"}`}
                    >
                      <td className="px-4 py-3 text-gray-700">{formatDate(transaction.timestamp)}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">
                          {transaction.description || transaction.category}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{transaction.category}</td>
                      <td
                        className={`px-4 py-3 font-medium ${transaction.type === "CREDIT" ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatAmount(transaction.amount, transaction.type)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            transaction.type === "CREDIT" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex justify-between items-center text-sm text-gray-500"
        >
          <div>
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
          <div className="flex items-center gap-2">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <button
              onClick={() => window.location.reload()}
              className="ml-2 p-2 rounded-full hover:bg-blue-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ViewTransaction
