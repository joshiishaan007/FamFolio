import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
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
import RulesPage from './pages/RulesPage'
import ViewTransaction from './pages/ViewTransaction'
import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://famfolio-1.onrender.com',
});

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');
    
    if (!jwt || !role) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
      setUserRole(role);
      
      if (requiredRole && role !== requiredRole) {
        navigate('/');
      }
    }
  }, [navigate, requiredRole]);

  return isAuthenticated && (!requiredRole || userRole === requiredRole) ? children : null;
};

function App() {
  return (
    <Router>
      <div className="app-container bg-gradient-to-br from-blue-50">
        <br/>
        <br/>
        <br/>
        <Routes>
          {/* Routes with Header and Footer */}
          <Route path="/*" element={
            <>
              <Header/>
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/admin-dashboard" element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminDashboard/>
                    </ProtectedRoute>
                  }/>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/add-member" element={
                    <ProtectedRoute requiredRole="OWNER">
                      <AddMember />
                    </ProtectedRoute>
                  } />
                  <Route path="/link-wallet" element={
                    <ProtectedRoute requiredRole="OWNER">
                      <LinkWallet />
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/parent-dashboard" element={
                    <ProtectedRoute requiredRole="OWNER">
                      <ParentDashboard />
    
                    </ProtectedRoute>
                  } />
                  <Route path="/member-dashboard" element={
            
                      <MemberDashboard />
                  
                  } />
                  <Route path="/merchant-transaction" element={
                    <ProtectedRoute>
                      <MerchantTransaction />
                    </ProtectedRoute>
                  } />
                  <Route path="/rules" element={
                    <ProtectedRoute requiredRole="OWNER">
                      <RulesPage/>
                    </ProtectedRoute>
                  }/>
                  <Route path="/viewtxn" element={
                    <ProtectedRoute>
                      <ViewTransaction/>
                    </ProtectedRoute>
                  }/>
                </Routes>
              </main>
              
            </>
          }/>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/aadhar-verification" element={<AadharVerification />} />
          <Route path="/otp" element={<Otp />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App