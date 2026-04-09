import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Login() {
    // Local state keeps auth form responsive without waiting for global context wiring
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Hit the API directly so we can surface backend validation messages without proxying through UI state machines later
            const response = await axios.post('http://gamevault.test/api/login', {
                email,
                password,
            })
            // Delegate persistence to the auth context so every consumer stays in sync on login
            login(response.data.user, response.data.token)
            navigate('/')
        } catch (err) {
            // Collapse any server-side error into a friendly label to avoid leaking implementation details
            setError('Credenziali non valide')
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-purple-500/20 bg-gray-900/80 p-8 shadow-[0_40px_80px_-40px_rgba(168,85,247,0.45)] backdrop-blur">
                <div className="mb-8 space-y-2 text-center">
                    <h1 className="text-3xl font-semibold tracking-wide text-purple-200">Login</h1>
                    <p className="text-sm text-gray-400">
                        Accedi per gestire la tua collezione e condividere i tuoi giochi preferiti.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-gray-100 placeholder-gray-500 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-gray-100 placeholder-gray-500 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>
                    {error && (
                        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-linear-to-r from-purple-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-purple-500 hover:to-fuchsia-500 hover:-translate-y-0.5 hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        Accedi
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login