# Lumen — Premium Website (Next.js + Express + PostgreSQL)

A full-stack starter with a premium, component-based frontend and an
MVC-structured backend.

```
project/
├── frontend/   Next.js 14 (App Router) + React
└── backend/    Node.js + Express (MVC) + PostgreSQL
```

## Pages included
- `/` Home
- `/login`
- `/signup`
- `/contact` (writes to Postgres via the backend)
- `/about`
- `/services`
- `/pricing`
- `/dashboard` (protected — requires login)

## 1. Database setup

1. Create a database:
   ```bash
   createdb premium_website
   ```
2. Run the schema:
   ```bash
   psql -U postgres -d premium_website -f backend/sql/schema.sql
   ```

## 2. Backend setup

```bash
cd backend
cp .env.example .env   # then fill in your Postgres credentials + a JWT secret
npm install
npm run dev             # starts on http://localhost:5000
```

Backend structure (MVC):
- `models/` — SQL queries (User, ContactMessage)
- `controllers/` — request handling / business logic
- `routes/` — Express routers, mounted in `server.js`
- `middleware/` — JWT auth guard + centralized error handler
- `config/db.js` — PostgreSQL connection pool

### API endpoints
| Method | Route              | Description                  |
|--------|---------------------|-------------------------------|
| POST   | /api/auth/signup     | Create an account             |
| POST   | /api/auth/login       | Log in, returns a JWT         |
| GET    | /api/auth/me           | Get current user (protected) |
| POST   | /api/contact           | Submit a contact message      |
| GET    | /api/contact            | List contact messages         |

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev              # starts on http://localhost:3000
```

The frontend reads the API base URL from `NEXT_PUBLIC_API_URL`
(defaults to `http://localhost:4000/api`). To override, create
`frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Design system

- Palette: deep ink-teal ground (`#0A1614`), warm porcelain text (`#F2EFE9`),
  burnished gold accent (`#C9A227`), muted sage (`#7C9885`).
- Type: Fraunces (display serif) + Inter (body) + IBM Plex Mono (labels/data).
- Signature element: a three-ring hairline "arc mark" used across the hero,
  auth pages, and dashboard.

All tokens live in `frontend/app/globals.css` — change them there to re-skin
the whole site.

## 4. Run everything with Docker (recommended for deployment)

No need to install Postgres or Node locally — one command runs the database,
backend, and frontend together:

```bash
docker compose up --build
```

- Frontend → http://localhost:3000
- Backend → http://localhost:4000
- Postgres → localhost:5432 (user: `postgres`, password: `postgres`, db: `premium_website`)

The Postgres container automatically runs `backend/sql/schema.sql` on first
boot (via Docker's `docker-entrypoint-initdb.d` mechanism) — tables are ready
with no manual step.

To stop:
```bash
docker compose down          # stop containers, keep data
docker compose down -v       # stop containers and wipe the database volume
```

**Before deploying for real:** change `JWT_SECRET` and the Postgres password
in `docker-compose.yml` (or better, move them into a `.env` file that
`docker-compose.yml` reads via `env_file:`, and don't commit it).

## Notes

- Auth uses JWT stored in `localStorage` on the client for simplicity. For
  production, consider httpOnly cookies instead.
- Passwords are hashed with bcrypt before storage.
- Extend `models/` and `controllers/` to add more resources — the pattern
  (model → controller → route) stays the same.
