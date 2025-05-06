"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Header from "../components/Header"
import Footer from "../components/Footer"

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 min-h-screen">
      <Header />

      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <main>
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-4 md:px-0">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Side - Text Content */}
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-blue-800 mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Smarter Family Spending Starts Here
            </motion.h1>
            <motion.p
              className="text-lg text-blue-700 mb-8 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Control, monitor, and guide your family's finances — all in one place. Build financial responsibility
              together.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium py-3 px-8 rounded-full shadow-md"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-700 font-medium py-3 px-8 rounded-full shadow-sm border border-blue-200"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side - Illustration */}
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full max-w-md">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -top-10 -left-10 w-20 h-20 bg-blue-100 rounded-full z-0"
              ></motion.div>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="absolute -bottom-5 -right-5 w-16 h-16 bg-blue-200 rounded-full z-0"
              ></motion.div>

              <motion.div
                className="relative z-10 bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-2xl shadow-xl"
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <img
                  src="https://img.freepik.com/free-vector/family-budget-planning-flat-composition-with-parents-children-around-laptop-with-financial-application_1284-60972.jpg"
                  alt="Family Finance Illustration"
                  className="w-full h-auto rounded-xl"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Features Section Component with Animation on Scroll
const FeaturesSection = () => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  }

  const features = [
    {
      icon: "👛",
      title: "Smart Wallets for Families",
      description: "Create and manage individual wallets for each family member with full visibility into spending.",
    },
    {
      icon: "📊",
      title: "Real-Time Spend Dashboard",
      description: "Get a live breakdown of expenses by category and person. Stay on top of your family's finances.",
    },
    {
      icon: "🎯",
      title: "Budget Controls & Alerts",
      description: "Set monthly/weekly limits for members. Receive instant alerts when budgets are exceeded.",
    },
    {
      icon: "🔔",
      title: "Request & Approve System",
      description: "Kids can request funds with reasons. Parents approve or reject instantly with one click.",
    },
  ]

  return (
    <section className="py-20 px-4 md:px-0" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Why FamFolio?</h2>
          <p className="text-blue-700 max-w-2xl mx-auto">
            Our platform provides everything you need to manage your family's finances effectively.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={controls}
              variants={featureVariants}
              whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
              className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm p-6 rounded-xl shadow-md transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-blue-800 mb-3">{feature.title}</h3>
              <p className="text-blue-700">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// About Section Component
const AboutSection = () => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const badges = [
    { icon: "🔒", text: "Secure" },
    { icon: "⚡", text: "Real-Time" },
    { icon: "👨‍👩‍👧‍👦", text: "Family-Focused" },
  ]

  return (
    <section className="py-20 px-4 md:px-0 bg-blue-50" ref={ref}>
      <div className="container mx-auto">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">What is FamFolio?</h2>

          <motion.p
            className="text-lg text-blue-700 mb-10"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { delay: 0.3, duration: 0.6 } },
            }}
          >
            FamFolio is a modern fintech platform designed for families to manage finances together. Parents stay in
            control, children learn financial responsibility — all from a secure, intuitive dashboard.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-6">
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                className="flex items-center bg-white px-6 py-3 rounded-full shadow-sm"
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { delay: 0.4 + index * 0.2, duration: 0.5 },
                  },
                }}
                whileHover={{ y: -5, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
              >
                <span className="text-2xl mr-2">{badge.icon}</span>
                <span className="font-medium text-blue-800">{badge.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// CTA Section Component
const CTASection = () => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <section className="py-20 px-4 md:px-0 relative overflow-hidden" ref={ref}>
      {/* Background Wave */}
      <div className="absolute inset-0 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
          <path
            fill="#EFF6FF"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 md:p-16 text-center text-white shadow-xl"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } },
            }}
          >
            Ready to take control of your family's spending?
          </motion.h2>

          <motion.p
            className="text-lg mb-8 max-w-2xl mx-auto"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { delay: 0.4, duration: 0.6 } },
            }}
          >
            Join thousands of families who are already managing their finances smarter with FamFolio.
          </motion.p>

          <motion.button
            className="bg-white text-blue-700 font-bold py-4 px-10 rounded-full shadow-lg text-lg"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1, transition: { delay: 0.6, duration: 0.6 } },
            }}
          >
            Create Your FamFolio Account
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default HomePage
