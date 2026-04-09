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
        <div className="px-4 py-12">
            <div className="mx-auto flex max-w-6xl flex-col gap-10">
                <header className="space-y-4 text-center">
                    <h1 className="text-4xl font-semibold tracking-wide text-purple-200">GameVault</h1>
                    <p className="text-base text-gray-400">
                        Cerca nuovi titoli e arricchisci la tua collezione con le ultime scoperte dalla community.
                    </p>
                    <form
                        onSubmit={handleSearch}
                        className="mx-auto flex w-full max-w-2xl items-center gap-3"
                    >
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cerca un gioco..."
                                className="w-full rounded-xl border border-purple-500/20 bg-gray-900/80 px-5 py-3 text-gray-100 placeholder-gray-500 shadow-[0_20px_60px_-30px_rgba(168,85,247,0.45)] outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-purple-500 hover:to-fuchsia-500 hover:-translate-y-0.5 hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Cerca
                        </button>
                    </form>
                </header>

                {loading && (
                    <p className="text-center text-sm text-purple-200">Caricamento...</p>
                )}

                {!loading && games.length === 0 && (
                    <div className="rounded-2xl border border-purple-500/10 bg-gray-900/60 p-8 text-center text-sm text-gray-400">
                        Nessun gioco trovato. Prova una ricerca diversa.
                    </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {games.map((game) => {
                        const coverImage = game.cover_image ?? game.cover_image_url ?? null

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

export default Home