import { useState } from 'react'

import './App.css'
import AuthPage from './pages/AuthPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AuthPage/>
    </>
  )
}

export default App
