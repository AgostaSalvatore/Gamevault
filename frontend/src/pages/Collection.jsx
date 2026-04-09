import { useState, useEffect, useMemo } from "react"
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

    const statusColors = useMemo(() => ({
        playing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        abandoned: 'bg-red-500/20 text-red-300 border-red-500/30',
        wishlist: 'bg-purple-500/20 text-purple-200 border-purple-500/40',
    }), [])

    return (
        <div className="px-4 py-12">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">
                <header className="text-center">
                    <h1 className="text-4xl font-semibold tracking-wide text-purple-200">La tua raccolta</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Organizza la tua libreria e tieni traccia dei giochi che stai esplorando.
                    </p>
                </header>

                {loading && (
                    <div className="rounded-2xl border border-purple-500/20 bg-gray-900/70 p-6 text-center text-purple-200">
                        Caricamento...
                    </div>
                )}

                {!loading && games.length === 0 && (
                    <div className="rounded-2xl border border-purple-500/10 bg-gray-900/60 p-10 text-center text-sm text-gray-400">
                        Nessun gioco in collezione. Cerca nuovi titoli e aggiungili alla tua libreria!
                    </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {games.map((game) => {
                        const coverImage = game.cover_image ?? game.cover_image_url ?? null
                        const statusClass = statusColors[game.status] ?? 'bg-gray-800 text-gray-300 border-gray-700'

                        return (
                            <div
                                key={game.id}
                                className="group flex flex-col rounded-2xl border border-purple-500/10 bg-gray-900/70 p-4 shadow-[0_30px_60px_-40px_rgba(168,85,247,0.4)] transition hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-purple-500/40"
                            >
                                <div className="relative overflow-hidden rounded-xl">
                                    {coverImage ? (
                                        <img
                                            src={coverImage}
                                            alt={game.name}
                                            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-64 w-full items-center justify-center bg-gray-800 text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Copertina non disponibile
                                        </div>
                                    )}
                                    <span className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition group-hover:-translate-y-0.5 ${statusClass}`}>
                                        {game.status}
                                    </span>
                                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
                                </div>
                                <h2 className="mt-4 text-lg font-semibold text-gray-100 transition group-hover:text-purple-200">
                                    {game.name}
                                </h2>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Collection
