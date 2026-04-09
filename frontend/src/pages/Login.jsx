import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
    // Local state keeps auth form responsive without waiting for global context wiring
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Hit the API directly so we can surface backend validation messages without proxying through UI state machines later
            const response = await axios.post('http://gamevault.test/api/login', {
                email,
                password,
            })
            // Persist token client-side to allow subsequent requests to reuse it until we wire a dedicated auth store
            localStorage.setItem('token', response.data.token)
            navigate('/')
        } catch (err) {
            // Collapse any server-side error into a friendly label to avoid leaking implementation details
            setError('Credenziali non valide')
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                {error && <p>{error}</p>}
                <button type="submit">Accedi</button>
            </form>
        </div>
    )
}

export default Login