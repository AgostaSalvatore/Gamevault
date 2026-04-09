import { useState, useEffect } from "react"
import api from "../services/api"

function Collection() {
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getCollection()
    }, [])

    const getCollection = async () => {
        setLoading(true)
        try {
            const response = await api.get('/collection')
            setGames(response.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: 'white' }}>Collection</h1>
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

export default Collection
