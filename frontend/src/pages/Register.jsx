import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Register() {
    // Local state keeps auth form responsive without waiting for global context wiring
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Hit the API directly so we can surface backend validation messages without proxying through UI state machines later
            const response = await axios.post('http://gamevault.test/api/register', {
                name,
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
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: 'white' }}>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    style={{ display: 'block', margin: '10px 0', padding: '8px', color: 'black' }}
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    style={{ display: 'block', margin: '10px 0', padding: '8px', color: 'black' }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{ display: 'block', margin: '10px 0', padding: '8px', color: 'black' }}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={{ padding: '8px 16px', marginTop: '10px' }}>Register</button>
            </form>
        </div>
    )
}

export default Register