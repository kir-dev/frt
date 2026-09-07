# Karrierfejlesztés – helyi ellenőrzés

2026. szeptember 6. Helyi alkalmazás: http://127.0.0.1:3107/karrier

- `yarn build`: sikeres (187 másodperc). Két meglévő, az érintett funkcióktól független lintfigyelmeztetés maradt a `car-section.tsx` és `image-gallery.tsx` fájlokban.
- `yarn tsc --noEmit`: sikeres. Célzott ESLint, `git diff --check`, a telepítési script szintaxisellenőrzése és a staging Compose konfiguráció ellenőrzése sikeres.
- `yarn test:career`: 12/12 teszt sikeres. Kötelező alapmezők, választós mezők, hosszkorlát, hibás PDF és feltöltési méret, JSON/multipart bemenet, fejlécütközés, szinkronhiba és teljes 12 oszlopos RAW export.
- Valódi helyi HTTP-próbák: régi JSON beküldés; dinamikus kötelező kérdés és hamis opció; konfigurációváltozás (409); PDF mentés/letöltés; névtelen fájlhozzáférés (403); hiányzó adminjog és hibás kiállítási URL; zárt/külső jelentkezés; honeypot és kéréskorlát (429).
- Kényszerített adatbázishiba után a feltöltött CV takarítása sikeres. Jelentkezés törlésekor a CV rekordja és fájlja is eltűnik. A konfigurációból törölt kérdés válaszai és eredeti feliratai a korábbi jelentkezésben megmaradnak.
- Látható Chromium-böngésző: 1440 px asztali, 390 px mobil és 420 px magas képernyő; magyar/angol cím és menü; kilenc csoport; GYIK a jelentkezés előtt; pozíció-előtöltés; HU beküldés CV-vel és EN beküldés CV nélkül. A panel és az első csoport felső éle azonos, a GYIK-ugrás a felső menü alá érkezik. Nem volt JavaScript-oldalhiba.
- Adminból új, kötelező, kétnyelvű kérdés létrehozása és mentése sikeres. Egy korábban megnyitott űrlap beküldése jelezte a változást, megőrizte a válaszokat és a CV-t; az új kérdés kitöltése után sikeres volt a beküldés. A jelentkezés az adminban CV-vel és olvasható válaszösszesítővel jelenik meg.
- A buildből indított standalone alkalmazáson az üres GYIK, a zárt/külső jelentkezési mód, a billentyűzetes szakasznavigáció és az újraindítás utáni privát CV-letöltés is sikeresen ellenőrizve.
- A kiállítási gomb új lapon megnyitotta a megadott Google-űrlapot, címe: „BME FRT - Rendezvényen való kiállítási igény”.
- Adatbázis- és CV-mentés visszaállítása külön adatbázisba és könyvtárba sikeres. A CV-hivatkozás és a fájl SHA-256 lenyomata egyezik. A visszaállított adatbázison az új migráció visszavonása és ismételt futtatása sikeres; a régi jelentkezés és a kapcsolati tartalom megmaradt.

A helyi adatbázis `frt_career`, külön Docker-konténerben, az 55439-es porton fut.
A kilenc csoport, a kapcsolati szöveg és a jelentkezések helyi tesztadatok.
A helyi admin adatai a Gitből és a Docker buildből kizárt
`.local-verification/admin.json` fájlban vannak. Az eredeti `.env` változatlan;
a helyi környezet külön `.env.local` beállításokat használ, üres Google-szolgáltatásfiókkal.

A Google Sheets-exportot szimulált API-válaszokkal ellenőriztük, valódi táblázatba
nem írtunk. Élesítéskor a dokumentált publikus URL-beállítás és a tartós privát
CV-kötet szükséges. Az ellenőrzés helyi környezetben történt; push és élesítés nem történt.

## Világos téma kontrasztjavítása

- A karrieroldal külön szemantikus színkészletet használ. Világos módban semleges kártyák, sötét szövegek, jól látható mezőkeretek és piros, fehér feliratú gombok jelennek meg. A korábbi globális színfelülírások nem érintik ezeket az elemeket.
- Látható Chromium: világos magyar 1440/390 px, világos angol 1440 px, sötét magyar 1440 px és sötét angol 390 px. Összesen 38 állapotellenőrzés: alapnézet, nyitott csoport/pozíció, oldalsáv, GYIK, hover, mezőfókusz, hibás és sikeres beküldés. Nem volt vízszintes túlcsordulás vagy JavaScript-oldalhiba.
- A helyi teszttartalom megjelenített szövegeinek legkisebb mért kontrasztja 5,34:1. A normál mezőkeretek kontrasztja a környező kártyán világos módban 4,02:1, sötét módban 4,56:1. A sikerpipa kontrasztja világos módban 6,40:1. Ez a vizsgált tartalomra és állapotokra vonatkozó mérés, nem teljes webhely-audit.
- A beküldési állapotokat szimulált HTTP-válaszokkal ellenőriztük; ez az ellenőrzés nem hozott létre jelentkezéseket. Részletes mérések és képek: `.local-verification/career-contrast-results.json`, `career-light-form.png`, `career-light-success.png` és a témánkénti képernyőképek.
- `yarn tsc --noEmit`, a karrieroldal célzott ESLint-ellenőrzése és `git diff --check`: sikeres. A helyi fejlesztői szerver továbbra is a 3107-es porton fut.
