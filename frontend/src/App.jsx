import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
// Contexts
import { AuthProvider } from './context/AuthContext'
// Components
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="bg-gray-900 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/collection" element={
              <ProtectedRoute>
                <h1 className="text-white">Collection</h1>
              </ProtectedRoute>
            } />
            <Route path="/profile/:userId" element={
              <ProtectedRoute>
                <h1 className="text-white">Profile</h1>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App