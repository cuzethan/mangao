## Mangao – Project Overview

Mangao is a full‑stack web app for tracking manga reading progress. Users can add series, see the latest chapter information, and keep their personal list up to date.

### Tech stack

- **Frontend**: React deployed on Vercel  
- **Backend**: Node.js + Express API deployed on Railway  
- **Database**: PostgreSQL  
- **Scheduling**: Cron jobs to refresh manga metadata on a schedule  
- **Containerization**: Docker + docker-compose for local development and reproducible environments

### Documentation

- **Backend auth, cookies, and CSRF**: see [`backend-auth-and-cookies.md`](backend-auth-and-cookies.md)  
- **Architecture overview**: see [`architecture-overview.md`](architecture-overview.md)

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
```

