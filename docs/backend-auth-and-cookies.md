## Backend authentication, cookies, and CSRF

This document explains how Mangao’s backend authentication works and why the cookie and CSRF configuration is safe for a modern, cross‑origin setup (Vercel frontend + Railway backend).

### High‑level authentication model

- **Access token (JWT)**  
  - Short‑lived JSON Web Token containing the user ID.  
  - Sent to the browser as an `HttpOnly` cookie named `accessToken`.  
  - Used by the backend to authenticate most API requests.

- **Refresh token (opaque, stored in DB)**  
  - Long‑lived random string stored in a `refresh_tokens` table.  
  - Sent as an `HttpOnly` cookie named `refreshToken`, scoped to `/api/auth/refresh`.  
  - Allows issuing new access tokens without forcing the user to log in again.

- **CSRF token (double‑submit pattern)**  
  - Random token sent as an `HttpOnly` cookie named `csrfToken`.  
  - Also returned in the login/refresh JSON response so the frontend can store it (e.g. in memory) and send it back in a custom header `x-csrf-token` on future requests.

### Cookie configuration and environments

The frontend is deployed on Vercel, and the backend API is on Railway, which means requests from the browser to the API are **cross‑site**. For cookie‑based auth to work in this architecture, the browser must be allowed to send cookies on cross‑site `fetch`/XHR calls.

To achieve this safely:

- **Production (NODE_ENV=production)**  
  - `HttpOnly: true` – JavaScript cannot read or modify auth cookies.  
  - `Secure: true` – cookies are only sent over HTTPS.  
  - `SameSite: 'none'` – allows cookies to be sent on cross‑site API calls from the Vercel frontend to the Railway backend.  
  - `refreshToken` includes `path: '/api/auth/refresh'` so it’s only sent where it’s needed.

- **Local development**  
  - Uses the same code paths, but `Secure` and `SameSite` are relaxed so cookies can be tested over `http://localhost` without browser restrictions.  
  - This makes debugging easier while keeping production configuration strict.

In all environments, cookies are **never exposed to frontend JavaScript** (`HttpOnly`) and are designed to work only over secure channels in production (`Secure`).

### CSRF protection strategy

Because `SameSite: 'none'` allows cookies on cross‑site requests, Mangao does not rely on `SameSite` as the primary CSRF defense. Instead, it uses a combination of:

1. **Double‑submit CSRF token**
   - On login or token refresh, the server:
     - Sets a `csrfToken` `HttpOnly` cookie.
     - Returns the same token value in the JSON body.
   - The frontend stores the CSRF token outside of cookies (for example, in memory or state) and sends it back on each protected request in the `x-csrf-token` header.
   - The backend middleware compares:
     - The `csrfToken` cookie value, and  
     - The `x-csrf-token` header value.  
     If they do not match, the request is rejected.

   This means an attacker’s website can cause the browser to send cookies, but it **cannot know or set the correct CSRF header value**, so the request fails CSRF validation.

2. **CORS with credentials**
   - The Express app uses CORS configured with:
     - A whitelist of allowed origins (including the deployed frontend URL).  
     - `credentials: true`, so browsers may send cookies **only** when the origin is explicitly allowed.
   - Requests from untrusted origins are blocked by the browser and/or the server, even if they try to include cookies.

3. **HTTPS everywhere**
   - Railway and Vercel both serve over HTTPS, which, combined with `Secure` cookies, prevents cookies from being transmitted over insecure connections.

Together, these measures ensure that:

- A **legitimate frontend** can make authenticated API calls with cookies and CSRF headers.  
- A **malicious site** cannot successfully perform CSRF attacks, even though `SameSite` is set to `none`, because it cannot supply the correct CSRF header and is restricted by CORS.

### Why `SameSite: 'none'` is a deliberate choice here

Modern browsers default many cookies to `SameSite=Lax`, which blocks them on most cross‑site requests. That is ideal when the frontend and backend live on the **same site**, but it breaks cookie‑based auth when the frontend and backend are on **different domains**.

In Mangao’s architecture:

- Frontend: Vercel domain  
- Backend: Railway domain  

The browser views these as different sites. With `SameSite=Lax` or `SameSite=Strict`:

- The `accessToken` and `refreshToken` cookies **would not be sent** on the cross‑site API calls initiated by the SPA.  
- Authentication would appear “broken” because the backend would never see the user’s cookies on those XHR/fetch requests.

By using `SameSite: 'none'` **in combination with**:

- `HttpOnly`,  
- `Secure`,  
- Double‑submit CSRF tokens, and  
- CORS with `credentials: true` and a tight origin whitelist,

Mangao follows a modern, well‑understood pattern for cross‑origin SPAs that need cookie‑based authentication, without sacrificing CSRF protection.

