"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Info,
  BarChart3,
  Gift,
  Menu,
  X,
  Sun,
  Moon,
  CreditCard,
  TrendingUp,
  Calendar,
  Star,
  ShoppingBag,
  Plane,
  Utensils,
  Home,
  Zap,
  CheckCircle,
  Trophy,
  Target,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Montserrat } from "next/font/google"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})      


const theme = {
  light: {
    bg: "bg-gray-50",
    cardBg: "bg-white",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-gray-200",
    sidebar: "bg-white",
    accent: "text-emerald-600",
    accentBg: "bg-emerald-50",
    button: "bg-emerald-600 hover:bg-emerald-700",
    buttonSecondary: "bg-indigo-600 hover:bg-indigo-700",
    shadow: "shadow-lg",
  },
  dark: {
    bg: "bg-black",
    cardBg: "bg-black/90 border-[1px] border-gray-700 backdrop-blur-sm",
    text: "text-white",
    textSecondary: "text-gray-300",
    border: "border-gray-700",
    sidebar: "bg-black/80 border-r-[1px] border-gray-700 backdrop-blur-sm",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-900/20",
    button: "bg-emerald-600 hover:bg-emerald-500",
    buttonSecondary: "bg-indigo-600 hover:bg-indigo-500",
    shadow: "shadow-2xl shadow-black/50",
  },
}


interface SpendingData {
  category: string
  amount: number
  color: string
}

interface RewardItem {
  id: number
  name: string
  points: number
  image: string
  category: string
  redeemed?: boolean
}

interface TierProgress {
  current: string
  progress: number
  nextTier: string
  pointsNeeded: number
}


const spendingData: SpendingData[] = [
  { category: "Groceries", amount: 850, color: "#10b981" },
  { category: "Dining", amount: 420, color: "#3b82f6" },
  { category: "Travel", amount: 680, color: "#f59e0b" },
  { category: "Shopping", amount: 320, color: "#ef4444" },
  { category: "Gas", amount: 180, color: "#8b5cf6" },
  { category: "Entertainment", amount: 240, color: "#06b6d4" },
]

const monthlyTrend = [
  { month: "Jan", amount: 2100 },
  { month: "Feb", amount: 1800 },
  { month: "Mar", amount: 2400 },
  { month: "Apr", amount: 2200 },
  { month: "May", amount: 2600 },
  { month: "Jun", amount: 2690 },
]

const rewardCatalog: RewardItem[] = [
  {
    id: 1,
    name: "Starbucks Coffee",
    points: 500,
    image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg",
    category: "Food & Drink",
  },
  {
    id: 2,
    name: "Movie Tickets",
    points: 1200,
    image: "https://images.pexels.com/photos/269140/pexels-photo-269140.jpeg",
    category: "Entertainment",
  },
  {
    id: 3,
    name: "Amazon Gift Card",
    points: 2000,
    image: "https://images.pexels.com/photos/360624/pexels-photo-360624.jpeg",
    category: "Shopping",
  },
  {
    id: 4,
    name: "Gas Station Credit",
    points: 800,
    image: "https://images.pexels.com/photos/3116970/pexels-photo-3116970.jpeg",
    category: "Transportation",
  },
  {
    id: 5,
    name: "Restaurant Voucher",
    points: 1500,
    image: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg",
    category: "Food & Drink",
  },
  {
    id: 6,
    name: "Travel Discount",
    points: 3000,
    image: "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg",
    category: "Travel",
  },
]

const tierProgress: TierProgress = {
  current: "Gold",
  progress: 75,
  nextTier: "Platinum",
  pointsNeeded: 2500,
}

export default function CardSenseDashboard() {
  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null)
  const [paymentAmount, setPaymentAmount] = useState("1247.83")
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [currentBalance, setCurrentBalance] = useState(3200)
  const [creditLimit] = useState(10000)
  const [monthlySpent, setMonthlySpent] = useState(2690)
  const [availablePoints, setAvailablePoints] = useState(12450)
  const [redeemProcessing, setRedeemProcessing] = useState(false)
  const [rewardCatalogState, setRewardCatalogState] = useState(rewardCatalog)


  useEffect(() => {
    setIsLargeScreen(window.innerWidth >= 1024)
    setSidebarOpen(window.innerWidth >= 1024)

    const handleResize = () => {
      const isLarge = window.innerWidth >= 1024
      setIsLargeScreen(isLarge)
      setSidebarOpen(isLarge)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const currentTheme = isDark ? theme.dark : theme.light

  const today = new Date()
  const paymentDueDate = new Date(today.getFullYear(), 7, 25) 
  
  if (today > paymentDueDate) {
    if (today.getMonth() === 11) { 
      paymentDueDate.setFullYear(today.getFullYear() + 1)
      paymentDueDate.setMonth(0) 
    } else {
      paymentDueDate.setMonth(paymentDueDate.getMonth() + 1)
    }
  }
  
  const daysUntilDue = Math.ceil((paymentDueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))

  const availableCredit = creditLimit - currentBalance
  const utilizationPercentage = Math.round((currentBalance / creditLimit) * 100)
  const minimumPayment = Math.max(Math.round(currentBalance * 0.047), 35) 

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    scrollToTop()
  }

  const handlePaymentClick = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSubmit = () => {
    setPaymentProcessing(true)
    const paymentValue = parseFloat(paymentAmount)
    
    setTimeout(() => {
      const newBalance = currentBalance - paymentValue
      setCurrentBalance(newBalance)
      
      setMonthlySpent(prev => Math.max(0, prev - paymentValue))

      setPaymentProcessing(false)
      setShowPaymentModal(false)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)

      setPaymentAmount(newBalance.toFixed(2))
    }, 2000)
  }

  const handleRewardClick = (reward: RewardItem) => {
    setSelectedReward(reward)
    setShowModal(true)
  }

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  }

  const contentVariants = {
    expanded: { marginLeft: "16rem" },
    collapsed: { marginLeft: "0rem" },
  }

  const navItems = [
    { id: "about", label: "About", icon: Info },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "rewards", label: "Rewards", icon: Gift },
  ]

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-300 ${montserrat.className}`}>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3"
          >
            <CheckCircle size={24} />
            <div>
              <div className="font-medium">
                {selectedReward ? 'Reward Redeemed Successfully' : 'Payment Successful'}
              </div>
              <div className="text-sm opacity-90">
                {selectedReward
                  ? `${selectedReward.name} redeemed for ${selectedReward.points.toLocaleString()} points`
                  : `Payment of $${paymentAmount} has been processed`}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !paymentProcessing && setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`${currentTheme.cardBg} rounded-xl p-6 max-w-md w-full ${currentTheme.shadow}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${currentTheme.text}`}>Make a Payment</h3>
                {!paymentProcessing && (
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className={`${currentTheme.textSecondary} hover:${currentTheme.text} transition-colors cursor-pointer`}
                  >
                    <X size={24} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.textSecondary} mb-1`}>Payment Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      disabled={paymentProcessing}
                      className={`w-full pl-7 pr-3 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.cardBg} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    className={`px-3 py-1 rounded-lg ${currentTheme.border} ${currentTheme.text} ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} cursor-pointer`}
                    onClick={() => setPaymentAmount(minimumPayment.toFixed(2))}
                    disabled={paymentProcessing}
                  >
                    Minimum (${minimumPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                  </button>
                  <button
                    className={`px-3 py-1 rounded-lg ${currentTheme.border} ${currentTheme.text} ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} cursor-pointer`}
                    onClick={() => setPaymentAmount(currentBalance.toFixed(2))}
                    disabled={paymentProcessing}
                  >
                    Full Balance
                  </button>
                </div>

                <div className={`p-3 rounded-lg ${currentTheme.border} mt-4`}>
                  <div className="flex justify-between mb-2">
                    <span className={currentTheme.textSecondary}>Current Balance</span>
                    <span className={currentTheme.text}>${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={currentTheme.textSecondary}>Payment Amount</span>
                    <span className={currentTheme.text}>-${parseFloat(paymentAmount || "0").toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span className={currentTheme.text}>New Balance</span>
                      <span className={currentTheme.text}>
                        ${(currentBalance - parseFloat(paymentAmount || "0")).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePaymentSubmit}
                  disabled={paymentProcessing}
                  className={`w-full ${currentTheme.button} text-white py-3 cursor-pointer px-4 rounded-lg font-medium transition-colors mt-4 relative overflow-hidden`}
                >
                  {paymentProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing Payment...
                    </div>
                  ) : (
                    "Make Payment"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {showModal && selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`${currentTheme.cardBg} rounded-xl p-6 max-w-md w-full ${currentTheme.shadow}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${currentTheme.text}`}>Redeem Reward</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={`${currentTheme.textSecondary} hover:${currentTheme.text} transition-colors cursor-pointer`}
                >
                  <X size={24} />
                </button>
              </div>
              <img
                src={selectedReward.image || "/placeholder.svg"}
                alt={selectedReward.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h4 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>{selectedReward.name}</h4>
              <div className="space-y-4 mb-4">
                <p className={`${currentTheme.textSecondary}`}>
                  Redeem this reward for {selectedReward.points.toLocaleString()} points
                </p>
                <div className={`p-3 rounded-lg ${currentTheme.border}`}>
                  <div className="flex justify-between mb-2">
                    <span className={currentTheme.textSecondary}>Available Points</span>
                    <span className={currentTheme.text}>{availablePoints.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={currentTheme.textSecondary}>Reward Cost</span>
                    <span className={currentTheme.text}>-{selectedReward.points.toLocaleString()}</span>
                  </div>
                  <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-600'} pt-2 mt-2`}>
                    <div className="flex justify-between font-medium">
                      <span className={currentTheme.text}>Remaining Points</span>
                      <span className={`${availablePoints >= selectedReward.points ? currentTheme.text : 'text-red-500'}`}>
                        {(availablePoints - selectedReward.points).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                {availablePoints < selectedReward.points && (
                  <div className="text-red-500 text-sm flex items-center gap-2 cursor-pointer">
                    <X size={16} />
                    <span>Insufficient points for this reward</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  className={`flex-1 ${currentTheme.button} text-white px-4 py-2 rounded-lg font-medium transition-colors relative cursor-pointer ${
                    availablePoints < selectedReward.points ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => {
                    if (availablePoints >= selectedReward.points) {
                      setRedeemProcessing(true)
                      // Simulate processing
                      setTimeout(() => {
                        setAvailablePoints(prev => prev - selectedReward.points)
                        setRewardCatalogState(prev => 
                          prev.map(reward => 
                            reward.id === selectedReward.id 
                              ? { ...reward, redeemed: true }
                              : reward
                          )
                        )
                        setShowModal(false)
                        setShowToast(true)
                        setRedeemProcessing(false)
                        setTimeout(() => setShowToast(false), 3000)
                      }, 1500)
                    }
                  }}
                  disabled={availablePoints < selectedReward.points || redeemProcessing}
                >
                  {redeemProcessing ? (
                    <div className="flex items-center justify-center cursor-pointer">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 cursor-not-allowed" />
                      Processing...
                    </div>
                  ) : (
                    'Redeem Now'
                  )}
                </button>
                <button
                  className={`flex-1 ${currentTheme.border} border-2 cursor-pointer ${currentTheme.text} px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  onClick={() => setShowModal(false)}
                  disabled={redeemProcessing}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      <motion.div
        variants={sidebarVariants}
        animate={isLargeScreen ? "open" : (sidebarOpen ? "open" : "closed")}
        className={`fixed left-0 top-0 h-full ${currentTheme.sidebar} ${currentTheme.shadow} z-40 transition-colors duration-300 lg:translate-x-0 w-64`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <CreditCard className="text-white" size={20} />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <h1 className={`text-xl font-bold ${currentTheme.text}`}>CardSense</h1>
                {/* <p className={`text-sm ${currentTheme.textSecondary}`}>Credit Card Dashboard</p> */}
              </motion.div>
            )}
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleTabChange(item.id)
                    window.innerWidth < 1024 && setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeTab === item.id
                      ? `${currentTheme.accentBg} ${currentTheme.accent} font-medium`
                      : `${currentTheme.textSecondary} ${isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100/80'}`
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                      {item.label}
                    </motion.span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-6 left-6 right-6"
          >
            <div className={`${currentTheme.accentBg} rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className={`${currentTheme.accent}`} size={16} />
                <span className={`text-sm font-medium ${currentTheme.text}`}>Current Tier</span>
              </div>
              <p className={`text-lg font-bold ${currentTheme.accent}`}>{tierProgress.current}</p>
              <div className={`w-full ${isDark ? 'bg-gray-800' : 'bg-gray-300'} rounded-full h-3 mt-2`}>
                <div
                  className="bg-gradient-to-r from-emerald-500 to-indigo-600 h-3 rounded-full"
                  style={{ width: `${tierProgress.progress}%` }}
                />
              </div>
              <p className={`text-xs ${currentTheme.textSecondary} mt-1`}>
                {tierProgress.pointsNeeded} points to {tierProgress.nextTier}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>


      <motion.div
        variants={contentVariants}
        animate={isLargeScreen ? "expanded" : "collapsed"}
        className="transition-all duration-300 lg:ml-64"
      >

        <header
          className={`${currentTheme.cardBg} ${currentTheme.border} border-b px-6 py-4 transition-colors duration-300 sticky top-0 z-20 backdrop-blur-sm `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`${currentTheme.textSecondary} hover:${currentTheme.text} transition-colors cursor-pointer lg:hidden`}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div>
                <h2 className={`text-2xl font-bold ${currentTheme.text} capitalize mb-1`}>{activeTab}</h2>
                <p className={`${currentTheme.textSecondary}`}>
                  {activeTab === "dashboard" && "Monitor your spending and credit usage"}
                  {activeTab === "about" && "Learn about credit cards and financial literacy"}
                  {activeTab === "rewards" && "Discover and redeem your rewards"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg ${currentTheme.textSecondary} hover:${currentTheme.text} ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100/60'} transition-all cursor-pointer`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>


        <main className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-8"
              >

                <div
                  className={`${currentTheme.cardBg} rounded-xl p-8 ${currentTheme.shadow} transition-colors duration-300`}
                >
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <div className="w-full md:w-1/2 max-w-[400px] mx-auto">
                    <div className="relative w-full aspect-[1.586/1]">
                      <div className="absolute inset-0 bg-[#284683] rounded-[16px] shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <div className="absolute top-[8%] left-[8%]">
                          <div className="w-[15%] h-[15%] min-w-[30px] min-h-[24px] bg-[#f4d03f] rounded-[4px]" />
                        </div>
                        <div className="absolute top-[8%] right-[8%]">
                          <div className="text-white text-[min(4vw,24px)] font-['Arial'] italic font-bold tracking-wider">
                            VISA
                          </div>
                        </div>
                        <div className="absolute top-1/2 left-[8%] right-[8%] -mt-4">
                          <div className="flex items-center justify-between text-white text-[min(3.5vw,20px)] tracking-widest">
                            <div className="flex gap-1">
                              <span>•</span><span>•</span><span>•</span><span>•</span>
                            </div>
                            <div className="flex gap-1">
                              <span>•</span><span>•</span><span>•</span><span>•</span>
                            </div>
                            <div className="flex gap-1">
                              <span>•</span><span>•</span><span>•</span><span>•</span>
                            </div>
                            <div className="font-mono">1234</div>
                          </div>
                        </div>
                        <div className="absolute bottom-[8%] left-[8%] right-[8%]">
                          <div className="flex items-center justify-between">
                            <div className="text-white font-['Arial'] tracking-wider text-[min(3vw,16px)]">JANE DOE</div>
                            <div className="text-white font-['Arial'] tracking-wider text-[min(3vw,16px)]">VALID THRU 12/28</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 text-center md:text-left">
                    <h1 className={`text-3xl font-bold ${currentTheme.text} mb-4`}>Understanding Credit Cards</h1>
                    <p className={`text-lg ${currentTheme.textSecondary}`}>
                      Master the fundamentals of credit cards to make informed financial decisions and build a strong
                      credit foundation.
                    </p>
                  </div>
                  </div>
                </div>

                <div
                  className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300 relative overflow-hidden group`}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-800 to-blue-900 group-hover:w-2 transition-all duration-300" />
                  <div className="flex items-start gap-4">
                    <div className={`${currentTheme.accentBg} p-3 rounded-lg`}>
                      <Info className="text-blue-800 dark:text-blue-400" size={24} />
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold ${currentTheme.text} mb-3`}>What is a Credit Card?</h3>
                      <p className={`${currentTheme.textSecondary} leading-relaxed`}>
                        A credit card is a financial tool that allows you to borrow money from a bank or financial
                        institution to make purchases. Unlike a debit card that uses your own money, a credit card
                        provides you with a line of credit that you must pay back, typically with interest if not paid
                        in full by the due date.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`${currentTheme.accentBg} p-3 rounded-lg`}>
                      <TrendingUp className={`${currentTheme.accent}`} size={24} />
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold ${currentTheme.text} mb-3`}>How Interest Works</h3>
                      <div className="flex flex-col  gap-4">
                        <p className={`${currentTheme.textSecondary} leading-relaxed flex-1`}>
                          Interest is the cost of borrowing money. Credit cards typically have an Annual Percentage Rate
                          (APR) that determines how much interest you'll pay on unpaid balances.
                        </p>
                        <div className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300 flex-1`}>
                          <p className={`text-green-500 text-md font-semibold`}>
                            <strong>Pro Tip:</strong> Pay your full balance each month to avoid interest charges entirely!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
                        <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                      </div>
                      <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Advantages</h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "Builds credit history and improves credit score",
                        "Earn rewards, cashback, and travel points",
                        "Purchase protection and extended warranties",
                        "Emergency financial backup",
                        "Convenient for online and international purchases",
                      ].map((advantage, index) => (
                        <li key={index} className={`flex items-start gap-2 ${currentTheme.textSecondary} p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors duration-200 group`}>
                          <Star className="text-green-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" size={16} />
                          <span className="text-sm group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
                        <X className="text-red-600 dark:text-red-400" size={20} />
                      </div>
                      <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Disadvantages</h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "High interest rates on unpaid balances",
                        "Risk of overspending and debt accumulation",
                        "Annual fees and various charges",
                        "Negative impact on credit score if misused",
                        "Temptation to make impulse purchases",
                      ].map((disadvantage, index) => (
                        <li key={index} className={`flex items-start gap-2 ${currentTheme.textSecondary} p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200 group`}>
                          <X className="text-red-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" size={16} />
                          <span className="text-sm group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">{disadvantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300 relative overflow-hidden group`}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-800 to-blue-900 group-hover:w-2 transition-all duration-300" />
                  <h3 className={`text-xl font-semibold ${currentTheme.text} mb-4 flex items-center gap-2`}>
                    <Target className="text-blue-800 dark:text-blue-400" size={24} />
                    Best Practices for Credit Card Use
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "Pay your full balance every month",
                      "Keep credit utilization below 30%",
                      "Make payments on time to avoid late fees",
                      "Monitor your credit report regularly",
                      "Only spend what you can afford to pay back",
                      "Choose cards with rewards that match your spending",
                    ].map((practice, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg  transition-colors duration-200 group ">
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full group-hover:scale-150 transition-transform duration-200" />
                        <span className={`${currentTheme.textSecondary} text-sm transition-colors duration-200`}>{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl group`}
                  >
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <CreditCard className="text-blue-600 dark:text-blue-400" size={20} />
                      </div>
                      <h3 className={`text-sm font-medium ${currentTheme.textSecondary}`}>Current Balance</h3>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className={`text-2xl font-bold ${currentTheme.text}`}>${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <p className={`text-sm ${currentTheme.textSecondary} mt-1`}>Last statement balance</p>
                    </div>
                  </div>

                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl group`}
                  >
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <Zap className="text-green-600 dark:text-green-400" size={20} />
                      </div>
                      <h3 className={`text-sm font-medium ${currentTheme.textSecondary}`}>Available Credit</h3>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className={`text-2xl font-bold ${currentTheme.text}`}>${availableCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <p className={`text-sm ${currentTheme.textSecondary} mt-1`}>Of ${creditLimit.toLocaleString('en-US')} credit limit</p>
                    </div>
                  </div>

              
                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl group`}
                  >
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <Calendar className="text-purple-600 dark:text-purple-400" size={20} />
                      </div>
                      <h3 className={`text-sm font-medium ${currentTheme.textSecondary}`}>Payment Due</h3>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className={`text-2xl font-bold ${currentTheme.text}`}>Aug 25</div>
                      <p className={`text-sm ${currentTheme.textSecondary} mt-1`}>{daysUntilDue} days remaining</p>
                    </div>
                  </div>

              
                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl group`}
                  >
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <TrendingUp className="text-orange-600 dark:text-orange-400" size={20} />
                      </div>
                      <h3 className={`text-sm font-medium ${currentTheme.textSecondary}`}>Minimum Payment</h3>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className={`text-2xl font-bold ${currentTheme.text}`}>${minimumPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <p className={`text-sm ${currentTheme.textSecondary} mt-1`}>4.7% of balance</p>
                    </div>
                  </div>
                </div>

               
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl group `}
                   
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Credit Usage</h3>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br from-emerald-500/10 to-blue-500/10">
                        <CreditCard className={`${currentTheme.accent} transition-transform duration-300 group-hover:scale-110`} size={20} />
                      </div>
                    </div>
                    <div className="relative w-32 h-32 mx-auto mb-4 transition-transform duration-300 group-hover:scale-105">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`${currentTheme.textSecondary} opacity-20`}
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="2"
                          strokeDasharray={`${utilizationPercentage}, 100`}
                          strokeLinecap="round"
                          className="transition-all duration-500 group-hover:stroke-[3]"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${currentTheme.text} transition-all duration-300 group-hover:scale-110`}>{utilizationPercentage}%</div>
                          <div className={`text-xs ${currentTheme.textSecondary}`}>Credit Used</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className={`text-md font-semibold ${currentTheme.textSecondary} transition-all duration-300 `}>${currentBalance.toLocaleString('en-US')} of ${creditLimit.toLocaleString('en-US')} limit</p>
                      <p className={`text-sm ${utilizationPercentage <= 30 ? 'text-green-500' : utilizationPercentage <= 50 ? 'text-yellow-500' : 'text-red-500'} mt-2 transition-all duration-300 group-hover:scale-105`}>
                        {utilizationPercentage <= 30 ? 'Good utilization ratio' : utilizationPercentage <= 50 ? 'Moderate utilization' : 'High utilization'}
                      </p>
                    </div>
                  </div>


                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl group `}
                  
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Payment Due</h3>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br from-emerald-500/10 to-blue-500/10">
                        <Calendar className={`${currentTheme.accent} transition-transform duration-300 group-hover:scale-110`} size={20} />
                      </div>
                    </div>
                    <div className="relative w-32 h-32 mx-auto mb-4 transition-transform duration-300 group-hover:scale-105">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`${currentTheme.textSecondary} opacity-20`}
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="url(#gradientDue)"
                          strokeWidth="2"
                          strokeDasharray={`${(daysUntilDue / 30) * 100}, 100`}
                          strokeLinecap="round"
                          className="transition-all duration-500 group-hover:stroke-[3]"
                        />
                        <defs>
                          <linearGradient id="gradientDue" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${currentTheme.text} transition-all duration-300 group-hover:scale-110`}>{daysUntilDue}</div>
                          <div className={`text-xs ${currentTheme.textSecondary}`}>Days Left</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className={`text-md font-semibold ${currentTheme.textSecondary} transition-all duration-300`}>
                        Due August 25
                      </p>
                      <p className={`text-sm ${daysUntilDue <= 5 ? 'text-red-500' : daysUntilDue <= 10 ? 'text-yellow-500' : 'text-green-500'} mt-2 transition-all duration-300 group-hover:scale-105`}>
                        {daysUntilDue <= 5 ? 'Due very soon!' : daysUntilDue <= 10 ? 'Due soon' : 'Payment on track'}
                      </p>
                    </div>
                  </div>


                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl  group`}
                  >
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={24} />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>This Month</h3>
                      <div className={`text-3xl font-bold ${currentTheme.text} mb-2`}>$2,690</div>
                      <p className={`text-sm ${currentTheme.textSecondary} mb-3`}>Total spent</p>
                      <div className="inline-flex items-center gap-1 bg-green-600/10 dark:bg-green-900/20 px-3 py-1 rounded-full">
                        <TrendingUp className="text-green-700 " size={16} />
                        <span className="text-green-700  text-sm font-medium">+12% from last month</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300`}
                  >
                    <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Spending by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={spendingData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                        <XAxis
                          dataKey="category"
                          tick={{ fill: isDark ? "#d1d5db" : "#6b7280", fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fill: isDark ? "#d1d5db" : "#6b7280", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#1f2937" : "#ffffff",
                            border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                            borderRadius: "8px",
                            color: isDark ? "#ffffff" : "#000000",
                          }}
                        />
                        <Bar dataKey="amount" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300`}
                  >
                    <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>6-Month Spending Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                        <XAxis dataKey="month" tick={{ fill: isDark ? "#d1d5db" : "#6b7280", fontSize: 12 }} />
                        <YAxis tick={{ fill: isDark ? "#d1d5db" : "#6b7280", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? "#1f2937" : "#ffffff",
                            border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                            borderRadius: "8px",
                            color: isDark ? "#ffffff" : "#000000",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="url(#lineGradient)"
                          strokeWidth={3}
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: "#3b82f6" }}
                        />
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "rewards" && (
              <motion.div
                key="rewards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <Trophy className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Current Tier</h3>
                        <p className={`text-2xl font-bold text-yellow-600`}>{tierProgress.current}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={currentTheme.textSecondary}>Progress to {tierProgress.nextTier}</span>
                        <span className={currentTheme.text}>{tierProgress.progress}%</span>
                      </div>
                      <div className={`w-full ${isDark ? 'bg-gray-800' : 'bg-gray-300'} rounded-full h-3`}>
                        <motion.div
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${tierProgress.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <p className={`text-xs ${currentTheme.textSecondary}`}>
                        {tierProgress.pointsNeeded} more points needed
                      </p>
                    </div>
                  </div>

                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`${currentTheme.accentBg} p-3 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110`}>
                        <Zap className={`${currentTheme.accent}`} size={24} />
                      </div>
                      <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>Total Cashback</h3>
                      <p className={`text-3xl font-bold ${currentTheme.accent} mb-2`}>$1,247.50</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="text-green-500" size={16} />
                        <p className={`text-sm ${currentTheme.textSecondary}`}>Earned this year</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`${currentTheme.accentBg} p-3 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110`}>
                        <Star className={`${currentTheme.accent}`} size={24} />
                      </div>
                      <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>Available Points</h3>
                      <p className={`text-3xl font-bold ${currentTheme.accent} mb-2`}>{availablePoints.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <Gift className="text-purple-500" size={16} />
                        <p className={`text-sm ${currentTheme.textSecondary}`}>Ready to redeem</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                    <h3 className={`text-xl font-semibold ${currentTheme.text}`}>Reward Catalog</h3>
                    <div className="flex items-center gap-2">
                      <Gift className={`${currentTheme.accent}`} size={20} />
                      <span className={`text-sm ${currentTheme.textSecondary}`}>6 rewards available</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewardCatalogState.map((reward) => (
                      <motion.div
                        key={reward.id}
                        whileHover={!reward.redeemed ? { scale: 1.02 } : {}}
                        whileTap={!reward.redeemed ? { scale: 0.98 } : {}}
                        className={`${currentTheme.border} border rounded-xl overflow-hidden transition-all duration-200 
                          ${reward.redeemed 
                            ? 'opacity-60 cursor-not-allowed' 
                            : 'cursor-pointer hover:shadow-lg'}`
                        }
                        onClick={() => !reward.redeemed && handleRewardClick(reward)}
                      >
                        <div className="relative">
                          <img
                            src={reward.image || "/placeholder.svg"}
                            alt={reward.name}
                            className={`w-full h-48 object-cover ${reward.redeemed ? 'filter grayscale' : ''}`}
                          />
                          {reward.redeemed && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <div className="bg-black bg-opacity-75 px-4 py-2 rounded-lg text-white font-medium">
                                Already Redeemed
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-semibold ${currentTheme.text}`}>{reward.name}</h4>
                            <span
                              className={`text-xs px-2 py-1 ${currentTheme.accentBg} ${currentTheme.accent} rounded-full`}
                            >
                              {reward.category}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="text-yellow-500" size={16} />
                              <span className={`text-sm font-medium ${currentTheme.text}`}>{reward.points} pts</span>
                            </div>
                            <button
                              className={`text-xs ${reward.redeemed ? 'bg-gray-400' : currentTheme.buttonSecondary} text-white px-3 py-1 rounded-full transition-colors ${reward.redeemed ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              disabled={reward.redeemed}
                            >
                              {reward.redeemed ? 'Redeemed' : 'Redeem'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div
                  className={`${currentTheme.cardBg} rounded-xl p-6 ${currentTheme.shadow} transition-colors duration-300`}
                >
                  <h3 className={`text-xl font-semibold ${currentTheme.text} mb-6`}>Achievement Badges</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: "First Purchase", icon: ShoppingBag, earned: true, color: "text-green-500" },
                      { name: "Travel Enthusiast", icon: Plane, earned: true, color: "text-blue-500" },
                      { name: "Foodie Explorer", icon: Utensils, earned: true, color: "text-orange-500" },
                      { name: "Responsible Spender", icon: Home, earned: false, color: "text-gray-400" },
                    ].map((badge, index) => {
                      const Icon = badge.icon
                      return (
                        <motion.div
                          key={badge.name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`text-center p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                            badge.earned 
                              ? `${currentTheme.accentBg} hover:shadow-lg` 
                              : `${isDark ? 'bg-gray-900' : 'bg-gray-100'} hover:bg-opacity-80`
                          }`}
                        >
                          <div
                            className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                              badge.earned 
                                ? currentTheme.accentBg 
                                : isDark ? 'bg-gray-800' : 'bg-gray-200'
                            }`}
                          >
                            <Icon className={`${badge.color} transition-all duration-300 group-hover:scale-110`} size={24} />
                          </div>
                          <p
                            className={`text-sm font-medium transition-colors duration-300 ${badge.earned ? currentTheme.text : currentTheme.textSecondary}`}
                          >
                            {badge.name}
                          </p>
                          {badge.earned && (
                            <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1 transition-transform duration-300 group-hover:scale-150" />
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  )
}