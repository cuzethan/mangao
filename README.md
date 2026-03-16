# WELCOME TO MANGAO

Hello everyone, welcome to this cool project of mine. ^_^

**Mangao** is a manga (japanese-comic) chapter bookmark web app, which includes a live tracking feature (courtesy of the MANGADEX API) to get real time new-chapter updates for your personal list.

This applicaiton has a genuine personal use for me, because initially I kept my manga list in a simple document, and manually having to search each manga title to check for new chapters was starting to piss me off.

This was what my manga list looked like:
> Mercenary Enrollment - Chapter 277
>
> The Player That Can't Level Up - Chapter 221  
>
> 50+ more manga titles....

Building an actual application to remove potentially hours of keystrokes in the long run was really satisfying

### Stack

- **Frontend**: React SPA deployed on Vercel  
- **Backend**: Node.js + Express API deployed on Railway  
- **Database**: PostgreSQL  
- **Scheduling**: Cron jobs to refresh manga metadata on a schedule  
- **Containerization**: Docker + docker-compose for local development and reproducible environments

### Key features

- **User accounts and secure sessions**  
  Users sign up and log in, with short‑lived access tokens and long‑lived refresh tokens stored server‑side.

- **Personal manga list**  
  Add manga, track current chapter, status (reading, completed, etc.), and update entries over time.

- **Automatic manga updates**  
  Background jobs periodically pull updated chapter information so users can quickly see what’s new.

- **Protected API endpoints**  
  Most data‑changing routes are protected by a session‑validation middleware that checks both authentication and CSRF tokens.

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

### Documentation

- For a recruiter-friendly overview of the project and its features, see [`docs/README.md`](docs/README.md).
- **Backend auth, cookies, and CSRF**: see [`docs/backend-auth-and-cookies.md`](docs/backend-auth-and-cookies.md)  
- **Architecture overview**: see [`docs/architecture-overview.md`](docs/architecture-overview.md)


## How to run your own Mangao for fun

1. Git clone this repository into your local folder
2. Create ".env" file inside the main directory, and copy it's contents from the provided ".env.example" file
3. Make sure you have the docker daemon installed
4. Run the following command on the mangao directory
    * docker compose up --build -d
    * **NOTE:** you can remove --build on subsequent calls
5. Run "cd frontend" to get to your frontend folder
6. Run "npm i" and "npm run dev" to turn on the frontend
7. Enjoy your personal website!

**NOTE:** for whatever reason if you want to reset your database, run "docker compose down -v", then rerun "docker compose up -d"

## Enter the db from docker desktop:
1. Open the database link from mangao in the containers tab
2. Click execute
3. Run "psql -U mangao_user -d mangao_db"
4. Now you can make psql queries directly if you just want to mess with it