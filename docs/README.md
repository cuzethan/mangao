## Mangao – Project Overview

Mangao is a full‑stack web app for tracking manga reading progress. Users can add series, see the latest chapter information, and keep their personal list up to date.

- **Frontend**: React SPA deployed on Vercel  
- **Backend**: Node.js + Express API deployed on Railway  
- **Database**: PostgreSQL  
- **Scheduling**: Cron jobs to refresh manga metadata on a schedule

### Key features

- **User accounts and secure sessions**  
  Users sign up and log in, with short‑lived access tokens and long‑lived refresh tokens stored server‑side.

- **Personal manga list**  
  Add manga, track current chapter, status (reading, completed, etc.), and update entries over time.

- **Automatic manga updates**  
  Background jobs periodically pull updated chapter information so users can quickly see what’s new.

- **Protected API endpoints**  
  Most data‑changing routes are protected by a session‑validation middleware that checks both authentication and CSRF tokens.

### Documentation

- **Backend auth, cookies, and CSRF**: see `[docs/backend-auth-and-cookies.md](backend-auth-and-cookies.md)`  
- **Architecture overview**: see `[docs/architecture-overview.md](architecture-overview.md)`

### Project structure

```text
mangao/
├─ README.md
├─ docker-compose.yml
├─ docs/
│  ├─ README.md
│  ├─ backend-auth-and-cookies.md
│  └─ architecture-overview.md
├─ backend/
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ sql/
│  └─ src/
├─ frontend/
│  ├─ README.md
│  ├─ package.json
│  ├─ public/
│  └─ src/
└─ node_modules/  (root tooling dependencies)
```

