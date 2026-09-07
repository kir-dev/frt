# Biztonsági frissítés – 2026. szeptember 6.

Ág: `feat/security-updates`, a karrierfejlesztésre építve. Az ellenőrzések helyi környezetben történtek; éles rendszert és Google-táblázatot nem módosítottunk.

## Függőségek

- Next.js 15.5.9 → 16.3.4; React és React DOM 19.2.1 → 19.2.8.
- Payload és minden közvetlen `@payloadcms/*` csomag egységesen 3.88.0. A csomagok verzióját rögzítettük. Az új `@payloadcms/next` peer dependency tartománya nem támogatja a Next.js 15.5 ágat, ezért szükséges a 16-os főverzió.
- A közvetlenül importált `sharp` most explicit, 0.35.4-es függőség. A nem használt közvetlen `image-size` függőséget eltávolítottuk; az új csomaggráfban a sérülékeny `image-size`, `fast-xml-parser` és `tar` csomag sem szerepel.
- A lockfile többi csomagját a megadott verziótartományokon belül frissítettük, köztük a Drizzle ORM-et 0.45.2-re.
- A Drizzle Kit régi `@esbuild-kit/core-utils` függősége esbuild 0.18-at kér. Egy szűk, erre az útvonalra vonatkozó Yarn resolution 0.25.12-re emeli. Ez szándékos kompatibilitási figyelmeztetést okoz telepítéskor; a szinkron/aszinkron TypeScript-fordítást és a Payload migrációgenerálást külön ellenőriztük. Más esbuild-verziót nem ír felül.

## Megmaradó auditjelzés és helyi védelem

Ugyanazzal a `yarn audit --json` ellenőrzéssel, advisory-azonosító szerint összevonva:

| Súlyosság | Frissítés előtt | Frissítés után |
| --- | ---: | ---: |
| Kritikus | 2 | 0 |
| Magas | 71 | 0 |
| Közepes | 46 | 1 |
| Alacsony | 11 | 0 |

Az egyetlen megmaradó jelzés a `GHSA-jg8r-5jh2-v2xj`: a Payload alapértelmezett fiókfeloldási jogosultsága. A 3.88.0-s kiadáshoz sincs publikált javítás. A `Users.access.unlock` ezért minden HTTP-kliens számára tiltja a műveletet. A böngészős integrációs ellenőrzés bejelentkezett és névtelen kérésnél is 403 választ igazolt, miközben a normál adminbejelentkezés továbbra is működött. A csomagszintű audit ettől még közepes hibát jelez, és 4-es kilépési kóddal tér vissza; nem rejtettük el a jelzést. A külön feloldási végpont jelenleg nem használható adminból sem.

A GitHub default branchhez tartozó Dependabot-számláló külön mérés: az csak a módosítások integrálása után változhat.

## Kompatibilitás

- A build továbbra is Webpacket használ (`next build --webpack`), így a Next.js 16 alapértelmezett buildeszköz-váltása nem módosítja a csomagolást.
- A megszűnt `next lint` helyett `eslint .` fut, a Next.js natív flat konfigurációjával. Két új React Compiler-szabály figyelmeztetés marad: a Compiler nincs bekapcsolva, a meglévő komponensek átírása külön feladat. Az összes eddigi lintellenőrzés megmaradt; jelenleg 0 hiba és 9 figyelmeztetés van.
- A Next.js frissítette a TypeScript JSX-beállítását és a generált route-típusok hivatkozásait. A CI és a release típusellenőrzése előtt `next typegen` fut.
- A YouTube-képek engedélyezése a régi `images.domains` helyett HTTPS `remotePatterns` beállítást használ.

## Korábbi eseményséma-hiány javítása

A teljes oldalas böngészőteszt kimutatta, hogy a migrációkból felépített helyi adatbázisból hiányzott az események `slug` és `link_to_picture_from_event_id` oszlopa, és a `location` még kötelező volt. Ezek a mezők/beállítások már a frissítés előtti forráskódban és snapshotokban szerepeltek; nem a Payload-frissítés változtatta meg a sémát.

A `20260906_220000_events_baseline` migráció pótolja az oszlopokat, indexeket és a galériahivatkozást, valamint opcionálissá teszi a helyszínt. A meglévő URL-eket megtartja, a hiányzókat egyedi `esemeny-{id}` értékkel tölti ki, ütközés esetén számozással. Visszavonáskor nem töröl felhasználói adatot. A telepítés során a szokásos migrációs lépés szükséges.

## Ellenőrzés

- Production build, típusellenőrzés, lint és 12/12 automatizált jelentkezési teszt sikeres. A CI típusgenerálása és típusellenőrzése külön, `.env` és korábbi `.next` állományok nélküli könyvtárban is sikeres.
- Látható Chromiumban 13 publikus oldal, adminbejelentkezés és kérdésmentés; pozíció-előtöltés; megváltozott űrlap 409-es kezelése a válaszok és a CV megtartásával; valódi helyi magyar beküldés PDF-fel és angol beküldés PDF nélkül; adminban visszaolvasott válaszok; admin PDF-letöltés és névtelen hozzáférés tiltása. Nem volt JavaScript-oldalhiba. Az ideiglenes kérdést és jelentkezéseket a teszt végén eltávolítottuk.
- Világos/sötét téma, 1440/390 px, HU/EN: 38 kontraszt- és állapotellenőrzés sikeres, vízszintes túlcsordulás nélkül. A vizsgált szövegek legkisebb kontrasztja 5,34:1.
- Mobilmenü, témaváltás, helyszín nélküli tesztesemény létrehozása, naptárbejegyzés és eseményrészletező oldal sikeres; a teszteseményt eltávolítottuk.
- A sikerpipa animációja 440 ms alatt lefut; csökkentett mozgásnál statikusan jelenik meg.
- Az eseménymigrációt a frissítés előtti adatbázis külön másolatán is kétszer lefuttattuk: a meglévő URL és eseményadat megmaradt, az ütköző generált URL egyedi utótagot kapott.
- Az audit- és böngészős bizonyítékok helyileg a Gitből kizárt `.local-verification/` könyvtárban találhatók. A tesztek helyi tesztadatokat használtak; a külső szolgáltatások teljes működése és az éles telepítés nem része ennek az ellenőrzésnek.

## Források

- [Next.js augusztusi biztonsági kiadás](https://nextjs.org/blog/august-2026-security-release)
- [Next.js 16 frissítési útmutató](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Payload fiókfeloldási jogosultság](https://github.com/advisories/GHSA-jg8r-5jh2-v2xj)
- [esbuild fejlesztői szerver](https://github.com/advisories/GHSA-67mh-4wv8-2f99)
