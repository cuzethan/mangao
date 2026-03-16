# WELCOME TO MANGAO

Hello everyone, welcome to this fun project of mine.

**Mangao** is a manga (japanese-comic) chapter bookmark web application, which includes a tracking feature (courtesy of the MANGADEX API)
to get real time new-chapter updates.

This applicaiton has a genuine personal use for me, because initially I kept my manga list in a simple document,
and manually having to search each manga title to check for new chapters was starting to piss me off.

This was what my manga list looked like:
> Mercenary Enrollment - Chapter 277
>
> The Player That Can't Level Up - Chapter 221  
>
> 50+ more manga titles....

## Project overview and docs

- For a recruiter-friendly overview of the project and its features, see `docs/README.md`.
- For a deep dive into how authentication, cookies, and CSRF protection work (including the `SameSite` setup for Vercel + Railway), see `docs/backend-auth-and-cookies.md`.
- For a high-level architecture diagram and explanation of how the frontend, backend, database, and cron jobs fit together, see `docs/architecture-overview.md`.

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