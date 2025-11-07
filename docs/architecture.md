# Architektura MediCare monorepa

Repozitář MediCare funguje jako monorepo na npm workspaces. Frontend, backend i sdílené balíčky jsou udržované společně, aby sdílely konfiguraci a bylo možné je spouštět z jednoho místa.

## Přehled adresářů
- `apps/backend` – Nest.js API server.
- `apps/frontend` – React + Vite SPA.
- `packages/shared-types` – sdílené TypeScript typy (např. pro DTO nebo odpovědi API).
- `scripts` – pomocné nástroje (`ensure-env`, CLI menu).
- `docs` – dokumentace (česky).

## Backend (Nest.js)
Backend používá modulární architekturu Nest.js. V `AppModule` se nastavuje:
- `ConfigModule` – načítání `.env`.
- `LoggerModule` (nestjs-pino) – strukturované logování pomocí Pino.
- `MongooseModule` – připojení k MongoDB (importuje se pouze pokud je nastaven `MONGO_URI`).
- `HealthModule` – jednoduchý health endpoint.

Bezpečnostní middleware v `main.ts`:
- `helmet` – základní HTTP ochrany.
- `cors` – povolení CORS (default).
- `express-rate-limit` – ochrana před DoS útoky.

Swagger dokumentace je dostupná na `/api-docs`.

### Jak přidat nový modul
1. Vytvoř adresář v `src/` (např. `users`).
2. Vytvoř kontroler, službu, schéma a DTO podle potřeby.
3. Přidej modul do `AppModule` (`imports: [UsersModule]`).
4. Pokud potřebuješ sdílené typy, ulož je do `packages/shared-types` a importuj přes alias `@shared/...`.

### DTO a validace
- Používej `class-validator` a `class-transformer` v DTO třídách.
- Typy, které chceš sdílet s frontendem, exportuj z `packages/shared-types`.

## Frontend (React + Vite)
Frontend je jednoduchá SPA, která volá backend přes `VITE_API_BASE` (nastavitelné v `.env`).
- `src/App.tsx` obsahuje ukázkový fetch na `/health`.
- Vite server běží na portu 5173.

### Jak přidat novou stránku
1. Vytvoř komponentu v `src/`.
2. Přidej router (např. React Router) dle potřeby.
3. Pro sdílené typy importuj `@shared/...`.

## Sdílené aliasy
Alias `@shared/*` je definovaný v `tsconfig.base.json`. Každý workspace dědí konfiguraci a může importovat sdílené typy napříč projektem.

## DevOps & běh
- `npm run dev:all` v kořeni monorepa spustí MongoDB, backend i frontend současně (využívá `npm workspaces`).
- `npm run dev` spustí pouze frontend a backend, pokud už máš MongoDB spuštěnou.
- MongoDB běží lokálně přes `mongod` s daty v `./data/mongodb` (lze změnit přes `MONGO_URI`).
- CI pipeline (`.github/workflows/ci.yml`) spouští lint a testy na branche `dev` a `main`.
