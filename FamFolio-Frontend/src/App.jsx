import { useState } from 'react'

import './App.css'
import AuthPage from './pages/AuthPage'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LinkWallet from './pages/LinkWallet'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <LinkWallet/>
      
    </>
  )
}

export default App
