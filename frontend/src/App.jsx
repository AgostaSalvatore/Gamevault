import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="bg-gray-900 min-h-screen">
          <Routes>
            <Route path="/" element={<h1 className="text-white">Home</h1>} />
            <Route path="/login" element={<h1 className="text-white">Login</h1>} />
            <Route path="/register" element={<h1 className="text-white">Register</h1>} />
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