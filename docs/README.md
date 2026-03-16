## Mangao – Project Overview

Mangao is a full‑stack web app for tracking manga reading progress. Users can add series, see the latest chapter information, and keep their personal list up to date.

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

