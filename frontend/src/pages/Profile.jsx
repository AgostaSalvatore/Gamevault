import { useState, useEffect, useMemo } from "react"
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

    const renderStars = useMemo(() => {
        return (score) => {
            const maxStars = 10
            const filledStars = Math.round(score ?? 0)

            return Array.from({ length: maxStars }, (_, index) => (
                <span
                    key={index}
                    className={index < filledStars ? "text-yellow-400" : "text-gray-700"}
                >
                    ★
                </span>
            ))
        }
    }, [])

    return (
        <div className="px-4 py-12">
            <div className="mx-auto flex max-w-5xl flex-col gap-10">
                <header className="text-center">
                    <h1 className="text-4xl font-semibold tracking-wide text-purple-200">Profilo</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Esplora la tua identità videoludica e condividi le tue scoperte con la community.
                    </p>
                </header>

                {loading && (
                    <div className="rounded-2xl border border-purple-500/20 bg-gray-900/70 p-6 text-center text-purple-200">
                        Caricamento...
                    </div>
                )}

                {!loading && profile && (
                    <div className="space-y-10">
                        <section className="rounded-2xl border border-purple-500/20 bg-gray-900/80 p-8 shadow-[0_40px_80px_-40px_rgba(168,85,247,0.45)] backdrop-blur">
                            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-2 text-left">
                                    <h2 className="text-2xl font-semibold text-purple-100">{profile.user.name}</h2>
                                    <p className="text-sm text-gray-400">{profile.user.email}</p>
                                </div>
                                <div className="rounded-xl border border-purple-500/20 bg-gray-900 px-5 py-4 text-center">
                                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Rating medio</p>
                                    <div className="mt-3 flex justify-center gap-0.5 text-lg">
                                        {renderStars(profile.average_rating)}
                                    </div>
                                    <p className="mt-2 text-sm text-purple-100">{Number(profile.average_rating ?? 0).toFixed(1)}/10</p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-purple-100">Wishlist</h3>
                                <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
                                    {profile.wishlist.length} titoli
                                </span>
                            </div>
                            {profile.wishlist.length === 0 ? (
                                <div className="rounded-2xl border border-purple-500/10 bg-gray-900/70 p-10 text-center text-sm text-gray-400">
                                    Nessun gioco nella wishlist.
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {profile.wishlist.map((game) => {
                                        const coverImage = game.cover_image ?? game.cover_image_url ?? null

                                        return (
                                            <div
                                                key={game.id}
                                                className="group overflow-hidden rounded-2xl border border-purple-500/10 bg-gray-900/70 shadow-[0_30px_60px_-40px_rgba(168,85,247,0.4)] transition hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-purple-500/40"
                                            >
                                                {coverImage ? (
                                                    <img
                                                        src={coverImage}
                                                        alt={game.name}
                                                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-56 w-full items-center justify-center bg-gray-800 text-xs font-medium uppercase tracking-wide text-gray-500">
                                                        Copertina non disponibile
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <p className="text-sm font-medium text-gray-100 transition group-hover:text-purple-200">
                                                        {game.name}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-xl font-semibold text-purple-100">Ultime recensioni</h3>
                            {profile.recent_reviews.length === 0 ? (
                                <div className="rounded-2xl border border-purple-500/10 bg-gray-900/70 p-10 text-center text-sm text-gray-400">
                                    Nessuna recensione disponibile.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {profile.recent_reviews.map((review) => (
                                        <article
                                            key={review.id}
                                            className="rounded-2xl border border-purple-500/10 bg-gray-900/80 p-6 shadow-[0_30px_60px_-40px_rgba(168,85,247,0.4)] transition hover:border-purple-400/30"
                                        >
                                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <p className="text-lg font-semibold text-gray-100">{review.game.name}</p>
                                                    <p className="text-sm text-gray-500">{review.rating}/10</p>
                                                </div>
                                                <div className="flex gap-0.5 text-base">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            {review.body && (
                                                <p className="mt-4 text-sm leading-relaxed text-gray-300">{review.body}</p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile