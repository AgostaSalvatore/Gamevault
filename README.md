# GameVault

**IT** — Piattaforma sociale per la gestione di collezioni di videogiochi.  
**EN** — A social platform for managing personal video game collections.

---

## 🇮🇹 Italiano

### Descrizione

GameVault è un'applicazione full-stack che permette agli utenti di gestire la propria collezione di videogiochi. Gli utenti possono cercare giochi tramite l'API IGDB, aggiungerli alla propria collezione con uno stato (in corso, completato, abbandonato, wishlist), scrivere recensioni e visualizzare le statistiche del proprio profilo.

### Stack Tecnologico

**Backend**
- PHP 8.5 / Laravel 13
- MySQL
- Laravel Sanctum (autenticazione API token)
- IGDB API (database videogiochi)
- Guzzle HTTP Client

**Frontend**
- React 19 + Vite
- Tailwind CSS
- Axios
- React Router DOM

### Funzionalità

- Registrazione e autenticazione utente con token Bearer
- Ricerca giochi in tempo reale tramite IGDB
- Gestione collezione personale con stati: `playing`, `completed`, `abandoned`, `wishlist`
- Scrittura e visualizzazione recensioni con rating 1-10
- Pagina profilo con statistiche: rating medio, giochi per stato, wishlist, ultime recensioni
- Pagina dettaglio gioco con copertina, descrizione, piattaforme e generi
- UI dark gaming theme con accenti viola/purple

### API Endpoints

| Metodo | Endpoint | Auth | Descrizione |
|--------|----------|------|-------------|
| POST | `/api/register` | ❌ | Registrazione utente |
| POST | `/api/login` | ❌ | Login utente |
| POST | `/api/logout` | ✅ | Logout utente |
| GET | `/api/games/search?query=` | ❌ | Ricerca giochi IGDB |
| POST | `/api/collection` | ✅ | Aggiunge gioco alla collezione |
| GET | `/api/collection` | ✅ | Lista collezione utente |
| PUT | `/api/collection/{gameId}` | ✅ | Aggiorna stato gioco |
| DELETE | `/api/collection/{gameId}` | ✅ | Rimuove gioco dalla collezione |
| POST | `/api/games/{gameId}/reviews` | ✅ | Crea recensione |
| GET | `/api/games/{gameId}/reviews` | ✅ | Lista recensioni gioco |
| DELETE | `/api/games/{gameId}/reviews/{reviewId}` | ✅ | Cancella recensione |
| GET | `/api/profile/{userId}` | ✅ | Profilo utente con statistiche |

---

## 🇬🇧 English

### Description

GameVault is a full-stack application that allows users to manage their personal video game collection. Users can search for games through the IGDB API, add them to their collection with a status (playing, completed, abandoned, wishlist), write reviews, and view their profile statistics.

### Tech Stack

**Backend**
- PHP 8.5 / Laravel 13
- MySQL
- Laravel Sanctum (API token authentication)
- IGDB API (video game database)
- Guzzle HTTP Client

**Frontend**
- React 19 + Vite
- Tailwind CSS
- Axios
- React Router DOM

### Features

- User registration and authentication with Bearer token
- Real-time game search via IGDB
- Personal collection management with statuses: `playing`, `completed`, `abandoned`, `wishlist`
- Writing and viewing reviews with 1-10 rating
- Profile page with statistics: average rating, games by status, wishlist, recent reviews
- Game detail page with cover, description, platforms and genres
- Dark gaming UI theme with purple accents

### Project Structure

```
Gamevault/
├── backend/                  # Laravel 13 REST API
│   ├── app/
│   │   ├── Http/Controllers/ # Auth, Collection, Game, Profile, Review
│   │   ├── Models/           # User, Game, Review
│   │   └── Services/         # IgdbService (IGDB API integration)
│   └── routes/
│       └── api.php           # API routes
└── frontend/                 # React + Vite SPA
    └── src/
        ├── components/       # Navbar, ProtectedRoute
        ├── context/          # AuthContext (global auth state)
        ├── pages/            # Home, Login, Register, Collection, Profile, GameShow
        └── services/         # Axios instance with auth interceptor
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | ❌ | User registration |
| POST | `/api/login` | ❌ | User login |
| POST | `/api/logout` | ✅ | User logout |
| GET | `/api/games/search?query=` | ❌ | Search games via IGDB |
| POST | `/api/collection` | ✅ | Add game to collection |
| GET | `/api/collection` | ✅ | Get user collection |
| PUT | `/api/collection/{gameId}` | ✅ | Update game status |
| DELETE | `/api/collection/{gameId}` | ✅ | Remove game from collection |
| POST | `/api/games/{gameId}/reviews` | ✅ | Create review |
| GET | `/api/games/{gameId}/reviews` | ✅ | Get game reviews |
| DELETE | `/api/games/{gameId}/reviews/{reviewId}` | ✅ | Delete review |
| GET | `/api/profile/{userId}` | ✅ | User profile with statistics |


## Author

**Salvatore Agosta** — [github.com/AgostaSalvatore](https://github.com/AgostaSalvatore)