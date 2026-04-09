import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const STATUS_OPTIONS = ['playing', 'completed', 'abandoned', 'wishlist']

const normalizeCoverUrl = (url) => {
    if (!url) return null
    if (url.startsWith('//')) return `https:${url}`
    return url
}

const toIsoDate = (unixSeconds) => {
    if (!unixSeconds) return null
    const ms = Number(unixSeconds) * 1000
    if (Number.isNaN(ms)) return null
    return new Date(ms).toISOString().slice(0, 10)
}

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1)

function GameShow({ game: propGame }) {
    const { slug } = useParams()
    const location = useLocation()
    const { token } = useAuth()

    // Games coming from the Collection page carry the DB shape (with `rawg_id`)
    // and are missing IGDB-only fields like summary/platforms/genres. In that
    // case we skip using them as initial render data so the page waits for the
    // IGDB fetch instead of flashing an incomplete layout.
    const stateGame = propGame ?? location.state?.game ?? null
    const stateGameHasIgdbFields = stateGame && !('rawg_id' in stateGame)

    const [status, setStatus] = useState('playing')
    const [submitting, setSubmitting] = useState(false)
    const [feedback, setFeedback] = useState(null)
    const [gameDetails, setGameDetails] = useState(stateGameHasIgdbFields ? stateGame : null)
    const [collectionEntry, setCollectionEntry] = useState(null)
    const [loadingDetails, setLoadingDetails] = useState(!stateGameHasIgdbFields)

    // Always refresh IGDB data so sections like description/platforms/genres are
    // populated even when navigating from Collection (where only DB columns exist).
    useEffect(() => {
        let cancelled = false

        const fetchDetails = async () => {
            setLoadingDetails(true)
            try {
                const response = await api.get(`/games/${slug}`)
                if (!cancelled) {
                    setGameDetails((prev) => ({ ...(prev ?? {}), ...response.data }))
                }
            } catch (err) {
                console.error(err)
            } finally {
                if (!cancelled) setLoadingDetails(false)
            }
        }

        fetchDetails()
        return () => {
            cancelled = true
        }
    }, [slug])

    // Check whether this game is already in the user's collection so we can
    // show a status-change UI instead of the add-to-collection form.
    useEffect(() => {
        if (!token) {
            setCollectionEntry(null)
            return
        }

        let cancelled = false

        const fetchCollection = async () => {
            try {
                const response = await api.get('/collection')
                if (cancelled) return

                const match = response.data.find((item) => item.slug === slug)
                if (match) {
                    const pivotStatus = match.status ?? match.pivot?.status ?? 'playing'
                    setCollectionEntry(match)
                    setStatus(pivotStatus)
                } else {
                    setCollectionEntry(null)
                }
            } catch (err) {
                console.error(err)
            }
        }

        fetchCollection()
        return () => {
            cancelled = true
        }
    }, [slug, token])

    const game = gameDetails

    const addToCollection = async (statusOverride) => {
        if (!game) return
        if (!token) {
            setFeedback({ type: 'error', message: 'Devi effettuare il login per salvare un gioco.' })
            return
        }

        setSubmitting(true)
        setFeedback(null)

        try {
            const response = await api.post('/collection', {
                rawg_id: game.rawg_id ?? game.id,
                name: game.name,
                slug: game.slug ?? slug,
                cover_image: normalizeCoverUrl(game.cover_image ?? game.cover_image_url),
                released: game.released ?? toIsoDate(game.first_release_date),
                status: statusOverride ?? status,
            })

            const savedGame = response.data?.game
            if (savedGame) {
                setCollectionEntry({
                    ...savedGame,
                    status: statusOverride ?? status,
                })
                setStatus(statusOverride ?? status)
            }

            setFeedback({
                type: 'success',
                message: statusOverride === 'wishlist'
                    ? 'Gioco aggiunto alla wishlist!'
                    : 'Gioco aggiunto alla collezione!',
            })
        } catch (err) {
            const message = err?.response?.status === 409
                ? 'Questo gioco è già nella tua collezione.'
                : err?.response?.data?.message ?? 'Impossibile salvare il gioco. Riprova.'
            setFeedback({ type: 'error', message })
        } finally {
            setSubmitting(false)
        }
    }

    const updateStatus = async (newStatus) => {
        if (!collectionEntry) return

        setSubmitting(true)
        setFeedback(null)

        try {
            await api.put(`/collection/${collectionEntry.id}`, { status: newStatus })
            setCollectionEntry({ ...collectionEntry, status: newStatus })
            setStatus(newStatus)
            setFeedback({ type: 'success', message: `Stato aggiornato a "${capitalize(newStatus)}".` })
        } catch (err) {
            const message = err?.response?.data?.message ?? 'Impossibile aggiornare lo stato. Riprova.'
            setFeedback({ type: 'error', message })
        } finally {
            setSubmitting(false)
        }
    }

    const removeFromCollection = async () => {
        if (!collectionEntry) return

        setSubmitting(true)
        setFeedback(null)

        try {
            await api.delete(`/collection/${collectionEntry.id}`)
            setCollectionEntry(null)
            setStatus('playing')
            setFeedback({ type: 'success', message: 'Gioco rimosso dalla collezione.' })
        } catch (err) {
            const message = err?.response?.data?.message ?? 'Impossibile rimuovere il gioco. Riprova.'
            setFeedback({ type: 'error', message })
        } finally {
            setSubmitting(false)
        }
    }

    const releaseDate = useMemo(() => {
        const formatOptions = { day: '2-digit', month: 'long', year: 'numeric' }

        if (game?.first_release_date) {
            const ms = Number(game.first_release_date) * 1000
            if (!Number.isNaN(ms)) {
                return new Date(ms).toLocaleDateString('it-IT', formatOptions)
            }
        }

        if (game?.released) {
            const parsed = new Date(game.released)
            if (!Number.isNaN(parsed.getTime())) {
                return parsed.toLocaleDateString('it-IT', formatOptions)
            }
        }

        return 'Data non disponibile'
    }, [game?.first_release_date, game?.released])

    if (!game) {
        if (loadingDetails) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
                    <p className="text-sm text-purple-200">Caricamento...</p>
                </div>
            )
        }

        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
                <div className="max-w-lg rounded-3xl border border-purple-500/30 bg-gray-900/80 p-10 text-center shadow-[0_30px_120px_-40px_rgba(168,85,247,0.45)] backdrop-blur">
                    <h1 className="text-2xl font-semibold text-purple-200">Game non trovato</h1>
                    <p className="mt-4 text-sm text-gray-400">
                        Nessun dato disponibile per lo slug <span className="text-purple-300">{slug}</span>. Torna indietro e seleziona un titolo dalla tua ricerca.
                    </p>
                </div>
            </div>
        )
    }

    const coverImage = game.cover_image ?? game.cover_image_url ?? ''

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            <div className="relative isolate overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_60%)]" />
                <div className="absolute inset-0 bg-linear-to-br from-gray-950 via-gray-950/80 to-gray-900/60" />

                <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-start">
                    <div className="relative mx-auto w-full max-w-sm shrink-0 overflow-hidden rounded-3xl border border-purple-500/20 shadow-[0_40px_120px_-50px_rgba(168,85,247,0.65)]">
                        {coverImage ? (
                            <img src={coverImage} alt={game.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full min-h-[480px] w-full items-center justify-center bg-gray-900 text-sm uppercase tracking-[0.3em] text-gray-500">
                                Copertina non disponibile
                            </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                    </div>

                    <div className="flex-1 space-y-10">
                        <header className="space-y-4">
                            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-purple-200">
                                {slug}
                            </span>
                            <div>
                                <h1 className="text-4xl font-semibold tracking-wide text-purple-100 lg:text-5xl">{game.name}</h1>
                                <p className="mt-3 text-sm text-gray-400">Data di uscita: {releaseDate}</p>
                            </div>
                        </header>

                        {game.summary && (
                            <section className="space-y-3">
                                <h2 className="text-lg font-semibold text-purple-100">Descrizione</h2>
                                <p className="text-sm leading-relaxed text-gray-300">
                                    {game.summary}
                                </p>
                            </section>
                        )}

                        {Array.isArray(game.platforms) && game.platforms.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-lg font-semibold text-purple-100">Piattaforme disponibili</h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {game.platforms.map((platform) => (
                                        <div
                                            key={platform.id ?? platform.name}
                                            className="flex items-center gap-3 rounded-2xl border border-purple-500/10 bg-gray-900/60 px-4 py-3 transition hover:border-purple-400/30 hover:bg-gray-900/80"
                                        >
                                            {platform.logo_url ? (
                                                <img
                                                    src={platform.logo_url}
                                                    alt={platform.name}
                                                    className="h-10 w-10 shrink-0 rounded-full bg-gray-950 object-contain p-1"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-950 text-xs font-semibold uppercase text-gray-500">
                                                    {platform.name?.slice(0, 3) ?? '?'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-200">{platform.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {Array.isArray(game.genres) && game.genres.length > 0 && (
                            <section className="space-y-3">
                                <h2 className="text-lg font-semibold text-purple-100">Generi</h2>
                                <div className="flex flex-wrap gap-2">
                                    {game.genres.map((genre) => (
                                        <span
                                            key={genre}
                                            className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-200"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="rounded-2xl border border-purple-500/20 bg-gray-900/70 p-6 shadow-[0_35px_80px_-45px_rgba(168,85,247,0.45)]">
                            {collectionEntry ? (
                                <>
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h2 className="text-lg font-semibold text-purple-100">Già nella tua collezione</h2>
                                        <span className="inline-flex items-center rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-200">
                                            {capitalize(collectionEntry.status ?? collectionEntry.pivot?.status ?? status)}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-400">
                                        Aggiorna lo stato per riflettere i tuoi progressi oppure rimuovi il gioco dalla libreria.
                                    </p>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault()
                                            updateStatus(status)
                                        }}
                                        className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center"
                                    >
                                        <div className="relative w-full sm:max-w-xs">
                                            <select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                disabled={submitting}
                                                className="w-full appearance-none rounded-xl border border-purple-500/20 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-100 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 disabled:opacity-60"
                                            >
                                                {STATUS_OPTIONS.map((option) => (
                                                    <option key={option} value={option}>
                                                        {capitalize(option)}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting || status === (collectionEntry.status ?? collectionEntry.pivot?.status)}
                                            className="w-full rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-purple-500 hover:to-fuchsia-500 hover:-translate-y-0.5 hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                                        >
                                            {submitting ? 'Aggiornamento...' : 'Aggiorna stato'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={removeFromCollection}
                                            disabled={submitting}
                                            className="w-full rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-200 transition hover:border-red-400 hover:bg-red-500/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                                        >
                                            Rimuovi
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-lg font-semibold text-purple-100">Aggiungi alla tua collezione</h2>
                                    <p className="mt-2 text-sm text-gray-400">
                                        Scegli uno stato per tracciare i progressi di questo titolo nella tua libreria.
                                    </p>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault()
                                            addToCollection()
                                        }}
                                        className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center"
                                    >
                                        <div className="relative w-full sm:max-w-xs">
                                            <select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                disabled={submitting}
                                                className="w-full appearance-none rounded-xl border border-purple-500/20 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-100 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 disabled:opacity-60"
                                            >
                                                {STATUS_OPTIONS.map((option) => (
                                                    <option key={option} value={option}>
                                                        {capitalize(option)}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-purple-500 hover:to-fuchsia-500 hover:-translate-y-0.5 hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                                        >
                                            {submitting ? 'Salvataggio...' : 'Aggiungi alla collezione'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => addToCollection('wishlist')}
                                            disabled={submitting}
                                            className="w-full rounded-xl border border-purple-500/40 bg-purple-500/10 px-6 py-3 text-sm font-semibold text-purple-100 transition hover:border-purple-400 hover:bg-purple-500/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                                        >
                                            Aggiungi alla Wishlist
                                        </button>
                                    </form>
                                </>
                            )}
                            {feedback && (
                                <p
                                    className={`mt-4 text-sm ${
                                        feedback.type === 'success'
                                            ? 'text-emerald-300'
                                            : 'text-red-300'
                                    }`}
                                >
                                    {feedback.message}
                                </p>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameShow
