import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Docs from './pages/Docs'
import M365AutomationProject from './pages/M365AutomationProject'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/projects/m365-automation" element={<M365AutomationProject />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
