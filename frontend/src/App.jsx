import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 min-h-screen">
        <Routes>
          <Route path="/" element={<h1 className="text-white">Home</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<h1 className="text-white">Register</h1>} />
          <Route path="/collection" element={<h1 className="text-white">Collection</h1>} />
          <Route path="/profile/:userId" element={<h1 className="text-white">Profile</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App