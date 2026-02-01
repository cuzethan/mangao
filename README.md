## IMPORTANT

Make sure to make a .env fine inside home directory

# Contents of .env:

# For the database container
POSTGRES_DB=mangao_db
POSTGRES_USER=mangao_user
POSTGRES_PASSWORD=mangao_password

# For express backend
VITE_BACKEND_PORT=3000
PORT=3000

PGUSER=mangao_user
PGPASSWORD=mangao_password
PGDATABASE=mangao_db
PGHOST=db
PGPORT=5432

ACCESS_TOKEN_SECRET='5c43e3b73deb28c86f899f9908433e79d246203489cc8d674650ff20ce670066920e9d91c14d5664ae71e0e9f319ba90e3e469a5bb88f10f26bdf05167c83742'


## Enter the db from docker desktop exec.

>> psql -U mangao_user -d mangao_db