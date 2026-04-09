import { useState, useEffect } from "react"
import api from "../services/api"
import { useParams } from "react-router-dom"

function Profile() {
    const { userId } = useParams()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getProfile()
    }, [userId])

    const getProfile = async () => {
        setLoading(true)
        try {
            const response = await api.get(`/profile/${userId}`)
            setProfile(response.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: 'white' }}>Profile</h1>
            {loading && <p style={{ color: 'white' }}>Caricamento...</p>}
            {profile && (
                <div style={{ color: 'white' }}>
                    <h2>{profile.user.name}</h2>
                    <p>Email: {profile.user.email}</p>
                    <p>Rating medio: {profile.average_rating}</p>

                    <h3>Wishlist</h3>
                    {profile.wishlist.length === 0
                        ? <p>Nessun gioco nella wishlist</p>
                        : profile.wishlist.map((game) => (
                            <p key={game.id}>{game.name}</p>
                        ))
                    }

                    <h3>Ultime recensioni</h3>
                    {profile.recent_reviews.length === 0
                        ? <p>Nessuna recensione</p>
                        : profile.recent_reviews.map((review) => (
                            <div key={review.id}>
                                <p>{review.game.name} — {review.rating}/10</p>
                                <p>{review.body}</p>
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    )
}

export default Profile