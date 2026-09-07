# VPS preview környezet

Ez a runbook a `feat/karrier-oldal` ág megrendelői előnézetét indítja el úgy, hogy a preview saját Compose projektet, PostgreSQL volume-ot, media volume-ot, hálózatot és host portot használ.

## Izoláció

| Erőforrás | Production | Preview |
| --- | --- | --- |
| Compose projekt | `frt` | `frt-preview` |
| PostgreSQL volume | `frt_postgres` | `frt-preview_postgres` |
| Media volume | `frt_frt` | `frt-preview_frt` |
| App port | `127.0.0.1:3000` / jelenlegi prod beállítás | `127.0.0.1:3001` |
| Környezeti fájl | `.env` | `.env.preview` |

Az override a Compose `!override` tagjával lecseréli a base fájl `ports` és `env_file` listáit. Ehhez Docker Compose **2.24.4 vagy újabb** szükséges.

> A preview parancsokból soha ne hagyd el a `-p frt-preview` és a két `-f` kapcsolót. A migrációkat kizárólag a `frt-preview` projekt app konténerében futtasd.

## 1. Előkészítés

A preview-nak külön checkoutot vagy worktree-t használj; ne válts feature ágra a production checkoutban.

```bash
cd /srv/frt-preview
git fetch origin
git switch feat/karrier-oldal
git pull --ff-only origin feat/karrier-oldal
docker compose version
```

Másold át a production `.env` fájlt `.env.preview` néven, majd adj neki új `PAYLOAD_SECRET` értéket:

```bash
cp /srv/frt/.env .env.preview
chmod 600 .env.preview
openssl rand -hex 32
```

A generált értéket kézzel írd be a `.env.preview` `PAYLOAD_SECRET` mezőjébe. Ellenőrizd még ezeket:

- a `DATABASE_URI` hostja `postgres` legyen (például `postgres://user:password@postgres:5432/frt`), és ne production IP vagy külső adatbázis-host;
- a `POSTGRES_USER`, `POSTGRES_PASSWORD` és `POSTGRES_DB` egyezzen a `DATABASE_URI` adataival;
- a fájl ne kerüljön Gitbe vagy Docker build contextbe (`.env*` mindkét helyen ignorálva van);
- a Google service account adatai maradhatnak, de az adatbázisban tárolt táblázatlinket később teszt-táblázatra kell átállítani.

Ellenőrizd a konfigurációt anélkül, hogy kiíratnád a secreteket:

```bash
docker compose \
  --env-file .env.preview \
  -p frt-preview \
  -f docker-compose.yml \
  -f docker-compose.preview.yml \
  config --quiet
```

## 2. Preview adatbázis létrehozása és a production tartalom másolása

Először csak a preview PostgreSQL-t indítsd el. Így az app nem kezd el dolgozni az üres adatbázison a mentés visszatöltése előtt.

```bash
docker compose \
  --env-file .env.preview \
  -p frt-preview \
  -f docker-compose.yml \
  -f docker-compose.preview.yml \
  up -d postgres
```

Készíts logikai mentést a production adatbázisról. A következő parancs a production konténer saját env változóit használja, ezért nem kell jelszót vagy adatbázisnevet a shellbe másolni:

```bash
docker compose -p frt -f /srv/frt/docker-compose.yml exec -T postgres \
  sh -c 'pg_dump --no-owner --no-acl -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  > /tmp/frt-prod.sql
```

Töltsd vissza a mentést a még üres preview adatbázisba. Az `ON_ERROR_STOP` miatt az első SQL-hibánál leáll a folyamat.

```bash
docker compose \
  --env-file .env.preview \
  -p frt-preview \
  -f docker-compose.yml \
  -f docker-compose.preview.yml \
  exec -T postgres \
  sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  < /tmp/frt-prod.sql
```

Sikeres visszatöltés után törölhető az ideiglenes SQL-fájl:

```bash
rm /tmp/frt-prod.sql
```

## 3. Build és preview migrációk

Építsd meg a feature ág app image-ét, majd egy egyszer használatos preview app konténerből futtasd a migrációkat. Ez még nem publikál portot.

```bash
docker compose \
  --env-file .env.preview \
  -p frt-preview \
  -f docker-compose.yml \
  -f docker-compose.preview.yml \
  build app

echo y | docker compose \
  --env-file .env.preview \
  -p frt-preview \
  -f docker-compose.yml \
  -f docker-compose.preview.yml \
  run --rm -T app yarn payload:migrate
```

Ez a `frt-preview_postgres` volume adatbázisát módosítja. A production adatbázison nem fut migráció.

Ezután indítsd el a preview appot:

```bash
docker compose \
  --env-file .env.preview \
  -p frt-preview \
  -f docker-compose.yml \
  -f docker-compose.preview.yml \
  up -d app
```

## 4. Feltöltött média másolása

A media a preview saját `frt-preview_frt` volume-jába kerül. A másolást csak az app indulása után végezd el, hogy a célkonténer és a volume már létezzen.

```bash
FRT_PREVIEW_MEDIA_TMP="$(mktemp -d /tmp/frt-preview-media.XXXXXX)"
docker cp frt-app-1:/app/media/. "$FRT_PREVIEW_MEDIA_TMP/"
docker cp "$FRT_PREVIEW_MEDIA_TMP/." frt-preview-app-1:/app/media
rm -rf "$FRT_PREVIEW_MEDIA_TMP"
```

Ha a production Compose projekt- vagy szolgáltatásneve eltér, a tényleges konténernevet a `docker compose -p frt ps` paranccsal keresd meg.

## 5. Ellenőrzés a VPS-en

```bash
docker compose \
  --env-file .env.preview \
  -p frt-preview \
  -f docker-compose.yml \
  -f docker-compose.preview.yml \
  ps

docker compose \
  --env-file .env.preview \
  -p frt-preview \
  -f docker-compose.yml \
  -f docker-compose.preview.yml \
  logs --tail=100 app postgres

docker compose \
  --env-file .env.preview \
  -p frt-preview \
  -f docker-compose.yml \
  -f docker-compose.preview.yml \
  exec -T app yarn payload:migrate-status

curl --fail --head http://127.0.0.1:3001/karrier
docker volume ls --filter name=frt-preview
docker network ls --filter name=frt-preview
```

Elvárt preview volume-ok: `frt-preview_postgres` és `frt-preview_frt`. A `3001` port csak a VPS localhost interfészén hallgat; kívülről kizárólag nginxen keresztül érhető el.

## 6. nginx, basic auth és TLS

Hozd létre a basic auth jelszófájlt (Debian/Ubuntu esetén a `htpasswd` az `apache2-utils` csomagban van):

```bash
sudo apt-get install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd-preview frt-preview
sudo chown root:www-data /etc/nginx/.htpasswd-preview
sudo chmod 640 /etc/nginx/.htpasswd-preview
```

Hozd létre az `/etc/nginx/sites-available/frt-preview` fájlt:

```nginx
server {
  listen 80;
  listen [::]:80;
  server_name preview.frtbme.hu;
  client_max_body_size 20M;

  auth_basic "FRT preview";
  auth_basic_user_file /etc/nginx/.htpasswd-preview;
  add_header X-Robots-Tag "noindex, nofollow" always;

  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;
    proxy_pass_request_headers on;
    proxy_redirect http://127.0.0.1:3001 /;
  }
}
```

Engedélyezd és töltsd újra az nginxet:

```bash
sudo ln -s /etc/nginx/sites-available/frt-preview /etc/nginx/sites-enabled/frt-preview
sudo nginx -t
sudo systemctl reload nginx
```

Miután a `preview.frtbme.hu` DNS A rekordja a VPS-re mutat:

```bash
sudo certbot --nginx -d preview.frtbme.hu
sudo nginx -t
sudo systemctl reload nginx
```

Külső ellenőrzés:

```bash
curl -I https://preview.frtbme.hu
```

A válasznak bejelentkezés nélkül `401 Unauthorized` státuszt és `X-Robots-Tag: noindex, nofollow` fejlécet kell adnia.

## 7. Kötelező alkalmazásszintű ellenőrzések

Mielőtt a linket elküldöd a megrendelőnek:

1. Lépj be a preview Payload adminba a productionból átmásolt felhasználóval.
2. A **Karrier oldal → Jelentkezés → Google táblázat linkje** mezőt állítsd külön teszt-táblázatra, vagy hagyd üresen.
3. Ha teszt-táblázatot használsz, oszd meg a `.env.preview` service account e-mail-címével.
4. Küldj be egy próba jelentkezést, és ellenőrizd a Payload rekordot, valamint a teszt-táblázatot.
5. Ellenőrizd, hogy a basic auth minden publikus és admin útvonal előtt megjelenik.

Az adatbázis-másolat a production admin felhasználóit és a career settings tartalmát is tartalmazza. Az eltérő `PAYLOAD_SECRET` miatt a production session cookie-k nem használhatók a preview-n, de a megszokott felhasználónév/jelszó igen.

## Leállítás és eltávolítás

Ideiglenes leállítás, az adatok megtartásával:

```bash
docker compose \
  --env-file .env.preview \
  -p frt-preview \
  -f docker-compose.yml \
  -f docker-compose.preview.yml \
  stop
```

Konténerek és hálózat eltávolítása, a volume-ok megtartásával:

```bash
docker compose \
  --env-file .env.preview \
  -p frt-preview \
  -f docker-compose.yml \
  -f docker-compose.preview.yml \
  down
```

Csak akkor használd a `down -v` parancsot, ha a preview adatbázisát és feltöltött médiáját is végleg törölni akarod. A `-p frt-preview` ilyenkor különösen fontos.
