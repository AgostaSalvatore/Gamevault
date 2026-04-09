import { useState, useEffect } from 'react'
import api from '../services/api'

function Home() {
    const [games, setGames] = useState([])
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        searchGames('zelda')
    }, [])

    const searchGames = async (searchQuery) => {
        setLoading(true)
        try {
            const response = await api.get(`/games/search?query=${searchQuery}`)
            setGames(response.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        searchGames(query)
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: 'white' }}>GameVault</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cerca un gioco..."
                    style={{ padding: '8px', marginRight: '8px', color: 'black' }}
                />
                <button type="submit" style={{ padding: '8px 16px' }}>Cerca</button>
            </form>
            {loading && <p style={{ color: 'white' }}>Caricamento...</p>}
            <div>
                {games.map((game) => (
                    <div key={game.id} style={{ color: 'white', margin: '10px 0' }}>
                        <p>{game.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home