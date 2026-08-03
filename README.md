# FRT Website

A modern website for the Formula Racing Team (FRT) to publish news, events, galleries, cars, publications, sponsors, and recruitment information. The site includes a CMS-backed content model and a public-facing Next.js application.

## Tech Stack

<p>
  <a href="https://nextjs.org/" target="_blank"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white"></a>
  <a href="https://react.dev/" target="_blank"><img alt="React" src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB"></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white"></a>
  <a href="https://tailwindcss.com/" target="_blank"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white"></a>
  <a href="https://payloadcms.com/" target="_blank"><img alt="Payload CMS" src="https://img.shields.io/badge/Payload_CMS-000000?logo=payloadcms&logoColor=white"></a>
  <a href="https://www.postgresql.org/" target="_blank"><img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white"></a>
  <a href="https://fullcalendar.io/" target="_blank"><img alt="FullCalendar" src="https://img.shields.io/badge/FullCalendar-3A3A3A?logoColor=white"></a>
  <a href="https://lucide.dev/" target="_blank"><img alt="Lucide" src="https://img.shields.io/badge/Lucide-18181B?logo=lucide&logoColor=white"></a>
  <a href="https://eslint.org/" target="_blank"><img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white"></a>
  <a href="https://www.docker.com/" target="_blank"><img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white"></a>
</p>

Technologies used: Next.js (App Router) with React 19, TypeScript, Tailwind CSS 4, Payload CMS 3, PostgreSQL, FullCalendar, Lucide icons, ESLint, and Docker/Compose.

## Project Structure

- `src/app/` — Public-facing Next.js routes (App Router)
- `src/collections/` — Payload CMS collections (Articles, Events, Cars, Gallery, etc.)
- `src/(payload)` — Payload admin integration
- `src/components/` — UI components (cards, navbar, calendar, etc.)
- `public/` — Static assets
- `migrations/` — Database migrations (if/when used)

## Prerequisites

- Node.js 18+ (Node 20 LTS recommended)
- Yarn 1.22+
- Docker & Docker Compose

## Environment Variables

Create a `.env` file in the project root. Minimum required:

- `DATABASE_URI` — PostgreSQL connection string (e.g. `postgres://user:pass@localhost:5432/frt`)
- `PAYLOAD_SECRET` — Random string used by Payload for session/signing

Optional (only if you configure corresponding integrations):

- S3-compatible storage: `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_ENDPOINT`
- Social APIs: `FACEBOOK_*`, `INSTAGRAM_*`, `TWITTER_*`, `YOUTUBE_*`

Never commit secrets to version control.

## Run Locally

You can run the project either fully in Docker (recommended for parity) or run the app locally with Postgres in Docker.

### Option A — Everything with Docker Compose (quick start)

This will start Postgres and the app container on port 3000.

```bash
# Build and start services in the background
docker compose up -d --build

# View logs (optional)
docker compose logs -f app
```

Then open:
- App: http://localhost:3000
- Payload Admin: http://localhost:3000/admin

### Option B — Local app + Dockerized Postgres (developer workflow)

```bash
# 1) Start only the database
docker compose up -d postgres

# 2) Install dependencies
yarn install

# 3) Start Next.js dev server (Turbopack)
yarn dev
```

Open http://localhost:3000. Admin is available at http://localhost:3000/admin.

## Scripts

- `yarn dev` — Run the development server
- `yarn build` — Create an optimized production build
- `yarn start` — Start the production server
- `yarn lint` — Run ESLint

## Karrier oldal

A `/karrier` oldal (korábban „Tagfelvétel", a `/tagfelvetel` útvonal 308-cal ide irányít) mindig elérhető, akkor is, ha éppen nincs nyitott pozíció.

### Tartalomkezelés

- **Karrier csoportok** (`recruitment` kollekció) — csoportonként kép, rendezési szám, leírás, és a pozíciók listája. Egy pozícióhoz megadható:
  - bevezető szöveg (opcionális),
  - tetszőleges számú **szekció** (pl. Feladatok, Szükséges skillek, Miben fejlődhetsz, Előnyök),
  - három **kiemelt tudnivaló**: Csatlakozás, Időráfordítás, Részegység — ezek ikonokkal jelennek meg a leírás alatt,
  - „Nyitott pozíció" jelölőnégyzet: csak a bepipált pozíciók jelennek meg az oldalon.
- **Karrier oldal** globális beállítás (`career-settings`) — az oldal bevezetője, a jelentkezés módja (beépített űrlap vagy külső Google űrlap), és a jelentkezés nyitva/zárva állapota.
- **Jelentkezések** (`job-applications` kollekció) — a beépített űrlapon beérkezett jelentkezések. A kollekció `create` jogosultsága zárt: beküldeni csak a `/api/karrier/jelentkezes` végponton keresztül lehet.

### Jelentkezések kiírása Google Sheets táblázatba

A beépített űrlap minden jelentkezést elment a Payloadba, és ha be van állítva egy táblázat, egy sorral kiegészíti azt is. A táblázat hibája **nem** akadályozza meg a jelentkezés mentését — a státusz a jelentkezés oldalsávjában látszik (Kiírva / Kihagyva / Hiba), és a „Kiírás újra a táblázatba" gombbal bármikor pótolható.

#### Egyszeri beállítás (fejlesztői oldal)

1. A [Google Cloud Console](https://console.cloud.google.com/)-ban hozz létre egy projektet, és engedélyezd benne a **Google Sheets API**-t.
2. **IAM & Admin → Service Accounts → Create service account.** Szerepkör nem kell hozzá.
3. A fióknál **Keys → Add key → Create new key → JSON**, töltsd le a kulcsot.
4. A letöltött JSON-ból két érték kell a `.env`-be:

   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL=<a JSON "client_email" mezője>
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="<a JSON "private_key" mezője, a \n-ekkel együtt>"
   ```

   A privát kulcsot idézőjelek közé tedd, és hagyd benne a `\n` karaktereket — a kód alakítja vissza sortörésekké.

#### Táblázat bekötése (a szerkesztő dolga, kódolás nélkül)

1. Hozz létre egy Google Sheets táblázatot (üresen is jó, a fejlécet mi írjuk bele).
2. **Megosztás → add hozzá a szolgáltatásfiók e-mail címét Szerkesztő jogosultsággal.** A pontos címet az adminban a mező alatt kiírjuk.
3. Payload admin → **Karrier oldal → Jelentkezés → Google táblázat linkje**: illeszd be a táblázat linkjét, és mentsd.

Mentéskor rögtön ellenőrizzük, hogy a táblázat elérhető-e; ha nincs megosztva vagy rossz a link, a mező hibaüzenetet ad. A mező üresen hagyható — ilyenkor a jelentkezések csak az adminba érkeznek.

A kiírt oszlopok sorrendje: `Beküldve, Név, E-mail, Telefon, Egyetem / kar, Szak, Félév, Csoport, Pozíció, Motiváció`.

## Deployment

Docker images are built in GitHub Actions and published to GitHub Container Registry. The VPS only pulls an immutable image, runs the environment-specific Payload migrations, and recreates the application container without building source code.

- Pushes to `staging` deploy automatically to the isolated staging Compose project.
- Production is started manually from the `main` branch and is protected by the GitHub `Production` environment.
- Production deployments create a PostgreSQL backup before migrations.
- Failed application health checks restore the previous application image. Database migrations are never rolled back automatically.

See [docs/deployment.md](docs/deployment.md) for environment setup, required secrets and variables, first deployment, verification, and rollback instructions. The older [preview runbook](docs/preview.md) remains available as a manual fallback.

## What this site includes

- News/Articles, Events calendar, Galleries, Cars, Members, Publications, Sponsors, Association, Support Us, and Contact sections
- CMS-driven content editing with Payload
- Theming and reusable UI components

If you have questions or want to contribute, feel free to open an issue or PR.
