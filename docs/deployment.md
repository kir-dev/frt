# GHCR-alapú staging és production deployment

Az alkalmazás Docker image-e GitHub Actionsben épül, majd a GitHub Container Registrybe kerül. A VPS nem buildel forráskódot: az immutable image digestet lehúzza, lefuttatja az adott környezet migrációit, és `--no-build` módban újraindítja az alkalmazást.

## Környezetek

| Beállítás | Staging | Production |
| --- | --- | --- |
| Git ág / indítás | push a `staging` ágra | kézi `workflow_dispatch` a `main` ágról |
| GitHub Environment | `Staging` | `Production` |
| Compose projekt | `frt-preview` | `frt` |
| VPS könyvtár | `/srv/frt-preview` | `/srv/frt` |
| App env fájl | `.env.preview` | `.env` |
| Host health URL | `http://127.0.0.1:3001/api/health` | `http://127.0.0.1:3000/api/health` |
| PostgreSQL és media volume | staging-specifikus | production-specifikus |
| Adatbázis-backup migráció előtt | nem | igen |

A Compose projektnevek külön volume-okat és hálózatokat hoznak létre. A workflow soha ne használja a staging projektnevet production env fájllal vagy fordítva.

## Workflow-k

### Pull request CI

A `.github/workflows/ci.yml` a `main` vagy `staging` célágú pull requesteken futtatja:

1. a függőségek reprodukálható telepítését;
2. az ESLint ellenőrzést;
3. a TypeScript ellenőrzést;
4. a teljes production Docker image buildet, publikálás nélkül.

### Image build és deployment

A `.github/workflows/release.yml` két módon indul:

- `staging` push: automatikus staging build és deployment;
- kézi indítás: kizárólag a `main` ágról engedélyezett production build és deployment.

A workflow Buildxszel a repository `IMAGE_PLATFORM` változójában megadott platformra épít image-et, BuildKit cache-t használ, majd SHA taget, környezeti aliast és immutable digestet publikál a `ghcr.io/kir-dev/frt` package-be. A VPS mindig a digestet kapja, nem a változó `staging` vagy `production` taget. Az alapértelmezett és jelenleg beállított platform `linux/amd64`.

A build job írási, a deploy job csak olvasási package-jogot kap. A staging és production release-ek ugyanazon VPS Docker hitelesítését használhatják, ezért a workflow sorosítja őket.

Ha a VPS ARM64 architektúrájú, az `IMAGE_PLATFORM` repository változót `linux/arm64`-re vagy többplatformos értékre kell módosítani az első release előtt. Ellenőrzés:

```bash
uname -m
```

## GitHub Environments beállítása

A repository **Settings → Environments** oldalán legyen `Staging` és `Production` environment.

Mindkettőben szükségesek ezek a secretek:

| Secret | Tartalom |
| --- | --- |
| `VPS_HOST` | A VPS DNS-neve vagy IP-címe |
| `VPS_USER` | Nem root deploy felhasználó, Docker jogosultsággal |
| `SSH_PRIVATE_KEY` | Külön CI deploy kulcs privát része |
| `SSH_KNOWN_HOSTS` | A VPS ellenőrzött SSH host kulcsa |

Az SSH host kulcs fingerprintjét külön, megbízható csatornán ellenőrizd. A workflow `StrictHostKeyChecking=yes` beállítást használ, ezért ismeretlen host kulcsot nem fogad el.

### Staging változók

| Variable | Javasolt érték |
| --- | --- |
| `DEPLOY_PATH` | `/srv/frt-preview` |
| `COMPOSE_PROJECT` | `frt-preview` |
| `APP_ENV_FILE` | `.env.preview` |
| `HEALTH_URL` | `http://127.0.0.1:3001/api/health` |
| `PUBLIC_URL` | a staging publikus URL-je |

### Production változók

| Variable | Javasolt érték |
| --- | --- |
| `DEPLOY_PATH` | `/srv/frt` |
| `COMPOSE_PROJECT` | `frt` |
| `APP_ENV_FILE` | `.env` |
| `HEALTH_URL` | `http://127.0.0.1:3000/api/health` |
| `PUBLIC_URL` | a production publikus URL-je |

A `Production` environmenthez állíts be required reviewert és csak a `main` ágat engedélyezd deployment branchként. A kézi workflow-indítás mellett ez egy második jóváhagyási kapu.

## VPS egyszeri előkészítése

Előfeltételek:

- Docker Engine és Docker Compose 2.24.4 vagy újabb;
- `curl`;
- egy nem root deploy felhasználó, amely hozzáfér a Docker sockethez;
- a deploy felhasználó SSH publikus kulcsa az `authorized_keys` fájlban;
- környezetenként külön könyvtár, env fájl, adatbázis és media volume.

Könyvtárak:

```bash
sudo install -d -o <deploy-user> -g <deploy-user> /srv/frt /srv/frt-preview
sudo install -d -o <deploy-user> -g <deploy-user> /srv/frt/public/videos /srv/frt-preview/public/videos
```

A production `/srv/frt/.env` és staging `/srv/frt-preview/.env.preview` fájlokat kézzel kell létrehozni, `chmod 600` jogosultsággal. A `DATABASE_URI` hostja mindkét fájlban `postgres` legyen, és a két környezet külön `PAYLOAD_SECRET` értéket használjon.

A workflow minden release-nél feltölti a Compose fájlokat és a `scripts/deploy-image.sh` scriptet, de az env fájlokat, médiát és videókat nem írja felül.

## Deployment sorrend

A remote deploy script:

1. ellenőrzi a kapott image-, projekt-, env- és health paramétereket;
2. eltárolja a jelenlegi app image referenciáját rollbackhez;
3. lehúzza az új GHCR image digestet;
4. elindítja és megvárja a környezet PostgreSQL konténerét;
5. productionben timestampelt custom-format `pg_dump` mentést készít a `backups/` könyvtárba;
6. egyszer használatos új app konténerből lefuttatja a Payload migrációkat;
7. `docker compose up --no-build` paranccsal elindítja az új appot;
8. ellenőrzi a Docker healthchecket és a host `HEALTH_URL` végpontot;
9. siker esetén `.env.deploy` fájlban rögzíti az aktív immutable image referenciát.

A backup fájlok automatikus törlése szándékosan nincs bekapcsolva. Állíts be külön, ellenőrzött retention szabályt, miután a rendelkezésre álló VPS tárhely és a szükséges megőrzési idő ismert.

## Health check

Az `/api/health` a Next.js folyamat mellett egy minimális Payload lekérdezéssel az adatbázis-kapcsolatot is ellenőrzi:

- `200 {"status":"ok"}`: az alkalmazás és az adatbázis elérhető;
- `503 {"status":"unhealthy"}`: a Payload inicializáció vagy az adatbázis-lekérdezés hibázott.

A válasz nem tartalmaz belső hibarészleteket, és `Cache-Control: no-store` fejlécet kap.

## Első staging release

1. Készítsd elő `/srv/frt-preview/.env.preview` fájlt és a staging adatokat a `docs/preview.md` alapján.
2. Állítsd be a `Staging` GitHub environment secretjeit és változóit.
3. Merge-eld a pipeline változásait a `staging` ágba.
4. Kövesd a **Build and deploy** workflow-t.
5. Ellenőrizd:

```bash
cd /srv/frt-preview
docker compose --env-file .env.deploy -p frt-preview \
  -f docker-compose.yml -f docker-compose.staging.yml ps
curl --fail http://127.0.0.1:3001/api/health
```

## Production release

1. A staging release és az alkalmazásszintű smoke tesztek legyenek sikeresek.
2. Merge-eld a kiadandó kódot a `main` ágba.
3. GitHub Actions → **Build and deploy** → **Run workflow**.
4. Branchként kötelezően a `main` ágat válaszd.
5. Hagyd jóvá a `Production` environment deploymentet.
6. Siker után ellenőrizd az alkalmazást és a `backups/` könyvtárban létrejött adatbázismentést.

## Rollback

Ha az új app nem indul el vagy a health check hibázik, a script visszaindítja az előző application image-et. Az új migrációkat nem vonja vissza.

Kézi application rollbackhez írd az előző digestet a `.env.deploy` `FRT_APP_IMAGE` értékébe, majd:

```bash
docker compose --env-file .env.deploy -p <project> \
  -f docker-compose.yml [-f docker-compose.staging.yml] \
  up -d --no-build --pull never --wait app
```

Adatbázis-visszaállítást csak külön jóváhagyással és a mentés ellenőrzése után végezz. Egy hibás application release önmagában nem indokol automatikus production adatbázis-restore-t.

## Manuális fallback

Ha a GitHub Actions átmenetileg nem elérhető, egy már publikált digest a VPS-en kézzel is telepíthető:

```bash
cd /srv/frt-preview
./scripts/deploy-image.sh \
  'ghcr.io/kir-dev/frt@sha256:<digest>' \
  frt-preview \
  .env.preview \
  http://127.0.0.1:3001/api/health \
  false \
  docker-compose.staging.yml
```

Ez sem végez helyi Docker buildet.
