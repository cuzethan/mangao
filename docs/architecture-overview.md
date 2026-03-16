## Architecture overview

Mangao is built as a small but realistic production-style system, with a modern SPA frontend and a separate backend API.

### Components

- **Frontend (Vercel)**  
  - React-based single-page application.  
  - Deployed on Vercel.  
  - Handles UI, routing, and calling the backend API via `fetch`/XHR with `credentials: true`.

- **Backend API (Railway)**  
  - Node.js + Express server.  
  - Exposes REST endpoints under routes such as `/api/auth`, `/api/mangas`, and `/api/test`.  
  - Implements authentication, authorization, validation, and business logic.

- **Database (PostgreSQL)**  
  - Stores users, manga metadata, and user–manga relationships.  
  - Holds refresh tokens in a dedicated table for secure session continuation.

- **Scheduled jobs (cron)**  
  - Cron tasks periodically pull manga updates from external APIs.  
  - Keep stored manga information fresh so users see current chapter data.

### Request and data flow

At a high level:

1. **User opens the site**  
   - Browser loads the SPA from Vercel.
2. **Authentication**  
   - User signs up or logs in via the backend’s `/api/auth` endpoints.  
   - Backend issues `HttpOnly` cookies (access token, refresh token, CSRF token) and returns the CSRF token in the response body.  
   - Frontend stores the CSRF token (e.g. in memory) for use in the `x-csrf-token` header.
3. **Authenticated API calls**  
   - When the user interacts with their manga list, the SPA calls the Railway API with `fetch`/XHR, sending:  
     - `withCredentials: true` so cookies are included.  
     - `x-csrf-token` header containing the CSRF token.  
   - The backend’s middleware validates both the CSRF token and the access token before executing any sensitive operation.
4. **Database access**  
   - The backend reads or writes the relevant rows in PostgreSQL (users, mangas, user_manga_ref, refresh_tokens).  
   - The response is returned to the SPA and rendered to the user.

The flow can be summarized as:

```mermaid
flowchart LR
  user[User in browser] --> frontend[Vercel frontend (SPA)]
  frontend -->|"XHR/fetch with credentials + x-csrf-token"| backend[Railway backend API]
  backend --> db[PostgreSQL database]
  backend --> frontend
```

### Future improvements: reverse proxy ready

The current design keeps frontend and backend on separate domains, which is a common deployment pattern for small projects using Vercel and Railway. In the future, this setup can be placed behind a **reverse proxy** or edge layer so that:

- Both the frontend and backend appear under a single primary domain (for example, `/` and `/api` on the same host).  
- Cookie and CORS configuration can be simplified even further, while keeping the same authentication and CSRF logic.

The existing separation of concerns (SPA, API, database, cron) makes this kind of evolution straightforward without major code changes.

