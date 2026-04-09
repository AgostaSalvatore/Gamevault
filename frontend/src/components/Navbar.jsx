import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { token, user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-gray-900/95 backdrop-blur border-b border-purple-500/20">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link
                    to="/"
                    className="text-xl font-semibold tracking-wide text-purple-300 transition-colors hover:text-purple-200"
                >
                    GameVault
                </Link>

                {token ? (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/collection"
                            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:text-purple-200"
                        >
                            Collezione
                        </Link>
                        <Link
                            to={`/profile/${user?.id}`}
                            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:text-purple-200"
                        >
                            Profilo
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="rounded-md bg-purple-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-500 hover:shadow-md hover:-translate-y-0.5"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:text-purple-200"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-md border border-purple-500/50 px-4 py-1.5 text-sm font-semibold text-purple-200 transition hover:border-purple-400 hover:text-purple-100 hover:-translate-y-0.5"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar