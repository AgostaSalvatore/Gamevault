import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(null)

    const login = (userData, userToken) => {
        setToken(userToken)
        setUser(userData)
        localStorage.setItem('token', userToken)
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}