# Karriertartalom átvitele

A `scripts/career-transfer.mjs` kizárólag elkülönített helyi próbához készült.
A `127.0.0.1:55441` címen futó PostgreSQL-konténert használja; a staging
másolatából olvas, és csak a `frt_transfer_candidate` adatbázisba importál.
Éles adatbázist ez a helyi futtató nem fogad el. A Docker-image külön
`scripts/career-transfer-server.mjs` futtatót tartalmaz a szerveres végrehajtáshoz.

## Adatmodell és hatókör

- `recruitment`: meglévő csoportok frissítése explicit staging → production
  összerendeléssel, a production csoportazonosítók megtartásával.
- A csoporton belüli pozíciók és szekciók a staging listáját veszik át;
  a korábbi production pozíciólista nem adódik hozzá automatikusan.
- `career-settings`: minden tartalmi mező és jelentkezési beállítás a stagingből.
- A hivatkozott képfájlok és médiarekordok. Egyező fájlnév, SHA-256 és alt esetén
  meglévő rekordot használ; egyébként tartalomlenyomatot tartalmazó néven tölt fel.
- A jelentkezések, CV-k, felhasználók, más oldaltartalmak és meglévő médiarekordok
  nem módosulnak. Nincs teljes adatbáziscsere vagy SQL-adatdump összeolvasztás.

Az `applicationMode`, `applicationsOpen`, `spreadsheetUrl` és `googleFormUrl`
értékeit is a staging határozza meg, a felhasználó döntése alapján.
A stagingben megadott Google-táblázat lesz az átvett cél; az üres mezők is
felülírják a korábbi célértékeket. Az integráció hitelesítési adatai továbbra
is a célkörnyezet konfigurációjából származnak, az import ezeket nem másolja.

## A próba környezete

Az adatokat és naplókat az ignorált, 700-as jogosultságú `.local-verification/`
könyvtárban tároljuk. Ne commitold, és ne tedd publikus helyre a dumpokat,
exportokat, archívumokat vagy hitelesítési adatokat.

Előfeltétel: a projekt függőségei, Docker, Python 3 és a két ellenőrzött
PostgreSQL 17 dump, valamint a production/staging fájlarchívum.

A jelenlegi helyi konténer neve `frt-career-transfer-db`, image-e
`postgres:17-alpine`, kötete `frt-career-transfer-pg`, portja `127.0.0.1:55441`.
A `.local-verification/postgres.env` helyben generált hitelesítési adatokat
tartalmaz: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.

A három adatbázis szerepe:

| Adatbázis | Szerep |
| --- | --- |
| `frt_transfer_prod` | Production dump változatlan helyreállítása |
| `frt_transfer_staging` | Staging dump helyreállítása, export forrása |
| `frt_transfer_candidate` | Production másolata, migráció és próbaimport célja |

A restore `pg_restore --no-owner --no-acl --exit-on-error --single-transaction`
opciókkal történt, új, üres adatbázisokba. A candidate a helyreállított
production adatbázisból `createdb --template` segítségével készült.

## Futtatás

Mindig a worktree gyökeréből futtasd. A parancsok nem töltik be a projekt
`.env` fájljait: a wrapper csak a helyi PostgreSQL-jelszót és minimális
környezeti változókat ad át. E-mail küldése és külső `fetch` tiltott.

```bash
node scripts/career-transfer.mjs frt_transfer_staging export
node scripts/career-transfer.mjs frt_transfer_candidate migrate
node scripts/career-transfer.mjs frt_transfer_candidate export
```

Ha a dump `dev` migrációjelölőt tartalmaz, a Payload megerősítést kér.
A meglévő próbában a hat hiányzó migráció sikeresen lefutott, a forrásdumpok
változatlanok maradtak. Éles migrációt csak friss mentés és az aktuális
adatbázisséma ellenőrzése után végezz.

A `prepare-career-bundle` csak a hivatkozott képeket és az egyező nevű
production képeket bontja ki. Videókat és CV-ket nem másol. A fájlok
méretét a dumpban tárolt mérettel is összeveti. Meglévő fájlt nem ír felül;
új forráscsomaghoz új próbaterületet használj.

```bash
node scripts/prepare-career-bundle.mjs /abs/staging-files.tar.gz /abs/prod-files.tar.gz
```

A `.local-verification/group-mapping.json` fájl minden forráscsoporthoz egy
rekordot tartalmaz: `sourceID`, `sourceName`, `targetID`, `targetName`.
Hiányzó, ismétlődő vagy név alapján már nem egyező összerendelés hibát okoz.
A mostani konkrét megfeleltetés és változáslista a helyi `rehearsal-report.md`
fájlban és az `import-plan-first.json` tervben szerepel.

```bash
node scripts/career-transfer.mjs frt_transfer_candidate audit audit-before.json
node scripts/career-transfer.mjs frt_transfer_candidate plan
# Az import-plan.json ellenőrzése után, kizárólag a helyi másolaton:
node scripts/career-transfer.mjs frt_transfer_candidate apply
node scripts/career-transfer.mjs frt_transfer_candidate audit audit-after.json
```

A terv SHA-256-tal rögzíti a forráscsomagot, az összerendelést és a célállapotot.
Az apply egy PostgreSQL-tranzakcióban zárolja az érintett táblákat, újraellenőrzi
a tervet, végrehajtja az importot, és összehasonlítja az eredményt a forrással.
Validációs hibánál visszagörget és eltávolítja az újonnan írt képfájlokat.
Bizonytalan COMMIT-válasznál a fájlokat megőrzi, a napló `commit-uncertain`
állapotot kap: ilyen esetben adatbázis-ellenőrzés szükséges újrafuttatás előtt.

Ismételt futtatáshoz készíts új tervet. Változatlan forrás és cél esetén ez
nulla módosítást tartalmaz. A régi, import előtti tervet az apply elutasítja.

```bash
yarn test:career-transfer
node scripts/career-transfer.mjs frt_transfer_candidate verify-guards
```

A guard-próba helyi tesztképet hoz létre, majd szándékosan hibás utolsó
csoporttal teszteli a korábbi módosítások visszagörgetését és a fájltakarítást.
A PostgreSQL sequence számlálója visszagörgetés után is előreléphet;
az adatrekordok és fájlok ellenőrzötten változatlanok maradnak.

## Éles kiadás előtt

1. Ellenőrizni kell, változott-e a staging tartalma vagy a production adatbázis
   a használt snapshotok óta; eltérés esetén friss export és új terv kell.
2. A pozíciólista és a karrierbeállítások staging szerinti átvétele jóváhagyott.
3. Ellenőrizni kell, hogy a production szolgáltatásfiók hozzáfér-e az átvett
   Google-táblázathoz. A tartalmi célértékekről nem szükséges újabb döntés.
4. Productionben az új CV-funkcióhoz csatolni kell az `applicant_cvs` kötetet.
5. Rövid írásszünet alatt friss, összehangolt adatbázis- és fájlmentés kell.
6. A jóváhagyott kódot migrációkkal ki kell adni, majd az alábbi szerveres
   importtal átvinni ugyanazt az ellenőrzött tartalomcsomagot.
7. Magyar/angol oldal, képek, űrlap és az integráció beállításainak ellenőrzése.

A kód kiadása és a tartalom importálása külön művelet. Az importáló nem
indít deployt; adatot kizárólag az explicit `apply` parancs módosít.

## Docker-csomagolás és szerveres futtató

A Docker build a `build:career-transfer` scripttel előre lefordítja az importot.
A `career-transfer-runner` stage tartalmazza a Linuxos függőségeket, a pontos
Payload-konfigurációt, migrációkat és az importot; a teljes alkalmazás `runner`
stage-e erre épül. A szerveren az import nem telepít függőséget és nem fordít.
Az image nem tartalmaz feltöltött médiát, CV-ket, mentéseket vagy exportcsomagot.

```bash
docker build --target career-transfer-runner -t frt-career-transfer:local .
docker build -t frt-app:career-transfer-local .
```

A szerveres futtató két parancsot fogad: `plan` és `apply`. Nem futtat automatikus
migrációt. Hiányzó migráció esetén leáll, mielőtt importtervet vagy adatot írna.
A konfiguráció környezeti változóiból csak az adatbáziskapcsolatot, a Payload
titkot és az alkalmazás címét adja át. Google- és e-mail-hitelesítési adatok
nem jutnak az importfolyamatba; külső `fetch` és e-mail-küldés tiltott.

Minden szerveres terv tartalmazza a környezetet, az alkalmazás originjét, az
adatbázis nevét, hostját, szerepkörét és az elért PostgreSQL-szerver címét.
Az apply újra ellenőrzi ezt az azonosítást, a forráscsomagot, a képfájlokat és
a céladatokat. A helyi próbában készült tervet ezért nem lehet productionben
alkalmazni: ott új, csak olvasást végző `plan` futtatás szükséges.

### Átadandó fájlok

A megerősített exportcsomagot a szerverre másold egy korlátozott jogosultságú
könyvtárba, például `/home/frt/imports/career-20260907` alá:

```text
career-20260907/
  bundle/
    bundle.json
    media/                 # csak a 9 hivatkozott kép
  group-mapping.json
```

Ne másold ide a teljes média- és videóarchívumokat. A csomag kb. 77 MB képet
tartalmaz; a mentések továbbra is külön visszaállítási tartalékok.
Az importtervek és futási naplók ugyanebbe a könyvtárba kerülhetnek.

### Terv készítése a production környezetben

Előfeltétel: az új kód Docker-image-e már ki van adva, a migrációk lefutottak,
a production média- és CV-kötetek csatolva vannak. A használt image-et a
`/home/frt/frt/.env.deploy` rögzíti. A lent megadott könyvtárak a szerveren
ellenőrzött elrendezést használják, nem a régebbi `/srv` példákat.

Először csak az alkalmazás originjét és az adatbázis nevét ellenőrizd,
hitelesítési adatok kiírása nélkül:

```bash
docker exec frt-app-1 node -e '
  const db = new URL(process.env.DATABASE_URI);
  console.log(JSON.stringify({
    origin: new URL(process.env.NEXT_PUBLIC_SERVER_URL).origin,
    database: decodeURIComponent(db.pathname.slice(1))
  }));
'
```

Az alábbi parancsokban az `EXPECTED_ORIGIN` értékét erre az ellenőrzött címre
állítsd. A `frt` adatbázisnévnek szintén egyeznie kell a fenti eredménnyel.
Az írások legyenek szüneteltetve a friss mentéstől az import ellenőrzéséig.

```bash
cd /home/frt/frt
EXPECTED_ORIGIN='https://AZ-ELLENORZOTT-PRODUCTION-DOMAIN'
TRANSFER_DIR=/home/frt/imports/career-20260907

docker compose --env-file .env.deploy -p frt -f docker-compose.yml \
  run --rm -T --no-deps --pull never \
  -v "$TRANSFER_DIR:/transfer" --entrypoint node app \
  scripts/career-transfer-server.mjs plan \
  --environment production --expect-database frt \
  --expect-origin "$EXPECTED_ORIGIN" \
  --bundle /transfer/bundle/bundle.json \
  --mapping /transfer/group-mapping.json \
  --out /transfer/production-plan.json
```

Ellenőrizd a kiírt célt, változásszámokat és a tervet. A staging tartalom a
mérvadó, de váratlan célállapot esetén ne kerüld meg a terv ellenőrzését.

### Az ellenőrzött terv alkalmazása

Az `APPROVED_PLAN_SHA256` változóba az előző parancs által kiírt, ellenőrzött
terv pontos `sha256` értékét másold. Ez a terv JSON-tartalmának lenyomata,
nem a formázott JSON-fájl `sha256sum` eredménye.

```bash
APPROVED_PLAN_SHA256='AZ-ELLENORZOTT-TERV-64-KARAKTERES-LENYOMATA'

docker compose --env-file .env.deploy -p frt -f docker-compose.yml \
  run --rm -T --no-deps --pull never \
  -v "$TRANSFER_DIR:/transfer" --entrypoint node app \
  scripts/career-transfer-server.mjs apply \
  --environment production --expect-database frt \
  --expect-origin "$EXPECTED_ORIGIN" \
  --bundle /transfer/bundle/bundle.json \
  --mapping /transfer/group-mapping.json \
  --plan /transfer/production-plan.json \
  --plan-sha256 "$APPROVED_PLAN_SHA256" \
  --receipt /transfer/production-receipt.json
```

A sikeres napló státusza `committed`. `prepared`, `pending-commit` vagy
`commit-uncertain` státusz esetén előbb ellenőrizni kell az adatbázis aktuális
állapotát és a folyamatot; ne feltételezz automatikus visszagörgetést.
`failed-before-commit` esetén a futtató a commit előtti hibát jelezte.
A futtató nem ír felül meglévő tervet vagy naplót. Új próbához új fájlnév kell.

Siker után új `plan` futtatás külön fájlba nulla csoportmódosítást, nulla új
médiát és változatlan globális beállításokat kell mutasson. Ellenőrizd a
magyar és angol oldalt, az űrlapot és a production szolgáltatásfiók táblázat-
hozzáférését, majd oldd fel az írásszünetet. Az import nem küld tesztjelentkezést.
