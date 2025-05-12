import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { axiosInstance } from "../App";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  LogOut,
  Users,
  CreditCard,
  AlertTriangle,
  Clock,
  ChevronDown,
  Plus,
  DollarSign,
  PieChart,
  BarChart2,
  ShoppingBag,
  Book,
  Coffee,
  Gift,
  Smartphone,
  CheckCircle,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

const fetchDashboardData = async () => {
  try {
    const username = localStorage.getItem("username");
    const jwtToken = localStorage.getItem("jwt");

    if (!username || !jwtToken) {
      throw new Error("User not authenticated");
    }

    // Fetch parent wallet data
       const parentWalletResponse = await axiosInstance.get(`/api/wallets/user/username/${username}`, {
  headers: {
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json"
  }
});

 

    const parentWalletData = await parentWalletResponse.data;

    // Fetch member wallets data
   const memberWalletsResponse = await axiosInstance.get(`/api/relationships/memberwallets/${username}`, {
  headers: {
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json"
  }
});

  

    const memberWalletsData = await memberWalletsResponse.data;

    console.log(memberWalletsData);
    // Transform the API response to match your existing data structure
    const transformedWallets = memberWalletsData.map((wallet) => ({
      id: wallet.id,
      name: wallet.user?.username || wallet.user?.name || "New Member",
      username: wallet.user?.username || "",
      limit: wallet.balance,
      spent: wallet.spent,
      avatar: (
        wallet.user?.username?.charAt(0) ||
        wallet.user?.name?.charAt(0)?.toUpperCase() ||
        "M"
      ),
    }));

    // Calculate totals including parent wallet
    const totalFamilyBalance =
      parentWalletData.balance +
      transformedWallets.reduce((sum, wallet) => sum + wallet.limit, 0);

    const totalMonthlySpending =
      parentWalletData.spent +
      transformedWallets.reduce((sum, wallet) => sum + wallet.spent, 0);

    // Return the transformed data structure
    return {
      parentName: username,
      parentBalance: parentWalletData.balance,
      parentSpent: parentWalletData.spent,
      totalBalance: totalFamilyBalance,
      monthlySpending: totalMonthlySpending,
      overspendingAlerts: transformedWallets.filter(
        (wallet) => wallet.spent > wallet.limit
      ).length,
      pendingRequests: 3, // You might want to fetch this from another API
      wallets: transformedWallets,
      categorySpending: [
        { name: "Food", value: 5200, color: "#38bdf8" },
        { name: "Education", value: 7800, color: "#818cf8" },
        { name: "Entertainment", value: 3100, color: "#c084fc" },
        { name: "Others", value: 2200, color: "#e879f9" },
      ],
      requests: [
        {
          id: 1,
          name: transformedWallets[0]?.name || "Family Member",
          reason: "School project materials",
          amount: 1500,
          date: "2023-05-06",
        },
        {
          id: 2,
          name: transformedWallets[1]?.name || "Family Member",
          reason: "Art supplies",
          amount: 800,
          date: "2023-05-05",
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

const ParentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [fundAmount, setFundAmount] = useState("");
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [fundsAdded, setFundsAdded] = useState(false);
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [selectedMemberForRules, setSelectedMemberForRules] = useState(null);
  const [memberRules, setMemberRules] = useState([]);
  const [loadingRules, setLoadingRules] = useState(false);
  const [currentWalletView, setCurrentWalletView] = useState(null);

  const navigate = useNavigate()

  const loadDashboardData = async () => {
    try {
      const data = await fetchDashboardData();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const username = localStorage.getItem("username");
      const jwtToken = localStorage.getItem("jwt");

      if (!username || !jwtToken) return;

      const response = await axiosInstance.get(
        `/api/transactions/users/${username}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseTransactions = response.data
        .map((tx) => ({
          ...tx,
          icon: getTransactionIcon(tx.description),
          date: new Date(tx.createdAt).toLocaleDateString(),
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setTransactions(responseTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchMemberRules = async (memberUsername) => {

    // console.log(dashboardData.wa)

  try {
    const username = localStorage.getItem("username");
    const jwtToken = localStorage.getItem("jwt");

    if (!username || !jwtToken) {
      throw new Error("User not authenticated");
    }

    setLoadingRules(true);
    
    const response = await axiosInstance.get(
      `/api/rules/member/${memberUsername}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    setMemberRules(response.data);
    setLoadingRules(false);
  } catch (error) {
    console.error("Error fetching member rules:", error);
    setLoadingRules(false);
    setMemberRules([]);
  }
};

  const getTransactionIcon = (description) => {
    if (!description) return <DollarSign size={16} />;

    const lowerDesc = description.toLowerCase();

    if (lowerDesc.includes("food") || lowerDesc.includes("grocery")) {
      return <ShoppingBag size={16} />;
    } else if (lowerDesc.includes("school") || lowerDesc.includes("education")) {
      return <Book size={16} />;
    } else if (lowerDesc.includes("coffee") || lowerDesc.includes("restaurant")) {
      return <Coffee size={16} />;
    } else if (lowerDesc.includes("gift")) {
      return <Gift size={16} />;
    } else if (lowerDesc.includes("phone") || lowerDesc.includes("mobile")) {
      return <Smartphone size={16} />;
    } else if (lowerDesc.includes("transfer")) {
      return <DollarSign size={16} />;
    }

    return <DollarSign size={16} />;
  };

  useEffect(() => {
    loadDashboardData();
    fetchTransactions();
  }, []);

const fetchWalletTransactions = async (walletUsername) => {
  try {
    const jwtToken = localStorage.getItem("jwt");
    
    const response = await axiosInstance.get(
      `/api/transactions/users/${walletUsername}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    // Filter and format transactions as needed
    const walletTransactions = response.data.map(tx => ({
      ...tx,
      icon: getTransactionIcon(tx.description),
      date: new Date(tx.createdAt).toLocaleDateString(),
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setTransactions(walletTransactions);
    setShowAllTransactions(false);
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
  }
};

 
const toggleRuleStatus = async (ruleId, currentStatus) => {
  try {
    const jwtToken = localStorage.getItem("jwt");
    const newStatus = !currentStatus;
    
    // Optimistically update the UI
    setMemberRules(memberRules.map(rule => 
      rule.id === ruleId ? { ...rule, active: newStatus } : rule
    ));
    
    const response = await axiosInstance.patch(
      `/api/rules/${ruleId}/status`,
      { active: newStatus },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    if (response.status !== 200) {
      // Revert if API call fails
      setMemberRules(memberRules.map(rule => 
        rule.id === ruleId ? { ...rule, active: currentStatus } : rule
      ));
    }
  } catch (error) {
    console.error("Error toggling rule status:", error);
    // Revert on error
    setMemberRules(memberRules.map(rule => 
      rule.id === ruleId ? { ...rule, active: currentStatus } : rule
    ));
  }
};

  const handleAddFundsClick = (wallet) => {
    setSelectedWallet(wallet);
    setFundAmount("");
    setFundsAdded(false);
    setShowFundsModal(true);
  };

  const handleAddFundsSubmit = async () => {
    if (!fundAmount || isNaN(fundAmount) || Number(fundAmount) <= 0) return;

    setIsAddingFunds(true);

    try {
      const username = localStorage.getItem("username");
      const jwtToken = localStorage.getItem("jwt");

      if (!username || !jwtToken) {
        throw new Error("User not authenticated");
      }

      // Call the transfer API with axios
      const response = await axiosInstance.post(
        "/api/payments/transfer",
        {
          ownername: username,
          membername: selectedWallet.username,
          amount: Number(fundAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setFundsAdded(true);

        // Reset after showing success
        setTimeout(() => {
          setFundsAdded(false);
          setShowFundsModal(false);

          // Reload dashboard data
          loadDashboardData();
          fetchTransactions();
        }, 2000);
      } else {
        throw new Error("Failed to add funds");
      }
    } catch (error) {
      console.error("Error adding funds:", error);
    } finally {
      setIsAddingFunds(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
          <p className="text-lg font-medium text-blue-700">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <p className="text-lg font-medium text-red-500">
          Failed to load dashboard data
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const CountUpAnimation = ({ end, duration = 2, prefix = "", suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime;
      let animationFrame;

      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(
          (timestamp - startTime) / (duration * 1000),
          1
        );
        setCount(Math.floor(progress * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        }
      };

      animationFrame = requestAnimationFrame(updateCount);

      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return (
      <span>
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </span>
    );
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between border-b border-blue-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <button className="rounded-lg p-2 text-blue-700 hover:bg-blue-50 md:hidden">
              <BarChart2 size={24} />
            </button>
            <h2 className="text-lg font-medium">
              Welcome,{" "}
              <span className="font-bold text-blue-700">
                {dashboardData.parentName}
              </span>
            </h2>
          </div>

          
        </motion.header>

        {/* Dashboard Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-1 flex-col gap-6 overflow-auto p-4 md:p-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Top Metrics Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)",
              }}
              className="flex flex-col rounded-xl bg-white p-5 shadow-md transition-all"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <DollarSign size={20} />
              </div>
              <p className="text-sm text-gray-500">Total Family Balance</p>
              <h3 className="mt-1 text-2xl font-bold text-blue-800">
                ₹<CountUpAnimation end={dashboardData.totalBalance} />
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                ({dashboardData.parentName}: ₹
                {dashboardData.parentBalance.toLocaleString()} + Members: ₹
                {(
                  dashboardData.totalBalance - dashboardData.parentBalance
                ).toLocaleString()}
                )
              </p>
            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)",
              }}
              className="flex flex-col rounded-xl bg-white p-5 shadow-md transition-all"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <BarChart2 size={20} />
              </div>
              <p className="text-sm text-gray-500">This Month's Spending</p>
              <h3 className="mt-1 text-2xl font-bold text-purple-800">
                ₹<CountUpAnimation end={dashboardData.monthlySpending} />
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                ({dashboardData.parentName}: ₹
                {dashboardData.parentSpent.toLocaleString()} + Members: ₹
                {(
                  dashboardData.monthlySpending - dashboardData.parentSpent
                ).toLocaleString()}
                )
              </p>
            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)",
              }}
              className="flex flex-col rounded-xl bg-white p-5 shadow-md transition-all"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={20} />
              </div>
              <p className="text-sm text-gray-500">Overspending Alerts</p>
              <h3 className="mt-1 text-2xl font-bold text-red-600">
                <CountUpAnimation
                  end={dashboardData.overspendingAlerts}
                  suffix=" this month"
                />
              </h3>
            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)",
              }}
              className="flex flex-col rounded-xl bg-white p-5 shadow-md transition-all"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Clock size={20} />
              </div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <h3 className="mt-1 text-2xl font-bold text-amber-600">
                <CountUpAnimation
                  end={dashboardData.pendingRequests}
                  suffix=" approvals"
                />
              </h3>
            </motion.div>
          </motion.div>

          {/* Wallet Overview and Recent Transactions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Wallet Overview */}
            <motion.div
              variants={itemVariants}
              className="col-span-1 flex flex-col rounded-xl bg-white p-5 shadow-md lg:col-span-2"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  Wallet Overview
                </h3>
                <Link to="/add-member">
      <button className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">
        <Plus size={16} />
        Add Wallet
      </button>
    </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Parent Wallet Card */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex flex-col rounded-lg border border-blue-200 bg-blue-50 p-4 transition-all"
                  onClick={() => {
                    fetchWalletTransactions(dashboardData.parentName);
                    setCurrentWalletView(dashboardData.parentName);
                  }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm text-white">
                      {dashboardData.parentName.charAt(0)}
                    </div>
                    <h4 className="font-medium">
                      {dashboardData.parentName}
                    </h4>
                  </div>

                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600">Balance:</span>
                    <span className="font-medium">
                      ₹{dashboardData.parentBalance.toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-medium text-gray-800">
                      ₹{dashboardData.parentSpent.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white">
                    <div className="h-full w-full rounded-full bg-blue-200"></div>
                  </div>
                </motion.div>

                {/* Member Wallets */}
                {dashboardData.wallets.map((wallet) => (
                  <motion.div
                    key={wallet.id}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => {
                      fetchWalletTransactions(wallet.name);
                      setCurrentWalletView(wallet.name);
                    }}
                    className={`flex flex-col rounded-lg border p-4 transition-all ${
                      wallet.spent > wallet.limit
                        ? "border-red-200 bg-red-50"
                        : wallet.spent / wallet.limit > 0.8
                        ? "border-amber-200 bg-amber-50"
                        : "border-green-200 bg-green-50"
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm text-white">
                        {wallet.avatar}
                      </div>
                      <h4 className="font-medium">{wallet.name}</h4>
                    </div>

                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Balance:</span>
                      <span className="font-medium">
                        ₹{wallet.limit.toLocaleString()}
                      </span>
                    </div>

                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Spent:</span>
                      <span
                        className={`font-medium ${
                          wallet.spent > wallet.limit
                            ? "text-red-600"
                            : "text-gray-800"
                        }`}
                      >
                        ₹{wallet.spent.toLocaleString()}
                      </span>
                    </div>

                    <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            100,
                            (wallet.spent / wallet.limit) * 100
                          )}%`,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${
                          wallet.spent > wallet.limit
                            ? "bg-red-500"
                            : wallet.spent / wallet.limit > 0.8
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                      />
                    </div>

                    <div className="mt-2 flex justify-center">
                      <button
                        className="w-3/4 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600"
                        onClick={() => handleAddFundsClick(wallet)}
                      >
                        Add Funds
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Transactions */}
            
            <motion.div
              variants={itemVariants}
              className="col-span-1 flex flex-col rounded-xl bg-white p-5 shadow-md"
            >
              {currentWalletView && (
              <h3 className="mb-2 text-lg font-medium">
                Transactions for {currentWalletView}
              </h3>
            )}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  Recent Transactions
                </h3>
                {transactions.length > 5 && (
                  <button 
                    onClick={() => setShowAllTransactions(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {transactions.slice(0, 5).map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 rounded-lg border p-3 hover:bg-blue-50 ${
                      transaction.status === "FAILED" 
                        ? "border-red-200 bg-red-50" 
                        : "border-gray-100"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        transaction.status === "FAILED"
                          ? "bg-red-100 text-red-600"
                          : transaction.amount < 0
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {getTransactionIcon(transaction.description)}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {transaction.merchantName ||
                          transaction.description.substring(0, 20) +
                            (transaction.description.length > 20 ? "..." : "")}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                        {transaction.status === "FAILED" && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                            Failed
                          </span>
                        )}
                      </div>
                      {transaction.status === "FAILED" && transaction.failureReason && (
                        <p className="mt-1 text-xs text-red-500">
                          {transaction.failureReason}
                        </p>
                      )}
                    </div>

                    <p
                      className={`font-medium ${
                        transaction.status === "FAILED"
                          ? "text-red-600"
                          : transaction.amount < 0
                            ? "text-red-600"
                            : "text-green-600"
                      }`}
                    >
                      {transaction.amount < 0 ? "-" : "+"}₹{Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Spending Requests and Member-wise Spending */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Spending Requests */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col rounded-xl bg-white p-5 shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Spending Requests
                  </h3>
                  <p className="text-sm text-gray-500">Pending approvals</p>
                </div>

                {dashboardData.pendingRequests > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-100 px-2 text-xs font-medium text-amber-800">
                    {dashboardData.pendingRequests} pending
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {dashboardData.requests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                  >
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col gap-2 rounded-lg border border-gray-100 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-700">
                            {request.name.charAt(0)}
                          </div>
                          <span className="font-medium">{request.name}</span>
                        </div>
                        <span className="font-medium text-blue-700">
                          ₹{request.amount}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">{request.reason}</p>

                      <div className="mt-2 flex gap-2">
                        <button className="flex-1 rounded-lg bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-600">
                          Approve
                        </button>
                        <button className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                          Reject
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Member-wise Spending */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col rounded-xl bg-white p-5 shadow-md"
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Member-wise Spending
                </h3>
                <p className="text-sm text-gray-500">
                  Horizontal bar chart showing spending by each family member
                </p>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      {
                        name: dashboardData.parentName,
                        spent: dashboardData.parentSpent,
                        limit: dashboardData.parentBalance,
                      },
                      ...dashboardData.wallets.map((wallet) => ({
                        name: wallet.name,
                        spent: wallet.spent,
                        limit: wallet.limit,
                      })),
                    ]}
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <RechartsTooltip
                      formatter={(value) => [`₹${value}`, "Amount"]}
                    />
                    <Bar
                      dataKey="spent"
                      fill="#3b82f6"
                      radius={[0, 4, 4, 0]}
                      animationBegin={300}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            
            <Link to="/add-member">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-3 font-medium text-white shadow-lg shadow-blue-200 hover:bg-blue-600"
            >
              <Users size={18} />
              <span>Add New Member</span>
            </motion.button>
            </Link>
                <Link to="/link-wallet"> 
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-3 font-medium text-white shadow-lg shadow-green-200 hover:bg-green-600"
            >
              
              <span>Top-up Wallet</span>
            </motion.button>

            

            </Link>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRulesModal(true)}
                className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-3 font-medium text-white shadow-lg shadow-purple-200 hover:bg-purple-600"
              >
              <Book size={18} />
              <span>View Rules</span>
            </motion.button>
          </motion.div>



        </motion.div>

        
      </div>

      {/* Add Funds Modal */}
      {showFundsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <h3 className="mb-4 text-xl font-bold text-gray-800">Add Funds to {selectedWallet?.name}'s Wallet</h3>
            
            <div className="mb-6">
              <label htmlFor="fundAmount" className="mb-2 block text-sm font-medium text-gray-700">
                Enter amount to transfer
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="fundAmount"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-8 pr-4 text-lg font-medium focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFundsModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFundsSubmit}
                disabled={isAddingFunds || fundsAdded || !fundAmount || isNaN(fundAmount) || Number(fundAmount) <= 0}
                className={`flex flex-1 items-center justify-center rounded-lg px-4 py-3 font-medium text-white ${
                  isAddingFunds || fundsAdded
                    ? "bg-green-500"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                {isAddingFunds ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : fundsAdded ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} />
                    <span>Success!</span>
                  </div>
                ) : (
                  "Add Funds"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Transaction History Modal */}
      {showAllTransactions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Transaction History
                {currentWalletView && ` - ${currentWalletView}`}
              </h3>
              <button
                onClick={() => setShowAllTransactions(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex flex-col gap-3">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 rounded-lg border p-3 ${
                      transaction.status === "FAILED" 
                        ? "border-red-200 bg-red-50" 
                        : "border-gray-100 hover:bg-blue-50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        transaction.status === "FAILED"
                          ? "bg-red-100 text-red-600"
                          : transaction.amount < 0
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {getTransactionIcon(transaction.description)}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {transaction.merchantName || transaction.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </p>
                        {transaction.status === "FAILED" && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                            Failed
                          </span>
                        )}
                      </div>
                      {transaction.status === "FAILED" && transaction.failureReason && (
                        <p className="mt-1 text-xs text-red-500">
                          {transaction.failureReason}
                        </p>
                      )}
                    </div>

                    <p
                      className={`font-medium ${
                        transaction.status === "FAILED"
                          ? "text-red-600"
                          : transaction.amount < 0
                            ? "text-red-600"
                            : "text-green-600"
                      }`}
                    >
                      {transaction.amount < 0 ? "-" : "+"}₹{Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Member Rules</h3>
              <button 
                onClick={() => {
                  setShowRulesModal(false);
                  setSelectedMemberForRules(null);
                  setMemberRules([]);
                }}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            {!selectedMemberForRules ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-600">Select a member to view their rules:</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {dashboardData.wallets.map((wallet) => (
                    <motion.button
                      key={wallet.id}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => {
                        setSelectedMemberForRules(wallet);
                        fetchMemberRules(wallet.name);
                      }}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left hover:border-blue-300 hover:bg-blue-50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm text-white">
                        {wallet.avatar}
                      </div>
                      <span className="font-medium">{wallet.name}</span>
                      
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm text-white">
                      {selectedMemberForRules.avatar}
                    </div>
                    <h4 className="text-lg font-medium">{selectedMemberForRules.name}'s Rules</h4>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMemberForRules(null);
                      setMemberRules([]);
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Choose Another
                  </button>
                </div>
                
                {loadingRules ? (
                  <div className="flex justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-400 border-t-blue-600"></div>
                  </div>
                ) : memberRules.length > 0 ? (
                  <div className="flex max-h-96 flex-col gap-4 overflow-y-auto">
                    {memberRules.map((rule) => (
                      <motion.div
                        key={rule.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${rule.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <h5 className="font-semibold">{rule.ruleName}</h5>
                          </div>
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                            {rule.ruleType.replace(/_/g, ' ')}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {rule.active ? "Active" : "Inactive"}
                            </span>
                            <button
                              onClick={() => toggleRuleStatus(rule.id, rule.active)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                rule.active ? "bg-blue-600" : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  rule.active ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700">Conditions:</p>
                          <ul className="ml-4 mt-1 list-disc text-sm text-gray-600">
                            {rule.conditions.map((condition) => (
                              <li key={condition.id}>
                                {condition.conditionType === "AMOUNT" ? "Amount" : condition.conditionType} {condition.operator} {condition.valueString}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Actions:</p>
                          <ul className="ml-4 mt-1 list-disc text-sm text-gray-600">
                            {rule.actions.map((action) => (
                              <li key={action.id}>
                                {action.actionType === "BLOCK" ? "Block Transaction" : action.actionType}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-50 p-6 text-center">
                    <p className="text-gray-600">No rules found for this member.</p>
                    <button 
                      className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                      onClick={() => {
                        // Here you would navigate to create rule page or open create rule modal
                        navigate("/rules")
                      }}
                    >
                      Create New Rule
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ParentDashboard