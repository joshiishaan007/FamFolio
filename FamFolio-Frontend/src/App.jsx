import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import AuthPage from './pages/AuthPage'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LinkWallet from './pages/LinkWallet'
import AddMember from './pages/AddMember'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login'
import Register from './pages/Register'
import AadharVerification from './pages/AadharVerification'
import Otp from './pages/Otp'
import ParentDashboard from './pages/ParentDashboard'
import MemberDashboard from './pages/MemberDashboard'
import MerchantTransaction from './pages/MerchantTransaction'
import AdminDashboard from './pages/AdminDashboard'


function App() {
  return (
    <Router>
      <div className="app-container">
       
        <main>
          <Routes>
            
            <Route path="/" element={<HomePage />} />
            <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/aadhar-verification" element={<AadharVerification />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/add-member" element={<AddMember />} />
            <Route path="/link-wallet" element={<LinkWallet />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
            <Route path="/member-dashboard" element={<MemberDashboard />} />
            <Route path="/merchant-transaction" element={<MerchantTransaction />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App